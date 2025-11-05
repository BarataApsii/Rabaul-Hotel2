import { NextRequest } from 'next/server';

// Define the type for gallery items from WordPress
interface WPGalleryItem {
  id: number;
  source_url: string;
  alt_text: string;
  media_details?: {
    sizes?: {
      thumbnail?: { source_url: string };
      medium?: { source_url: string };
      large?: { source_url: string };
      full?: { source_url: string };
      [key: string]: { source_url: string } | undefined;
    };
  };
  title?: { rendered: string };
  caption?: { rendered: string };
  sizes?: {
    thumbnail: { source_url: string };
    medium: { source_url: string };
    large: { source_url: string };
    full: { source_url: string };
  };
  mime_type?: string;
}

// Get WordPress URL from environment variables
const WORDPRESS_API_URL = process.env['NEXT_PUBLIC_WORDPRESS_URL'] || '';

// Cache control headers
const CACHE_AGE = 60 * 60 * 24; // 24 hours

export async function GET(request: NextRequest) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    // Get pagination parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('per_page') || '20', 10);
    const category = searchParams.get('category') || '';

    if (!WORDPRESS_API_URL) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Server configuration error: WordPress URL not configured',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Build the API URL with query parameters
    let apiUrl = `${WORDPRESS_API_URL}/wp-json/wp/v2/media?media_type=image&per_page=${perPage}&page=${page}&_fields=id,source_url,alt_text,media_details,title,caption,mime_type`;
    
    // Add category filter if specified
    if (category) {
      apiUrl += `&media_category=${category}`;
    }

    // Fetch media from WordPress REST API
    const response = await fetch(apiUrl, {
      next: { revalidate: CACHE_AGE },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch gallery images: ${response.status} ${response.statusText}`
      );
    }

    // Get total pages from headers for pagination
    const totalItems = parseInt(response.headers.get('x-wp-total') || '0', 10);
    const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1', 10);

    const items: WPGalleryItem[] = await response.json();

    // Format the response
    const formattedItems = items
      .filter(item => item.mime_type?.startsWith('image/'))
      .map((item) => {
        // Determine category from source URL
        let itemCategory = 'gallery';
        const src = item.source_url.toLowerCase();
        
        if (src.includes('/rooms/')) {
          itemCategory = 'rooms';
        } else if (src.includes('/amenities/')) {
          itemCategory = 'amenities';
        } else if (src.includes('/gallery/')) {
          itemCategory = 'gallery';
        }

        return {
          id: item.id,
          source_url: item.source_url,
          alt_text: item.alt_text || item.title?.rendered || 'Gallery image',
          media_details: item.media_details,
          title: item.title,
          caption: item.caption,
          category: itemCategory,
          sizes: item.media_details?.sizes || {
            thumbnail: { source_url: item.source_url },
            medium: { source_url: item.source_url },
            large: { source_url: item.source_url },
            full: { source_url: item.source_url },
          },
        };
      });

    // Return the response with CORS headers
    return new Response(
      JSON.stringify({
        success: true,
        data: formattedItems,
        pagination: {
          page,
          per_page: perPage,
          total_items: totalItems,
          total_pages: totalPages,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': `public, max-age=${CACHE_AGE}, s-maxage=${CACHE_AGE}`,
        },
      }
    );
  } catch (error: unknown) {
    console.error('Error fetching gallery images:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return new Response(
      JSON.stringify({
        success: false,
        message: `Failed to fetch gallery images: ${errorMessage}`,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
