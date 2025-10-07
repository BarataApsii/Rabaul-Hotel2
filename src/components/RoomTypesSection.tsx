'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { api, WPPost } from '@/lib/api';

interface Room extends WPPost {
  // You can extend the WPPost interface here if needed
  // For example, if you have custom fields specific to rooms
  acf?: {
    features?: string[];
    [key: string]: any;
  };
}

const RoomTypesSection = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getRooms();
        console.log('Fetched rooms:', data);
        setRooms(data);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Failed to load rooms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const getImageUrl = (room: Room): string => {
    // Try different image sources in order of preference
    if (room.better_featured_image?.source_url) {
      return room.better_featured_image.source_url;
    }
    
    // Check embedded media
    const featuredMedia = room._embedded?.['wp:featuredmedia']?.[0];
    if (!featuredMedia) return '/images/rooms/default-room.png';
    
    // Try different sizes in order of preference
    const sizes = featuredMedia.media_details?.sizes;
    if (sizes?.large?.source_url) return sizes.large.source_url;
    if (sizes?.medium_large?.source_url) return sizes.medium_large.source_url;
    if (sizes?.medium?.source_url) return sizes.medium.source_url;
    if (sizes?.thumbnail?.source_url) return sizes.thumbnail.source_url;
    if (featuredMedia.source_url) return featuredMedia.source_url;
    
    return '/images/rooms/default-room.png';
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-white text-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Our Room Types</h2>
            <div className="w-20 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Loading our beautiful rooms...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
                <div className="bg-gray-200 h-64 w-full"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-10 bg-gray-200 rounded mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 md:py-16 bg-white text-gray-800">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-white text-gray-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Our Room Types</h2>
          <div className="w-20 h-1 bg-yellow-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose from our selection of comfortable and well-appointed rooms designed for your perfect stay in Rabaul.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {rooms.map((room) => {
            const imageUrl = getImageUrl(room);
            
            return (
              <div key={room.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <div className="relative h-64 w-full">
                  <Image
                    src={imageUrl}
                    alt={room.title.rendered || 'Room Image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={false}
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 
                    className="text-xl font-semibold mb-2"
                    dangerouslySetInnerHTML={{ __html: room.title.rendered || 'Room' }}
                  />
                  <div 
                    className="text-gray-600 mb-4 line-clamp-3 flex-grow"
                    dangerouslySetInnerHTML={{ 
                      __html: room.content.rendered 
                        ? room.content.rendered.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                        : 'No description available.'
                    }}
                  />
                  {room.acf?.features && room.acf.features.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {room.acf?.features?.slice(0, 3).map((feature: string, i: number) => (
                        <li key={i} className="flex items-center">
                          <span className="text-yellow-500 mr-2">✓</span>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button className="w-full mt-auto bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default RoomTypesSection;
