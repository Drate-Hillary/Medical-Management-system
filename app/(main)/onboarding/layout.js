import { getCurrentUser } from '@/action/onboarding'
import { redirect } from 'next/navigation';
import React from 'react'

export const metadata = {
    title: "Onboarding - MedCare",
    description: "Complete your profile to get started"
}

const OnboardingLayout = async ({ children }) => {

    const user = await getCurrentUser();

    if (user) {
        if (user.role === "PATIENT") {
            redirect("/doctors")
        } else if (user.role === "DOCTOR") {
            if (user.verificationStatus === "VERIFIED") {
                redirect("/doctor")
            } else {
                redirect("/doctor/verification")
            }
        } else if (user.role === "ADMIN") {
            redirect("/admin")
        }
    }

    return (
        <div className='container mx-auto px-4 py-12'>
            <div className='max-w-3xl mx-auto'>
                <div className='text-center mb-10'>
                    <h1 className='text-3xl md:text-4xl font-bold mb-2 gradient-title'>Welcome to MedCare</h1>
                    <p className='text-muted-foreground text-lg '>Tell us how you to use this platform</p>
                </div>
                {children}
            </div>
        </div>
    )
}

export default OnboardingLayout