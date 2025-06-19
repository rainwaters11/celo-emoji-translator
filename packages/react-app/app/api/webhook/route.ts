import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle Farcaster webhook events
    console.log('Farcaster webhook received:', body);
    
    // You can process different types of events here
    const { type, data } = body;
    
    switch (type) {
      case 'frame_interaction':
        // Handle frame interactions
        return NextResponse.json({
          message: 'Frame interaction processed',
          success: true
        });
      
      case 'mini_app_launch':
        // Handle mini app launches
        return NextResponse.json({
          message: 'Mini app launch processed',
          success: true
        });
      
      default:
        return NextResponse.json({
          message: 'Unknown event type',
          success: false
        });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Celo Emoji Translator Webhook is running',
    timestamp: new Date().toISOString()
  });
}
