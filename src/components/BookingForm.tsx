'use client';

import { useState } from 'react';

// Define the interfaces
interface BookingFormProps {
  roomType: 'conference' | 'room';
  roomId?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  specialRequests: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  roomType: 'conference' | 'room';
  roomId?: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function BookingForm({ roomType = 'room', roomId }: BookingFormProps) {
  const [formData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    specialRequests: '',
    checkInDate: '',
    checkOutDate: '',
    adults: 1,
    children: 0,
    roomType,
    roomId,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [, setErrors] = useState<FormErrors>({});
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Basic validation
    const newErrors: FormErrors = {};
    
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      newErrors['form'] = 'API configuration error. Please try again later.';
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Additional form validation
    if (!formData.firstName.trim()) newErrors['firstName'] = 'First name is required';
    if (!formData.lastName.trim()) newErrors['lastName'] = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors['email'] = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors['email'] = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors['phone'] = 'Phone number is required';
    if (!formData.checkInDate) newErrors['checkInDate'] = 'Check-in date is required';
    if (!formData.checkOutDate) newErrors['checkOutDate'] = 'Check-out date is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/booking.php`;
      console.log('Submitting booking:', { apiUrl, formData });
      
      // Prepare form data for PHP backend
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });
      
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formDataToSend,
      });

      const responseData = await response.text();
      
      if (!response.ok) {
        throw new Error(`Failed to submit booking: ${response.statusText}`);
      }

      // Try to parse JSON response, but handle non-JSON responses gracefully
      try {
        const jsonResponse = JSON.parse(responseData);
        if (jsonResponse.success !== true) {
          throw new Error(jsonResponse.message || 'Booking submission failed');
        }
      } catch (e) {
        // If response is not JSON, check if it contains success message
        if (!responseData.toLowerCase().includes('success')) {
          throw new Error('Unexpected response from server');
        }
      }

      setBookingSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting booking:', error);
      setErrors(prev => ({
        ...prev,
        form: error instanceof Error ? error.message : 'There was an error submitting your booking. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };


  if (bookingSuccess) {
    return (
      <div className="p-4 bg-green-50 text-green-800 rounded-md">
        <p className="text-center text-sm font-medium">
          Booking request sent successfully! We'll contact you shortly to confirm your reservation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Your existing form fields */}
      
{/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-900 text-white py-2 px-4 rounded-md hover:bg-green-800 transition-colors font-medium text-sm mt-2 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          'Book Now'
        )}
      </button>
    </form>
  );
}