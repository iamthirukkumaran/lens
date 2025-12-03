import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectDB();

    // Get total revenue
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Get total orders
    const totalOrders = await Order.countDocuments();

    // Get total products
    const totalProducts = await Product.countDocuments();

    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          productName: { $first: '$items.name' },
          sold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { sold: -1 } },
      { $limit: 5 },
    ]);

    // Get revenue by status
    const revenueByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          revenue: { $sum: '$total' },
        },
      },
    ]);

    const revenueByStatusMap: { [key: string]: number } = {};
    revenueByStatus.forEach((item) => {
      revenueByStatusMap[item._id || 'unknown'] = item.revenue;
    });

    // Get orders by month for last 12 months
    const ordersByMonth = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$total' },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedByMonth = ordersByMonth
      .reverse()
      .map((item) => ({
        month: monthNames[item._id.month - 1],
        orders: item.orders,
        revenue: item.revenue,
      }));

    return NextResponse.json({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      totalProducts,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      topSellingProducts: topProducts.map((p) => ({
        name: p.productName,
        sold: p.sold,
        revenue: Math.round(p.revenue * 100) / 100,
      })),
      revenueByStatus: Object.fromEntries(
        Object.entries(revenueByStatusMap).map(([status, revenue]) => [
          status,
          Math.round(revenue * 100) / 100,
        ])
      ),
      ordersByMonth: formattedByMonth,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
