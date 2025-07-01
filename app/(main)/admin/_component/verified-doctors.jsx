"use client";

import { updateDoctorActiveStatus } from '@/action/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import useFetch from '@/hooks/use-fetch';
import { Ban, Loader2, Search } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const VerifiedDoctors = ({ doctors }) => {

  const [searchItem, setSearchItem] = useState("");
  const [targetDoctor, setTargetDoctor] = useState(null);

  const filteredDoctors = doctors.filter((doctor) => {
    const query = searchItem.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(query) ||
      doctor.specialty.toLowerCase().includes(query) ||
      doctor.email.toLowerCase().includes(query)
    );
  });

  const { loading, data, fn: submitStatusUpdate } = useFetch(updateDoctorActiveStatus);

  const handleStatusChange = async(doctor) =>{
    const confirmed = window.confirm(
      `Are you sure you want suspend ${doctor.name}?`
    );

    if(!confirmed || loading) return;


    const formData = new FormData();
    formData.append("doctorId", doctor.id);
    formData.append("suspend", "true")

    setTargetDoctor(doctor);
    await submitStatusUpdate(formData);
  };

  useEffect(()=>{
    if (data?.success && targetDoctor) {
      toast.success(`Suspended ${targetDoctor.name} successfully?`);
      setTargetDoctor(null);
    }
  }, [data]);

  return (
    <div>
      <Card className="bg-muted/20 border border-emerald-900/20">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-white font-bold text-xl">
                Manage Doctors
              </CardTitle>
              <CardDescription>
                Manage and View Verified Doctors.
              </CardDescription>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors here..."
                className="pl-8 bg-background border border-emerald-900/20"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchItem
                ? "No Doctor matches the search credentials!"
                : "No Verified Doctor available."
              }
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
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
                          className="bg-emerald-900/20 border border-emerald-900/30 text-emerald-500 cursor-pointer"
                        >
                          Active
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(doctor)}
                          className="border border-red-900/30 hover:bg-red-900/10 cursor-pointer text-red-600"
                        >
                          {loading && targetDoctor?.id === doctor.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Ban className="h-4 w-4 mr-1" />
                          )}
                          Suspend
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifiedDoctors