import React, { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { Plus, Edit2, Trash2, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadImageFile, deleteStorageFile } from '../../lib/appwrite';
import { formatPrice } from '../../lib/format';
import EmptyState from '../../components/ui/EmptyState';
import { Package } from 'lucide-react';

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialForm = { title: '', price: '', weight: '', stock: '', category: 'Dairy', description: '', image: '', keyFeatures: '', storageInfo: '' };
  const [formData, setFormData] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image must be under 5MB.');
        return;
      }
      setFormError('');
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormError('');
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setFormError('');

    try {
      let imageUrl = formData.image;
      const previousImage = formData.image;

      if (imageFile) {
        const { url } = await uploadImageFile(imageFile);
        imageUrl = url;
        if (editingId && previousImage && previousImage !== url) {
          await deleteStorageFile(previousImage);
        }
      }

      if (!imageUrl) {
        setFormError('Please upload a product image.');
        setUploading(false);
        return;
      }

      const data = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: imageUrl,
      };
      
      if (editingId) {
        await updateProduct(editingId, data);
      } else {
        await addProduct(data);
      }
      
      closeModal();
      setFormData(initialForm);
    } catch (error) {
      console.error("Error saving product:", error);
      setFormError('Failed to save product. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const openEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setImageFile(null);
    setImagePreview(product.image);
    setFormError('');
    setIsModalOpen(true);
  };

  const openNew = () => {
    setFormData(initialForm);
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const toggleStock = (product) => {
    updateProduct(product.id, { stock: product.stock > 0 ? 0 : 100 });
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.title}"? This cannot be undone.`)) return;
    try {
      if (product.image) await deleteStorageFile(product.image);
      await deleteProduct(product.id);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete product.');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-emerald-950 tracking-tight">Products</h1>
          <p className="text-sm text-stone-500 mt-1">{products.length} items in catalog</p>
        </div>
        <button type="button" onClick={openNew} className="btn-primary rounded-xl px-5 py-3 text-sm shrink-0 self-start sm:self-auto">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200/80">
          <EmptyState
            icon={Package}
            title="No products yet"
            description="Add your first product to start selling."
            action={<button type="button" onClick={openNew} className="btn-primary rounded-xl px-6 text-sm">Add Product</button>}
          />
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-xl border border-stone-200/80 p-4">
                <div className="flex gap-3">
                  <img src={product.image} alt={product.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-emerald-950 truncate">{product.title}</p>
                    <p className="text-xs text-stone-500">{product.category} · {product.weight}</p>
                    <p className="font-bold text-emerald-900 mt-1 tabular-nums">{formatPrice(product.price)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
                  <button type="button" onClick={() => toggleStock(product)} className={`px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase ${product.stock > 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </button>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openEdit(product)} className="btn-icon bg-stone-100 text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 min-w-10 min-h-10">
                      <Edit2 size={16} />
                    </button>
                    <button type="button" onClick={() => handleDelete(product)} className="btn-icon bg-stone-100 text-stone-600 hover:bg-rose-50 hover:text-rose-700 min-w-10 min-h-10">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-stone-200/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-stone-50/80 border-b border-stone-200">
                  <tr>
                    <th className="px-5 py-3.5 admin-section-title">Product</th>
                    <th className="px-5 py-3.5 admin-section-title">Category</th>
                    <th className="px-5 py-3.5 admin-section-title">Price</th>
                    <th className="px-5 py-3.5 admin-section-title">Stock</th>
                    <th className="px-5 py-3.5 admin-section-title text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.title} className="w-12 h-12 rounded-lg object-cover border border-stone-200" />
                          <div className="min-w-0">
                            <p className="font-medium text-emerald-950 truncate">{product.title}</p>
                            <p className="text-xs text-stone-500">{product.weight}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-stone-600">{product.category}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-emerald-900 tabular-nums">{formatPrice(product.price)}</td>
                      <td className="px-5 py-4">
                        <button type="button" onClick={() => toggleStock(product)} className={`px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase ${product.stock > 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button type="button" onClick={() => openEdit(product)} className="btn-icon bg-stone-100 text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 min-w-9 min-h-9">
                            <Edit2 size={16} />
                          </button>
                          <button type="button" onClick={() => handleDelete(product)} className="btn-icon bg-stone-100 text-stone-600 hover:bg-rose-50 hover:text-rose-700 min-w-9 min-h-9">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92dvh] flex flex-col">
            <div className="px-5 sm:px-6 py-4 border-b border-stone-100 flex justify-between items-center shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-emerald-950">{editingId ? 'Edit Product' : 'Add Product'}</h2>
              <button type="button" onClick={closeModal} className="btn-icon bg-stone-100 text-stone-500 hover:text-emerald-950 min-w-10 min-h-10 rounded-full">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5 sm:p-6 overflow-y-auto flex-1">
              <form id="product-form" onSubmit={handleSubmit} className="space-y-5">
                {formError && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{formError}</p>}

                <div>
                  <label className="block admin-section-title mb-3">Product Image</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden border-2 border-dashed border-stone-200 bg-stone-50 flex items-center justify-center relative">
                      {imagePreview ? (
                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <ImageIcon className="w-10 h-10 text-stone-300" />
                      )}
                      <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                    <p className="text-sm text-stone-500 text-center sm:text-left">PNG or JPG, up to 5MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block admin-section-title mb-2">Title</label>
                    <input required type="text" className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="block admin-section-title mb-2">Price (₹)</label>
                    <input required type="number" min="0" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                  <div>
                    <label className="block admin-section-title mb-2">Stock</label>
                    <input required type="number" min="0" className="input-field" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                  </div>
                  <div>
                    <label className="block admin-section-title mb-2">Weight / Volume</label>
                    <input required type="text" placeholder="500g, 1L" className="input-field" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
                  </div>
                  <div>
                    <label className="block admin-section-title mb-2">Category</label>
                    <select className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option>Dairy</option>
                      <option>Sweets</option>
                      <option>Tea</option>
                      <option>Spices</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block admin-section-title mb-2">Description</label>
                    <textarea required rows="3" className="input-field resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block admin-section-title mb-2">Key Features (one per line)</label>
                    <textarea rows="3" className="input-field resize-none" value={formData.keyFeatures || ''} onChange={e => setFormData({...formData, keyFeatures: e.target.value})} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block admin-section-title mb-2">Storage & Ingredients</label>
                    <textarea rows="2" className="input-field resize-none" value={formData.storageInfo || ''} onChange={e => setFormData({...formData, storageInfo: e.target.value})} />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-5 sm:px-6 py-4 border-t border-stone-100 flex justify-end gap-3 bg-stone-50/80 shrink-0 safe-bottom">
              <button type="button" onClick={closeModal} className="btn-ghost px-5 text-sm">Cancel</button>
              <button form="product-form" type="submit" disabled={uploading} className="btn-primary px-6 text-sm disabled:opacity-50">
                {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
