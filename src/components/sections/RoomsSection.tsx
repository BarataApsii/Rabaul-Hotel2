// src/components/sections/RoomsSection.tsx
'use client';

import { useEffect, useState } from 'react';
import { api, WPPost } from '@/lib/api';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const RoomsSection = () => {
  const [rooms, setRooms] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await api.getRooms();
        setRooms(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Failed to load rooms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#1a5f2c' }}>Our Rooms & Suites</h2>
          <div className="flex justify-center">Loading rooms...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#1a5f2c' }}>Our Rooms & Suites</h2>
          <div className="text-red-500 text-center">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="rooms" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#1a5f2c' }}>Our Rooms & Suites</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              {room._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                <div className="relative h-64 w-full">
                  <Image
                    src={room._embedded['wp:featuredmedia'][0].source_url}
                    alt={room.title.rendered}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl" style={{ color: '#1a5f2c' }}>{room.title.rendered}</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose" 
                  dangerouslySetInnerHTML={{ __html: room.excerpt?.rendered || '' }} 
                />
              </CardContent>
              <CardFooter className="p-0">
                <div className="w-full">
                  <Button 
                    className="w-full h-full" 
                    style={{ backgroundColor: '#1a5f2c' }}
                    onClick={() => {
                      const roomType = room.title.rendered.toLowerCase().split(' ')[0];
                      const url = new URL(window.location.href);
                      url.searchParams.set('roomType', roomType);
                      
                      // Update URL without triggering a full page reload
                      window.history.pushState({}, '', url.toString());
                      
                      // Manually update the room type state and scroll to booking
                      const bookingSection = document.getElementById('booking');
                      if (bookingSection) {
                        bookingSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Book Now
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomsSection;