import { NextResponse } from 'next/server';

export async function GET() {
  const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  
  if (!WORDPRESS_URL) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'WordPress URL is not configured',
        error: 'Missing NEXT_PUBLIC_WORDPRESS_URL in environment variables'
      },
      { status: 500 }
    );
  }

  try {
    // Test 1: Check if we can access the WordPress REST API index
    const apiIndexUrl = `${WORDPRESS_URL.replace(/\/$/, '')}/wp-json/`;
    const apiResponse = await fetch(apiIndexUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Disable Next.js cache for testing
      cache: 'no-store',
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to access WordPress REST API',
          error: `HTTP ${apiResponse.status} - ${apiResponse.statusText}`,
          details: {
            url: apiIndexUrl,
            status: apiResponse.status,
            statusText: apiResponse.statusText,
            response: errorText.substring(0, 500) // Include first 500 chars of response
          }
        },
        { status: 502 }
      );
    }

    // Test 2: Try to fetch a list of posts
    const postsUrl = `${WORDPRESS_URL.replace(/\/$/, '')}/wp-json/wp/v2/posts?per_page=1`;
    const postsResponse = await fetch(postsUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!postsResponse.ok) {
      const errorText = await postsResponse.text();
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch posts from WordPress',
          error: `HTTP ${postsResponse.status} - ${postsResponse.statusText}`,
          details: {
            url: postsUrl,
            status: postsResponse.status,
            statusText: postsResponse.statusText,
            response: errorText.substring(0, 500)
          }
        },
        { status: 502 }
      );
    }

    const posts = await postsResponse.json();

    // If we get here, both tests passed
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to WordPress REST API',
      data: {
        wordpressUrl: WORDPRESS_URL,
        apiIndexUrl,
        postsUrl,
        postsCount: Array.isArray(posts) ? posts.length : 0,
        firstPostTitle: Array.isArray(posts) && posts[0]?.title?.rendered 
          ? posts[0].title.rendered 
          : 'No posts found or unexpected response format'
      }
    });

  } catch (error) {
    console.error('WordPress connection test failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error connecting to WordPress',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : null,
        wordpressUrl: WORDPRESS_URL
      },
      { status: 500 }
    );
  }
}