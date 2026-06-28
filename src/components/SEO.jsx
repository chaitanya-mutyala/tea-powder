import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SEO_CONFIG } from '../lib/seo.config';

export default function SEO({ 
  title, 
  description, 
  image, 
  url, 
  type = 'website', 
  schemaData = null 
}) {
  const pageTitle = title ? SEO_CONFIG.titleTemplate.replace('%s', title) : SEO_CONFIG.defaultTitle;
  const pageDescription = description || SEO_CONFIG.defaultDescription;
  const pageImage = image || SEO_CONFIG.socialPreviewImage;
  const pageUrl = url ? `${SEO_CONFIG.siteUrl}${url}` : SEO_CONFIG.siteUrl;

  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": SEO_CONFIG.businessName,
    "image": `${SEO_CONFIG.siteUrl}${SEO_CONFIG.socialPreviewImage}`,
    "@id": SEO_CONFIG.siteUrl,
    "url": SEO_CONFIG.siteUrl,
    "telephone": SEO_CONFIG.contact.telephone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": SEO_CONFIG.address.streetAddress,
      "addressLocality": SEO_CONFIG.address.addressLocality,
      "postalCode": SEO_CONFIG.address.postalCode,
      "addressRegion": SEO_CONFIG.address.addressRegion,
      "addressCountry": SEO_CONFIG.address.addressCountry
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": SEO_CONFIG.geo.latitude,
      "longitude": SEO_CONFIG.geo.longitude
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "06:00",
      "closes": "20:00"
    }
  };

  const schema = schemaData || defaultSchema;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="theme-color" content={SEO_CONFIG.themeColor} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={SEO_CONFIG.businessName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      {SEO_CONFIG.twitterHandle && <meta name="twitter:site" content={SEO_CONFIG.twitterHandle} />}

      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
