import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

// Get cart
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const user = await User.findById(userId).populate('cart.productId');

    return NextResponse.json({
      success: true,
      data: user?.cart || [],
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// Add to cart
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { productId, quantity, selectedSize, selectedColor, selectedLens } = await req.json();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const existingItem = user.cart.find(
      (item: any) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({
        productId,
        quantity,
        selectedSize,
        selectedColor,
        selectedLens,
      });
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Added to cart',
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

// Update cart item
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { productId, quantity } = await req.json();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const cartItem = user.cart.find(
      (item: any) => item.productId.toString() === productId
    );

    if (cartItem) {
      cartItem.quantity = quantity;
      if (quantity === 0) {
        user.cart = user.cart.filter(
          (item: any) => item.productId.toString() !== productId
        );
      }
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Cart updated',
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// Remove from cart
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { productId } = await req.json();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    user.cart = user.cart.filter(
      (item: any) => item.productId.toString() !== productId
    );
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Removed from cart',
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}
