import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const bookingData = await request.json();
    
    // Validate required fields
    const requiredFields = ['checkIn', 'checkOut', 'roomType', 'adults'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Here you would typically:
    // 1. Validate the data further
    // 2. Check room availability
    // 3. Save to your database
    // 4. Send confirmation emails, etc.
    
    // For now, we'll just log the booking and return a success response
    console.log('New booking received:', bookingData);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json(
      { 
        message: 'Booking request received successfully!',
        booking: bookingData,
        // In a real app, you'd include a booking reference ID here
        reference: `BOOK-${Date.now()}`
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error processing booking:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing your booking. Please try again.' },
      { status: 500 }
    );
  }
}
