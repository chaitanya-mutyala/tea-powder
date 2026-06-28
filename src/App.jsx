import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Banner from './components/Banner';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import PageLoader from './components/ui/PageLoader';
import ScrollToTop from './components/ScrollToTop';
import { useAuthStore } from './store/authStore';
import { useAdminStore } from './store/adminStore';
import { useSettingsStore } from './store/settingsStore';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Products = lazy(() => import('./pages/admin/Products'));
const Orders = lazy(() => import('./pages/admin/Orders'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-cream-50 text-emerald-950 font-sans overflow-x-hidden">
          <Banner />
          <Navbar />
          <main className="flex-grow w-full overflow-x-hidden">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
