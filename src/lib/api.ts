import type { WPPost } from "./wordpress";
export type { WPPost };

// ✅ Use bracket syntax to fix TS4111
const WORDPRESS_API_URL =
  process.env["NEXT_PUBLIC_WORDPRESS_URL"] || "https://cms.rabaulhotel.com.pg/wp-cms";
const API_BASE_URL = `${WORDPRESS_API_URL}/wp-json/wp/v2`;

/**
 * Helper to fetch data from WordPress REST API.
 */
export async function fetchAPI<T = any>(
  endpoint: string,
  params: Record<string, any> = {}
): Promise<T> {
  try {
    const url = new URL(`${API_BASE_URL}/${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });

    console.log("🌐 Fetching from:", url.toString());

    const response = await fetch(url.toString(), { cache: "no-cache" });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ API error:", response.status, text);
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("🚨 fetchAPI failed:", error);
    throw error;
  }
}

/**
 * Get WordPress posts (used for amenities, etc.)
 */
export async function getPosts(type: string): Promise<WPPost[]> {
  try {
    const posts = await fetchAPI<WPPost[]>(type, { per_page: 100, _embed: true });
    return posts;
  } catch (error) {
    console.error(`❌ Unexpected error in getPosts(${type}):`, error);
    throw error;
  }
}

/**
 * Get room data
 */
export async function getRooms(): Promise<WPPost[]> {
  try {
    const rooms = await fetchAPI<WPPost[]>("rooms", { per_page: 50, _embed: true });
    return rooms;
  } catch (error) {
    console.error("❌ Error fetching rooms:", error);
    throw error;
  }
}

/**
 * Get single post by slug
 */
export async function getPostBySlug(type: string, slug: string): Promise<WPPost | null> {
  try {
    const data = await fetchAPI<WPPost[]>(type, { slug, _embed: true });
    return data.length ? data[0] : null;
  } catch (error) {
    console.error(`❌ Error fetching ${type} by slug (${slug}):`, error);
    return null;
  }
}

// ✅ Export as single object for easy import (api.getRooms(), api.getPosts(), etc.)
export const api = {
  fetchAPI,
  getPosts,
  getRooms,
  getPostBySlug,
};
