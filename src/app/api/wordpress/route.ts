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

  const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  
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
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`WordPress API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('WordPress API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from WordPress API' },
      { status: 500 }
    );
  }
}
