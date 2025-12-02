'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ArrowLeft, ShoppingBag, Trash2, Share2, Check, Sparkles } from 'lucide-react';
import { Toast } from '@/components/Toast';

interface FavoriteProduct {
  _id: string;
  name: string;
  modelNumber: string;
  price: number;
  mrp: number;
  discount: number;
  images: string[];
  brand: string;
}

export default function FavoritesPage() {
  const router = useRouter();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [removingIds, setRemovingIds] = useState<string[]>([]); // Track which items are being removed

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    // Load favorite IDs from localStorage for this specific user
    const userFavoritesKey = `favorites_${userData.id}`;
    const stored = JSON.parse(localStorage.getItem(userFavoritesKey) || '[]');
    setFavoriteIds(stored);
  }, [router]);

  // Fetch all favorites in a single API call
  const fetchFavoritesData = useCallback(async (ids: string[]) => {
    if (ids.length === 0) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Use a single API call to get all favorite products
      const response = await fetch(`/api/products/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setFavorites(data.data);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      // Fallback: Try to fetch individually if batch endpoint doesn't exist
      if (ids.length > 0) {
        const products: FavoriteProduct[] = [];
        for (const id of ids) {
          try {
            const response = await fetch(`/api/products/${id}`);
            const data = await response.json();
            if (data.success && data.data) {
              products.push(data.data);
            }
          } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
          }
        }
        setFavorites(products);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (favoriteIds.length > 0) {
      fetchFavoritesData(favoriteIds);
    } else {
      setLoading(false);
    }
  }, [favoriteIds, fetchFavoritesData]);

  const removeFavorite = useCallback(async (productId: string) => {
    setRemovingIds(prev => [...prev, productId]);
    
    // Small delay for smooth animation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const updated = favoriteIds.filter((id) => id !== productId);
    setFavoriteIds(updated);
    setFavorites(prev => prev.filter((fav) => fav._id !== productId));
    
    // Save for this specific user
    if (user) {
      const userFavoritesKey = `favorites_${user.id}`;
      localStorage.setItem(userFavoritesKey, JSON.stringify(updated));
    }
    
    setRemovingIds(prev => prev.filter(id => id !== productId));
    setToast({ message: 'Removed from favorites', type: 'success' });
  }, [favoriteIds, user]);

  const addToCart = useCallback((product: FavoriteProduct) => {
    const cartItem = {
      _id: product._id,
      name: product.name,
      modelNumber: product.modelNumber,
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
    setToast({ message: 'Added to cart!', type: 'success' });
  }, []);

  const shareWishlist = () => {
    const wishlistData = favorites.map(f => ({ id: f._id, name: f.name, price: f.price }));
    const encoded = btoa(JSON.stringify(wishlistData));
    const shareUrl = `${window.location.origin}/wishlist/${encoded}`;

    navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setToast({ message: 'Wishlist link copied!', type: 'success' });
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchFavoritesData(favoriteIds);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            <h1 className="text-xl font-light">My Favorites</h1>
            <div className="w-10"></div> {/* Spacer */}
          </div>
        </header>

        {/* Loading State */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-600">Loading your favorites...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
          <h1 className="text-2xl font-light text-gray-900">
            My <span className="font-semibold">Favorites</span>
          </h1>
          <div className="relative">
            {favorites.length > 0 && (
              <button
                onClick={shareWishlist}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-all duration-300 text-sm font-medium"
              >
                <Share2 size={16} />
                Share Wishlist
              </button>
            )}

            {shareCopied && (
              <div className="absolute right-0 mt-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium animate-in fade-in duration-300">
                ✓ Copied!
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center mx-auto mb-6">
              <Heart size={32} className="text-red-400" />
            </div>
            <h3 className="text-2xl font-light text-gray-900 mb-3">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save your favorite items here to keep track of what you love
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/collections/men"
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Shop Men's Collection
              </Link>
              <Link
                href="/collections/women"
                className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Shop Women's Collection
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-light text-gray-900 mb-2">
                  <span className="font-semibold">{favorites.length}</span> {favorites.length === 1 ? 'Favorite Item' : 'Favorite Items'}
                </h2>
                <p className="text-gray-600">Items you've saved for later</p>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Sparkles size={16} />
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((product) => {
                const isRemoving = removingIds.includes(product._id);
                
                return (
                  <div
                    key={product._id}
                    className={`bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 ${
                      isRemoving ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                    }`}
                  >
                    {/* Image */}
                    <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Heart size={32} className="text-gray-300" />
                        </div>
                      )}
                      
                      {/* Discount Badge */}
                      {product.discount > 0 && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                          -{product.discount}% OFF
                        </div>
                      )}
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFavorite(product._id)}
                        disabled={isRemoving}
                        className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {product.brand}
                        </span>
                        <span className="text-xs text-gray-400">{product.modelNumber}</span>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-lg font-bold text-gray-900">
                          Rs. {product.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          Rs. {product.mrp.toFixed(2)}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-xs font-medium text-green-600">
                            Save Rs. {(product.mrp - product.price).toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <button
                          onClick={() => router.push(`/product/${product._id}`)}
                          className="w-full py-2.5 px-4 border border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 text-sm font-medium"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <ShoppingBag size={16} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Continue Shopping */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="text-center">
                <p className="text-gray-600 mb-6">Continue exploring more products</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/collections/men"
                    className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    Men's Collection
                  </Link>
                  <Link
                    href="/collections/women"
                    className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Women's Collection
                  </Link>
                  <Link
                    href="/collections/kids"
                    className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Kids' Collection
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}