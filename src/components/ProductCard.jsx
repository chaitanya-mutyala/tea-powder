import React from 'react';
import { useCartStore } from '../store/cartStore';

export default function ProductCard({ product }) {
  const addToCart = useCartStore(state => state.addToCart);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className={`group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-100 ${isOutOfStock ? 'opacity-75 grayscale-[0.5]' : ''}`}>
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center">
            <span className="bg-white/90 text-stone-900 px-4 py-2 font-bold tracking-wider rounded-md text-sm uppercase">Out of Stock</span>
          </div>
        )}
        {!isOutOfStock && (
          <div className="absolute top-3 left-3">
            <span className="bg-stone-50/90 text-emerald-950 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              {product.weight}
            </span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs font-medium text-amber-600 mb-1 tracking-wide uppercase">{product.category}</div>
        <h3 className="font-serif text-lg text-emerald-950 font-semibold mb-2 line-clamp-2">{product.title}</h3>
        <p className="text-sm text-stone-500 mb-4 flex-grow line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-emerald-900">{formatPrice(product.price)}</span>
          <button 
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${isOutOfStock ? 'bg-stone-200 text-stone-500 cursor-not-allowed' : 'bg-emerald-900 text-white hover:bg-emerald-800 shadow-sm active:transform active:scale-95'}`}
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}
