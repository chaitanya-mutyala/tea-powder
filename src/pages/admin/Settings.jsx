import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { Save, Loader2, Check, Image as ImageIcon } from 'lucide-react';
import { uploadImageFile, deleteStorageFile } from '../../lib/appwrite';
import PageLoader from '../../components/ui/PageLoader';

export default function Settings() {
  const { settings, updateSettings, loading } = useSettingsStore();
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  const [qrFile, setQrFile] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
      setQrPreview(settings.qrImageUrl || null);
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSaveError('QR image must be under 5MB.');
        return;
      }
      setSaveError('');
      setQrFile(file);
      setQrPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    try {
      let finalQrUrl = formData.qrImageUrl;
      const previousQr = formData.qrImageUrl;

      if (qrFile) {
        const { url } = await uploadImageFile(qrFile);
        finalQrUrl = url;
        if (previousQr && previousQr !== url) {
          try {
            await deleteStorageFile(previousQr);
          } catch (e) {
            console.warn("Failed to delete previous QR image:", e);
          }
        }
      }

      const updatedSettings = { ...formData, qrImageUrl: finalQrUrl };
      
      await updateSettings(updatedSettings);
      setFormData(updatedSettings);
      setQrFile(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Settings save error:", error);
      setSaveError(error.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading && Object.keys(formData).length === 0) {
    return <PageLoader message="Loading settings..." />;
  }

  return (
    <div className="max-w-3xl pb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-emerald-950 tracking-tight">Settings</h1>
          <p className="text-sm text-stone-500 mt-1">Store configuration and checkout details</p>
        </div>
        <button 
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="btn-primary rounded-xl px-5 py-3 text-sm self-start sm:self-auto disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      {saveError && (
        <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{saveError}</div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        
        <section className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200/80">
          <h2 className="text-base font-semibold text-emerald-950 mb-5">General</h2>
          <div className="space-y-4">
            <div>
              <label className="block admin-section-title mb-2">Business Name</label>
              <input type="text" name="businessName" value={formData.businessName || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block admin-section-title mb-2">SEO Description</label>
              <textarea name="seoDescription" value={formData.seoDescription || ''} onChange={handleChange} rows="2" className="input-field resize-none" />
            </div>
          </div>
        </section>

        <section className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200/80">
          <h2 className="text-base font-semibold text-emerald-950 mb-5">Home Hero</h2>
          <div className="space-y-4">
            <div>
              <label className="block admin-section-title mb-2">Hero Title</label>
              <input type="text" name="heroTitle" value={formData.heroTitle || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block admin-section-title mb-2">Hero Subtitle</label>
              <input type="text" name="heroSubtitle" value={formData.heroSubtitle || ''} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </section>

        <section className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200/80">
          <h2 className="text-base font-semibold text-emerald-950 mb-5">Contact & Social</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block admin-section-title mb-2">Email</label>
              <input type="email" name="contactEmail" value={formData.contactEmail || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block admin-section-title mb-2">Phone</label>
              <input type="text" name="contactPhone" value={formData.contactPhone || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block admin-section-title mb-2">WhatsApp</label>
              <input type="text" name="whatsappNumber" value={formData.whatsappNumber || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block admin-section-title mb-2">Instagram</label>
              <input type="url" name="instagramUrl" value={formData.instagramUrl || ''} onChange={handleChange} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="block admin-section-title mb-2">Address</label>
              <input type="text" name="address" value={formData.address || ''} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </section>

        <section className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200/80">
          <h2 className="text-base font-semibold text-emerald-950 mb-5">Payment</h2>
          <div className="space-y-5">
            <div>
              <label className="block admin-section-title mb-2">UPI ID</label>
              <input type="text" name="upiId" value={formData.upiId || ''} onChange={handleChange} className="input-field font-mono" />
            </div>
            
            <div>
              <label className="block admin-section-title mb-3">UPI QR Code</label>
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden border-2 border-dashed border-stone-200 bg-white flex items-center justify-center relative">
                  {qrPreview ? (
                    <img src={qrPreview} className="w-full h-full object-contain" alt="QR preview" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-stone-300" />
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
                <p className="text-sm text-stone-500 text-center sm:text-left">Shown at checkout. PNG or JPG, up to 5MB.</p>
              </div>
            </div>

            <div>
              <label className="block admin-section-title mb-2">Delivery Estimate</label>
              <input type="text" name="deliveryEstimate" value={formData.deliveryEstimate || ''} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </section>

      </form>
    </div>
  );
}
