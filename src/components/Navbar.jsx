import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Heart, Menu, X, Search } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useSettingsStore } from '../store/settingsStore';
import logo from '../assets/logo.webp';
import logoFallback from '../assets/logo.png';

function InstagramIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Navbar() {
  const { isAuthenticated, role, logout } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const { settings } = useSettingsStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const urlQuery = searchParams.get('q') || '';

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const navLinkBase = 'block py-3 px-4 rounded-xl text-[15px] font-medium text-emerald-950 hover:bg-cream-100 hover:text-emerald-800 transition-colors min-h-11 flex items-center';

  return (
    <>
      <nav
        className={`bg-cream-50/95 backdrop-blur-md sticky top-0 z-40 transition-all duration-300 ${isScrolled
            ? 'border-b border-cream-200 shadow-[0_1px_12px_-2px_rgb(1_26_19/0.08)]'
            : 'border-b border-cream-100'
          }`}
      >
        <div className="page-container">
          <div className="flex justify-between h-[4.25rem] sm:h-[4.75rem] items-center gap-3">

            {/* Mobile: hamburger */}
            <div className="flex items-center md:hidden shrink-0">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="btn-icon text-emerald-900 hover:bg-cream-100 -ml-2"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center md:justify-start flex-1 md:flex-none min-w-0">
              <Link to="/" className="flex items-center gap-2.5 group min-w-0">
                <div className="relative shrink-0">
                  <picture>
                    <source srcSet={logo} type="image/webp" />
                    <img
                      src={logoFallback}
                      alt={`${settings.businessName} Logo`}
                      width="44"
                      height="44"
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-cream-200 group-hover:border-gold-400 transition-colors duration-300"
                    />
                  </picture>
                  <div className="absolute inset-0 rounded-full ring-1 ring-gold-400/0 group-hover:ring-gold-400/30 transition-all duration-300" />
                </div>
                <div className="min-w-0 hidden sm:block">
                  <span className="block text-[15px] sm:text-lg font-serif font-bold text-emerald-950 truncate group-hover:text-gold-600 transition-colors duration-300 leading-tight">
                    {settings.businessName}
                  </span>
                  <span className="block text-[10px] font-medium tracking-[0.15em] text-stone-400 uppercase">
                    Pure &amp; Fresh
                  </span>
                </div>
                <span className="sm:hidden text-[15px] font-serif font-bold text-emerald-950 truncate max-w-[8rem] group-hover:text-gold-600 transition-colors">
                  {settings.businessName}
                </span>
              </Link>
            </div>

            {/* Desktop Search */}
            <form key={urlQuery} onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 justify-center px-6 max-w-lg mx-auto">
              <div className="relative w-full group">
                <input
                  type="search"
                  defaultValue={urlQuery}
                  placeholder="Search products..."
                  className="w-full h-10 pl-10 pr-4 bg-cream-100 border border-cream-200 rounded-full text-sm text-emerald-950 placeholder:text-stone-400 font-medium transition-all duration-200 focus:outline-none focus:bg-white focus:border-gold-400 focus:ring-2 focus:ring-gold-400/15 hover:border-cream-300"
                  aria-label="Search products"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none transition-colors group-focus-within:text-gold-500" />
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">

              {role === 'admin' && (
                <Link
                  to="/admin"
                  className="hidden md:inline-flex items-center h-9 px-4 rounded-lg text-xs font-semibold uppercase tracking-widest text-emerald-900 hover:text-emerald-950 hover:bg-cream-100 transition-colors"
                >
                  Admin
                </Link>
              )}

              {isAuthenticated && role !== 'admin' && (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-semibold uppercase tracking-widest text-emerald-900 hover:text-emerald-950 hover:bg-cream-100 transition-colors"
                  title="My Account"
                  aria-label="My Account"
                >
                  <User className="h-4 w-4 text-emerald-700" />
                  <span className="hidden sm:inline">My Account</span>
                </Link>
              )}

              {isAuthenticated && role !== 'admin' && (
                <Link
                  to="/dashboard"
                  className="btn-icon text-stone-600 hover:text-gold-600 hover:bg-cream-100 relative hidden sm:inline-flex"
                  aria-label="Wishlist"
                >
                  <Heart className="h-5 w-5 sm:h-[1.15rem] sm:w-[1.15rem]" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-gold-500 text-white text-[9px] font-bold rounded-full h-[18px] w-[18px] flex items-center justify-center border-2 border-cream-50 leading-none">
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </Link>
              )}

              {role !== 'admin' && (
                <Link
                  to="/cart"
                  className="btn-icon text-stone-600 hover:text-emerald-900 hover:bg-cream-100 relative"
                  aria-label="Cart"
                >
                  <ShoppingBag className="h-5 w-5 sm:h-[1.15rem] sm:w-[1.15rem]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-emerald-800 text-white text-[9px] font-bold rounded-full h-[18px] w-[18px] flex items-center justify-center border-2 border-cream-50 leading-none">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
              )}

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-icon text-stone-500 hover:text-red-600 hover:bg-red-50 hidden md:inline-flex"
                  aria-label="Log out"
                >
                  <LogOut className="h-[1.1rem] w-[1.1rem]" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="btn-icon text-stone-600 hover:text-emerald-900 hover:bg-cream-100 hidden md:inline-flex"
                  aria-label="Sign in"
                >
                  <User className="h-5 w-5" />
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
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-emerald-950/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Drawer panel */}
        <div
          className={`absolute top-0 left-0 w-[min(84vw,22rem)] h-full bg-cream-50 shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] safe-bottom ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-cream-200 bg-white">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5">
              <picture>
                <source srcSet={logo} type="image/webp" />
                <img src={logoFallback} alt="Logo" width="36" height="36" className="w-9 h-9 rounded-full object-cover border border-cream-200" />
              </picture>
              <div>
                <span className="block text-sm font-serif font-bold text-emerald-950 leading-tight">{settings.businessName}</span>
                <span className="block text-[10px] tracking-widest text-stone-400 uppercase">Premium Dairy</span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-icon text-stone-500 hover:text-emerald-950 hover:bg-cream-100 -mr-1"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="px-4 py-3 border-b border-cream-100 bg-cream-50">
            <form key={`mobile-${urlQuery}`} onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="search"
                  defaultValue={urlQuery}
                  placeholder="Search products..."
                  className="w-full h-10 pl-9 pr-4 bg-white border border-cream-200 rounded-xl text-sm text-emerald-950 placeholder:text-stone-400 font-medium focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/15"
                  aria-label="Search products"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
              </div>
            </form>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
            <p className="px-4 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-stone-400">Navigation</p>

            {role === 'admin' ? (
              <Link to="/admin" className={navLinkBase} onClick={() => setIsMobileMenuOpen(false)}>
                Admin Dashboard
              </Link>
            ) : (
              <>
                <Link to="/" className={navLinkBase} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                <Link to="/cart" className={navLinkBase} onClick={() => setIsMobileMenuOpen(false)}>
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-auto bg-emerald-900 text-gold-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{cartCount}</span>
                  )}
                </Link>
                {isAuthenticated && (
                  <>
                    <Link to="/dashboard" className={navLinkBase} onClick={() => setIsMobileMenuOpen(false)}>My Account</Link>
                    <Link to="/dashboard" className={navLinkBase} onClick={() => setIsMobileMenuOpen(false)}>
                      Wishlist
                      {wishlistCount > 0 && (
                        <span className="ml-auto bg-gold-100 text-gold-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{wishlistCount}</span>
                      )}
                    </Link>
                  </>
                )}
              </>
            )}

            {settings.instagramUrl && (
              <>
                <div className="my-2 mx-4 h-px bg-cream-200" />
                <p className="px-4 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-stone-400">Follow Us</p>
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 py-3 px-4 rounded-xl text-[15px] font-medium text-pink-700 hover:bg-pink-50 transition-colors min-h-11"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <InstagramIcon className="w-5 h-5 shrink-0" />
                  Instagram
                </a>
              </>
            )}
          </nav>

          {/* Brand quote */}
          <div className="mx-4 mb-3 px-4 py-4 bg-emerald-950 rounded-2xl text-center">
            <p className="text-gold-400 font-serif text-sm leading-relaxed italic">
              &ldquo;Pure from the farm, straight to your heart.&rdquo;
            </p>
            <p className="text-emerald-600 text-[10px] uppercase tracking-[0.2em] mt-2">{settings.businessName}</p>
          </div>

          {/* Bottom action */}
          <div className="px-4 pb-5 pt-2">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2.5 h-11 rounded-xl text-sm font-semibold text-red-700 border border-red-200 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Log Out
              </button>
            ) : (
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2.5 h-11 rounded-xl text-sm font-semibold bg-emerald-950 text-gold-400 hover:bg-emerald-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" /> Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
