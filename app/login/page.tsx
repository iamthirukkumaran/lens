'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    // Check if already has valid session
    const checkSession = async () => {
      const user = localStorage.getItem('user');
      if (user) {
        const parsed = JSON.parse(user);
        router.push('/');
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Reset validation errors
    setValidationErrors({});

    // Validation
    const errors: {[key: string]: string} = {};

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    }

    // If there are validation errors, don't submit
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      setSuccess('Login successful! Redirecting...');

      // Store user data in localStorage
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        })
      );

      // Redirect to home
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.svg"
              alt="Hub of Frames"
              width={60}
              height={60}
              className="w-16 h-16"
            />
          </div>
          <h1 className="text-4xl font-light tracking-tight mb-2">
            Hub of <span className="font-semibold">Frames</span>
          </h1>
          <p className="text-gray-600 text-sm">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-soft p-8 border border-gray-100">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    validationErrors.email
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-200 focus:border-gray-900'
                  }`}
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    validationErrors.password
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-200 focus:border-gray-900'
                  }`}
                />
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-light tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>

       
      </div>
    </div>
  );
}
