'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, ShoppingBag, Heart } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  mrp: number;
  discount: number;
  images: string[];
  brand: string;
  gender: string;
}

export default function TrendingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.gender === selectedCategory);

  const addToCart = (product: Product) => {
    const cartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0],
    };

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft size={20} className="text-gray-600" />
            <span className="text-gray-600 hover:text-gray-900">Back</span>
          </Link>
          <h1 className="text-xl font-light">Trending & Best Sellers</h1>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp size={24} className="text-orange-500" />
            <h2 className="text-4xl font-light">What's Hot Right Now</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Check out the most popular and best-selling frames this season. Loved by thousands of customers.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-12 justify-center flex-wrap">
          {[
            { id: 'all', label: 'All Products' },
            { id: 'men', label: 'Men' },
            { id: 'women', label: 'Women' },
            { id: 'kids', label: 'Kids' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2 rounded-full font-light transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-900 hover:border-gray-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-4">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-600 text-lg">No products found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {filteredProducts.map((product, index) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Badge */}
                <div className="absolute top-4 left-4 z-10">
                  {index < 3 && (
                    <div className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                      #{index + 1} Trending
                    </div>
                  )}
                </div>

                {/* Image */}
                {product.images[0] && (
                  <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {product.brand}
                  </p>
                  <h3 className="font-light text-gray-900 mb-3 line-clamp-2 text-sm">
                    {product.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ${product.mrp.toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Link
                      href={`/product/${product._id}`}
                      className="block w-full py-2 px-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-center text-xs font-light"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-2 px-3 border border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-xs font-light"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Why These Are Popular */}
        <section className="bg-white rounded-2xl border border-gray-100 p-12">
          <h3 className="text-2xl font-light mb-12 text-center">Why These Frames Are Popular</h3>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h4 className="font-semibold text-gray-900 mb-2">Excellent Reviews</h4>
              <p className="text-sm text-gray-600">
                Thousands of 5-star reviews from satisfied customers
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="font-semibold text-gray-900 mb-2">Perfect Fit</h4>
              <p className="text-sm text-gray-600">
                Designed for comfort and style that works for everyone
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">💎</div>
              <h4 className="font-semibold text-gray-900 mb-2">Premium Quality</h4>
              <p className="text-sm text-gray-600">
                High-quality materials and expert craftsmanship
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
