'use client';

import Link from 'next/link';
import { ArrowLeft, Heart, DollarSign, Zap } from 'lucide-react';

const giftGuides = [
  {
    title: 'Budget-Friendly Gifts',
    description: 'Perfect frames under $100',
    priceRange: 'Under $100',
    icon: '💰',
    color: 'from-green-500 to-emerald-500',
    tips: [
      'Great for first-time frame buyers',
      'Excellent quality at affordable prices',
      'Perfect for teenagers and students',
      'Ideal for casual everyday wear',
    ],
  },
  {
    title: 'Premium Luxury Picks',
    description: 'High-end designer eyewear',
    priceRange: '$300+',
    icon: '👑',
    color: 'from-purple-500 to-pink-500',
    tips: [
      'Top designer brands (Gucci, Prada, Versace)',
      'Investment pieces that last',
      'Perfect for special occasions',
      'Exceptional craftsmanship',
    ],
  },
  {
    title: 'Mid-Range Favorites',
    description: 'Best value for quality',
    priceRange: '$100-$300',
    icon: '⭐',
    color: 'from-blue-500 to-cyan-500',
    tips: [
      'Great balance of quality and price',
      'Well-known brands with proven quality',
      'Versatile styles for everyone',
      'Perfect everyday frames',
    ],
  },
  {
    title: 'Sports & Active',
    description: 'Durable frames for activities',
    priceRange: 'Varies',
    icon: '⚡',
    color: 'from-orange-500 to-red-500',
    tips: [
      'UV protection lenses',
      'Shatter-resistant materials',
      'Lightweight and comfortable',
      'Perfect for outdoor enthusiasts',
    ],
  },
];

const forWho = [
  {
    recipient: 'For Her',
    emoji: '👩',
    suggestions: [
      'Cat-eye frames in tortoiseshell',
      'Oversized designer frames',
      'Delicate metal frames',
      'Colorful acetate styles',
    ],
  },
  {
    recipient: 'For Him',
    emoji: '👨',
    suggestions: [
      'Classic rectangular shapes',
      'Wayfarer style frames',
      'Minimalist metal designs',
      'Bold oversized styles',
    ],
  },
  {
    recipient: 'For Kids',
    emoji: '👶',
    suggestions: [
      'Colorful fun designs',
      'Durable flexible frames',
      'Adjustable fits for growing',
      'Lightweight comfortable styles',
    ],
  },
];

export default function GiftGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft size={20} className="text-gray-600" />
            <span className="text-gray-600 hover:text-gray-900">Back</span>
          </Link>
          <h1 className="text-xl font-light">Gift Guide</h1>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light mb-4">Eyewear Gift Guide 2024</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find the perfect frames for everyone on your gift list. Thoughtful, stylish, and always appreciated.
          </p>
        </div>

        {/* Gift Categories */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {giftGuides.map((guide, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${guide.color} p-8 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{guide.icon}</span>
                  <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                    {guide.priceRange}
                  </span>
                </div>
                <h3 className="text-2xl font-light mb-2">{guide.title}</h3>
                <p className="text-white/80">{guide.description}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Why They're Great:</h4>
                <ul className="space-y-3">
                  {guide.tips.map((tip, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-gray-700">
                      <Heart size={16} className="flex-shrink-0 text-pink-500 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/collections/men"
                  className="mt-6 block w-full py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-center text-sm font-light"
                >
                  Shop This Category
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* For Who Section */}
        <section className="bg-white rounded-2xl border border-gray-100 p-12 mb-16">
          <h2 className="text-3xl font-light mb-12 text-center">Gift Ideas by Recipient</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {forWho.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl mb-4">{item.emoji}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  {item.recipient}
                </h3>

                <div className="space-y-3 mb-6">
                  {item.suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-100"
                    >
                      ✓ {suggestion}
                    </div>
                  ))}
                </div>

                <Link
                  href="/search"
                  className="inline-block px-6 py-2 border border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-sm font-light"
                >
                  Browse Styles
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Gift Tips */}
        <section className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-200 p-12">
          <h3 className="text-2xl font-light mb-8">🎁 Gift Giving Tips</h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                <span>✓</span> Know Their Style
              </h4>
              <p className="text-indigo-800 text-sm mb-6">
                Consider the recipient's personal style and preferences. Do they prefer classic,
                trendy, minimal, or bold designs? This will help narrow down your choices.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                <span>✓</span> Face Shape Matters
              </h4>
              <p className="text-indigo-800 text-sm mb-6">
                Different face shapes look better with different frame styles. Check our Size & Fit
                Guide to find frames that complement their face shape.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                <span>✓</span> Consider Lifestyle
              </h4>
              <p className="text-indigo-800 text-sm mb-6">
                Think about how they use eyewear. Casual wearer? Professional environment? Sports
                enthusiast? This helps pick the right style and durability level.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                <span>✓</span> Don't Forget the Box
              </h4>
              <p className="text-indigo-800 text-sm mb-6">
                We provide beautiful presentation with every purchase. Your gift will come ready
                to give with our premium packaging and gift wrapping options.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
