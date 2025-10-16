// src/lib/api.ts

/**
 * API Utility Functions
 * 
 * This file provides functions to interact with the WordPress REST API
 */

import { getPosts, getPostBySlug } from './api.server';

export type WPPost = {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
  acf?: Record<string, any>;
  better_featured_image?: {
    source_url: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text?: string;
      media_details?: {
        width: number;
        height: number;
      };
    }>;
  };
};

// Get all rooms
async function getRooms(): Promise<WPPost[]> {
  try {
    const posts = await getPosts('rooms');
    return Array.isArray(posts) ? posts : [];
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
}

// Get all amenities (general amenities)
async function getAmenities(): Promise<WPPost[]> {
  try {
    const posts = await getPosts('amenities');
    return Array.isArray(posts) ? posts : [];
  } catch (error) {
    console.error('Error fetching amenities:', error);
    return [];
  }
}

// Get room-specific amenities
async function getRoomAmenities(): Promise<WPPost[]> {
  try {
    const posts = await getPosts('room-amenities');
    return Array.isArray(posts) ? posts : [];
  } catch (error) {
    console.error('Error fetching room amenities:', error);
    return [];
  }
}

// Get all tourist spots
async function getExplore(): Promise<WPPost[]> {
  try {
    const posts = await getPosts('tourist-spots');
    return Array.isArray(posts) ? posts : [];
  } catch (error) {
    console.error('Error fetching tourist spots:', error);
    return [];
  }
}

// Get a single room by slug
async function getRoomBySlug(slug: string): Promise<WPPost | null> {
  try {
    const post = await getPostBySlug('rooms', slug);
    return post || null;
  } catch (error) {
    console.error(`Error fetching room with slug ${slug}:`, error);
    return null;
  }
}

// Export the API object with all methods
export const api = {
  // Core methods
  getRooms,
  getAmenities,
  getRoomAmenities,
  getExplore,
  getRoomBySlug,

  // Additional utility methods
  async get(endpoint: string, params: Record<string, any> = {}) {
    try {
      // In development, return mock data
      if (process.env.NODE_ENV === 'development') {
        // Default empty array response for unknown endpoints
        return [] as any;
      }

      // In production, make actual API calls
      const baseUrl = process.env['NEXT_PUBLIC_WORDPRESS_API_URL'] || 'https://rabaulhotel.com/wp-json/wp/v2';
      const url = new URL(endpoint, baseUrl);
      
      // Add query parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    } catch (error) {
      console.error('API GET request failed:', error);
      throw error;
    }
  },

  async post(endpoint: string, data: any = {}) {
    try {
      const baseUrl = process.env['NEXT_PUBLIC_WORDPRESS_API_URL'] || 'https://rabaulhotel.com/wp-json/wp/v2';
      const response = await fetch(new URL(endpoint, baseUrl).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    } catch (error) {
      console.error('API POST request failed:', error);
      throw error;
    }
  },
};

export type { WPPost as WPPostType };