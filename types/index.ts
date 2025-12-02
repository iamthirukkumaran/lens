// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  modelNumber: string;
  price: number;
  mrp: number;
  discount: number;
  gender: 'men' | 'women' | 'kids';
  brand: string;
  material: string;
  sizes: string[];
  colors: Array<{ name: string; hex: string }>;
  images: string[];
  description?: string;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}

// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  favorites: string[];
  cart: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

// Cart Types
export interface CartItem {
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedLens?: string;
  product?: Product; // Populated by API
}

// Order Types
export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedLens?: string;
}

// Filter Types
export interface ProductFilters {
  gender?: string;
  brands?: string[];
  sizes?: string[];
  materials?: string[];
  page?: number;
  limit?: number;
}
