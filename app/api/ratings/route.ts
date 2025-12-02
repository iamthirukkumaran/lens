import { connectDB } from '@/lib/mongodb';
import Rating from '@/models/Rating';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const productId = request.nextUrl.searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      );
    }

    const ratings = await Rating.find({ productId })
      .sort({ createdAt: -1 })
      .limit(50);

    // Calculate average rating
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

    return NextResponse.json({
      ratings,
      averageRating: parseFloat(avgRating.toFixed(1)),
      totalRatings: ratings.length,
    });
  } catch (error) {
    console.error('Fetch ratings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { productId, userId, rating, review, userName } = await request.json();

    if (!productId || !userId || !rating || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already rated this product
    const existingRating = await Rating.findOne({ productId, userId });

    let result;
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.review = review || '';
      result = await existingRating.save();
    } else {
      // Create new rating
      const newRating = new Rating({
        productId,
        userId,
        rating,
        review: review || '',
        userName,
      });
      result = await newRating.save();
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Add rating error:', error);
    return NextResponse.json(
      { error: 'Failed to add rating' },
      { status: 500 }
    );
  }
}
