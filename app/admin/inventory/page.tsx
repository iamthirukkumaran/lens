'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LogOut, ArrowLeft, Plus, Minus, Search, RefreshCw, AlertCircle,
  TrendingDown, Package, Edit2, Check, X
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function InventoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [stockChanges, setStockChanges] = useState<{ [key: string]: number }>({});
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');

      if (!storedUser) {
        router.push('/login?redirect=/admin/inventory');
        return;
      }

      try {
        const userData = JSON.parse(storedUser);
        if (userData.role !== 'admin') {
          router.push('/collections/men');
          return;
        }

        setUser(userData);
      } catch (err) {
        localStorage.removeItem('user');
        router.push('/login');
      }
    };

    // Set current time on client side only
    setCurrentTime(new Date().toLocaleString());
    
    checkAuth();
  }, [router]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?limit=1000');
      if (!response.ok) throw new Error('Failed to load products');

      const result = await response.json();
      // Handle the API response structure
      const productList = result.data || result.products || result || [];
      setProducts(Array.isArray(productList) ? productList : []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user, fetchProducts]);

  const handleStockChange = async (productId: string, quantity: number) => {
    try {
      const currentProduct = (Array.isArray(products) ? products : []).find(p => p?._id === productId);
      const currentStock = currentProduct?.stock || 0;
      const newStock = Math.max(0, currentStock + quantity);

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          stock: newStock
        })
      });

      if (!response.ok) throw new Error('Failed to update stock');

      const result = await response.json();
      // Extract the product from the response structure
      const updatedProduct = result?.data || result;
      
      // Ensure products is an array before mapping
      const updatedList = Array.isArray(products) 
        ? products.map(p => p?._id === productId ? updatedProduct : p)
        : [];
      setProducts(updatedList);
      setSuccess(`Stock updated successfully!`);
      setTimeout(() => setSuccess(''), 3000);
      setEditingId(null);
      setStockChanges({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update stock');
    }
  };

  const handleQuantityChange = (productId: string, value: number) => {
    setStockChanges(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  const filteredProducts = (Array.isArray(products) ? products : []).filter(product =>
    (product?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product?.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockProducts = (Array.isArray(products) ? products : []).filter(p => (p?.stock || 0) < 10);
  const outOfStockProducts = (Array.isArray(products) ? products : []).filter(p => (p?.stock || 0) === 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                  Back to Dashboard
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={fetchProducts}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Refresh products"
              >
                <RefreshCw size={20} className="text-gray-600" />
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('token');
                  router.push('/login');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-red-600 hover:text-red-700 font-medium"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Inventory Management</h1>
            <p className="text-gray-600">
              Manage product stocks and inventory levels
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <span>⚠️</span>
            {error}
            <button onClick={() => setError('')} className="ml-auto text-lg">×</button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
            <span>✅</span>
            {success}
            <button onClick={() => setSuccess('')} className="ml-auto text-lg">×</button>
          </div>
        )}

        {/* Stock Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <Package className="text-blue-600" size={24} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{products.length}</p>
            <p className="text-sm text-gray-600">Total Products</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
                <AlertCircle className="text-amber-600" size={24} />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-600 mb-1">{lowStockProducts.length}</p>
            <p className="text-sm text-gray-600">Low Stock Items (&lt;10)</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
                <TrendingDown className="text-red-600" size={24} />
              </div>
            </div>
            <p className="text-2xl font-bold text-red-600 mb-1">{outOfStockProducts.length}</p>
            <p className="text-sm text-gray-600">Out of Stock</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Current Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                            <img
                              src={product?.images?.[0] || 'https://via.placeholder.com/40'}
                              alt={product?.name || 'Product'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product?.name || 'Unknown'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product?.category || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">${(product?.price || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{product?.stock || 0}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            (product?.stock || 0) === 0
                              ? 'bg-red-100 text-red-800'
                              : (product?.stock || 0) < 10
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {(product?.stock || 0) === 0 ? 'Out of Stock' : (product?.stock || 0) < 10 ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {editingId === product._id ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(product._id, (stockChanges[product._id] || 0) - 1)}
                                className="p-2 hover:bg-gray-100 text-gray-600"
                              >
                                <Minus size={16} />
                              </button>
                              <input
                                type="number"
                                value={stockChanges[product._id] || 0}
                                onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value) || 0)}
                                className="w-16 text-center border-0 py-1 focus:outline-none"
                              />
                              <button
                                onClick={() => handleQuantityChange(product._id, (stockChanges[product._id] || 0) + 1)}
                                className="p-2 hover:bg-gray-100 text-gray-600"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <button
                              onClick={() => handleStockChange(product._id, stockChanges[product._id] || 0)}
                              className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                              title="Confirm"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setStockChanges({});
                              }}
                              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(product._id);
                              setStockChanges({ [product._id]: 0 });
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors text-sm font-medium"
                          >
                            <Edit2 size={16} />
                            Adjust Stock
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 mb-2">No products found</p>
            <p className="text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'No products available'}
            </p>
          </div>
        )}

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="mt-12 bg-amber-50 rounded-2xl p-6 border border-amber-200">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-100 flex-shrink-0">
                <AlertCircle className="text-amber-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">Low Stock Alert</h3>
                <p className="text-sm text-amber-800 mb-4">
                  The following products have low stock levels and may need reordering:
                </p>
                <div className="flex flex-wrap gap-2">
                  {lowStockProducts.map(product => (
                    <span
                      key={product._id}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-white text-amber-800 border border-amber-200"
                    >
                      {product.name} ({product.stock} left)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-600">
            Inventory Management System • Last updated: {currentTime || 'Loading...'}
          </p>
        </div>
      </footer>
    </div>
  );
}
