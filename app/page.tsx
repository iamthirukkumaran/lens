'use client'

import { useState, useEffect } from 'react'
import { Search, ShoppingBag, User, Heart, Sparkles, ChevronRight, X, Plus, Minus, ArrowRight, Shield, Clock, Truck, Star, Menu, X as CloseIcon, Play, LogOut, MapPin, Package, LayoutDashboard } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Newsletter from './components/Newsletter'

export default function Home() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState('Gallery')
  const [isVisible, setIsVisible] = useState(false)
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    setIsVisible(true)
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      const userData = JSON.parse(storedUser)
      
      // Load favorites for this specific user
      const userFavoritesKey = `favorites_${userData.id}`
      const storedFavorites = localStorage.getItem(userFavoritesKey)
      if (storedFavorites) {
        try {
          setFavorites(JSON.parse(storedFavorites))
        } catch (e) {
          setFavorites([])
        }
      }
    }

    // Load cart
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart))
      } catch (e) {
        setCartItems([])
      }
    }
  }, [])

  useEffect(() => {
    const loadCart = () => {
      const cart = localStorage.getItem('cart')
      if (cart) {
        try {
          setCartItems(JSON.parse(cart))
        } catch (e) {
          setCartItems([])
        }
      }
    }
    const loadFavorites = () => {
      const favs = localStorage.getItem('favorites')
      if (favs) {
        try {
          setFavorites(JSON.parse(favs))
        } catch (e) {
          setFavorites([])
        }
      }
    }
    if (isCartOpen) {
      loadCart()
      loadFavorites()
    }
  }, [isCartOpen])

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoadingProducts(true)
        const response = await fetch('/api/products?limit=4')
        const data = await response.json()
        if (data.success && data.data) {
          setFeaturedProducts(data.data || [])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setFeaturedProducts([])
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setIsMenuOpen(false)
    router.push('/')
  }

  const handleIncreaseQuantity = (itemId: string) => {
    const updated = cartItems.map(item =>
      item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    )
    setCartItems(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const handleDecreaseQuantity = (itemId: string) => {
    const updated = cartItems.map(item =>
      item._id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    )
    setCartItems(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const handleRemoveFromCart = (itemId: string) => {
    const updated = cartItems.filter(item => item._id !== itemId)
    setCartItems(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      router.push('/checkout')
      setIsCartOpen(false)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const total = subtotal


  const features = [
    { 
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M4 4L12 20L20 4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 12L16 12" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Geometric Precision', 
      description: 'Architectural-grade exactness in every frame' 
    },
    { 
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="3"/>
          <line x1="12" y1="2" x2="12" y2="6"/>
          <line x1="12" y1="18" x2="12" y2="22"/>
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
          <line x1="2" y1="12" x2="6" y2="12"/>
          <line x1="18" y1="12" x2="22" y2="12"/>
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
        </svg>
      ),
      title: 'Timeless Design', 
      description: 'Classic silhouettes that transcend trends' 
    },
    { 
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      ),
      title: 'Art Gallery Standard', 
      description: 'Museum-quality UV protection and preservation' 
    },
    { 
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
      ),
      title: 'Award-Winning', 
      description: 'Multiple international design awards recipient' 
    }
  ];

  const genderCollections = [
    {
      name: 'Men',
      description: 'Bold, architectural frames designed for masculine spaces',
      image: '/men.jpeg',
      count: '89 Collections',
      accent: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      features: ['Architectural', 'Industrial', 'Minimalist']
    },
    {
      name: 'Women',
      description: 'Elegant, sculptural frames for feminine aesthetics',
      image: '/women.jpeg',
      count: '112 Collections',
      accent: 'bg-gradient-to-br from-rose-500 to-pink-500',
      features: ['Sculptural', 'Organic', 'Ornate']
    },
    {
      name: 'Kids',
      description: 'Timeless designs that transcend traditional boundaries',
      image: '/kids.jpeg',
      count: '67 Collections',
      accent: 'bg-gradient-to-br from-emerald-500 to-teal-500',
      features: ['Timeless', 'Universal', 'Balanced']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/10 to-white overflow-x-hidden pt-20 lg:pt-24">
      {/* Enhanced Gallery Section */}
      <section className="py-10 lg:py-1 px-6 lg:px-8 mt-13 lg:mt-13">
        <div className="max-w-7xl mx-auto">
          {/* Header with Animation */}
         

          {/* Enhanced Gallery Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-2">
            {[
              { img: '/top1.jpeg', title: 'Crystal Frame Collection', tag: 'NEW', gradient: 'from-blue-500/20 to-cyan-500/20' },
              { img: '/top2.jpeg', title: 'Shadow Line Frames', tag: 'LIMITED', gradient: 'from-purple-500/20 to-pink-500/20' },
              { img: '/s5.jpg', title: 'Artisanal Wood Collection', tag: 'VINTAGE', gradient: 'from-amber-500/20 to-orange-500/20' }
            ].map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl transform transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Main Container */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10`}></div>
                  
                  {/* Image with Zoom Effect */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transform transition-transform duration-1000 group-hover:scale-110"
                    style={{ backgroundImage: `url(${item.img})` }}
                  ></div>
                  
                  {/* Top Tag */}
                  <div className="absolute top-6 left-6 z-20 transform -translate-x-10 group-hover:translate-x-0 transition-transform duration-500 delay-200">
                    <span className="px-5 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-medium tracking-wider rounded-full border border-white/30">
                      {item.tag}
                    </span>
                  </div>
                  
                  {/* Bottom Content with Slide Up */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8">
                      <h3 className="text-2xl font-light text-white mb-2">{item.title}</h3>
                      <div className="flex items-center gap-2 text-white/80">
                        <span className="text-sm">Explore Collection</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Border Glow */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-white/0 group-hover:border-white/20 transition-all duration-500 pointer-events-none"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </section>

      {/* Enhanced Shop By Gender Section */}
      <section className="py-16 lg:py-24 px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50/20">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-4 mb-6">
              <Sparkles className="text-yellow-500 animate-pulse" size={20} />
              <span className="text-sm tracking-[0.3em] text-gray-600 font-medium">COLLECTIONS</span>
              <Sparkles className="text-yellow-500 animate-pulse" size={20} />
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-light tracking-tight mb-8">
              <span className="block text-gray-900">Curated For</span>
              <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                Every Style
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover collections crafted for different aesthetics and lifestyles
            </p>
          </div>

          {/* Enhanced Gender Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-20 lg:mb-32">
            {genderCollections.map((collection, index) => (
              <div
                key={collection.name}
                className="group relative transform transition-all duration-500 hover:-translate-y-2"
              >
                {/* Main Card */}
                <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500">
                  {/* Image Section */}
                  <div className="relative aspect-[9/9] overflow-hidden rounded-b-[3rem]">
                    {/* Image with Parallax Effect */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                      style={{ backgroundImage: `url(${collection.image})` }}
                    ></div>
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                    
                    {/* Floating Title */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <h3 className="text-4xl font-bold tracking-tight mb-2">{collection.name}</h3>
                      <p className="text-sm opacity-90">{collection.description}</p>
                    </div>
                    
                    {/* Corner Accent */}
                    <div className={`absolute top-0 right-0 w-32 h-32 ${collection.accent} transform translate-x-16 -translate-y-16 rotate-45`}></div>
                  </div>

                  {/* Info Section */}
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center justify-between">
                      {/* Collection Count */}
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${collection.accent.split(' ')[0]}`}></div>
                        <span className="text-sm text-gray-600">{collection.count}</span>
                      </div>
                      
                      {/* Arrow Button */}
                      <Link 
                        href={`/collections/${collection.name.toLowerCase()}`}
                        className="group/btn w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-black transition-all duration-300"
                      >
                        <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>
                    
                    {/* Features Tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {collection.features.map((feature, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Border Glow */}
                  <div className="absolute inset-0 rounded-3xl border border-gray-100 group-hover:border-gray-200 transition-all duration-500 pointer-events-none"></div>
                </div>

                {/* Floating Decorative Elements */}
                <div className={`absolute -top-3 -right-3 w-24 h-24 rounded-full ${collection.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>
                <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
              </div>
            ))}
          </div>
           <div className="text-center mb-16 lg:mb-24">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <span className="text-sm tracking-[0.3em] text-gray-600 font-medium">LEGACY</span>
              <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-light mb-8">
              <span className="block text-gray-900">Art</span>
              <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                In your eyes
              </span>
            </h2>
          </div>

          {/* Enhanced Divider */}
         <div className="relative py-16 lg:py-24 px-6 lg:px-8 overflow-hidden mb-16 lg:mb-20 rounded-3xl shadow-2xl">
  {/* Clean Background */}
  <div className="absolute inset-0">
    <div 
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url('/divimg.webp')" }}
    ></div>
    <div className="absolute inset-0 bg-black/30"></div>
  </div>
  
  {/* Centered Content */}
  <div className="relative z-10 max-w-2xl mx-auto text-center">
    <h3 className="text-2xl lg:text-3xl font-medium text-white mb-4">
      Elevating Spaces Since 1998
    </h3>
    
    <p className="text-gray-100 mb-6">
      Art, design, and emotion in perfect harmony.
    </p>
    
    {/* Simple Divider */}
    <div className="w-20 h-0.5 bg-white/40 mx-auto"></div>
  </div>
</div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 lg:py-3 px-6 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 lg:mb-24">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <span className="text-sm tracking-[0.3em] text-gray-600 font-medium">NEW ARRIVALS</span>
              <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            </div>
            <h2 className="text-4xl lg:text-6xl font-light tracking-tight mb-8">
              <span className="block text-gray-900">Featured</span>
              <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                Products
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover our handpicked selection of premium eyewear
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {loadingProducts ? (
              // Loading skeleton
              [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-2xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product._id}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500">
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <ShoppingBag size={32} className="text-gray-400" />
                        </div>
                      )}

                      {/* Tag Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full">
                          New
                        </span>
                      </div>

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          // Add to favorites logic
                        }}
                        className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all duration-300 group-hover:scale-110"
                      >
                        <Heart size={18} className={favorites.includes(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-700'} />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 lg:p-6">
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">(12)</span>
                      </div>

                      {/* Price and Button */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-lg lg:text-xl font-bold text-gray-900">
                          ${product.price?.toFixed(2) || '0.00'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            // Add to cart logic
                          }}
                          className="p-2 rounded-lg bg-gray-900 text-white hover:bg-black transition-all duration-300 group-hover:scale-110"
                        >
                          <ShoppingBag size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No products available</p>
              </div>
            )}
          </div>

          {/* View All Button */}
          <div className="mt-16 lg:mt-20 text-center">
            <Link
              href="/collections/men"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-gray-900/20 transition-all duration-300 transform hover:scale-105"
            >
              View Products
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-2 lg:py-19 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 lg:mb-24">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <span className="text-sm tracking-[0.3em] text-gray-600 font-medium">CRAFTSMANSHIP</span>
              <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-light mb-8">
              <span className="block text-gray-900">Premium Quality</span>
              <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                In Every Detail
              </span>
            </h2>
          </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  {features.map((feature, index) => (
    <div 
      key={index} 
      className="group relative p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:via-blue-50/30 group-hover:to-purple-50/20 transition-all duration-700"></div>
      
      {/* Icon with Background */}
      <div className="mb-6 relative z-10">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm">
          <div className="text-3xl text-gray-700">
            {feature.icon}
          </div>
        </div>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-xl font-medium mb-3 text-gray-900">{feature.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
      </div>
      
      {/* Enhanced Hover Line with Animation */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
        {/* Base line */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500 to-purple-500 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-purple-400/40 to-pink-400/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 bg-gradient-to-br from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute top-0 right-0 w-2 h-2 bg-gradient-to-br from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150"></div>
    </div>
  ))}
</div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-20 lg:py-32 px-6 lg:px-8 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 lg:mb-24">
            <div className="inline-flex items-center gap-4 mb-6">
              <Star className="text-yellow-500" size={20} />
              <span className="text-sm tracking-[0.3em] text-gray-600 font-medium">TESTIMONIALS</span>
              <Star className="text-yellow-500" size={20} />
            </div>
            <h2 className="text-4xl lg:text-5xl font-light mb-8">
              <span className="block text-gray-900">Trusted by</span>
              <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                Leading Institutions
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Chen', role: 'Chief Curator, MoMA', content: 'The attention to detail and quality of materials is unparalleled.' },
              { name: 'Michael Rodriguez', role: 'Interior Designer', content: 'Each frame transforms spaces into living art galleries.' },
              { name: 'Emma Thompson', role: 'Architect', content: 'The perfect blend of form, function, and artistic expression.' }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="group relative p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="text-4xl text-gray-300 mb-6">"</div>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {testimonial.content}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div >
      </section >

      {/* Enhanced CTA Section */}
      <section className="py-12 lg:py-13 px-6 lg:px-8 ">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-4 mb-6">
            <Sparkles className="text-yellow-500 animate-pulse" size={24} />
          </div>
          <h2 className="text-4xl lg:text-5xl font-light mb-8">
            <span className="block text-gray-900">Begin Your</span>
            <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
              Collection Today
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
            Experience the perfect blend of art and craftsmanship. Book a private viewing with our experts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/book-consultation"
              className="group relative px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="font-medium">Book Consultation</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </Link>
            <Link 
              href="/collections"
              className="px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-500 font-medium"
            >
              Browse Collections
            </Link>
          </div>
        </div>
      </section>
       <Newsletter />

           

     
    </div>
  )
}