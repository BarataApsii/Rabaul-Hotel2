'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';


// Define types for our gallery items
type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  category: string;
  title: string;
  slug?: string; // Optional slug for room items
};

// Helper function to get room slug from title
const getRoomSlug = (title: string): string => {
  return title.toLowerCase().replace(/\s+/g, '-');
};

// Sample gallery data using actual image paths
const galleryItems: GalleryItem[] = [
  // Rooms
  {
    id: 'budget-room',
    src: '/images/rooms/budget-room.PNG',
    alt: 'Budget Room',
    category: 'rooms',
    title: 'Budget Room',
    slug: 'budget-room'
  },
  {
    id: 'standard-room',
    src: '/images/rooms/standard-room.PNG',
    alt: 'Standard Room',
    category: 'rooms',
    title: 'Standard Room',
    slug: 'standard-room'
  },
  {
    id: 'executive-room',
    src: '/images/rooms/executive-room.PNG',
    alt: 'Executive Room',
    category: 'rooms',
    title: 'Executive Room',
    slug: 'executive-room'
  },
  
  // Amenities
  {
    id: 'conference-room',
    src: '/images/amenities/conference-room.PNG',
    alt: 'Conference Room',
    category: 'amenities',
    title: 'Conference Room'
  },
  {
    id: 'room-service',
    src: '/images/amenities/room-services.png',
    alt: 'Room Service',
    category: 'amenities',
    title: '24/7 Room Service'
  },
  
  // Explore Rabaul
  {
    id: 'beach',
    src: '/videos/beach.mp4',
    alt: 'Beach View',
    category: 'explore',
    title: 'Scenic Beach Views'
  }
];

// Get unique categories
const categories = ['all', ...new Set(galleryItems.map(item => item.category))];


export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-700 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Gallery</h1>
          <p className="text-xl text-gray-600">Experience the beauty of Rabaul through our collection of images</p>
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
          {filteredItems.map((item) => {
            const isRoom = item.category === 'rooms';
            const slug = item.slug || getRoomSlug(item.title);
            
            const content = (
              <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-16 aspect-h-10 w-full">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
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
                key={item.id}
                whileHover={{ scale: 1.02 }}
                onClick={(e) => {
                  if (!isRoom) {
                    e.preventDefault();
                    setSelectedImage(item);
                  }
                }}
                className="cursor-pointer"
              >
                {isRoom ? (
                  <Link href={`/rooms/${slug}`}>
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl w-full">
              <button 
                className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                ✕
              </button>
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="mt-4 text-white text-center">
                <h3 className="text-xl font-semibold">{selectedImage.title}</h3>
                <p className="text-gray-300">
                  {selectedImage.category.charAt(0).toUpperCase() + selectedImage.category.slice(1)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
