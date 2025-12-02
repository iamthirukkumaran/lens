import { ApiResponse, Product, CartItem } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit,
  userToken?: string
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options?.headers && typeof options.headers === 'object') {
    Object.assign(headers, options.headers);
  }

  if (userToken) {
    headers['x-user-id'] = userToken;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Product API functions
export const productAPI = {
  getAll: async (filters?: {
    gender?: string;
    brand?: string[];
    material?: string[];
    size?: string[];
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();

    if (filters?.gender) params.append('gender', filters.gender);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    if (filters?.brand) {
      filters.brand.forEach((b) => params.append('brand', b));
    }
    if (filters?.material) {
      filters.material.forEach((m) => params.append('material', m));
    }
    if (filters?.size) {
      filters.size.forEach((s) => params.append('size', s));
    }

    return apiCall<Product[]>(`/api/products?${params}`);
  },

  getById: async (id: string) => {
    return apiCall<Product>(`/api/products/${id}`);
  },

  create: async (product: Omit<Product, '_id'>) => {
    return apiCall<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  update: async (id: string, product: Partial<Product>) => {
    return apiCall<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/api/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Cart API functions
export const cartAPI = {
  getCart: async (userToken: string) => {
    return apiCall<CartItem[]>('/api/cart', undefined, userToken);
  },

  addToCart: async (
    userToken: string,
    item: {
      productId: string;
      quantity: number;
      selectedSize?: string;
      selectedColor?: string;
      selectedLens?: string;
    }
  ) => {
    return apiCall(
      '/api/cart',
      {
        method: 'POST',
        body: JSON.stringify(item),
      },
      userToken
    );
  },

  updateCart: async (
    userToken: string,
    productId: string,
    quantity: number
  ) => {
    return apiCall(
      '/api/cart',
      {
        method: 'PUT',
        body: JSON.stringify({ productId, quantity }),
      },
      userToken
    );
  },

  removeFromCart: async (userToken: string, productId: string) => {
    return apiCall(
      '/api/cart',
      {
        method: 'DELETE',
        body: JSON.stringify({ productId }),
      },
      userToken
    );
  },
};

// Favorites API functions
export const favoritesAPI = {
  getFavorites: async (userToken: string) => {
    return apiCall<Product[]>('/api/favorites', undefined, userToken);
  },

  addToFavorites: async (userToken: string, productId: string) => {
    return apiCall(
      '/api/favorites',
      {
        method: 'POST',
        body: JSON.stringify({ productId }),
      },
      userToken
    );
  },

  removeFromFavorites: async (userToken: string, productId: string) => {
    return apiCall(
      '/api/favorites',
      {
        method: 'DELETE',
        body: JSON.stringify({ productId }),
      },
      userToken
    );
  },
};
