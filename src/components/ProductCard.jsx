import React from 'react';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import { Heart, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../lib/format';

export default function ProductCard({ product }) {
  const addToCart = useCartStore(state => state.addToCart);
  const wishlistItems = useWishlistStore(state => state.items);
  const toggleWishlist = useWishlistStore(state => state.toggleWishlist);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const navigate = useNavigate();

  const isWished = wishlistItems.includes(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    toggleWishlist(product.id);
  };

  const handleCardClick = () => navigate(`/product/${product.id}`);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isOutOfStock) addToCart(product);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(); }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className={`group flex flex-col bg-white rounded-2xl border overflow-hidden cursor-pointer
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_rgb(1_26_19/0.14),0_2px_8px_-2px_rgb(1_26_19/0.06)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50
        ${isOutOfStock
          ? 'border-cream-200 opacity-75'
          : 'border-cream-200/80 hover:border-cream-300/60'
        }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] ${isOutOfStock ? 'grayscale-[0.3]' : ''}`}
        />

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center
            backdrop-blur-sm border transition-all duration-200 shadow-sm z-10
            ${isWished
              ? 'bg-white border-gold-300 text-gold-600 shadow-gold-200/50'
              : 'bg-white/90 border-white/60 text-stone-400 hover:text-gold-500 hover:border-gold-300 hover:bg-white'
            }`}
        >
          <Heart className={`h-4 w-4 transition-transform duration-200 ${isWished ? 'fill-gold-500 text-gold-500 scale-110' : 'group-hover:scale-105'}`} />
        </button>

        {/* Stock / category badge */}
        {isOutOfStock ? (
          <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-emerald-950/70 to-transparent">
            <span className="inline-block bg-white/95 text-emerald-950 px-3 py-1 font-semibold tracking-widest text-[9px] uppercase rounded-full">
              Sold Out
            </span>
          </div>
        ) : product.category ? (
          <div className="absolute top-3 left-3">
            <span className="inline-block bg-emerald-950/80 backdrop-blur-sm text-cream-100 text-[9px] font-semibold px-2.5 py-1 rounded-full tracking-widest uppercase">
              {product.category}
            </span>
          </div>
        ) : null}
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-serif text-[15px] sm:text-base text-emerald-950 font-semibold line-clamp-2 leading-snug flex-1">
            {product.title}
          </h3>
          {product.weight && (
            <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap mt-0.5">
              {product.weight}
            </span>
          )}
        </div>

        {product.description && (
          <p className="text-xs text-stone-500 mb-4 flex-grow line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-cream-100">
          <div className="flex flex-col">
            {product.originalPrice && product.originalPrice > product.price && (
               <span className="text-[10px] text-stone-400 line-through mb-0.5">
                 {formatPrice(product.originalPrice)}
               </span>
            )}
            <span className="text-lg sm:text-xl font-sans font-bold text-emerald-900 tabular-nums tracking-tight flex items-center gap-2">
              {formatPrice(product.price)}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md tracking-wider uppercase">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? 'Out of stock' : 'Add to cart'}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0
              ${isOutOfStock
                ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                : 'bg-emerald-950 text-gold-400 hover:bg-emerald-800 active:scale-95 shadow-sm hover:shadow-md hover:-translate-y-px'
              }`}
          >
            <ShoppingBag className="h-[1.05rem] w-[1.05rem]" />
          </button>
        </div>
      </div>
    </article>
  );
}
