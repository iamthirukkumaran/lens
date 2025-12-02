'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles, Gift, Zap, Award } from 'lucide-react';

export default function LoyaltyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft size={20} className="text-gray-600" />
            <span className="text-gray-600 hover:text-gray-900">Back</span>
          </Link>
          <h1 className="text-xl font-light">Loyalty Program</h1>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light mb-4">Hub Rewards</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our loyalty program and earn points on every purchase. Redeem for exclusive rewards.
          </p>
        </div>

        {/* How It Works */}
        <section className="bg-white rounded-2xl border border-gray-100 p-12 mb-16">
          <h3 className="text-2xl font-light mb-12 text-center">How Hub Rewards Works</h3>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={32} className="text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-3">1. Earn Points</h4>
              <p className="text-sm text-gray-600">
                Earn 1 point for every $1 spent on any purchase
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Gift size={32} className="text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-3">2. Accumulate</h4>
              <p className="text-sm text-gray-600">
                Points never expire and accumulate with every order
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-3">3. Redeem</h4>
              <p className="text-sm text-gray-600">
                Redeem points for discounts, gifts, and exclusive perks
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <Award size={32} className="text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-3">4. Enjoy</h4>
              <p className="text-sm text-gray-600">
                Get exclusive member-only deals and early access
              </p>
            </div>
          </div>
        </section>

        {/* Rewards Tiers */}
        <section className="mb-16">
          <h3 className="text-2xl font-light mb-8 text-center">Membership Tiers</h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Silver */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border border-gray-300 p-8">
              <div className="text-3xl mb-2">🥈</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Silver</h4>
              <p className="text-sm text-gray-700 mb-6">Join when you sign up</p>

              <div className="space-y-3 mb-8 pb-8 border-b border-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-800">1 point per $1 spent</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-800">Birthday gift</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-800">Early access to sales</span>
                </div>
              </div>

              <p className="text-xs text-gray-700">
                Earn 100 points to upgrade to Gold
              </p>
            </div>

            {/* Gold */}
            <div className="bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl border-2 border-yellow-400 p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded-full">
                POPULAR
              </div>

              <div className="text-3xl mb-2">🥇</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Gold</h4>
              <p className="text-sm text-gray-700 mb-6">After 100 points</p>

              <div className="space-y-3 mb-8 pb-8 border-b border-yellow-300">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-800">1.5x points per $1 spent</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-800">10% member discount</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-800">Free shipping on orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-800">Exclusive member events</span>
                </div>
              </div>

              <p className="text-xs text-gray-700">
                Earn 250 points to upgrade to Platinum
              </p>
            </div>

            {/* Platinum */}
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl border-2 border-purple-300 p-8">
              <div className="text-3xl mb-2">💎</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Platinum</h4>
              <p className="text-sm text-gray-700 mb-6">After 250 points</p>

              <div className="space-y-3 mb-8 pb-8 border-b border-purple-200">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-800">2x points per $1 spent</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-800">15% member discount</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-800">Free priority shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-800">VIP access & concierge</span>
                </div>
              </div>

              <p className="text-xs text-gray-700">
                Elite membership status
              </p>
            </div>
          </div>
        </section>

        {/* Redemption Options */}
        <section className="bg-white rounded-2xl border border-gray-100 p-12 mb-16">
          <h3 className="text-2xl font-light mb-8 text-center">Redeem Your Points</h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-gray-900 mb-3">Discounts</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• 50 points = $5 discount</li>
                <li>• 100 points = $12 discount</li>
                <li>• 250 points = $35 discount</li>
                <li>• 500 points = $80 discount</li>
              </ul>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-gray-900 mb-3">Free Items</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• 150 points = Free cleaning kit</li>
                <li>• 300 points = Free premium frames</li>
                <li>• 500 points = Choice of any item</li>
                <li>• 1000 points = Shopping spree</li>
              </ul>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-gray-900 mb-3">Exclusive Perks</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• 100 points = Free shipping upgrade</li>
                <li>• 200 points = Personal styling session</li>
                <li>• 350 points = VIP event invitation</li>
                <li>• 600 points = Anniversary gift</li>
              </ul>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-gray-900 mb-3">Special Rewards</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Birthday bonus: 25 points</li>
                <li>• Referral bonus: 50 points</li>
                <li>• Review bonus: 10 points</li>
                <li>• Anniversary bonus: 100 points</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-light mb-4">Start Earning Today</h3>
          <p className="mb-8 text-gray-300 max-w-lg mx-auto">
            Sign up now to join Hub Rewards and start earning points on every purchase.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-light"
          >
            Join Now
          </Link>
        </div>
      </main>
    </div>
  );
}
