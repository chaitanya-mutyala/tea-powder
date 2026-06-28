import React from 'react';
import SEO from '../components/SEO';

export default function ShippingPolicy() {
  return (
    <div className="bg-cream-50 min-h-screen py-16">
      <SEO title="Shipping Policy" description="Shipping and Delivery Policy for Advitha Milk Products." url="/shipping-policy" />
      <div className="page-container max-w-3xl">
        <h1 className="text-4xl font-serif font-bold text-emerald-950 mb-6">Shipping Policy</h1>
        <div className="prose prose-emerald max-w-none text-stone-600">
          <p>Last updated: [Date]</p>
          <p>Placeholder content for Shipping Policy. Replace this with your actual shipping, delivery times, and costs details.</p>
        </div>
      </div>
    </div>
  );
}
