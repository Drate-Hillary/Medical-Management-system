"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function setAvailabilitySlots(formData) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized access");
    }

    try {
        const doctor = await db.user.findUnique({
            where: {
                clerkUserId: userId,
                role: "DOCTOR"
            },
        });

        if (!doctor) {
            throw new Error("Doctor not Found!");
        }

        const startTime = formData.get("startTime");
        const endTime = formData.get("endTime");

        if (!startTime || !endTime) {
            throw new Error("Starting time and End time are required.")
        }

        if (startTime >= endTime) {
            throw new Error("Start time must be before End time")
        }

        const existingSlots = await db.availability.findMany({
            where: {
                doctorId: doctor.id,
            }
        });

        if (existingSlots.length > 0) {
            const slotsWithNoAppointments = existingSlots.filter(
                (slot) => !slot.appointment
            )

            if (slotsWithNoAppointments.length > 0) {
                await db.availability.deleteMany({
                    where: {
                        id: {
                            in: slotsWithNoAppointments.map(
                                (slot) => slot.id
                            ),
                        },
                    },
                });
            }

        }

        const newSlot = await db.availability.create({
            data: {
                doctorId: doctor.id,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                status: "AVAILABLE"
            },
        });

        revalidatePath("/doctor")
        return { success: true, slot: newSlot }

    } catch (error) {
        throw new Error("Failed to set availability: " + error.message);
    }
}

export async function getDoctorAvailability(params) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized access");
    }

    try {
        const doctor = await db.user.findUnique({
            where:{
                clerkUserId: userId,
                role: "DOCTOR"
            },
        });

        if (!doctor) {
            throw new Error("Doctor Not found!");
        }

        const availabilitySlots = await db.availability.findMany({
            where:{
                doctorId: doctor.id
            },
            orderBy:{
                startTime: "asc"
            },
        });

        return { slots: availabilitySlots}
    } catch (error) {
        throw new Error("Failed to fetch availability slots: " + error.message);
    }
}

export async function getDoctorAppointment() {
    return [];
}