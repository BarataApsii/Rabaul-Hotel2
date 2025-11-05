import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const wordpressUrl = process.env['NEXT_PUBLIC_WORDPRESS_URL'];
    if (!wordpressUrl) {
      throw new Error('WordPress URL is not configured');
    }
    const apiUrl = `${wordpressUrl}/wp-json/wp/v2/rooms?_embed&per_page=100`;
    console.log('Fetching rooms from:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error('Failed to fetch rooms:', response.status, response.statusText);
      throw new Error(`Failed to fetch rooms: ${response.status} ${response.statusText}`);
    }
    
    const rooms = await response.json();
    console.log('Raw rooms data from WordPress:', JSON.stringify(rooms, null, 2));
    
    // Transform the data to only include what's needed
    const formattedRooms = rooms.map((room: any) => {
      // Get price from ACF if available, otherwise try direct property
      const price = room.acf?.price_per_night || room.price_per_night;
      
      const formattedRoom = {
        id: room.id,
        title: room.title?.rendered || room.title,
        slug: room.slug,
        price_per_night: price, // Include price at root level for easier access
        acf: {
          price_per_night: price
        },
        featured_image: room._embedded?.['wp:featuredmedia']?.[0]?.source_url
      };
      
      console.log('Formatted room:', JSON.stringify({
        id: formattedRoom.id,
        title: formattedRoom.title,
        slug: formattedRoom.slug,
        price_per_night: formattedRoom.price_per_night,
        has_price: !!formattedRoom.price_per_night
      }, null, 2));
      
      return formattedRoom;
    });
    
    return NextResponse.json(formattedRooms);
  } catch (error) {
    console.error('Error in rooms API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}
