import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

const seedProducts = [
  // Men's Collection
  {
    name: 'Classic Metal Frame',
    modelNumber: 'Arcadio FF371',
    price: 2470,
    mrp: 4050,
    discount: 39,
    gender: 'men',
    brand: 'Arcadio',
    material: 'Stainless Steel',
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Gun Metal', hex: '#2C3E50' },
      { name: 'Silver', hex: '#C0C0C0' },
    ],
    images: ['/top1.jpeg', '/top2.jpeg', '/top3.jpg'],
    description: 'Premium stainless steel frame with anti-glare lenses.',
  },
  {
    name: 'Titanium Pro',
    modelNumber: 'Arcadio FF378',
    price: 2800,
    mrp: 3750,
    discount: 25,
    gender: 'men',
    brand: 'Arcadio',
    material: 'Titanium',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Matte Black', hex: '#1A1A1A' },
      { name: 'Rose Gold', hex: '#B76E79' },
    ],
    images: ['/top1.jpeg', '/top2.jpeg'],
    description: 'Lightweight titanium construction with premium finish.',
  },
  {
    name: 'Sports Edge',
    modelNumber: 'Arcadio FF381',
    price: 2580,
    mrp: 3450,
    discount: 25,
    gender: 'men',
    brand: 'Arcadio',
    material: 'Flex Titanium',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Red', hex: '#FF0000' },
    ],
    images: ['/top3.jpg', '/top1.jpeg'],
    description: 'Flexible titanium for active lifestyles.',
  },
  {
    name: 'Urban Style',
    modelNumber: 'Titan TT201',
    price: 1899,
    mrp: 3200,
    discount: 41,
    gender: 'men',
    brand: 'Titan',
    material: 'Other Metal',
    sizes: ['M', 'L'],
    colors: [
      { name: 'Brown', hex: '#8B4513' },
      { name: 'Black', hex: '#000000' },
    ],
    images: ['/top2.jpeg', '/top3.jpg'],
    description: 'Contemporary design for the urban professional.',
  },

  // Women's Collection
  {
    name: 'Elegant Cat Eye',
    modelNumber: 'Titan WW401',
    price: 1999,
    mrp: 3500,
    discount: 43,
    gender: 'women',
    brand: 'Titan',
    material: 'Acetate',
    sizes: ['XS', 'S', 'M'],
    colors: [
      { name: 'Tortoiseshell', hex: '#8B4513' },
      { name: 'Blush Pink', hex: '#FFB6C1' },
    ],
    images: ['/top1.jpeg', '/top2.jpeg', '/top3.jpg'],
    description: 'Stylish cat eye design with premium acetate.',
  },
  {
    name: 'Minimalist Round',
    modelNumber: 'Fastrack WW501',
    price: 1299,
    mrp: 2500,
    discount: 48,
    gender: 'women',
    brand: 'Fastrack',
    material: 'Other Metal',
    sizes: ['XS', 'S', 'M'],
    colors: [
      { name: 'Gold', hex: '#FFD700' },
      { name: 'Silver', hex: '#C0C0C0' },
    ],
    images: ['/top2.jpeg', '/top3.jpg'],
    description: 'Minimal round frame perfect for all occasions.',
  },
  {
    name: 'Designer Oversized',
    modelNumber: 'Tommy WW601',
    price: 3299,
    mrp: 5499,
    discount: 40,
    gender: 'women',
    brand: 'Tommy Hilfiger',
    material: 'Titanium',
    sizes: ['M', 'L'],
    colors: [
      { name: 'Burgundy', hex: '#800020' },
      { name: 'Black', hex: '#000000' },
    ],
    images: ['/top1.jpeg', '/top3.jpg'],
    description: 'Luxury oversized frames from Tommy Hilfiger.',
  },
  {
    name: 'Retro Vibes',
    modelNumber: 'Police WW701',
    price: 2199,
    mrp: 4000,
    discount: 45,
    gender: 'women',
    brand: 'Police',
    material: 'Acetate',
    sizes: ['S', 'M'],
    colors: [
      { name: 'Vintage Red', hex: '#C41E3A' },
      { name: 'Classic Black', hex: '#1A1A1A' },
    ],
    images: ['/top3.jpg', '/top2.jpeg'],
    description: 'Retro-inspired frames with a modern twist.',
  },

  // Kids' Collection
  {
    name: 'Fun & Colorful',
    modelNumber: 'Kids KK101',
    price: 799,
    mrp: 1500,
    discount: 47,
    gender: 'kids',
    brand: 'Fastrack',
    material: 'Acetate',
    sizes: ['XS', 'S'],
    colors: [
      { name: 'Bright Blue', hex: '#0000FF' },
      { name: 'Lime Green', hex: '#32CD32' },
    ],
    images: ['/top1.jpeg', '/top2.jpeg'],
    description: 'Durable and playful frames for kids.',
  },
  {
    name: 'Sporty Kids',
    modelNumber: 'Kids KK201',
    price: 899,
    mrp: 1800,
    discount: 50,
    gender: 'kids',
    brand: 'Aeropostale',
    material: 'Flex Titanium',
    sizes: ['S', 'M'],
    colors: [
      { name: 'Orange', hex: '#FFA500' },
      { name: 'Purple', hex: '#800080' },
    ],
    images: ['/top2.jpeg', '/top3.jpg'],
    description: 'Flexible frames designed for active kids.',
  },
  {
    name: 'Adventure Ready',
    modelNumber: 'Kids KK301',
    price: 699,
    mrp: 1400,
    discount: 50,
    gender: 'kids',
    brand: 'Aeropostale',
    material: 'Other Metal',
    sizes: ['XS', 'S', 'M'],
    colors: [
      { name: 'Sky Blue', hex: '#87CEEB' },
      { name: 'Forest Green', hex: '#228B22' },
    ],
    images: ['/top3.jpg', '/top1.jpeg'],
    description: 'Lightweight and durable for all adventures.',
  },
];

export async function GET() {
  try {
    await connectDB();

    // Check if products already exist
    const existingCount = await Product.countDocuments();

    if (existingCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Database already has ${existingCount} products`,
      });
    }

    // Insert seed products
    const result = await Product.insertMany(seedProducts);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      count: result.length,
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
