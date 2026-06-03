import React, { useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const products = useAdminStore((state) => state.products);
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Tea', 'Dairy', 'Sweets'];

  const filteredProducts = activeFilter === 'All' 
    ? products 
    : products.filter(p => p.category === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif text-emerald-950 mb-4">Artisanal Heritage</h1>
        <p className="text-stone-600 max-w-2xl mx-auto text-lg">
          Discover our premium collection of authentic teas, pure Vedic dairy, and traditional sweets crafted with generations of care.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center space-x-2 sm:space-x-4 mb-12 overflow-x-auto pb-4">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              activeFilter === category 
                ? 'bg-emerald-900 text-white shadow-md' 
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-stone-500 text-lg">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}
