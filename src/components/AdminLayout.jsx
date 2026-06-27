import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Settings } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

export default function AdminLayout() {
  const location = useLocation();
  const { settings } = useSettingsStore();

  const links = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (link) =>
    link.exact ? location.pathname === link.path : location.pathname.startsWith(link.path);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100dvh-4rem)] bg-[#f7f7f5]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-56 xl:w-60 flex-col bg-white border-r border-stone-200/80 shrink-0">
        <div className="p-5 border-b border-stone-100">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1">Admin</p>
          <h2 className="text-base font-semibold text-emerald-950 truncate">{settings.businessName}</h2>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-emerald-950 text-gold-400'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-emerald-900'
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.25 : 2} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile / tablet top nav */}
      <div className="lg:hidden sticky top-16 sm:top-[4.5rem] z-30 bg-white border-b border-stone-200/80">
        <nav className="page-container flex gap-1 py-2 overflow-x-auto scrollbar-hide">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 min-h-11 transition-colors ${
                  active
                    ? 'bg-emerald-950 text-gold-400'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Icon size={16} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <main className="flex-1 min-w-0">
        <div className="page-container py-5 sm:py-6 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
