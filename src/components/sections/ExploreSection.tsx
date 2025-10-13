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
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#1a5f2c' }}>Explore Rabaul</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exploreItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
              {/* Featured Image */}
              <div className="relative h-64 w-full">
                {item._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                  <Image
                    src={item._embedded['wp:featuredmedia'][0].source_url}
                    alt={item.title?.rendered || 'Explore item image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex flex-col flex-grow p-6">
                {item.title?.rendered && (
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-xl" style={{ color: '#1a5f2c' }}>
                      {item.title.rendered}
                    </CardTitle>
                  </CardHeader>
                )}
                
                {(item.excerpt?.rendered || item.content?.rendered) && (
                  <CardContent className="p-0 flex-grow">
                    <div 
                      className="prose text-gray-600"
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