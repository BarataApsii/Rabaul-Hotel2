// src/lib/api.ts

/**
 * Mock API Utility Functions
 * 
 * This file provides mock data for the application.
 */

import { mockRooms, mockAmenities, mockExplore } from './mockData';

// Types for compatibility with existing code
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
    }>;
  };
  [key: string]: any; // For any additional properties
};

// Mock API request function for compatibility
export async function apiRequest<T = unknown>(
  endpoint: string,
  _options: any = {}
): Promise<T> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Mock responses based on endpoint
  if (endpoint.includes('rooms')) {
    return mockRooms as any;
  } else if (endpoint.includes('amenities')) {
    return mockAmenities as any;
  } else if (endpoint.includes('explore')) {
    return mockExplore as any;
  }
  
  // Default empty array response for unknown endpoints
  return [] as any;
}

/**
 * Get all rooms
 */
export async function getRooms(): Promise<WPPost[]> {
  return mockRooms as WPPost[];
}

/**
 * Get all amenities (general amenities)
 */
export async function getAmenities(): Promise<WPPost[]> {
  return mockAmenities as WPPost[];
}

/**
 * Get room-specific amenities
 */
export async function getRoomAmenities(): Promise<WPPost[]> {
  // Return a subset of amenities as room amenities
  return mockAmenities.slice(0, 3) as WPPost[];
}

/**
 * Get all explore items
 */
export async function getExplore(): Promise<WPPost[]> {
  return mockExplore as WPPost[];
}

// Export the API object with all methods
export const api = {
  getRooms,
  getAmenities,
  getRoomAmenities,
  getExplore,
  request: apiRequest
};

export type { WPPost as WPPostType };