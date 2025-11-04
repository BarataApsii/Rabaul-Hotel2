// src/components/sections/ExploreSection.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExploreItem {
  id: number;
  title: {
    rendered: string;
  };
  excerpt?: {
    rendered: string;
  };
  content?: {
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

const ExploreSection = () => {
  const [exploreItems, setExploreItems] = useState<ExploreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExploreContent = async () => {
      try {
        setLoading(true);
        const data = await api.getExploreRabaul();
        setExploreItems(data);
      } catch (err) {
        console.error('Error fetching explore content:', err);
        setError('Failed to load explore content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExploreContent();
  }, []);

  if (loading) {
    return (
      <section id="explore" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Explore Rabaul</h2>
            <p className="text-gray-600 mt-2">Discover the beauty of our surroundings</p>
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
      <section id="explore" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-red-500">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="explore" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Explore Rabaul</h2>
          <p className="text-gray-600 mt-2">Discover the beauty of our surroundings</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {exploreItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col border-0">
              <div className="relative h-48 w-full">
                {item._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                  <Image
                    src={item._embedded['wp:featuredmedia'][0].source_url}
                    alt={item._embedded['wp:featuredmedia'][0]?.alt_text || item.title.rendered}
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
                    {item.title.rendered}
                  </CardTitle>
                </CardHeader>
                
                <div className="p-0 grow">
                  <div 
                    className="prose text-gray-600 text-sm"
                    dangerouslySetInnerHTML={{ 
                      __html: item.excerpt?.rendered || item.content?.rendered || '' 
                    }} 
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;