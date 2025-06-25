import { Card, CardContent } from '@/components/ui/card'
import { SPECIALTIES } from '@/lib/specialities'
import Link from 'next/link'
import React from 'react'

const SpecialitiesPage = () => {
    return (
        <>
            <div className="flex flex-col items-center justify-center mb-2 text-center">
                <h1 className="text-3xl md:text-4xl font-bold gradient-title mb-2">
                    Find your Doctor
                </h1>
                <p className="text-muted-foreground text-md">
                    Browse by Specialty or View all Available Healthcare Providers.
                </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {SPECIALTIES.map((specialty) => (
                    <Link key={specialty.name} href={`/doctors/${specialty.name}`}>
                        <Card className="border border-emerald-900/10 hover:border-emerald-900/50 transition-all cursor-pointer h-full">
                            <CardContent className="flex flex-col items-center justify-center text-center h-full">
                                <div className="w-12 h-12 rounded-full bg-emerald-900/20 flex items-center justify-center mb-2">
                                    <div className="text-emerald-500">
                                        {specialty.icon}
                                    </div>
                                </div>
                                <h3 className="text-medium text-white">
                                    {specialty.name}
                                </h3>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </>
    )
}

export default SpecialitiesPage