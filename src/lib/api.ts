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
  acf?: Record<string, any>; // ACF fields
  [key: string]: any;
}

// --------------------
// API Functions
// --------------------
export const api = {
  getRooms: async (): Promise<WPPost[]> => {
    return apiRequest<WPPost[]>("/rooms");
  },

  getAmenities: async (): Promise<WPPost[]> => {
    return apiRequest<WPPost[]>("/amenities");
  },

  getExplore: async (): Promise<WPPost[]> => {
    return apiRequest<WPPost[]>("/explore");
  },
};
