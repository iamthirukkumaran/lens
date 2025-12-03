'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LogOut, ArrowLeft, TrendingUp, Package, ShoppingCart, DollarSign,
  Users, TrendingDown, Calendar, Download, Filter, RefreshCw, 
  Eye, EyeOff, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon,
  Clock, Target, Award, ShieldCheck, Star, TrendingUp as TrendingUpIcon
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  Scatter
} from 'recharts';
import { format, subDays, subMonths } from 'date-fns';
import { useCounter } from '@/lib/useCounter';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
  repeatPurchaseRate: number;
  topSellingProducts: Array<{
    id: string;
    name: string;
    sold: number;
    revenue: number;
    growth: number;
    category: string;
  }>;
  revenueByStatus: {
    [key: string]: {
      revenue: number;
      orders: number;
    };
  };
  ordersByMonth: Array<{
    month: string;
    orders: number;
    revenue: number;
    avgOrderValue: number;
    newCustomers: number;
  }>;
  dailyMetrics: Array<{
    date: string;
    orders: number;
    revenue: number;
    visitors: number;
    conversion: number;
  }>;
  customerMetrics: {
    newCustomers: number;
    returningCustomers: number;
    topCustomers: Array<{
      id: string;
      name: string;
      email: string;
      orders: number;
      totalSpent: number;
    }>;
    customerLifetimeValue: number;
  };
  productMetrics: {
    lowStock: number;
    outOfStock: number;
    bestSellingCategories: Array<{
      category: string;
      revenue: number;
      units: number;
    }>;
  };
  comparisonData: {
    previousPeriod: {
      revenue: number;
      orders: number;
      avgOrderValue: number;
    };
    growthRates: {
      revenue: number;
      orders: number;
      customers: number;
    };
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface DateRange {
  start: Date;
  end: Date;
}

type TimeFilter = '7d' | '30d' | '90d' | '1y' | 'all';
type ChartType = 'line' | 'bar' | 'area';
type MetricView = 'revenue' | 'orders' | 'customers' | 'conversion';

const statusColors: { [key: string]: string } = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  processing: '#8b5cf6',
  shipped: '#10b981',
  delivered: '#059669',
  cancelled: '#ef4444'
};

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30d');
  const [dateRange, setDateRange] = useState<DateRange>({
    start: subDays(new Date(), 30),
    end: new Date()
  });
  const [chartType, setChartType] = useState<ChartType>('line');
  const [primaryMetric, setPrimaryMetric] = useState<MetricView>('revenue');
  const [showComparison, setShowComparison] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Counting animation hooks
  const countedRevenue = useCounter(analytics?.totalRevenue || 0, 1500);
  const countedOrders = useCounter(analytics?.totalOrders || 0, 1000);
  const countedProducts = useCounter(analytics?.totalProducts || 0, 1000);
  const countedAverageOrderValue = useCounter(analytics?.averageOrderValue || 0, 1200);

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

  const fetchAnalytics = useCallback(async () => {
    setRefreshing(true);
    try {
      const queryParams = new URLSearchParams({
        period: timeFilter,
        start: dateRange.start.toISOString(),
        end: dateRange.end.toISOString()
      });

      const response = await fetch(`/api/admin/analytics?${queryParams}`);
      if (!response.ok) throw new Error('Failed to load analytics');
      
      const data = await response.json();
      setAnalytics(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading analytics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeFilter, dateRange]);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, fetchAnalytics]);

  const handleTimeFilterChange = (filter: TimeFilter) => {
    setTimeFilter(filter);
    const now = new Date();
    let start: Date;
    
    switch (filter) {
      case '7d':
        start = subDays(now, 7);
        break;
      case '30d':
        start = subDays(now, 30);
        break;
      case '90d':
        start = subDays(now, 90);
        break;
      case '1y':
        start = subMonths(now, 12);
        break;
      default:
        start = new Date(2024, 0, 1); // Start of year
    }
    
    setDateRange({ start, end: now });
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      // Get user data from localStorage for authentication
      const userData = localStorage.getItem('user');
      if (!userData) {
        setError('Authentication required');
        setExporting(false);
        return;
      }

      const response = await fetch('/api/admin/analytics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch analytics data');
      
      const data = await response.json();
      
      // Create CSV content
      const csvContent = generateCSV(data);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setSuccess('Report exported successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  const generateCSV = (data: AnalyticsData) => {
    const lines = [];
    lines.push('Analytics Report');
    lines.push(`Generated: ${format(new Date(), 'MMM d, yyyy h:mm a')}`);
    lines.push('');
    
    lines.push('Key Metrics');
    lines.push(`Total Revenue,${formatCurrency(data.totalRevenue)}`);
    lines.push(`Total Orders,${data.totalOrders}`);
    lines.push(`Total Products,${data.totalProducts}`);
    lines.push(`Average Order Value,${formatCurrency(data.averageOrderValue)}`);
    lines.push('');
    
    lines.push('Monthly Data');
    lines.push('Month,Orders,Revenue');
    data.ordersByMonth?.forEach(month => {
      lines.push(`${month.month},${month.orders},${month.revenue}`);
    });
    lines.push('');
    
    lines.push('Top Selling Products');
    lines.push('Product,Units Sold,Revenue');
    data.topSellingProducts?.forEach(product => {
      lines.push(`${product.name},${product.sold},${product.revenue}`);
    });
    
    return lines.join('\n');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const GrowthIndicator = ({ value }: { value: number }) => (
    <div className={`flex items-center gap-1 ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {value >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
      <span className="text-sm font-medium">{formatPercentage(value)}</span>
    </div>
  );

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    growth, 
    description,
    trend = 'up',
    loading: isLoading 
  }: { 
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    growth?: number;
    description?: string;
    trend?: 'up' | 'down' | 'neutral';
    loading?: boolean;
  }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
          <Icon className="text-gray-700" size={24} />
        </div>
        {growth !== undefined && <GrowthIndicator value={growth} />}
      </div>
      {isLoading ? (
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </div>
      ) : (
        <>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-sm text-gray-600">{title}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          )}
        </>
      )}
    </div>
  );

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
                onClick={fetchAnalytics}
                disabled={refreshing}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw size={20} className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 font-medium"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Export Report</span>
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
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Analytics Dashboard</h1>
              <p className="text-gray-600">
                {user?.name ? `Welcome back, ${user.name}!` : 'Store performance insights'}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {(['7d', '30d', '90d', '1y', 'all'] as TimeFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleTimeFilterChange(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeFilter === filter
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter === 'all' ? 'All Time' : filter}
                </button>
              ))}
              
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                  showComparison
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showComparison ? <Eye size={16} /> : <EyeOff size={16} />}
                Compare
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 animate-slideDown">
            <span>⚠️</span>
            {error}
            <button onClick={() => setError('')} className="ml-auto text-lg">×</button>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2 animate-slideDown">
            <span>✅</span>
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading analytics data...</p>
          </div>
        ) : analytics ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <MetricCard
                title="Total Revenue"
                value={formatCurrency(countedRevenue)}
                icon={DollarSign}
                description="Total revenue from all orders"
                loading={loading}
              />
              
              <MetricCard
                title="Total Orders"
                value={countedOrders.toLocaleString()}
                icon={ShoppingCart}
                description={`Avg: ${formatCurrency(countedAverageOrderValue)}`}
                loading={loading}
              />
              
              <MetricCard
                title="Total Products"
                value={countedProducts.toLocaleString()}
                icon={Package}
                description="Available products in store"
                loading={loading}
              />
            </div>

            {/* Chart Type Toggle */}
            <div className="mb-8 mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Performance Charts</h2>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-xl p-2 border border-gray-200">
                {(['line', 'bar', 'area'] as ChartType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      chartType === type
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {type === 'line' && <LineChartIcon size={16} />}
                    {type === 'bar' && <BarChart3 size={16} />}
                    {type === 'area' && <PieChartIcon size={16} />}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Revenue Trend Chart */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
                  <p className="text-sm text-gray-600">Revenue trends over time</p>
                </div>
                
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'line' ? (
                      <LineChart data={analytics.ordersByMonth || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" tickFormatter={(value) => `$${value/1000}k`} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          }}
                          formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ fill: '#3b82f6', r: 5 }}
                          activeDot={{ r: 7 }}
                          name="Revenue"
                        />
                      </LineChart>
                    ) : chartType === 'bar' ? (
                      <BarChart data={analytics.ordersByMonth || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" tickFormatter={(value) => `$${value/1000}k`} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                          }}
                          formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                        />
                        <Legend />
                        <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    ) : (
                      <AreaChart data={analytics.ordersByMonth || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" tickFormatter={(value) => `$${value/1000}k`} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                          }}
                          formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          fill="#3b82f6"
                          stroke="#3b82f6"
                          fillOpacity={0.2}
                          strokeWidth={2}
                          name="Revenue"
                        />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Orders Trend Chart */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Monthly Orders</h3>
                  <p className="text-sm text-gray-600">Order volume trends</p>
                </div>
                
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'line' ? (
                      <LineChart data={analytics.ordersByMonth || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          }}
                          formatter={(value) => [Number(value).toLocaleString(), 'Orders']}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="orders"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ fill: '#10b981', r: 5 }}
                          activeDot={{ r: 7 }}
                          name="Orders"
                        />
                      </LineChart>
                    ) : chartType === 'bar' ? (
                      <BarChart data={analytics.ordersByMonth || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                          }}
                          formatter={(value) => [Number(value).toLocaleString(), 'Orders']}
                        />
                        <Legend />
                        <Bar dataKey="orders" fill="#10b981" name="Orders" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    ) : (
                      <AreaChart data={analytics.ordersByMonth || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                          }}
                          formatter={(value) => [Number(value).toLocaleString(), 'Orders']}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="orders"
                          fill="#10b981"
                          stroke="#10b981"
                          fillOpacity={0.2}
                          strokeWidth={2}
                          name="Orders"
                        />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Status Distribution Section */}
            <div className="mb-12">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Order Distribution</h2>
                <p className="text-sm text-gray-600">Revenue breakdown by order status</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Pie Chart */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={Object.entries(analytics.revenueByStatus || {}).map(([status, data]) => ({
                              name: status.charAt(0).toUpperCase() + status.slice(1),
                              value: typeof data === 'object' ? data.revenue : data
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => 
                              `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`
                            }
                            outerRadius={90}
                            dataKey="value"
                          >
                            {Object.keys(analytics.revenueByStatus || {}).map((status, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={statusColors[status] || '#94a3b8'} 
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [
                              `$${Number(value).toLocaleString()}`,
                              'Revenue'
                            ]}
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Status List */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Breakdown</h3>
                    <div className="space-y-3">
                      {Object.entries(analytics.revenueByStatus || {}).map(([status, data]) => {
                        const statusRevenue = typeof data === 'object' ? data.revenue : data;
                        const totalRevenue = Object.entries(analytics.revenueByStatus || {}).reduce((sum, [_, d]) => {
                          const revenuePart = typeof d === 'object' ? d.revenue : d;
                          return sum + (typeof revenuePart === 'number' ? revenuePart : 0);
                        }, 0);
                        return (
                          <div key={status} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-4 h-4 rounded-full flex-shrink-0"
                                style={{ backgroundColor: statusColors[status] || '#94a3b8' }}
                              />
                              <span className="font-medium text-gray-900 capitalize">{status}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">{formatCurrency(statusRevenue)}</p>
                              <p className="text-xs text-gray-500">
                                {totalRevenue > 0 ? ((statusRevenue / totalRevenue) * 100).toFixed(1) : 0}%
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products and Monthly Stats Section */}
            <div className="mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Selling Products */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
                      <p className="text-sm text-gray-600">By revenue and units sold</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {analytics.topSellingProducts && analytics.topSellingProducts.length > 0 ? (
                      analytics.topSellingProducts.slice(0, 5).map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-white">#{index + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.sold} units sold</p>
                            </div>
                          </div>
                          <div className="text-right ml-2">
                            <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-6">No product data available</p>
                    )}
                  </div>
                </div>

                {/* Monthly Stats */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Monthly Summary</h3>
                      <p className="text-sm text-gray-600">Last 6 months performance</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {analytics.ordersByMonth && analytics.ordersByMonth.length > 0 ? (
                      analytics.ordersByMonth.slice(-6).reverse().map((month, index) => (
                        <div key={index} className="flex items-center justify-between p-3 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100">
                          <div>
                            <p className="font-medium text-gray-900">{month.month}</p>
                            <p className="text-xs text-gray-500">{month.orders} orders</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">{formatCurrency(month.revenue)}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-6">No monthly data available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Insights Section */}
            <div className="mb-12">
              <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 text-white border border-gray-700 shadow-lg">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-700">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Key Insights</h3>
                    <p className="text-gray-300">
                      {timeFilter === 'all' ? 'All time performance' : 
                       `Last ${timeFilter} performance`}
                    </p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-xl hover:bg-white/15 transition-colors">
                    <Award size={28} className="text-yellow-400" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-sm text-gray-300 mb-3 font-medium">Average Order Value</p>
                    <p className="text-3xl font-bold text-blue-300">{formatCurrency(analytics.averageOrderValue)}</p>
                    <p className="text-xs text-gray-400 mt-2">Per transaction</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-sm text-gray-300 mb-3 font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-300">{formatCurrency(analytics.totalRevenue)}</p>
                    <p className="text-xs text-gray-400 mt-2">Generated</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-sm text-gray-300 mb-3 font-medium">Total Orders</p>
                    <p className="text-3xl font-bold text-purple-300">{analytics.totalOrders.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-2">Completed</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 mb-2">No analytics data available</p>
            <p className="text-sm text-gray-500 mb-4">
              Start making sales to see analytics data
            </p>
            <button
              onClick={fetchAnalytics}
              className="inline-flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              <RefreshCw size={18} />
              Refresh Data
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Last updated: {format(new Date(), 'MMM d, yyyy h:mm a')}
            </div>
            <div className="text-sm text-gray-600">
              Data refresh: Every 15 minutes
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}