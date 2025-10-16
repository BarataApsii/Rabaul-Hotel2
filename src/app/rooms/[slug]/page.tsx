import { api, WPPost } from '@/lib/api';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils/format';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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

// Define the params type for the page
interface RoomPageParams {
  slug: string;
}

// Define the props for the page component
interface RoomDetailPageProps {
  params: RoomPageParams;
}

// Generate metadata
export async function generateMetadata({ params }: { params: RoomPageParams }) {
  const rooms = await api.getRooms();
  const room = rooms.find((r: WPPost): r is Room => {
    if (!r.acf) return false;
    return r.slug === params.slug;
  }) as unknown as Room | undefined;

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

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  // Fetch rooms
  const rooms = await api.getRooms();
  const room = rooms.find((r: WPPost): r is Room => {
    if (!r.acf) return false;
    return r.slug === params.slug;
  }) as unknown as Room | undefined;

  if (!room) {
    notFound();
  }

  // Get the three custom images from ACF
  const customImages = [
    room.acf?.['image_1'],
    room.acf?.['image_2'],
    room.acf?.['image_3']
  ].filter((img): img is { url: string; alt: string } => Boolean(img));

  // Add featured image as fallback if we don't have all three custom images
  const images = [...customImages];
  
  if (images.length < 3 && room._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    const featuredMedia = room._embedded['wp:featuredmedia'][0];
    images.unshift({
      url: featuredMedia.source_url,
      alt: featuredMedia.alt_text || room.title?.rendered || 'Room Image'
    });
  }

  // Extract amenities from ACF if they exist
  const amenities = room.acf?.['amenities']?.map((amenity: { name: string }) => amenity.name) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/#rooms" className="inline-flex items-center text-green-900 hover:text-green-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Rooms
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-64 bg-gray-800">
        {images[0] && (
          <Image
            src={images[0].url}
            alt={images[0].alt}
            fill
            className="object-cover opacity-80"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
              {room.title?.rendered || 'Luxury Room'}
            </h1>
            {room.acf?.['price'] !== undefined && (
              <p className="text-xl font-semibold text-amber-400">
                {formatPrice(room.acf['price'])} <span className="text-white text-base">/ night</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Room Header */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            {room.title?.rendered || 'Luxury Room'}
          </h1>
          {room.acf?.['price'] !== undefined && (
            <p className="text-xl font-semibold text-green-900 mb-4">
              {formatPrice(room.acf['price'])} per night
            </p>
          )}
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="container mx-auto px-4 mt-6 max-w-4xl">
            <div className="grid grid-cols-3 gap-2">
              {images.slice(0, 3).map((img, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden shadow-sm hover:shadow transition-shadow">
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 30vw, 200px"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Room Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Room Description */}
            <div className="prose max-w-none">
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
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-green-900">•</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="lg:sticky lg:top-8 self-start">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Book This Room</h3>
              <div className="space-y-4">
                {room.acf?.['price'] !== undefined && (
                  <div className="text-center py-4 bg-gray-50 rounded-md">
                    <p className="text-2xl font-bold text-green-900">
                      {formatPrice(room.acf['price'])}
                    </p>
                    <p className="text-sm text-gray-500">per night</p>
                  </div>
                )}
                <button className="w-full bg-green-900 text-white py-3 px-6 rounded-md hover:bg-green-800 transition-colors">
                  Check Availability
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static paths at build time
export async function generateStaticParams() {
  const rooms = await api.getRooms() as WPPost[];
  return rooms.map((room: WPPost) => ({
    slug: room.slug,
  }));
}

// Enable fallback for non-generated paths
export const dynamicParams = true;
export const dynamic = 'force-static';