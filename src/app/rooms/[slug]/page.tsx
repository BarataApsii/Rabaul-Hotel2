import { notFound } from 'next/navigation';
import { api, WPPost } from '@/lib/api';
import Image, { StaticImageData } from 'next/image';
import { formatPrice } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { BookingFormWrapper } from './BookingFormWrapper';
import Link from 'next/link';
import { ArrowLeft, Bed, Users, Ruler, MapPin, Wifi, Tv, Coffee, Wind } from 'lucide-react';
import { BookingForm } from '@/components/forms/BookingForm';
import { ReactNode } from 'react';

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
        sizes: Record<string, any>;
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

// Helper component to safely render content
interface SafeRenderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const SafeRender: React.FC<SafeRenderProps> = ({ children, fallback = null }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Error in SafeRender:', error);
    return <>{fallback}</>;
  }
};

type Amenity = 
  | string 
  | { 
      id: number;
      title: { rendered: string } | string;
      acf?: {
        icon?: string;
        description?: string;
      };
    } 
  | { 
      name: string;
      id?: number;
      title?: { rendered: string } | string;
    };

// Helper function to get amenity text
const getAmenityText = (amenity: Amenity): string => {
  if (!amenity) return '';
  if (typeof amenity === 'string') return amenity;
  
  if ('title' in amenity && amenity.title) {
    if (typeof amenity.title === 'string') return amenity.title;
    if (typeof amenity.title === 'object' && 'rendered' in amenity.title) {
      return amenity.title.rendered;
    }
  }
  
  if ('name' in amenity) return amenity.name;
  
  return 'Amenity';
};

