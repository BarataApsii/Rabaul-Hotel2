/**
 * API Utility Functions for WordPress REST API
 * 
 * This file handles all requests to your WordPress backend.
 */

// Base URL for WordPress API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost/rabaul-hotel/wp-json/wp/v2";

interface RequestOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
}

/**
 * Generic API Request function
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  // Add query params
  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url.toString(), {
    ...options,
    headers,
    next: { revalidate: 60 }, // ISR caching (optional)
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

// --------------------
// WordPress Data Types
// --------------------
export interface WPPost {
  id: number;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
  featured_media?: number;
  better_featured_image?: {
    source_url: string;
    [key: string]: unknown;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      media_details: {
        width: number;
        height: number;
        file: string;
        filesize: number;
        sizes: {
          thumbnail?: { 
            source_url: string;
            width: number;
            height: number;
            mime_type: string;
          };
          medium?: { 
            source_url: string;
            width: number;
            height: number;
            mime_type: string;
          };
          medium_large?: { 
            source_url: string;
            width: number;
            height: number;
            mime_type: string;
          };
          large?: { 
            source_url: string;
            width: number;
            height: number;
            mime_type: string;
          };
          full?: { 
            source_url: string;
            width: number;
            height: number;
            mime_type: string;
          };
          [key: string]: {
            source_url: string;
            width?: number;
            height?: number;
            mime_type?: string;
            [key: string]: unknown;
          } | undefined;
        };
        image_meta: {
          aperture: string;
          credit: string;
          camera: string;
          caption: string;
          created_timestamp: string;
          copyright: string;
          focal_length: string;
          iso: string;
          shutter_speed: string;
          title: string;
          orientation: string;
          keywords: string[];
        };
      };
      [key: string]: unknown;
    }>;
    [key: string]: unknown;
  };
  acf?: {
    gallery?: Array<{ url: string; [key: string]: unknown }> | { url: string; [key: string]: unknown };
    features?: string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// Default parameters for all requests
const defaultParams = {
  _embed: 'wp:featuredmedia',
  per_page: 100,
};

// --------------------
// API Functions
// --------------------
export const api = {
  getRooms: (): Promise<WPPost[]> => 
    apiRequest<WPPost[]>('/rooms', { params: defaultParams }),
  
  getAmenities: (): Promise<WPPost[]> => 
    apiRequest<WPPost[]>('/amenities', { 
      params: { 
        ...defaultParams,
        // Add any specific params for amenities if needed
      } 
    }),
    
  getExplore: (): Promise<WPPost[]> => 
    apiRequest<WPPost[]>('/explore', { 
      params: defaultParams 
    }),
};
