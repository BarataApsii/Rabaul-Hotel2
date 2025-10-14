'use client';

import { useEffect, useState } from 'react';
import { api, WPPost } from '@/lib/api';
import Image from 'next/image';
import { Card, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatNightlyRate } from '@/lib/utils/format';

interface RoomACF {
  price?: string | number | null;
  size?: string;
  guests?: number;
  beds?: number | string;
  [key: string]: unknown; // For any other ACF fields
}

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
    <section id="rooms" className="py-12 bg-gray-50 w-full">
      <div className="w-full px-4">
        <div className="max-w-[1800px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#1a5f2c' }}>
            Our Rooms & Suites
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
            {rooms.map((room, index) => (
              <Card key={room.id} className="overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full w-full">
                <div className="relative h-48 w-full">
                  {room._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                    <Image
                      src={room._embedded['wp:featuredmedia'][0].source_url}
                      alt={room.title.rendered}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 3}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-grow p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {room.title.rendered}
                    </h3>
                    {room.acf?.price && (
                      <div className="text-xs font-medium bg-green-50 text-green-800 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                        {formatNightlyRate(room.acf.price)}
                      </div>
                    )}
                  </div>
                  {room.acf && (
                    <div className="mb-4 space-y-2">
                      {(room.acf as RoomACF).size && (
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          {(room.acf as RoomACF).size} m²
                        </div>
                      )}
                      {(room.acf as RoomACF).guests && (
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          {(room.acf as RoomACF).guests} {(room.acf as RoomACF).guests === 1 ? 'Guest' : 'Guests'}
                        </div>
                      )}
                      {(room.acf as RoomACF).beds && (
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 20v-8a2 2 0 012-2h14a2 2 0 012 2v8M3 20h18M3 20v-8a2 2 0 012-2h14a2 2 0 012 2v8" />
                          </svg>
                          {(room.acf as RoomACF).beds} {(room.acf as RoomACF).beds === 1 ? 'Bed' : 'Beds'}
                        </div>
                      )}
                    </div>
                  )}
                  <CardFooter className="mt-auto flex justify-end">
                    <Link href={`/rooms/${room.slug}`}>
                      <Button 
                        className="bg-green-900 hover:bg-green-800 text-white px-4 py-1.5 text-sm transition-colors duration-200"
                      >
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomsSection;