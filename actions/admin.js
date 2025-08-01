"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

export async function verifyAdmin() {
    const { userId } = await auth()

    if (!userId) {
        return false;
    }

    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId }
        })

        return user?.role === "ADMIN"
    } catch (error) {
        console.error("Failed to verify admin: ", error)
        return false
    }
}

export async function getPendingDoctors() {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) throw new Error("Unauthorized Access!");

    try {
        const pendingDoctors = await db.user.findMany({
            where: {
                role: "DOCTOR",
                verificationStatus: "PENDING"
            },
            orderBy: {
                createdAt: "desc"
            },

        });

        return { doctors: pendingDoctors }
    } catch (error) {
        throw new Error("Failed to fetch pending doctors")
    }
}

export async function getVerifiedDoctors() {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) throw new Error("Unauthorized Access!");

    try {
        const verifyingDoctors = await db.user.findMany({
            where: {
                role: "DOCTOR",
                verificationStatus: "VERIFIED"
            },
            orderBy: {
                createdAt: "asc"
            },

        });

        return { doctors: verifyingDoctors }
    } catch (error) {
        throw new Error("Failed to fetch verify doctor")
    }
}

export async function updateDoctorStatus(formData) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) throw new Error("Unauthorized Access!");

    const doctorId = formData.get("doctorId");
    const status = formData.get("status");

    if (!doctorId || !["VERIFIED", "REJECTED"].includes(status)) {
        throw new Error("Invalid Input");
    }

    try {
        await db.user.update({
            where: {
                id: doctorId,
            },
            data: {
                verificationStatus: status,
            }
        });

        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to update doctor status ", error);
        throw new Error(`Failed to update doctor status ${error.message}`)
    }
}

export async function updateDoctorActiveStatus(formData) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) throw new Error("Unauthorized Access!");

    const doctorId = formData.get("doctorId");
    const suspend = formData.get("suspend") === "true";

    if (!doctorId) throw new Error("Doctor ID is required?");

    try {
        const status = suspend ? "PENDING" : "VERIFIED";

        await db.user.update({
            where: {
                id: doctorId,
            },
            data: {
                verificationStatus: status,
            }
        });

        revalidatePath("/admin")
        return { success: true }
    } catch (error) {
        throw new Error(`Failed to update Doctor status: ${error.message}`)
    }
}