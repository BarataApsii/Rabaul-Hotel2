// Client-side API client for WordPress
import { WPPost } from './wordpress';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function fetchFromWordPress<T = any>(
  endpoint: string,
  params: Record<string, any> = {}
): Promise<ApiResponse<T>> {
  try {
    const queryString = new URLSearchParams({
      path: endpoint,
      ...params,
    }).toString();

    const response = await fetch(`/api/wordpress?${queryString}`, {
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        error: error.message || `Request failed with status ${response.status}`,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('API Error:', error);
    return {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

// Example client-side functions
export async function getPosts(
  postType: string,
  params: Record<string, any> = {}
): Promise<ApiResponse<WPPost[]>> {
  return fetchFromWordPress<WPPost[]>(postType, params);
}

export async function getPostBySlug(
  postType: string,
  slug: string
): Promise<ApiResponse<WPPost>> {
  return fetchFromWordPress<WPPost>(`${postType}`, { slug, _embed: true });
}
