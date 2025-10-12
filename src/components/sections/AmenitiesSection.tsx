// src/components/sections/AmenitiesSection.tsx
'use client';

import { useEffect, useState } from 'react';
import { api, WPPost } from '@/lib/api';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AmenitiesSection = () => {
  const [amenities, setAmenities] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const data = await api.getAmenities();
        setAmenities(data);
        setError(null);
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
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Amenities</h2>
          <div className="flex justify-center">Loading amenities...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Amenities</h2>
          <div className="text-red-500 text-center">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="amenities" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Our Amenities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((amenity) => (
            <Card key={amenity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {amenity._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                <div className="relative h-48 w-full">
                  <Image
                    src={amenity._embedded['wp:featuredmedia'][0].source_url}
                    alt={amenity.title.rendered}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{amenity.title.rendered}</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose" 
                  dangerouslySetInnerHTML={{ __html: amenity.excerpt?.rendered || '' }} 
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;