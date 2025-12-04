import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic'; // Force dynamic rendering on Vercel
export const revalidate = 0; // Never cache this route

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, userName, userEmail, items, shippingAddress, subtotal, shipping, tax, total, paymentMethod } = body;

    if (!userId || !items || !shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Reduce stock for each product in the order
    for (const item of items) {
      try {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } },
          { new: true }
        );
      } catch (err) {
        console.error(`Failed to update stock for product ${item.productId}:`, err);
        // Don't fail the order if stock update fails, just log it
      }
    }

    const order = await Order.create({
      userId,
      userName: userName || 'Customer',
      userEmail: userEmail || '',
      items,
      shippingAddress,
      subtotal,
      shipping: shipping || 10,
      tax,
      total,
      orderId,
      paymentMethod: paymentMethod || 'credit_card',
      paymentStatus: 'completed',
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: {
        _id: order._id.toString(),
        orderId: order.orderId,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create order',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = request.nextUrl.searchParams.get('userId');
    const adminQuery = request.nextUrl.searchParams.get('admin');

    // If admin is requesting all orders
    if (adminQuery === 'true') {
      const orders = await Order.find({}).sort({ createdAt: -1 });
      
      const response = NextResponse.json({
        success: true,
        data: orders,
      });

      // Prevent caching
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');

      return response;
    }

    // If userId is provided, get user-specific orders
    if (userId) {
      const orders = await Order.find({ userId }).sort({ createdAt: -1 });

      return NextResponse.json({
        success: true,
        orders,
      });
    }

    return NextResponse.json(
      { success: false, error: 'userId or admin flag is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { orderId, status, shippingAddress } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'orderId is required' },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
    }
    
    if (shippingAddress) {
      updateData.shippingAddress = shippingAddress;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update order',
      },
      { status: 500 }
    );
  }
}
