'use client'

import Head from 'next/head'
import { AdvancedSEOOptimizer } from '@/lib/advanced-seo-optimizer'

interface AdvancedSEOHeadProps {
  pageType: 'homepage' | 'tool' | 'blog' | 'category' | 'search'
  data?: any
  title?: string
  description?: string
  image?: string
  url?: string
  breadcrumbs?: Array<{name: string, url: string}>
  faqs?: Array<{question: string, answer: string}>
}

export default function AdvancedSEOHead({ 
  pageType, 
  data, 
  title, 
  description, 
  image, 
  url, 
  breadcrumbs,
  faqs 
}: AdvancedSEOHeadProps) {
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://www.aitoolsinsights.com')
  
  // Generate advanced structured data
  const structuredData = AdvancedSEOOptimizer.generateAdvancedStructuredData(pageType, data || {})
  
  // Generate breadcrumb schema if breadcrumbs provided
  const breadcrumbSchema = breadcrumbs ? 
    AdvancedSEOOptimizer.generateBreadcrumbSchema(breadcrumbs) : null
  
  // Generate FAQ schema if FAQs provided
  const faqSchema = faqs ? 
    AdvancedSEOOptimizer.generateEnhancedFAQSchema(faqs) : null
  
  // Generate optimized meta tags
  const metaTags = AdvancedSEOOptimizer.generateOptimizedMetaTags({
    title,
    description,
    keywords: data?.keywords || []
  })
  
  // Generate hreflang tags
  const hreflangTags = AdvancedSEOOptimizer.generateHreflangTags(currentUrl)
  
  // Generate enhanced Open Graph
  const openGraphData = AdvancedSEOOptimizer.generateEnhancedOpenGraph({
    title,
    description,
    image,
    url: currentUrl,
    type: pageType === 'blog' ? 'article' : 'website',
    publishedAt: data?.publishedAt,
    updatedAt: data?.updatedAt,
    author: data?.author,
    category: data?.category,
    tags: data?.tags
  })
  
  // Generate enhanced Twitter Card
  const twitterCard = AdvancedSEOOptimizer.generateEnhancedTwitterCard({
    title,
    description,
    image,
    url: currentUrl
  })

  return (
    <>
      {/* Enhanced Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Breadcrumb Schema */}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      
      {/* FAQ Schema */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      
      {/* Hreflang Tags */}
      {hreflangTags.map((tag, index) => (
        <link
          key={index}
          rel="alternate"
          hrefLang={tag.hreflang}
          href={tag.href}
        />
      ))}
      
      {/* Enhanced Meta Tags */}
      <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
      <meta name="googlebot" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
      <meta name="bingbot" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
      
      {/* Performance Hints */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      <meta name="format-detection" content="telephone=no,date=no,email=no,address=no" />
      
      {/* Security Headers */}
      <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      
      {/* Advanced Performance Optimization */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="color-scheme" content="light dark" />
      <meta name="supported-color-schemes" content="light dark" />
      
      {/* Preload Critical Resources */}
      <link rel="preload" href="/hero-bg.webp" as="image" type="image/webp" fetchPriority="high" />
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      
      {/* Prefetch Important Pages */}
      <link rel="prefetch" href="/ai-tools" />
      <link rel="prefetch" href="/blog" />
      <link rel="prefetch" href="/search" />
      
      {/* Apple Touch Icons and PWA */}
      <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
      
      {/* Microsoft Tiles */}
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="AI Tools List Team" />
      <meta name="publisher" content="AI Tools List" />
      <meta name="copyright" content="© 2025 AI Tools List. All rights reserved." />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="1 days" />
      
      {/* Geographic Targeting */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      <meta name="geo.position" content="39.8283;-98.5795" />
      <meta name="ICBM" content="39.8283, -98.5795" />
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content="en-US" />
      <meta name="language" content="English" />
    </>
  )
}