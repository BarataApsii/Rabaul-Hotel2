'use client';

import { Card, CardFooter } from '@/components/ui/card';
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
  if (!price) return 'Contact for pricing';
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return 'Contact for pricing';
  
  return `$${numPrice.toLocaleString()} / night`;
};

const getImageUrl = (room: Room): string => {
  // Try better_featured_image first
  if (room.better_featured_image?.source_url) {
    return room.better_featured_image.source_url;
  }
  
  // Check embedded media
  const featuredMedia = room._embedded?.['wp:featuredmedia']?.[0];
  if (!featuredMedia) return '/images/placeholder-room.jpg';
  
  // Try different sizes in order of preference
  const sizes = featuredMedia.media_details?.sizes;
  if (sizes) {
    if (sizes.medium?.source_url) return sizes.medium.source_url;
    if (sizes.medium_large?.source_url) return sizes.medium_large.source_url;
    if (sizes.large?.source_url) return sizes.large.source_url;
    if (sizes.thumbnail?.source_url) return sizes.thumbnail.source_url;
  }
  
  // Fallback to featured media source URL
  return featuredMedia.source_url || '/images/placeholder-room.jpg';
};

const RoomsSection = () => {
  // Use the API to fetch rooms
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
      <section id="rooms" className="py-12 bg-gray-50 w-full">
        <div className="w-full px-4">
          <div className="max-w-[1800px] mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#1a5f2c' }}>
              Our Rooms & Suites
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full w-full">
                  <div className="relative h-48 w-full bg-gray-200 animate-pulse"></div>
                  <div className="flex flex-col flex-grow p-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                    <div className="mt-auto">
                      <div className="h-9 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="rooms" className="py-12 bg-gray-50 w-full">
        <div className="w-full px-4">
          <div className="max-w-[1800px] mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#1a5f2c' }}>
              Our Rooms & Suites
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-green-900 hover:bg-green-800 text-white"
            >
              Retry
            </Button>
          </div>
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
            {rooms.map((room) => {
              const imageUrl = getImageUrl(room);
              const roomSize = room.acf?.room_size || room.acf?.size;
              const maxGuests = room.acf?.max_guests || room.acf?.guests;
              
              return (
                <Card key={room.id} className="overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full w-full border-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={imageUrl}
                      alt={room.title?.rendered || 'Room Image'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-col flex-grow p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {room.title?.rendered || 'Room'}
                      </h3>
                      {room.acf?.price && (
                        <div className="text-xs font-medium bg-green-50 text-green-800 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                          {formatNightlyRate(room.acf.price)}
                        </div>
                      )}
                    </div>
                    
                    {room.content?.rendered && (
                      <div 
                        className="text-gray-600 text-sm mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{ 
                          __html: room.content.rendered.replace(/<[^>]*>/g, ' ').substring(0, 150) + '...' 
                        }} 
                      />
                    )}
                    
                    <div className="mb-4 space-y-2 mt-auto">
                      {roomSize && (
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          {roomSize} m²
                        </div>
                      )}
                      
                      {maxGuests && (
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          {maxGuests} {maxGuests === 1 ? 'Guest' : 'Guests'}
                        </div>
                      )}
                      
                      {room.acf?.bed_type && (
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 20v-8a2 2 0 012-2h14a2 2 0 012 2v8M3 20h18M3 20v-8a2 2 0 012-2h14a2 2 0 012 2v8" />
                          </svg>
                          {room.acf.bed_type}
                        </div>
                      )}
                    </div>
                    
                    <CardFooter className="mt-auto p-0 flex justify-end">
                      <Link href={`/rooms/${room.slug || room.id}`}>
                        <Button 
                          className="w-32 bg-green-900 hover:bg-green-800 text-white py-2 text-sm transition-colors duration-200"
                        >
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomsSection;