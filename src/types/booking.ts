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
