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
    <div className="flex min-h-[calc(100vh-64px)] bg-stone-100">
      <aside className="w-64 bg-white border-r border-stone-200">
        <div className="p-6">
          <h2 className="text-xl font-serif font-bold text-emerald-950 mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = link.exact 
                ? location.pathname === link.path 
                : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-emerald-50 text-emerald-900 font-medium' : 'text-stone-600 hover:bg-stone-50 hover:text-emerald-800'
                  }`}
                >
                  <Icon size={20} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
