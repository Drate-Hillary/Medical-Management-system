"use client";

import { setAvailabilitySlots } from '@/actions/doctor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useFetch from '@/hooks/use-fetch';
import { format } from 'date-fns';
import { AlertCircle, Clock, Loader2, PlusIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const AvailabilitySetting = ({ slots }) => {
    const [showForm, setShowForm] = useState(false);
    const { loading, data, fn: submitSlots } = useFetch(setAvailabilitySlots);
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            startTime: "",
            endTime: "",
        },
    });

    function createLocalDateFromTime(timeStr) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const now = new Date();
        const date = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hours,
            minutes
        );

        return date;
    }

    const onSubmit = async (data) => {
        if (loading) return;

        const formData = new FormData();

        const startDate = createLocalDateFromTime(data.startTime);
        const endDate = createLocalDateFromTime(data.endTime);

        if (startDate >= endDate) {
            toast.error("End time must be after Start time")
        }

        formData.append("startTime", startDate.toISOString());
        formData.append("endTime", endDate.toISOString());

        await submitSlots(formData);
    }

    useEffect(() => {
        if (data && data?.success) {
            setShowForm(false);
            toast.success("Availability Slots updated successfully")
        }
    }, [data]);

    const formatTimeString = (dateString) => {
        try {
            return format(new Date(dateString), "h:mm a");
        } catch (error) {
            return "Invalid time";
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center">
                    <Clock className="h-5 w-5 mr-4 text-emerald-500" />
                    Availability Settings
                </CardTitle>
                <CardDescription>
                    Set your daily availability for patient appointments.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {!showForm ? (
                    <>
                        <div className="mb-6">
                            <h3 className='text-lg font-medium text-white mb-3'>
                                Current Availability
                            </h3>

                            {slots.length === 0 ? (
                                <p className="text-muted-foreground">
                                    You haven&apos;t set any availability slots yet. Add your
                                    availability to start accepting appointments.
                                </p>
                            ) : (
                                <div>
                                    {slots.map((slot) => {
                                        return (
                                            <div
                                                key={slot.id}
                                                className="flex items-center p-3 rounded-md bg-muted/20 border border-emerald-900/20 "
                                            >
                                                <Clock className='h-5 w-5 text-emerald-500 mr-4' />

                                                <p className='text-white font-medium'>
                                                    {formatTimeString(slot.startTime)} - {" "} {formatTimeString(slot.endTime)}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                        <Button
                            onClick={() => setShowForm(true)}
                            className="w-full bg-emerald-700/85 hover:bg-emerald-700/95 cursor-pointer"
                        >
                            <PlusIcon className="h-6 w-6 mr-2" />
                            Set Availability time
                        </Button>
                    </>
                ) : (
                    <form
                        className="space-y-4 p-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <h3 className="text-xl font-medium text-white mb-2">
                            Set Daily Availablility
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startTime">Start Time</Label>
                                <Input
                                    id="startTime"
                                    type="time"
                                    {...register("startTime", {
                                        required: "Start time is required"
                                    })}
                                    className="bg-background border border-emerald-900/20"
                                />
                                {errors.startTime && (
                                    <p className="text-sm font-medium text-red-500">
                                        {errors.startTime.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endTime">End Time</Label>
                                <Input
                                    id="endTime"
                                    type="time"
                                    {...register("endTime", {
                                        required: "End time is required"
                                    })}
                                    className="bg-background border border-emerald-900/20"
                                />
                                {errors.endTime && (
                                    <p className="text-sm font-medium text-red-500">
                                        {errors.endTime.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowForm(false)}
                                disabled={loading}
                                className="border border-emerald-900/40 cursor-pointer"
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-emerald-800 hover:bg-emerald-900 cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Availability"
                                )}
                            </Button>
                        </div>
                    </form>
                )}

                <div className="mt-6 p-4 bg-muted/10 border border-emerald-900/10 rounded-md">
                    <h4 className="font-medium text-white mb-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-emerald-400" />
                        How Availability Works
                    </h4>
                    <p className="text-muted-foreground text-sm">
                        Setting your daily availability allows patients to book appointments
                        during those hours. The same availability applies to all days. You
                        can update your availability at any time, but existing booked
                        appointments will not be affected.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default AvailabilitySetting