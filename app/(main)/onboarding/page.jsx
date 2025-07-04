"use client";

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { Loader2, Stethoscope, User } from 'lucide-react';
import useFetch from '@/hooks/use-fetch';
import { setUserRole } from '@/actions/onboarding';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SPECIALTIES } from '@/lib/specialities';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const doctorFormSchema = z.object({
    specialty: z
        .string()
        .min(1, 'Specialty is required!'),
    experience: z
        .number()
        .min(1, "Experience must be atleast above 1 year")
        .max(15, "Experience must be less than 15 years"),
    credentialUrl: z
        .string()
        .url('Please enter a valid URL')
        .min(1, "Credential URL is required?"),
    description: z
        .string()
        .min(20, "Description must be above 20 characters")
        .max(1000, "Description must be less than 1000 characters")
})

const OnboardingPage = () => {

    const [step, setStep] = useState("choose-role");
    const router = useRouter();

    const { data, loading, fn: submitUserRole } = useFetch(setUserRole)

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: zodResolver(doctorFormSchema),
        defaultValues: {
            specialty: '',
            experience: undefined,
            credentialUrl: "",
            description: ""
        }
    });

    const specialtyValue = watch("specialty")

    const handlePatientSelection = async () => {
        if (loading) return;

        const formData = new FormData();
        formData.append("role", "PATIENT");
        await submitUserRole(formData)
    };

    useEffect(() => {
        if (data && data?.success) {
            toast.success("Role Selected Successfully")
            router.push(data.redirect)
        }
    }, [data]);

    const onDoctorSubmit = async (data) => {
        if (loading) return;

        const formData = new FormData();
        formData.append("role", "DOCTOR");
        formData.append("specialty", data.specialty)
        formData.append("experience", data.experience.toString())
        formData.append("credentialUrl", data.credentialUrl)
        formData.append("description", data.description)

        await submitUserRole(formData)
    }

    if (step === "choose-role") {
        return (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Card
                    onClick={() => !loading && handlePatientSelection()}
                    className='border-emerald-900/20 hover:border-emerald-900/40 cursor-pointer transition-all'
                >
                    <CardContent className='pt-1 pb-1 flex items-center text-center flex-col'>
                        <div className='p-4 bg-emerald-900/40 rounded-full mb-4'>
                            <User className='h-8 w-8 text-emerald-500' />
                        </div>
                        <CardTitle className='text-xl font-semibold text-white mb-1'>
                            Join as a Patient
                        </CardTitle>
                        <CardDescription className='mb-2'>
                            Book appointments, consult with doctors, and manage your healthcare journey.
                        </CardDescription>
                        <Button
                            disabled={loading}
                            className='w-full mt-2 bg-emerald-700/60 hover:bg-emerald-700/40 transition-colors cursor-pointer'
                        >
                            {loading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Processing...
                                </>
                            ) : (
                                "Continue as a Patient"
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <Card
                    onClick={() => !loading && setStep("doctor-form")}
                    className='border-emerald-900/20 hover:border-emerald-900/40 cursor-pointer transition-all'>
                    <CardContent className='pt-1 pb-1 flex items-center text-center flex-col'>
                        <div className='p-4 bg-emerald-900/40 rounded-full mb-4'>
                            <Stethoscope className='h-8 w-8 text-emerald-500' />
                        </div>
                        <CardTitle className='text-xl font-semibold text-white mb-1'>
                            Join as a Doctor
                        </CardTitle>
                        <CardDescription className='mb-2'>
                            Create a Professional profile, set your availability and provide consultations.
                        </CardDescription>
                        <Button
                            disabled={loading}
                            className='w-full mt-2 bg-emerald-700/60 hover:bg-emerald-700/40 transition-colors cursor-pointer'
                        >
                            {loading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Processing...
                                </>
                            ) : (
                                "Continue as a Doctor"
                            )}
                        </Button>
                    </CardContent>
                </Card>

            </div>
        )
    }

    if (step === "doctor-form") {
        return (
            <Card className='border-emerald-900'>
                <CardContent className='pt-3'>

                    <div className='mb-6'>
                        <CardTitle className='text-xl font-bold text-white mb-1'>
                            Complete your Doctor Profile
                        </CardTitle>
                        <CardDescription className='mb-2'>
                            Please provide your Professional details for verification.
                        </CardDescription>
                    </div>

                    <form className='space-y-6' onSubmit={handleSubmit(onDoctorSubmit)}>
                        <div className='space-y-1.5'>
                            <Label htmlFor="specialty">Medical Specialty</Label>
                            <Select
                                value={specialtyValue}
                                onValueChange={(value) => setValue("specialty", value)}
                            >
                                <SelectTrigger id="specialty">
                                    <SelectValue placeholder="Select your specialty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Specialities</SelectLabel>
                                        {SPECIALTIES.map((sp) => {
                                            return (
                                                <SelectItem
                                                    key={sp.name}
                                                    value={sp.name}
                                                >
                                                    <div className='flex items-center gap-2'>
                                                        <span className='text-gray-500'>{sp.icon}</span>
                                                        {sp.name}
                                                    </div>
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            {errors.specialty && (
                                <p className='text-sm font-medium text-red-500 mt-1'>
                                    {errors.specialty.message}
                                </p>
                            )}

                        </div>

                        <div className='space-y-1.5'>
                            <Label htmlFor="experience">Years of experience</Label>
                            <Input
                                id="experience"
                                type="number"
                                placeholder="eg. 5"
                                {...register("experience", { valueAsNumber: true })}
                            />

                            {errors.experience && (
                                <p className='text-sm font-medium text-red-500 mt-1'>
                                    {errors.experience.message}
                                </p>
                            )}

                        </div>

                        <div className='space-y-1.5'>
                            <Label htmlFor="credentialUrl">Address to Credential Document</Label>
                            <Input
                                id="credentialUrl"
                                type="url"
                                placeholder="https://www.example.com/my-doc.pdf"
                                {...register("credentialUrl")}
                            />

                            {errors.credentialUrl && (
                                <p className='text-sm font-medium text-red-500 mt-1'>
                                    {errors.credentialUrl.message}
                                </p>
                            )}

                            <small className='text-muted-foreground'>
                                Please provide address link to your medical degree or certification?
                            </small>

                        </div>

                        <div className='space-y-1.5'>
                            <Label htmlFor="description">Description of Your Service</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe your expertise, services and approach to patient care..."
                                rows="4"
                                {...register("description")}
                            />

                            {errors.description && (
                                <p className='text-sm font-medium text-red-500 mt-1'>
                                    {errors.description.message}
                                </p>
                            )}

                        </div>

                        <div className='pt-2 flex items-center justify-between'>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep("choose-role")}
                                className='border-emerald-900/30 cursor-pointer'
                                disabled={loading}
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                className=' bg-emerald-700/60 hover:bg-emerald-700/40 transition-colors cursor-pointer'
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit for Verification"
                                )}
                            </Button>
                        </div>
                    </form>

                </CardContent>
            </Card>
        )
    }
}

export default OnboardingPage