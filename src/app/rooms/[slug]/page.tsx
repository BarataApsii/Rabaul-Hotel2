import { notFound } from 'next/navigation';
import { api, WPPost } from '@/lib/api';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Bed, Users, Ruler, Calendar, MapPin, Wifi, Tv, Coffee, Wind } from 'lucide-react';

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
    const featuredMedia = room._embedded['wp:featuredmedia'][0];
    images.push({
      url: featuredMedia.source_url,
      alt: (featuredMedia as any)?.alt_text || room.title.rendered
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

  // Default amenities if none provided
  const defaultAmenities = [
    'Air Conditioning',
    'Free WiFi',
    'Flat-screen TV',
    'Mini Bar',
    'Safe',
    'Hair Dryer',
    'Coffee/Tea Maker',
    'Telephone',
    'Work Desk',
    'Bathrobes',
    'Slippers',
    'Toiletries'
  ];

  const amenities = room.acf?.amenities?.length ? room.acf.amenities : defaultAmenities;

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
      <div className="relative h-96 bg-gray-800">
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
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{room.title.rendered}</h1>
            {room.acf?.price && (
              <p className="text-2xl font-semibold text-amber-400">
                {formatPrice(room.acf.price)} <span className="text-white text-lg">/ night</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.slice(1).map((img, index) => (
                    <div key={index} className="relative h-48 md:h-56 rounded-lg overflow-hidden group">
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Booking Widget */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Book This Room</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-900 focus:border-transparent"
                      />
                      <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-900 focus:border-transparent"
                      />
                      <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                    <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-900 focus:border-transparent">
                      {[1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button className="w-full bg-green-900 hover:bg-green-800 h-12 text-lg">
                    Book Now
                  </Button>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4">Amenities</h3>
                <div className="space-y-3">
                  {amenities.map((amenity: string, index: number) => {
                    let icon = <Wifi className="w-5 h-5 text-green-900" />;
                    
                    // Map common amenities to icons
                    if (amenity.toLowerCase().includes('wifi')) {
                      icon = <Wifi className="w-5 h-5 text-green-900" />;
                    } else if (amenity.toLowerCase().includes('tv')) {
                      icon = <Tv className="w-5 h-5 text-green-900" />;
                    } else if (amenity.toLowerCase().includes('coffee') || amenity.toLowerCase().includes('tea')) {
                      icon = <Coffee className="w-5 h-5 text-green-900" />;
                    } else if (amenity.toLowerCase().includes('air') || amenity.toLowerCase().includes('conditioning')) {
                      icon = <Wind className="w-5 h-5 text-green-900" />;
                    }
                    
                    return (
                      <div key={index} className="flex items-center">
                        <div className="w-6 mr-2">
                          {icon}
                        </div>
                        <span className="text-gray-700">{amenity}</span>
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
