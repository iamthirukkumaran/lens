'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ArrowLeft, ShoppingBag, Heart } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  mrp: number;
  discount: number;
  images: string[];
  brand: string;
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      const storedFavorites = localStorage.getItem(`favorites_${userData.id}`);
      if (storedFavorites) {
        try {
          const favList = JSON.parse(storedFavorites);
          setFavorites(new Set(favList.map((f: any) => f._id)));
        } catch (e) {
          setFavorites(new Set());
        }
      }
    }
  }, []);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);

    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/products/search?query=${encodeURIComponent(searchQuery)}`
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data.products || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (productId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    const newFavorites = new Set(favorites);
    const product = results.find((p) => p._id === productId);

    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else if (product) {
      newFavorites.add(productId);
    }

    setFavorites(newFavorites);

    // Persist to localStorage
    if (user) {
      const favList = results.filter((p) => newFavorites.has(p._id));
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favList));
    }
  };

  const addToCart = (product: Product) => {
    if (!user) {
      router.push('/login');
      return;
    }

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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft size={20} className="text-gray-600 hover:text-gray-900" />
            </Link>
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search eyewear..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 text-sm"
                autoFocus
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {query.trim().length < 2 ? (
          <div className="text-center py-16">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">
              Enter at least 2 characters to search
            </p>
          </div>
        ) : loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-4">Searching...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-600 text-lg">
              No products found for "{query}"
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Try different keywords or browse our collections
            </p>
          </div>
        ) : (
          <div>
            <p className="text-lg text-gray-600 mb-8">
              Found {results.length} product{results.length !== 1 ? 's' : ''}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
                >
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

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ${product.mrp.toFixed(2)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Link
                        href={`/product/${product._id}`}
                        className="block w-full py-2 px-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-center text-xs font-light"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full py-2 px-3 border border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-xs font-light"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => toggleFavorite(product._id)}
                        className={`w-full py-2 px-3 rounded-lg transition-colors text-xs font-light ${
                          favorites.has(product._id)
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'border border-gray-200 text-gray-600 hover:border-red-300'
                        }`}
                      >
                        <Heart
                          size={14}
                          className="mx-auto"
                          fill={favorites.has(product._id) ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
