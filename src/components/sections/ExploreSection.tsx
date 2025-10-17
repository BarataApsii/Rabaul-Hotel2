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
        setError('Failed to load tourist spots. Please try again later.');
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
          <h2 className="text-3xl font-bold text-center mb-12 text-green-900">Explore Rabaul</h2>
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
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-green-900">Explore Rabaul</h2>
          <div className="text-red-500 text-center">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="explore" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-green-900">Explore Rabaul</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {exploreItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col border-0">
              <div className="relative h-48 w-full">
                {item._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                  <Image
                    src={item._embedded['wp:featuredmedia'][0].source_url}
                    alt={item.title?.rendered || 'Explore item image'}
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
              
              <div className="flex flex-col flex-grow p-6">
                {item.title?.rendered && (
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-xl text-green-900">
                      {item.title.rendered}
                    </CardTitle>
                  </CardHeader>
                )}
                
                {(item.excerpt?.rendered || item.content?.rendered) && (
                  <CardContent className="p-0 flex-grow">
                    <div 
                      className="prose text-gray-600 line-clamp-3"
                      dangerouslySetInnerHTML={{ 
                        __html: item.excerpt?.rendered || item.content?.rendered || '' 
                      }} 
                    />
                  </CardContent>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;