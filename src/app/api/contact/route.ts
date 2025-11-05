import { NextResponse } from 'next/server';
import { verifyRecaptcha } from '@/lib/recaptcha';

export async function POST(request: Request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    // Parse JSON body
    const body = await request.json();
    
    // Extract form data
    const name = body.name?.toString() || '';
    const email = body.email?.toString() || '';
    const message = body.message?.toString() || '';
    const phone = body.phone?.toString() || '';
    const recaptchaToken = body['g-recaptcha-response']?.toString() || '';

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({
        success: false,
        message: 'Please fill in all required fields'
      }, { status: 400 });
    }

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return NextResponse.json({
        success: false,
        message: 'reCAPTCHA verification failed'
      }, { status: 400 });
    }

    // Here you would typically:
    // 1. Save the contact form submission to your database
    // 2. Send a notification email
    // 3. Log the submission
    
    // For now, we'll just log the submission and return success
    console.log('New contact form submission:', {
      name,
      email,
      phone,
      message,
      timestamp: new Date().toISOString()
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Your message has been sent successfully!'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred while processing your request'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
