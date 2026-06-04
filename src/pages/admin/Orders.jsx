import React, { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { ChevronDown, ChevronUp, MapPin, Package, User, Calendar } from 'lucide-react';

export default function Orders() {
  const { orders, updateOrderStatus } = useAdminStore();
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const statuses = ['Pending Payment', 'Paid / Processing', 'Shipped', 'Delivered'];
  const filters = ['All', ...statuses];

  const filteredOrders = activeFilter === 'All' 
    ? orders 
    : orders.filter(o => o.status === activeFilter);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  const formatDate = (dateString) => {
    try {
      return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateString));
    } catch(e) {
      return dateString || 'Unknown Date';
    }
  };

  const toggleExpand = (id) => {
    if (expandedOrderId === id) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(id);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl font-serif text-emerald-950 mb-6">Order Management</h1>

      {/* Mobile-friendly horizontal scrolling filters */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-sm border ${
              activeFilter === f ? 'bg-emerald-900 text-white border-emerald-900' : 'bg-white text-stone-600 hover:bg-stone-50 border-stone-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-stone-200 text-stone-500">
            No orders found.
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden transition-all duration-200">
              
              {/* Card Header (Always Visible) */}
              <div 
                className="p-4 sm:p-5 cursor-pointer hover:bg-stone-50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
                onClick={() => toggleExpand(order.id)}
              >
                {/* Left Side: Order Meta */}
                <div className="flex flex-col gap-2 w-full lg:w-auto flex-grow">
                  <div className="flex items-center justify-between lg:justify-start gap-3">
                    <span className="font-mono text-sm text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                      #{order.id.slice(-8)}
                    </span>
                    <span className="text-sm text-stone-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {formatDate(order.date)}
                    </span>
                    {/* Mobile Expand Icon */}
                    <div className="lg:hidden text-stone-400 p-1">
                      {expandedOrderId === order.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-stone-400" />
                    <span className="font-medium text-stone-900">{order.customer?.name || 'Guest Customer'}</span>
                    <span className="text-sm text-stone-500 hidden sm:inline-block ml-2 border-l pl-2 border-stone-300">
                      {order.customer?.email}
                    </span>
                  </div>
                </div>

                {/* Right Side: Price & Status */}
                <div className="flex items-center justify-between w-full lg:w-auto gap-4 lg:gap-6 pt-3 border-t border-stone-100 lg:pt-0 lg:border-0">
                  <div className="text-left lg:text-right">
                    <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Total</p>
                    <p className="font-bold text-emerald-950 text-lg">{formatPrice(order.total)}</p>
                  </div>
                  
                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`text-sm rounded-lg p-2 outline-none font-medium border-2 shadow-sm appearance-none cursor-pointer pr-8 ${
                        order.status === 'Delivered' ? 'bg-green-50 border-green-200 text-green-800' :
                        order.status === 'Shipped' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                        order.status === 'Paid / Processing' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                        'bg-stone-50 border-stone-200 text-stone-700'
                      }`}
                      style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    
                    {/* Desktop Expand Icon */}
                    <div className="hidden lg:block text-stone-400 p-1 hover:bg-stone-200 rounded-full transition-colors">
                      {expandedOrderId === order.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body (Expanded Details) */}
              {expandedOrderId === order.id && (
                <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  
                  {/* Shipping Details */}
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-700" />
                      Shipping Details
                    </h3>
                    <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
                      <p className="font-medium text-stone-900">{order.customer?.name}</p>
                      <p className="text-stone-600 text-sm mb-3">{order.customer?.email}</p>
                      <div className="pt-3 border-t border-stone-100">
                        <p className="text-stone-700 text-sm leading-relaxed">
                          {order.customer?.address}<br />
                          {order.customer?.city}, {order.customer?.zip}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Package className="w-4 h-4 text-emerald-700" />
                      Ordered Items
                    </h3>
                    <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
                      <ul className="divide-y divide-stone-100 max-h-64 overflow-y-auto">
                        {order.items?.map((item, index) => (
                          <li key={index} className="p-3 sm:p-4 flex gap-3 sm:gap-4 items-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 bg-stone-100 rounded-md overflow-hidden border border-stone-100">
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="text-sm font-medium text-stone-900 truncate">{item.title}</p>
                              <p className="text-xs text-stone-500 mt-0.5">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                            </div>
                            <div className="text-right flex-shrink-0 pl-2">
                              <p className="font-medium text-emerald-900 text-sm">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-between items-center">
                        <span className="text-sm font-bold text-stone-600 uppercase tracking-wider">Subtotal</span>
                        <span className="font-bold text-emerald-950 text-lg">{formatPrice(order.total)}</span>
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
