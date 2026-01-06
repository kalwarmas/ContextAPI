
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ApiProvider } from './contexts/ApiContext';
import { LoginScreen } from './screens/LoginScreen';
import { ProductListScreen } from './screens/ProductListScreen';
import { ProductDetailsScreen } from './screens/ProductDetailsScreen';
import { Toast } from './components/Toast';
import { Screen, Product } from './types';

const NavigationRouter: React.FC = () => {
  const { isAuthenticated, isLoading: isAuthLoading, error: authError, clearError: clearAuthError } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('LOGIN');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentScreen('PRODUCT_LIST');
    } else {
      setCurrentScreen('LOGIN');
    }
  }, [isAuthenticated]);

  const navigateToDetails = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen('PRODUCT_DETAILS');
  };

  const navigateToList = () => {
    setCurrentScreen('PRODUCT_LIST');
    setSelectedProduct(null);
  };

  // Global Loader Overlay
  if (isAuthLoading && !isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[999] bg-white dark:bg-slate-900 flex flex-col items-center justify-center transition-colors">
        <div className="w-16 h-16 border-4 border-indigo-100 dark:border-indigo-900 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">Initializing Session</p>
      </div>
    );
  }

  return (
    <>
      {currentScreen === 'LOGIN' && <LoginScreen />}
      {currentScreen === 'PRODUCT_LIST' && <ProductListScreen onSelectProduct={navigateToDetails} />}
      {currentScreen === 'PRODUCT_DETAILS' && selectedProduct && (
        <ProductDetailsScreen product={selectedProduct} onBack={navigateToList} />
      )}
      
      {authError && (
        <Toast 
          message={authError} 
          type="error" 
          onClose={clearAuthError} 
        />
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ApiProvider>
          <NavigationRouter />
        </ApiProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
