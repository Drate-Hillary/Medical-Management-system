"use client";

import { updateDoctorStatus } from '@/actions/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useFetch from '@/hooks/use-fetch';
import { Check, ExternalLink, FileText, Stethoscope, User2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Image from 'next/image';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';

const PendingDoctors = ({ doctors }) => {
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const {
        loading,
        data,
        fn: submitStatusUpdate
    } = useFetch(updateDoctorStatus);

    const handleUpdateStatus = async(doctorId, status)=>{
        if(loading) return;

        const formData = new FormData();
        formData.append("doctorId", doctorId);
        formData.append("status", status);

        await submitStatusUpdate(formData);
    };

    useEffect(()=>{
        if (selectedDoctor && data?.success) {
            toast.success(`Verified Dr. ${selectedDoctor.name} successfully!`)
            handleCloseDialog();
        }
    }, [data]);

    const handleViewDetails = (doctor) => {
        setSelectedDoctor(doctor)
    };

    const handleCloseDialog = () => {
        setSelectedDoctor(null)
    }

    return (
        <div>
            <Card className='bg-muted/20 border border-emerald-900/20'>
                <CardHeader>
                    <CardTitle className='text-white text-2xl font-bold'>
                        Pending Doctor Verification
                    </CardTitle>
                    <CardDescription>
                        Review and Approve Doctor Application
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {
                        doctors.length === 0 ? (
                            <div className='text-center py-8 text-muted-foreground'>
                                No Pending Verification Requests available.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {doctors.map((doctor) => (
                                    <Card
                                        key={doctor.id}
                                        className="bg-background border-emerald-900/20 hover:border-emerald-700/30 transition-all"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-muted/20 rounded-full p-2">
                                                        <Image src={doctor.imageUrl} alt={doctor.name} width={48} height={48} className='rounded-full' />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-white">
                                                            {doctor.name}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {doctor.specialty} • {doctor.experience} years
                                                            experience
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 self-end md:self-auto">
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-amber-900/20 border-amber-900/30 text-amber-400"
                                                    >
                                                        Pending
                                                    </Badge>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleViewDetails(doctor)}
                                                        className="border-emerald-900/30 hover:bg-muted/80"
                                                    >
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )
                    }

                </CardContent>

            </Card>

            {selectedDoctor && (
                <Dialog open={!!selectedDoctor} onOpenChange={handleCloseDialog}>
                    <DialogTrigger>Open</DialogTrigger>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className='text-xl font-bold text-white'>
                                Doctor Verification Details
                            </DialogTitle>
                            <DialogDescription>
                                Review the doctor&apos;s information carefully before making a
                                decision
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">

                            <div className="space-x-1">
                                <div className="flex items-center gap-5">
                                    <User2 className="h-6 w-6 text-emerald-700" />
                                    <h3 className="text-emerald-700 font-medium ">
                                        Personal Information
                                    </h3>
                                </div>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="space-y-1 flex-1">
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                            Full Name
                                        </h4>
                                        <p className="text-base font-medium text-white">
                                            {selectedDoctor.name}
                                        </p>
                                    </div>

                                    <div className="space-y-1 flex-1">
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                            Email
                                        </h4>
                                        <p className="text-base font-medium text-white">
                                            {selectedDoctor.email}
                                        </p>
                                    </div>

                                    <div className="space-y-1 flex-1">
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                            Application Date
                                        </h4>
                                        <p className="text-sm font-medium text-white">
                                            {format(new Date(selectedDoctor.createdAt), "PPP")}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-emerald-900/20" />

                            <div className="space-y-1">

                                <div className="flex items-center gap-5">
                                    <Stethoscope className="h-6 w-6 text-emerald-700" />
                                    <h3 className="text-emerald-700 font-medium ">
                                        Proffessional Information
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                            Specialty
                                        </h4>
                                        <p className="text-white">
                                            {selectedDoctor.specialty}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                            Years of Experience
                                        </h4>
                                        <p className="text-white">
                                            {selectedDoctor.experience} years
                                        </p>
                                    </div>

                                    <div className="space-y-1 col-span-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                            Credential Address
                                        </h4>
                                        <div className="flex items-center">
                                            <a
                                                href={selectedDoctor.credentialUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-emerald-500/60 flex items-center"
                                            >
                                                {selectedDoctor.credentialUrl}
                                                <ExternalLink className="h-4 w-4 ml-1" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-emerald-900/20" />

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-emerald-400" />
                                    <h3 className="text-white font-medium">
                                        Service Description
                                    </h3>
                                </div>
                                <p className="text-muted-foreground whitespace-pre-line">
                                    {selectedDoctor.description}
                                </p>
                            </div>
                        </div>

                        {loading && <BarLoader width={"100%"} color="#36d7b7" />}

                        <DialogFooter className="flex sm:justify-between">
                            <Button
                                variant="destructive"
                                disabled={loading}
                                className="bg-red-600 hover:bg-red-700 cursor-pointer"
                                onClick = {()=>{
                                    handleUpdateStatus(selectedDoctor.id, "REJECTED")
                                }}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Reject
                            </Button>

                            <Button
                                disabled={loading}
                                className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                                onClick = {()=>{
                                    handleUpdateStatus(selectedDoctor.id, "VERIFIED")
                                }}
                            >
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

export default PendingDoctors