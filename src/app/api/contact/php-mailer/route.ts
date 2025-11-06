import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Get form data
    const formData = await request.formData();
    
    // Add any additional fields your PHP API expects
    formData.append('action', 'contact');
    
    // Get the PHP Mailer API URL from environment variables
    const phpMailerUrl = process.env['PHP_MAILER_API_URL'] || 
                         process.env['NEXT_PUBLIC_API_BASE_URL'] ? 
                         `${process.env['NEXT_PUBLIC_API_BASE_URL']}/contact.php` : 
                         'http://localhost/contact.php';
    
    // Forward the request to your PHP Mailer API
    const response = await fetch(phpMailerUrl, {
      method: 'POST',
      body: formData,
    });
    
    // Get the response text
    const responseText = await response.text();
    
    // Check if the response is JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      // If not JSON, create a success response if it contains 'success'
      responseData = {
        success: responseText.toLowerCase().includes('success'),
        message: responseText
      };
    }
    
    // Return the response from PHP Mailer
    return NextResponse.json({
      success: responseData.success || false,
      message: responseData.message || responseData.msg || 'Message sent successfully',
      data: responseData
    }, { 
      status: response.ok ? 200 : 400 
    });
    
  } catch (error) {
    console.error('Error in contact form submission:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred while sending the message'
    }, { status: 500 });
  }
}
