'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">◊</span>
              </div>
              <h3 className="text-white font-bold text-lg">Hub of Frames</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Discover premium eyewear collections crafted with luxury and precision.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-white font-semibold mb-4">Collections</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/collections/men" className="hover:text-white transition">
                  Men's Frames
                </Link>
              </li>
              <li>
                <Link href="/collections/women" className="hover:text-white transition">
                  Women's Frames
                </Link>
              </li>
              <li>
                <Link href="/collections/kids" className="hover:text-white transition">
                  Kids' Frames
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  All Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            &copy; 2024 Hub of Frames. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition">
              Privacy
            </Link>
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition">
              Terms
            </Link>
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
