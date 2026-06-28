import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAdminStore } from '../store/adminStore';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { useNavigate, Link } from 'react-router-dom';
import { uploadImageFile } from '../lib/appwrite';
import { formatPrice } from '../lib/format';
import { buildWhatsAppOrderUrl } from '../lib/whatsapp';
import { CheckCircle, UploadCloud, Loader2, MessageCircle } from 'lucide-react';

export default function Checkout() {
  const { items, clearCart } = useCartStore();
  const addOrder = useAdminStore(state => state.addOrder);
  const user = useAuthStore(state => state.user);
  const { settings } = useSettingsStore();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [success, setSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    utr: '',
  });
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [error, setError] = useState('');

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const upiId = settings.upiId || "merchant@upi";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be under 5MB.');
        return;
      }
      setError('');
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!screenshot || !formData.utr.trim()) {
      setError('Please provide the UTR number and upload the payment screenshot.');
      return;
    }
    setLoading(true);
    setError('');
    setUploadProgress('Uploading payment proof...');

    try {
      const { url: fileUrl, fileId } = await uploadImageFile(screenshot);
      setUploadProgress('Creating your order...');

      const orderPayload = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zip: formData.zip,
        },
        payment: {
          utr: formData.utr.trim(),
          screenshotUrl: fileUrl,
          screenshotId: fileId,
          method: 'UPI',
        },
        items,
        total,
        date: new Date().toISOString(),
        userId: user ? user.uid : 'guest',
        status: 'Pending Verification',
      };

      const docRef = await addOrder(orderPayload);
      
      await clearCart();
      setPlacedOrder({ ...orderPayload, id: docRef.id });
      setSuccess(true);
    } catch (err) {
      console.error("Order creation failed:", err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  if (items.length === 0 && !success) {
    return (
      <div className="page-container py-20 text-center">
        <p className="text-emerald-900/60 mb-6">Your cart is empty.</p>
        <Link to="/" className="btn-primary rounded-full px-8">Continue Shopping</Link>
      </div>
    );
  }

  if (success) {
    const whatsappUrl = buildWhatsAppOrderUrl(settings.whatsappNumber, {
      orderId: placedOrder?.id,
      customerName: formData.name,
      total: placedOrder?.total,
      items: placedOrder?.items,
    });

    return (
      <div className="page-container py-16 sm:py-24 min-h-[70vh] flex flex-col items-center justify-center text-center px-2">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 sm:mb-8">
          <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-emerald-950 mb-4 sm:mb-6 text-balance">Payment Pending Verification</h1>
        <p className="text-base sm:text-lg text-emerald-900/70 mb-8 sm:mb-10 leading-relaxed max-w-xl">
          Your order has been placed and is waiting for payment verification. We will notify you once it&apos;s confirmed. Thank you for choosing {settings.businessName}.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent rounded-full py-3.5 uppercase tracking-widest text-sm flex-1"
            >
              <MessageCircle className="w-5 h-5" /> Notify on WhatsApp
            </a>
          )}
          <button type="button" onClick={() => navigate('/')} className="btn-primary rounded-full py-3.5 uppercase tracking-widest text-sm flex-1">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 min-h-screen py-8 sm:py-12 lg:py-16 pb-32 lg:pb-16">
      <div className="page-container">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-emerald-950">Checkout</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">
          
          <div className="lg:col-span-3">
            <form id="checkout-form" onSubmit={handlePayment} className="space-y-6 sm:space-y-8">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm" role="alert">
                  {error}
                </div>
              )}

              <div className="card p-5 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-emerald-950 mb-5 sm:mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold shrink-0">1</span>
                  Shipping Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2">Full Name</label>
                    <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2">Email</label>
                    <input required type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2">Phone</label>
                    <input required type="tel" className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2">Full Address</label>
                    <input required type="text" className="input-field" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2">City</label>
                    <input required type="text" className="input-field" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2">ZIP Code</label>
                    <input required type="text" className="input-field" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="card p-5 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-emerald-950 mb-5 sm:mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold shrink-0">2</span>
                  Payment via UPI
                </h2>
                
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-cream-50 rounded-2xl border border-cream-200 flex flex-col sm:flex-row items-center gap-6">
                  <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm shrink-0">
                    {settings.qrImageUrl ? (
                       <img src={settings.qrImageUrl} alt="UPI QR Code" className="w-36 h-36 sm:w-40 sm:h-40 object-contain" />
                    ) : (
                       <div className="w-36 h-36 sm:w-40 sm:h-40 bg-cream-100 flex items-center justify-center text-emerald-900/40 text-xs text-center px-2 rounded-lg">QR code not configured</div>
                    )}
                  </div>
                  <div className="text-center sm:text-left min-w-0">
                    <p className="text-emerald-950 font-bold text-base sm:text-lg mb-2">Scan to pay with any UPI app</p>
                    <p className="text-emerald-900/60 mb-2 text-sm">or use UPI ID:</p>
                    <p className="font-mono text-base sm:text-lg text-emerald-700 bg-emerald-50 px-3 sm:px-4 py-2 rounded-lg inline-block border border-emerald-200 break-all">{upiId}</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2">12-Digit UTR / Ref Number</label>
                    <input required type="text" placeholder="e.g. 123456789012" className="input-field font-mono" value={formData.utr} onChange={e => setFormData({...formData, utr: e.target.value})} />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2">Payment Screenshot</label>
                    <div className="relative flex justify-center px-4 sm:px-6 pt-5 pb-6 border-2 border-cream-200 border-dashed rounded-xl bg-cream-50 hover:bg-cream-100/80 transition-colors cursor-pointer min-h-[10rem]">
                      {/* File input always sits on top — outside pointer-events-none so mobile taps work */}
                      <input
                        type="file"
                        required
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={handleFileChange}
                      />
                      {screenshotPreview ? (
                        <img src={screenshotPreview} alt="Payment screenshot preview" className="max-h-48 w-full object-contain pointer-events-none" />
                      ) : (
                        <div className="space-y-2 text-center pointer-events-none">
                          <UploadCloud className="mx-auto h-10 w-10 text-emerald-900/30" />
                          <p className="text-sm text-emerald-900/60">
                            <span className="font-semibold text-emerald-600">Tap to upload</span> payment screenshot
                          </p>
                          <p className="text-xs text-emerald-900/40">PNG or JPG, up to 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="flex w-full btn-accent rounded-full py-4 uppercase tracking-widest text-sm shadow-lg mt-6"
              >
                {loading ? (
                  <><Loader2 className="animate-spin h-5 w-5 mr-2" /> {uploadProgress || 'Processing...'}</>
                ) : (
                  `Confirm Payment of ${formatPrice(total)}`
                )}
              </button>
            </form>
          </div>
          
          <div className="lg:col-span-2">
            <div className="card p-5 sm:p-8 lg:sticky lg:top-28">
              <h3 className="text-lg sm:text-xl font-serif font-bold text-emerald-950 mb-5 sm:mb-6">Order Summary</h3>
              <ul className="divide-y divide-cream-100 mb-5 sm:mb-6 max-h-72 overflow-y-auto">
                {items.map(item => (
                  <li key={item.id} className="py-3 sm:py-4 flex gap-3 sm:gap-4">
                    <img src={item.image} alt={item.title} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover bg-cream-50 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-emerald-950 text-sm line-clamp-2">{item.title}</p>
                      <p className="text-xs text-emerald-900/60 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-emerald-900 text-sm tabular-nums shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              
              <div className="space-y-2 pt-4 border-t border-cream-200 mb-4 text-sm">
                <div className="flex justify-between text-emerald-900/70">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-emerald-900/70">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-lg sm:text-xl font-bold text-emerald-950 pt-4 border-t border-cream-200">
                <span>Total</span>
                <span className="text-xl sm:text-2xl text-gold-600 tabular-nums">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
