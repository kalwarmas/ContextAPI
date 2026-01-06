
export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
}

export interface Product {
  id: number;
  name: string;
  year: number;
  color: string;
  pantone_value: string;
}

export interface ApiResponse<T> {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: T;
}

export type Theme = 'light' | 'dark';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ApiState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

export type Screen = 'LOGIN' | 'PRODUCT_LIST' | 'PRODUCT_DETAILS';
