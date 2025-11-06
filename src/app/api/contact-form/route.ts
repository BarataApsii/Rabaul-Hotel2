import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cms.rabaulhotel.com.pg/api').replace(/\/$/, '');
    const contactEndpoint = `${apiBaseUrl}/contact.php`;

    console.log('Forwarding request to PHP API:', contactEndpoint, body);

    const response = await fetch(contactEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        phone: body.phone || '',
        message: body.message,
        'g-recaptcha-response': body['g-recaptcha-response'] || ''
      })
    });

    const text = await response.text();

    // Detect HTML responses (PHP errors / misconfiguration)
    if (text.trim().toLowerCase().startsWith('<!doctype html>') || text.includes('<html')) {
      console.error('Received HTML from PHP API:', text.substring(0, 500));
      return NextResponse.json(
        { success: false, message: 'Server returned an unexpected HTML page. Check PHP API.', error: 'html_response' },
        { status: 500 }
      );
    }

    // Parse JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: false, message: text || 'Invalid response from PHP API.' };
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error in contact form route:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error', error: 'internal_error' },
      { status: 500 }
    );
  }
}
