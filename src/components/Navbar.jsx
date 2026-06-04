import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import logo from '../assets/logo.png'

export default function Navbar() {
  const { isAuthenticated, role, logout } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const navigate = useNavigate();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src={logo}
                alt="Ambati vari Logo"
                className="w-10 h-10 rounded-full object-cover border border-stone-200 group-hover:border-emerald-500 transition-colors"
              />
              <span className="text-2xl font-serif font-bold text-emerald-950 group-hover:text-emerald-800 transition-colors">
                Ambati vari Tea podi
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            {role === 'admin' && (
              <Link to="/admin" className="text-sm font-semibold text-emerald-800 hover:text-emerald-600 transition-colors">
                Admin Panel
              </Link>
            )}
            {role !== 'admin' && (
              <Link to="/cart" className="text-stone-600 hover:text-emerald-800 relative transition-colors">
                <ShoppingBag className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-amber-950 text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-stone-600 hover:text-emerald-800 transition-colors" title="Log out">
                <LogOut className="h-6 w-6" />
              </button>
            ) : (
              <Link to="/login" className="text-stone-600 hover:text-emerald-800 transition-colors" title="Sign in">
                <User className="h-6 w-6" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
