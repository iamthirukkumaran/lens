'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Heart, ShoppingBag, Zap } from 'lucide-react';
import ProductGallery from '@/components/ProductGallery';
import Image from 'next/image';
import { Toast } from '@/components/Toast';

interface Product {
  _id: string;
  name: string;
  modelNumber: string;
  price: number;
  mrp: number;
  discount: number;
  images: string[];
  description: string;
  brand: string;
  gender: string;
  material: string;
  sizes: string[];
  colors: string[];
}

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [productId, setProductId] = useState<string | null>(null);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedLens, setSelectedLens] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // First effect: Set productId from params
  useEffect(() => {
    if (params?.productId) {
      setProductId(params.productId as string);
    }
  }, [params]);

  // Second effect: Fetch product when productId is set
  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      console.log('Fetching product with ID:', productId);
      
      // Validate MongoDB ObjectId format (24 hex characters)
      const isValidObjectId = /^[0-9a-f]{24}$/.test(productId!);
      if (!isValidObjectId) {
        console.error('Invalid product ID format:', productId);
        setProduct(null);
        setLoading(false);
        return;
      }

      // Add timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const response = await fetch(`/api/products/${productId}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        const errorData = await response.json();
        console.error('Error details:', errorData);
        setProduct(null);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.success && data.data) {
        setProduct(data.data);
        if (data.data.sizes && data.data.sizes.length > 0) {
          setSelectedSize(data.data.sizes[0]);
        }
      } else {
        console.error('Product not found:', data);
        setProduct(null);
      }
    } catch (error: any) {
      console.error('Error fetching product:', error.message || error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!product) return;

    const cartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0],
      color: product.colors[selectedColor] || '',
      size: selectedSize,
    };

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item._id === product._id && item.size === selectedSize);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setToast({ message: 'Added to cart!', type: 'success' });
  };

  const buyNow = () => {
    if (!product) return;

    const cartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0],
      color: product.colors[selectedColor] || '',
      size: selectedSize,
    };

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item._id === product._id && item.size === selectedSize);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Use replace to avoid history stack and ensure smooth navigation
    router.replace('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-40 pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-40 pb-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-600 mb-4">Product not found</p>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const savings = Math.round(product.mrp - product.price);

  return (
    <div className="min-h-screen bg-white pt-20 pb-24">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <div>
            <ProductGallery images={product.images} modelNumber={product.modelNumber} />
          </div>

          {/* Product Details - STICKY */}
          <div className="lg:sticky lg:top-20 lg:h-fit">
            {/* Header Info */}
            <div className="mb-8">
              <div className="inline-block px-4 py-2 bg-gray-100 rounded-full text-sm font-semibold text-gray-700 mb-6">
                {product.brand} • {product.gender.toUpperCase()}
              </div>

              <h1 className="text-4xl font-light text-gray-900 mb-2 tracking-tight">
                {product.name}
              </h1>
              <p className="text-gray-600 text-lg font-light">{product.modelNumber}</p>
            </div>

            {/* Price Section */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-4xl font-semibold text-gray-900">
                  Rs. {product.price.toFixed(2)}
                </span>
                <span className="text-2xl text-gray-400 line-through">
                  Rs. {product.mrp.toFixed(2)}
                </span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                <Zap size={18} className="text-green-600" />
                <p className="text-green-700 font-semibold">
                  Save Rs. {savings.toFixed(2)} ({product.discount}% OFF)
                </p>
              </div>
            </div>

            {/* Frame Color Selection */}
            {product.colors.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm tracking-widest font-semibold text-gray-900 mb-4">
                  FRAME COLOR
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(index)}
                      className={`py-2 px-3 rounded-lg border-2 transition-all text-sm font-medium ${
                        selectedColor === index
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 text-gray-900 hover:border-gray-400'
                      }`}
                      title={color}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Frame Size Selection */}
            {product.sizes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm tracking-widest font-semibold text-gray-900 mb-4">
                  FRAME SIZE
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        selectedSize === size
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Lens Selection */}
            <div className="mb-12">
              <h3 className="text-sm tracking-widest font-semibold text-gray-900 mb-4">
                SELECT LENSES
              </h3>
              <div className="space-y-3">
                {['Zero Power (Clear)', 'Prescription Lenses', 'Sunglasses'].map((lens) => (
                  <button
                    key={lens}
                    onClick={() => setSelectedLens(lens)}
                    className={`w-full py-4 px-6 rounded-xl border-2 transition-all text-left font-light ${
                      selectedLens === lens
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {lens}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="text-sm tracking-widest font-semibold text-gray-900 mb-4">
                QUANTITY
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-gray-400 flex items-center justify-center"
                >
                  −
                </button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-gray-400 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className={`w-full py-5 rounded-xl border-2 transition-all font-light tracking-widest ${
                  isFavorited
                    ? 'bg-red-50 border-red-500 text-red-600'
                    : 'border-gray-900 text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <Heart size={20} className={isFavorited ? 'fill-current' : ''} />
                  {isFavorited ? 'ADDED TO FAVORITES' : 'ADD TO FAVORITES'}
                </div>
              </button>

              <button 
                onClick={addToCart}
                className="w-full py-5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-light tracking-widest flex items-center justify-center gap-3"
              >
                <ShoppingBag size={20} />
                ADD TO CART
              </button>

              <button 
                onClick={buyNow}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all font-light tracking-widest"
              >
                BUY NOW
              </button>
            </div>

            {/* Product Info */}
            {product.description && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-sm tracking-widest font-semibold text-gray-900 mb-4">
                  ABOUT THIS PRODUCT
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Specifications */}
            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 text-sm">Brand</span>
                <span className="font-semibold text-gray-900">{product.brand}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 text-sm">Material</span>
                <span className="font-semibold text-gray-900">{product.material}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 text-sm">Gender</span>
                <span className="font-semibold text-gray-900 capitalize">{product.gender}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
