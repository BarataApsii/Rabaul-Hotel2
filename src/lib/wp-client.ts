// WordPress API Client - Simplified Version
const API_BASE_URL = '/api/wordpress';

// Base types
export interface WPImage {
  id: number;
  source_url: string;
  alt_text?: string;
  media_details?: {
    sizes?: {
      thumbnail?: { source_url: string };
      medium?: { source_url: string };
      large?: { source_url: string };
      full?: { source_url: string };
      [key: string]: { source_url: string } | undefined;
    };
    [key: string]: any; // For any additional properties
  };
}

export interface WPPostBase {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  content?: { rendered: string };
  featured_media?: number;
  acf?: Record<string, any>;
  _embedded?: {
    'wp:featuredmedia'?: WPImage[];
  };
}

// Room type
export interface WPRoom extends WPPostBase {
  acf?: {
    price_per_night?: number;
    max_guests?: number;
    room_size?: string;
    bed_type?: string;
    room_amenities?: number[];
    featured_image?: number;
    gallery?: number[];
  };
}

// Fetch helper
async function fetchFromWordPress<T>(path: string, params: Record<string, any> = {}): Promise<T> {
  const query = new URLSearchParams();
  query.set('path', path);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => query.append(`${key}[]`, String(v)));
      } else if (typeof value === 'object') {
        query.set(key, JSON.stringify(value));
      } else {
        query.set(key, String(value));
      }
    }
  });

  const response = await fetch(`${API_BASE_URL}?${query.toString()}`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to fetch ${path}`);
  }

  return response.json();
}

// Define the allowed image sizes
type ImageSize = 'thumbnail' | 'medium' | 'large' | 'full' | string;

// Get featured image URL
export function getFeaturedImage(
  post: WPPostBase, 
  size: ImageSize = 'large'
): string | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return null;
  
  // Try to get the requested size, fall back to full size, then source_url
  return (
    media.media_details?.sizes?.[size]?.source_url ||
    (size !== 'full' ? media.media_details?.sizes?.full?.source_url : null) ||
    media.source_url ||
    null
  );
}

// Get excerpt with fallback
export function getExcerpt(post: WPPostBase, length: number = 160): string {
  const excerpt = post.excerpt?.rendered || post.content?.rendered || '';
  const text = excerpt.replace(/<[^>]*>?/gm, '');
  return text.length > length ? `${text.substring(0, length)}...` : text;
}

// Get posts by type
export async function getPosts<T = WPPostBase>(
  postType: string,
  params: Record<string, any> = {}
): Promise<T[]> {
  const posts = await fetchFromWordPress<T[]>(`wp/v2/${postType}`, {
    _embed: true,
    per_page: 100,
    ...params,
  });
  return Array.isArray(posts) ? posts : [];
}

// Get single post by slug
export async function getPostBySlug<T = WPPostBase>(
  postType: string,
  slug: string
): Promise<T | null> {
  const posts = await getPosts<T>(postType, { slug, _embed: true });
  return posts[0] || null;
}

// Get ACF field
export async function getAcfField<T = any>(
  postType: string,
  postId: number,
  fieldName: string
): Promise<T | null> {
  try {
    const data = await fetchFromWordPress<{ acf: Record<string, T> }>(
      `acf/v3/${postType}/${postId}`
    );
    return data.acf?.[fieldName] ?? null;
  } catch (error) {
    console.error(`Error getting ACF field ${fieldName}:`, error);
    return null;
  }
}

// Get rooms with prices
export async function getRooms(params = {}): Promise<WPRoom[]> {
  return getPosts<WPRoom>('rooms', {
    ...params,
    _fields: [
      'id',
      'slug',
      'title',
      'excerpt',
      'featured_media',
      '_links.wp:featuredmedia',
      'acf.price_per_night',
      'acf.max_guests',
      'acf.room_size',
      'acf.bed_type',
      'acf.featured_image',
      'acf.gallery'
    ].join(','),
  });
}

// Get room by slug with all details
export async function getRoom(slug: string): Promise<WPRoom | null> {
  const rooms = await getRooms({ slug, _embed: true });
  return rooms[0] || null;
}
