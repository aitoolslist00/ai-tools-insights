'use client'

import Head from 'next/head'
import { SchemaGenerator, SchemaMarkup } from '@/lib/schema-generator'

interface SEOHeadProps {
  title: string
  description: string
  keywords?: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'product'
  schemas?: SchemaMarkup[]
  noindex?: boolean
  breadcrumbs?: Array<{name: string, url: string}>
  author?: string
  publishedTime?: string
  modifiedTime?: string
  articleSection?: string
  tags?: string[]
}

export default function SEOHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = '/og-default.jpg',
  ogType = 'website',
  schemas = [],
  noindex = false,
  breadcrumbs,
  author,
  publishedTime,
  modifiedTime,
  articleSection,
  tags
}: SEOHeadProps) {
  const baseUrl = 'https://www.aitoolslist.com'
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`

  // Add breadcrumb schema if provided
  if (breadcrumbs && breadcrumbs.length > 1) {
    schemas.push(SchemaGenerator.generateBreadcrumbSchema(breadcrumbs))
  }

  // Always include organization and website schemas
  const defaultSchemas = [
    SchemaGenerator.generateOrganizationSchema(),
    SchemaGenerator.generateWebsiteSchema()
  ]

  const allSchemas = [...defaultSchemas, ...schemas]
  const schemaMarkup = SchemaGenerator.generateCombinedSchema(allSchemas)

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="AI Tools Insights" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@aitoolslist" />
      <meta name="twitter:creator" content="@aitoolslist" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Article specific meta tags */}
      {ogType === 'article' && (
        <>
          {author && <meta property="article:author" content={author} />}
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {articleSection && <meta property="article:section" content={articleSection} />}
          {tags && tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Additional SEO Meta Tags */}
      <meta name="author" content={author || 'AI Tools List'} />
      <meta name="publisher" content="AI Tools List" />
      <meta name="copyright" content="AI Tools List" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Geo Tags for Local SEO */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      <meta name="geo.position" content="37.7749;-122.4194" />
      <meta name="ICBM" content="37.7749, -122.4194" />

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaMarkup }}
      />

      {/* Preload critical resources */}
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href={fullOgImage} as="image" />

      {/* DNS Prefetch for external resources */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//images.unsplash.com" />

      {/* Preconnect to critical third-party origins */}
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Head>
  )
}