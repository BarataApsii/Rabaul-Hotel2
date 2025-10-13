'use client';

import { useEffect, useState } from 'react';
import { api, WPPost } from '@/lib/api';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatNightlyRate } from '@/lib/utils/format';

const RoomsSection = () => {
  const [rooms, setRooms] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await api.getRooms();
        console.log('Rooms data:', data);
        console.log('First room media:', data[0]?._embedded?.['wp:featuredmedia']);
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
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#1a5f2c' }}>
            Our Rooms & Suites
          </h2>
          <div className="flex justify-center">Loading rooms...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#1a5f2c' }}>
            Our Rooms & Suites
          </h2>
          <div className="text-red-500 text-center">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="rooms" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#1a5f2c' }}>
          Our Rooms & Suites
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
              {/* Featured Image */}
              <div className="relative h-64 w-full">
                {room._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                  <Image
                    src={room._embedded['wp:featuredmedia'][0].source_url}
                    alt={room.title.rendered}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 3} // Only prioritize first 3 images for better performance
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>

              {/* Room Details */}
              <div className="flex flex-col flex-grow p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {room.title.rendered}
                  </h3>
                  {room.acf?.price && (
                    <div className="text-lg font-semibold bg-green-50 text-green-800 px-3 py-1 rounded-full whitespace-nowrap">
                      {formatNightlyRate(room.acf.price)}
                    </div>
                  )}
                </div>

                {/* Room Features */}
                {room.acf && (
                  <div className="mb-4 space-y-2">
                    {room.acf.size && (
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">Size:</span>
                        <span className="font-medium">{room.acf.size} m²</span>
                      </div>
                    )}
                    {room.acf.capacity && (
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">Capacity:</span>
                        <span className="font-medium">{room.acf.capacity} people</span>
                      </div>
                    )}
                    {room.acf.view && (
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">View:</span>
                        <span className="font-medium">{room.acf.view}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Room Description */}
                <div 
                  className="prose text-gray-600 mb-6 flex-grow"
                  dangerouslySetInnerHTML={{ 
                    __html: room.excerpt?.rendered || room.content?.rendered || '' 
                  }} 
                />
                <CardFooter className="p-4 mt-auto">
                  <Button 
                    className="w-full" 
                    style={{ backgroundColor: '#1a5f2c' }}
                    onClick={() => {
                      const roomType = room.title.rendered.toLowerCase().split(' ')[0];
                      const url = new URL(window.location.href);
                      url.searchParams.set('roomType', roomType);
                      
                      window.history.pushState({}, '', url.toString());
                      
                      const bookingSection = document.getElementById('booking');
                      if (bookingSection) {
                        bookingSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Book Now
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomsSection;