import { api, WPPost } from '@/lib/api';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils/format';
import { BookingFormWrapper } from './BookingFormWrapper';
import Link from 'next/link';
import { ArrowLeft, Bed, Users, Ruler, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

// Define proper types for the room and its properties
interface ImageType {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

interface RoomACF {
  price?: string | number | null;
  max_guests?: number | string;
  guests?: number | string;
  size?: string | number;
  room_size?: string | number;
  bed_type?: string;
  view?: string;
  image_1?: ImageType;
  image_2?: ImageType;
  image_3?: ImageType;
  [key: string]: unknown; // For any other ACF fields
}

// Helper function to safely render guest count
const renderGuestCount = (guests?: number | string) => {
  const count = guests ? Number(guests) : 2;
  return `${count} ${count === 1 ? 'Guest' : 'Guests'}`;
};

// Helper function to safely render size
const renderSize = (size?: string | number) => {
  return size ? `${size} m²` : '25 m²';
};

// Extend WPPost with our custom fields
interface Room extends Omit<WPPost, '_embedded'> {
  acf?: RoomACF;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      alt_text?: string;
      media_details?: {
        width: number;
        height: number;
        file: string;
        filesize: number;
        sizes: Record<string, unknown>;
      };
    }>;
  };
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  slug: string;
  id: number;
}

// Page configuration
export const dynamic = 'force-static';
export const dynamicParams = false; // Return 404 for unknown routes

type RoomDetailPageProps = {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: RoomDetailPageProps
): Promise<Metadata> {
  const rooms = await api.getRooms() as Room[];
  const room = rooms.find((r: Room) => r.slug === params.slug);

  if (!room) {
    return {
      title: 'Room Not Found',
      description: 'The requested room could not be found.'
    };
  }

  return {
    title: room.title.rendered,
    description: room.content.rendered.replace(/<[^>]*>?/gm, '').substring(0, 160),
    openGraph: {
      title: room.title.rendered,
      description: room.content.rendered.replace(/<[^>]*>?/gm, '').substring(0, 160),
      type: 'website',
    },
  };
}

export default async function RoomDetailPage({ params }: { params: { slug: string } }) {
  // Fetch rooms with proper typing
  const rooms = await api.getRooms() as Room[];
  const room = rooms.find((r: Room) => r.slug === params.slug);

  // Handle case when room is not found
  if (!room) {
    return <div className="container mx-auto p-8">Room not found</div>;
  }

  // Ensure room has required properties
  if (!room.title?.rendered || !room.content?.rendered) {
    return <div className="container mx-auto p-8">Invalid room data</div>;
  }

  // Type guard for ImageType
  const isImageType = (img: unknown): img is ImageType => {
    return Boolean(
      img &&
      typeof img === 'object' &&
      'url' in img && 
      typeof (img as { url: unknown }).url === 'string' &&
      'alt' in img &&
      typeof (img as { alt: unknown }).alt === 'string'
    );
  };

  // Get the three custom images from ACF
  const customImages: ImageType[] = [
    room.acf?.image_1,
    room.acf?.image_2,
    room.acf?.image_3
  ].filter((img): img is ImageType => isImageType(img));

  // Add featured image as fallback if we don't have all three custom images
  const images: ImageType[] = [...customImages];
  
  if (images.length < 3 && room._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    const featuredMedia = room._embedded['wp:featuredmedia'][0];
    images.unshift({
      url: featuredMedia.source_url,
      alt: featuredMedia.alt_text || room.title.rendered || 'Room image'
    });
  }

  // Room features data
  const features = [
    {
      icon: Bed,
      label: 'Bed Type',
      value: room.acf?.bed_type || 'King/Queen'
    },
    {
      icon: Users,
      label: 'Max Guests',
      value: renderGuestCount(room.acf?.max_guests || room.acf?.guests)
    },
    {
      icon: Ruler,
      label: 'Room Size',
      value: renderSize(room.acf?.size || room.acf?.room_size)
    },
    {
      icon: MapPin,
      label: 'View',
      value: room.acf?.view || 'Garden'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/rooms" 
          className="flex items-center text-green-900 hover:text-green-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Rooms
        </Link>
      </div>

      {/* Room Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {room.title.rendered}
        </h1>
        {room.acf?.price && (
          <p className="text-xl font-semibold text-green-900">
            {formatPrice(room.acf.price.toString())} <span className="text-gray-500 text-sm">/ night</span>
          </p>
        )}
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {images.map((img, index) => (
            <div key={index} className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Room Description */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Room Description</h2>
            <div 
              className="prose max-w-none [&>p]:text-gray-600 [&>p]:mb-4"
              dangerouslySetInnerHTML={{ __html: room.content.rendered }} 
            />
          </div>

          {/* Room Features */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Room Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <feature.icon className="w-5 h-5 text-green-900 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">{feature.label}</p>
                    <p className="font-medium">{feature.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:sticky lg:top-8 lg:h-fit">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">Book This Room</h3>
            <BookingFormWrapper 
              roomId={room.id.toString()}
              roomTitle={room.title.rendered}
              price={typeof room.acf?.price === 'string' ? parseFloat(room.acf.price) : (room.acf?.price || 0)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static paths at build time
export async function generateStaticParams() {
  const rooms = await api.getRooms() as Room[];
  return rooms.map((room: Room) => ({
    slug: room.slug,
  }));
}