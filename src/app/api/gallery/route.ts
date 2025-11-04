import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/wp-client';

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
}

export async function GET() {
  console.log('Gallery API: Fetching gallery images');
  
  try {
    // First, check if WordPress URL is configured
    const wordpressUrl = process.env['NEXT_PUBLIC_WORDPRESS_URL'];
    if (!wordpressUrl) {
      console.error('WordPress URL is not configured');
      return NextResponse.json(
        { error: 'Server configuration error: WordPress URL not configured' },
        { status: 500 }
      );
    }

    console.log('Gallery API: Fetching media from WordPress...');
    
    // First, get all media items
    let allMediaItems: WPGalleryItem[] = [];
    let page = 1;
    let hasMore = true;
    const perPage = 50; // Number of items per page

    // Fetch all pages of media items
    while (hasMore) {
      console.log(`Fetching page ${page} of media items...`);
      const mediaItems = await getPosts<WPGalleryItem>('media', {
        per_page: perPage,
        page,
        _fields: [
          'id',
          'source_url',
          'alt_text',
          'media_details',
          'title',
          'caption',
          'mime_type'
        ].join(','),
      });

      if (!Array.isArray(mediaItems)) {
        console.error('Unexpected response format from WordPress:', mediaItems);
        throw new Error('Invalid response format from WordPress');
      }

      if (mediaItems.length === 0) {
        hasMore = false;
      } else {
        allMediaItems = [...allMediaItems, ...mediaItems];
        // If we got fewer items than requested, we've reached the end
        if (mediaItems.length < perPage) {
          hasMore = false;
        } else {
          page++;
        }
      }
    }

    console.log(`Gallery API: Successfully fetched ${allMediaItems.length} total media items`);

    // Filter out non-image files if needed and transform the data
    const galleryItems = allMediaItems
      .filter(item => {
        const mimeType = (item as any).mime_type || '';
        return mimeType.startsWith('image/');
      })
      .map(item => ({
        id: item.id.toString(),
        src: item.source_url,
        alt: item.alt_text || item.title?.rendered || 'Gallery Image',
        category: 'gallery',
        title: item.caption?.rendered || item.title?.rendered || 'Image',
      }));

    console.log(`Gallery API: Returning ${galleryItems.length} image items`);
    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error('Error in gallery API:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'UnknownError'
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch gallery images',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
