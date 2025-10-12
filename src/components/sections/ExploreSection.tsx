// src/components/sections/ExploreSection.tsx
'use client';

import { useEffect, useState } from 'react';
import { api, WPPost } from '@/lib/api';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ExploreSection = () => {
  const [exploreItems, setExploreItems] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExploreItems = async () => {
      try {
        const data = await api.getExplore();
        setExploreItems(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching explore items:', err);
        setError('Failed to load explore items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExploreItems();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Explore Rabaul</h2>
          <div className="flex justify-center">Loading explore items...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Explore Rabaul</h2>
          <div className="text-red-500 text-center">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="explore" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Explore Rabaul</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exploreItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {item._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                <div className="relative h-64 w-full">
                  <Image
                    src={item._embedded['wp:featuredmedia'][0].source_url}
                    alt={item.title.rendered}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{item.title.rendered}</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose" 
                  dangerouslySetInnerHTML={{ __html: item.excerpt?.rendered || '' }} 
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;