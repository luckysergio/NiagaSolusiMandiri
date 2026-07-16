import { Helmet } from 'react-helmet-async';
import logoNsm from '../assets/logo-nsm.png';

export default function SEO({ 
  title = "Jual Beton Cor Readymix & Sewa Pompa Beton Tangerang",
  description = "Jual beton cor readymix, sewa pompa beton, dan jasa finishing trowel di Tangerang & Tangerang Selatan. Harga termurah, mutu SNI, armada lengkap. Hemat Waktu, Hemat Biaya, Hemat Tenaga.",
  canonicalUrl,
  ogImage,
  ogType = "website",
  publishedTime,
  modifiedTime,
  author = "Niaga Solusi Mandiri",
  noIndex = false
}) {
  const siteUrl = "https://betoncortangerang.com";
  
  // ✅ FIX: Canonical URL dinamis untuk mencegah duplicate content
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const finalCanonical = canonicalUrl || `${siteUrl}${currentPath}`;
  
  const defaultOgImage = logoNsm || '/logo-nsm.png';
  const finalOgImage = ogImage || defaultOgImage;
  const fullImageUrl = finalOgImage.startsWith('http') ? finalOgImage : `${siteUrl}${finalOgImage}`;
  
  // ✅ FIX: Mencegah double pipe (|) dan memastikan format judul konsisten
  const fullTitle = title.includes("Beton Cor Tangerang") ? title : `${title} | Beton Cor Tangerang`;
  const trimmedDescription = description.length > 160 ? description.substring(0, 157) + "..." : description;
  
  const isHomePage = finalCanonical === siteUrl || finalCanonical === `${siteUrl}/`;
  
  // ✅ OPTIMASI: Schema LocalBusiness yang diperkaya
  const localBusinessSchema = isHomePage ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}#business`,
    "name": "Beton Cor Tangerang - Niaga Solusi Mandiri",
    "alternateName": "Niaga Solusi Mandiri",
    "description": trimmedDescription,
    "url": siteUrl,
    "logo": fullImageUrl,
    "image": fullImageUrl,
    "telephone": "+6281315913559",
    "email": "adminwebsitensm@gmail.com",
    "priceRange": "Rp",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Tangerang Selatan",
      "addressRegion": "Banten",
      "postalCode": "15310",
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
    "areaServed": [
      { "@type": "City", "name": "Tangerang" },
      { "@type": "City", "name": "Tangerang Selatan" },
      { "@type": "City", "name": "Kabupaten Tangerang" }
    ],
    "hasMap": "https://maps.google.com/?cid=8605058279480225784",
    "makesOffer": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Jual Beton Cor Readymix Tangerang" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sewa Pompa Beton Tangerang" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Jasa Finishing Trowel Lantai" } }
    ]
  } : null;

  // ✅ OPTIMASI: Schema Organization untuk memperkuat brand entity
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
    "name": "Niaga Solusi Mandiri",
    "url": siteUrl,
    "logo": fullImageUrl,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+6281315913559",
      "contactType": "customer service",
      "areaServed": "ID",
      "availableLanguage": "Indonesian"
    }
  };

  const articleSchema = publishedTime ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "image": fullImageUrl,
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "author": {
      "@type": "Organization",
      "name": "Niaga Solusi Mandiri",
      "url": siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Beton Cor Tangerang",
      "logo": { "@type": "ImageObject", "url": fullImageUrl }
    },
    "description": trimmedDescription,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": finalCanonical
    }
  } : null;
  
  const breadcrumbSchema = !isHomePage ? {
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
        "item": finalCanonical
      }
    ]
  } : null;

  return (
    <Helmet>
      <html lang="id-ID" />
      <title>{fullTitle}</title>
      <meta name="description" content={trimmedDescription} />
      <meta name="author" content={author} />
      <meta name="keywords" content="beton cor tangerang, jual beton readymix tangerang, sewa pompa beton tangerang, harga beton cor tangerang, jasa finishing trowel tangerang selatan, niaga solusi mandiri" />
      <meta name="theme-color" content="#4f46e5" />
      <meta name="format-detection" content="telephone=yes" />
      
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <>
          <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
          <meta name="googlebot" content="index, follow" />
        </>
      )}
      
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={trimmedDescription} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content="Beton Cor Tangerang - Niaga Solusi Mandiri" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:site_name" content="Beton Cor Tangerang" />
      <meta property="og:locale" content="id_ID" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={trimmedDescription} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      <meta name="geo.region" content="ID-BT" />
      <meta name="geo.placename" content="Tangerang" />
      <meta name="geo.position" content="-6.3163097;106.6760263" />
      <meta name="ICBM" content="-6.3163097, 106.6760263" />
      
      <link rel="canonical" href={finalCanonical} />
      
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {localBusinessSchema && <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>}
      {organizationSchema && <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>}
      {articleSchema && <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>}
      {breadcrumbSchema && <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>}
    </Helmet>
  );
}