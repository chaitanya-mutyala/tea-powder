import React from 'react';
import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  return (
    <div className="bg-cream-50 min-h-screen py-16">
      <SEO title="Privacy Policy" description="Privacy Policy for Advitha Food Products." url="/privacy-policy" />
      <div className="page-container max-w-3xl">
        <h1 className="text-4xl font-serif font-bold text-emerald-950 mb-6">Privacy Policy</h1>
        <div className="prose prose-emerald max-w-none text-stone-600">
          <p>Last updated: [Date]</p>
          <p>Placeholder content for Privacy Policy. Replace this with your actual privacy policy details outlining how you collect, use, and protect customer data.</p>
        </div>
      </div>
    </div>
  );
}
