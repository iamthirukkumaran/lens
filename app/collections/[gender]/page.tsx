'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FiltersSidebar from '@/components/FiltersSidebar';
import ProductCard from '@/components/ProductCard';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  modelNumber: string;
  price: number;
  mrp: number;
  discount: number;
  images: string[];
  brand: string;
  gender: string;
  material: string;
  sizes: string[];
}

interface CollectionsPageProps {
  params: {
    gender: string;
  };
}

export default function CollectionsPage({ params }: CollectionsPageProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState<any>(null);

  // Load user and their favorites on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Load favorites for this specific user
      const userFavoritesKey = `favorites_${userData.id}`;
      const userFavorites = localStorage.getItem(userFavoritesKey);
      if (userFavorites) {
        try {
          setFavorites(JSON.parse(userFavorites));
        } catch (e) {
          setFavorites([]);
        }
      }
    }
  }, []);

  const fetchProducts = useCallback(async (page: number, filtersToUse: any, isFilterChange: boolean = false) => {
    try {
      if (isFilterChange) {
        setFilterLoading(true); // Use filter loading for filter changes
      } else {
        setLoading(true); // Use regular loading for initial load and page changes
      }

      const queryParams = new URLSearchParams({
        gender: params.gender,
        page: page.toString(),
        limit: '12',
      });

      if (filtersToUse.brands?.length) {
        filtersToUse.brands.forEach((brand: string) => {
          queryParams.append('brand', brand);
        });
      }

      if (filtersToUse.materials?.length) {
        filtersToUse.materials.forEach((material: string) => {
          queryParams.append('material', material);
        });
      }

      if (filtersToUse.sizes?.length) {
        filtersToUse.sizes.forEach((size: string) => {
          queryParams.append('size', size);
        });
      }

      if (filtersToUse.colors?.length) {
        filtersToUse.colors.forEach((color: string) => {
          queryParams.append('color', color);
        });
      }

      const response = await fetch(`/api/products?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data || []);
        setPagination(data.pagination || { page: 1, total: 0, pages: 0 });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  }, [params.gender]);

  // Initial fetch
  useEffect(() => {
    fetchProducts(currentPage, filters);

    // Set up auto-refresh every 60 seconds to show updated stock
    const refreshInterval = setInterval(() => {
      fetchProducts(currentPage, filters);
    }, 60000); // Refresh every 60 seconds (1 minute)

    return () => clearInterval(refreshInterval);
  }, []);

  // Fetch when page changes
  useEffect(() => {
    if (currentPage !== 1) { // Don't fetch on initial load (already handled)
      fetchProducts(currentPage, filters);
    }
  }, [currentPage]);

  // Fetch when filters change (reset to page 1)
  useEffect(() => {
    if (Object.keys(filters).length > 0) { // Only fetch if filters are actually set
      fetchProducts(1, filters, true);
    }
  }, [filters]);

  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId);
    // Implement cart logic
  };

  const handleAddToFavorites = (productId: string) => {
    setFavorites(prev => {
      let updated: string[];
      if (prev.includes(productId)) {
        updated = prev.filter((id) => id !== productId);
      } else {
        updated = [...prev, productId];
      }
      
      // Save favorites for this specific user
      if (user) {
        const userFavoritesKey = `favorites_${user.id}`;
        localStorage.setItem(userFavoritesKey, JSON.stringify(updated));
      }
      
      return updated;
    });
  };

  const handleFilterChange = useCallback((newFilters: any) => {
    setCurrentPage(1); // Reset to page 1 when filters change
    setFilters(newFilters);
  }, []);

  const genderLabel = {
    men: 'Men',
    women: 'Women',
    kids: 'Kids',
  }[params.gender] || 'Products';

  return (
    <div className="min-h-screen bg-white">
      {/* Header - STICKY */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="text-sm font-medium">Back to Home</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-400 cursor-default">
                GENDER: <span className="font-semibold text-gray-700 uppercase">{genderLabel}</span>
              </div>
              <button
                onClick={() => {
                  setRefreshing(true);
                  fetchProducts(currentPage, filters).then(() => setRefreshing(false));
                }}
                disabled={refreshing}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                title="Refresh product list to see updated stock"
              >
                <RefreshCw size={18} className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <h1 className="text-3xl md:text-4xl font-light mb-1 tracking-tight">
              {genderLabel} <span className="text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">Collection</span>
            </h1>
          </div>

          {/* Results Count with loading indicator */}
          <div className="text-sm text-gray-500 tracking-widest flex items-center gap-2">
            Showing 1–{Math.min(50, pagination.total)} of {pagination.total} Results
            {filterLoading && (
              <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - STICKY */}
          <div className="lg:sticky lg:top-36 lg:max-h-[calc(100vh-144px)] overflow-y-auto">
            <FiltersSidebar onFilterChange={handleFilterChange} gender={params.gender} />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Filter loading overlay */}
            {filterLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  <p className="text-gray-600 text-sm">Applying filters...</p>
                </div>
              </div>
            )}

            {/* Show loading only when there are no products OR it's initial load */}
            {(loading && products.length === 0) ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-40 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse"
                  />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                {/* Fade in/out transition for products */}
                <div 
                  className={`space-y-3 mb-12 transition-opacity duration-300 ${
                    filterLoading ? 'opacity-30' : 'opacity-100'
                  }`}
                >
                  {products.map((product) => (
                    <ProductCard
                      key={`${product._id}-${currentPage}-${JSON.stringify(filters)}`} // Include filters in key for better updates
                      id={product._id}
                      name={product.name}
                      modelNumber={product.modelNumber}
                      price={product.price}
                      mrp={product.mrp}
                      discount={product.discount}
                      images={product.images}
                      onAddToCart={() => handleAddToCart(product._id)}
                      onAddToFavorites={() => handleAddToFavorites(product._id)}
                      isFavorited={favorites.includes(product._id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className={`flex items-center justify-center gap-4 transition-opacity duration-300 ${
                    filterLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'
                  }`}>
                    <button
                      onClick={() => setCurrentPage(Math.max(1, pagination.page - 1))}
                      disabled={pagination.page === 1 || filterLoading}
                      className="p-3 rounded-full border border-gray-200 hover:border-gray-400 disabled:opacity-50 transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: pagination.pages }).map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => !filterLoading && setCurrentPage(i + 1)}
                          disabled={filterLoading}
                          className={`w-10 h-10 rounded-full transition-all ${
                            pagination.page === i + 1
                              ? 'bg-gray-900 text-white'
                              : 'border border-gray-200 hover:border-gray-400'
                          } ${filterLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(Math.min(pagination.pages, pagination.page + 1))}
                      disabled={pagination.page === pagination.pages || filterLoading}
                      className="p-3 rounded-full border border-gray-200 hover:border-gray-400 disabled:opacity-50 transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={`text-center py-16 transition-opacity duration-300 ${
                filterLoading ? 'opacity-30' : 'opacity-100'
              }`}>
                <p className="text-gray-600 text-lg">No products found matching your filters.</p>
                <button
                  onClick={() => {
                    setFilters({});
                    setCurrentPage(1);
                  }}
                  className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}