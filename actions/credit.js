"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";


const plan_credits = {
    free_user: 0,
    standard: 10,
    premium: 24
};

const appointment_credit_cost = 2;

export async function checkAndAllocateCredit(user) {
    try {
        if (!user) {
            return null;
        }

        if (user.role !== "PATIENT") {
            return user;
        }

        const { has } = await auth();

        const hasBasic = has({ plan: "free_user" })
        const hasStandard = has({ plan: "standard" })
        const hasPremium = has({ plan: "premium" })

        let currentPlan = 0;
        let creditsToAllocate = null

        if (hasPremium) {
            currentPlan = "premium"
            creditsToAllocate = plan_credits.premium
        } else if (hasStandard) {
            currentPlan = "standard"
            creditsToAllocate = plan_credits.standard
        } else if (hasBasic) {
            currentPlan = "free_user"
            creditsToAllocate = plan_credits.free_user
        }

        if (!currentPlan) {
            return user;
        }

        const currentMonth = format(new Date(), "yyyy-MM")

        if (user.transactions.length > 0) {
            const latestTransaction = user.transactions[0]

            const transactionMonth = format(new Date(latestTransaction.createdAt), "yyyy-MM")

            const transactionPlan = latestTransaction.packageId

            if (
                transactionMonth === currentMonth &&
                transactionPlan === currentPlan
            ) {
                return user;
            }
        }

        const updatedUser = await db.$transaction(async (tx) => {
            await tx.creditTransaction.create({
                userId: user.id,
                amount: creditsToAllocate,
                type: "CREDIT_PURCHASE",
                packageId: currentPlan,
            });

            const updatedUser = await tx.user.update({
                where: { id: user.id },
                data: {
                    credit: {
                        increment: creditsToAllocate
                    },
                },
            });

            return updatedUser;
        });

        revalidatePath('/doctors')
        revalidatePath('/appointments')

        return updatedUser;

    } catch (error) {
        console.error(
            "Failed to check and allocate credits",
            error.message
        );
        return null;
    }
}

export async function deductCreditsForAppointment(userId, doctorId) {
    try {
        const user = await db.user.findUnique({
            where: { id: userId },
        });

        const doctor = await db.user.findUnique({
            where: { id: doctorId },
        });

        if (user.credit < appointment_credit_cost) {
            throw new Error("Insufficient credit to book an appointment.")
        }

        if (!doctor) {
            throw new Error("Doctor not found");
        }

        const result = await db.$transaction(async (tx) => {
            await tx.creditTransaction.create({
                data: {
                    user: user.id,
                    amount: -appointment_credit_cost,
                    type: "APPOINTMENT_DEDUCTION",
                    // description: `Credits deducted for appointment with Dr. ${doctor.name}`
                }
            });

            await tx.creditTransaction.create({
                data: {
                    user: doctor.id,
                    amount: appointment_credit_cost,
                    type: "APPOINTMENT_DEDUCTION",
                    // description: `Credits deducted for appointment with Dr. ${doctor.name}`
                }
            });

            const updatedUser = await tx.user.update({
                where: { id: user.id },
                data: {
                    credit: {
                        decrement: appointment_credit_cost,
                    },
                },
            });

            await tx.user.update({
                where: { id: doctor.id },
                data: {
                    credit: {
                        increment: appointment_credit_cost,
                    },
                },
            })

            return updatedUser;
        });

        return { success: true, user: result };

    } catch (error) {
        return { success: false, error: error.message };
    }
}