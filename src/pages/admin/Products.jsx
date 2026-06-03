import React, { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', price: '', weight: '', stock: '', category: 'Tea', image: '', description: '' });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData, price: Number(formData.price), stock: Number(formData.stock) };
    if (editingId) {
      updateProduct(editingId, data);
    } else {
      addProduct(data);
    }
    setIsModalOpen(false);
    setEditingId(null);
  };

  const openEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  const openNew = () => {
    setFormData({ title: '', price: '', weight: '', stock: '', category: 'Tea', image: '', description: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const toggleStock = (product) => {
    updateProduct(product.id, { stock: product.stock > 0 ? 0 : 10 });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-emerald-950">Products</h1>
        <button onClick={openNew} className="bg-emerald-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-800 transition-colors shadow-sm">
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="px-6 py-4 font-medium text-stone-500 uppercase tracking-wider text-sm">Product</th>
              <th className="px-6 py-4 font-medium text-stone-500 uppercase tracking-wider text-sm">Category</th>
              <th className="px-6 py-4 font-medium text-stone-500 uppercase tracking-wider text-sm">Price</th>
              <th className="px-6 py-4 font-medium text-stone-500 uppercase tracking-wider text-sm">Stock</th>
              <th className="px-6 py-4 font-medium text-stone-500 uppercase tracking-wider text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={product.image} alt={product.title} className="w-12 h-12 rounded-lg object-cover bg-stone-100 border border-stone-200" />
                    <div>
                      <p className="font-medium text-emerald-950">{product.title}</p>
                      <p className="text-sm text-stone-500">{product.weight}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-stone-600">{product.category}</td>
                <td className="px-6 py-4 text-emerald-900 font-medium">{formatPrice(product.price)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {product.stock} in stock
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => toggleStock(product)} className="text-xs font-medium text-stone-500 hover:text-stone-900 border border-stone-300 rounded px-2 py-1 transition-colors">
                      Toggle Stock
                    </button>
                    <button onClick={() => openEdit(product)} className="p-2 text-stone-400 hover:text-emerald-600 transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="p-2 text-stone-400 hover:text-rose-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-stone-200 flex justify-between items-center">
              <h2 className="text-xl font-serif text-emerald-950">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                  <input required type="text" className="w-full p-2 border border-stone-300 rounded-md outline-none focus:border-emerald-500 transition-colors" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Price (₹)</label>
                    <input required type="number" min="0" className="w-full p-2 border border-stone-300 rounded-md outline-none focus:border-emerald-500 transition-colors" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Stock</label>
                    <input required type="number" min="0" className="w-full p-2 border border-stone-300 rounded-md outline-none focus:border-emerald-500 transition-colors" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Weight</label>
                    <input required type="text" placeholder="e.g. 500g, 250ml" className="w-full p-2 border border-stone-300 rounded-md outline-none focus:border-emerald-500 transition-colors" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                    <select className="w-full p-2 border border-stone-300 rounded-md outline-none focus:border-emerald-500 transition-colors" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option>Tea</option>
                      <option>Dairy</option>
                      <option>Sweets</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Image URL</label>
                  <input required type="url" className="w-full p-2 border border-stone-300 rounded-md outline-none focus:border-emerald-500 transition-colors" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                  <textarea required rows="3" className="w-full p-2 border border-stone-300 rounded-md outline-none focus:border-emerald-500 transition-colors" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-stone-200 flex justify-end gap-3 bg-stone-50 rounded-b-xl">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-stone-600 font-medium hover:bg-stone-200 rounded-md transition-colors">Cancel</button>
              <button form="product-form" type="submit" className="bg-emerald-900 text-white px-6 py-2 rounded-md font-medium hover:bg-emerald-800 transition-colors shadow-sm">Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
