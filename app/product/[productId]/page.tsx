'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Heart, ShoppingBag, Zap, Shield, Truck, RefreshCw, CreditCard } from 'lucide-react';
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
  const [selectedLens, setSelectedLens] = useState('Zero Power (Clear)');
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
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white pt-32 pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white pt-32 pb-24 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={40}
              height={40}
              className="w-10 h-10 opacity-50"
            />
          </div>
          <h2 className="text-2xl font-light text-gray-900 mb-3">Product Not Found</h2>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Back to Home
            </button>
            <button 
              onClick={() => router.push('/collections/men')}
              className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const savings = Math.round(product.mrp - product.price);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Breadcrumb Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="text-sm text-gray-600">
            <span 
              onClick={() => router.push('/')} 
              className="hover:text-gray-900 cursor-pointer transition-colors"
            >
              Home
            </span>
            <span className="mx-2">/</span>
            <span 
              onClick={() => router.push(`/collections/${product.gender}`)} 
              className="hover:text-gray-900 cursor-pointer transition-colors capitalize"
            >
              {product.gender}'s Collection
            </span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Gallery - STATIC */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <ProductGallery images={product.images} modelNumber={product.modelNumber} />
            </div>

            {/* Product Badges */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs font-medium text-blue-900">1 Year Warranty</p>
                  <p className="text-xs text-blue-700">Authentic Product</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg">
                <Truck className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs font-medium text-green-900">Free Shipping</p>
                  <p className="text-xs text-green-700">Above ₹1000</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-lg">
                <RefreshCw className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs font-medium text-purple-900">Easy Returns</p>
                  <p className="text-xs text-purple-700">14 Days Policy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details - SCROLLABLE */}
          <div className="lg:h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-4">
            <div className="space-y-6 pb-8">
              {/* Header Info */}
              <div className="pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
                    {product.brand}
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {product.gender}'s Eyewear
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-2 tracking-tight">
                  {product.name}
                </h1>
                <p className="text-gray-600 text-lg font-light mb-2">{product.modelNumber}</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.8 • 124 Reviews)</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="pb-6 border-b border-gray-200">
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-4xl font-semibold text-gray-900">
                    ₹{product.price.toFixed(2)}
                  </span>
                  <span className="text-2xl text-gray-400 line-through">
                    ₹{product.mrp.toFixed(2)}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <Zap size={18} className="text-green-600" />
                  <p className="text-green-700 font-semibold">
                    Save ₹{savings.toFixed(2)} ({product.discount}% OFF)
                  </p>
                </div>
              </div>

              {/* Frame Color Selection */}
              {product.colors.length > 0 && (
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    Frame Color
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(index)}
                        className={`py-3 px-4 rounded-lg border-2 transition-all text-sm font-medium ${
                          selectedColor === index
                            ? 'border-gray-900 bg-gray-900 text-white shadow-md'
                            : 'border-gray-200 text-gray-900 hover:border-gray-400 hover:shadow-sm'
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
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    Frame Size
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 px-5 rounded-lg font-semibold transition-all min-w-[80px] ${
                          selectedSize === size
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    <span className="font-medium">Need help?</span> Use our frame size guide
                  </p>
                </div>
              )}

              {/* Lens Selection */}
              <div className="pb-6 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  Select Lenses
                </h3>
                <div className="space-y-3">
                  {['Zero Power (Clear)', 'Prescription Lenses', 'Sunglasses'].map((lens) => (
                    <button
                      key={lens}
                      onClick={() => setSelectedLens(lens)}
                      className={`w-full py-4 px-6 rounded-xl border-2 transition-all text-left font-medium ${
                        selectedLens === lens
                          ? 'border-gray-900 bg-gray-900 text-white shadow-md'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{lens}</span>
                        {lens === 'Zero Power (Clear)' && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                            FREE
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="pb-6 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  Quantity
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-gray-400 flex items-center justify-center hover:shadow-sm transition-all"
                  >
                    <span className="text-lg font-medium">−</span>
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-gray-400 flex items-center justify-center hover:shadow-sm transition-all"
                  >
                    <span className="text-lg font-medium">+</span>
                  </button>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      Subtotal: ₹{(product.price * quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">({quantity} × ₹{product.price.toFixed(2)})</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`w-full py-4 rounded-xl border-2 transition-all font-medium ${
                    isFavorited
                      ? 'bg-gradient-to-r from-red-50 to-rose-50 border-red-500 text-red-600 hover:shadow-md'
                      : 'border-gray-900 text-gray-900 hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    <Heart size={20} className={isFavorited ? 'fill-current' : ''} />
                    {isFavorited ? 'Added to Favorites' : 'Add to Favorites'}
                  </div>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={addToCart}
                    className="w-full py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-3"
                  >
                    <ShoppingBag size={20} />
                    Add to Cart
                  </button>

                  <button 
                    onClick={buyNow}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Payment Options */}
              <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard size={18} className="text-gray-600" />
                  Payment Options
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="text-center p-2 border border-gray-200 rounded-lg bg-white">
                    <p className="text-xs font-medium text-gray-900">Credit Card</p>
                    <p className="text-xs text-gray-500">EMI Available</p>
                  </div>
                  <div className="text-center p-2 border border-gray-200 rounded-lg bg-white">
                    <p className="text-xs font-medium text-gray-900">UPI</p>
                    <p className="text-xs text-gray-500">Instant Payment</p>
                  </div>
                  <div className="text-center p-2 border border-gray-200 rounded-lg bg-white">
                    <p className="text-xs font-medium text-gray-900">Net Banking</p>
                    <p className="text-xs text-gray-500">All Banks</p>
                  </div>
                  <div className="text-center p-2 border border-gray-200 rounded-lg bg-white">
                    <p className="text-xs font-medium text-gray-900">COD</p>
                    <p className="text-xs text-gray-500">Cash on Delivery</p>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              {product.description && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    About this Product
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Brand</span>
                        <span className="font-medium text-gray-900">{product.brand}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Material</span>
                        <span className="font-medium text-gray-900">{product.material}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Gender</span>
                        <span className="font-medium text-gray-900 capitalize">{product.gender}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Frame Type</span>
                        <span className="font-medium text-gray-900">Full Rim</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Features */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-medium text-gray-900 mb-4">Why Choose This Frame?</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm text-gray-700">Premium {product.material} construction for durability</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm text-gray-700">UV protection lenses included</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm text-gray-700">Adjustable nose pads for comfort</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm text-gray-700">Flexible hinges for extended lifespan</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}