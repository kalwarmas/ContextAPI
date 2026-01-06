
import React, { useEffect, useState, useMemo } from 'react';
import { useApi } from '../contexts/ApiContext';
import { Layout } from '../components/Layout';
import { Product } from '../types';

interface ProductListScreenProps {
  onSelectProduct: (product: Product) => void;
}

export const ProductListScreen: React.FC<ProductListScreenProps> = ({ onSelectProduct }) => {
  const { products, isLoading, fetchProducts, currentPage, totalPages, searchProducts } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts(1);
    }
  }, []);

  const filteredProducts = useMemo(() => searchProducts(searchQuery), [products, searchQuery]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProducts(1, true);
    setIsRefreshing(false);
  };

  const loadMore = () => {
    if (currentPage < totalPages && !isLoading) {
      fetchProducts(currentPage + 1);
    }
  };

  return (
    <Layout title="Gallery">
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all"
          />
          {searchQuery && (
             <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-400"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
             </button>
          )}
        </div>

        {/* Pull-to-refresh indicator (Simulation) */}
        <div className="flex justify-between items-center px-2">
          <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            {filteredProducts.length} Results
          </span>
          <button 
            onClick={handleRefresh}
            className={`flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-all ${isRefreshing ? 'opacity-50' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group relative bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer overflow-hidden"
            >
              <div 
                className="absolute right-0 top-0 w-24 h-24 blur-3xl opacity-20 transition-opacity group-hover:opacity-40"
                style={{ backgroundColor: product.color }}
              />
              
              <div className="flex items-center gap-5">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-inner font-bold text-lg"
                  style={{ backgroundColor: product.color }}
                >
                  #{product.id}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl capitalize mb-1">{product.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500 font-medium">{product.year}</span>
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
                    <span className="text-sm font-mono text-slate-400 uppercase tracking-tighter">{product.pantone_value}</span>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredProducts.length === 0 && !isLoading && (
            <div className="text-center py-20 bg-slate-100/50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-slate-400 font-medium">No products found matching "{searchQuery}"</p>
            </div>
          )}
        </div>

        {/* Loading / Pagination */}
        {isLoading && !isRefreshing && (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
            </div>
            <p className="text-xs font-bold text-indigo-500/60 uppercase tracking-widest">Loading Items</p>
          </div>
        )}

        {currentPage < totalPages && !isLoading && !searchQuery && (
          <button 
            onClick={loadMore}
            className="w-full py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            Load More Products
          </button>
        )}
      </div>
    </Layout>
  );
};
