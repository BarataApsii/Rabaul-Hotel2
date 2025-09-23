/**
 * Image utilities
 *
 * This file provides fallback images and helper functions
 * for working with WordPress media fields.
 */

// Fallback images (in case WordPress doesn't return any)
export const fallbackImages = {
  room: "/images/rooms/default-room.png",
  amenity: "/images/amenities/default-amenity.png",
  explore: "/images/cards/default-attraction.png",
  logo: "/images/logo.png",
  banner: "/images/mobile-banner.png",
};

/**
 * WordPress post interface for image functions
 */
interface WPPostForImages {
  better_featured_image?: {
    source_url: string;
    [key: string]: unknown;
  };
  acf?: {
    gallery?: Array<{ url: string; [key: string]: unknown }> | { url: string; [key: string]: unknown };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Get featured image URL from WordPress post
 */
export function getFeaturedImage(post: WPPostForImages): string {
  if (post?.better_featured_image?.source_url) {
    return post.better_featured_image.source_url;
  }
  if (post?.acf?.gallery && typeof post.acf.gallery === 'object' && 'url' in post.acf.gallery) {
    return post.acf.gallery.url;
  }
  return fallbackImages.room;
}

/**
 * Get gallery images from ACF (if any)
 */
export function getGalleryImages(post: WPPostForImages): string[] {
  if (Array.isArray(post?.acf?.gallery)) {
    return post.acf.gallery.map((img) => {
      if (typeof img === 'object' && img !== null && 'url' in img) {
        return img.url;
      }
      return '';
    }).filter(Boolean);
  }
  if (post?.acf?.gallery && typeof post.acf.gallery === 'object' && 'url' in post.acf.gallery) {
    // Single image
    return [post.acf.gallery.url];
  }
  return [];
}
