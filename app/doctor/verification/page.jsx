import { getCurrentUser } from '@/action/onboarding'
import { redirect } from 'next/navigation';
import React from 'react'

const VerificationPage = async () => {

    const user = await getCurrentUser();
    if (user?.verificationStatus === "VERIFIED") {
        redirect("/doctor")
    }

    const isRejected = user?.verificationStatus === "REJECTED"
  return (
    <div>VerificationPage</div>
  )
}

export default VerificationPage