import { getDoctorAppointment, getDoctorAvailability } from '@/actions/doctor';
import { getCurrentUser } from '@/actions/onboarding'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarFold, Clock } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'
import AvailabilitySetting from './_components/availability-settings';

const DoctorDashboardPage = async () => {
    const user = await getCurrentUser();
    const [appointmentsData, availabilityData] = await Promise.all([
        getDoctorAppointment(),
        getDoctorAvailability(),
    ]);

    if (user?.role !== "DOCTOR") {
        redirect("/onboarding");
    }

    if (user?.verificationStatus !== "VERIFIED") {
        redirect("/onboarding/verification")
    }
    return (
        <div>
            <Tabs
                defaultValue="appointments"
                className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-2"
            >
                <TabsList
                    className='md:col-span-1 bg-muted/30 border h-14 md:h-28 flex sm:flex-row md:flex-col w-full p-2 md:p-1 rounded-md md:space-y-2 sm:space-x-2 md:space-x-0'
                >
                    <TabsTrigger
                        value="appointments"
                        className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full cursor-pointer"
                    >
                        <CalendarFold className='h-4 w-4 mr-2 hidden md:inline' />
                        <span>Appointments</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="availability"
                        className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full cursor-pointer"
                    >
                        <Clock className='h-4 w-4 mr-2 hidden md:inline' />
                        <span>Availability</span>
                    </TabsTrigger>
                </TabsList>

                <div className='md:col-span-3'>
                    <TabsContent value="appointments" className="border border-none p-0">Appointments</TabsContent>
                    <TabsContent value="availability" className="border border-none p-0">
                        <AvailabilitySetting slots={availabilityData.slots || []} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

export default DoctorDashboardPage