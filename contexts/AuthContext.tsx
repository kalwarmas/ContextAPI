
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthState, User } from '../types';
import { apiService } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    const initAuth = async () => {
      if (state.token) {
        try {
          setState(prev => ({ ...prev, isLoading: true }));
          const profile = await apiService.getUserProfile();
          setState(prev => ({
            ...prev,
            user: profile.data,
            isAuthenticated: true,
            isLoading: false
          }));
        } catch (err) {
          logout();
        }
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { token } = await apiService.login(email, password);
      localStorage.setItem('token', token);
      const profile = await apiService.getUserProfile();
      setState({
        user: profile.data,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      setState(prev => ({ ...prev, isLoading: false, error: err.message }));
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const clearError = () => setState(prev => ({ ...prev, error: null }));

  return (
    <AuthContext.Provider value={{ ...state, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
