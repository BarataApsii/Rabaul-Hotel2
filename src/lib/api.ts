// src/lib/api.ts

/**
 * API Utility Functions
 * 
 * This file provides functions to interact with the WordPress REST API
 * It's designed to work in both client and server components
 */

import type { WPPost } from './wordpress';

export type { WPPost };

// Base URL for API requests
const API_BASE_URL = process.env['NEXT_PUBLIC_WORDPRESS_API_URL'] || 'https://rabaulhotel.com/wp-json/wp/v2';

// Client-side API functions
async function fetchAPI<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/${endpoint}${queryString ? `?${queryString}` : ''}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Get posts by post type
export async function getPosts(postType: string, params: Record<string, any> = {}): Promise<WPPost[]> {
  try {
    return await fetchAPI<WPPost[]>(postType, params);
  } catch (error) {
    console.error(`Error fetching ${postType}:`, error);
    return [];
  }
}

// Get a single post by slug
export async function getPostBySlug(postType: string, slug: string): Promise<WPPost | null> {
  try {
    const posts = await fetchAPI<WPPost[]>(postType, { slug, _embed: true });
    return posts[0] || null;
  } catch (error) {
    console.error(`Error fetching ${postType} with slug ${slug}:`, error);
    return null;
  }
}

// Get all rooms
export async function getRooms(): Promise<WPPost[]> {
  return getPosts('rooms');
}

// Get all amenities (general amenities)
export async function getAmenities(): Promise<WPPost[]> {
  return getPosts('amenities');
}

// Get room-specific amenities
export async function getRoomAmenities(): Promise<WPPost[]> {
  return getPosts('room-amenities');
}

// Get all tourist spots
export async function getExplore(): Promise<WPPost[]> {
  return getPosts('tourist-spots');
}

// Get a single room by slug
export async function getRoomBySlug(slug: string): Promise<WPPost | null> {
  return getPostBySlug('rooms', slug);
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
        return [];
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