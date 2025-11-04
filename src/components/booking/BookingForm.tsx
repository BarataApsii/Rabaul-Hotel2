'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays, isBefore, isToday } from 'date-fns';
import { useWordPress } from '@/hooks/useWordPress';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RoomType, RoomRates, BookingFormData, BookingFormErrors } from '@/types/booking';

export default function BookingForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<BookingFormData>({
    checkIn: (() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    })(),
    checkOut: (() => {
      const inThreeDays = new Date();
      inThreeDays.setDate(inThreeDays.getDate() + 3);
      return inThreeDays;
    })(),
    roomType: 'select',
    adults: 2,
    children: 0,
  });

  const [errors, setErrors] = useState<BookingFormErrors>({});

  // Default room rates in case of loading or error
  const defaultRoomRates: RoomRates = {
    'budget': 200,
    'standard': 300,
    'deluxe': 450,
    'executive': 600,
    'family': 500,
    'conference': 1000,
    'select': 0
  };

  // Fetch room rates from WordPress
  const { data: roomRatesData, loading: ratesLoading, error: ratesError } = useWordPress<RoomRates>('room-rates');

  // Use fetched room rates or fallback to defaults
  const roomRates = (ratesLoading || ratesError || !roomRatesData) ? defaultRoomRates : roomRatesData;

  const validateForm = (): boolean => {
    const newErrors: BookingFormErrors = {};
    
    if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required';
    if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required';
    if (formData.checkIn && formData.checkOut && isBefore(formData.checkOut, formData.checkIn)) {
      newErrors.checkOut = 'Check-out date must be after check-in date';
    }
    if (formData.roomType === 'select') newErrors.roomType = 'Please select a room type';
    if (formData.adults < 1) newErrors.adults = 'At least one adult is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !formData.checkIn || !formData.checkOut) return;
    
    // Format dates for URL
    const formattedCheckIn = format(formData.checkIn, 'yyyy-MM-dd');
    const formattedCheckOut = format(formData.checkOut, 'yyyy-MM-dd');
    
    // Navigate to booking page with query params
    router.push(
      `/booking?checkIn=${formattedCheckIn}&checkOut=${formattedCheckOut}&roomType=${formData.roomType}&adults=${formData.adults}&children=${formData.children}`
    );
  };

  // Update checkOut if it's before checkIn when checkIn changes
  useEffect(() => {
    if (formData.checkIn && formData.checkOut && isBefore(formData.checkOut, formData.checkIn)) {
      const nextDay = addDays(formData.checkIn, 1);
      setFormData(prev => ({ ...prev, checkOut: nextDay }));
    }
  }, [formData.checkIn]);

  return (
    <Card id="booking" className="mx-auto max-w-4xl border-none bg-white/90 backdrop-blur-sm shadow-xl">
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-center text-2xl font-bold text-primary">Book Your Stay</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          {/* Check-in Date */}
          <div className="space-y-2">
            <Label htmlFor="check-in">Check-in Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${!formData.checkIn ? 'text-muted-foreground' : ''} ${errors['checkIn'] ? 'border-destructive' : ''}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.checkIn ? format(formData.checkIn, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.checkIn}
                  onSelect={(date) => {
                    if (date) {
                      setFormData(prev => ({ ...prev, checkIn: date }));
                      setErrors(prev => ({ ...prev, checkIn: '' }));
                    }
                  }}
                  disabled={(date) => isBefore(date, new Date()) && !isToday(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.checkIn && <p className="text-sm text-destructive">{errors.checkIn}</p>}
          </div>

          {/* Check-out Date */}
          <div className="space-y-2">
            <Label htmlFor="check-out">Check-out Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${!formData.checkOut ? 'text-muted-foreground' : ''} ${errors['checkOut'] ? 'border-destructive' : ''}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.checkOut ? format(formData.checkOut, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.checkOut}
                  onSelect={(date) => {
                    if (date) {
                      setFormData(prev => ({ ...prev, checkOut: date }));
                      setErrors(prev => ({ ...prev, checkOut: '' }));
                    }
                  }}
                  disabled={(date) => isBefore(date, formData.checkIn || addDays(new Date(), 1))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.checkOut && <p className="text-sm text-destructive">{errors.checkOut}</p>}
          </div>

          {/* Room Type */}
          <div className="space-y-2">
            <Label htmlFor="room-type">Room Type</Label>
            <Select
              value={formData.roomType}
              onValueChange={(value: RoomType | 'select') => {
                setFormData(prev => ({ ...prev, roomType: value }));
                setErrors(prev => ({ ...prev, roomType: '' }));
              }}
            >
              <SelectTrigger className={`${errors['roomType'] ? 'border-destructive' : ''}`}>
                <SelectValue placeholder="Select a room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select">Select a room type</SelectItem>
                <SelectItem value="budget">Budget Room - ${roomRates['budget']}/night</SelectItem>
                <SelectItem value="standard">Standard Room - ${roomRates['standard']}/night</SelectItem>
                <SelectItem value="deluxe">Deluxe Room - ${roomRates['deluxe']}/night</SelectItem>
                <SelectItem value="executive">Executive Suite - ${roomRates['executive']}/night</SelectItem>
                <SelectItem value="family">Family Room - ${roomRates['family']}/night</SelectItem>
                <SelectItem value="conference">Conference Room - ${roomRates['conference']}/day</SelectItem>
              </SelectContent>
            </Select>
            {errors['roomType'] && <p className="text-sm text-destructive">{errors['roomType']}</p>}
          </div>

          {/* Guests */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adults">Adults</Label>
              <Input
                id="adults"
                type="number"
                min="1"
                max="10"
                value={formData.adults}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value)) {
                    const newAdults = Math.min(Math.max(1, value), 10);
                    setFormData(prev => ({ ...prev, adults: newAdults }));
                    setErrors(prev => ({ ...prev, adults: '' }));
                  }
                }}
                className={errors['adults'] ? 'border-destructive' : ''}
              />
              {errors['adults'] && <p className="text-sm text-destructive">{errors['adults']}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="children">Children</Label>
              <Input
                id="children"
                type="number"
                min="0"
                max="10"
                value={formData.children}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value)) {
                    const newChildren = Math.min(Math.max(0, value), 10);
                    setFormData(prev => ({ ...prev, children: newChildren }));
                  }
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <Button type="submit" className="w-full py-6 text-lg" size="lg">
              Check Availability
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
