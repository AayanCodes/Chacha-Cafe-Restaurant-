import React, { useEffect } from 'react';
import { RESTAURANT_INFO } from '../data/cafeData';

export const SEOMeta: React.FC = () => {
  useEffect(() => {
    document.title = `${RESTAURANT_INFO.name} | Delicious Ice Cream & Fresh Cakes Kiratpur`;

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "name": RESTAURANT_INFO.name,
      "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200",
      "description": RESTAURANT_INFO.shortDesc,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Manadwar Road, Taqarubpur Israj Kheri",
        "addressLocality": "Kiratpur",
        "addressRegion": "Uttar Pradesh",
        "postalCode": "246731",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 29.7490,
        "longitude": 78.5280
      },
      "telephone": RESTAURANT_INFO.phone,
      "servesCuisine": [
        "Italian", "Indian", "Chinese", "Artisan Coffee", "Woodfired Pizza", "Continental", "Desserts"
      ],
      "priceRange": "₹₹ - ₹₹₹",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
          ],
          "opens": "08:00",
          "closes": "23:00"
        }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": RESTAURANT_INFO.googleRating,
        "reviewCount": RESTAURANT_INFO.googleReviewsCount
      }
    };

    let scriptTag = document.getElementById('json-ld-restaurant') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-restaurant';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemaData);

    return () => {
      if (scriptTag) scriptTag.remove();
    };
  }, []);

  return null;
};
