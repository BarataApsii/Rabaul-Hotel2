'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { WPPost } from '@/lib/api';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface RoomMediaDetails {
  width: number;
  height: number;
  sizes?: {
    medium?: { source_url: string };
    medium_large?: { source_url: string };
    large?: { source_url: string };
    thumbnail?: { source_url: string };
    [key: string]: { source_url: string } | undefined;
  };
}

interface Room extends Omit<WPPost, '_embedded'> {
  acf?: {
    price?: string | number;
    max_guests?: number | string;
    guests?: number | string;
    size?: string | number;
    room_size?: string | number;
    bed_type?: string;
    [key: string]: unknown;
  };
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  better_featured_image?: {
    source_url: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text?: string;
      media_details?: RoomMediaDetails;
    }>;
    [key: string]: any;
  };
  id: number;
  slug: string;
}

const formatNightlyRate = (price: string | number | undefined): string => {
  if (!price) return '';
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return '';
  
  return `$${numPrice.toLocaleString()} / night`;
};

const RoomsSection = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = await api.getRooms();
        setRooms(data as Room[]);
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
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-900">Our Rooms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-t-lg" />
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-green-900">Our Rooms</h2>
          <div className="text-red-500 text-center">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="rooms" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Rooms</h2>
          <p className="text-gray-600 mt-2">Experience comfort and luxury in our well-appointed rooms</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col border-0">
              <div className="relative h-48 w-full">
                {room._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                  <Image
                    src={room._embedded['wp:featuredmedia'][0].source_url}
                    alt={room.title?.rendered || 'Room image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col grow p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl text-green-900">
                    {room.title.rendered}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-0 grow">
                  <div className="space-y-2 mb-4">
                    <p className="text-lg font-semibold text-gray-800">
                      {formatNightlyRate(room.acf?.price)}
                    </p>
                    {room.acf?.bed_type && (
                      <p className="text-sm text-gray-600">
                        {room.acf.bed_type}
                      </p>
                    )}
                    {room.acf?.max_guests && (
                      <p className="text-sm text-gray-600">
                        Max Guests: {room.acf.max_guests}
                      </p>
                    )}
                  </div>
                  
                  <div 
                    className="prose text-gray-600 text-sm mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ 
                      __html: room.excerpt?.rendered || room.content?.rendered || '' 
                    }} 
                  />
                </CardContent>

                <Button asChild className="w-full bg-green-900 hover:bg-green-800 text-white mt-4">
                  <Link href={`/rooms/${room.slug}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomsSection;