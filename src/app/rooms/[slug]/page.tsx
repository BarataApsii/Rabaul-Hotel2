import { api, WPPost } from '@/lib/api';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils/format';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import BookingForm from '@/components/BookingForm';

// Define the ACF fields interface
interface RoomACF extends Record<string, any> {
  image_1?: {
    url: string;
    alt: string;
  };
  image_2?: {
    url: string;
    alt: string;
  };
  image_3?: {
    url: string;
    alt: string;
  };
  price?: number;
  amenities?: Array<{
    name: string;
  }>;
}

// Extend WPPost with our custom fields
interface Room extends WPPost {
  acf?: RoomACF;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text?: string;
    }>;
  };
}

// Helper function to get room data
async function getRoomBySlug(slug: string): Promise<Room | undefined> {
  const rooms = await api.getRooms();
  return rooms.find((r: WPPost): r is Room => {
    if (!r.acf) return false;
    return r.slug === slug;
  }) as unknown as Room | undefined;
}

// Generate metadata with proper type safety
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);

  if (!room) {
    return {
      title: 'Room Not Found | Rabaul Hotel',
      description: 'The requested room could not be found.',
    };
  }

  const title = room.title?.rendered || 'Luxury Room';
  const description = room.excerpt?.rendered 
    ? room.excerpt.rendered.replace(/<[^>]*>?/gm, '').substring(0, 160)
    : 'Experience luxury accommodation with our premium rooms.';

  return {
    title: `${title} | Rabaul Hotel`,
    description,
    openGraph: {
      title: room.title?.rendered || 'Luxury Room',
      description,
      type: 'website',
    },
  };
}

export default async function RoomDetailPage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const { slug } = params instanceof Promise ? await params : params;
  const room = await getRoomBySlug(slug);
  
  if (!room) {
    notFound();
  }

  // Get the custom images from ACF
  const customImages = [
    room.acf?.['image_1'],
    room.acf?.['image_2'],
    room.acf?.['image_3']
  ].filter((img): img is { url: string; alt: string } => Boolean(img));

  // Add featured image as fallback
  const images = [...customImages];
  if (images.length < 4 && room._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    const featuredMedia = room._embedded['wp:featuredmedia'][0];
    images.unshift({
      url: featuredMedia.source_url,
      alt: featuredMedia.alt_text || room.title?.rendered || 'Room Image'
    });
  }

  // Ensure we have at least 4 images
  while (images.length < 4 && images[0]) {
    images.push(images[0]);
  }

  // Extract amenities from ACF if they exist
  const amenities = room.acf?.['amenities']?.map((amenity: { name: string }) => amenity.name) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/#rooms" className="inline-flex items-center text-green-900 hover:text-green-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <h2 className='text-xl font-semibold'>Back to Rooms</h2>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Images */}
          <div className="lg:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              {images.slice(0, 4).map((img, index) => (
                <div 
                  key={index} 
                  className="relative aspect-square rounded-lg overflow-hidden shadow-md"
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    priority={index < 2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:w-1/2 space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {room.title?.rendered || 'Luxury Room'}
              </h1>
              {room.acf?.['price'] !== undefined && (
                <p className="text-2xl font-semibold text-green-900 mb-6">
                  {formatPrice(room.acf['price'])} <span className="text-lg text-gray-600">/ night</span>
                </p>
              )}
              
              {/* Room Description */}
              <div className="prose max-w-none mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Room Description</h2>
                {room.content?.rendered ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: room.content.rendered }} 
                    className="text-gray-600"
                  />
                ) : (
                  <p className="text-gray-600">No description available for this room.</p>
                )}
              </div>

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-green-900">•</span>
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Booking Form */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Booking Information</h3>
              <BookingForm roomType={'conference'} />
              <button 
                type="submit"
                className="w-full bg-green-900 text-white py-3 px-6 rounded-md hover:bg-green-800 transition-colors font-medium text-lg mt-4"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static paths at build time
export async function generateStaticParams() {
  const rooms = await api.getRooms();
  return rooms.map((room: WPPost) => ({
    slug: room.slug,
  }));
}

// Enable fallback for non-generated paths
export const dynamicParams = true;
export const dynamic = 'force-static';