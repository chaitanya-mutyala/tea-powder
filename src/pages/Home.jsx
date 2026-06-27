import React, { useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { useSettingsStore } from '../store/settingsStore';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { ArrowRight, Star, ShieldCheck, Truck, Droplets, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function Home() {
  const products = useAdminStore((state) => state.products);
  const { settings } = useSettingsStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('All');

  const searchQuery = (searchParams.get('q') || '').trim().toLowerCase();

  const categories = ['All', ...new Set(products.map(p => p.category))].filter(Boolean);

  const searchFiltered = searchQuery
    ? products.filter(p =>
        [p.title, p.category, p.description].some(
          field => field?.toLowerCase().includes(searchQuery)
        )
      )
    : products;

  const filteredProducts = activeFilter === 'All' 
    ? searchFiltered 
    : searchFiltered.filter(p => p.category === activeFilter);

  const isLoading = products.length === 0;

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Hero Section — layout preserved */}
      <section className="relative bg-emerald-950 text-cream-50 overflow-hidden py-20 sm:py-24 lg:py-32">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 to-transparent"></div>
        <div className="page-container relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold mb-5 sm:mb-6 text-gold-400 tracking-tight leading-tight text-balance">
            {settings.heroTitle || "Premium Quality Dairy Products"}
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-emerald-100 max-w-3xl mx-auto mb-8 sm:mb-10 font-light px-2">
            {settings.heroSubtitle || "Fresh from the farm to your doorstep. Experience the richness of authentic dairy."}
          </p>
          <div className="flex justify-center">
            <a href="#products" className="btn-accent px-8 py-3.5 sm:py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-lg hover:-translate-y-0.5">
              Shop Now
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 sm:py-12 bg-cream-100">
        <div className="page-container grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          <div className="flex flex-col items-center text-center p-5 sm:p-6 bg-white rounded-2xl shadow-sm border border-cream-200">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <Droplets className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-emerald-950 mb-2">100% Pure</h3>
            <p className="text-sm sm:text-base text-emerald-900/70">Unadulterated, farm-fresh goodness in every drop.</p>
          </div>
          <div className="flex flex-col items-center text-center p-5 sm:p-6 bg-white rounded-2xl shadow-sm border border-cream-200">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gold-50 text-gold-600 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-emerald-950 mb-2">Quality Assured</h3>
            <p className="text-sm sm:text-base text-emerald-900/70">Rigorous testing ensures the highest safety standards.</p>
          </div>
          <div className="flex flex-col items-center text-center p-5 sm:p-6 bg-white rounded-2xl shadow-sm border border-cream-200">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <Truck className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-emerald-950 mb-2">Fast Delivery</h3>
            <p className="text-sm sm:text-base text-emerald-900/70">{settings.deliveryEstimate || "2-3 Business Days"} delivery straight to your door.</p>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 sm:py-20 bg-cream-50">
        <div className="page-container">
          <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12">
            <div className="flex-1 w-full">
              <img src="https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=1000&auto=format&fit=crop" alt="Brand Story" className="rounded-2xl sm:rounded-3xl shadow-2xl w-full aspect-[4/3] object-cover" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-emerald-950 mb-5 sm:mb-6">Our Heritage</h2>
              <p className="text-base sm:text-lg text-emerald-900/80 mb-5 sm:mb-6 leading-relaxed">
                At {settings.businessName}, we believe in preserving the authentic taste of tradition. Our products are crafted with generations of care, bringing you the purest dairy products directly from the heart of Konaseema.
              </p>
              <p className="text-base sm:text-lg text-emerald-900/80 mb-6 sm:mb-8 leading-relaxed">
                Every product is a testament to our commitment to quality, purity, and the rich heritage we proudly uphold.
              </p>
              <button type="button" className="flex items-center text-gold-600 font-bold tracking-widest uppercase text-sm hover:text-gold-500 transition-colors">
                Discover Our Story <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-16 sm:py-20 bg-white scroll-mt-20">
        <div className="page-container">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-emerald-950 mb-4">Our Best Sellers</h2>
            <div className="w-20 sm:w-24 h-1 bg-gold-400 mx-auto rounded-full"></div>
          </div>

          {searchQuery && (
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-emerald-900/60">Results for &ldquo;{searchParams.get('q')}&rdquo;</span>
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="text-emerald-700 font-semibold hover:text-gold-600 underline-offset-2 hover:underline"
              >
                Clear
              </button>
            </div>
          )}
          
          {/* Filter Tabs */}
          <div className="flex justify-start sm:justify-center gap-2 mb-8 sm:mb-12 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveFilter(category)}
                className={`px-5 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 whitespace-nowrap shrink-0 min-h-11 ${
                  activeFilter === category 
                    ? 'bg-emerald-950 text-gold-400 shadow-md' 
                    : 'bg-cream-100 text-emerald-900/60 hover:bg-cream-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
              {[1, 2, 3, 4].map(i => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title={searchQuery ? 'No products found' : 'More products coming soon'}
              description={searchQuery ? 'Try a different search term or browse all categories.' : 'Check back soon for fresh additions to our catalog.'}
              action={searchQuery ? (
                <button type="button" onClick={() => setSearchParams({})} className="btn-primary rounded-full px-6">
                  View All Products
                </button>
              ) : null}
            />
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 bg-emerald-950 text-cream-50">
        <div className="page-container text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gold-400 mb-10 sm:mb-16">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            {[1,2,3].map((i) => (
              <div key={i} className="bg-emerald-900/50 p-6 sm:p-8 rounded-2xl border border-emerald-800/80 backdrop-blur-sm text-left sm:text-center">
                <div className="flex sm:justify-center mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 fill-gold-400" />)}
                </div>
                <p className="text-emerald-100 italic mb-5 sm:mb-6 text-sm sm:text-base leading-relaxed">&ldquo;The quality is unmatched. I&apos;ve never tasted milk so pure. It reminds me of my childhood!&rdquo;</p>
                <p className="font-bold text-gold-400 uppercase tracking-widest text-xs sm:text-sm">— Satisfied Customer</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
