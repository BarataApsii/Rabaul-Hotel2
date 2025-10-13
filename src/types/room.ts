export type RoomImage = {
  id: string | number;
  url: string;
  alt: string;
  title?: string;
  sizes?: {
    thumbnail?: string;
    medium?: string;
    large?: string;
    full?: string;
    [key: string]: any;
  };
  [key: string]: any; // Allow for additional properties
};

export type RoomACF = {
  price?: number | string;
  amenities?: string[];
  gallery?: RoomImage[];
  room_type?: string;
  image_1?: RoomImage;
  image_2?: RoomImage;
  image_3?: RoomImage;
  [key: string]: any; // Allow for additional ACF fields
};

export type RoomData = {
  id: number;
  slug?: string;
  title: { 
    rendered: string;
  };
  content: { 
    rendered: string;
  };
  acf: RoomACF;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      alt_text?: string;
      media_details?: {
        sizes?: {
          thumbnail?: { source_url: string };
          medium?: { source_url: string };
          large?: { source_url: string };
          full?: { source_url: string };
          [key: string]: any;
        };
        [key: string]: any;
      };
      [key: string]: any;
    }>;
    [key: string]: any;
  };
  [key: string]: any; // Allow for additional properties
};
