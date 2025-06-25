import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { SignedIn, SignInButton, SignUpButton, UserButton, SignedOut } from '@clerk/nextjs'
import { Button } from "@/components/ui/button";
import { checkUser } from '@/lib/checkUser'
import { Calendar, ShieldCheck, Stethoscope, User } from 'lucide-react';

const Header = async () => {

    const user = await checkUser()
    await checkAndAllocateCredit(user)

    return (
        <header className='fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-[backdrop-filter]:bg-background/60'>
            <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>
                <Link href="/">
                    <Image
                        src='/logo-single.png'
                        alt='logo'
                        width={200}
                        height={60}
                        className="h-10 w-auto object-contain"
                    />
                </Link>

                <div className='flex items-center space-x-2'>
                    <SignedIn>

                        {user?.role === "ADMIN" && (
                            <Link href="/admin">
                                <Button
                                    variant="outline"
                                    className="hidden md:inline-flex items-center gap-2 cursor-pointer"
                                >
                                    <ShieldCheck className='w-4 h-4' />
                                    Admin Dashboard
                                </Button>
                                <Button variant="ghost" className="md:hidden w-10 h-10 p-0 cursor-pointer">
                                    <ShieldCheck className='w-4 h-4' />
                                </Button>
                            </Link>
                        )}

                        {user?.role === "DOCTOR" && (
                            <Link href="/doctor">
                                <Button
                                    variant="outline"
                                    className="hidden md:inline-flex items-center gap-2 cursor-pointer"
                                >
                                    <Stethoscope className='w-4 h-4' />
                                    Doctor Dashboard
                                </Button>
                                <Button variant="ghost" className="md:hidden w-10 h-10 p-0 cursor-pointer">
                                    <Stethoscope className='w-4 h-4' />
                                </Button>
                            </Link>
                        )}

                        {user?.role === "PATIENT" && (
                            <Link href="/appointments">
                                <Button
                                    variant="outline"
                                    className="hidden md:inline-flex items-center gap-2 cursor-pointer"
                                >
                                    <Calendar className='w-4 h-4' />
                                    My Appointments
                                </Button>
                                <Button variant="ghost" className="md:hidden w-10 h-10 p-0 cursor-pointer">
                                    <Calendar className='w-4 h-4' />
                                </Button>
                            </Link>
                        )}

                        {user?.role === "UNASSIGNED" && (
                            <Link href="/onboarding">
                                <Button
                                    variant="outline"
                                    className="hidden md:inline-flex items-center gap-2 cursor-pointer"
                                >
                                    <User className='w-4 h-4' />
                                    Complete Profile
                                </Button>
                                <Button variant="ghost" className="md:hidden w-10 h-10 p-0 cursor-pointer">
                                    <User className='w-4 h-4' />
                                </Button>
                            </Link>
                        )}
                    </SignedIn>

                    <SignedOut>
                        <SignInButton>
                            <Button variant='secondary'>Sign In</Button>
                        </SignInButton>
                    </SignedOut>

                    <SignedIn>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: 'w-10 h-10',
                                    userButtonPopoverCard: "shadow-xl",
                                    userPreviewMainIdentifier: "font-semibold"
                                }
                            }}
                        />
                    </SignedIn>
                </div>
            </nav>
        </header>
    )
}

export default Header