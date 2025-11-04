'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

// Define types for our gallery items
type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  category: string;
  title: string;
  slug?: string; // Optional slug for room items
  type?: 'image' | 'video';
};

// Helper function to get room slug from title
const getRoomSlug = (title: string): string => {
  return title.toLowerCase().replace(/\s+/g, '-');
};

// Default categories that will always be available
const defaultCategories = ['all', 'rooms', 'amenities', 'explore'];

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  // Fetch gallery items from WordPress
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        console.log('Starting to fetch gallery items...');
        
        // First, check if we're in a browser environment
        if (typeof window === 'undefined') {
          const errorMsg = 'Cannot fetch gallery in server environment';
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
        
        console.log('Fetching from /api/gallery...');
        const response = await fetch('/api/gallery');
        console.log('API Response status:', response.status, response.statusText);
        
        if (!response.ok) {
          let errorMsg = `Failed to fetch gallery images: ${response.status} ${response.statusText}`;
          
          try {
            const errorData = await response.json() as { error?: string; message?: string };
            console.error('API Error response:', errorData);
            
            if (errorData?.error) {
              errorMsg = errorData.error;
            } else if (errorData?.message) {
              errorMsg = errorData.message;
            }
          } catch (e) {
            console.error('Failed to parse error response:', e);
          }
          console.error('API Error:', errorMsg);
          throw new Error(errorMsg);
        }
        
        let wpItems: Array<{
          id: string;
          src: string;
          alt: string;
          category: string;
          title: string;
        }> = [];
        
        try {
          console.log('Parsing response JSON...');
          const responseData = await response.json();
          console.log('Raw API response data:', responseData);
          
          // Make sure wpItems is an array
          wpItems = Array.isArray(responseData) ? responseData : [];
          console.log(`Successfully parsed ${wpItems.length} gallery items from API`);
        } catch (e) {
          const errorMsg = 'Failed to parse gallery API response';
          console.warn(errorMsg, e);
          // Continue with empty array to show static content only
          wpItems = [];
        }
        
        // Combine WordPress items with static items
        const staticItems: GalleryItem[] = [
          // Rooms
          {
            id: 'budget-room',
            src: '/images/rooms/budget-room.PNG',
            alt: 'Budget Room',
            category: 'rooms',
            title: 'Budget Room',
            slug: 'budget-room',
            type: 'image'
          },
          {
            id: 'standard-room',
            src: '/images/rooms/standard-room.PNG',
            alt: 'Standard Room',
            category: 'rooms',
            title: 'Standard Room',
            slug: 'standard-room',
            type: 'image'
          },
          {
            id: 'executive-room',
            src: '/images/rooms/executive-room.PNG',
            alt: 'Executive Room',
            category: 'rooms',
            title: 'Executive Room',
            slug: 'executive-room',
            type: 'image'
          },
          // Amenities
          {
            id: 'conference-room',
            src: '/images/amenities/conference-room.PNG',
            alt: 'Conference Room',
            category: 'amenities',
            title: 'Conference Room',
            type: 'image'
          },
          {
            id: 'room-service',
            src: '/images/amenities/room-services.png',
            alt: 'Room Service',
            category: 'amenities',
            title: '24/7 Room Service',
            type: 'image'
          },
          // Explore
          {
            id: 'beach',
            src: '/videos/beach.mp4',
            alt: 'Beach View',
            category: 'explore',
            title: 'Scenic Beach Views',
            type: 'video'
          }
        ];
        
        // Combine WordPress items with static items, ensuring no duplicates by ID
        const combinedItems = [
          ...staticItems,
          ...wpItems.filter(wpItem => 
            !staticItems.some(staticItem => staticItem.id === wpItem.id)
          )
        ];

        setGalleryItems(combinedItems);
        
        // Update categories based on available items
        const itemCategories = [...new Set([
          ...defaultCategories,
          ...staticItems.map(item => item.category)
        ])];
        setCategories(itemCategories);
        
      } catch (err) {
        console.error('Error loading gallery:', err);
        setError('Failed to load gallery. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-700">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Gallery</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center font-bold text-primary hover:text-primary/90 transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Gallery</h1>
          <p className="text-xl text-gray-600">Experience the beauty of Rabaul through our collection of images and videos.</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const isRoom = item.category === 'rooms';
              const isVideo = item.type === 'video' || item.src.endsWith('.mp4');
              const slug = item.slug || getRoomSlug(item.title);
              
              const content = (
                <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
                  <div className="aspect-w-16 aspect-h-10 w-full h-64">
                    {isVideo ? (
                      <video 
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                      >
                        <source src={item.src} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <Image
                        src={item.src}
                        alt={item.alt}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                        unoptimized={item.src.startsWith('http')} // For external images
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                    <div className="text-right">
                      <span className="inline-block bg-white/90 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-white">{item.title}</h3>
                      {isRoom && (
                        <span className="text-sm text-white/90 flex items-center">
                          View Details <ArrowRight className="w-4 h-4 ml-1" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );

              return (
                <motion.div 
                  key={`${item.id}-${item.category}`}
                  whileHover={{ scale: 1.02 }}
                  onClick={(e) => {
                    if (!isRoom) {
                      e.preventDefault();
                      setSelectedImage(item);
                    }
                  }}
                  className="cursor-pointer h-full"
                >
                  {isRoom ? (
                    <Link href={`/rooms/${slug}`} className="h-full block">
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No images found in this category.</p>
            </div>
          )}
        </div>

        {/* Image/Video Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-6xl w-full max-h-[90vh]">
              <button 
                className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 z-10 p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                ✕ Close
              </button>
              
              <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
                {selectedImage.type === 'video' || selectedImage.src.endsWith('.mp4') ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <video 
                      className="max-w-full max-h-[80vh]"
                      autoPlay
                      controls
                      loop
                      playsInline
                    >
                      <source src={selectedImage.src} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image
                      src={selectedImage.src}
                      alt={selectedImage.alt}
                      width={1200}
                      height={800}
                      className="max-w-full max-h-[80vh] object-contain"
                      unoptimized={selectedImage.src.startsWith('http')}
                    />
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 to-transparent p-6 pt-12">
                  <div className="text-white text-center">
                    <h3 className="text-2xl font-semibold mb-1">{selectedImage.title}</h3>
                    <p className="text-gray-300 text-sm">
                      {selectedImage.category.charAt(0).toUpperCase() + selectedImage.category.slice(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
