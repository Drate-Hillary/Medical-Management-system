import React from 'react'
import { Card, CardContent } from './ui/card'
import { Calendar, CalendarFold, Star, User } from 'lucide-react'
import Image from 'next/image'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import Link from 'next/link'

const DoctorCard = ({ doctor }) => {

    return (
        <div>
            <Card className="border border-emerald-900/20 hover:border-emerald-900/50 transition-all">
                <CardContent>
                    <div className='flex items-start gap-4'>
                        <div className="h-12 w-12 rounded-full bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                            {doctor.imageUrl ? (
                                <Image
                                    src={doctor.imageUrl}
                                    alt={doctor.name}
                                    height={48}
                                    width={48}
                                    className="h-12 w-12 object-cover rounded-full"
                                />
                            ) : (
                                <User className="h-8 w-8 text-emerald-500" />
                            )}
                        </div>

                        <div>
                            <div className=" flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                                <h3 className="font-medium text-white text-lg">{doctor.name}</h3>
                                <Badge
                                    variant="outline"
                                    className="bg-emerald-900/20 border border-emerald-900/30 text-emerald-500 self-start"
                                >
                                    <Star className="h-4 w-4 mr-1" />
                                    Verified
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mb-1">
                                {doctor.specialty} • {doctor.experience} years experience
                            </p>

                            <div className="mt-4 line-clamp-2 text-sm text-muted-foreground mb-4">
                                {doctor.description}
                            </div>

                            <Button
                                asChild
                                className="w-full bg-emerald-500 hover:bg-emerald-600 mt-2"
                            >
                                <Link href={`/doctors/${doctor.specialty}/${doctor.id}`}>
                                    <CalendarFold className="h-4 w-4 mr-2" />
                                    View Profile & Book
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default DoctorCard;