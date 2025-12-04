'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LogOut, ArrowLeft, Plus, Minus, Search, RefreshCw, AlertCircle,
  TrendingDown, Package, Edit2, Check, X, Filter, Download,
  BarChart3, Eye, MoreVertical, ChevronDown, Upload, Tag, DollarSign,
  ShoppingCart, Layers, AlertTriangle, CheckCircle, Clock, Star
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  sku?: string;
  lastRestocked?: string;
  minimumStock?: number;
  status?: 'active' | 'inactive' | 'discontinued';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface StockHistory {
  productId: string;
  productName: string;
  change: number;
  previousStock: number;
  newStock: number;
  timestamp: string;
  type: 'manual' | 'sale' | 'restock';
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
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price' | 'category'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(cats);
  }, [products]);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!storedUser || !token) {
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
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    setCurrentTime(new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }));
    
    checkAuth();
  }, [router]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/products?limit=1000', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        throw new Error('Failed to load products');
      }

      const result = await response.json();
      const productList = result.data || result.products || result || [];
      setProducts(Array.isArray(productList) ? productList : []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchProducts();
      // Load stock history from localStorage or API
      const savedHistory = localStorage.getItem('stockHistory');
      if (savedHistory) {
        try {
          setStockHistory(JSON.parse(savedHistory));
        } catch (e) {
          console.error('Failed to parse stock history');
        }
      }
    }
  }, [user, fetchProducts]);

  const addStockHistory = useCallback((history: StockHistory) => {
    const newHistory = [history, ...stockHistory].slice(0, 50); // Keep last 50 entries
    setStockHistory(newHistory);
    localStorage.setItem('stockHistory', JSON.stringify(newHistory));
  }, [stockHistory]);

  const handleStockChange = async (productId: string, quantity: number) => {
    try {
      const currentProduct = products.find(p => p._id === productId);
      if (!currentProduct) throw new Error('Product not found');
      
      const previousStock = currentProduct.stock || 0;
      const newStock = Math.max(0, previousStock + quantity);

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          stock: newStock,
          lastRestocked: new Date().toISOString()
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        throw new Error('Failed to update stock');
      }

      const result = await response.json();
      const updatedProduct = result?.data || result;
      
      setProducts(products.map(p => p._id === productId ? updatedProduct : p));
      
      // Add to stock history
      addStockHistory({
        productId,
        productName: currentProduct.name,
        change: quantity,
        previousStock,
        newStock,
        timestamp: new Date().toISOString(),
        type: 'manual'
      });
      
      setSuccess(`Stock updated: ${currentProduct.name} (${quantity > 0 ? '+' : ''}${quantity})`);
      setTimeout(() => setSuccess(''), 5000);
      setEditingId(null);
      setStockChanges({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update stock');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleBulkUpdate = () => {
    // Implement bulk update functionality
    alert('Bulk update functionality coming soon!');
  };

  const handleExport = () => {
    const csv = [
      ['SKU', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Minimum Stock'],
      ...products.map(p => [
        p.sku || 'N/A',
        p.name,
        p.category,
        `$${p.price.toFixed(2)}`,
        p.stock,
        p.status || 'active',
        p.minimumStock || 10
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.sku || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesLowStock = !showLowStockOnly || product.stock < (product.minimumStock || 10);
      
      return matchesSearch && matchesCategory && matchesLowStock;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'stock':
          aVal = a.stock;
          bVal = b.stock;
          break;
        case 'price':
          aVal = a.price;
          bVal = b.price;
          break;
        case 'category':
          aVal = a.category.toLowerCase();
          bVal = b.category.toLowerCase();
          break;
        default:
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, showLowStockOnly, sortBy, sortOrder]);

  const lowStockProducts = useMemo(() => 
    products.filter(p => p.stock < (p.minimumStock || 10)), [products]
  );
  
  const outOfStockProducts = useMemo(() => 
    products.filter(p => p.stock === 0), [products]
  );
  
  const totalInventoryValue = useMemo(() => 
    products.reduce((sum, p) => sum + (p.price * p.stock), 0), [products]
  );

  const getStockStatusColor = (stock: number, minStock = 10) => {
    if (stock === 0) return 'bg-red-500';
    if (stock < minStock) return 'bg-amber-500';
    if (stock < minStock * 2) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStockStatusText = (stock: number, minStock = 10) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < minStock) return 'Low Stock';
    if (stock < minStock * 2) return 'Medium Stock';
    return 'In Stock';
  };

  function handleQuantityChange(_id: string, arg1: number): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <ArrowLeft size={18} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                  Dashboard
                </span>
              </Link>
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                <p className="text-gray-600 text-sm mt-1">
                  Manage product stocks, track inventory levels, and monitor stock movements
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchProducts}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 font-medium text-sm"
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium text-sm"
              >
                <Download size={16} />
                Export CSV
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('token');
                  router.push('/login');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-red-600 hover:text-red-700 font-medium text-sm border border-red-200"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications */}
        <div className="space-y-3 mb-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
              <button onClick={() => setError('')} className="text-lg hover:text-red-900">×</button>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} />
                <span>{success}</span>
              </div>
              <button onClick={() => setSuccess('')} className="text-lg hover:text-green-900">×</button>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <Package className="text-blue-600" size={24} />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                Total
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{products.length}</p>
            <p className="text-sm text-gray-600">Total Products</p>
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <TrendingDown size={12} className="mr-1" />
              <span>Across {categories.length} categories</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
                <AlertTriangle className="text-amber-600" size={24} />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                Alert
              </span>
            </div>
            <p className="text-3xl font-bold text-amber-600 mb-1">{lowStockProducts.length}</p>
            <p className="text-sm text-gray-600">Low Stock Items</p>
            <div className="mt-2 text-xs text-gray-500">
              <span>Below minimum stock level</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
                <TrendingDown className="text-red-600" size={24} />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-800">
                Urgent
              </span>
            </div>
            <p className="text-3xl font-bold text-red-600 mb-1">{outOfStockProducts.length}</p>
            <p className="text-sm text-gray-600">Out of Stock</p>
            <div className="mt-2 text-xs text-gray-500">
              <span>Require immediate attention</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                <DollarSign className="text-emerald-600" size={24} />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Value
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">${totalInventoryValue.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Inventory Value</p>
            <div className="mt-2 text-xs text-gray-500">
              <span>Based on current stock</span>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, SKU, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Filter className="absolute left-3 top-3 text-gray-400" size={18} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="relative">
                  <BarChart3 className="absolute left-3 top-3 text-gray-400" size={18} />
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [sort, order] = e.target.value.split('-');
                      setSortBy(sort as any);
                      setSortOrder(order as any);
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="stock-asc">Stock (Low to High)</option>
                    <option value="stock-desc">Stock (High to Low)</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                    <option value="category-asc">Category (A-Z)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-colors ${
                  showLowStockOnly 
                    ? 'bg-amber-50 border-amber-300 text-amber-700' 
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <AlertTriangle size={16} />
                Low Stock Only
              </button>
              
              <button
                onClick={handleBulkUpdate}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors"
              >
                <Upload size={16} />
                Bulk Update
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600 flex items-center justify-between">
            <div>
              Showing <span className="font-semibold">{filteredProducts.length}</span> of {products.length} products
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <Clock size={16} />
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
          </div>
        </div>

        {/* Stock History Panel */}
        {showHistory && stockHistory.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Stock Updates</h3>
              <span className="text-sm text-gray-600">{stockHistory.length} updates</span>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {stockHistory.map((history, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      history.change > 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{history.productName}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(history.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${history.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {history.change > 0 ? '+' : ''}{history.change}
                    </p>
                    <p className="text-sm text-gray-600">
                      {history.previousStock} → {history.newStock}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading inventory...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">SKU</th>
                    <th className="px6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock Level</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr 
                      key={product._id} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                            <img
                              src={product.images?.[0] || 'https://via.placeholder.com/48'}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48';
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Star size={12} className="text-amber-400 fill-amber-400" />
                              <span className="text-xs text-gray-500">ID: {product._id.slice(-6)}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          <Tag size={12} className="mr-1" />
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                        {product.sku || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">${product.price.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">Value: ${(product.price * product.stock).toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-gray-900">{product.stock}</span>
                            <span className="text-xs text-gray-500">units</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getStockStatusColor(product.stock, product.minimumStock)}`}
                              style={{ 
                                width: `${Math.min(100, (product.stock / (product.minimumStock || 10) * 50))}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            product.stock === 0
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : product.stock < (product.minimumStock || 10)
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-green-100 text-green-800 border border-green-200'
                          }`}>
                            {getStockStatusText(product.stock, product.minimumStock)}
                          </span>
                          {product.lastRestocked && (
                            <span className="text-xs text-gray-500">
                              Restocked: {new Date(product.lastRestocked).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {editingId === product._id ? (
                            <>
                              <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                                <button
                                  onClick={() => handleQuantityChange(product._id, (stockChanges[product._id] || 0) - 1)}
                                  className="p-2 hover:bg-gray-100 text-gray-600 rounded-l-lg"
                                >
                                  <Minus size={14} />
                                </button>
                                <input
                                  type="number"
                                  value={stockChanges[product._id] || 0}
                                  onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value) || 0)}
                                  className="w-16 text-center border-0 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  min="-999"
                                  max="999"
                                />
                                <button
                                  onClick={() => handleQuantityChange(product._id, (stockChanges[product._id] || 0) + 1)}
                                  className="p-2 hover:bg-gray-100 text-gray-600 rounded-r-lg"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              <div className="flex gap-1">
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
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingId(product._id);
                                  setStockChanges({ [product._id]: 0 });
                                }}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-200"
                              >
                                <Edit2 size={14} />
                                Adjust
                              </button>
                              <button
                                onClick={() => router.push(`/admin/products/${product._id}`)}
                                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                title="View Details"
                              >
                                <Eye size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{filteredProducts.length}</span> products displayed
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  <ArrowLeft size={16} className="rotate-90" />
                  Back to top
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <Package size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? `No products matching "${searchTerm}" found. Try different search terms.`
                : 'No products available in inventory. Add your first product to get started.'
              }
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setShowLowStockOnly(false);
                }}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
              >
                Clear Filters
              </button>
              <button
                onClick={() => router.push('/admin/products/new')}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                <Plus size={18} className="inline mr-2" />
                Add New Product
              </button>
            </div>
          </div>
        )}

        {/* Low Stock Alert Section */}
        {lowStockProducts.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-amber-50 to-amber-50/50 rounded-2xl p-6 border border-amber-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-100">
                  <AlertTriangle className="text-amber-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-900 mb-1">Low Stock Alert</h3>
                  <p className="text-sm text-amber-800">
                    {lowStockProducts.length} products are below minimum stock levels and may need reordering
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                className="text-amber-700 hover:text-amber-900 font-medium text-sm"
              >
                {showLowStockOnly ? 'Show All' : 'View Only Low Stock'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowStockProducts.slice(0, 6).map(product => (
                <div
                  key={product._id}
                  className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-amber-200 hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-xs text-gray-600">{product.category}</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      {product.stock} left
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => {
                        setEditingId(product._id);
                        setStockChanges({ [product._id]: 50 }); // Default restock quantity
                      }}
                      className="text-xs px-3 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium"
                    >
                      Restock
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {lowStockProducts.length > 6 && (
              <div className="mt-4 text-center">
                <button className="text-amber-700 hover:text-amber-900 text-sm font-medium">
                  +{lowStockProducts.length - 6} more low stock items
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">
                Inventory Management System • Real-time Updates • Version 2.0
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Last synchronized: {currentTime || 'Loading...'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-600">In Stock</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-xs text-gray-600">Low Stock</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-xs text-gray-600">Out of Stock</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}