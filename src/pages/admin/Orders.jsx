import React, { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';

export default function Orders() {
  const { orders, updateOrderStatus } = useAdminStore();
  const [activeFilter, setActiveFilter] = useState('All');

  const statuses = ['Pending Payment', 'Paid / Processing', 'Shipped', 'Delivered'];
  const filters = ['All', ...statuses];

  const filteredOrders = activeFilter === 'All' 
    ? orders 
    : orders.filter(o => o.status === activeFilter);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateString));
  };

  return (
    <div>
      <h1 className="text-3xl font-serif text-emerald-950 mb-8">Order Management</h1>

      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors shadow-sm ${
              activeFilter === f ? 'bg-emerald-900 text-white' : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-stone-500">No orders found for this status.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-6 py-4 font-medium text-stone-500 uppercase tracking-wider text-sm">Order ID</th>
                <th className="px-6 py-4 font-medium text-stone-500 uppercase tracking-wider text-sm">Customer</th>
                <th className="px-6 py-4 font-medium text-stone-500 uppercase tracking-wider text-sm">Date</th>
                <th className="px-6 py-4 font-medium text-stone-500 uppercase tracking-wider text-sm">Total</th>
                <th className="px-6 py-4 font-medium text-stone-500 uppercase tracking-wider text-sm text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-stone-500">{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-stone-900">{order.customer.name}</p>
                    <p className="text-sm text-stone-500">{order.customer.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-600">{formatDate(order.date)}</td>
                  <td className="px-6 py-4 font-bold text-emerald-900">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="border border-stone-300 text-sm rounded-md p-1.5 outline-none focus:border-emerald-500 bg-white shadow-sm"
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
