// src/components/sections/AmenitiesSection.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi } from 'lucide-react';

// Import icons from lucide-react

interface Amenity {
  id: number;
  title: {
    rendered: string;
  };
  content?: {
    rendered: string;
  };
  excerpt?: {
    rendered: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text?: string;
    }>;
  };
  slug: string;
}

const AmenitiesSection = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        setLoading(true);
        const data = await api.getAmenities();
        setAmenities(data);
      } catch (err) {
        console.error('Error fetching amenities:', err);
        setError('Failed to load amenities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  if (loading) {
    return (
      <section id="amenities" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Amenities</h2>
            <p className="text-gray-600 mt-2">Discover our excellent facilities and services</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-t-lg" />
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
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
      <section id="amenities" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center text-red-500">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="amenities" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Amenities</h2>
          <p className="text-gray-600 mt-2">Discover our excellent facilities and services</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((amenity) => (
            <Card key={amenity.id} className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col border-0">
              <div className="relative h-48 w-full">
                {amenity._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                  <Image
                    src={amenity._embedded['wp:featuredmedia'][0].source_url}
                    alt={amenity._embedded['wp:featuredmedia'][0]?.alt_text || amenity.title.rendered}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Wifi className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col grow p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl text-green-900">
                    {amenity.title.rendered}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-0 grow">
                  <div 
                    className="prose text-gray-600"
                    dangerouslySetInnerHTML={{ 
                      __html: amenity.excerpt?.rendered || amenity.content?.rendered || '' 
                    }} 
                  />
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;