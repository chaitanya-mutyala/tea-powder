import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-stone-100">
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-stone-200 flex-shrink-0">
        <div className="p-4 md:p-6 overflow-x-auto">
          <h2 className="text-xl font-serif font-bold text-emerald-950 mb-4 md:mb-6 hidden md:block">Admin Panel</h2>
          <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 pb-1 md:pb-0 min-w-max md:min-w-0">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = link.exact 
                ? location.pathname === link.path 
                : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors whitespace-nowrap ${
                    isActive ? 'bg-emerald-50 text-emerald-900 font-medium' : 'text-stone-600 hover:bg-stone-50 hover:text-emerald-800'
                  }`}
                >
                  <Icon size={18} className="md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8 overflow-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
