'use client';

import { useEffect, useState } from 'react';
import { api, WPPost } from '@/lib/api';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatNightlyRate } from '@/lib/utils/format';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await api.getRooms();
        // Get first 4 rooms or all if less than 4
        setRooms(data.slice(0, 4));
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12" style={{ color: '#1a5f2c' }}>
            Our Rooms & Suites
          </h1>
          <div className="flex justify-center">Loading rooms...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12" style={{ color: '#1a5f2c' }}>
            Our Rooms & Suites
          </h1>
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12" style={{ color: '#1a5f2c' }}>
          Our Rooms & Suites
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {rooms.map((room) => {
            const featuredImage = room._embedded?.['wp:featuredmedia']?.[0];
            const imageUrl = featuredImage?.source_url || '/images/placeholder-room.jpg';
            const price = typeof room.acf?.price === 'number' 
              ? formatNightlyRate(room.acf.price) 
              : room.acf?.price || 'Contact for rates';

            return (
              <Card key={room.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-64 w-full">
                  <Image
                    src={imageUrl}
                    alt={room.title?.rendered || 'Room image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl" style={{ color: '#1a5f2c' }}>
                    {room.title?.rendered}
                  </CardTitle>
                  <div className="text-lg font-semibold text-gray-700">
                    From {price} / night
                  </div>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ 
                      __html: room.excerpt?.rendered || 'No description available.' 
                    }} 
                  />
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <Link href={`/rooms/${room.id}`} className="text-green-700 hover:underline">
                    View Details
                  </Link>
                  <Link href="#book-now">
                    <Button 
                      className="bg-green-700 hover:bg-green-800 text-white"
                      size="lg"
                    >
                      Book Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
