import React, { useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { useSettingsStore } from '../store/settingsStore';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { ArrowRight, Star, ShieldCheck, Truck, Leaf, Search, ChevronRight } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function Home() {
  const products = useAdminStore((state) => state.products);
  const productsLoaded = useAdminStore((state) => state.productsLoaded);
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

  const isLoading = !productsLoaded;

  const features = [
    {
      icon: Leaf,
      title: '100% Pure',
      description: 'Unadulterated, farm-fresh goodness — no additives, no preservatives.',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
    {
      icon: ShieldCheck,
      title: 'Quality Assured',
      description: 'Rigorous testing at every step to ensure the highest safety standards.',
      color: 'text-gold-600',
      bg: 'bg-gold-50',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: `${settings.deliveryEstimate || '2–3 Business Days'} delivery straight to your door.`,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
  ];

  const testimonials = [
    { text: "The quality is unmatched. I've never tasted milk so pure. It reminds me of my childhood!", name: 'Priya S.', location: 'Hyderabad' },
    { text: 'Finally found authentic Konaseema dairy products. The ghee is absolutely divine.', name: 'Ravi K.', location: 'Vijayawada' },
    { text: "Super fresh, delivered on time. Will keep ordering. Best dairy I've ever had!", name: 'Ananya M.', location: 'Bengaluru' },
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <SEO url="/" />
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative bg-emerald-950 text-cream-50 overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=2000&auto=format&fit=crop')" }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/50 via-emerald-950/20 to-emerald-950" />
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgb(212_168_75/0.15),transparent)]" />

        <div className="page-container relative z-10 py-24 sm:py-32 lg:py-40 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/30 bg-gold-500/10 mb-8 sm:mb-10">
            <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.2em] text-gold-400 uppercase">
              Farm Fresh · Konaseema
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-5 sm:mb-6 text-cream-50 tracking-tight leading-[1.1] text-balance">
            {settings.heroTitle || 'Premium Quality\nDairy Products'}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-emerald-200/80 max-w-2xl mx-auto mb-10 sm:mb-12 font-light leading-relaxed px-2">
            {settings.heroSubtitle || 'Fresh from the farm to your doorstep. Experience the richness of authentic dairy.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#products"
              className="inline-flex items-center gap-2.5 bg-gold-500 text-white px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-widest hover:bg-gold-600 hover:-translate-y-px transition-all duration-200 shadow-[0_4px_20px_-4px_rgb(184_136_42/0.5)]"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#story"
              className="inline-flex items-center gap-2 text-emerald-300/80 hover:text-cream-50 text-sm font-medium transition-colors py-4"
            >
              Our Story <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-cream-50 to-transparent" />
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-cream-50">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group flex flex-row md:flex-col items-start md:items-center md:text-center gap-4 md:gap-0 p-5 sm:p-6 bg-white rounded-2xl border border-cream-200/80 hover:border-cream-300 transition-all duration-300 hover:shadow-[0_4px_20px_-4px_rgb(1_26_19/0.08)]"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${f.bg} ${f.color} rounded-xl md:mb-4 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                  <f.icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-semibold text-emerald-950 mb-1.5">{f.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Story ───────────────────────────────── */}
      <section id="story" className="py-20 sm:py-28 bg-white">
        <div className="page-container">
          <div className="flex flex-col md:flex-row items-center gap-12 sm:gap-16 lg:gap-20">
            <div className="flex-1 w-full relative">
              <img
                src="https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=1000&auto=format&fit=crop"
                alt="Advitha Food Products Brand Story"
                loading="lazy"
                decoding="async"
                className="rounded-3xl shadow-2xl w-full aspect-[4/3] object-cover"
              />
              {/* Decorative offset border */}
              <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl border-2 border-gold-300/40 -z-10 hidden sm:block" />
            </div>
            <div className="flex-1 max-w-lg">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-gold-600 uppercase mb-4">Our Heritage</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-emerald-950 mb-6 leading-tight">
                Generations of<br />Authentic Craft
              </h2>
              <div className="w-10 h-0.5 bg-gold-400 mb-6" />
              <p className="text-base text-stone-600 mb-5 leading-[1.8]">
                At {settings.businessName}, we believe in preserving the authentic taste of tradition. Our products are crafted with generations of care, bringing you the purest dairy products directly from the heart of Konaseema.
              </p>
              <p className="text-base text-stone-500 mb-8 leading-[1.8]">
                Every product is a testament to our commitment to quality, purity, and the rich heritage we proudly uphold.
              </p>
              <a
                href="#products"
                className="inline-flex items-center gap-2 text-gold-600 font-semibold text-sm tracking-wider hover:text-gold-700 transition-colors group"
              >
                Explore our products
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products ──────────────────────────────────── */}
      <section id="products" className="py-16 sm:py-24 bg-cream-50 scroll-mt-20">
        <div className="page-container">

          {/* Section header */}
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-gold-600 uppercase mb-3">Crafted with love</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-emerald-950 mb-4 leading-tight">Our Best Sellers</h2>
            <div className="w-10 h-0.5 bg-gold-400 mx-auto rounded-full" />
          </div>

          {/* Search feedback */}
          {searchQuery && (
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-stone-500">Results for <em className="not-italic font-semibold text-emerald-950">&ldquo;{searchParams.get('q')}&rdquo;</em></span>
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="text-gold-600 font-semibold hover:text-gold-700 transition-colors underline underline-offset-2"
              >
                Clear
              </button>
            </div>
          )}

          {/* Category filters */}
          <div className="flex justify-start sm:justify-center gap-2 mb-10 sm:mb-12 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveFilter(category)}
                className={`px-5 sm:px-7 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-250 whitespace-nowrap shrink-0 min-h-10 ${
                  activeFilter === category
                    ? 'bg-emerald-950 text-gold-400 shadow-sm'
                    : 'bg-white text-stone-500 border border-cream-200 hover:border-cream-300 hover:text-emerald-900 hover:bg-cream-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map(i => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title={searchQuery ? 'No products found' : 'More coming soon'}
              description={searchQuery ? 'Try a different search term or browse all categories.' : 'Check back soon for fresh additions to our catalog.'}
              action={searchQuery ? (
                <button type="button" onClick={() => setSearchParams({})} className="btn-primary rounded-full px-7 text-sm">
                  View All Products
                </button>
              ) : null}
            />
          )}
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-emerald-950 relative overflow-hidden">
        {/* Subtle radial bg */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,rgb(10_107_73/0.4),transparent)]" />

        <div className="page-container relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-gold-500 uppercase mb-3">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-cream-50 leading-tight">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-emerald-900/40 border border-emerald-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl relative"
              >
                {/* Quote mark */}
                <div className="text-4xl font-serif text-gold-500/30 leading-none mb-4 select-none">&ldquo;</div>
                <div className="flex mb-5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                  ))}
                </div>
                <p className="text-emerald-100/80 italic mb-6 text-sm leading-[1.85]">{t.text}</p>
                <div className="pt-5 border-t border-emerald-800/40">
                  <p className="font-semibold text-cream-100 text-sm">{t.name}</p>
                  <p className="text-emerald-400/60 text-xs mt-0.5 tracking-wide">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
