import React from 'react';
import SEO from '../components/SEO';

export default function About() {
  return (
    <div className="bg-cream-50 min-h-screen py-16">
      <SEO 
        title="About Us" 
        description="Learn more about Advitha Milk Products and our journey in providing premium dairy from Konaseema."
        url="/about"
      />
      <div className="page-container max-w-3xl">
        <h1 className="text-4xl font-serif font-bold text-emerald-950 mb-6">About Us</h1>
        <div className="prose prose-emerald max-w-none text-stone-600">
          <p className="mb-4">Advitha Milk Products is dedicated to bringing you the freshest, most authentic dairy products directly from the heart of Konaseema.</p>
          <p className="mb-4">Our journey started with a simple mission: to preserve the traditional methods of dairy farming while ensuring the highest standards of hygiene and quality.</p>
          <h2 className="text-2xl font-serif font-bold text-emerald-900 mt-8 mb-4">Our Commitment</h2>
          <p className="mb-4">We believe in farm-to-table freshness. Every drop of milk, every spoon of ghee is crafted with generations of care, ensuring you get only the best for your family.</p>
        </div>
      </div>
    </div>
  );
}
