'use client';

import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

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
  recaptchaToken: string | null;
}

interface FormErrors {
  [key: string]: string;
}

export default function BookingForm({ roomType = 'room', roomId }: BookingFormProps) {
  const [formData, setFormData] = useState<FormData>({
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
    recaptchaToken: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleRecaptchaChange = (token: string | null) => {
    setFormData(prev => ({
      ...prev,
      recaptchaToken: token
    }));
    if (token) {
      setErrors(prev => ({
        ...prev,
        recaptcha: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Basic validation
    const newErrors: FormErrors = {};
    if (!formData.recaptchaToken) {
      newErrors['recaptcha'] = 'Please complete the reCAPTCHA verification';
    }
    
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      newErrors['form'] = 'API base URL is not configured';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bookings`;
      console.log('Submitting to:', apiUrl); // For debugging
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to submit booking: ${response.statusText}`);
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
      
      {/* Add reCAPTCHA */}
      <div className="mt-3">
        <style jsx global>{`
          .grecaptcha-badge { 
            visibility: visible !important;
          }
          .g-recaptcha {
            display: flex;
            justify-content: center;
            transform: scale(0.9);
            transform-origin: 0 0;
            margin-bottom: -10px;
          }
        `}</style>
        {process.env['NEXT_PUBLIC_RECAPTCHA_SITE_KEY'] ? (
          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env['NEXT_PUBLIC_RECAPTCHA_SITE_KEY']}
              onChange={handleRecaptchaChange}
              onExpired={() => handleRecaptchaChange(null)}
              onErrored={() => handleRecaptchaChange(null)}
            />
          </div>
        ) : (
          <div className="p-3 bg-yellow-50 text-yellow-800 text-sm rounded-md">
            reCAPTCHA is not configured. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY
          </div>
        )}
        {errors['recaptcha'] && (
          <p className="mt-1 text-sm text-red-600">{errors['recaptcha']}</p>
        )}
      </div>

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