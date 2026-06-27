import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Banner from './components/Banner';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Settings from './pages/admin/Settings';
import PageLoader from './components/ui/PageLoader';
import { useAuthStore } from './store/authStore';
import { useAdminStore } from './store/adminStore';
import { useSettingsStore } from './store/settingsStore';

function App() {
  const initAuthListener = useAuthStore(state => state.initAuthListener);
  const initListeners = useAdminStore(state => state.initListeners);
  const initSettingsListener = useSettingsStore(state => state.initSettingsListener);
  const { settings, loading } = useSettingsStore();

  useEffect(() => {
    initAuthListener();
    const unsubAdmin = initListeners();
    const unsubSettings = initSettingsListener();
    return () => {
      unsubAdmin?.();
      if (unsubSettings) unsubSettings();
    };
  }, [initAuthListener, initListeners, initSettingsListener]);

  if (loading) {
    return <PageLoader message={`Loading ${settings.businessName}...`} />;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-cream-50 text-emerald-950 font-sans overflow-x-hidden">
        <Banner />
        <Navbar />
        <main className="flex-grow w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout />
                </ProtectedRoute>
              } 
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
