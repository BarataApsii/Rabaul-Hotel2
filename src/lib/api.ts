/**
 * API Utility Functions
 * 
 * This file contains utility functions for making API requests to the backend.
 * Replace the API_BASE_URL with your actual API base URL.
 */

// API Base URL - Set this in your environment variables
// For CPanel deployment, set this in your hosting control panel
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://your-cpanel-domain.com/api';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
}

/**
 * Makes an API request
 * @param endpoint - The API endpoint (e.g., '/bookings')
 * @param options - Fetch options (method, headers, body, etc.)
 * @returns Promise with the response data
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  // Construct the full URL
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  // Add query parameters if provided
  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url.toString(), {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API request failed with status ${response.status}`
      );
    }

    // For 204 No Content responses
    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Example API functions
export const api = {
  // Example: Fetch bookings
  getBookings: async (): Promise<any> => {
    return apiRequest('/bookings');
  },

  // Example: Create a booking
  createBooking: async (data: any): Promise<any> => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Add more API functions as needed
};
