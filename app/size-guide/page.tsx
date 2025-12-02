'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SizeFitGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft size={20} className="text-gray-600" />
            <span className="text-gray-600 hover:text-gray-900">Back</span>
          </Link>
          <h1 className="text-xl font-light">Size & Fit Guide</h1>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Frame Size Guide */}
        <section className="mb-16 bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="text-2xl font-light mb-6">Frame Size Guide</h2>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">How to Measure Your Frame Size</h3>
            <p className="text-gray-600 mb-4">
              Every frame has three measurements: Eye Size - Bridge Width - Temple Length
            </p>
            <p className="text-sm text-gray-500 mb-4">Example: 50-18-140</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Eye Size (Lens Width)</h4>
              <p className="text-sm text-gray-600 mb-3">
                Measured from the inner corner to outer corner of the lens.
              </p>
              <p className="text-xs text-gray-500">Range: 40mm - 58mm</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Bridge Width</h4>
              <p className="text-sm text-gray-600 mb-3">
                The distance between the two lenses across the bridge of the nose.
              </p>
              <p className="text-xs text-gray-500">Range: 14mm - 24mm</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Temple Length</h4>
              <p className="text-sm text-gray-600 mb-3">
                The length of the arms from the hinge to the end piece.
              </p>
              <p className="text-xs text-gray-500">Range: 130mm - 150mm</p>
            </div>
          </div>
        </section>

        {/* Face Shape Guide */}
        <section className="mb-16 bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="text-2xl font-light mb-6">Frame Styles by Face Shape</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Round Face */}
            <div className="border-b pb-6 md:border-b-0 md:pb-0">
              <h3 className="text-lg font-semibold mb-3">Round Face</h3>
              <p className="text-sm text-gray-600 mb-4">
                Best for: Angular, geometric frames that add structure
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Rectangular frames</li>
                <li>✓ Angular shapes</li>
                <li>✓ Oversized styles</li>
                <li>✗ Round frames</li>
              </ul>
            </div>

            {/* Square Face */}
            <div className="border-b pb-6 md:border-b-0 md:pb-0">
              <h3 className="text-lg font-semibold mb-3">Square Face</h3>
              <p className="text-sm text-gray-600 mb-4">
                Best for: Round or curved frames to soften features
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Cat-eye frames</li>
                <li>✓ Round shapes</li>
                <li>✓ Curved designs</li>
                <li>✗ Angular frames</li>
              </ul>
            </div>

            {/* Oval Face */}
            <div className="border-b pb-6 md:border-b-0 md:pb-0">
              <h3 className="text-lg font-semibold mb-3">Oval Face</h3>
              <p className="text-sm text-gray-600 mb-4">
                Best for: Most frame styles work well with oval faces
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Any frame style</li>
                <li>✓ Classic styles</li>
                <li>✓ Proportional frames</li>
              </ul>
            </div>

            {/* Heart Face */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Heart Face</h3>
              <p className="text-sm text-gray-600 mb-4">
                Best for: Bottom-heavy frames to balance features
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Bottom-heavy frames</li>
                <li>✓ Rimless styles</li>
                <li>✓ Clubmaster shapes</li>
                <li>✗ Top-heavy frames</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Material Guide */}
        <section className="bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="text-2xl font-light mb-6">Frame Materials</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3">Acetate</h3>
              <p className="text-sm text-gray-600 mb-2">
                Hypoallergenic, lightweight, and durable plastic material.
              </p>
              <p className="text-xs text-gray-500">Pros: Colorful, durable | Cons: Can crack</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3">Metal</h3>
              <p className="text-sm text-gray-600 mb-2">
                Strong and lightweight, great for precision engineering.
              </p>
              <p className="text-xs text-gray-500">Pros: Lightweight, precise | Cons: Can bend</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3">Titanium</h3>
              <p className="text-sm text-gray-600 mb-2">
                Premium material, extremely durable and hypoallergenic.
              </p>
              <p className="text-xs text-gray-500">Pros: Durable, hypoallergenic | Cons: Expensive</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3">Combination</h3>
              <p className="text-sm text-gray-600 mb-2">
                Mix of metal fronts and acetate temples for best of both worlds.
              </p>
              <p className="text-xs text-gray-500">Pros: Versatile | Cons: Multiple materials</p>
            </div>
          </div>
        </section>

        {/* Care Instructions */}
        <section className="mt-16 bg-blue-50 rounded-2xl border border-blue-200 p-8">
          <h2 className="text-2xl font-light mb-6">Care Instructions</h2>

          <ul className="space-y-3 text-sm text-gray-600">
            <li>• Rinse frames with lukewarm water daily</li>
            <li>• Use microfiber cloth to dry, never paper towels</li>
            <li>• Store in protective case when not wearing</li>
            <li>• Avoid extreme heat and direct sunlight</li>
            <li>• Use only lens cleaner approved for your lens type</li>
            <li>• Have frames adjusted by professionals if needed</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
