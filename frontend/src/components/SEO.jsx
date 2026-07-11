// src/components/SEO.jsx
import { Helmet } from 'react-helmet-async';
import logoNsm from '../assets/logo-nsm.png';

export default function SEO({ 
  title = "Beton Cor Tangerang | Jual Beton Readymix & Sewa Pompa Beton",
  description = "Beton Cor Tangerang - Penyedia beton readymix, sewa pompa beton, dan jasa finishing trowel berkualitas. Harga kompetitif, armada lengkap, pengiriman cepat.",
  keywords = "beton cor tangerang, jual beton readymix tangerang, sewa pompa beton tangerang, jasa finishing trowel, concrete pump, supplier beton cor, beton ready mix, pompa beton tangerang, readymix tangerang, jasa cor beton",
  canonicalUrl = "https://betoncortangerang.com",
  ogImage,
  ogType = "website",
  publishedTime,
  modifiedTime,
  author = "Beton Cor Tangerang",
  noIndex = false
}) {
  const siteUrl = "https://betoncortangerang.com";
  
  // Gunakan logo yang sudah ada di assets
  const defaultOgImage = logoNsm || '/logo-nsm.png';
  const finalOgImage = ogImage || defaultOgImage;
  const fullImageUrl = finalOgImage.startsWith('http') ? finalOgImage : `${siteUrl}${finalOgImage}`;
  
  // Format title agar konsisten dengan keyword utama
  const fullTitle = title.includes("|") ? title : `${title} | Beton Cor Tangerang`;
  
  // Format deskripsi agar tidak terlalu panjang dan mengandung keyword
  const trimmedDescription = description.length > 160 ? description.substring(0, 157) + "..." : description;
  
  // Keywords yang dioptimalkan untuk "beton cor tangerang"
  const optimizedKeywords = "beton cor tangerang, jual beton readymix tangerang, sewa pompa beton tangerang, jasa finishing trowel, concrete pump, supplier beton cor, niaga solusi mandiri, pompa beton tangerang, beton cor tangerang, readymix tangerang, jasa cor beton, sewa pompa beton, beton ready mix, concrete pump rental, jasa trowel, finishing lantai beton, beton cor murah tangerang, harga beton readymix, jasa cor beton tangerang";
  
  // JSON-LD Schema Markup dengan data lengkap
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Beton Cor Tangerang",
    "alternateName": "Niaga Solusi Mandiri",
    "description": "Penyedia beton readymix, sewa pompa beton, dan jasa finishing trowel berkualitas di Tangerang. Harga kompetitif, armada lengkap, pengiriman cepat.",
    "url": canonicalUrl,
    "logo": fullImageUrl,
    "image": fullImageUrl,
    "telephone": "+6281315913559",
    "email": "info@betoncortangerang.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Tangerang Selatan",
      "addressRegion": "Banten",
      "addressCountry": "ID",
      "streetAddress": "Jl. Masjid Ar Rahman, Rawabuntu, Serpong"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-6.3163097",
      "longitude": "106.6760263"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "22:00"
    },
    "sameAs": [
      "https://www.instagram.com/nsmreadymixdanconcretepump",
      "https://www.tiktok.com/@rentalpompadanjualbeton",
      "https://web.facebook.com/niagasolusimandiri",
      "https://youtube.com/@nsmreadymixconcretepump"
    ],
    "priceRange": "$$",
    "areaServed": {
      "@type": "City",
      "name": "Tangerang"
    },
    "hasMap": "https://maps.google.com/?cid=8605058279480225784",
    "serviceType": [
      "Beton Readymix",
      "Sewa Pompa Beton",
      "Jasa Finishing Trowel",
      "Jual Beton Cor"
    ]
  };
  
  // BreadcrumbList Schema untuk halaman non-home
  const breadcrumbSchema = canonicalUrl !== siteUrl ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Beranda",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": title.split("|")[0].trim(),
        "item": canonicalUrl
      }
    ]
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang="id" />
      <title>{fullTitle}</title>
      <meta name="description" content={trimmedDescription} />
      <meta name="keywords" content={optimizedKeywords} />
      <meta name="author" content={author} />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <>
          <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
          <meta name="googlebot" content="index, follow" />
          <meta name="bingbot" content="index, follow" />
        </>
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={trimmedDescription} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content="Beton Cor Tangerang - Jual Beton Readymix & Sewa Pompa Beton" />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Beton Cor Tangerang - Jual Beton Readymix & Sewa Pompa Beton" />
      <meta property="og:locale" content="id_ID" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={trimmedDescription} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content="Beton Cor Tangerang - Jual Beton Readymix & Sewa Pompa Beton" />
      
      {/* Article Meta Tags */}
      {publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          <meta property="article:author" content={author} />
          <meta property="article:section" content="Konstruksi" />
        </>
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      
      {/* Business Info */}
      <meta name="geo.region" content="ID-BT" />
      <meta name="geo.placename" content="Tangerang" />
      <meta name="geo.position" content="-6.3163097;106.6760263" />
      <meta name="ICBM" content="-6.3163097, 106.6760263" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate Language */}
      <link rel="alternate" href={canonicalUrl} hrefLang="id" />
      <link rel="alternate" href={canonicalUrl} hrefLang="x-default" />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="HandheldFriendly" content="true" />
      <meta name="theme-color" content="#0f172a" />
      
      {/* Preconnect untuk performa */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
      
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
}