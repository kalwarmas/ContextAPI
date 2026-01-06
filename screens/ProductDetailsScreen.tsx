
import React from 'react';
import { Product } from '../types';
import { Layout } from '../components/Layout';

interface ProductDetailsScreenProps {
  product: Product;
  onBack: () => void;
}

export const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({ product, onBack }) => {
  return (
    <Layout title="Product Detail" onBack={onBack}>
      <div className="animate-fade-in space-y-8 pt-4">
        {/* Visual Header */}
        <div className="relative aspect-square w-full max-w-sm mx-auto rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-200/50 dark:shadow-none">
          <div 
            className="absolute inset-0 flex items-center justify-center p-12 transition-transform hover:scale-110 duration-700"
            style={{ backgroundColor: product.color }}
          >
            <div className="flex flex-col items-center gap-4 text-white">
               <span className="text-8xl font-black opacity-30">#{product.id}</span>
               <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full font-mono text-sm border border-white/30">
                 {product.pantone_value}
               </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Content */}
        <div className="space-y-6 px-2">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-4xl font-extrabold capitalize">{product.name}</h2>
              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-500 font-bold text-sm">
                ID: {product.id}
              </div>
            </div>
            <p className="text-slate-500 text-lg">Released in {product.year}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Color HEX</p>
              <p className="text-lg font-mono font-bold uppercase" style={{ color: product.color }}>{product.color}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pantone</p>
              <p className="text-lg font-bold">{product.pantone_value}</p>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
             <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2">Resource Description</h4>
             <p className="text-indigo-700/80 dark:text-indigo-400 leading-relaxed">
               This color resource represents the design trends of {product.year}. 
               The color <b>{product.name}</b> with Pantone reference <b>{product.pantone_value}</b> 
               is used in professional workflows for consistent color reproduction.
             </p>
          </div>
          
          <button 
            onClick={onBack}
            className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold rounded-2xl shadow-xl transition-transform active:scale-95"
          >
            Back to List
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
      `}</style>
    </Layout>
  );
};
