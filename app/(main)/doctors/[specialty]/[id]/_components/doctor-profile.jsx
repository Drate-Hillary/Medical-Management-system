"use client";

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CalendarFold, ChevronDown, ChevronUp, Clock, FileText, Medal, User2 } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import SlotPicker from './slot-picker';
import AppointmentForm from './appointment-form';
import { useRouter } from 'next/navigation';

const DoctorProfile = ({ doctor, availableDays }) => {
    const [showBooking, setShowBooking] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const router = useRouter();

    const totalSlots = availableDays?.reduce(
        (total, day) => total + day.slots.length, 0
    );

    const toggleBooking = () => {
        setShowBooking(!showBooking);

        if (!showBooking) {
            setTimeout(() => {
                document.getElementById("booking-section")?.scrollIntoView({
                    behavior: "smooth",
                })
            }, 100);
        }
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
    }

    const handleBookngComplete = () => {
        router.push("/appointments");
    }


    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-3'>
            <div className='md:col-span-1'>
                <div className="sticky md:top-24">
                    <Card className="border border-emerald-900/30">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative w-30 h-30 rounded-full overflow-hidden mb-4 bg-emerald-900/30">
                                    {doctor.imageUrl ? (
                                        <Image
                                            src={doctor.imageUrl}
                                            alt={doctor.name}
                                            fill
                                            className='object-cover'
                                        />
                                    ) : (
                                        <div className='w-full h-full flex items-center justify-center'>
                                            <User2 className='h-16 w-16 text-emerald-500' />
                                        </div>
                                    )}
                                </div>

                                <h3 className='text-xl font-bold text-white mb-1'>
                                    Dr. {doctor.name}
                                </h3>

                                <Badge
                                    variant="outline"
                                    className="bg-emerald-900/20 border border-emerald-900/30 text-emerald-500 mb-2"
                                >
                                    {doctor.specialty}
                                </Badge>

                                <div className='flex items-center justify-center mb-2'>
                                    <Medal className='h-4 w-4 text-emerald-500 mr-2' />
                                    <span className='text-muted-foreground'>
                                        {doctor.experience} years of experience
                                    </span>
                                </div>

                                <Button
                                    onClick={toggleBooking}
                                    className="w-full bg-emerald-700 hover:bg-emerald-800 cursor-pointer mt-3"
                                >
                                    {showBooking ? (
                                        <>
                                            Hide Booking
                                            <ChevronUp className='ml-2 h-4 w-4' />
                                        </>
                                    ) : (
                                        <>
                                            Book an Appointment
                                            <ChevronDown className='ml-2 h-4 w-4' />
                                        </>
                                    )}

                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className='md:col-span-2 space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-white">
                            About Dr. {doctor.name}
                        </CardTitle>
                        <CardDescription>
                            {doctor.specialty}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className='space-y-2'>
                            <div className='flex items-center gap-4'>
                                <FileText className='h-5 w-5 text-emerald-500' />
                                <h3 className='text-white font-medium'>Description</h3>
                            </div>
                            <p className='text-muted-foreground whitespace-pre-line text-xs'>
                                {doctor.description}
                            </p>
                        </div>

                        <Separator className="bg-emerald-900/30 mt-2" />

                        <div>
                            <div className='flex items-center gap-4'>
                                <Clock className='h-5 w-5 text-emerald-500' />
                                <h3 className='text-white font-medium'>Availability</h3>
                            </div>
                        </div>
                        {totalSlots > 0 ? (
                            <div className='flex items-center'>
                                <CalendarFold className='h-5 w-5 text-emerald-500 mr-5' />
                                <p className='text-muted-foreground'>
                                    {totalSlots} time slots available for booking over the next four days.
                                </p>
                            </div>
                        ) : (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    No available slots for the next four days. Please check again later.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {showBooking && (
                    <div id='booking-section'>
                        <Card className="border border-emerald-900/20">
                            <CardHeader>
                                <CardTitle className="font-medium text-white">
                                    Book an Appointment
                                </CardTitle>
                                <CardDescription>
                                    Select a time slot and provide details for your consultation.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {totalSlots > 0 ? (
                                    <>
                                        {!selectedSlot && (
                                            <SlotPicker
                                                days={availableDays}
                                                onSelectSlot={handleSlotSelect}
                                            />
                                        )}

                                        {selectedSlot && (
                                            <AppointmentForm
                                                doctorId={doctor.id}
                                                slot={selectedSlot}
                                                onBack={() => setSelectedSlot(null)}
                                                onComplete={handleBookngComplete}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <div className='text-center py-6'>
                                        <CalendarFold className='h-4 w-4 mx-auto text-muted-foreground mb-3' />
                                        <h3 className='text-xl text-white font-medium mb-2'>
                                            No available slots
                                        </h3>
                                        <p className="text-muted-foreground">
                                            This doctor doesn&apos;t have any available appointment
                                            slots for the next 4 days. Please check back later or try
                                            another doctor.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DoctorProfile