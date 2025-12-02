'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, User, ArrowRight } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'How to Choose the Perfect Frame Shape for Your Face',
    excerpt:
      'Discover which frame styles work best with different face shapes. A comprehensive guide to flattering eyewear choices.',
    author: 'Sarah Mitchell',
    date: 'Nov 28, 2024',
    category: 'Style Guide',
    image: '👓',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Trending Colors This Season',
    excerpt:
      'From classic tortoiseshell to bold metallic accents. Explore the hottest eyewear colors for fall and winter.',
    author: 'James Chen',
    date: 'Nov 25, 2024',
    category: 'Trends',
    image: '🎨',
    readTime: '4 min read',
  },
  {
    id: 3,
    title: 'Caring for Your Eyewear Investment',
    excerpt:
      'Learn proper cleaning, storage, and maintenance techniques to keep your frames looking pristine for years.',
    author: 'Emma Rodriguez',
    date: 'Nov 20, 2024',
    category: 'Care Tips',
    image: '🧼',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'Designer Collaborations Worth Knowing About',
    excerpt:
      'Exclusive partnerships between luxury brands create limited-edition frames. Discover the latest collaborations.',
    author: 'Alex Thompson',
    date: 'Nov 18, 2024',
    category: 'News',
    image: '✨',
    readTime: '7 min read',
  },
  {
    id: 5,
    title: 'Glasses That Match Your Personality',
    excerpt:
      'Your eyewear says a lot about you. Find frames that reflect your personal style and confidence.',
    author: 'Lisa Park',
    date: 'Nov 15, 2024',
    category: 'Style Guide',
    image: '💫',
    readTime: '5 min read',
  },
  {
    id: 6,
    title: 'The Evolution of Eyewear Fashion',
    excerpt:
      'From vintage inspiration to modern innovation. A journey through the history of iconic eyewear styles.',
    author: 'David Brown',
    date: 'Nov 12, 2024',
    category: 'History',
    image: '📚',
    readTime: '8 min read',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft size={20} className="text-gray-600" />
            <span className="text-gray-600 hover:text-gray-900">Back</span>
          </Link>
          <h1 className="text-xl font-light">Style Guide & Blog</h1>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light mb-4">Hub of Frames Blog</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Style tips, trends, and eyewear insights to help you find your perfect frames.
          </p>
        </div>

        {/* Featured Article */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-16 hover:shadow-lg transition-shadow">
          <div className="grid md:grid-cols-2 gap-8 items-center p-8">
            <div className="text-6xl">{articles[0].image}</div>
            <div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                  {articles[0].category}
                </span>
              </div>
              <h2 className="text-3xl font-light mb-4 text-gray-900">
                {articles[0].title}
              </h2>
              <p className="text-gray-600 mb-6">{articles[0].excerpt}</p>

              <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  {articles[0].author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {articles[0].date}
                </div>
                <span>{articles[0].readTime}</span>
              </div>

              <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                Read Article
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(1).map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
            >
              {/* Image */}
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                {article.image}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-3">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {article.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700">
                  {article.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {article.excerpt}
                </p>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>

                  <button className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:border-gray-900 hover:text-gray-900 transition-colors text-sm font-light flex items-center justify-center gap-1">
                    Read
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-20 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-white text-center">
          <h3 className="text-2xl font-light mb-2">Get Style Tips Weekly</h3>
          <p className="text-gray-300 mb-6">
            Subscribe to our newsletter for exclusive eyewear tips and early access to new collections.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-white outline-none text-white placeholder:text-gray-400"
            />
            <button className="px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
