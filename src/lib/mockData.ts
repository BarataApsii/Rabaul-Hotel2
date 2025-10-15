export interface MockPost {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
  acf?: {
    price?: number | string | null;
    size?: string;
    guests?: number;
    beds?: number | string;
    [key: string]: any;
  };
  better_featured_image?: {
    source_url: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
  [key: string]: any;
}

export const mockRooms: MockPost[] = [
  {
    id: 1,
    slug: 'deluxe-room',
    title: { rendered: 'Deluxe Room' },
    content: { 
      rendered: '<p>Experience luxury in our spacious deluxe room with stunning ocean views.</p>'
    },
    excerpt: { 
      rendered: 'Luxury room with ocean views' 
    },
    acf: {
      price: 299,
      capacity: 2,
      size: '45 m²',
      guests: 2,
      beds: '1 King'
    },
    better_featured_image: {
      source_url: '/images/rooms/deluxe.jpg'
    },
    _embedded: {
      'wp:featuredmedia': [
        {
          source_url: '/images/rooms/deluxe.jpg'
        }
      ]
    }
  },
  {
    id: 2,
    slug: 'executive-suite',
    title: { rendered: 'Executive Suite' },
    content: { 
      rendered: '<p>Spacious suite with separate living area and premium amenities.</p>'
    },
    excerpt: { 
      rendered: 'Luxury suite with separate living area' 
    },
    acf: {
      price: 399,
      capacity: 3,
      size: '65 m²',
      guests: 3,
      beds: '1 King, 1 Sofa Bed'
    },
    better_featured_image: {
      source_url: '/images/rooms/executive.jpg'
    },
    _embedded: {
      'wp:featuredmedia': [
        {
          source_url: '/images/rooms/executive.jpg'
        }
      ]
    }
  }
];

export const mockAmenities: MockPost[] = [
  {
    id: 1,
    slug: 'swimming-pool',
    title: { rendered: 'Swimming Pool' },
    content: { 
      rendered: '<p>Enjoy our infinity pool with panoramic ocean views.</p>'
    },
    better_featured_image: {
      source_url: '/images/amenities/pool.jpg'
    }
  },
  // Add more mock amenities as needed
];

export const mockExplore: MockPost[] = [
  {
    id: 1,
    slug: 'beach',
    title: { rendered: 'Beach' },
    content: { 
      rendered: '<p>Relax on our pristine private beach.</p>'
    },
    better_featured_image: {
      source_url: '/images/explore/beach.jpg'
    }
  },
  // Add more explore items as needed
];
