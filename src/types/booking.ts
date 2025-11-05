export type RoomType = 
  | 'budget' 
  | 'standard' 
  | 'deluxe' 
  | 'executive' 
  | 'family' 
  | 'conference';

export interface RoomRates {
  budget: number;
  standard: number;
  deluxe: number;
  executive: number;
  family: number;
  conference: number;
  [key: string]: number; // Index signature for dynamic access
}

export interface WPRoom {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  featured_title?: string;
  room_rates?: string;
  room_size?: string;
  bed_type?: string;
  max_guests?: number;
  content?: {
    rendered: string;
  };
  excerpt?: {
    rendered: string;
  };
  acf?: {
    price_per_night?: number;
    max_guests?: number;
    room_size?: string;
    bed_type?: string;
    featured_image?: number;
    gallery?: number[];
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text?: string;
    }>;
  };
}

export interface BookingFormData {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  roomType: RoomType | 'select';
  adults: number;
  children: number;
}

export interface BookingFormErrors {
  checkIn?: string;
  checkOut?: string;
  roomType?: string;
  adults?: string;
  [key: string]: string | undefined;
}
