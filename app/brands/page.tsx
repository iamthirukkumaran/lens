'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const brands = [
  {
    name: 'Ray-Ban',
    description: 'Iconic American eyewear brand',
    products: '150+',
    since: '1936',
  },
  {
    name: 'Gucci',
    description: 'Luxury Italian fashion eyewear',
    products: '89+',
    since: '1921',
  },
  {
    name: 'Prada',
    description: 'Premium Italian designer frames',
    products: '76+',
    since: '1913',
  },
  {
    name: 'Oakley',
    description: 'Performance sports eyewear',
    products: '120+',
    since: '1975',
  },
  {
    name: 'Versace',
    description: 'High-end luxury designer frames',
    products: '95+',
    since: '1978',
  },
  {
    name: 'Tom Ford',
    description: 'Contemporary luxury eyewear',
    products: '68+',
    since: '2005',
  },
];

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft size={20} className="text-gray-600" />
            <span className="text-gray-600 hover:text-gray-900">Back</span>
          </Link>
          <h1 className="text-xl font-light">Our Brands</h1>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light mb-4">Premium Brands Collection</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Curated selection of the world's finest eyewear brands. From iconic classics to contemporary luxury.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow group cursor-pointer"
            >
              {/* Brand Name */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-1">
                    {brand.name}
                  </h3>
                  <p className="text-sm text-gray-500">Est. {brand.since}</p>
                </div>
                <ExternalLink
                  size={20}
                  className="text-gray-300 group-hover:text-gray-900 transition-colors"
                />
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-6">{brand.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                    Products
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {brand.products}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                    Since
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {brand.since}
                  </p>
                </div>
              </div>

              {/* Browse Button */}
              <Link
                href="/collections/men"
                className="block w-full py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-center text-sm font-light"
              >
                Browse Collection
              </Link>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <section className="mt-20 bg-white rounded-2xl border border-gray-100 p-12">
          <h2 className="text-3xl font-light mb-12 text-center">Why Our Brands</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">100% Authentic</h3>
              <p className="text-sm text-gray-600">
                All products are directly sourced from authorized distributors
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-sm text-gray-600">
                Hand-selected frames that meet our strict quality standards
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-sm text-gray-600">
                Competitive pricing with exclusive offers and discounts
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
