'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Scroll to top when component mounts
const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
};

// Define types for our gallery items
type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  category: string;
  title: string;
};

// Sample gallery data - replace with your actual images
const galleryItems: GalleryItem[] = [
  // Rooms
  {
    id: 'room-1',
    src: '/images/rooms/room1.jpg',
    alt: 'Deluxe Room',
    category: 'rooms',
    title: 'Deluxe Room with Ocean View'
  },
  {
    id: 'room-2',
    src: '/images/rooms/room2.jpg',
    alt: 'Executive Suite',
    category: 'rooms',
    title: 'Executive Suite'
  },
  
  // Amenities
  {
    id: 'amenity-1',
    src: '/images/amenities/pool.jpg',
    alt: 'Swimming Pool',
    category: 'amenities',
    title: 'Infinity Pool'
  },
  {
    id: 'amenity-2',
    src: '/images/amenities/spa.jpg',
    alt: 'Spa',
    category: 'amenities',
    title: 'Luxury Spa'
  },
  
  // Explore Rabaul
  {
    id: 'explore-1',
    src: '/images/explore/volcano.jpg',
    alt: 'Tavurvur Volcano',
    category: 'explore',
    title: 'Tavurvur Volcano'
  },
  {
    id: 'explore-2',
    src: '/images/explore/harbor.jpg',
    alt: 'Simpson Harbour',
    category: 'explore',
    title: 'Simpson Harbour at Sunset'
  },
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
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage(item)}
            >
              <div className="aspect-w-16 aspect-h-10 w-full">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div className="text-white">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm opacity-90">
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
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
