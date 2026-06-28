import React from 'react';
import SEO from '../components/SEO';
import { SEO_CONFIG } from '../lib/seo.config';

export default function Contact() {
  return (
    <div className="bg-cream-50 min-h-screen py-16">
      <SEO 
        title="Contact Us" 
        description="Get in touch with Advitha Milk Products. Find our address, email, and phone number."
        url="/contact"
      />
      <div className="page-container max-w-4xl">
        <h1 className="text-4xl font-serif font-bold text-emerald-950 mb-8 text-center">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="bg-white p-8 rounded-2xl border border-cream-200">
            <h2 className="text-2xl font-serif font-bold text-emerald-900 mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2">Address</h3>
                <p className="text-emerald-950 leading-relaxed">
                  {SEO_CONFIG.address.streetAddress}<br />
                  {SEO_CONFIG.address.addressLocality}, {SEO_CONFIG.address.addressRegion}<br />
                  {SEO_CONFIG.address.postalCode}, {SEO_CONFIG.address.addressCountry}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2">Email</h3>
                <a href={`mailto:${SEO_CONFIG.contact.email}`} className="text-gold-600 hover:text-gold-700 font-medium">{SEO_CONFIG.contact.email}</a>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2">Phone</h3>
                <a href={`tel:${SEO_CONFIG.contact.telephone}`} className="text-gold-600 hover:text-gold-700 font-medium">{SEO_CONFIG.contact.telephone}</a>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-stone-200 rounded-2xl overflow-hidden min-h-[300px] relative border border-cream-200 flex items-center justify-center">
            {/* Google Maps iframe would go here */}
            <p className="text-stone-500 font-medium">Google Maps Integration</p>
          </div>
        </div>
      </div>
    </div>
  );
}
