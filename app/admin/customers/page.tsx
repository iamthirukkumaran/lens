'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, ArrowLeft, Mail, Phone, MapPin, User, Search } from 'lucide-react';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
  totalOrders?: number;
  totalSpent?: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        router.push('/login');
        return;
      }

      const userData = JSON.parse(storedUser);
      if (userData.role !== 'admin') {
        router.push('/collections/men');
        return;
      }

      setUser(userData);
      fetchCustomers();
    };

    checkAuth();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.data || []);
      } else {
        setError('Failed to load customers');
      }
      setLoading(false);
    } catch (err) {
      setError('Error loading customers');
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2 hover:text-gray-600 transition-colors">
            <ArrowLeft size={20} />
            <span className="text-sm text-gray-600">Back to Dashboard</span>
          </Link>

          <h1 className="text-2xl font-semibold">Customers</h1>

          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600">
              Welcome, <strong>{user?.name}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-red-600 hover:text-red-700 font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-3xl font-light tracking-tight mb-4">Customer Management</h2>
          <p className="text-gray-600">View all customers and their order history</p>
        </div>

        {/* Search */}
        <div className="mb-8 bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Customers List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
            <User size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">
              {searchTerm ? 'No customers match your search' : 'No customers found'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredCustomers.map((customer) => (
              <div
                key={customer._id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={16} />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={16} />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mb-2">
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{customer.totalOrders || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ${(customer.totalSpent || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Member since {new Date(customer.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
