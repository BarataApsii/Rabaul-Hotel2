'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RoomDetailModal } from '@/components/ui/RoomDetailModal';

import { RoomData, RoomImage } from '@/types/room';

type ApiRoomImage = {
  id: string | number;
  url: string;
  alt: string;
  sizes?: {
    thumbnail?: string;
    medium?: string;
    large?: string;
    full?: string;
  };
};

type ApiRoomData = Omit<RoomData, 'acf' | '_embedded'> & {
  acf?: {
    price?: string | number;
    amenities?: string[];
    gallery?: ApiRoomImage[];
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      alt_text: string;
      media_details?: {
        sizes?: {
          thumbnail?: { source_url: string };
          medium?: { source_url: string };
          large?: { source_url: string };
          full?: { source_url: string };
        };
      };
    }>;
  };
};

// Helper function to transform API image to RoomImage
const toRoomImage = (img: ApiRoomImage): RoomImage => ({
  id: String(img.id),
  url: img.url,
  alt: img.alt,
  sizes: {
    thumbnail: img.sizes?.thumbnail || '',
    medium: img.sizes?.medium || '',
    large: img.sizes?.large || '',
    full: img.sizes?.full || ''
  }
});

export default function RoomDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [room, setRoom] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Function to transform API data to our RoomData type
  const transformRoomData = (apiData: ApiRoomData): RoomData => {
    // Transform gallery images if they exist
    const gallery = apiData.acf?.gallery?.map(toRoomImage) || [];
    
    // Transform featured media if it exists
    const featuredMedia = apiData._embedded?.['wp:featuredmedia']?.[0];
    const featuredImage = featuredMedia ? {
      id: String(featuredMedia.id),
      url: featuredMedia.source_url,
      alt: featuredMedia.alt_text || '',
      sizes: {
        thumbnail: featuredMedia.media_details?.sizes?.thumbnail?.source_url || '',
        medium: featuredMedia.media_details?.sizes?.medium?.source_url || '',
        large: featuredMedia.media_details?.sizes?.large?.source_url || '',
        full: featuredMedia.media_details?.sizes?.full?.source_url || featuredMedia.source_url
      }
    } : undefined;

    return {
      ...apiData,
      acf: {
        ...apiData.acf,
        price: apiData.acf?.price ? Number(apiData.acf.price) : undefined,
        gallery: gallery.length > 0 ? gallery : (featuredImage ? [featuredImage] : []),
      },
      _embedded: {
        'wp:featuredmedia': featuredMedia ? [{
          id: featuredMedia.id,
          source_url: featuredMedia.source_url,
          alt_text: featuredMedia.alt_text,
          media_details: {
            sizes: {
              thumbnail: { source_url: featuredMedia.media_details?.sizes?.thumbnail?.source_url || '' },
              medium: { source_url: featuredMedia.media_details?.sizes?.medium?.source_url || '' },
              large: { source_url: featuredMedia.media_details?.sizes?.large?.source_url || '' },
              full: { source_url: featuredMedia.media_details?.sizes?.full?.source_url || featuredMedia.source_url }
            }
          }
        }] : []
      }
    };
  };

  useEffect(() => {
    const fetchRoom = async () => {
      if (!id) return;
      
      try {
        const roomId = Array.isArray(id) ? id[0] : id;
        console.log(`Fetching room with ID: ${roomId}`);
        
        const response = await fetch(`/api/room/${roomId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch room');
        }
        
        // Transform the API data to match our RoomData type
        const roomData = transformRoomData(data);
        setRoom(roomData);
        
        // Set the first image as selected by default
        if (roomData._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
          setSelectedImage(roomData._embedded['wp:featuredmedia'][0].source_url);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching room:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load room details';
        console.error('Error details:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Room</h1>
        <p className="text-gray-600 mb-6">{error || 'Room not found'}</p>
        <Button onClick={() => router.push('/rooms')}>
          Back to Rooms
        </Button>
      </div>
    );
  }

  const featuredImage = room._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
  const galleryImages = room.acf?.gallery || [];
  const allImages = [
    { id: 'featured', url: featuredImage },
    ...galleryImages
  ].filter(img => img.url);

  return (
    <div className="container mx-auto py-12 px-4">
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Rooms
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Image */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
          {selectedImage ? (
            <Image
              src={selectedImage || ''}
              alt={room.title.rendered}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        {/* Room Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{room.title.rendered}</h1>
          
          {room.acf?.price !== undefined && (
            <div className="text-2xl font-semibold text-primary mb-6">
              ${typeof room.acf.price === 'string' 
                ? parseFloat(room.acf.price).toFixed(2) 
                : room.acf.price.toFixed(2)} / night
            </div>
          )}

          <div 
            className="prose max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: room.content.rendered }}
          />

          <Button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto"
          >
            View Full Details
          </Button>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {allImages.length > 1 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allImages.map((image, index) => (
              <button
                key={image.id || index}
                onClick={() => setSelectedImage(image.url)}
                className={`relative aspect-square rounded-lg overflow-hidden transition-opacity ${selectedImage === image.url ? 'ring-2 ring-primary' : 'opacity-75 hover:opacity-100'}`}
              >
                <Image
                  src={image.url}
                  alt={`${room.title.rendered} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Room Details Modal */}
      <RoomDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        room={room} 
      />
    </div>
  );
}