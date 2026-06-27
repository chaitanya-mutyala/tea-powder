import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const signup = useAuthStore((state) => state.signup);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      if (isSignUp) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      const isAdmin = email.trim() === 'chaitanyamutyala456@gmail.com';
      navigate(isAdmin ? '/admin' : '/');
    } catch (error) {
      console.error('Auth failed', error);
      setErrorMsg(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-5rem)] flex items-center justify-center bg-cream-50 px-4 py-12 sm:py-16">

      {/* Card */}
      <div className="w-full max-w-[22rem] sm:max-w-sm">

        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-emerald-950 items-center justify-center mb-5 shadow-lg shadow-emerald-950/20">
            <span className="text-gold-400 font-serif text-2xl font-bold">A</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950 mb-1.5">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-stone-500">
            {isSignUp
              ? 'Join us for a personalised experience.'
              : 'Sign in to access your orders and wishlist.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-cream-100 rounded-xl p-1 mb-6 border border-cream-200">
          {['Sign In', 'Sign Up'].map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => { setIsSignUp(i === 1); setErrorMsg(''); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                (i === 0) === !isSignUp
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'text-stone-500 hover:text-emerald-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-red-800 text-sm leading-relaxed" role="alert">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-emerald-950 uppercase tracking-wider mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
              <input
                type="email"
                required
                autoComplete="email"
                className="input-field pl-10"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-emerald-950 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
              <input
                type="password"
                required
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="input-field pl-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-accent rounded-xl py-3.5 mt-2"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Please wait…</>
              : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-stone-400">
          <Link to="/" className="hover:text-emerald-800 transition-colors">← Back to shop</Link>
        </p>
      </div>
    </div>
  );
}
