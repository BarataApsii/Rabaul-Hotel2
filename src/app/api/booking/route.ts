import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (!API_BASE_URL) {
    console.error('API_BASE_URL is not defined');
    return NextResponse.json(
      { success: false, message: 'Server configuration error: API_BASE_URL is not defined' },
      { status: 500 }
    );
  }

  console.log('Incoming request to booking API');
  
  try {
    const body = await request.json();
    
    console.log('Request body:', JSON.stringify(body, null, 2));
    console.log('Sending request to:', `${API_BASE_URL}/booking.php`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(`${API_BASE_URL}/booking.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      // Log response status and headers
      console.log('Response status:', response.status, response.statusText);
      const responseHeaders = Object.fromEntries(response.headers.entries());
      console.log('Response headers:', responseHeaders);
      
      // Try to parse the response as JSON, but handle non-JSON responses
      let data;
      const responseText = await response.text();
      
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        console.log('Raw response:', responseText);
        throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 200)}`);
      }
      
      console.log('Booking API response data:', data);
      
      // Forward the status code from the PHP API
      return NextResponse.json({
        success: response.ok,
        ...data,
        _debug: {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        }
      }, { 
        status: response.status 
      });
      
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Request timed out after 10 seconds');
        throw new Error('Request to booking service timed out');
      }
      throw error; // Re-throw to be caught by the outer catch
    }
    
  } catch (error) {
    console.error('Booking API error:', error);
    
    let errorMessage = 'Failed to process booking';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Handle specific error cases
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Could not connect to the booking service. Please check your internet connection or try again later.';
        statusCode = 503; // Service Unavailable
      } else if (error.message.includes('timed out')) {
        errorMessage = 'The booking service is taking too long to respond. Please try again later.';
        statusCode = 504; // Gateway Timeout
      } else if (error.message.includes('Invalid JSON')) {
        errorMessage = 'Received an invalid response from the booking service.';
        statusCode = 502; // Bad Gateway
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        _error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        } : undefined
      },
      { status: statusCode }
    );
  }
}
