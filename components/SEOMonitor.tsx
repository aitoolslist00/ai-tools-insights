'use client'

import { useEffect } from 'react'

interface SEOMonitorProps {
  page: string
  title: string
  description: string
}

export default function SEOMonitor({ page, title, description }: SEOMonitorProps) {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          // Track LCP
          if (typeof window !== 'undefined' && 'gtag' in window) {
            ;(window as any).gtag('event', 'web_vitals', {
              name: 'LCP',
              value: Math.round(entry.startTime),
              page_path: page,
            })
          }
        }
        
        if (entry.entryType === 'first-input') {
          // Track FID
          if (typeof window !== 'undefined' && 'gtag' in window) {
            ;(window as any).gtag('event', 'web_vitals', {
              name: 'FID',
              value: Math.round((entry as any).processingStart - entry.startTime),
              page_path: page,
            })
          }
        }
      }
    })

    // Observe performance metrics
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] })
    } catch (e) {
      // Fallback for browsers that don't support these metrics
      console.log('Performance monitoring not supported')
    }

    // Monitor CLS
    let clsValue = 0
    let clsEntries: any[] = []

    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          const firstSessionEntry = clsEntries[0]
          const lastSessionEntry = clsEntries[clsEntries.length - 1]

          if (!firstSessionEntry || 
              entry.startTime - lastSessionEntry.startTime < 1000 ||
              entry.startTime - firstSessionEntry.startTime < 5000) {
            clsEntries.push(entry)
            clsValue += (entry as any).value
          } else {
            clsEntries = [entry]
            clsValue = (entry as any).value
          }
        }
      }

      // Report CLS
      if (typeof window !== 'undefined' && 'gtag' in window) {
        ;(window as any).gtag('event', 'web_vitals', {
          name: 'CLS',
          value: Math.round(clsValue * 1000),
          page_path: page,
        })
      }
    })

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      console.log('CLS monitoring not supported')
    }

    // SEO validation checks
    const validateSEO = () => {
      const issues: string[] = []

      // Check title length
      if (title.length < 30 || title.length > 60) {
        issues.push(`Title length (${title.length}) should be 30-60 characters`)
      }

      // Check description length
      if (description.length < 120 || description.length > 160) {
        issues.push(`Description length (${description.length}) should be 120-160 characters`)
      }

      // Check for missing meta tags
      const metaDescription = document.querySelector('meta[name="description"]')
      if (!metaDescription) {
        issues.push('Missing meta description')
      }

      const canonicalLink = document.querySelector('link[rel="canonical"]')
      if (!canonicalLink) {
        issues.push('Missing canonical link')
      }

      // Check for Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]')
      const ogDescription = document.querySelector('meta[property="og:description"]')
      const ogImage = document.querySelector('meta[property="og:image"]')
      
      if (!ogTitle) issues.push('Missing og:title')
      if (!ogDescription) issues.push('Missing og:description')
      if (!ogImage) issues.push('Missing og:image')

      // Log issues in development
      if (issues.length > 0 && process.env.NODE_ENV === 'development') {
        console.warn('SEO Issues detected:', issues)
      }

      // Track SEO score
      const seoScore = Math.max(0, 100 - (issues.length * 10))
      if (typeof window !== 'undefined' && 'gtag' in window) {
        ;(window as any).gtag('event', 'seo_score', {
          value: seoScore,
          page_path: page,
          issues_count: issues.length,
        })
      }
    }

    // Run SEO validation after page load
    setTimeout(validateSEO, 1000)

    return () => {
      observer.disconnect()
      clsObserver.disconnect()
    }
  }, [page, title, description])

  return null
}