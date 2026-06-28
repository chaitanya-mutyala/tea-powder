import React from 'react';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '../store/settingsStore';
import { Phone, Mail, MapPin } from 'lucide-react';

function InstagramIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  const { settings } = useSettingsStore();

  return (
    <footer className="bg-emerald-950 text-emerald-100 mt-auto safe-bottom relative overflow-hidden">
      {/* Decorative gradient top border */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      {/* Main content */}
      <div className="page-container pt-14 sm:pt-20 pb-10 sm:pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-8">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-4">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gold-400 mb-3 leading-tight tracking-tight">
              {settings.businessName}
            </h3>
            <p className="text-[11px] font-medium tracking-[0.18em] text-emerald-500 uppercase mb-5">
              Premium Dairy · Konaseema
            </p>
            <p className="text-emerald-300/80 leading-[1.8] max-w-sm text-sm">
              {settings.seoDescription || 'Premium quality dairy products crafted with generations of care. Taste the authenticity of farm-fresh goodness, delivered to your doorstep.'}
            </p>

            {/* Social links */}
            <div className="mt-8 flex gap-2.5">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-900/60 text-emerald-300 hover:bg-gold-500 hover:text-white transition-all duration-200 hover:-translate-y-px border border-emerald-800/50 hover:border-gold-500"
                  aria-label="Follow us on Instagram"
                >
                  <InstagramIcon className="w-[1.1rem] h-[1.1rem]" />
                </a>
              )}
              {settings.whatsappNumber && (
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g,'')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-900/60 text-emerald-300 hover:bg-[#25D366] hover:text-white transition-all duration-200 hover:-translate-y-px border border-emerald-800/50 hover:border-[#25D366]"
                  aria-label="WhatsApp"
                >
                  <svg viewBox="0 0 24 24" className="w-[1.1rem] h-[1.1rem]" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold text-emerald-400 mb-5 uppercase tracking-[0.18em]">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/', label: 'Shop' },
                { to: '/cart', label: 'Cart' },
                { to: '/dashboard', label: 'My Account' },
              ].map(({ to, label }, index) => (
                <li key={`${to}-${index}`}>
                  <Link
                    to={to}
                    className="inline-flex items-center gap-2 text-emerald-300/70 hover:text-gold-400 transition-colors py-0.5 group"
                  >
                    <span className="h-px w-4 bg-emerald-700 group-hover:w-6 group-hover:bg-gold-500 transition-all duration-300" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold text-emerald-400 mb-5 uppercase tracking-[0.18em]">Legal</h4>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/privacy-policy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms & Conditions' },
                { to: '/refund-policy', label: 'Refund Policy' },
                { to: '/shipping-policy', label: 'Shipping Policy' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="inline-flex items-center gap-2 text-emerald-300/70 hover:text-gold-400 transition-colors py-0.5 group"
                  >
                    <span className="h-px w-4 bg-emerald-700 group-hover:w-6 group-hover:bg-gold-500 transition-all duration-300" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold text-emerald-400 mb-5 uppercase tracking-[0.18em]">Get in Touch</h4>
            <ul className="space-y-4 text-sm">
              {settings.contactEmail && (
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-900/50 flex items-center justify-center shrink-0 border border-emerald-800/50">
                    <Mail className="h-3.5 w-3.5 text-gold-400" />
                  </div>
                  <a href={`mailto:${settings.contactEmail}`} className="text-emerald-300/80 hover:text-gold-400 transition-colors break-all leading-snug mt-1">
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {settings.contactPhone && (
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-900/50 flex items-center justify-center shrink-0 border border-emerald-800/50">
                    <Phone className="h-3.5 w-3.5 text-gold-400" />
                  </div>
                  <a href={`tel:${settings.contactPhone}`} className="text-emerald-300/80 hover:text-gold-400 transition-colors mt-1">
                    {settings.contactPhone}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-900/50 flex items-center justify-center shrink-0 border border-emerald-800/50">
                    <MapPin className="h-3.5 w-3.5 text-gold-400" />
                  </div>
                  <span className="text-emerald-300/70 leading-relaxed mt-1">{settings.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-emerald-900/60">
        <div className="page-container py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
          <p className="text-emerald-500/70 text-xs tracking-wide">
            &copy; {new Date().getFullYear()} {settings.businessName}. All rights reserved. | <Link to="/contact" className="hover:text-gold-400">Contact Us</Link>
          </p>
          <p className="text-emerald-600/50 text-[10px] tracking-widest uppercase">
            Made with care in Konaseema
          </p>
        </div>
      </div>
    </footer>
  );
}
