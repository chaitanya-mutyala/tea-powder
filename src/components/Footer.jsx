import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-100 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-serif font-bold text-white mb-4">Ambati vari Tea podi</h3>
          <p className="text-sm text-emerald-200">
            Delivering the finest artisanal teas, fresh dairy, and traditional sweets straight to your home. Quality you can taste.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-emerald-200">
            <li><a href="#" className="hover:text-amber-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-colors">Our Products</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-colors">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold text-white mb-4">Contact Us</h4>
          <ul className="space-y-2 text-sm text-emerald-200">
            <li>Email: support@ambatitea.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Address: 123 Heritage Lane, Hyderabad, India</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-emerald-900 text-sm text-center text-emerald-400">
        &copy; {new Date().getFullYear()} Ambati vari Tea podi. All rights reserved.
      </div>
    </footer>
  );
}
