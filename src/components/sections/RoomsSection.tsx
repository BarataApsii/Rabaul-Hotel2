'use client';

import { Card, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Room {
  id: number;
  title: string;
  description: string;
  price: number;
  size: string;
  guests: number;
  beds: number;
  image: string;
}

const RoomsSection = () => {
  // Static room data
  const rooms: Room[] = [
    {
      id: 1,
      title: 'Deluxe Room',
      description: 'Spacious room with a beautiful view of the ocean',
      price: 199,
      size: '35',
      guests: 2,
      beds: 1,
      image: '/images/rooms/deluxe.jpg'
    },
    {
      id: 2,
      title: 'Executive Suite',
      description: 'Luxurious suite with extra space and premium amenities',
      price: 299,
      size: '50',
      guests: 3,
      beds: 2,
      image: '/images/rooms/suite.jpg'
    },
    {
      id: 3,
      title: 'Family Room',
      description: 'Perfect for families with children, featuring extra space',
      price: 249,
      size: '45',
      guests: 4,
      beds: 2,
      image: '/images/rooms/family.jpg'
    },
    {
      id: 4,
      title: 'Ocean View Room',
      description: 'Stunning ocean views from your private balcony',
      price: 349,
      size: '40',
      guests: 2,
      beds: 1,
      image: '/images/rooms/ocean.jpg'
    }
  ];

  return (
    <section id="rooms" className="py-12 bg-gray-50 w-full">
      <div className="w-full px-4">
        <div className="max-w-[1800px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#1a5f2c' }}>
            Our Rooms & Suites
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
            {rooms.map((room) => (
              <Card key={room.id} className="overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full w-full">
                <div className="relative h-48 w-full">
                  <div className="w-full h-full bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center">
                    <span className="text-white font-medium">Room Image: {room.title}</span>
                  </div>
                </div>
                <div className="flex flex-col flex-grow p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {room.title}
                    </h3>
                    <div className="text-xs font-medium bg-green-50 text-green-800 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                      ${room.price} / night
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{room.description}</p>
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      {room.size} m²
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {room.guests} {room.guests === 1 ? 'Guest' : 'Guests'}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 20v-8a2 2 0 012-2h14a2 2 0 012 2v8M3 20h18M3 20v-8a2 2 0 012-2h14a2 2 0 012 2v8" />
                      </svg>
                      {room.beds} {room.beds === 1 ? 'Bed' : 'Beds'}
                    </div>
                  </div>
                  <CardFooter className="mt-auto flex justify-end">
                    <Link href={`/rooms/${room.id}`}>
                      <Button 
                        className="bg-green-900 hover:bg-green-800 text-white px-4 py-1.5 text-sm transition-colors duration-200"
                      >
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomsSection;