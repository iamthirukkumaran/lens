'use client';

import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Toast } from './Toast';

interface RatingFormProps {
  productId: string;
  onRatingSubmitted?: () => void;
}

export default function RatingForm({ productId, onRatingSubmitted }: RatingFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      setToast({ message: 'Please select a rating', type: 'error' });
      return;
    }

    if (!userName.trim()) {
      setToast({ message: 'Please enter your name', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const userId = localStorage.getItem('userId') || 'anonymous-' + Date.now();

      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          userId,
          rating,
          review: review.trim() || '',
          userName: userName.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setToast({ message: 'Rating submitted successfully!', type: 'success' });
        setRating(0);
        setReview('');
        setUserName('');
        onRatingSubmitted?.();
      } else {
        setToast({ message: data.error || 'Failed to submit rating', type: 'error' });
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      setToast({ message: 'Error submitting rating', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Share Your Experience</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Rate this Product
          </label>
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  size={32}
                  className={`${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {rating === 5 && 'Excellent!'}
              {rating === 4 && 'Very Good!'}
              {rating === 3 && 'Good!'}
              {rating === 2 && "It's OK"}
              {rating === 1 && 'Not satisfied'}
            </p>
          )}
        </div>

        {/* Name Input */}
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Review Text */}
        <div>
          <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review (Optional)
          </label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">{review.length}/500 characters</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
          {loading ? 'Submitting...' : 'Submit Rating'}
        </button>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
