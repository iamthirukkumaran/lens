"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Load user and cart/favorites from localStorage
  useEffect(() => {
    const loadUserData = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);

          const userFavoritesKey = `favorites_${userData.id}`;
          const storedFavorites = localStorage.getItem(userFavoritesKey);
          if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
          }
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }

      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (e) {
          setCartItems([]);
        }
      }
    };

    loadUserData();

    // Listen for storage changes (logout/login from other tabs or same tab)
    const handleStorageChange = () => {
      loadUserData();
    };
    window.addEventListener("storage", handleStorageChange);

    // Listen for custom user-auth-changed event
    window.addEventListener("user-auth-changed", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("user-auth-changed", handleStorageChange);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setCartItems([]);
    setFavorites([]);
    setIsMenuOpen(false);
    setIsDropdownOpen(false);

    // Dispatch storage event to update other components/tabs
    window.dispatchEvent(new Event("storage"));

    router.push("/");
  };

  const handleCollectionClick = (collection) => {
    setIsDropdownOpen(false);
    router.push(`/collections/${collection.toLowerCase()}`);
  };

  const collections = [
    { name: "Men", key: "men" },
    { name: "Women", key: "women" },
    { name: "Kids", key: "kids" },
  ];

  return (
    <>
      {/* Header Navigation */}
      <header className="fixed top-0 w-full z-[9999] bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Hub of Frames"
                width={100}
                height={32}
                className="h-8 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
<nav className="hidden md:flex items-center gap-8">
  <Link
    href="/"
    className="text-gray-700 hover:text-gray-900 font-medium transition"
  >
    Home
  </Link>

  {/* Collections Dropdown */}
  <div className="relative" ref={dropdownRef}>
    <button
      type="button"
      onMouseEnter={() => setIsDropdownOpen(true)}
      className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium transition"
    >
      Collections
      <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
    </button>

    {isDropdownOpen && (
      <div 
        className="absolute top-full left-0 mt-3 w-48 bg-gray-900  shadow-lg border border-gray-900 py-2 z-50 "
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        {collections.map((collection) => (
          <button
            key={collection.key}
            type="button"
            onClick={() => handleCollectionClick(collection.key)}
            className="w-full text-left px-4 py-2.5  text-gray-100 hover:text-gray-900 hover:bg-gray-100  transition text-sm"
          >
            {collection.name}
          </button>
        ))}
      </div>
    )}
  </div>
</nav>
            {/* Right Side Icons */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Search - Hidden on small screens */}
              <Link
                href="/search"
                className="hidden sm:flex text-gray-700 hover:text-gray-900 transition"
              >
                <Search size={20} />
              </Link>

              {/* Favorites - Only show if logged in, hidden on small screens */}
              {user && (
                <Link
                  href="/favorites"
                  className="hidden sm:flex relative text-gray-700 hover:text-red-500 transition"
                >
                  <Heart size={20} />
                  {favorites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {favorites.length > 9 ? "9+" : favorites.length}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart - Only show if logged in, hidden on small screens */}
              {user && (
                <Link
                  href="/checkout"
                  className="hidden sm:flex relative text-gray-700 hover:text-gray-900 transition"
                >
                  <ShoppingBag size={20} />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.length > 9 ? "9+" : cartItems.length}
                    </span>
                  )}
                </Link>
              )}

              {/* User Auth - Hidden on small screens */}
              {!user ? (
                <Link
                  href="/login"
                  className="hidden sm:block px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                >
                  Login
                </Link>
              ) : (
                <div
                  className="hidden sm:block relative"
                  ref={profileDropdownRef}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:shadow-lg transition"
                    title="Profile"
                  >
                    <User size={20} />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <button
                        type="button"
                        onClick={() => {
                          router.push("/profile");
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                      >
                        My Profile
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          router.push("/orders");
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                      >
                        My Orders
                      </button>

                      {user?.role === "admin" && (
                        <Link
                          href="/admin/dashboard"
                          className="block py-3 px-4 text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium flex items-center gap-2 bg-blue-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <LayoutDashboard size={18} /> Admin Dashboard
                        </Link>
                      )}

                      {/* Logout Button */}
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleLogout();
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button - Always visible on smaller screens */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slider Menu - Full Screen */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Slide-in Menu from Right */}
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl transform transition-all duration-500 ease-out md:hidden">
            <div className="h-full flex flex-col overflow-y-auto">
              {/* Menu Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X size={24} className="text-gray-700" />
                </button>
              </div>

              {/* User Info */}
              {user && (
                <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Items */}
              <div className="flex-1 px-6 py-6 space-y-4">
                {/* Home */}
                <Link
                  href="/"
                  className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>

                {/* Collections */}
                <div>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium flex items-center justify-between"
                  >
                    Collections
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isDropdownOpen && (
                    <div className="mt-2 ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
                      {collections.map((collection) => (
                        <button
                          key={collection.key}
                          type="button"
                          onClick={() => {
                            handleCollectionClick(collection.key);
                            setIsMenuOpen(false);
                            setIsDropdownOpen(false);
                          }}
                          className="block w-full text-left py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded px-2 transition"
                        >
                          {collection.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Favorites - Only if logged in */}
                {user && (
                  <Link
                    href="/favorites"
                    className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart size={18} /> Favorites
                  </Link>
                )}

                {/* Orders - Only if logged in */}
                {user && (
                  <Link
                    href="/orders"
                    className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingBag size={18} /> Orders
                  </Link>
                )}

                {/* Profile - Only if logged in */}
                {user && (
                  <Link
                    href="/profile"
                    className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                )}

                {/* Admin Dashboard - Only if user is admin */}
                {user?.role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    className="block py-3 px-4 text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium flex items-center gap-2 bg-blue-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard size={18} /> Admin Dashboard
                  </Link>
                )}
              </div>

              {/* Footer Section */}
              <div className="border-t border-gray-200 p-6 space-y-3">
                {!user ? (
                  <>
                    <Link
                      href="/login"
                      className="block w-full py-3 px-4 text-center bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block w-full py-3 px-4 text-center border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-3 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add padding to account for fixed header */}
      <div className="h-20" />
    </>
  );
}
