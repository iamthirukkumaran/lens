'use client';

import { useState, useEffect } from 'react';
import { Star, Loader } from 'lucide-react';

interface Rating {
  _id: string;
  userName: string;
  rating: number;
  review: string;
  createdAt: string;
}

interface RatingsDisplayProps {
  productId: string;
  refreshTrigger?: number;
}

export default function RatingsDisplay({ productId, refreshTrigger }: RatingsDisplayProps) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ratingDistribution, setRatingDistribution] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    fetchRatings();
  }, [productId, refreshTrigger]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ratings?productId=${productId}`);
      const data = await response.json();

      if (response.ok && data.ratings) {
        setRatings(data.ratings);
        setAverageRating(data.averageRating || 0);
        setTotalRatings(data.totalRatings || 0);

        // Calculate rating distribution
        const distribution = [0, 0, 0, 0, 0];
        data.ratings.forEach((rating: Rating) => {
          distribution[rating.rating - 1]++;
        });
        setRatingDistribution(distribution);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  const ratingPercentages = totalRatings > 0 ? ratingDistribution.map((count) => (count / totalRatings) * 100) : [0, 0, 0, 0, 0];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Reviews</h3>

      {totalRatings === 0 ? (
        <p className="text-center text-gray-500 py-8">No ratings yet. Be the first to rate this product!</p>
      ) : (
        <div className="space-y-6">
          {/* Rating Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                  <span className="text-gray-500 text-lg">/ 5</span>
                </div>
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < Math.round(averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-1">{totalRatings} ratings</p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-8">{star}★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all"
                      style={{ width: `${ratingPercentages[star - 1]}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-8 text-right">
                    {ratingDistribution[star - 1]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Latest Reviews</h4>
            {ratings.length === 0 ? (
              <p className="text-gray-500 text-sm">No reviews yet</p>
            ) : (
              ratings.map((rating) => (
                <div key={rating._id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{rating.userName}</p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${
                              i < rating.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {rating.review && (
                    <p className="text-sm text-gray-700 mt-3 leading-relaxed">{rating.review}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
