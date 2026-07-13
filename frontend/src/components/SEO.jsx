import { Helmet } from 'react-helmet-async';
import logoNsm from '../assets/logo-nsm.png';

export default function SEO({ 
  title = "Beton Cor Tangerang | Jual Beton Readymix & Sewa Pompa Beton",
  description = "Beton Cor Tangerang - Penyedia beton readymix, sewa pompa beton, dan jasa finishing trowel berkualitas. Harga kompetitif, armada lengkap, pengiriman cepat.",
  canonicalUrl = "https://betoncortangerang.com",
  ogImage,
  ogType = "website",
  publishedTime,
  modifiedTime,
  author = "Beton Cor Tangerang",
  noIndex = false
}) {
  const siteUrl = "https://betoncortangerang.com";
  
  const defaultOgImage = logoNsm || '/logo-nsm.png';
  const finalOgImage = ogImage || defaultOgImage;
  const fullImageUrl = finalOgImage.startsWith('http') ? finalOgImage : `${siteUrl}${finalOgImage}`;
  
  const fullTitle = title.includes("|") ? title : `${title} | Beton Cor Tangerang`;
  const trimmedDescription = description.length > 160 ? description.substring(0, 157) + "..." : description;
  
  const isHomePage = canonicalUrl === siteUrl || canonicalUrl === `${siteUrl}/`;
  
  const businessSchema = isHomePage ? {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "Beton Cor Tangerang",
    "alternateName": "Niaga Solusi Mandiri",
    "description": "Penyedia beton readymix, sewa pompa beton, dan jasa finishing trowel berkualitas di Tangerang. Harga kompetitif, armada lengkap, pengiriman cepat.",
    "url": siteUrl,
    "logo": fullImageUrl,
    "image": fullImageUrl,
    "telephone": "+6281315913559",
    "email": "info@betoncortangerang.com",
    "priceRange": "RpRp",
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
    "areaServed": [
      { "@type": "City", "name": "Tangerang" },
      { "@type": "City", "name": "Tangerang Selatan" },
      { "@type": "City", "name": "Kabupaten Tangerang" }
    ],
    "hasMap": "https://maps.google.com/?cid=8605058279480225784"
  } : null;

  const articleSchema = publishedTime ? {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
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
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo-nsm.png`
      }
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
        "item": canonicalUrl
      }
    ]
  } : null;

  return (
    <Helmet>
      <html lang="id" />
      <title>{fullTitle}</title>
      <meta name="description" content={trimmedDescription} />
      <meta name="author" content={author} />
      
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
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonicalUrl} />
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
      
      <link rel="canonical" href={canonicalUrl} />
      
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {businessSchema && (
        <script type="application/ld+json">{JSON.stringify(businessSchema)}</script>
      )}
      {articleSchema && (
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      )}
    </Helmet>
  );
}