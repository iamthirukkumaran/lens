'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft size={20} className="text-gray-600" />
            <span className="text-gray-600 hover:text-gray-900">Back</span>
          </Link>
          <h1 className="text-xl font-light">Returns & Exchanges</h1>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 30-Day Return Policy */}
        <section className="mb-16 bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="text-3xl font-light mb-6">30-Day Return Policy</h2>
          <p className="text-gray-600 mb-6">
            We want you to be completely satisfied with your purchase. If you're not happy, we make returns easy.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex gap-3">
            <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900 mb-1">30-Day Money-Back Guarantee</p>
              <p className="text-green-800 text-sm">
                Return any item within 30 days for a full refund if you're not satisfied.
              </p>
            </div>
          </div>

          <h3 className="font-semibold text-lg mb-4">Eligibility Requirements</h3>
          <ul className="space-y-3 mb-8">
            <li className="flex gap-3">
              <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Original tags and packaging intact</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Product must be unused and unworn</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">No signs of damage or wear</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Receipt or proof of purchase included</span>
            </li>
          </ul>
        </section>

        {/* How to Return */}
        <section className="mb-16 bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="text-2xl font-light mb-6">How to Return</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-900 text-white font-semibold">
                  1
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                <p className="text-gray-600">
                  Email support@hubofframes.com with your order number and reason for return.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-900 text-white font-semibold">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Receive Return Label</h3>
                <p className="text-gray-600">
                  We'll provide a prepaid return shipping label. No shipping costs for you!
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-900 text-white font-semibold">
                  3
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Ship Back</h3>
                <p className="text-gray-600">
                  Pack the item securely with original packaging and drop it off at any shipping location.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-900 text-white font-semibold">
                  4
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Get Your Refund</h3>
                <p className="text-gray-600">
                  Once we receive and inspect your return, your refund will be processed within 7-10 business days.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Exchanges */}
        <section className="mb-16 bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="text-2xl font-light mb-6">Exchanges</h2>
          <p className="text-gray-600 mb-6">
            Want to exchange for a different size or color? We make it simple!
          </p>

          <ul className="space-y-3">
            <li className="flex gap-3">
              <CheckCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">
                <strong>Free exchanges</strong> for different sizes or colors within 30 days
              </span>
            </li>
            <li className="flex gap-3">
              <CheckCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">
                <strong>Prepaid return label</strong> included with your original order
              </span>
            </li>
            <li className="flex gap-3">
              <CheckCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">
                <strong>Priority processing</strong> - exchanges ship within 2 business days
              </span>
            </li>
            <li className="flex gap-3">
              <CheckCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">
                <strong>No additional fees</strong> unless upgrading to a higher-priced item
              </span>
            </li>
          </ul>
        </section>

        {/* Non-Returnable Items */}
        <section className="mb-16 bg-red-50 rounded-2xl border border-red-200 p-8">
          <div className="flex gap-3 mb-6">
            <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
            <h2 className="text-2xl font-light text-red-900">Items Not Eligible for Return</h2>
          </div>

          <ul className="space-y-2 text-red-800">
            <li>• Items purchased on final sale or clearance</li>
            <li>• Custom or personalized frames</li>
            <li>• Items showing signs of wear or damage</li>
            <li>• Frames with modified lenses</li>
            <li>• Items without original packaging</li>
            <li>• Returns initiated after 30 days</li>
          </ul>
        </section>

        {/* Damaged Items */}
        <section className="bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="text-2xl font-light mb-6">Damaged on Arrival?</h2>
          <p className="text-gray-600 mb-6">
            We want to make sure your frames arrive in perfect condition. If you receive a damaged item:
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
            <div>
              <p className="font-semibold text-blue-900 mb-2">
                📸 Take photos of the damage and packaging
              </p>
              <p className="text-blue-800 text-sm">
                Send clear photos showing the damaged area and packaging condition.
              </p>
            </div>

            <div>
              <p className="font-semibold text-blue-900 mb-2">📧 Contact us immediately</p>
              <p className="text-blue-800 text-sm">
                Email support@hubofframes.com within 3 days of delivery with photos and order number.
              </p>
            </div>

            <div>
              <p className="font-semibold text-blue-900 mb-2">
                🎁 We'll send a replacement or refund
              </p>
              <p className="text-blue-800 text-sm">
                We'll arrange a replacement immediately or process a full refund at no cost to you.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
