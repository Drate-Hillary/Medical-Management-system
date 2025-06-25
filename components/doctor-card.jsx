import React from 'react'
import { Card, CardContent } from './ui/card'
import { User } from 'lucide-react'
import Image from 'next/image'

const DoctorCard = ({ doctor }) => {

    return (
        <div>
            <Card className="border border-emerald-900/20 hover:border-emerald-900/50 transition-all">
                <CardContent>
                    <div>
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
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default DoctorCard;