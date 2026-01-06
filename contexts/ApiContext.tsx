
import React, { createContext, useState, useContext, useCallback } from 'react';
import { ApiState, Product } from '../types';
import { apiService } from '../services/api';

interface ApiContextType extends ApiState {
  fetchProducts: (page?: number, refresh?: boolean) => Promise<void>;
  searchProducts: (query: string) => Product[];
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ApiState>({
    products: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
  });

  const fetchProducts = useCallback(async (page: number = 1, refresh: boolean = false) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await apiService.getProducts(page);
      setState(prev => ({
        products: refresh ? response.data : [...prev.products, ...response.data],
        isLoading: false,
        error: null,
        currentPage: response.page,
        totalPages: response.total_pages,
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isLoading: false, error: err.message }));
    }
  }, []);

  const searchProducts = (query: string) => {
    if (!query) return state.products;
    return state.products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.year.toString().includes(query)
    );
  };

  return (
    <ApiContext.Provider value={{ ...state, fetchProducts, searchProducts }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) throw new Error('useApi must be used within an ApiProvider');
  return context;
};
