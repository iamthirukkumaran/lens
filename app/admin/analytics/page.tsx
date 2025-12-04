'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LogOut, ArrowLeft, BarChart3, DollarSign, ShoppingCart, 
  TrendingUp, TrendingDown, RefreshCw, AlertCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  revenueGrowth: number;
  ordersGrowth: number;
  ordersByMonth: any[];
  topSellingProducts: any[];
  revenueByStatus: any;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');

      if (!storedUser) {
        router.push('/login?redirect=/admin/analytics');
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

    checkAuth();
  }, [router]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/analytics', {
        cache: 'no-store'
      });
      if (!response.ok) throw new Error('Failed to load analytics');

      const data = await response.json();
      setAnalytics(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading analytics');
      setAnalytics({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        conversionRate: 0,
        revenueGrowth: 0,
        ordersGrowth: 0,
        ordersByMonth: [],
        topSellingProducts: [],
        revenueByStatus: {}
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh analytics"
            >
              <RefreshCw size={20} className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
            <button onClick={() => setError('')} className="ml-auto font-bold">×</button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        ) : analytics ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Revenue */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                    <DollarSign className="text-blue-600" size={24} />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                    (analytics?.revenueGrowth ?? 0) >= 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {(analytics?.revenueGrowth ?? 0) >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {Math.abs(analytics?.revenueGrowth ?? 0)}%
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">${analytics?.totalRevenue?.toLocaleString() || '0'}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>

              {/* Orders */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                    <ShoppingCart className="text-green-600" size={24} />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                    (analytics?.ordersGrowth ?? 0) >= 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {(analytics?.ordersGrowth ?? 0) >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {Math.abs(analytics?.ordersGrowth ?? 0)}%
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{analytics?.totalOrders || 0}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>

              {/* Average Order Value */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                    <BarChart3 className="text-purple-600" size={24} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">${analytics?.averageOrderValue?.toLocaleString() || '0'}</p>
                <p className="text-sm text-gray-600">Average Order Value</p>
              </div>

              {/* Conversion Rate */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                    <TrendingUp className="text-orange-600" size={24} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{analytics?.conversionRate?.toFixed(2) || '0'}%</p>
                <p className="text-sm text-gray-600">Conversion Rate</p>
              </div>
            </div>

            {/* Charts */}
            {analytics?.ordersByMonth && analytics?.ordersByMonth.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics?.ordersByMonth || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6' }}
                        name="Revenue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Orders Trend */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Orders Trend</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics?.ordersByMonth || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                      <Legend />
                      <Bar 
                        dataKey="orders" 
                        fill="#10b981"
                        radius={[8, 8, 0, 0]}
                        name="Orders"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
                <p className="text-gray-600">No chart data available yet</p>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
