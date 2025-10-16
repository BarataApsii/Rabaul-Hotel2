'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface BookingFormProps {
  roomType: 'conference' | 'room';
}

export default function BookingForm({ roomType = 'room' }: BookingFormProps) {
  if (roomType === 'conference') {
    // Conference room specific state
    const [] = useState('09:00');
    const [] = useState('17:00');
    const [bookingDate, setBookingDate] = useState('');
    const [numDays, setNumDays] = useState(1);

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Booking Date</label>
              <input 
                type="date" 
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-900 focus:border-transparent"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Number of Days</label>
              <div className="flex items-center space-x-3">
                <button 
                  type="button" 
                  onClick={() => setNumDays(prev => Math.max(1, prev - 1))}
                  className="p-1 rounded-full hover:bg-gray-100"
                  disabled={numDays <= 1}
                >
                  <Minus className="w-5 h-5 text-gray-600" />
                </button>
                <span className="w-6 text-center">{numDays}</span>
                <button 
                  type="button" 
                  onClick={() => setNumDays(prev => prev + 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular room booking form
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Check-in</label>
          <input 
            type="date" 
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-900 focus:border-transparent"
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Check-out</label>
          <input 
            type="date" 
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-900 focus:border-transparent"
            required
            min={checkInDate || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 border border-gray-300 rounded-md">
          <div>
            <h4 className="font-medium text-gray-900">Adults</h4>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              type="button" 
              onClick={() => setAdults(prev => Math.max(1, prev - 1))}
              className="p-1 rounded-full hover:bg-gray-100"
              disabled={adults <= 1}
            >
              <Minus className="w-5 h-5 text-gray-600" />
            </button>
            <span className="w-6 text-center">{adults}</span>
            <button 
              type="button" 
              onClick={() => setAdults(prev => Math.min(5, prev + 1))}
              className="p-1 rounded-full hover:bg-gray-100"
              disabled={adults >= 5}
            >
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center p-3 border border-gray-300 rounded-md">
          <div>
            <h4 className="font-medium text-gray-900">Children</h4>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              type="button" 
              onClick={() => setChildren(prev => Math.max(0, prev - 1))}
              className="p-1 rounded-full hover:bg-gray-100"
              disabled={children <= 0}
            >
              <Minus className="w-5 h-5 text-gray-600" />
            </button>
            <span className="w-6 text-center">{children}</span>
            <button 
              type="button" 
              onClick={() => setChildren(prev => Math.min(5, prev + 1))}
              className="p-1 rounded-full hover:bg-gray-100"
              disabled={children >= 5}
            >
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <button 
        type="submit"
        className="w-full bg-green-900 text-white py-3 px-6 rounded-md hover:bg-green-800 transition-colors font-medium text-lg mt-4"
      >
        Check Availability
      </button>
    </div>
  );
}