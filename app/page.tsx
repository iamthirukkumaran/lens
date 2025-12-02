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
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/10 to-white overflow-x-hidden">
      {/* Enhanced Navigation with Parallax */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100/50 shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 lg:py-5">
          <div className="flex items-center justify-between">
            {/* Logo with Animation */}
            <Link href="/" className="relative group">
              <Image 
                src="/logo.svg" 
                alt="Hub of Frames Logo" 
                width={120} 
                height={40}
                className="w-40 h-14 transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-500"></div>
            </Link>

            {/* Actions with Hover Effects */}
            <div className="flex items-center gap-4 lg:gap-6">
              <Link href="/search" className="p-2 hover:bg-gray-100/50 rounded-full transition-all duration-300 group relative">
                <Search size={20} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
                <div className="absolute inset-0 rounded-full border border-transparent group-hover:border-blue-100 transition-all duration-300"></div>
              </Link>
              
              <Link href="/favorites" className="p-2 hover:bg-gray-100/50 rounded-full transition-all duration-300 group relative">
                <Heart size={20} className="text-gray-600 group-hover:text-red-500 transition-colors" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse font-bold">
                    {favorites.length > 9 ? '9+' : favorites.length}
                  </span>
                )}
              </Link>
              
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2 hover:bg-gray-100/50 rounded-full transition-all duration-300 group relative"
              >
                <ShoppingBag size={20} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-gray-900 to-gray-700 text-white text-xs rounded-full flex items-center justify-center animate-bounce font-bold">
                    {cartItems.length > 9 ? '9+' : cartItems.length}
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="p-2 hover:bg-gray-100/50 rounded-full transition-all duration-300 group relative"
              >
                <Menu size={24} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Menu with Animations */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          {/* Animated Backdrop */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-white/5 backdrop-blur-xl transition-all duration-500"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel with Slide-in Animation */}
          <div className="absolute inset-y-0 right-0 w-full max-w-md bg-gradient-to-b from-white via-gray-50/95 to-white shadow-2xl transform transition-all duration-500 ease-out">
            <div className="h-full flex flex-col overflow-y-auto">
              {/* Header */}
              <div className="p-6 lg:p-8 border-b border-gray-100/50">
                <div className="flex items-center justify-between">
                  <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 group">
                    <Image src="/logo.svg" alt="Logo" width={40} height={40} className="w-10 h-10 transition-transform group-hover:scale-110" />
                    <span className="text-xl font-light tracking-tight">Hub of <span className="font-semibold">Frames</span></span>
                  </Link>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
                  >
                    <CloseIcon size={24} className="text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              </div>

              {/* User Info */}
              <div className="p-6 lg:p-8">
                {user ? (
                  <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100/50 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-600 truncate">{user.email}</p>
                        <div className="mt-1">
                          <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 text-xs rounded-full">
                            {user.role === 'admin' ? 'Admin' : 'Customer'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 grid grid-cols-2 gap-3">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-center font-medium">
                      Login
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-300 text-center font-medium">
                      Register
                    </Link>
                  </div>
                )}

               

                {/* Main Menu Items */}
                <div className="space-y-2 mb-8">
                  <Link href="/collections/men" onClick={() => setIsMenuOpen(false)} className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all duration-300">
                    <div className="flex items-center gap-3">
                     
                      <span className="font-medium">Men's Collection</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                  
                  <Link href="/collections/women" onClick={() => setIsMenuOpen(false)} className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all duration-300">
                    <div className="flex items-center gap-3">
                     
                      <span className="font-medium">Women's Collection</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                  
                  <Link href="/collections/kids" onClick={() => setIsMenuOpen(false)} className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      
                      <span className="font-medium">Kids Collection</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>

                {/* Account Links */}
                {user && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">My Account</h3>
                    <div className="space-y-2">
                      <Link href="/favorites" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300">
                        <Heart size={18} className="text-red-400" />
                        <span>My Favorites</span>
                      </Link>
                      <Link href="/orders" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300">
                        <Truck size={18} className="text-blue-400" />
                        <span>My Orders</span>
                      </Link>
                      <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300">
                        <User size={18} className="text-purple-400" />
                        <span>Profile Settings</span>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Admin Panel */}
                {user?.role === 'admin' && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Admin Panel</h3>
                    <div className="space-y-2">
                      <Link href="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300">
                        <LayoutDashboard size={18} className="text-red-400" />
                        <span>Admin Dashboard</span>
                      </Link>
                      
                      
                    </div>
                  </div>
                )}

                {/* Logout Button */}
                {user && (
                  <button
                    onClick={handleLogout}
                    className="w-full mt-4 p-3 bg-gradient-to-r from-red-50 to-red-100 text-red-600 rounded-lg hover:from-red-100 hover:to-red-200 transition-all duration-300 font-medium flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Gallery Section */}
      <section className="py-24 lg:py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Animation */}
         

          {/* Enhanced Gallery Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-2">
            {[
              { img: '/top1.jpeg', title: 'Crystal Frame Collection', tag: 'NEW', gradient: 'from-blue-500/20 to-cyan-500/20' },
              { img: '/top2.jpeg', title: 'Shadow Line Frames', tag: 'LIMITED', gradient: 'from-purple-500/20 to-pink-500/20' },
              { img: '/top3.jpg', title: 'Artisanal Wood Collection', tag: 'VINTAGE', gradient: 'from-amber-500/20 to-orange-500/20' }
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
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-medium tracking-wider rounded-full border border-white/30">
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

      {/* Enhanced Features Section */}
      <section className="py-20 lg:py-32 px-6 lg:px-8">
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
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Icon with Background */}
                <div className="mb-6 relative">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <div className="text-3xl text-gray-700">
                      {feature.icon}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-medium mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                
                {/* Hover Line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
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
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 lg:py-32 px-6 lg:px-8">
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

            <footer className="py-12 lg:py-13 px-6 lg:px-8 border-t border-gray-100 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            <div>
              <Link href="/" className="inline-block mb-4">
                <Image 
                  src="/logo.svg" 
                  alt="Logo" 
                  width={120} 
                  height={40}
                  className="w-32 h-11"
                />
              </Link>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Redefining the relationship between art and space since 1998.
              </p>
              <div className="flex items-center gap-4">
                <Link href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="text-xs font-medium text-white">Fb</span>
                </Link>
                <Link href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="text-xs font-medium text-white">Ig</span>
                </Link>
                <Link href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="text-xs font-medium text-white">In</span>
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-4">Collections</h3>
              <ul className="space-y-3">
                {['Gallery Series', 'Modern Frames', 'Vintage Collection', 'Minimalist', 'Custom Orders'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-4">Company</h3>
              <ul className="space-y-3">
                {['About Us', 'Our Story', 'Studio Locations', 'Careers', 'Press'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-4">Support</h3>
              <ul className="space-y-3">
                {['Contact Us', 'Shipping & Returns', 'FAQ', 'Size Guide', 'Order Tracking'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-400">
                © 2024 Hub of Frames. All rights reserved.
              </div>
              <div className="flex items-center gap-6">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                  <Link key={item} href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Enhanced Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop with Animation */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Cart Panel with Slide-in */}
          <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white animate-in slide-in-from-right duration-500 ease-out">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={24} className="text-gray-700" />
                    <div className="text-xl font-medium">Your Bag</div>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cartItems.length > 0 ? (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item._id} className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                        <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">{item.name}</div>
                          <div className="text-sm text-gray-500 mb-3">Rs. {item.price.toFixed(2)}</div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => handleDecreaseQuantity(item._id)}
                                className="w-8 h-8 rounded-full border border-gray-200 hover:border-gray-300 flex items-center justify-center transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-sm font-medium">{item.quantity}</span>
                              <button 
                                onClick={() => handleIncreaseQuantity(item._id)}
                                className="w-8 h-8 rounded-full border border-gray-200 hover:border-gray-300 flex items-center justify-center transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <button 
                              onClick={() => handleRemoveFromCart(item._id)}
                              className="text-sm text-red-500 hover:text-red-600 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <ShoppingBag size={64} className="text-gray-300 mb-4" />
                    <div className="text-gray-500 mb-2">Your bag is empty</div>
                    <p className="text-sm text-gray-400 mb-6">Add items to get started</p>
                    <Link 
                      href="/collections/men"
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Browse Collections
                    </Link>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>Rs. {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={cartItems.length === 0}
                >
                  {cartItems.length === 0 ? 'Bag is Empty' : 'Proceed to Checkout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Floating Cart Button - Always Visible */}
      {!isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 group"
        >
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} />
              <div className="text-left">
                <div className="text-xs font-medium opacity-90">CART</div>
                <div className="text-xs opacity-75">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</div>
              </div>
            </div>
            {cartItems.length > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-bounce font-bold">
                <span className="text-xs">{cartItems.length > 9 ? '9+' : cartItems.length}</span>
              </div>
            )}
          </div>
        </button>
      )}

     
    </div>
  )
}