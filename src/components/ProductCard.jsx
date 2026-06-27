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
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleWishlist(product.id);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isOutOfStock) addToCart(product);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article 
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className={`group flex flex-col bg-white rounded-2xl border border-cream-200 overflow-hidden cursor-pointer transition-all duration-300 hover:border-cream-300 hover:shadow-lg hover:shadow-emerald-950/[0.06] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-emerald-500/30 ${isOutOfStock ? 'opacity-80' : ''}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
        <img 
          src={product.image} 
          alt={product.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] ${isOutOfStock ? 'grayscale-[0.25]' : ''}`}
        />
        
        <button 
          type="button"
          onClick={handleWishlistClick}
          aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 btn-icon min-w-10 min-h-10 rounded-full bg-white/90 backdrop-blur-sm text-emerald-950 hover:bg-white hover:text-gold-500 shadow-sm border border-white/60 z-10"
        >
          <Heart className={`h-[1.125rem] w-[1.125rem] ${isWished ? 'fill-gold-500 text-gold-500' : ''}`} />
        </button>

        {isOutOfStock ? (
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-emerald-950/70 to-transparent">
            <span className="inline-block bg-white text-emerald-950 px-3 py-1 font-semibold tracking-wide text-[10px] uppercase rounded-full">Sold Out</span>
          </div>
        ) : product.category ? (
          <div className="absolute top-3 left-3">
            <span className="inline-block bg-emerald-950/85 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide uppercase">
              {product.category}
            </span>
          </div>
        ) : null}
      </div>
      
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-1.5">
          <h3 className="font-serif text-base sm:text-lg text-emerald-950 font-bold line-clamp-2 leading-snug">{product.title}</h3>
          {product.weight && (
            <span className="text-[11px] font-semibold text-emerald-700 bg-cream-100 px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap">{product.weight}</span>
          )}
        </div>
        
        {product.description && (
          <p className="text-sm text-emerald-900/55 mb-4 flex-grow line-clamp-2 leading-relaxed">{product.description}</p>
        )}
        
        <div className="flex items-center justify-between gap-3 mt-auto pt-1">
          <span className="text-lg sm:text-xl font-bold text-emerald-950 tabular-nums">{formatPrice(product.price)}</span>
          <button 
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? 'Out of stock' : 'Add to cart'}
            className={`btn-icon min-w-11 min-h-11 rounded-xl ${isOutOfStock ? 'bg-cream-100 text-cream-400 cursor-not-allowed' : 'bg-gold-500 text-white hover:bg-gold-600 shadow-md shadow-gold-500/20 active:scale-95'}`}
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
