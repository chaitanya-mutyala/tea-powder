import React from 'react';
import SEO from '../components/SEO';

export default function RefundPolicy() {
  return (
    <div className="bg-cream-50 min-h-screen py-16">
      <SEO title="Refund Policy" description="Refund and Return Policy for Advitha Milk Products." url="/refund-policy" />
      <div className="page-container max-w-3xl">
        <h1 className="text-4xl font-serif font-bold text-emerald-950 mb-6">Refund Policy</h1>
        <div className="prose prose-emerald max-w-none text-stone-600">
          <p>Last updated: [Date]</p>
          <p>Placeholder content for Refund Policy. Replace this with your actual refund and return guidelines.</p>
        </div>
      </div>
    </div>
  );
}
