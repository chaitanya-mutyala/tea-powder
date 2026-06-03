import React from 'react';
import { useCartStore } from '../store/cartStore';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeFromCart } = useCartStore();
  const navigate = useNavigate();

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-serif text-emerald-950 mb-4">Your Bag is Empty</h2>
        <p className="text-stone-600 mb-8">Looks like you haven't added any items to your bag yet.</p>
        <Link to="/" className="inline-block bg-emerald-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-800 transition-colors shadow-sm">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif text-emerald-950 mb-8">Your Bag</h1>
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 md:p-8">
        <ul className="divide-y divide-stone-200 mb-8">
          {items.map((item) => (
            <li key={item.id} className="py-6 flex flex-col sm:flex-row items-center gap-6">
              <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-lg bg-stone-100" />
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-lg font-serif font-semibold text-emerald-950 mb-1">{item.title}</h3>
                <p className="text-sm text-stone-500">{item.weight}</p>
                <div className="mt-2 font-bold text-emerald-900">{formatPrice(item.price)}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-stone-100 text-stone-600 transition-colors">
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-medium text-stone-900">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-stone-100 text-stone-600 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="border-t border-stone-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-xl font-medium text-stone-900">
            Total: <span className="text-2xl font-bold text-emerald-950 ml-2">{formatPrice(total)}</span>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full sm:w-auto bg-amber-500 text-amber-950 px-10 py-3 rounded-lg font-bold text-lg hover:bg-amber-400 transition-colors shadow-sm"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
