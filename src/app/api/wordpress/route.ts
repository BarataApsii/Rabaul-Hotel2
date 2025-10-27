import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  const params = Object.fromEntries(searchParams.entries());
  
  // Remove the path from params to avoid duplicate in URL
  if ('path' in params) {
    delete params['path'];
  }

  if (!path) {
    return NextResponse.json(
      { error: 'Missing path parameter' },
      { status: 400 }
    );
  }

  const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL;
  
  if (!WORDPRESS_API_URL) {
    console.error('WordPress API URL is not configured');
    return NextResponse.json(
      { error: 'WordPress API URL is not configured' },
      { status: 500 }
    );
  }

  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${WORDPRESS_API_URL}/wp-json/wp/v2/${path}${queryString ? `?${queryString}` : ''}`;
    
    console.log('WordPress API Request URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WordPress API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url,
        error: errorText
      });
      throw new Error(`WordPress API request failed with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('WordPress API Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'UnknownError'
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch from WordPress API',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
