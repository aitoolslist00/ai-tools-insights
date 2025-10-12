'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface Enhanced2025SEOProps {
  pageType?: 'homepage' | 'article' | 'product' | 'category' | 'search'
  title?: string
  description?: string
  keywords?: string[]
  author?: string
  publishedTime?: string
  modifiedTime?: string
  images?: string[]
  breadcrumbs?: Array<{ name: string; url: string }>
}

export default function Enhanced2025SEO({
  pageType = 'homepage',
  title,
  description,
  keywords = [],
  author,
  publishedTime,
  modifiedTime,
  images = [],
  breadcrumbs = []
}: Enhanced2025SEOProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Enhanced Core Web Vitals monitoring for 2025 algorithm
    const observeWebVitals = () => {
      // Largest Contentful Paint (LCP)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            const lcp = entry.startTime
            if (lcp > 2500) {
              console.warn('LCP exceeds 2.5s threshold:', lcp)
            }
            // Send to analytics
            if (typeof gtag !== 'undefined') {
              gtag('event', 'web_vitals', {
                name: 'LCP',
                value: Math.round(lcp),
                event_category: 'Web Vitals'
              })
            }
          }
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay (FID) / Interaction to Next Paint (INP)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const inpEntry = entry as any // Cast to access processingStart
          const inp = inpEntry.processingStart - inpEntry.startTime
          if (inp > 200) {
            console.warn('INP exceeds 200ms threshold:', inp)
          }
          if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
              name: 'INP',
              value: Math.round(inp),
              event_category: 'Web Vitals'
            })
          }
        }
      }).observe({ entryTypes: ['event'] })

      // Cumulative Layout Shift (CLS)
      let clsValue = 0
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const clsEntry = entry as any // Cast to access hadRecentInput and value
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value
          }
        }
        if (clsValue > 0.1) {
          console.warn('CLS exceeds 0.1 threshold:', clsValue)
        }
        if (typeof gtag !== 'undefined') {
          gtag('event', 'web_vitals', {
            name: 'CLS',
            value: Math.round(clsValue * 1000),
            event_category: 'Web Vitals'
          })
        }
      }).observe({ entryTypes: ['layout-shift'] })
    }

    // User engagement signals for 2025 algorithm
    const trackEngagement = () => {
      let startTime = Date.now()
      let scrollDepth = 0
      let maxScrollDepth = 0

      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        scrollDepth = Math.round((scrollTop / docHeight) * 100)
        maxScrollDepth = Math.max(maxScrollDepth, scrollDepth)
      }

      const handleBeforeUnload = () => {
        const timeOnPage = Date.now() - startTime
        if (typeof gtag !== 'undefined') {
          gtag('event', 'engagement', {
            name: 'time_on_page',
            value: Math.round(timeOnPage / 1000),
            custom_parameter_1: maxScrollDepth,
            event_category: 'User Engagement'
          })
        }
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('beforeunload', handleBeforeUnload)

      return () => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('beforeunload', handleBeforeUnload)
      }
    }

    // Enhanced E-A-T signals
    const enhanceEAT = () => {
      // Add author information to page
      if (author && pageType === 'article') {
        const authorMeta = document.createElement('meta')
        authorMeta.name = 'author'
        authorMeta.content = author
        document.head.appendChild(authorMeta)
      }

      // Add expertise signals
      const expertiseMeta = document.createElement('meta')
      expertiseMeta.name = 'expertise'
      expertiseMeta.content = 'AI Tools, Technology Reviews, Software Analysis'
      document.head.appendChild(expertiseMeta)

      // Add trustworthiness signals
      const trustMeta = document.createElement('meta')
      trustMeta.name = 'trustworthiness'
      trustMeta.content = 'Verified Reviews, Expert Analysis, Updated Information'
      document.head.appendChild(trustMeta)
    }

    // Semantic search optimization for 2025
    const enhanceSemanticSEO = () => {
      // Add semantic keywords as meta tags
      if (keywords.length > 0) {
        const semanticKeywords = document.createElement('meta')
        semanticKeywords.name = 'semantic-keywords'
        semanticKeywords.content = keywords.join(', ')
        document.head.appendChild(semanticKeywords)
      }

      // Add topic clustering
      const topicMeta = document.createElement('meta')
      topicMeta.name = 'topic-cluster'
      topicMeta.content = pageType === 'article' ? 'AI Tools Blog' : 'AI Tools Directory'
      document.head.appendChild(topicMeta)
    }

    // Initialize all enhancements
    observeWebVitals()
    const cleanupEngagement = trackEngagement()
    enhanceEAT()
    enhanceSemanticSEO()

    return cleanupEngagement
  }, [pageType, author, keywords])

  // Generate enhanced JSON-LD for 2025 algorithm
  const generateEnhancedSchema = () => {
    const baseUrl = 'https://www.aitoolsinsights.com'
    const currentUrl = `${baseUrl}${pathname}`

    const schemas = []

    // Enhanced Organization schema with E-A-T signals
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${baseUrl}#organization`,
      name: 'AI Tools Insights',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 512,
        height: 512
      },
      sameAs: [
        'https://twitter.com/aitoolsinsights',
        'https://linkedin.com/company/aitoolsinsights',
        'https://github.com/aitoolsinsights'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'contact@aitoolsinsights.com',
        availableLanguage: 'English'
      },
      expertise: 'AI Tools Analysis and Reviews',
      trustworthiness: 'Expert Reviews and Verified Information',
      authority: 'Leading AI Tools Directory'
    })

    // Enhanced WebSite schema with search functionality
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
      name: 'AI Tools Insights',
      url: baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      },
      publisher: {
        '@id': `${baseUrl}#organization`
      }
    })

    // Page-specific schemas
    if (pageType === 'article' && title) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${currentUrl}#article`,
        headline: title,
        description: description,
        author: {
          '@type': 'Person',
          name: author || 'AI Tools Insights Team',
          url: `${baseUrl}/about`
        },
        publisher: {
          '@id': `${baseUrl}#organization`
        },
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        mainEntityOfPage: currentUrl,
        image: images.map(img => ({
          '@type': 'ImageObject',
          url: img.startsWith('http') ? img : `${baseUrl}${img}`,
          width: 1200,
          height: 630
        })),
        expertise: 'AI Tools and Technology',
        trustworthiness: 'Expert Analysis and Reviews'
      })
    }

    // Enhanced breadcrumb schema
    if (breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${currentUrl}#breadcrumb`,
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.url.startsWith('http') ? crumb.url : `${baseUrl}${crumb.url}`
        }))
      })
    }

    return JSON.stringify(schemas)
  }

  return (
    <>
      {/* Enhanced JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateEnhancedSchema() }}
      />
      
      {/* 2025 Algorithm Optimization Meta Tags */}
      <meta name="page-type" content={pageType} />
      <meta name="content-freshness" content={modifiedTime || new Date().toISOString()} />
      <meta name="user-experience-optimized" content="true" />
      <meta name="core-web-vitals-optimized" content="true" />
      <meta name="semantic-search-ready" content="true" />
      <meta name="e-a-t-compliant" content="true" />
      
      {/* Enhanced accessibility for better rankings */}
      <meta name="accessibility-compliant" content="WCAG 2.1 AA" />
      <meta name="mobile-optimized" content="true" />
      <meta name="performance-optimized" content="true" />
    </>
  )
}

// Type declarations for global gtag
declare global {
  function gtag(...args: any[]): void
}