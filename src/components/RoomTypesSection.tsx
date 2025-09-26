import Image from 'next/image';

const RoomTypesSection = () => {
  const rooms = [
    {
      name: 'Budget Room',
      description: 'Comfortable and affordable accommodation with essential amenities for a pleasant stay.',
      image: '/images/rooms/budget-room.PNG',
      features: ['Air Conditioning', 'Private Bathroom', 'Free WiFi', 'Daily Housekeeping']
    },
    {
      name: 'Standard Room',
      description: 'Spacious rooms with modern comforts, perfect for both business and leisure travelers.',
      image: '/images/rooms/standard-room.PNG',
      features: ['Air Conditioning', 'Private Balcony', 'Free WiFi', 'Flat-screen TV', 'Mini Fridge']
    }
  ];
  
  // These will be added to the booking form only
  const additionalRooms = [
    'Deluxe Room',
    'Executive King Room'
  ];

  return (
    <section className="py-12 md:py-16 bg-white text-gray-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Our Room Types</h2>
          <div className="w-20 h-1 bg-yellow-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose from our selection of comfortable and well-appointed rooms designed for your perfect stay in Rabaul.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {rooms.map((room, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <h3 className="absolute bottom-0 left-0 right-0 p-4 text-xl font-bold text-white">
                  {room.name}
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{room.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">Room Features:</h4>
                  <ul className="space-y-1">
                    {room.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="mt-6 w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-green-900 font-medium rounded-lg transition-colors duration-200">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomTypesSection;
