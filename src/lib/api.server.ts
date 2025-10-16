import { WPPost } from './wordpress';

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

if (!WORDPRESS_API_URL) {
  throw new Error('NEXT_PUBLIC_WORDPRESS_URL is not defined in environment variables');
}

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
