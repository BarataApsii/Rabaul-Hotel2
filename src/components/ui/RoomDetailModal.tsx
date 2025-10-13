'use client';

import { FC, useEffect, useState } from 'react';
import { WPPost } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from '@/components/ui/dialog';
import Image from 'next/image';

interface RoomDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: WPPost | null;
}

const RoomDetailModal: FC<RoomDetailModalProps> = ({ isOpen, onClose, room }) => {
  const [roomImages, setRoomImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (room) {
      const defaultImage = '/images/room-placeholder.jpg'; // Fallback image path
      
      // Get the featured image as the main image
      const featuredImage = room._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
      
      // Get the 3 custom images from ACF
      const customImages = [
        room.acf?.image_1?.url,
        room.acf?.image_2?.url,
        room.acf?.image_3?.url
      ].filter(Boolean);

      // Combine featured image with custom images
      const allImages = [
        featuredImage,
        ...customImages
      ].filter(Boolean);

      // If no images found, use the default placeholder
      const imagesToShow = allImages.length > 0 ? allImages : [defaultImage];
      
      setRoomImages(imagesToShow);
      setSelectedImage(imagesToShow[0]);
    }
  }, [room]);

  if (!room) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="bg-black/10" />
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" style={{ color: '#1a5f2c' }}>
            {room.title.rendered}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <div className="relative h-96 w-full rounded-lg overflow-hidden">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={room.title.rendered}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail Navigation */}
            {roomImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {roomImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-24 w-full rounded-md overflow-hidden transition-opacity ${
                      selectedImage === img ? 'ring-2 ring-green-900' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${room.title.rendered} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Room Details */}
          <div className="lg:col-span-1">
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: room.content.rendered }} 
            />
            
            {room.acf && (
              <div className="mt-6 space-y-4">
                {room.acf.room_size && (
                  <div>
                    <h3 className="text-lg font-semibold">Room Size</h3>
                    <p>{room.acf.room_size} m²</p>
                  </div>
                )}
                
                {room.acf.max_guests && (
                  <div>
                    <h3 className="text-lg font-semibold">Max Guests</h3>
                    <p>{room.acf.max_guests} {parseInt(String(room.acf.max_guests)) > 1 ? 'Guests' : 'Guest'}</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {room.acf?.amenities?.map((amenity: string, index: number) => (
                  <span 
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-green-900 text-white rounded-md hover:bg-green-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailModal;