'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LogOut, Plus, Edit2, Trash2, Eye, Box, ShoppingCart, 
  CheckCircle, Truck, Mail, Search, Filter, Download, 
  Users, BarChart3, Package, AlertCircle, RefreshCw,
  ChevronDown, ChevronUp, Calendar, DollarSign,
  User, Phone, MapPin
} from 'lucide-react';
import { format } from 'date-fns';
import debounce from 'lodash/debounce';
import { useCounter } from '@/lib/useCounter';

interface Product {
  _id: string;
  name: string;
  price: number;
  mrp: number;
  discount: number;
  gender: string;
  brand: string;
  stock: number;
  category: string;
  images?: string[];
  createdAt: string;
}

interface Order {
  _id: string;
  orderId: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  total: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    email?: string;
  };
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  outOfStockProducts: number;
}

interface OrderStatusFilter {
  [key: string]: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    outOfStockProducts: 0
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [emailSending, setEmailSending] = useState<string | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatusFilter>({
    pending: true,
    confirmed: true,
    processing: true,
    shipped: true,
    delivered: true,
    cancelled: true
  });
  const [dateFilter, setDateFilter] = useState<string>('all'); // 'today', 'week', 'month', 'all'
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'total'>('newest');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Counting animation hooks
  const countedProducts = useCounter(stats.totalProducts, 1000);
  const countedOrders = useCounter(stats.totalOrders, 1000);
  const countedRevenue = useCounter(stats.totalRevenue, 1500);
  const countedPendingOrders = useCounter(stats.pendingOrders, 1000);

