import { NextResponse } from 'next/server';
import { verifyRecaptcha } from '@/lib/recaptcha';
import nodemailer from 'nodemailer';

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env['EMAIL_SERVER_HOST'],
  port: parseInt(process.env['EMAIL_SERVER_PORT'] || '587'),
  secure: process.env['EMAIL_SERVER_SECURE'] === 'true', // true for 465, false for other ports
  auth: {
    user: process.env['EMAIL_SERVER_USER'],
    pass: process.env['EMAIL_SERVER_PASSWORD'],
  },
});

export async function POST(request: Request) {
  try {
    let name: string = '';
    let email: string = '';
    let message: string = '';
    let phone: string = '';
    let recaptchaToken: string = '';

    // Check content type to handle both form data and JSON
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      name = formData.get('name')?.toString() || '';
      email = formData.get('email')?.toString() || '';
      message = formData.get('message')?.toString() || '';
      phone = formData.get('phone')?.toString() || '';
      recaptchaToken = formData.get('g-recaptcha-response')?.toString() || '';
    } else {
      // Handle JSON request
      const jsonData = await request.json();
      name = jsonData.name || '';
      email = jsonData.email || '';
      message = jsonData.message || '';
      phone = jsonData.phone || '';
      recaptchaToken = jsonData['g-recaptcha-response'] || '';
    }

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

    // Log the submission
    console.log('New contact form submission:', {
      name,
      email,
      phone,
      message,
      timestamp: new Date().toISOString()
    });

    // Prepare email content
    const mailOptions = {
      from: `"Rabaul Hotel Contact Form" <${process.env['EMAIL_FROM'] || process.env['EMAIL_SERVER_USER']}>`,
      to: process.env['CONTACT_FORM_RECIPIENT'] || process.env['EMAIL_FROM'] || process.env['EMAIL_SERVER_USER'],
      subject: `New Contact Form Submission from ${name}`,
      text: `
        You have a new contact form submission:
        
        Name: ${name}
        Email: ${email}
        Phone: ${phone || 'Not provided'}
        
        Message:
        ${message}
        
        Timestamp: ${new Date().toISOString()}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <p><em>Timestamp: ${new Date().toLocaleString()}</em></p>
      `
    };

    // Send email
    try {
      await transporter.sendMail(mailOptions);
      console.log('Contact form email sent successfully');
      
      return NextResponse.json({
        success: true,
        message: 'Your message has been sent successfully! We will get back to you soon.'
      }, { status: 200 });
      
    } catch (emailError) {
      console.error('Error sending contact form email:', emailError);
      
      // Still return success to the user but log the error
      return NextResponse.json({
        success: true,
        message: 'Your message has been received, but there was an issue sending the notification. We will get back to you soon.'
      }, { status: 200 });
    }
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while processing your request'
    }, { status: 500 });
  }
}
