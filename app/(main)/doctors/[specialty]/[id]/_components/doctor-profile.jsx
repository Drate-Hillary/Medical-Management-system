import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Medal, User2 } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const DoctorProfile = ({ doctor, availableDays }) => {
    const totalScore = availableDays.reduce((total, day) => {
        total + day.slots.length, 0
    })
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
                    <CardContent>
                        {totalScore > 0 ? (
                            <></>
                        ) : (
                            <div></div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default DoctorProfile