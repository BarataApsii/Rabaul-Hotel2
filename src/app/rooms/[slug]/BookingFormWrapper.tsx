'use client';

import { BookingForm, type BookingFormData } from '@/components/forms/BookingForm';
import { useCallback, useState } from 'react';

export interface BookingFormWrapperProps {
  roomId: string;
  roomTitle: string;
  price: number;
}

export function BookingFormWrapper({ roomId, roomTitle, price }: BookingFormWrapperProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = useCallback(async (formData: BookingFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Here you would typically send the data to your API
      console.log('Submitting booking:', {
        ...formData,
        roomTitle,
        price
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setIsSuccess(true);
      
      // Optionally reset form after successful submission
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Booking submission failed:', err);
      setError('Failed to process booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [roomTitle, price]);

  // Set up initial form data
  const initialFormData = {
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    adults: 2,
    children: 0,
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
      {isSuccess && (
        <div className="p-4 text-sm text-green-700 bg-green-100 rounded-lg">
          Booking request submitted successfully! We&apos;ll contact you shortly to confirm your reservation.
        </div>
      )}
      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}