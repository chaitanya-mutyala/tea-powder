import React, { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { ChevronDown, ChevronUp, MapPin, Package, User, Calendar, FileText, CheckCircle, XCircle, Truck, PackageCheck, AlertCircle } from 'lucide-react';
import { formatPrice, formatDate } from '../../lib/format';
import { getFileViewUrl } from '../../lib/appwrite';
import { ORDER_STATUSES } from '../../lib/orderStatus';
import EmptyState from '../../components/ui/EmptyState';

export default function Orders() {
  const { orders, updateOrderStatus } = useAdminStore();
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const filters = ['All', ...ORDER_STATUSES];

  const filteredOrders = activeFilter === 'All' 
    ? [...orders].sort((a, b) => new Date(b.date) - new Date(a.date))
    : orders.filter(o => o.status === activeFilter).sort((a, b) => new Date(b.date) - new Date(a.date));

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div className="pb-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-emerald-950 tracking-tight">Orders</h1>
        <p className="text-sm text-stone-500 mt-1">{orders.length} total orders</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {filters.map(f => (
          <button
            key={f}
            type="button"
            onClick={() => setActiveFilter(f)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide whitespace-nowrap shrink-0 min-h-10 transition-colors border ${
              activeFilter === f ? 'bg-emerald-950 text-gold-400 border-emerald-950' : 'bg-white text-stone-600 hover:bg-stone-50 border-stone-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200/80">
            <EmptyState title="No orders found" description="Orders matching this filter will appear here." />
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl border border-stone-200/80 overflow-hidden hover:border-stone-300 transition-colors">
              
              <div
                className="p-4 sm:p-5 cursor-pointer hover:bg-stone-50/50 transition-colors"
                onClick={() => toggleExpand(order.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleExpand(order.id); } }}
                role="button"
                tabIndex={0}
                aria-expanded={expandedOrderId === order.id}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="font-mono text-xs font-semibold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-xs text-stone-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {formatDate(order.date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-stone-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-emerald-950 text-sm truncate">{order.customer?.name || 'Guest'}</p>
                        <p className="text-xs text-stone-500 truncate">{order.customer?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-0 border-stone-100">
                    <p className="font-semibold text-emerald-950 tabular-nums">{formatPrice(order.total)}</p>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="input-field py-2 text-xs font-semibold uppercase max-w-[10rem] sm:max-w-none"
                      >
                        {ORDER_STATUSES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {expandedOrderId === order.id ? <ChevronUp className="w-5 h-5 text-stone-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />}
                    </div>
                  </div>
                </div>
              </div>

              {expandedOrderId === order.id && (
                <div className="border-t border-stone-100 bg-stone-50/50">
                  
                  <div className="p-3 sm:p-4 bg-emerald-950 flex flex-wrap gap-2 items-center">
                     <p className="text-gold-400 font-semibold uppercase tracking-wider text-[10px] w-full sm:w-auto sm:mr-2">Quick actions</p>
                     {order.status === 'Pending Verification' && (
                       <>
                         <button type="button" onClick={() => updateOrderStatus(order.id, 'Paid / Processing')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center min-h-10">
                           <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Approve
                         </button>
                         <button type="button" onClick={() => updateOrderStatus(order.id, 'Cancelled')} className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center min-h-10">
                           <XCircle className="w-3.5 h-3.5 mr-1.5" /> Reject
                         </button>
                       </>
                     )}
                     {['Paid / Processing', 'Packed'].includes(order.status) && (
                       <>
                         <button type="button" onClick={() => updateOrderStatus(order.id, 'Packed')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center min-h-10">
                           <PackageCheck className="w-3.5 h-3.5 mr-1.5" /> Packed
                         </button>
                         <button type="button" onClick={() => updateOrderStatus(order.id, 'Shipped')} className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center min-h-10">
                           <Truck className="w-3.5 h-3.5 mr-1.5" /> Shipped
                         </button>
                       </>
                     )}
                     {order.status === 'Shipped' && (
                       <button type="button" onClick={() => updateOrderStatus(order.id, 'Delivered')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center min-h-10">
                         <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Delivered
                       </button>
                     )}
                     {!['Cancelled', 'Delivered'].includes(order.status) && (
                       <button type="button" onClick={() => updateOrderStatus(order.id, 'Cancelled')} className="bg-stone-700 hover:bg-stone-600 text-white px-3 py-2 rounded-lg text-xs font-semibold min-h-10 ml-auto">
                         Cancel
                       </button>
                     )}
                  </div>

                  <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                    <div>
                      <h3 className="admin-section-title mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Payment
                      </h3>
                      <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
                        <div>
                           <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">Method</p>
                           <p className="text-sm font-medium text-emerald-950">{order.payment?.method || 'UPI'}</p>
                        </div>
                        <div>
                           <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">UTR</p>
                           <p className="font-mono text-sm font-medium text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-100 break-all">{order.payment?.utr || 'N/A'}</p>
                        </div>
                         {(() => {
                            const imgSrc = order.payment?.screenshotUrl || (order.payment?.screenshotId ? getFileViewUrl(order.payment.screenshotId) : null);
                            if (!imgSrc) return null;
                            return (
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-2">Screenshot</p>
                                <a href={imgSrc} target="_blank" rel="noopener noreferrer" className="block group relative overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
                                  <img src={imgSrc} alt="Payment proof" className="w-full max-h-48 object-contain transition-transform group-hover:scale-105" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                                    Click to View Full Image
                                  </div>
                                </a>
                              </div>
                            );
                         })()}
                        {order.status === 'Pending Verification' && (
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-orange-800">Verify UTR and screenshot before approving.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="admin-section-title mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Shipping
                      </h3>
                      <div className="bg-white p-4 rounded-xl border border-stone-200">
                        <p className="font-medium text-emerald-950">{order.customer?.name}</p>
                        <p className="text-xs text-stone-500 mt-1 break-all">{order.customer?.email}</p>
                        <p className="text-xs text-stone-500">{order.customer?.phone}</p>
                        <div className="pt-3 mt-3 border-t border-stone-100 text-sm text-emerald-950 leading-relaxed">
                          {order.customer?.address}<br />
                          {order.customer?.city}, {order.customer?.zip}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="admin-section-title mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4" /> Items
                      </h3>
                      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                        <ul className="divide-y divide-stone-100 max-h-64 overflow-y-auto">
                          {order.items?.map((item, index) => (
                            <li key={index} className="p-3 flex gap-3 items-center">
                              <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover bg-stone-50 shrink-0" />
                              <div className="flex-grow min-w-0">
                                <p className="font-medium text-emerald-950 text-sm truncate">{item.title}</p>
                                <p className="text-xs text-stone-500">Qty {item.quantity} × {formatPrice(item.price)}</p>
                              </div>
                              <p className="font-semibold text-sm tabular-nums shrink-0">{formatPrice(item.price * item.quantity)}</p>
                            </li>
                          ))}
                        </ul>
                        <div className="p-3 bg-stone-50 border-t border-stone-100 flex justify-between items-center">
                          <span className="admin-section-title">Total</span>
                          <span className="font-semibold text-emerald-950 tabular-nums">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
