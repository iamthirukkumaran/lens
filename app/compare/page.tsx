'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Heart, X } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  mrp: number;
  discount: number;
  images: string[];
  brand: string;
  material: string[];
  colors: string[];
  sizes: string[];
  gender: string;
}

export default function ComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = searchParams.getAll('ids');
    if (ids.length < 2) {
      router.push('/collections/men');
      return;
    }

    const fetchProducts = async () => {
      try {
        const fetchedProducts = await Promise.all(
          ids.map(id =>
            fetch(`/api/products/${id}`).then(res => res.json())
          )
        );
        setProducts(fetchedProducts.map(res => res.product || res));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, router]);

  const removeProduct = (index: number) => {
    if (products.length <= 2) {
      router.push('/collections/men');
      return;
    }
    setProducts(products.filter((_, i) => i !== index));
  };

  const addToCart = (product: Product) => {
    const cartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0],
    };

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/collections/men" className="flex items-center gap-2">
            <ArrowLeft size={20} className="text-gray-600" />
            <span className="text-gray-600 hover:text-gray-900">Back</span>
          </Link>
          <h1 className="text-xl font-light">Compare Products</h1>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-40">
                  Specifications
                </th>
                {products.map((product, index) => (
                  <th key={index} className="px-6 py-4 text-center min-w-max">
                    <div className="relative">
                      <button
                        onClick={() => removeProduct(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-50 text-red-600 rounded-full hover:bg-red-100"
                      >
                        <X size={16} />
                      </button>
                      <div className="bg-white rounded-lg border border-gray-100 p-3 mb-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded mb-3 mx-auto"
                        />
                        <h3 className="text-sm font-semibold line-clamp-2">
                          {product.name}
                        </h3>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Price */}
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  Price
                </td>
                {products.map((product, index) => (
                  <td key={index} className="px-6 py-4 text-center">
                    <div className="flex items-baseline gap-2 justify-center">
                      <span className="font-bold text-lg">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ${product.mrp.toFixed(2)}
                      </span>
                    </div>
                    {product.discount > 0 && (
                      <div className="text-xs text-red-600 font-semibold mt-1">
                        -{product.discount}%
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Brand */}
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  Brand
                </td>
                {products.map((product, index) => (
                  <td key={index} className="px-6 py-4 text-center text-sm">
                    {product.brand}
                  </td>
                ))}
              </tr>

              {/* Gender */}
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  Category
                </td>
                {products.map((product, index) => (
                  <td key={index} className="px-6 py-4 text-center text-sm capitalize">
                    {product.gender}
                  </td>
                ))}
              </tr>

              {/* Materials */}
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  Materials
                </td>
                {products.map((product, index) => (
                  <td key={index} className="px-6 py-4 text-center text-sm">
                    {product.material?.join(', ') || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Colors */}
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  Colors
                </td>
                {products.map((product, index) => (
                  <td key={index} className="px-6 py-4 text-center text-sm">
                    <div className="flex gap-2 justify-center flex-wrap">
                      {product.colors?.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Sizes */}
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  Available Sizes
                </td>
                {products.map((product, index) => (
                  <td key={index} className="px-6 py-4 text-center text-sm">
                    {product.sizes?.join(', ') || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Action Row */}
              <tr>
                <td className="px-6 py-4"></td>
                {products.map((product, index) => (
                  <td key={index} className="px-6 py-4 text-center">
                    <div className="space-y-2">
                      <Link
                        href={`/product/${product._id}`}
                        className="block w-full py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-light"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full py-2 px-4 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-sm font-light"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
