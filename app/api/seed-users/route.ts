import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcryptjs from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Clear existing demo users
    await User.deleteMany({
      $or: [
        { email: 'admin@demo.com' },
        { email: 'customer@demo.com' },
      ],
    });

    // Create demo admin account
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@demo.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create demo customer account
    const customer = await User.create({
      name: 'John Customer',
      email: 'customer@demo.com',
      password: 'customer123',
      role: 'customer',
    });

    return NextResponse.json({
      success: true,
      message: 'Demo accounts created successfully',
      accounts: [
        {
          name: 'Admin Account',
          email: 'admin@demo.com',
          password: 'admin123',
          role: 'admin',
        },
        {
          name: 'Customer Account',
          email: 'customer@demo.com',
          password: 'customer123',
          role: 'customer',
        },
      ],
    });
  } catch (error) {
    console.error('Error creating demo accounts:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create demo accounts',
      },
      { status: 500 }
    );
  }
}
