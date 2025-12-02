'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Edit2, Save, X, Plus, Trash2, Check } from 'lucide-react';

interface Address {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const [addressFormData, setAddressFormData] = useState<Address>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    isDefault: false,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    // Load saved profile and addresses from localStorage
    const savedProfile = localStorage.getItem(`profile_${userData.id}`);
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setFormData({
        fullName: profile.fullName || userData.name,
        email: profile.email || userData.email,
        phone: profile.phone || '',
      });
      if (profile.addresses) {
        setAddresses(profile.addresses);
      }
    } else {
      setFormData({
        fullName: userData.name,
        email: userData.email,
        phone: '',
      });
    }

    setLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setAddressFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setAddressFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    if (user) {
      localStorage.setItem(
        `profile_${user.id}`,
        JSON.stringify({
          ...formData,
          addresses,
        })
      );
      setIsEditing(false);
    }
  };

  const handleAddNewAddress = () => {
    setEditingAddressIndex(null);
    setAddressFormData({
      fullName: formData.fullName,
      phone: formData.phone,
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      isDefault: addresses.length === 0,
    });
    setIsAddingAddress(true);
  };

  const handleEditAddress = (index: number) => {
    setEditingAddressIndex(index);
    setAddressFormData(addresses[index]);
    setIsAddingAddress(true);
  };

  const handleSaveAddress = () => {
    if (!addressFormData.address || !addressFormData.city || !addressFormData.state || !addressFormData.zipCode) {
      alert('Please fill in all address fields');
      return;
    }

    let updatedAddresses = [...addresses];

    if (addressFormData.isDefault) {
      updatedAddresses = updatedAddresses.map((addr) => ({ ...addr, isDefault: false }));
    }

    if (editingAddressIndex !== null) {
      updatedAddresses[editingAddressIndex] = addressFormData;
    } else {
      updatedAddresses.push(addressFormData);
    }

    setAddresses(updatedAddresses);

    // Save to localStorage
    if (user) {
      localStorage.setItem(
        `profile_${user.id}`,
        JSON.stringify({
          ...formData,
          addresses: updatedAddresses,
        })
      );
    }

    setIsAddingAddress(false);
    setEditingAddressIndex(null);
  };

  const handleDeleteAddress = (index: number) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);

    // Save to localStorage
    if (user) {
      localStorage.setItem(
        `profile_${user.id}`,
        JSON.stringify({
          ...formData,
          addresses: updatedAddresses,
        })
      );
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-gray-50/20 to-white">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft size={20} className="text-gray-600" />
            <span className="text-gray-600 hover:text-gray-900">Back</span>
          </Link>
          <h1 className="text-xl font-light">My Profile</h1>
          <div className="w-16"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Info Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-light">Account Information</h2>
            {!isEditing && !isAddingAddress && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 size={18} />
                Edit
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-widest mb-2">
                  Name
                </p>
                <p className="text-lg text-gray-900">{user.name}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-widest mb-2">
                  Email
                </p>
                <p className="text-lg text-gray-900">{user.email}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-widest mb-2">
                  Role
                </p>
                <p className="text-lg text-gray-900 capitalize">{user.role}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-light"
                >
                  <Save size={18} />
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-colors font-light"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Addresses Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-light">Saved Addresses</h2>
            {!isAddingAddress && (
              <button
                onClick={handleAddNewAddress}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Plus size={18} />
                Add New Address
              </button>
            )}
          </div>

          {/* Address List */}
          {addresses.length > 0 && !isAddingAddress && (
            <div className="space-y-4 mb-8">
              {addresses.map((address, index) => (
                <div key={index} className="p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-300 bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-gray-900 text-lg">{address.fullName}</p>
                        {address.isDefault && (
                          <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                            <Check size={12} />
                            Default Address
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-1">{address.address}</p>
                      <p className="text-gray-700 mb-1">
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p className="text-gray-600 mb-2">{address.country}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        📱 {address.phone}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditAddress(index)}
                        title="Edit address"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hover:scale-110"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this address?')) {
                            handleDeleteAddress(index);
                          }
                        }}
                        title="Delete address"
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors hover:scale-110"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add/Edit Address Form */}
          {isAddingAddress && (
            <div className="space-y-6 p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl border-2 border-blue-200">
              <h3 className="text-2xl font-light text-gray-900 mb-6">
                {editingAddressIndex !== null ? '✏️ Edit Address' : '➕ Add New Address'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={addressFormData.fullName}
                    onChange={handleAddressChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={addressFormData.phone}
                    onChange={handleAddressChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={addressFormData.address}
                  onChange={handleAddressChange}
                  placeholder="123 Main Street, Apt 4B"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={addressFormData.city}
                    onChange={handleAddressChange}
                    placeholder="New York"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={addressFormData.state}
                    onChange={handleAddressChange}
                    placeholder="NY"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={addressFormData.zipCode}
                    onChange={handleAddressChange}
                    placeholder="10001"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Country
                  </label>
                  <select
                    name="country"
                    value={addressFormData.country}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>India</option>
                    <option>Australia</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white p-4 rounded-lg border-2 border-gray-300 hover:border-green-300 transition-all">
                <input
                  type="checkbox"
                  name="isDefault"
                  id="isDefault"
                  checked={addressFormData.isDefault}
                  onChange={handleAddressChange}
                  className="w-4 h-4 border-2 border-gray-200 rounded cursor-pointer"
                />
                <label htmlFor="isDefault" className="text-sm font-semibold text-gray-900 cursor-pointer">
                  Set as default address
                </label>
              </div>

              <div className="flex gap-4 pt-6 border-t-2 border-gray-300">
                <button
                  onClick={handleSaveAddress}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold shadow-md hover:shadow-lg hover:scale-105"
                >
                  <Save size={18} />
                  {editingAddressIndex !== null ? 'Update Address' : 'Save Address'}
                </button>
                <button
                  onClick={() => {
                    setIsAddingAddress(false);
                    setEditingAddressIndex(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-all font-semibold"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {addresses.length === 0 && !isAddingAddress && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📍</div>
              <p className="mb-6 text-lg">No addresses saved yet</p>
              <button
                onClick={handleAddNewAddress}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md hover:shadow-lg"
              >
                Add Your First Address
              </button>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/orders"
            className="p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow text-center"
          >
            <p className="text-2xl mb-2">📦</p>
            <p className="font-semibold text-gray-900">My Orders</p>
          </Link>
          <Link
            href="/collections/men"
            className="p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow text-center"
          >
            <p className="text-2xl mb-2">🛍️</p>
            <p className="font-semibold text-gray-900">Continue Shopping</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
