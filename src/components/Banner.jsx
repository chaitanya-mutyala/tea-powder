import React from 'react';
import { isLiveRazorpay } from '../config';
import { AlertCircle } from 'lucide-react';

export default function Banner() {
  if (isLiveRazorpay) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/60 px-6 py-3 flex items-center justify-center space-x-3 text-amber-900 shadow-sm">
      {/* Adding a small decorative icon */}


      <p className="text-sm md:text-base font-semibold tracking-wide uppercase opacity-90">
        <span className="text-amber-700">The Boldness of Assam.</span>
        <span className="mx-2 text-amber-300">|</span>
        <span className="text-emerald-800">The Purity of Konaseema.</span>
      </p>

      <span className="hidden md:inline text-sm font-medium ml-2 text-amber-800/70">
        — Your perfect chai starts here.
      </span>
    </div>
  );
}
