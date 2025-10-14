'use client';

import { useState, useEffect } from 'react';
import { Calendar, Loader2 } from 'lucide-react';

interface BookingFormProps {
  roomId?: string;
  roomTitle?: string;
  price?: number;
  className?: string;
  initialData?: Partial<BookingFormData>;
  isSubmitting?: boolean;
  onSubmit?: (data: BookingFormData) => void;
}

export interface BookingFormData {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomId?: string;
}

export function BookingForm({ 
  roomId, 
  roomTitle, 
  price, 
  className = '',
  initialData = {},
  isSubmitting = false,
  onSubmit 
}: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>(() => ({
    checkIn: initialData.checkIn || new Date().toISOString().split('T')[0],
    checkOut: initialData.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0],
    adults: initialData.adults || 2,
    children: initialData.children || 0,
    roomId: initialData.roomId || (roomId !== undefined ? String(roomId) : undefined)
  }));

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        roomId: initialData.roomId || prev.roomId
      }));
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'adults' || name === 'children' ? parseInt(value, 10) : value
    }));
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      {roomTitle && (
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Book {roomTitle}</h3>
      )}
      
      {price !== undefined && (
        <div className="mb-4 text-center">
          <p className="text-2xl font-bold text-green-900">${price.toFixed(2)}</p>
          <p className="text-sm text-gray-500">per night</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
              Check-in
            </label>
            <div className="relative">
              <input
                type="date"
                id="checkIn"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-900 focus:border-transparent"
                required
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="relative">
            <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">
              Check-out
            </label>
            <div className="relative">
              <input
                type="date"
                id="checkOut"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleInputChange}
                min={formData.checkIn}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-900 focus:border-transparent"
                required
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-1">
              Adults
            </label>
            <select
              id="adults"
              name="adults"
              value={formData.adults}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-900 focus:border-transparent"
            >
              {[1, 2, 3, 4].map(num => (
                <option key={`adult-${num}`} value={num}>
                  {num} {num === 1 ? 'Adult' : 'Adults'}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-1">
              Children
            </label>
            <select
              id="children"
              name="children"
              value={formData.children}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-900 focus:border-transparent"
            >
              {[0, 1, 2, 3].map(num => (
                <option key={`child-${num}`} value={num}>
                  {num} {num === 1 ? 'Child' : 'Children'}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 bg-green-900 text-white py-3 px-6 rounded-md hover:bg-green-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-900 ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : roomId ? (
            'Book Now'
          ) : (
            'Check Availability'
          )}
        </button>
        
        <p className="text-xs text-gray-500 text-center mt-3">
          Best rate guaranteed. No booking fees.
        </p>
      </form>
    </div>
  );
}

export default BookingForm;
