// src/lib/api.ts

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
  slug: string;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
  featured_media?: number;
  acf?: {
    price?: number | string | null;
    [key: string]: any; // For any other ACF fields
  };
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
        };
      };
    }>;
  };
  [key: string]: any; // For any other fields
}

// Default parameters for all requests
const defaultParams = {
  _embed: 'wp:featuredmedia',
  per_page: 100,
  _fields: '*',
  acf_format: 'standard',
};

// Add ACF support to the REST API
const addAcfSupport = () => {
  if (typeof window !== 'undefined') {
    // This will be executed on the client side
    // We'll add ACF support by default in our requests
  }
};

// API methods
export const api = {
  // Get all rooms
  getRooms: async (): Promise<WPPost[]> => {
    try {
      // Try both 'rooms' and 'room' endpoints as different WordPress configurations might use either
      try {
        const data = await apiRequest<WPPost[]>('/room', {
          params: {
            ...defaultParams,
            _embed: 'wp:featuredmedia',
            _fields: [
              'id',
              'slug',
              'title',
              'content',
              'excerpt',
              'featured_media',
              'acf',
              'better_featured_image',
              '_links',
              '_embedded',
            ].join(','),
            acf_format: 'standard',
          },
        });
        if (data && data.length > 0) return data;
      } catch (e) {
        console.log('Tried /room endpoint, trying /rooms next');
      }

      // If first attempt failed, try with 'rooms' endpoint
      return await apiRequest<WPPost[]>('/rooms', {
        params: {
          ...defaultParams,
          _embed: 'wp:featuredmedia',
          _fields: [
            'id',
            'slug',
            'title',
            'content',
            'excerpt',
            'featured_media',
            'acf',
            'better_featured_image',
            '_links',
            '_embedded',
          ].join(','),
          acf_format: 'standard',
        },
      });
    } catch (error) {
      console.error('Error in getRooms:', error);
      throw error;
    }
  },

  // Get all amenities (general amenities)
  getAmenities: async (): Promise<WPPost[]> => {
    return apiRequest<WPPost[]>('/amenities', {
      params: {
        ...defaultParams,
        _embed: 'wp:featuredmedia',
        _fields: [
          'id',
          'title',
          'content',
          'excerpt',
          'featured_media',
          'acf',
          'better_featured_image',
          '_links',
          '_embedded'
        ].join(','),
        acf_format: 'standard',
      },
    });
  },

  // Get room-specific amenities
  // Get room-specific amenities with optimized fields
  getRoomAmenities: async (): Promise<WPPost[]> => {
    return apiRequest<WPPost[]>('/room_amenities', {
      params: {
        ...defaultParams,
        _fields: [
          'id',
          'title',
          'acf',
          'slug'
        ].join(','),
        per_page: 50, // Adjust based on expected number of amenities
        acf_format: 'standard',
      },
    });
  },

  // Get all explore items
  getExplore: async (): Promise<WPPost[]> => {
    return apiRequest<WPPost[]>('/explore', {
      params: {
        ...defaultParams,
        _embed: 'wp:featuredmedia',
        _fields: [
          'id',
          'title',
          'content',
          'excerpt',
          'featured_media',
          'acf',
          'better_featured_image',
          '_links',
          '_embedded'
        ].join(','),
        acf_format: 'standard',
      },
    });
  },
};

// Export types
export type { WPPost as WPPostType };