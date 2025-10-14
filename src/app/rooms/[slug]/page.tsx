import { notFound } from 'next/navigation';
import { api, WPPost } from '@/lib/api';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface RoomDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const rooms = await api.getRooms();
  const room = rooms.find(r => r.slug === params.slug);

  if (!room) {
    notFound();
  }

  // Get all available images
  const images = [];
  
  // Add featured image if available
  if (room._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    images.push({
      url: room._embedded['wp:featuredmedia'][0].source_url,
      alt: room._embedded['wp:featuredmedia'][0]?.alt_text || room.title.rendered
    });
  }
  
  // Add gallery images from ACF if available
  if (room.acf?.gallery_images?.length) {
    room.acf.gallery_images.forEach((img: any) => {
      if (img.url) {
        images.push({
          url: img.url,
          alt: img.alt || room.title.rendered
        });
      }
    });
  }

  // Take only the first 3 images or less
  const displayImages = images.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{room.title.rendered}</h1>
          {room.acf?.price && (
            <p className="text-2xl font-semibold text-amber-600">
              {formatPrice(room.acf.price)} / night
            </p>
          )}
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {displayImages.map((img, index) => (
            <div key={index} className="relative h-64 md:h-80 rounded-lg overflow-hidden">
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Room Details */}
        <div className="prose max-w-none">
          <div 
            dangerouslySetInnerHTML={{ __html: room.content.rendered }} 
            className="[&>p]:text-gray-600 [&>p]:mb-4"
          />
          
          {room.acf?.amenities && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Room Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.acf.amenities.map((amenity: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <span className="text-amber-600 mr-2">✓</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Generate static paths at build time
export async function generateStaticParams() {
  const rooms = await api.getRooms();
  return rooms.map((room) => ({
    slug: room.slug,
  }));
}
