import { NextResponse } from 'next/server';
import { verifyRecaptcha } from '@/lib/recaptcha';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const message = formData.get('message')?.toString() || '';
    const phone = formData.get('phone')?.toString() || '';
    const recaptchaToken = formData.get('g-recaptcha-response')?.toString() || '';

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

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully!'
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while processing your request'
    }, { status: 500 });
  }
}
