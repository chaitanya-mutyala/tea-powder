import React from 'react';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '../store/settingsStore';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const { settings } = useSettingsStore();

  return (
    <footer className="bg-emerald-950 text-emerald-100 pt-12 sm:pt-16 pb-6 sm:pb-8 mt-auto safe-bottom">
      <div className="page-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
        <div className="sm:col-span-2">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gold-400 mb-4 sm:mb-5">{settings.businessName}</h3>
          <p className="text-emerald-200/90 leading-relaxed max-w-md text-sm sm:text-base">
            {settings.seoDescription || "Premium quality dairy products delivered fresh. Taste the difference of authentic, farm-fresh goodness."}
          </p>
          <div className="mt-6 sm:mt-8 flex gap-3">
             {settings.instagramUrl && (
               <a
                 href={settings.instagramUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="btn-icon rounded-full bg-emerald-900 text-emerald-100 hover:bg-gold-500 hover:text-white"
                 aria-label="Instagram"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
               </a>
             )}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-white mb-4 sm:mb-5 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-emerald-200/80">
            <li><Link to="/" className="inline-block py-1 hover:text-gold-400 transition-colors">Home</Link></li>
            <li><Link to="/cart" className="inline-block py-1 hover:text-gold-400 transition-colors">Cart</Link></li>
            <li><Link to="/dashboard" className="inline-block py-1 hover:text-gold-400 transition-colors">My Account</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-white mb-4 sm:mb-5 uppercase tracking-wider">Contact</h4>
          <ul className="space-y-3.5 text-sm text-emerald-200/80">
            <li className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
              <a href={`mailto:${settings.contactEmail}`} className="break-all hover:text-gold-400 transition-colors">{settings.contactEmail}</a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
              <a href={`tel:${settings.contactPhone}`} className="hover:text-gold-400 transition-colors">{settings.contactPhone}</a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{settings.address}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="page-container mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-emerald-900/50 text-center text-emerald-400/60 text-xs sm:text-sm">
        &copy; {new Date().getFullYear()} {settings.businessName}. All rights reserved.
      </div>
    </footer>
  );
}
