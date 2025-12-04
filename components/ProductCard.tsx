'use client';

import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  modelNumber: string;
  price: number;
  mrp: number;
  discount: number;
  images: string[];
  onAddToCart: () => void;
  onAddToFavorites: () => void;
  isFavorited?: boolean;
}

export default function ProductCard({
  id,
  name,
  modelNumber,
  price,
  mrp,
  discount,
  images,
  onAddToCart,
  onAddToFavorites,
  isFavorited = false,
}: ProductCardProps) {
  const [isFav, setIsFav] = useState(isFavorited);
  const [userId, setUserId] = useState<string>('');
  const savings = Math.round(mrp - price);

  useEffect(() => {
    // Get user ID
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserId(userData.id);
      
      // Load favorites from localStorage for this user
      const userFavoritesKey = `favorites_${userData.id}`;
      const favorites = JSON.parse(localStorage.getItem(userFavoritesKey) || '[]');
      setIsFav(favorites.includes(id));
    }
  }, [id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userId) return;
    
    const userFavoritesKey = `favorites_${userId}`;
    const favorites = JSON.parse(localStorage.getItem(userFavoritesKey) || '[]');
    
    if (isFav) {
      // Remove from favorites
      const updated = favorites.filter((fav: string) => fav !== id);
      localStorage.setItem(userFavoritesKey, JSON.stringify(updated));
      setIsFav(false);
    } else {
      // Add to favorites
      favorites.push(id);
      localStorage.setItem(userFavoritesKey, JSON.stringify(favorites));
      setIsFav(true);
    }
    
    onAddToFavorites();
  };

  return (
    <div 
      onClick={() => {
        console.log('Opening product:', id);
        window.open(`/product/${id}`, '_blank');
      }}
      className="group relative flex overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-gray-400 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer h-full">
        {/* Image Container - Left Side */}
        <div className="relative w-48 flex-shrink-0 bg-gray-100 overflow-hidden">
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-gray-900 text-white px-3 py-1 rounded text-xs font-bold">
              {discount}%OFF
            </div>
          )}

          {/* Image */}
          {images[0] && (
            <Image
              src={images[0]}
              alt={modelNumber}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-sm hover:shadow-md transition-all flex items-center justify-center"
          >
            <Heart
              size={18}
              className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'}
            />
          </button>
        </div>

        {/* Content - Right Side */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{modelNumber}</h3>
            <p className="text-xs text-gray-600 mb-4 line-clamp-2">{name}</p>

            {/* Price Section */}
            <div className="mb-4">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-lg font-bold text-gray-900">
                  $ {price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  $ {mrp.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-green-600 font-semibold">
                Save - $ {savings.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
