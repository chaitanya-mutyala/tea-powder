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
          description="Looks like you haven't added any items yet. Explore our fresh dairy products."
          action={
            <Link to="/" className="btn-primary rounded-full px-8 py-3.5 text-sm uppercase tracking-widest">
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="page-container py-8 sm:py-12 lg:py-16 pb-32 lg:pb-16">

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-emerald-950 leading-tight">Your Bag</h1>
          <p className="text-sm text-stone-500 mt-2">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 items-start">

          {/* Item list */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
              <ul className="divide-y divide-cream-100">
                {items.map((item) => (
                  <li key={item.id} className="p-5 sm:p-6 flex gap-4 sm:gap-5">

                    {/* Thumbnail */}
                    <Link to={`/product/${item.id}`} className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-cream-50 border border-cream-100 shrink-0 hover:opacity-90 transition-opacity">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </Link>

                    {/* Details */}
                    <div className="flex-grow min-w-0 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-semibold text-gold-600 uppercase tracking-widest mb-0.5">{item.category}</p>
                        <Link to={`/product/${item.id}`} className="font-serif text-[15px] sm:text-base font-semibold text-emerald-950 line-clamp-2 leading-snug hover:text-emerald-700 transition-colors">{item.title}</Link>
                        {item.weight && <p className="text-xs text-stone-400 mt-1">{item.weight}</p>}
                      </div>
                      <p className="text-base sm:text-lg font-sans font-bold text-emerald-900 mt-2 tabular-nums">{formatPrice(item.price)}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end justify-between gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>

                      {/* Qty stepper */}
                      <div className="flex items-center gap-0.5 bg-cream-50 border border-cream-200 rounded-xl p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-cream-200 text-emerald-950 transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-emerald-950 tabular-nums">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-cream-200 text-emerald-950 transition-colors"
                          aria-label="Increase"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-emerald-950 text-cream-50 p-6 sm:p-8 rounded-2xl lg:sticky lg:top-28">
              <h3 className="text-lg sm:text-xl font-serif font-bold text-gold-400 mb-6">Order Summary</h3>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-emerald-200/70">
                  <span>Subtotal</span>
                  <span className="font-sans tabular-nums">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-emerald-200/70">
                  <span>Shipping</span>
                  <span className="text-emerald-400 text-xs font-medium">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-emerald-800/60 pt-5 mb-6 flex items-center justify-between">
                <span className="text-sm font-semibold text-cream-100">Total</span>
                <span className="text-2xl sm:text-3xl font-sans font-bold text-gold-400 tabular-nums">{formatPrice(total)}</span>
              </div>

              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full bg-gold-500 hover:bg-gold-600 text-white font-semibold text-sm uppercase tracking-widest py-3.5 rounded-full transition-all duration-200 hover:-translate-y-px active:scale-[0.98] shadow-[0_4px_16px_-4px_rgb(184_136_42/0.5)] flex items-center justify-center gap-2"
              >
                Secure Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-[10px] text-emerald-400/50 mt-4 uppercase tracking-wider">
                Taxes included · Shipping at checkout
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-cream-200 px-4 py-3 safe-bottom">
        <div className="flex items-center gap-4 max-w-lg mx-auto">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-stone-400 uppercase tracking-wider">Total</p>
            <p className="text-xl font-sans font-bold text-emerald-950 tabular-nums">{formatPrice(total)}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="bg-gold-500 hover:bg-gold-600 text-white font-semibold text-sm uppercase tracking-wider px-6 py-3 rounded-full transition-colors shrink-0 flex items-center gap-2"
          >
            Checkout <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
