"use client";

import { bookAppointment } from '@/actions/appointments';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useFetch from '@/hooks/use-fetch';
import { format } from 'date-fns';
import { ArrowLeft, CalendarFold, Clock, CreditCard, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const AppointmentForm = ({ doctorId, slot, onBack, onComplete }) => {
  const [description, setDescription] = useState("");

  const { loading, data, fn: submitBooking } = useFetch(bookAppointment);

  const handleSubmit = async(e)=>{
    e.preventDefault();

    const formData = new FormData();
    formData.append("doctorId", doctorId);
    formData.append("startTime", slot.startTime);
    formData.append("endTime", slot.endtime);
    formData.append("description", description);

    await submitBooking(formData);
  }

  useEffect(()=>{
    if (data && data.success) {
      toast.success("Appointment Booked Successfully");
      onComplete();
    }
  }, [data]);

  return (
    <form className='space-y-3' onSubmit={handleSubmit}>
      <div className="bg-muted/40 p-4 rounded border border-emerald-900/20 space-y-3">
        <div className='flex items-center'>
          <CalendarFold className="h-4 w-4 text-emerald-500 mr-2" />
          <span className='text-xs font-medium text-white'>
            {format(new Date(slot.startTime), "EEEE MMMM d, yyyy")}
          </span>
        </div>
        <div className='flex items-center'>
          <Clock className="h-4 w-4 text-emerald-500 mr-2" />
          <span className='text-white text-xs'>
            {slot.formatted}
          </span>
        </div>
        <div className='flex items-center'>
          <CreditCard className="h-4 w-4 text-emerald-500 mr-2" />
          <span className='text-muted-foreground'>
            Cost: <span className='font-medium text-xs text-white'>2 credits</span>
          </span>
        </div>
      </div>

      <div className='space-y-1'>
        <Label htmlFor="description">Describe your medical concern (optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please provide any details about your medical concern or what you'd like to discuss during the appointment..."
          className="bg-background border border-emerald-900/20 rounded h-32 placeholder:text-xs"
        />
      </div>

      <div className='flex items-center justify-between pt-2'>
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="border border-emerald-900/20 cursor-pointer"
        >
          <ArrowLeft className='mr-3 h-4 w-4' />
          Change Time slot
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="border border-emerald-600 bg-emerald-700 hover:bg-emerald-800 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className='mr-2 h-4 w-2 animate-spin' />
              Booking...
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </div>
    </form>
  )
}

export default AppointmentForm