interface RoomDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
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
      typeof (img as any).url === 'string' &&
      'alt' in img &&
      typeof (img as any).alt === 'string'
    );
  };

  // Get the three custom images from ACF
  const customImages: ImageType[] = [
    room.acf?.image_1,
    room.acf?.image_2,
    room.acf?.image_3
  ].filter(isImageType);

  // Add featured image as fallback if we don't have all three custom images
  const images: ImageType[] = [...customImages];
  
  if (images.length < 3 && room._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    const featuredMedia = room._embedded['wp:featuredmedia'][0];
    images.unshift({
      url: featuredMedia.source_url,
      alt: featuredMedia.alt_text || room.title.rendered || 'Room image'
    });
  }

  // No default amenities - use an empty array
  const finalAmenities: string[] = [];

  // Helper function to safely access room.acf properties with type safety
  const getRoomAcf = <T extends keyof RoomACF>(
    key: T,
    defaultValue: RoomACF[T]
  ): RoomACF[T] => {
    return room.acf && key in room.acf ? room.acf[key] : defaultValue;
  };

  // Helper function to safely render price
  const renderPrice = (price?: string | number | null) => {
    if (price === undefined || price === null) return null;
    
    const priceStr = typeof price === 'number' ? price.toString() : price;
    const formattedPrice = formatPrice(priceStr);
      
    return (
      <p className="text-xl font-semibold text-green-900 mb-4">
        {formattedPrice} <span className="text-gray-500 text-sm">/ night</span>
      </p>
    );
  };

  // Helper component to safely render content
  const SafeRender = ({ 
    children,
    fallback = null 
  }: { 
    children: ReactNode; 
    fallback?: ReactNode 
  }) => {
    try {
      return <>{children}</>;
    } catch (error) {
      console.error('Error in SafeRender:', error);
      return <>{fallback}</>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/#rooms" 
            className="inline-flex items-center text-green-900 hover:text-green-700 transition-colors"
            aria-label="Back to Rooms"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Rooms
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-64 bg-gray-800">
        <SafeRender>
          <>
            {images[0]?.url && (
              <Image
                src={images[0].url}
                alt={images[0].alt || room.title.rendered}
                fill
                className="object-cover opacity-80"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white text-center px-4">
                {room.title.rendered}
              </h1>
            </div>
          </>
        </SafeRender>
      </div>

      {/* Room Header */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            {room.title.rendered}
          </h1>
          {room.acf?.price && (
            <p className="text-xl font-semibold text-green-900 mb-4">
              {formatPrice(room.acf.price.toString())} per night
            </p>
          )}
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="container mx-auto px-4 mt-6 max-w-4xl">
            <div className="grid grid-cols-3 gap-2">
              {images.slice(0, 3).map((img, index) => {
                if (!isImageType(img)) return null;
                return (
                  <div key={index} className="relative aspect-square rounded-md overflow-hidden shadow-sm hover:shadow transition-shadow">
                    <Image
                      src={img.url}
                      alt={img.alt || `${room.title.rendered || 'Room'} - Image ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 30vw, 200px"
                      priority={index === 0}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Booking Form - Mobile Only */}
            <div className="lg:hidden bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Book This Room.</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="check-in" className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in
                    </label>
                    <input
                      type="date"
                      id="check-in"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label htmlFor="check-out" className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out
                    </label>
                    <input
                      type="date"
                      id="check-out"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-1">
                      Adults
                    </label>
                    <select
                      id="adults"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                      defaultValue="1"
                    >
                      {[1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Adult' : 'Adults'}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-1">
                      Children
                    </label>
                    <select
                      id="children"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                      defaultValue="0"
                    >
                      {[0, 1, 2, 3].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Child' : 'Children'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-900 text-white py-3 px-6 rounded-md hover:bg-green-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-900"
                >
                  Book Now
                </button>
              </form>
            </div>

            {/* Room Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                <Bed className="w-5 h-5 text-green-900 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Bed Type</p>
                  <p className="font-medium">{room.acf?.bed_type || 'King/Queen'}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                <Users className="w-5 h-5 text-green-900 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Guests</p>
                  <p className="font-medium">
                    {renderGuestCount(room.acf?.guests || room.acf?.max_guests)}
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                <Ruler className="w-5 h-5 text-green-900 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Size</p>
                  <p className="font-medium">
                    {renderSize(room.acf?.size || room.acf?.room_size)}
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                <MapPin className="w-5 h-5 text-green-900 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">View</p>
                  <p className="font-medium">{room.acf?.view || 'Garden'}</p>
                </div>
              </div>
            </div>

            {/* Room Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Room Description</h2>
              <div 
                className="prose max-w-none [&>p]:text-gray-600 [&>p]:mb-4"
                dangerouslySetInnerHTML={{ __html: room.content.rendered }} 
              />
            </div>

            {/* Image Gallery */}
            {images.length > 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.slice(1).map((img, index) => {
                    if (!isImageType(img)) return null;
                    return (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                        {img.url && (
                          <Image
                            src={img.url}
                            alt={img.alt || `${room.title.rendered || 'Room'} - Image ${index + 1}`}
                            fill
                            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 25vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                            quality={75}
                            loading={index > 2 ? 'lazy' : 'eager'}
                            priority={index < 3}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-6">
              <BookingFormWrapper 
                roomId={room.id.toString()}
                roomTitle={room.title.rendered}
                price={typeof room.acf?.price === 'string' ? parseFloat(room.acf.price) : (room.acf?.price || 0)}
              />
            </div>

            {/* Room Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Room Details</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-green-900 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Max Occupancy</p>
                    <p className="text-sm text-gray-500">
                      {room.acf?.max_guests || '2'} {room.acf?.max_guests === 1 ? 'Guest' : 'Guests'}
                    </p>
                  </div>
                </div>
                {room.acf?.room_size && (
                  <div className="flex items-start">
                    <Ruler className="h-5 w-5 text-green-900 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Room Size</p>
                      <p className="text-sm text-gray-500">{room.acf.room_size}</p>
                    </div>
                  </div>
                )}
                {room.acf?.view && (
                  <div className="flex items-start">
                    <svg 
                      className="h-5 w-5 text-green-900 mr-3 mt-0.5 flex-shrink-0" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-700">View</p>
                      <p className="text-sm text-gray-500">{room.acf.view}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Room Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                <Bed className="w-5 h-5 text-green-900 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Bed Type</p>
                  <p className="font-medium">{room.acf?.bed_type || 'King/Queen'}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4">Amenities</h3>
                <div className="space-y-3">
                  {finalAmenities.map((amenity: Amenity, index: number) => {
                    const amenityText = getAmenityText(amenity);
                    const lowerAmenity = amenityText.toLowerCase();
                    
                    // Check if this is an ACF amenity with a custom icon
                    const isAcfAmenity = typeof amenity === 'object' && 'acf' in amenity;
                    
                    // Default icon (can be overridden by ACF icon or by the mapping below)
                    let icon = isAcfAmenity && amenity.acf?.icon ? (
                      <span dangerouslySetInnerHTML={{ __html: amenity.acf.icon }} />
                    ) : (
                      <Wifi className="w-5 h-5 text-green-900" />
                    );
                    
                    // Only use the default icon mapping if no ACF icon is provided
                    if (!isAcfAmenity || !amenity.acf?.icon) {
                      if (lowerAmenity.includes('wifi') || lowerAmenity.includes('wi-fi')) {
                        icon = <Wifi className="w-5 h-5 text-green-900" />;
                      } else if (lowerAmenity.includes('tv') || lowerAmenity.includes('television')) {
                        icon = <Tv className="w-5 h-5 text-green-900" />;
                      } else if (lowerAmenity.includes('coffee') || lowerAmenity.includes('tea')) {
                        icon = <Coffee className="w-5 h-5 text-green-900" />;
                      } else if (lowerAmenity.includes('air') || lowerAmenity.includes('conditioning')) {
                        icon = <Wind className="w-5 h-5 text-green-900" />;
                      } else if (lowerAmenity.includes('bed')) {
                        icon = <Bed className="w-5 h-5 text-green-900" />;
                      } else if (lowerAmenity.includes('bath') || lowerAmenity.includes('shower') || lowerAmenity.includes('toilet')) {
                        icon = <Users className="w-5 h-5 text-green-900" />;
                      }
                    }
                    
                    return (
                      <div key={`${typeof amenity === 'object' && 'id' in amenity ? amenity.id : index}`} className="flex items-center">
                        <div className="w-6 mr-2 flex-shrink-0">
                          {icon}
                        </div>
                        <span className="text-gray-700">
                          {amenityText}
                          {isAcfAmenity && amenity.acf?.description && (
                            <span className="block text-sm text-gray-500">{amenity.acf.description}</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Rooms */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rooms
              .filter(r => r.id !== room.id)
              .slice(0, 3)
              .map((similarRoom) => (
                <div key={similarRoom.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48">
                    {similarRoom._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                      <Image
                        src={similarRoom._embedded['wp:featuredmedia'][0].source_url}
                        alt={similarRoom.title.rendered}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{similarRoom.title.rendered}</h3>
                    {similarRoom.acf?.price && (
                      <p className="text-green-900 font-medium mb-3">
                        {formatPrice(similarRoom.acf.price)} <span className="text-gray-500 text-sm">/ night</span>
                      </p>
                    )}
                    <Link 
                      href={`/rooms/${similarRoom.slug}`}
                      className="text-green-900 hover:underline font-medium inline-flex items-center"
                    >
                      View Details <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static paths at build time
export async function generateStaticParams() {
  try {
    console.log('Generating static params for rooms...');
    const rooms = await api.getRooms();
    
    if (!Array.isArray(rooms)) {
      console.error('Expected rooms to be an array, got:', typeof rooms);
      return [];
    }
    
    console.log(`Found ${rooms.length} rooms`);
    
    // Log the first few rooms for debugging
    console.log('Sample rooms:', rooms.slice(0, 3).map(r => ({
      id: r.id,
      slug: r.slug,
      title: r.title?.rendered
    })));
    
    // Filter out any rooms without a valid slug
    const validRooms = rooms.filter(room => {
      if (!room.slug) {
        console.warn('Room missing slug:', {
          id: room.id,
          title: room.title?.rendered
        });
        return false;
      }
      return true;
    });
    
    console.log(`Found ${validRooms.length} valid rooms with slugs`);
    
    if (validRooms.length === 0) {
      console.warn('No valid rooms found with slugs, using fallback');
      return [{ slug: 'standard-room' }];
    }
    
    const params = validRooms.map(room => ({
      slug: room.slug,
    }));
    
    console.log('Generated params:', params);
    return params;
    
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [{ slug: 'standard-room' }];
  }
}

// Enable fallback for non-generated paths
export const dynamicParams = true;

export const dynamic = 'force-static';

// Set revalidation time (in seconds)
export const revalidate = 3600; // Revalidate every hour
