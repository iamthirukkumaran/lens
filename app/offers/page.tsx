'use client';

import Link from 'next/link';
import { ArrowLeft, Zap, Gift, Clock } from 'lucide-react';

const promotions = [
  {
    title: 'Black Friday Mega Sale',
    description: 'Get up to 50% off on selected luxury frames',
    discount: '50%',
    code: 'BF50',
    validUntil: 'Dec 5, 2024',
    badge: 'HOT',
    color: 'from-red-500 to-orange-500',
  },
  {
    title: 'New Arrival Exclusive',
    description: '30% off on all new arrivals this season',
    discount: '30%',
    code: 'NEW30',
    validUntil: 'Dec 31, 2024',
    badge: 'NEW',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Refer a Friend',
    description: 'Get $25 credit for each friend you refer',
    discount: '$25',
    code: 'REFER25',
    validUntil: 'Dec 31, 2024',
    badge: 'BONUS',
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Bundle Deal',
    description: 'Buy 2 pairs, get 15% off your entire order',
    discount: '15%',
    code: 'BUNDLE15',
    validUntil: 'Dec 31, 2024',
    badge: 'SAVE',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Student Discount',
    description: 'Verified students get 20% off always',
    discount: '20%',
    code: 'STUDENT20',
    validUntil: 'No Expiry',
    badge: 'YEAR-ROUND',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    title: 'Flash Sale',
    description: 'Daily deals on limited quantity frames',
    discount: 'Up to 40%',
    code: 'FLASH40',
    validUntil: 'Tonight 11:59 PM',
    badge: 'LIMITED',
    color: 'from-yellow-500 to-amber-500',
  },
];

export default function OffersPage() {
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Code "${code}" copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft size={20} className="text-gray-600" />
            <span className="text-gray-600 hover:text-gray-900">Back</span>
          </Link>
          <h1 className="text-xl font-light">Special Offers</h1>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light mb-4">Exclusive Deals & Promotions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't miss out on our best offers. Limited time deals on premium eyewear.
          </p>
        </div>

        {/* Promotions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {promotions.map((promo, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${promo.color} opacity-5 group-hover:opacity-10 transition-opacity`}
              ></div>

              {/* Badge */}
              <div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-xs font-semibold bg-gradient-to-r ${promo.color} shadow-lg`}
              >
                {promo.badge}
              </div>

              <div className="relative p-8">
                {/* Discount Display */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${promo.color} flex items-center justify-center text-white mb-6`}>
                  <span className="text-2xl font-bold">{promo.discount}</span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {promo.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6">{promo.description}</p>

                {/* Valid Until */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <Clock size={16} />
                  Valid until {promo.validUntil}
                </div>

                {/* Code Display */}
                <div
                  onClick={() => copyCode(promo.code)}
                  className="mb-6 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <p className="text-xs text-gray-600 mb-1">Use code</p>
                  <p className="text-lg font-mono font-semibold text-gray-900">
                    {promo.code}
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2">
                  <Link
                    href="/collections/men"
                    className="block w-full py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-center text-sm font-light"
                  >
                    Shop Now
                  </Link>
                  <button
                    onClick={() => copyCode(promo.code)}
                    className="w-full py-2 px-4 border border-gray-300 text-gray-900 rounded-lg hover:border-gray-900 transition-colors text-sm font-light"
                  >
                    Copy Code
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How to Use */}
        <section className="bg-white rounded-2xl border border-gray-100 p-12">
          <h2 className="text-2xl font-light mb-8 text-center">How to Use Coupon Codes</h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4 text-xl">
                1️⃣
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Copy Code</h4>
              <p className="text-sm text-gray-600">Click "Copy Code" on any promotion</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 text-xl">
                2️⃣
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Add to Cart</h4>
              <p className="text-sm text-gray-600">Browse and add products to cart</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4 text-xl">
                3️⃣
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Proceed to Checkout</h4>
              <p className="text-sm text-gray-600">Go to checkout and review your cart</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4 text-xl">
                4️⃣
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Paste Code</h4>
              <p className="text-sm text-gray-600">Paste code in discount field at checkout</p>
            </div>
          </div>
        </section>

        {/* Terms & Conditions */}
        <section className="mt-16 bg-blue-50 rounded-2xl border border-blue-200 p-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Terms & Conditions</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Coupon codes cannot be combined unless specified</li>
            <li>• Discounts apply to base price before taxes and shipping</li>
            <li>• Some restrictions may apply to certain brands or items</li>
            <li>• One code per order only</li>
            <li>• Codes are non-transferable and non-refundable</li>
            <li>• Hub of Frames reserves the right to modify or cancel offers</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
