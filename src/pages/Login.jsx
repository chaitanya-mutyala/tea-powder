import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

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
      const role = useAuthStore.getState().role;
      navigate(role === 'admin' ? '/admin' : '/');
    } catch (error) {
      console.error("Auth failed", error);
      setErrorMsg(error.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center bg-cream-50 px-4 py-12">
      <div className="card-elevated w-full max-w-md p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-serif text-emerald-950 text-center mb-2">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>
        <p className="text-center text-sm text-emerald-900/60 mb-6">
          {isSignUp ? 'Join us for a personalized shopping experience.' : 'Sign in to access your orders and wishlist.'}
        </p>
        {errorMsg && (
          <div className="text-red-700 text-sm mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-center" role="alert">
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2">Email</label>
            <input 
              type="email" 
              required
              autoComplete="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              required
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full btn-primary rounded-xl py-3.5 mt-2 disabled:opacity-50"
          >
            {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Please wait...</span> : (isSignUp ? "Create Account" : "Sign In")}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
            className="text-sm text-emerald-700 hover:text-gold-600 font-medium transition-colors py-2"
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>
        <p className="text-center mt-4">
          <Link to="/" className="text-xs text-emerald-900/50 hover:text-emerald-800">← Back to shop</Link>
        </p>
      </div>
    </div>
  );
}
