
import { ApiResponse, Product, User } from '../types';

const BASE_URL = 'https://reqres.in/api';

export const apiService = {
  login: async (email: string, password: string): Promise<{ token: string }> => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    return response.json();
  },

  getProducts: async (page: number = 1): Promise<ApiResponse<Product[]>> => {
    const response = await fetch(`${BASE_URL}/unknown?page=${page}&per_page=6`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  getProductById: async (id: number): Promise<{ data: Product }> => {
    const response = await fetch(`${BASE_URL}/unknown/${id}`);
    if (!response.ok) throw new Error('Product not found');
    return response.json();
  },

  getUserProfile: async (): Promise<{ data: User }> => {
    // Reqres doesn't have a "me" endpoint, so we simulate fetching user 2 (common demo user)
    const response = await fetch(`${BASE_URL}/users/2`);
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return response.json();
  }
};
