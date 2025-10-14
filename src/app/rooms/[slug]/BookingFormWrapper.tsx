'use client';

import { BookingForm, type BookingFormData } from '@/components/forms/BookingForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export interface BookingFormWrapperProps {
  roomId: string;
  roomTitle: string;
  price: number;
}

export function BookingFormWrapper({ roomId, roomTitle, price }: BookingFormWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = useCallback(async (formData: BookingFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Here you would typically send the data to your API
      console.log('Submitting booking:', formData);
      
      // For now, we'll just redirect to the booking page with the form data
      const queryParams = new URLSearchParams({
        roomId: formData.roomId || '',
        roomTitle: roomTitle,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        adults: formData.adults.toString(),
        children: formData.children.toString(),
        price: price.toString()
      });
      
      // Redirect to booking page with all parameters
      router.push(`/booking?${queryParams.toString()}`);
      
    } catch (err) {
      console.error('Booking submission failed:', err);
      setError('Failed to process booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [price, roomTitle, router]);

  // Pre-fill form from URL parameters if available
  const initialFormData = {
    checkIn: searchParams.get('checkIn') || new Date().toISOString().split('T')[0],
    checkOut: searchParams.get('checkOut') || new Date(Date.now() + 86400000).toISOString().split('T')[0],
    adults: parseInt(searchParams.get('adults') || '2', 10),
    children: parseInt(searchParams.get('children') || '0', 10),
    roomId: roomId
  };

  return (
    <div className="space-y-4">
      <BookingForm 
        roomId={roomId}
        roomTitle={roomTitle}
        price={price}
        initialData={initialFormData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
