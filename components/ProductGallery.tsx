'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  modelNumber: string;
}

export default function ProductGallery({ images, modelNumber }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100">
        {images[selectedImage] && (
          <Image
            src={images[selectedImage]}
            alt={modelNumber}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-2xl overflow-hidden transition-all ${
                selectedImage === index
                  ? 'ring-2 ring-gray-900'
                  : 'hover:ring-2 hover:ring-gray-400'
              }`}
            >
              <Image
                src={image}
                alt={`${modelNumber} view ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
