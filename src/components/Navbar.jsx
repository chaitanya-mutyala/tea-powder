import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Heart, Menu, X, Search } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useSettingsStore } from '../store/settingsStore';
import logo from '../assets/logo.png';

export default function Navbar() {
  const { isAuthenticated, role, logout } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const { settings } = useSettingsStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const urlQuery = searchParams.get('q') || '';

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const submitSearch = useCallback((query) => {
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/');
    }
    setIsMobileMenuOpen(false);
  }, [navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input[type="search"]');
    submitSearch(input?.value || '');
  };

  const navLinkClass = 'block py-3 px-4 rounded-xl text-base font-medium text-emerald-950 hover:bg-cream-50 transition-colors min-h-11';

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md border-b border-cream-200 sticky top-0 z-40 shadow-sm">
        <div className="page-container">
          <div className="flex justify-between h-16 sm:h-[4.5rem] items-center gap-3">
            <div className="flex items-center md:hidden shrink-0">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="btn-icon text-emerald-950 -ml-2"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-shrink-0 flex items-center justify-center md:justify-start flex-1 md:flex-none min-w-0">
              <Link to="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
                <img
                  src={logo}
                  alt={`${settings.businessName} Logo`}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-cream-200 group-hover:border-gold-500 transition-colors shrink-0"
                />
                <span className="text-base sm:text-xl font-serif font-bold text-emerald-950 truncate max-w-[9rem] sm:max-w-none group-hover:text-gold-600 transition-colors">
                  {settings.businessName}
                </span>
              </Link>
            </div>
            
            <form key={urlQuery} onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 justify-center px-6 max-w-lg mx-auto">
              <div className="relative w-full">
                <input 
                  type="search"
                  defaultValue={urlQuery}
                  placeholder="Search products..."
                  className="input-field rounded-full pl-10 py-2.5 text-sm"
                  aria-label="Search products"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-900/40 pointer-events-none" />
              </div>
            </form>

            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
              {role === 'admin' && (
                <Link to="/admin" className="hidden md:inline-flex btn-ghost text-xs uppercase tracking-widest px-3">
                  Admin
                </Link>
              )}
              
              {isAuthenticated && role !== 'admin' && (
                <Link to="/dashboard" className="btn-icon text-emerald-950 hover:text-gold-600 relative hidden sm:inline-flex" aria-label="Wishlist">
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 bg-gold-500 text-white text-[10px] font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center border-2 border-white">
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </Link>
              )}

              {role !== 'admin' && (
                <Link to="/cart" className="btn-icon text-emerald-950 hover:text-gold-600 relative" aria-label="Cart">
                  <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center border-2 border-white">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
              )}

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-icon text-emerald-950 hover:text-gold-600 hidden md:inline-flex"
                  aria-label="Log out"
                >
                  <LogOut className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              ) : (
                <Link to="/login" className="btn-icon text-emerald-950 hover:text-gold-600 hidden md:inline-flex" aria-label="Sign in">
                  <User className="h-5 w-5 sm:h-6 sm:w-6" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div
          className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-0 left-0 w-[min(85vw,20rem)] h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out safe-bottom ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex justify-between items-center p-4 border-b border-cream-200">
            <span className="text-lg font-serif font-bold text-emerald-950 truncate pr-2">{settings.businessName}</span>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-icon text-emerald-950 shrink-0"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-4 border-b border-cream-100">
            <form key={`mobile-${urlQuery}`} onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input 
                  type="search"
                  defaultValue={urlQuery}
                  placeholder="Search products..."
                  className="input-field pl-10 text-sm"
                  aria-label="Search products"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-900/40 pointer-events-none" />
              </div>
            </form>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {role === 'admin' ? (
              <Link to="/admin" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
            ) : (
              <>
                <Link to="/" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                <Link to="/cart" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Cart {cartCount > 0 && `(${cartCount})`}</Link>
                {isAuthenticated && (
                  <>
                    <Link to="/dashboard" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>My Account</Link>
                    <Link to="/dashboard" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</Link>
                  </>
                )}
              </>
            )}
          </nav>

          <div className="p-4 border-t border-cream-200 mt-auto">
            {isAuthenticated ? (
              <button type="button" onClick={handleLogout} className={`${navLinkClass} w-full flex items-center text-left`}>
                <LogOut className="h-5 w-5 mr-3 shrink-0" /> Log Out
              </button>
            ) : (
              <Link to="/login" className={`${navLinkClass} flex items-center`} onClick={() => setIsMobileMenuOpen(false)}>
                <User className="h-5 w-5 mr-3 shrink-0" /> Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
