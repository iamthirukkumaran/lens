import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Force dynamic rendering on Vercel
export const revalidate = 0; // Never cache this route

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const gender = searchParams.get('gender');
    const brands = searchParams.getAll('brand');
    const materials = searchParams.getAll('material');
    const sizes = searchParams.getAll('size');
    const colors = searchParams.getAll('color');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const filter: any = {};

    if (gender) filter.gender = gender;
    if (brands.length > 0) filter.brand = { $in: brands };
    if (materials.length > 0) filter.material = { $in: materials };
    if (sizes.length > 0) filter.sizes = { $in: sizes };
    if (colors.length > 0) filter.colors = { $in: colors };

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    const response = NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });

    // Prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const product = await Product.create(body);

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating product:', error);
    const errorMessage = error.message || 'Failed to create product';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
