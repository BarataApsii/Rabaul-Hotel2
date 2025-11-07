import { NextResponse } from 'next/server';

// Helper function to clean up the request body
function cleanRequestBody(data: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = {};
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // Convert all values to strings as expected by the PHP API
      cleaned[key] = String(value);
    }
  });
  
  return cleaned;
}

export async function POST(request: Request) {
  try {
    const API_URL = 'https://cms.rabaulhotel.com.pg/api/booking.php';
    const body = await request.json();
    const cleanedBody = cleanRequestBody(body);
    
    console.log('Sending to PHP API:', {
      url: API_URL,
      method: 'POST',
      body: cleanedBody
    });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(cleanedBody),
      cache: 'no-store'
    });

    const responseText = await response.text();
    console.log('PHP API response:', {
      status: response.status,
      statusText: response.statusText,
      body: responseText
    });

    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      throw new Error('Invalid JSON response from server');
    }

    return NextResponse.json(responseData, {
      status: response.status,
    });
  } catch (error: unknown) {
    console.error('Booking API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process booking';
    const errorDetails = process.env.NODE_ENV === 'development' 
      ? error instanceof Error ? error.stack : String(error)
      : undefined;
      
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        ...(errorDetails && { error: errorDetails })
      },
      { status: 500 }
    );
  }
}
