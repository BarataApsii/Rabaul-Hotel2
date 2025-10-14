import { notFound } from 'next/navigation';
import { api, WPPost } from '@/lib/api';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { BookingFormWrapper } from './BookingFormWrapper';
import Link from 'next/link';
import { ArrowLeft, Bed, Users, Ruler, MapPin, Wifi, Tv, Coffee, Wind } from 'lucide-react';
import { BookingForm } from '@/components/forms/BookingForm';

// Add this after the imports
type Amenity = 
  | string 
  | { 
      id: number;
      title: { rendered: string };
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
  if (typeof amenity === 'string') {
    return amenity;
  }
  
  // Handle ACF relationship object
  if ('title' in amenity && amenity.title) {
    if (typeof amenity.title === 'string') {
      return amenity.title;
    }
    if (typeof amenity.title === 'object' && 'rendered' in amenity.title) {
      return amenity.title.rendered;
    }
  }
  
  // Handle direct name property
  if ('name' in amenity && amenity.name) {
    return amenity.name;
  }
  
  console.warn('Could not determine amenity text for:', amenity);
  return 'Amenity';
};

interface RoomDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  // Fetch rooms
  const rooms = await api.getRooms();
  const room = rooms.find(r => r.slug === params.slug);

  if (!room) {
    notFound();
  }

  // Get the three custom images from ACF
  const customImages = [
    room.acf?.image_1,
    room.acf?.image_2,
    room.acf?.image_3
  ].filter(Boolean); // Remove any undefined/null values

  // Add featured image as fallback if we don't have all three custom images
  const images = [...customImages];
  
  if (images.length < 3 && room._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    const featuredMedia = room._embedded['wp:featuredmedia'][0];
    images.unshift({
      url: featuredMedia.source_url,
      alt: (featuredMedia as any)?.alt_text || room.title.rendered
    });
  }

  // No default amenities - use an empty array
  const finalAmenities: string[] = [];

  return (
    <div className="bg-gray-50 min-h-screen">
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
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{room.title.rendered}</h1>
            {room.acf?.price && (
              <p className="text-xl font-semibold text-amber-400">
                {formatPrice(room.acf.price)} <span className="text-white text-base">/ night</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Room Header */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            {room.title.rendered}
          </h1>
          {room.acf?.price && (
            <p className="text-xl font-semibold text-green-900 mb-4">
              {formatPrice(room.acf.price)} per night
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
                    alt={img.alt || `${room.title.rendered} - Image ${index + 1}`}
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

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Booking Form - Mobile Only */}
            <div className="lg:hidden bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Book This Room</h3>
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
                  <p className="font-medium">{room.acf?.guests || '2'} {room.acf?.guests === '1' ? 'Guest' : 'Guests'}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                <Ruler className="w-5 h-5 text-green-900 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Size</p>
                  <p className="font-medium">{room.acf?.size || '25'} m²</p>
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
                  {images.slice(1).map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                        quality={75}
                        loading={index > 2 ? 'lazy' : 'eager'}
                        priority={index < 3}
                      />
                    </div>
                  ))}
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
