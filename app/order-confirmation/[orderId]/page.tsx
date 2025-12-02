'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Download, Home, Package, Truck, Clock, Mail, Phone, MapPin, Calendar, Copy } from 'lucide-react';

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // First effect: Set orderId from params
  useEffect(() => {
    if (params?.orderId) {
      setOrderId(params.orderId as string);
    }
  }, [params]);

  // Second effect: Fetch order when orderId is set
  useEffect(() => {
    if (!orderId) return;

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(storedUser));

    // Fetch order details
    const fetchOrder = async () => {
      try {
        const userId = JSON.parse(storedUser).id;
        const response = await fetch(`/api/orders?userId=${userId}`);
        const data = await response.json();

        if (data.success && data.orders && Array.isArray(data.orders)) {
          // Find order by orderId (exact match)
          let foundOrder = data.orders.find((o: any) => o.orderId && o.orderId.toString() === orderId);
          
          // Fallback: also try finding by _id in case orderId lookup fails
          if (!foundOrder) {
            foundOrder = data.orders.find((o: any) => o._id && o._id.toString() === orderId);
          }

          if (foundOrder) {
            setOrder(foundOrder);
          } else {
            console.error('Order not found with orderId:', orderId);
            console.log('Available orders:', data.orders.map((o: any) => ({ _id: o._id, orderId: o.orderId })));
            setOrder(null);
          }
        } else {
          console.error('No orders found in response:', data);
          setOrder(null);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setOrder(null);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId, router]);

  const copyOrderId = () => {
    if (order?.orderId) {
      navigator.clipboard.writeText(order.orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-gray-50/20 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-gray-50/20 to-white">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-light text-gray-900 mb-3">Order Not Found</h2>
          <p className="text-gray-600 mb-8">
            We couldn't find your order. Please check your order history or contact support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              View Orders
            </Link>
            <Link
              href="/collections/men"
              className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} className="w-10 h-10 transition-transform group-hover:scale-105" />
            <span className="text-xl font-light text-gray-900">Hub of <span className="font-semibold">Frames</span></span>
          </Link>
          <div className="text-sm text-gray-500">
            Order Confirmation
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Thank you for your purchase. Your order has been successfully placed and is being processed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order ID Section */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <CheckCircle size={16} className="text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Order Confirmation</h2>
                </div>
                <button
                  onClick={copyOrderId}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium border border-blue-200"
                >
                  {copied ? (
                    <>
                      <CheckCircle size={14} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy ID
                    </>
                  )}
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 uppercase tracking-wider font-medium mb-1">Order Number</p>
                  <p className="text-2xl font-bold text-gray-900 font-mono tracking-tight">
                    {order.orderId}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 uppercase tracking-wider font-medium mb-1">Order Date</p>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Calendar size={16} />
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 uppercase tracking-wider font-medium mb-1">Payment Method</p>
                    <p className="text-gray-900 font-medium">
                      {order.paymentMethod === 'credit_card' && 'Credit Card'}
                      {order.paymentMethod === 'paypal' && 'PayPal'}
                      {order.paymentMethod === 'bank_transfer' && 'Bank Transfer'}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-blue-200">
                  <p className="text-sm text-blue-700">
                    <Mail size={14} className="inline mr-2" />
                    Confirmation sent to <strong className="text-blue-900">{order.shippingAddress.email}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Order Status Timeline */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Clock size={20} />
                Order Status
              </h2>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-8">
                  {/* Step 1: Order Confirmed */}
                  <div className="relative flex items-start gap-4">
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">Order Confirmed</h3>
                        <span className="text-sm text-green-600 font-medium">✓ Completed</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">Your order has been confirmed and is being processed.</p>
                    </div>
                  </div>

                  {/* Step 2: Processing */}
                  <div className="relative flex items-start gap-4">
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Package size={16} className="text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">Processing</h3>
                        <span className="text-sm text-blue-600 font-medium">In Progress</span>
                      </div>
                      <p className="text-sm text-gray-600">Your order is being prepared for shipment.</p>
                      <p className="text-xs text-gray-500 mt-2">Expected: 1-2 business days</p>
                    </div>
                  </div>

                  {/* Step 3: Shipped */}
                  <div className="relative flex items-start gap-4">
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Truck size={16} className="text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 opacity-70">
                      <h3 className="font-semibold text-gray-900">Shipped</h3>
                      <p className="text-sm text-gray-600">Tracking information will be emailed to you.</p>
                      <p className="text-xs text-gray-500 mt-2">Expected: 3-5 business days</p>
                    </div>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="relative flex items-start gap-4">
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                      </div>
                    </div>
                    <div className="flex-1 opacity-70">
                      <h3 className="font-semibold text-gray-900">Delivered</h3>
                      <p className="text-sm text-gray-600">Your order will be delivered to the address provided.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Items</h2>
              
              <div className="space-y-4">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {item.color && <span>Color: {item.color}</span>}
                        {item.size && <span>Size: {item.size}</span>}
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">₹{item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="space-y-3">
                  {order.subtotal !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{order.subtotal.toFixed(2)}</span>
                    </div>
                  )}
                  {order.shipping !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className={`font-medium ${order.shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {order.shipping === 0 ? 'FREE' : `₹${order.shipping.toFixed(2)}`}
                      </span>
                    </div>
                  )}
                  {order.tax !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (10%)</span>
                      <span className="font-medium">₹{order.tax.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Shipping Address</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                      <p className="text-gray-600">{order.shippingAddress.address}</p>
                      <p className="text-gray-600">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    <span className="text-gray-600">{order.shippingAddress.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    <span className="text-gray-600">{order.shippingAddress.email}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <Link
                  href="/orders"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  <Package size={18} />
                  View All Orders
                </Link>
                <Link
                  href="/collections/men"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <Home size={18} />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                If you have any questions about your order, please contact our customer support.
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">📧 support@hubofframes.com</p>
                <p className="text-gray-700">📞 +91 98765 43210</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps Info */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">What Happens Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Clock size={20} className="text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Order Processing</h4>
              <p className="text-sm text-gray-600">Your order will be processed within 24 hours.</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Truck size={20} className="text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Shipping Updates</h4>
              <p className="text-sm text-gray-600">You'll receive tracking information via email.</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Package size={20} className="text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Delivery</h4>
              <p className="text-sm text-gray-600">Standard delivery takes 5-7 business days.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}