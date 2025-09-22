// app/api/explore/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const wpBase = process.env.WP_BASE;
    if (!wpBase) {
      throw new Error('WP_BASE environment variable is not set');
    }

    const wpUrl = `${wpBase}/wp-json/wp/v2/explore?_embed`;
    console.log('Fetching from WordPress API:', wpUrl);
    
    let response;
    try {
      response = await fetch(wpUrl, { 
        cache: "no-store",
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(5000)
      });
    } catch (fetchError) {
      console.error('Network error when fetching from WordPress:', fetchError);
      return NextResponse.json(
        { 
          error: 'Network error',
          details: fetchError instanceof Error ? fetchError.message : 'Failed to connect to WordPress',
          wpBase,
          wpUrl
        },
        { status: 502 }
      );
    }
    
    let responseData;
    try {
      responseData = await response.text();
      // Try to parse as JSON, but keep the raw text if it fails
      try {
        responseData = JSON.parse(responseData);
      } catch (e) {
        console.warn('Response is not valid JSON, using raw text');
      }
    } catch (error) {
      console.error('Error reading response:', error);
      return NextResponse.json(
        { 
          error: 'Invalid response from WordPress',
          details: error instanceof Error ? error.message : 'Failed to read response',
          status: response.status,
          statusText: response.statusText
        },
        { status: 502 }
      );
    }

    if (!response.ok) {
      console.error('WordPress API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: wpUrl,
        response: responseData
      });
      
      return NextResponse.json(
        { 
          error: 'WordPress API Error',
          status: response.status,
          statusText: response.statusText,
          endpoint: wpUrl,
          response: responseData
        },
        { status: response.status }
      );
    }
    
    if (!Array.isArray(responseData)) {
      console.error('Expected array from WordPress API but got:', {
        type: typeof responseData,
        data: responseData,
        endpoint: wpUrl
      });
      
      // Check if this is a REST API error (like when endpoint doesn't exist)
      if (responseData && responseData.code === 'rest_no_route') {
        return NextResponse.json(
          { 
            error: 'WordPress REST API endpoint not found',
            details: `The endpoint ${wpUrl} does not exist. Make sure the 'explore' post type is registered with REST API support.`,
            code: responseData.code,
            message: responseData.message
          },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Invalid data format from WordPress API',
          details: 'Expected an array of explore items',
          response: responseData
        },
        { status: 500 }
      );
    }
    
    console.log(`Successfully fetched ${responseData.length} explore items`);
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('Unexpected error in explore API route:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'An unknown error occurred',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
