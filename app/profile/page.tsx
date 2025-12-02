'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Edit2, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Check, 
  Package, 
  ShoppingBag, 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Shield,
  Settings,
  LogOut
} from 'lucide-react';

interface Address {
  id: string;
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
  const [activeTab, setActiveTab] = useState('profile');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    avatar: '/default-avatar.png',
  });

  const [addressFormData, setAddressFormData] = useState<Address>({
    id: '',
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
        avatar: profile.avatar || '/default-avatar.png',
      });
      if (profile.addresses) {
        setAddresses(profile.addresses);
      }
    } else {
      setFormData({
        fullName: userData.name,
        email: userData.email,
        phone: '',
        avatar: '/default-avatar.png',
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
      id: Date.now().toString(),
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
    setActiveTab('addresses');
  };

  const handleEditAddress = (index: number) => {
    setEditingAddressIndex(index);
    setAddressFormData(addresses[index]);
    setIsAddingAddress(true);
    setActiveTab('addresses');
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
    if (confirm('Are you sure you want to delete this address?')) {
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
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                  <ArrowLeft size={18} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
                </div>
                <span className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Back to Home</span>
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
            <div className="w-28"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Profile Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 border-4 border-white shadow-lg overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={48} className="text-blue-600" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                    <Edit2 size={16} />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{formData.fullName}</h2>
                <p className="text-gray-600 mb-4">{formData.email}</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full">
                  <Shield size={16} />
                  <span className="text-sm font-medium capitalize">{user.role}</span>
                </div>
              </div>

              {/* Navigation */}
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User size={20} />
                  <span className="font-medium">Profile Information</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'addresses'
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MapPin size={20} />
                  <span className="font-medium">Saved Addresses</span>
                  <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                    {addresses.length}
                  </span>
                </button>
                
                <Link
                  href="/orders"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <Package size={20} />
                  <span className="font-medium">My Orders</span>
                </Link>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'settings'
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Settings size={20} />
                  <span className="font-medium">Account Settings</span>
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full mt-8 flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl border border-red-100 transition-colors font-medium"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Account Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-blue-500/30">
                  <span className="text-blue-100">Member Since</span>
                  <span className="font-medium">2024</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-blue-500/30">
                  <span className="text-blue-100">Addresses</span>
                  <span className="font-medium">{addresses.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Status</span>
                  <span className="font-medium px-3 py-1 bg-blue-500/30 rounded-full text-sm">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-8">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                    <p className="text-gray-600 mt-1">Manage your personal information</p>
                  </div>
                  {!isEditing && !isAddingAddress && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors font-medium shadow-sm hover:shadow"
                    >
                      <Edit2 size={18} />
                      Edit Profile
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <User size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Full Name</h3>
                              <p className="text-lg font-medium text-gray-900 mt-1">{formData.fullName}</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Phone size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Phone Number</h3>
                              <p className="text-lg font-medium text-gray-900 mt-1">
                                {formData.phone || 'Not provided'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Mail size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Email Address</h3>
                              <p className="text-lg font-medium text-gray-900 mt-1">{formData.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Shield size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Account Role</h3>
                              <p className="text-lg font-medium text-gray-900 mt-1 capitalize">{user.role}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                      <button
                        onClick={handleSave}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow"
                      >
                        <Save size={18} />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Saved Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                    <p className="text-gray-600 mt-1">Manage your delivery addresses</p>
                  </div>
                  {!isAddingAddress && (
                    <button
                      onClick={handleAddNewAddress}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors font-medium shadow-sm hover:shadow"
                    >
                      <Plus size={18} />
                      Add New Address
                    </button>
                  )}
                </div>

                {/* Address List */}
                {addresses.length > 0 && !isAddingAddress && (
                  <div className="space-y-6 mb-8">
                    {addresses.map((address, index) => (
                      <div key={index} className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all duration-300 bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                <MapPin size={20} className="text-gray-700" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-gray-900 text-lg">{address.fullName}</p>
                                  {address.isDefault && (
                                    <span className="px-3 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full flex items-center gap-1.5">
                                      <Check size={12} />
                                      Default Address
                                    </span>
                                  )}
                                </div>
                                <div className="mt-4 space-y-3">
                                  <p className="text-gray-700 flex items-center gap-2">
                                    <span className="text-gray-500 w-20">Address:</span>
                                    <span className="font-medium">{address.address}</span>
                                  </p>
                                  <p className="text-gray-700 flex items-center gap-2">
                                    <span className="text-gray-500 w-20">City/State:</span>
                                    <span className="font-medium">{address.city}, {address.state} {address.zipCode}</span>
                                  </p>
                                  <p className="text-gray-700 flex items-center gap-2">
                                    <span className="text-gray-500 w-20">Country:</span>
                                    <span className="font-medium">{address.country}</span>
                                  </p>
                                  <p className="text-gray-700 flex items-center gap-2">
                                    <span className="text-gray-500 w-20">Phone:</span>
                                    <span className="font-medium flex items-center gap-2">
                                      <Phone size={14} />
                                      {address.phone}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <button
                              onClick={() => handleEditAddress(index)}
                              title="Edit address"
                              className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-blue-200 hover:border-blue-300"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(index)}
                              title="Delete address"
                              className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200 hover:border-red-300"
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
                  <div className="space-y-8 p-8 bg-gradient-to-br from-blue-50/50 to-white rounded-2xl border-2 border-blue-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        {editingAddressIndex !== null ? (
                          <Edit2 size={24} className="text-blue-600" />
                        ) : (
                          <Plus size={24} className="text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {editingAddressIndex !== null ? 'Edit Address' : 'Add New Address'}
                        </h3>
                        <p className="text-gray-600 mt-1">Fill in all required fields marked with *</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={addressFormData.fullName}
                          onChange={handleAddressChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={addressFormData.phone}
                          onChange={handleAddressChange}
                          placeholder="+1 (555) 123-4567"
                          className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={addressFormData.address}
                        onChange={handleAddressChange}
                        placeholder="123 Main Street, Apt 4B"
                        className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={addressFormData.city}
                          onChange={handleAddressChange}
                          placeholder="New York"
                          className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={addressFormData.state}
                          onChange={handleAddressChange}
                          placeholder="NY"
                          className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          ZIP Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={addressFormData.zipCode}
                          onChange={handleAddressChange}
                          placeholder="10001"
                          className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Country
                      </label>
                      <select
                        name="country"
                        value={addressFormData.country}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>India</option>
                        <option>Australia</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-300 hover:border-green-300 transition-all">
                      <input
                        type="checkbox"
                        name="isDefault"
                        id="isDefault"
                        checked={addressFormData.isDefault}
                        onChange={handleAddressChange}
                        className="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-blue-200"
                      />
                      <label htmlFor="isDefault" className="text-sm font-semibold text-gray-900 cursor-pointer">
                        Set as default shipping address
                      </label>
                    </div>

                    <div className="flex gap-4 pt-6 border-t-2 border-gray-300">
                      <button
                        onClick={handleSaveAddress}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-semibold shadow-sm hover:shadow"
                      >
                        <Save size={18} />
                        {editingAddressIndex !== null ? 'Update Address' : 'Save Address'}
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingAddress(false);
                          setEditingAddressIndex(null);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-all font-semibold"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {addresses.length === 0 && !isAddingAddress && (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-50 rounded-full mb-6">
                      <MapPin size={40} className="text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No addresses saved yet</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Add your first shipping address to make checkout faster and easier.
                    </p>
                    <button
                      onClick={handleAddNewAddress}
                      className="px-8 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-sm hover:shadow inline-flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Add Your First Address
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Account Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-8 pb-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
                  <p className="text-gray-600 mt-1">Manage your account preferences</p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Change Password</p>
                          <p className="text-sm text-gray-600 mt-1">Update your account password</p>
                        </div>
                        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                          Change
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-600 mt-1">Add an extra layer of security</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          Enable
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <input type="checkbox" className="w-4 h-4 border-2 border-gray-300 rounded" defaultChecked />
                        <span className="font-medium text-gray-900">Email notifications</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <input type="checkbox" className="w-4 h-4 border-2 border-gray-300 rounded" defaultChecked />
                        <span className="font-medium text-gray-900">SMS notifications</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <input type="checkbox" className="w-4 h-4 border-2 border-gray-300 rounded" />
                        <span className="font-medium text-gray-900">Marketing communications</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-6 border-2 border-red-200 rounded-xl bg-red-50/50">
                    <h3 className="text-lg font-semibold text-red-800 mb-4">Danger Zone</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-800">Delete Account</p>
                        <p className="text-sm text-red-600 mt-1">Permanently delete your account and all data</p>
                      </div>
                      <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/orders"
                className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                  <Package size={28} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">My Orders</h3>
                <p className="text-sm text-gray-600">Track and manage your purchases</p>
              </Link>
              
              <Link
                href="/wishlist"
                className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-100 rounded-full mb-4 group-hover:bg-purple-200 transition-colors">
                  <ShoppingBag size={28} className="text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Wishlist</h3>
                <p className="text-sm text-gray-600">View your saved items</p>
              </Link>
              
              <Link
                href="/collections/men"
                className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                  <ShoppingBag size={28} className="text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Shop Now</h3>
                <p className="text-sm text-gray-600">Browse latest collections</p>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Your Store Name. All rights reserved.</p>
            <p className="mt-2">
              <span className="text-gray-400">Profile ID:</span> {user?.id?.slice(0, 8)} • 
              <span className="text-gray-400 ml-2">Last updated:</span> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}