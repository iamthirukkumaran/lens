import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get total products
    const totalProducts = await Product.countDocuments();

    // Get total orders
    const totalOrders = await Order.countDocuments();

    // Get total revenue (sum of all order totals)
    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' }
        }
      }
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Get pending orders count (status = 'pending')
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    // Get out of stock products count
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      outOfStockProducts
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch stats',
      },
      { status: 500 }
    );
  }
}
