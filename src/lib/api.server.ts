import { WPPost } from './wordpress';

// This is a server-only module
import 'server-only';

// This ensures this module is not imported in client components
declare const __non_webpack_require__: any;
const isServer = typeof window === 'undefined';

if (!isServer) {
  throw new Error('This module can only be used in server components and API routes');
}

const WORDPRESS_API_URL = process.env['WORDPRESS_API_URL'] || process.env['NEXT_PUBLIC_WORDPRESS_URL'];

if (!WORDPRESS_API_URL) {
  throw new Error('WORDPRESS_API_URL is not defined in environment variables');
}

// Cache implementation can be added here if needed in the future
// const CACHE = new Map<string, { data: any; timestamp: number }>();
// const CACHE_TTL = 60 * 1000; // 1 minute cache

export async function fetchFromWordPress<T = any>(
  endpoint: string,
  params: Record<string, any> = {}
): Promise<T> {
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)])
  ).toString();

  const url = `${WORDPRESS_API_URL}/wp-json/wp/v2/${endpoint}${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!response.ok) {
    throw new Error(`WordPress API request failed: ${response.statusText}`);
  }

  return response.json();
}

export async function getPosts(
  postType: string,
  params: Record<string, any> = {}
): Promise<WPPost[]> {
  return fetchFromWordPress<WPPost[]>(postType, {
    _embed: true,
    per_page: 100,
    ...params,
  });
}

export async function getPostBySlug(
  postType: string,
  slug: string
): Promise<WPPost> {
  const posts = await getPosts(postType, { slug, _embed: true });
  
  if (!posts.length) {
    throw new Error(`No ${postType} found with slug: ${slug}`);
  }

  return posts[0];
}
