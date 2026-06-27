import React from 'react';
import { useCartStore } from '../store/cartStore';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import { formatPrice } from '../lib/format';

export default function Cart() {
  const { items, updateQuantity, removeFromCart } = useCartStore();
  const navigate = useNavigate();

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="page-container py-16 sm:py-24 min-h-[60vh] flex flex-col justify-center">
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Looks like you haven't added any items to your bag yet."
          action={
            <Link to="/" className="btn-primary rounded-full px-8 py-3.5 uppercase tracking-widest text-sm">
              Continue Shopping <ArrowRight className="w-5 h-5" />
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="page-container py-8 sm:py-12 lg:py-16 pb-28 lg:pb-16">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-emerald-950 mb-8 sm:mb-10 text-center">Your Bag</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        
        <div className="lg:col-span-2">
          <div className="card-elevated p-4 sm:p-6 lg:p-8">
            <ul className="divide-y divide-cream-100">
              {items.map((item) => (
                <li key={item.id} className="py-5 sm:py-6 flex gap-4 sm:gap-6 first:pt-0 last:pb-0">
                  <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-cream-50 shrink-0 border border-cream-100">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-grow min-w-0 flex flex-col justify-center">
                    <div className="text-[10px] sm:text-xs font-bold text-gold-600 uppercase tracking-widest mb-1">{item.category}</div>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-emerald-950 mb-1 line-clamp-2">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-emerald-900/60 mb-2">{item.weight}</p>
                    <div className="text-lg sm:text-xl font-bold text-emerald-900 tabular-nums">{formatPrice(item.price)}</div>
                  </div>
                  
                  <div className="flex flex-col items-end justify-between gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="btn-icon text-emerald-900/40 hover:text-red-500 -mr-1"
                      aria-label="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="flex items-center bg-cream-50 border border-cream-200 rounded-full p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="btn-icon min-w-9 min-h-9 hover:bg-cream-200 rounded-full text-emerald-950"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 sm:w-10 text-center font-bold text-emerald-950 text-sm tabular-nums">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="btn-icon min-w-9 min-h-9 hover:bg-cream-200 rounded-full text-emerald-950"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-emerald-950 text-cream-50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl lg:sticky lg:top-28">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-gold-400 mb-6 sm:mb-8">Order Summary</h3>
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-sm sm:text-base">
              <div className="flex justify-between items-center text-emerald-100/80">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-100/80">
                <span>Shipping</span>
                <span className="text-right text-xs sm:text-sm">At checkout</span>
              </div>
            </div>
            
            <div className="border-t border-emerald-800 pt-5 sm:pt-6 mb-6 sm:mb-8 flex items-center justify-between">
              <span className="text-base font-bold">Total</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-gold-400 tabular-nums">{formatPrice(total)}</span>
            </div>
            
            <button 
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full btn-accent rounded-full py-3.5 sm:py-4 uppercase tracking-widest text-sm shadow-lg"
            >
              Secure Checkout <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-center text-[10px] sm:text-xs text-emerald-100/50 mt-5 uppercase tracking-wider">Taxes included. Shipping calculated at checkout.</p>
          </div>
        </div>
      </div>

      {/* Mobile sticky checkout */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-cream-200 p-4 safe-bottom">
        <div className="flex items-center gap-4 max-w-lg mx-auto">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-emerald-900/60 uppercase tracking-wider">Total</p>
            <p className="text-xl font-bold text-emerald-950 tabular-nums">{formatPrice(total)}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="btn-accent rounded-full px-6 py-3 uppercase tracking-wider text-sm shrink-0"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