  // Auth check with session timeout
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        router.push('/login?redirect=/admin/dashboard');
        return;
      }

      try {
        const userData = JSON.parse(storedUser);
        if (userData.role !== 'admin') {
          router.push('/collections/men');
          return;
        }

        // Check token expiration
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch('/api/auth/validate', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (!response.ok) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            router.push('/login?session=expired');
            return;
          }
        }

        setUser(userData);
      } catch (err) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchDashboardStats()
      ]);
      setLastUpdated(new Date()); // Update timestamp
      setSuccess('Data refreshed successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to refresh data');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user, fetchAllData]);

  // Auto-refresh every 10 seconds (to catch new orders quickly)
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchDashboardStats(); // Just refresh stats, not all data
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchDashboardStats]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?admin=true');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders?admin=true');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.data || []);
      applyFilters(data.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    }
  };

  const fetchDashboardStats = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setLastUpdated(new Date()); // Update timestamp
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((term: string) => {
      // Apply all filters including search
      let filtered = [...orders];

      // Apply status filter
      const activeStatuses = Object.keys(orderStatusFilter)
        .filter(status => orderStatusFilter[status]);
      
      if (activeStatuses.length > 0 && activeStatuses.length < 6) {
        filtered = filtered.filter(order => activeStatuses.includes(order.status));
      }

      // Apply date filter
      const now = new Date();
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        switch (dateFilter) {
          case 'today':
            return orderDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return orderDate >= monthAgo;
          default:
            return true;
        }
      });

      // Apply search with the provided term
      if (term.trim()) {
        const lowerTerm = term.toLowerCase();
        filtered = filtered.filter(order => {
          const orderId = (order.orderId || '').toLowerCase();
          const email = (order.userEmail || order.shippingAddress?.email || '').toLowerCase();
          const name = (order.userName || '').toLowerCase();
          const phone = (order.shippingAddress?.phone || '').toLowerCase();
          
          return (
            orderId.includes(lowerTerm) ||
            email.includes(lowerTerm) ||
            name.includes(lowerTerm) ||
            phone.includes(lowerTerm)
          );
        });
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'total':
            return b.total - a.total;
          default:
            return 0;
        }
      });

      setFilteredOrders(filtered);
    }, 300),
    [orders, orderStatusFilter, dateFilter, sortBy]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const applyFilters = useCallback((ordersList: Order[]) => {
    let filtered = [...ordersList];

    // Apply status filter
    const activeStatuses = Object.keys(orderStatusFilter)
      .filter(status => orderStatusFilter[status]);
    
    if (activeStatuses.length > 0 && activeStatuses.length < 6) {
      filtered = filtered.filter(order => activeStatuses.includes(order.status));
    }

    // Apply date filter
    const now = new Date();
    filtered = filtered.filter(order => {
      const orderDate = new Date(order.createdAt);
      switch (dateFilter) {
        case 'today':
          return orderDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return orderDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return orderDate >= monthAgo;
        default:
          return true;
      }
    });

    // Apply search
    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(order => {
        const orderId = (order.orderId || '').toLowerCase();
        const email = (order.userEmail || order.shippingAddress?.email || '').toLowerCase();
        const name = (order.userName || '').toLowerCase();
        const phone = (order.shippingAddress?.phone || '').toLowerCase();
        
        return (
          orderId.includes(lowerTerm) ||
          email.includes(lowerTerm) ||
          name.includes(lowerTerm) ||
          phone.includes(lowerTerm)
        );
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'total':
          return b.total - a.total;
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  }, [orderStatusFilter, dateFilter, sortBy, searchTerm]);

  const handleSearchOrders = (term: string) => {
    setSearchTerm(term);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter((p) => p._id !== productId));
        setSuccess('Product deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (err) {
      setError('Error deleting product');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setEmailSending(orderId);
    try {
      const order = orders.find(o => o._id === orderId);
      if (!order) throw new Error('Order not found');

      // Update order status
      const response = await fetch(`/api/orders`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update order status');

      // Send email notification
      await sendOrderStatusEmail(order, newStatus);

      // Update local state
      const updatedOrders = orders.map(o => 
        o._id === orderId ? { ...o, status: newStatus as any, updatedAt: new Date().toISOString() } : o
      );
      setOrders(updatedOrders);
      applyFilters(updatedOrders);

      setSuccess(`Order ${orderId} status updated to ${newStatus}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error updating order status');
    } finally {
      setEmailSending(null);
    }
  };

  const sendOrderStatusEmail = async (order: Order, status: string) => {
    try {
      const statusMessages: { [key: string]: { subject: string; message: string } } = {
        'confirmed': {
          subject: `Order Confirmed - ${order.orderId}`,
          message: 'Your order has been confirmed and is being processed!'
        },
        'processing': {
          subject: `Order Processing - ${order.orderId}`,
          message: 'We are now processing your order.'
        },
        'shipped': {
          subject: `Order Shipped - ${order.orderId}`,
          message: 'Great news! Your order has been shipped.'
        },
        'delivered': {
          subject: `Order Delivered - ${order.orderId}`,
          message: 'Your order has been delivered. Thank you for shopping with us!'
        },
        'cancelled': {
          subject: `Order Cancelled - ${order.orderId}`,
          message: 'Your order has been cancelled as per your request.'
        }
      };

      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: order.userEmail,
          ...statusMessages[status],
          orderDetails: {
            orderId: order.orderId,
            totalAmount: order.total,
            items: order.items,
            trackingNumber: status === 'shipped' ? `TRACK-${order.orderId}` : undefined
          },
          userName: order.userName
        }),
      });

      if (!response.ok) {
        console.error('Failed to send email');
      }
    } catch (err) {
      console.error('Error sending email:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  const exportOrders = () => {
    const csv = [
      ['Order ID', 'Customer', 'Email', 'Total', 'Status', 'Date'].join(','),
      ...filteredOrders.map(order => [
        order.orderId,
        order.userName,
        order.userEmail,
        `$${order.total.toFixed(2)}`,
        order.status,
        format(new Date(order.createdAt), 'yyyy-MM-dd')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      shipped: 'bg-orange-100 text-orange-800 border-orange-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: AlertCircle,
      confirmed: CheckCircle,
      processing: RefreshCw,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: AlertCircle
    };
    return icons[status as keyof typeof icons] || AlertCircle;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200/80 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">← Back to Home</span>
            </Link>
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.svg"
                  alt="Hub of Frames"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <span className="text-xl font-light">
                  Hub of <span className="font-semibold">Frames</span>
                </span>
                <span className="block text-xs text-gray-500 font-medium">Admin Dashboard</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <User size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              <span className="text-xs text-gray-500 px-2 py-1 bg-gray-200 rounded-full">Admin</span>
            </div>
            
            <button
              onClick={fetchAllData}
              disabled={refreshing}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw size={20} className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-red-600 hover:text-red-700 font-medium"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 animate-slideDown">
            <AlertCircle size={20} />
            {error}
            <button onClick={() => setError('')} className="ml-auto">×</button>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2 animate-slideDown">
            <CheckCircle size={20} />
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-white rounded-2xl p-2 shadow-sm border border-gray-200">
          {(['overview', 'products', 'orders'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab === 'overview' && <BarChart3 size={20} />}
              {tab === 'products' && <Box size={20} />}
              {tab === 'orders' && <ShoppingCart size={20} />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Package size={24} className="text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500">Total</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{countedProducts}</h3>
                <p className="text-gray-600">Products</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <ShoppingCart size={24} className="text-green-600" />
                  </div>
                  <span className="text-sm text-gray-500">Total</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{countedOrders}</h3>
                <p className="text-gray-600">Orders</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <DollarSign size={24} className="text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-500">Total</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  ${countedRevenue.toLocaleString()}
                </h3>
                <p className="text-gray-600">Revenue</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <AlertCircle size={24} className="text-yellow-600" />
                  </div>
                  <span className="text-sm text-gray-500">Attention</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{countedPendingOrders}</h3>
                <p className="text-gray-600">Pending Orders</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href="/admin/products/add"
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors group"
                >
                  <Plus size={32} className="text-gray-400 group-hover:text-gray-600 mb-2" />
                  <span className="text-sm font-medium text-gray-600">Add Product</span>
                </Link>
                
                <button
                  onClick={exportOrders}
                  className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors group"
                >
                  <Download size={32} className="text-gray-600 mb-2" />
                  <span className="text-sm font-medium text-gray-600">Export Orders</span>
                </button>

                <Link
                  href="/admin/customers"
                  className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors group"
                >
                  <Users size={32} className="text-gray-600 mb-2" />
                  <span className="text-sm font-medium text-gray-600">View Customers</span>
                </Link>

                <Link
                  href="/admin/analytics"
                  className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors group"
                >
                  <BarChart3 size={32} className="text-gray-600 mb-2" />
                  <span className="text-sm font-medium text-gray-600">Analytics</span>
                </Link>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  View all →
                </button>
              </div>
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${getStatusColor(order.status)}`}>
                        {(() => {
                          const Icon = getStatusIcon(order.status);
                          return <Icon size={20} />;
                        })()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.orderId}</p>
                        <p className="text-sm text-gray-600">{order.userName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(order.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Product Management</h1>
                <p className="text-gray-600">Manage your eyewear inventory and listings</p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/admin/products/add"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium shadow-sm"
                >
                  <Plus size={20} />
                  Add New Product
                </Link>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-4">No products found</p>
                <Link
                  href="/admin/products/add"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  <Plus size={18} />
                  Add Your First Product
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          Brand
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr
                          key={product._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {product.images?.[0] && (
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                  />
                                </div>
                              )}
                              <div>
                                <span className="font-medium text-gray-900 block">
                                  {product.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ID: {product._id.slice(-6)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-gray-900 font-semibold">
                                ${product.price}
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500 line-through text-xs">
                                  ${product.mrp}
                                </span>
                                <span className="text-xs font-medium text-green-600">
                                  {product.discount}% off
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              product.stock > 10 
                                ? 'bg-green-100 text-green-800'
                                : product.stock > 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.stock} in stock
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                                {product.gender}
                              </span>
                              {product.category && (
                                <span className="text-xs text-gray-600">{product.category}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{product.brand}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/product/${product._id}`}
                                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                                title="View"
                              >
                                <Eye size={16} />
                              </Link>
                              <Link
                                href={`/admin/products/${product._id}/edit`}
                                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </Link>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing <strong>{products.length}</strong> products
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select className="text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900">
                      <option>Newest</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Stock</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">Order Management</h1>
                  <p className="text-gray-600">Manage and track customer orders</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={exportOrders}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                  >
                    <Download size={18} />
                    Export
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search orders by ID, name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 outline-none transition-all text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(orderStatusFilter).map((status) => {
                      const Icon = getStatusIcon(status);
                      return (
                        <button
                          key={status}
                          onClick={() => setOrderStatusFilter(prev => ({
                            ...prev,
                            [status]: !prev[status]
                          }))}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                            orderStatusFilter[status]
                              ? getStatusColor(status)
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Icon size={16} />
                          <span className="text-sm font-medium capitalize">{status}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-4">
                  {/* Date Filter */}
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gray-500" />
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">Last 7 Days</option>
                      <option value="month">Last 30 Days</option>
                    </select>
                  </div>

                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="total">Total Amount</option>
                    </select>
                  </div>

                  <div className="ml-auto text-sm text-gray-600">
                    Showing {filteredOrders.length} of {orders.length} orders
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="mx-auto animate-spin text-gray-400" size={32} />
                <p className="mt-4 text-gray-600">Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-2">No orders found</p>
                <p className="text-sm text-gray-500">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order ID</p>
                          <p className="font-semibold text-gray-900 text-sm">{order.orderId}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Customer</p>
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-gray-400" />
                            <p className="text-gray-700 text-sm">{order.userName}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date & Total</p>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            <p className="text-gray-700 text-sm">
                              {format(new Date(order.createdAt), 'MMM d')} • 
                              <span className="font-semibold ml-1">${order.total.toFixed(2)}</span>
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                          <div className="flex items-center gap-2">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        {expandedOrderId === order._id ? (
                          <ChevronUp size={20} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-400" />
                        )}
                      </div>
                    </button>

                    {/* Expanded View */}
                    {expandedOrderId === order._id && (
                      <div className="border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white">
                        <div className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Order Items */}
                            <div className="lg:col-span-2">
                              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Package size={18} />
                                Order Items ({order.items.length})
                              </h3>
                              <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                                    {item.image && (
                                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                        <Image
                                          src={item.image}
                                          alt={item.name}
                                          fill
                                          className="object-cover"
                                          sizes="64px"
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">{item.name}</p>
                                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                                      <p className="text-sm text-gray-600">Total: ${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Details & Actions */}
                            <div className="space-y-6">
                              {/* Order Summary */}
                              <div className="bg-gray-50 rounded-xl p-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">${order.total.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Payment Method</span>
                                    <span className="font-medium capitalize">{order.paymentMethod}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Payment Status</span>
                                    <span className={`font-medium ${
                                      order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                                    }`}>
                                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                    </span>
                                  </div>
                                  <div className="pt-2 border-t border-gray-200">
                                    <div className="flex justify-between font-semibold">
                                      <span>Total</span>
                                      <span className="text-lg">${order.total.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Shipping Address */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <MapPin size={18} />
                                  Shipping Address
                                </h4>
                                <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-1 text-sm">
                                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                                  <p className="text-gray-600">{order.shippingAddress.address}</p>
                                  <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                  <div className="flex items-center gap-2 pt-2">
                                    <Phone size={14} className="text-gray-400" />
                                    <p className="text-gray-600">{order.shippingAddress.phone}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail size={14} className="text-gray-400" />
                                    <p className="text-gray-600">{order.userEmail}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Status Update */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Update Status</h4>
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <select
                                      value={order.status}
                                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                      disabled={emailSending === order._id}
                                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm font-medium disabled:opacity-50"
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="confirmed">Confirmed</option>
                                      <option value="processing">Processing</option>
                                      <option value="shipped">Shipped</option>
                                      <option value="delivered">Delivered</option>
                                      <option value="cancelled">Cancelled</option>
                                    </select>
                                    <button
                                      onClick={() => handleUpdateOrderStatus(order._id, order.status)}
                                      disabled={emailSending === order._id}
                                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
                                      title="Send email notification"
                                    >
                                      {emailSending === order._id ? (
                                        <RefreshCw size={16} className="animate-spin" />
                                      ) : (
                                        <Mail size={16} />
                                      )}
                                      Notify
                                    </button>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    Email notification will be sent to customer
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}