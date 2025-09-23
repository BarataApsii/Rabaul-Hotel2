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
 * Get featured image URL from WordPress post
 */
export function getFeaturedImage(post: any): string {
  if (post?.better_featured_image?.source_url) {
    return post.better_featured_image.source_url;
  }
  if (post?.acf?.gallery?.url) {
    return post.acf.gallery.url;
  }
  return fallbackImages.room;
}

/**
 * Get gallery images from ACF (if any)
 */
export function getGalleryImages(post: any): string[] {
  if (Array.isArray(post?.acf?.gallery)) {
    return post.acf.gallery.map((img: any) => img.url);
  }
  if (post?.acf?.gallery?.url) {
    // Single image
    return [post.acf.gallery.url];
  }
  return [];
}
