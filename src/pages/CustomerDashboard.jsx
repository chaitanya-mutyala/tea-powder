import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAdminStore } from '../store/adminStore';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { formatPrice, formatDate, formatReviewDate } from '../lib/format';
import ProductCard from '../components/ProductCard';
import StatusBadge from '../components/ui/StatusBadge';
import PageLoader from '../components/ui/PageLoader';
import EmptyState from '../components/ui/EmptyState';
import { User, Heart, ShoppingBag, Star, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CustomerDashboard() {
  const { user, logout } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const products = useAdminStore(state => state.products);
  
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const ordersQ = query(collection(db, 'orders'), where('userId', '==', user.uid));
        const ordersSnap = await getDocs(ordersQ);
        setOrders(
          ordersSnap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .sort((a, b) => new Date(b.date) - new Date(a.date))
        );

        const reviewsQ = query(collection(db, 'reviews'), where('userId', '==', user.uid));
        const reviewsSnap = await getDocs(reviewsQ);
        setReviews(reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const wishedProducts = products.filter(p => wishlistItems.includes(p.id));

  const tabs = [
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="bg-cream-50 min-h-screen py-6 sm:py-10 pb-24 sm:pb-10">
      <div className="page-container">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-emerald-950 mb-6 sm:mb-8">My Account</h1>
        
        {/* Mobile tab bar */}
        <div className="md:hidden flex gap-1 overflow-x-auto scrollbar-hide mb-5 -mx-4 px-4 pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 min-h-11 transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-950 text-gold-400'
                  : 'bg-white text-emerald-900/70 border border-cream-200'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          
          <div className="hidden md:block md:col-span-1">
            <div className="card p-4 sticky top-28">
              <div className="flex flex-col space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center p-3.5 rounded-xl transition-colors font-medium text-left text-sm min-h-11 ${
                      activeTab === tab.id
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-100'
                        : 'text-emerald-900/60 hover:bg-cream-50 hover:text-emerald-950'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-3 shrink-0" /> {tab.label}
                  </button>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-cream-200">
                <button type="button" onClick={logout} className="w-full text-center text-red-600 font-semibold py-3 hover:bg-red-50 rounded-xl transition-colors text-sm min-h-11">
                  Log Out
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="card p-5 sm:p-8 min-h-[24rem]">
              {loading ? (
                <PageLoader message="Loading your account..." />
              ) : (
                <>
                  {activeTab === 'orders' && (
                    <div>
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-emerald-950 mb-5 sm:mb-6">Order History</h2>
                      {orders.length === 0 ? (
                        <EmptyState
                          icon={Package}
                          title="No orders yet"
                          description="When you place an order, it will appear here."
                          action={<Link to="/" className="btn-primary rounded-full px-6 text-sm">Start Shopping</Link>}
                        />
                      ) : (
                        <div className="space-y-4 sm:space-y-5">
                          {orders.map(order => (
                            <div key={order.id} className="border border-cream-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-cream-50/50">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 pb-4 border-b border-cream-200">
                                <div className="min-w-0">
                                  <p className="text-xs text-emerald-900/60 truncate">#{order.id.slice(-8).toUpperCase()}</p>
                                  <p className="font-bold text-emerald-950 text-sm sm:text-base">{formatDate(order.date, { dateStyle: 'medium' })}</p>
                                </div>
                                <StatusBadge status={order.status} />
                              </div>
                              <div className="space-y-3">
                                {order.items?.map(item => (
                                  <div key={item.id} className="flex items-center gap-3">
                                    <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-emerald-950 text-sm line-clamp-1">{item.title}</p>
                                      <p className="text-xs text-emerald-900/60">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="font-bold text-emerald-900 text-sm tabular-nums shrink-0">{formatPrice(item.price * item.quantity)}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4 pt-4 border-t border-cream-200 flex justify-between items-center">
                                <span className="font-bold text-emerald-950 text-sm">Total</span>
                                <span className="text-lg sm:text-xl font-bold text-gold-600 tabular-nums">{formatPrice(order.total)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'wishlist' && (
                    <div>
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-emerald-950 mb-5 sm:mb-6">My Wishlist</h2>
                      {wishedProducts.length === 0 ? (
                        <EmptyState
                          icon={Heart}
                          title="Wishlist is empty"
                          description="Save products you love to find them quickly later."
                          action={<Link to="/" className="btn-primary rounded-full px-6 text-sm">Browse Products</Link>}
                        />
                      ) : (
                        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          {wishedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div>
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-emerald-950 mb-5 sm:mb-6">My Reviews</h2>
                      {reviews.length === 0 ? (
                        <EmptyState
                          icon={Star}
                          title="No reviews yet"
                          description="Share your experience after trying our products."
                          action={<Link to="/" className="btn-primary rounded-full px-6 text-sm">Shop Products</Link>}
                        />
                      ) : (
                        <div className="space-y-4">
                          {reviews.map(review => (
                            <div key={review.id} className="border border-cream-200 rounded-xl p-4 sm:p-6 bg-cream-50/50">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <div className="flex text-gold-400">
                                  {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-gold-400' : 'text-cream-300'}`} />)}
                                </div>
                                <span className="text-xs text-emerald-900/60">{formatReviewDate(review.createdAt)}</span>
                              </div>
                              <p className="text-emerald-900/80 mb-3 text-sm sm:text-base">{review.text}</p>
                              {review.images?.length > 0 && (
                                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                                  {review.images.map((img, i) => (
                                    <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded-lg shrink-0" />
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'profile' && (
                    <div>
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-emerald-950 mb-5 sm:mb-6">Profile</h2>
                      <div className="space-y-5 max-w-md">
                        <div>
                          <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2">Email</label>
                          <input type="email" disabled value={user.email} className="input-field bg-cream-100 text-emerald-900/60 cursor-not-allowed" />
                        </div>
                        <p className="text-sm text-emerald-900/60">To update your password or email, please contact support.</p>
                        <button type="button" onClick={logout} className="md:hidden w-full text-red-600 font-semibold py-3 border border-red-200 rounded-xl hover:bg-red-50 min-h-11">
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
