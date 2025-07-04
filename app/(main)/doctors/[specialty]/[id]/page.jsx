import { getAvailableTimeSlots, getDoctorId } from '@/actions/appointments';
import { redirect } from 'next/navigation';
import React from 'react'
import DoctorProfile from './_components/doctor-profile';

const DoctorProfilePage = async ({ params }) => {
    const { id } = await params;

    try {
        const [doctorData, slotsData] = await Promise.all([
            getDoctorId(id),
            getAvailableTimeSlots(id),
        ]);

        return (
            <div>
                <DoctorProfile
                    doctor={doctorData.doctor}
                    availableDays={slotsData.days || []}
                />
            </div>
        )
    } catch (error) {
        console.error("Error loading doctor profile ", error)
        redirect("/doctors")
    }

}

export default DoctorProfilePage