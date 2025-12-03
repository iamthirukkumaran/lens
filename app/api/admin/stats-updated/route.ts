import { NextRequest, NextResponse } from 'next/server';

// This is a simple trigger endpoint that can be called after an order is placed
// to notify subscribed clients that stats have been updated
export async function POST(request: NextRequest) {
  try {
    // This endpoint can be extended to use Server-Sent Events or webhooks in the future
    return NextResponse.json({
      success: true,
      message: 'Stats updated trigger sent'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to trigger stats update' },
      { status: 500 }
    );
  }
}
