import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="bg-cream-50 min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <SEO title="Page Not Found" description="The page you are looking for does not exist." />
      <h1 className="text-6xl font-serif font-bold text-emerald-900 mb-4">404</h1>
      <h2 className="text-2xl font-medium text-emerald-950 mb-6">Page Not Found</h2>
      <p className="text-stone-500 mb-8 max-w-md">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <Link to="/" className="btn-primary px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-widest">
        Return Home
      </Link>
    </div>
  );
}
