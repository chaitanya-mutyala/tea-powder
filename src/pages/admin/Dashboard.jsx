import React, { useMemo } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { formatPrice, formatDate } from '../../lib/format';
import StatusBadge from '../../components/ui/StatusBadge';
import { DollarSign, ShoppingBag, AlertCircle, CheckCircle, XCircle, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { products, orders } = useAdminStore();

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);
    const today = new Date().toDateString();
    return {
      totalRevenue,
      totalOrders: orders.length,
      pendingVerification: orders.filter(o => o.status === 'Pending Verification').length,
      pendingOrders: orders.filter(o => ['Pending Payment', 'Paid / Processing'].includes(o.status)).length,
      deliveredOrders: orders.filter(o => o.status === 'Delivered').length,
      cancelledOrders: orders.filter(o => o.status === 'Cancelled').length,
      todaysOrders: orders.filter(o => new Date(o.date).toDateString() === today).length,
      lowStockProducts: products.filter(p => p.stock < 10),
      recentOrders: [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    };
  }, [products, orders]);

  const cards = [
    { label: 'Revenue', value: formatPrice(stats.totalRevenue), icon: DollarSign, href: '/admin/orders' },
    { label: 'Today', value: stats.todaysOrders, icon: ShoppingBag, href: '/admin/orders' },
    { label: 'Verify', value: stats.pendingVerification, icon: AlertCircle, href: '/admin/orders', highlight: stats.pendingVerification > 0 },
    { label: 'Processing', value: stats.pendingOrders, icon: Clock, href: '/admin/orders' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-emerald-950 tracking-tight">Overview</h1>
        <p className="text-sm text-stone-500 mt-1">Store performance at a glance</p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => (
          <Link key={card.label} to={card.href} className={`admin-stat-card group ${card.highlight ? 'border-orange-200 bg-orange-50/30' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.highlight ? 'bg-orange-100 text-orange-700' : 'bg-stone-100 text-stone-600'}`}>
                <card.icon className="w-4 h-4" strokeWidth={2} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
            </div>
            <p className="admin-section-title mb-1">{card.label}</p>
            <p className="text-xl sm:text-2xl font-semibold text-emerald-950 tabular-nums">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200/80 overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-emerald-950">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs font-medium text-emerald-700 hover:text-emerald-900">View all</Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="p-8 text-sm text-stone-500 text-center">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {stats.recentOrders.map(order => (
                <li key={order.id} className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-stone-50/80 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-emerald-950 truncate">{order.customer?.name || 'Guest'}</p>
                    <p className="text-xs text-stone-500">{formatDate(order.date, { dateStyle: 'medium' })}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-emerald-950 tabular-nums hidden sm:inline">{formatPrice(order.total)}</span>
                    <StatusBadge status={order.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl border border-stone-200/80 overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-stone-100">
            <h2 className="text-sm font-semibold text-emerald-950">Fulfillment</h2>
          </div>
          <div className="p-4 sm:p-5 space-y-4">
            {[
              { label: 'Delivered', value: stats.deliveredOrders, icon: CheckCircle, color: 'text-emerald-600' },
              { label: 'Cancelled', value: stats.cancelledOrders, icon: XCircle, color: 'text-rose-600' },
              { label: 'Total orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-stone-600' },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <row.icon className={`w-4 h-4 ${row.color}`} /> {row.label}
                </div>
                <span className="font-semibold text-emerald-950 tabular-nums">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {stats.lowStockProducts.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200/80 overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-stone-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-semibold text-emerald-950">Low Stock</h2>
            <Link to="/admin/products" className="ml-auto text-xs font-medium text-emerald-700 hover:text-emerald-900">Manage</Link>
          </div>
          <ul className="divide-y divide-stone-100">
            {stats.lowStockProducts.map(product => (
              <li key={product.id} className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={product.image} className="w-10 h-10 rounded-lg object-cover shrink-0" alt="" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-emerald-950 truncate">{product.title}</p>
                    <p className="text-xs text-stone-500 truncate">{product.category} · {product.weight}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md shrink-0">{product.stock} left</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
