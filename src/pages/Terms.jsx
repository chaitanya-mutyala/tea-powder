import React from 'react';
import SEO from '../components/SEO';

export default function Terms() {
  return (
    <div className="bg-cream-50 min-h-screen py-16">
      <SEO title="Terms & Conditions" description="Terms and Conditions for Advitha Milk Products." url="/terms" />
      <div className="page-container max-w-3xl">
        <h1 className="text-4xl font-serif font-bold text-emerald-950 mb-6">Terms & Conditions</h1>
        <div className="prose prose-emerald max-w-none text-stone-600">
          <p>Last updated: [Date]</p>
          <p>Placeholder content for Terms and Conditions. Replace this with your actual legal terms governing the use of your website and services.</p>
        </div>
      </div>
    </div>
  );
}
