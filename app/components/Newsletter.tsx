'use client';

import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // Simulate newsletter signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setMessage('Thank you! Check your email for a special welcome offer.');
      setEmail('');

      setTimeout(() => {
        setSuccess(false);
        setMessage('');
      }, 5000);
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-gray-900 to-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-light mb-2">Join Our Newsletter</h3>
            <p className="text-gray-400">
              Subscribe to get exclusive offers, new arrivals, and styling tips delivered to your inbox.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            {message && (
              <div
                className={`absolute -top-12 left-0 right-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                  success
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}
              >
                {success ? (
                  <CheckCircle size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                {message}
              </div>
            )}

            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/50 outline-none transition-colors text-white placeholder:text-gray-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors font-semibold"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}


