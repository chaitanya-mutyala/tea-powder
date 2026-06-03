import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { isLiveRazorpay } from '../config';
import { useAdminStore } from '../store/adminStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { items, clearCart } = useCartStore();
  const addOrder = useAdminStore(state => state.addOrder);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', address: '', city: '', zip: '' });

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isLiveRazorpay) {
      setTimeout(async () => {
        try {
          await addOrder({
            customer: formData,
            items,
            total,
            date: new Date().toISOString(),
            userId: user ? user.uid : 'guest'
          });
          await clearCart();
          setSuccess(true);
        } catch (error) {
          console.error("Order creation failed:", error);
          alert("Failed to place order: " + error.message + "\n\nDid you update your Firestore rules to allow guests to create orders?");
        } finally {
          setLoading(false);
        }
      }, 1500);
      return;
    }

    // Live Razorpay logic not fully implemented, falling back to mock behavior
    setLoading(false);
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="text-4xl font-serif text-emerald-950 mb-4">Payment Successful!</h1>
        <p className="text-lg text-stone-600 mb-8">Your order has been placed successfully. Thank you for choosing Ambati vari Tea podi.</p>
        <button onClick={() => navigate('/')} className="bg-emerald-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-800 transition-colors shadow-sm">
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <h2 className="text-3xl font-serif text-emerald-950 mb-6">Checkout</h2>
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
              <input required type="text" className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-colors" onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input required type="email" className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-colors" onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Address</label>
              <input required type="text" className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-colors" onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">City</label>
              <input required type="text" className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-colors" onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">ZIP Code</label>
              <input required type="text" className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-colors" onChange={e => setFormData({...formData, zip: e.target.value})} />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading || items.length === 0}
            className="w-full bg-emerald-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-emerald-800 transition-colors mt-8 disabled:opacity-50 shadow-sm"
          >
            {loading ? 'Processing...' : `Pay ₹${total}`}
          </button>
        </form>
      </div>
      <div className="bg-stone-100 p-8 rounded-xl border border-stone-200 h-fit shadow-sm">
        <h3 className="text-xl font-serif text-emerald-950 mb-6">Order Summary</h3>
        <ul className="divide-y divide-stone-300 mb-6">
          {items.map(item => (
            <li key={item.id} className="py-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-stone-900">{item.title}</p>
                <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
              </div>
              <span className="font-semibold text-stone-900">₹{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center text-xl font-bold text-emerald-950 pt-4 border-t border-stone-300">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>
    </div>
  );
}
