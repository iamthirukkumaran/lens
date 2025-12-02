'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, Plus, Edit2, Trash2, Eye, Box, ShoppingCart, CheckCircle, Truck, Mail } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  mrp: number;
  discount: number;
  gender: string;
  brand: string;
  images?: string[];
}

interface Order {
  _id: string;
  orderId: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: any[];
  total: number;
  shippingAddress: any;
  status: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [emailSending, setEmailSending] = useState<string | null>(null);

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
      fetchProducts();
      fetchOrders();
    };

    checkAuth();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.data || []);
    } catch (err) {
      setError('Failed to load products');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders?admin=true');
      const data = await response.json();
      console.log('Orders API response:', data);
      if (data.data && data.data.length > 0) {
        console.log('First order details:', {
          orderId: data.data[0].orderId,
          userName: data.data[0].userName,
          userEmail: data.data[0].userEmail,
          shippingEmail: data.data[0].shippingAddress?.email,
        });
      }
      setOrders(data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter((p) => p._id !== productId));
      } else {
        setError('Failed to delete product');
      }
    } catch (err) {
      setError('Error deleting product');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setEmailSending(orderId);
    try {
      // Update order status
      const response = await fetch(`/api/orders`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (response.ok) {
        // Send email notification
        const order = orders.find(o => o._id === orderId);
        if (order) {
          await sendOrderStatusEmail(order, newStatus);
        }

        // Update local state
        setOrders(orders.map(o => 
          o._id === orderId ? { ...o, status: newStatus } : o
        ));
      } else {
        setError('Failed to update order status');
      }
    } catch (err) {
      setError('Error updating order');
    } finally {
      setEmailSending(null);
    }
  };

  const sendOrderStatusEmail = async (order: Order, status: string) => {
    try {
      const statusMessages: { [key: string]: string } = {
        'confirmed': 'Your order has been confirmed!',
        'processing': 'We are processing your order.',
        'shipped': 'Your order has been shipped!',
        'delivered': 'Your order has been delivered. Thank you!',
        'cancelled': 'Your order has been cancelled.'
      };

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: order.userEmail,
          subject: `Order ${status.charAt(0).toUpperCase() + status.slice(1)} - ${order.orderId}`,
          orderStatus: status,
          orderDetails: {
            orderId: order.orderId,
            totalAmount: order.total,
            items: order.items,
            message: statusMessages[status] || `Your order status has been updated to ${status}`
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
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              ← Back to Home
            </Link>
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Hub of Frames"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-xl font-light">
                Hub of <span className="font-semibold">Frames</span> Admin
              </span>
            </Link>
          </div>

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

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 py-8 px-4 sticky top-20 h-fit rounded-r-2xl shadow-sm">
          <nav className="space-y-3">
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Box size={20} />
              Product Management
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ShoppingCart size={20} />
              Order Management
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 px-8 py-12">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              <div className="mb-12 flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-light tracking-tight mb-2">
                    Product Management
                  </h1>
                  <p className="text-gray-600">
                    Manage all eyewear products in your inventory
                  </p>
                </div>

                <Link
                  href="/admin/products/add"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-light"
                >
                  <Plus size={20} />
                  Add New Product
                </Link>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
                  <p className="text-gray-600 mb-4">No products found</p>
                  <Link
                    href="/admin/products/add"
                    className="inline-flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Plus size={18} />
                    Add Your First Product
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                            Brand
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                            Discount
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
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
                                {product.images && product.images[0] && (
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-10 h-10 rounded object-cover"
                                  />
                                )}
                                <span className="font-medium text-gray-900">
                                  {product.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-900 font-semibold">
                                  ${product.price}
                                </span>
                                <span className="text-gray-500 line-through text-sm">
                                  ${product.mrp}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                                {product.gender}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{product.brand}</td>
                            <td className="px-6 py-4">
                              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                {product.discount}%
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/product/${product._id}`}
                                  className="inline-flex items-center gap-1 px-3 py-1 rounded hover:bg-gray-100 text-gray-600 transition-colors"
                                  title="View"
                                >
                                  <Eye size={16} />
                                </Link>
                                <Link
                                  href={`/admin/products/${product._id}/edit`}
                                  className="inline-flex items-center gap-1 px-3 py-1 rounded hover:bg-blue-100 text-blue-600 transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 size={16} />
                                </Link>
                                <button
                                  onClick={() => handleDeleteProduct(product._id)}
                                  className="inline-flex items-center gap-1 px-3 py-1 rounded hover:bg-red-100 text-red-600 transition-colors"
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

                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Total Products: <strong>{products.length}</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <div className="mb-12">
                <h1 className="text-4xl font-light tracking-tight mb-2">
                  Order Management
                </h1>
                <p className="text-gray-600">
                  Manage customer orders and update delivery status
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
                  <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">No orders yet</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Order ID</p>
                            <p className="text-xl font-semibold text-gray-900">{order.orderId}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Customer</p>
                            <p className="text-lg font-medium text-gray-900">{order.userName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="text-sm text-blue-600">{order.userEmail || order.shippingAddress?.email || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Amount</p>
                            <p className="text-lg font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-sm text-gray-600">
                              {item.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-6 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress.fullName}<br />
                          {order.shippingAddress.address}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                        </p>
                      </div>

                      <div className="p-6 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Current Status</p>
                            <div className="flex items-center gap-2 mt-2">
                              {order.status === 'confirmed' && <CheckCircle size={20} className="text-blue-500" />}
                              {order.status === 'shipped' && <Truck size={20} className="text-orange-500" />}
                              {order.status === 'delivered' && <CheckCircle size={20} className="text-green-500" />}
                              <span className="font-medium text-gray-900 capitalize">{order.status}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              defaultValue={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              disabled={emailSending === order._id}
                              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm font-medium"
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                              disabled={emailSending === order._id}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
                              title="Email has been sent when status is updated"
                            >
                              <Mail size={18} />
                              {emailSending === order._id ? 'Sending...' : 'Email Sent'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
