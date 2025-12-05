'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FiltersSidebar from '@/components/FiltersSidebar';
import ProductCard from '@/components/ProductCard';
import { ChevronLeft, ChevronRight, RefreshCw, Filter, Grid, List } from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const productsContainerRef = useRef<HTMLDivElement>(null);

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
        setFilterLoading(true);
      } else {
        setLoading(true);
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

    const refreshInterval = setInterval(() => {
      fetchProducts(currentPage, filters);
    }, 60000);

    return () => clearInterval(refreshInterval);
  }, []);

  // Fetch when page changes
  useEffect(() => {
    if (currentPage !== 1) {
      fetchProducts(currentPage, filters);
    }
  }, [currentPage]);

  // Fetch when filters change
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      fetchProducts(1, filters, true);
    }
  }, [filters]);

  // Scroll to top when products change
  useEffect(() => {
    if (productsContainerRef.current && (products.length > 0 || !loading)) {
      productsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [products, currentPage]);

  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId);
  };

  const handleAddToFavorites = (productId: string) => {
    setFavorites(prev => {
      let updated: string[];
      if (prev.includes(productId)) {
        updated = prev.filter((id) => id !== productId);
      } else {
        updated = [...prev, productId];
      }
      
      if (user) {
        const userFavoritesKey = `favorites_${user.id}`;
        localStorage.setItem(userFavoritesKey, JSON.stringify(updated));
      }
      
      return updated;
    });
  };

  const handleFilterChange = useCallback((newFilters: any) => {
    setCurrentPage(1);
    setFilters(newFilters);
  }, []);

  const genderLabel = {
    men: 'Men',
    women: 'Women',
    kids: 'Kids',
  }[params.gender] || 'Products';

  // Calculate displayed range
  const startItem = (currentPage - 1) * 12 + 1;
  const endItem = Math.min(currentPage * 12, pagination.total);

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setMobileFiltersOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-gray-900 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <Filter size={20} />
      </button>

      {/* Mobile Filters Overlay */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-4/5 bg-white shadow-xl">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="h-full overflow-y-auto p-4">
              <FiltersSidebar onFilterChange={handleFilterChange} gender={params.gender} />
            </div>
          </div>
        </div>
      )}

      {/* Header - Compact */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Back button and gender */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <div className="hidden sm:block h-4 w-px bg-gray-300"></div>
              <h1 className="text-xl sm:text-2xl font-light tracking-tight">
                {genderLabel} <span className="text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">Collection</span>
              </h1>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              {/* Results Count */}
              <div className="hidden sm:block text-sm text-gray-500">
                {pagination.total > 0 ? (
                  <span className="font-medium text-gray-700">{pagination.total}</span>
                ) : (
                  <span className="font-medium text-gray-700">0</span>
                )} items
              </div>

              {/* View Toggle - Desktop */}
              <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <List size={18} className={viewMode === 'list' ? 'text-gray-900' : 'text-gray-500'} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <Grid size={18} className={viewMode === 'grid' ? 'text-gray-900' : 'text-gray-500'} />
                </button>
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => {
                  setRefreshing(true);
                  fetchProducts(currentPage, filters).then(() => setRefreshing(false));
                }}
                disabled={refreshing}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                title="Refresh stock"
              >
                <RefreshCw size={18} className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Mobile Results Count */}
          <div className="mt-3 sm:hidden flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {pagination.total > 0 ? (
                <>
                  Showing <span className="font-medium text-gray-700">{startItem}-{endItem}</span> of{' '}
                  <span className="font-medium text-gray-700">{pagination.total}</span>
                </>
              ) : (
                <span className="font-medium text-gray-700">0 items</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">FILTERS</h3>
                <div className="text-xs text-gray-500">
                  {Object.keys(filters).length > 0 ? (
                    <span className="text-gray-700">{Object.keys(filters).length} active filters</span>
                  ) : (
                    'No filters applied'
                  )}
                </div>
              </div>
              <div className="h-[calc(100vh-180px)] overflow-y-auto pr-2">
                <FiltersSidebar onFilterChange={handleFilterChange} gender={params.gender} />
              </div>
            </div>
          </div>

          {/* Products Area */}
          <div className="flex-1">
            <div 
              ref={productsContainerRef}
              className="h-[calc(100vh-160px)] lg:h-[calc(100vh-140px)] overflow-y-auto pr-2"
            >
              {/* Loading State */}
              {loading && products.length === 0 ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-48 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse ${
                        viewMode === 'grid' && 'lg:w-1/2 lg:inline-block'
                      }`}
                    />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  {/* Products Grid/List */}
                  <div className={`transition-opacity duration-300 ${
                    filterLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'
                  }`}>
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-4'}>
                      {products.map((product) => (
                        <div 
                          key={product._id}
                          className={viewMode === 'grid' ? 'h-full' : ''}
                        >
                          <ProductCard
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
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Empty State */}
                  {products.length === 0 && !loading && (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <Filter size={24} className="text-gray-400" />
                      </div>
                      <p className="text-gray-600 mb-4">No products match your filters</p>
                      <button
                        onClick={() => {
                          setFilters({});
                          setCurrentPage(1);
                        }}
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  )}

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className={`mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 ${
                      filterLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'
                    }`}>
                      <div className="text-sm text-gray-500">
                        Page <span className="font-medium text-gray-700">{currentPage}</span> of{' '}
                        <span className="font-medium text-gray-700">{pagination.pages}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1 || filterLoading}
                          className="p-2 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                          <ChevronLeft size={18} />
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, pagination.pages) }).map((_, i) => {
                            let pageNum;
                            if (pagination.pages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= pagination.pages - 2) {
                              pageNum = pagination.pages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => !filterLoading && setCurrentPage(pageNum)}
                                disabled={filterLoading}
                                className={`w-8 h-8 rounded-lg text-sm transition-all ${
                                  currentPage === pageNum
                                    ? 'bg-gray-900 text-white'
                                    : 'border border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                                } ${filterLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                          disabled={currentPage === pagination.pages || filterLoading}
                          className="p-2 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>

                      <div className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">{pagination.total}</span> total products
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-600">No products available in this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Bar */}
      {Object.keys(filters).length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 shadow-lg lg:hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{Object.keys(filters).length}</span> filters active
            </div>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="text-sm font-medium text-gray-900 hover:text-gray-700"
            >
              Edit Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}