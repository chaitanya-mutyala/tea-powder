import React from 'react';
import { useAdminStore } from '../../store/adminStore';

export default function Dashboard() {
  const { products, orders } = useAdminStore();

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const lowStockProducts = products.filter(p => p.stock < 10);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div>
      <h1 className="text-3xl font-serif text-emerald-950 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <h3 className="text-stone-500 text-sm font-medium uppercase tracking-wider mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-emerald-950">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <h3 className="text-stone-500 text-sm font-medium uppercase tracking-wider mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-emerald-950">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-rose-200">
          <h3 className="text-stone-500 text-sm font-medium uppercase tracking-wider mb-2">Low Stock Alerts</h3>
          <p className="text-3xl font-bold text-rose-600">{lowStockProducts.length}</p>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
            <h2 className="text-lg font-serif font-semibold text-emerald-950">Low Stock Products</h2>
          </div>
          <ul className="divide-y divide-stone-200">
            {lowStockProducts.map(product => (
              <li key={product.id} className="px-6 py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-stone-900">{product.title}</p>
                  <p className="text-sm text-stone-500">{product.category} • {product.weight}</p>
                </div>
                <div className="text-rose-600 font-bold bg-rose-50 px-3 py-1 rounded-full text-sm">
                  Only {product.stock} left
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
