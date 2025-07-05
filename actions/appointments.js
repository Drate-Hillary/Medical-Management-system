"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { addDays, addMinutes, endOfDay, format, isBefore } from "date-fns";
import { deductCreditsForAppointment } from "./credit";
import { revalidatePath } from "next/cache";
import { Auth } from "@vonage/auth";
import { Vonage } from "@vonage/server-sdk";

const credentials = new Auth({
    applicationId: process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID,
    privateKey: process.env.VONAGE_PRIVATE_KEY
});

const vonage = new Vonage(credentials, {});

export async function getDoctorId(doctorId) {
    try {
        const doctor = await db.user.findUnique({
            where: {
                id: doctorId,
                role: "DOCTOR",
                verificationStatus: "VERIFIED",
            },
        });

        if (!doctor) {
            throw new Error("Doctor not found");
        }

        return { doctor };
    } catch (error) {
        throw new Error("Failed to fetch doctor details.")
    }
}

export async function getAvailableTimeSlots(doctorId) {
    try {
        const doctor = await db.user.findUnique({
            where: {
                id: doctorId,
                role: "DOCTOR",
                verificationStatus: "VERIFIED",
            },
        });

        if (!doctor) {
            throw new Error("Doctor not found");
        }

        const availability = await db.availability.findFirst({
            where: {
                doctorId: doctor.id,
                status: "AVAILABLE",
            }
        });

        if (!availability) {
            throw new Error("No availabilities are set by the doctor");
        }

        const now = new Date();
        const days = [now, addDays(now, 1), addDays(now, 2), addDays(now, 3)];

        const lastDay = endOfDay(days[3]);

        const existingAppointments = await db.appointment.findMany({
            where: {
                doctorId: doctor.id,
                status: "SCHEDULED",
                startTime: {
                    lte: lastDay
                },
            },
        });

        const avaiableSlotsByDay = {};

        for (const day of days) {
            const dayString = format(day, "yyyy-MM-dd");
            avaiableSlotsByDay[dayString] = [];

            const availabilityStart = new Date(availability.startTime);
            const availabilityEnd = new Date(availability.endTime);

            availabilityStart.setFullYear(
                day.getFullYear(),
                day.getMonth(),
                day.getDate()
            );

            availabilityEnd.setFullYear(
                day.getFullYear(),
                day.getMonth(),
                day.getDate()
            );

            let current = new Date(availabilityStart);
            const end = new Date(availabilityEnd);

            while (isBefore(addMinutes(current, 30), end) || +addMinutes(current, 30) === +end) {
                const next = addMinutes(current, 30);

                if (isBefore(current, now)) {
                    current = next;
                    continue;
                }

                const overlaps = existingAppointments.some((appointment) => {
                    const aStart = new Date(appointment.startTime);
                    const aEnd = new Date(appointment.endTime);

                    return (
                        (current >= aStart && current < aEnd) ||
                        (next > aStart && next <= aEnd) ||
                        (current <= aStart && next >= aEnd)
                    );
                });

                if (!overlaps) {
                    avaiableSlotsByDay[dayString].push({
                        startTime: current.toISOString(),
                        endTime: next.toISOString(),
                        formatted: `${format(current, "h:mm a")} - ${format(next, "h:mm a")}`,
                        day: format(current, "EEEE, MMMM d")
                    })
                }

                current = next;
            }

        }

        const result = Object.entries(avaiableSlotsByDay).map(([date, slots]) => ({
            date,
            displayDate:
                slots.length > 0
                    ? slots[0].day
                    : format(new Date(date), "EEEE, MMMM d"),
            slots
        }));

        return { days: result };
    } catch (error) {
        throw new Error("Failed to fetch available time slots: " + error.message);
    }
}

export async function bookAppointment(formData) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        // Get the patient user
        const patient = await db.user.findUnique({
            where: {
                clerkUserId: userId,
                role: "PATIENT",
            },
        });

        if (!patient) {
            throw new Error("Patient not found");
        }

        // Parse form data
        const doctorId = formData.get("doctorId");
        const startTime = new Date(formData.get("startTime"));
        const endTime = new Date(formData.get("endTime"));
        const patientDescription = formData.get("description") || null;

        if (!doctorId || !startTime || !endTime) {
            throw new Error("Doctor, start time, and end time are required");
        }

        const doctor = await db.user.findUnique({
            where: {
                id: doctorId,
                role: "DOCTOR",
                verificationStatus: "VERIFIED",
            },
        });

        if (!doctor) {
            throw new Error("Doctor not found or not verified");
        }

        // Check if the patient has enough credits (2 credits per appointment)
        if (patient.credits < 2) {
            throw new Error("Insufficient credits to book an appointment");
        }

        // Check if the requested time slot is available
        const overlappingAppointment = await db.appointment.findFirst({
            where: {
                doctorId: doctorId,
                status: "SCHEDULED",
                OR: [
                    {
                        // New appointment starts during an existing appointment
                        startTime: {
                            lte: startTime,
                        },
                        endTime: {
                            gt: startTime,
                        },
                    },
                    {
                        // New appointment ends during an existing appointment
                        startTime: {
                            lt: endTime,
                        },
                        endTime: {
                            gte: endTime,
                        },
                    },
                    {
                        // New appointment completely overlaps an existing appointment
                        startTime: {
                            gte: startTime,
                        },
                        endTime: {
                            lte: endTime,
                        },
                    },
                ],
            },
        });

        if (overlappingAppointment) {
            throw new Error("This time slot is already booked");
        }

        // Create a new Vonage Video API session
        const sessionId = await createVideoSession();

        // Deduct credits from patient and add to doctor
        const { success, error } = await deductCreditsForAppointment(
            patient.id,
            doctor.id
        );

        if (!success) {
            throw new Error(error || "Failed to deduct credits");
        }

        // Create the appointment with the video session ID
        const appointment = await db.appointment.create({
            data: {
                patientId: patient.id,
                doctorId: doctor.id,
                startTime,
                endTime,
                patientDescription,
                status: "SCHEDULED",
                videoSessionId: sessionId, // Store the Vonage session ID
            },
        });

        revalidatePath("/appointments");
        return { success: true, appointment: appointment };
    } catch (error) {
        console.error("Failed to book appointment:", error);
        throw new Error("Failed to book appointment:" + error.message);
    }
}

async function createVideoSession() {
    try {
        const session = await vonage.video.createSession({ mediaMode: "routed" });
        return session.sessionId;
    } catch (error) {
        throw new Error("Failed to create video session " + error.message)
    }
}