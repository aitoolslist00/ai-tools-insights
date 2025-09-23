'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * ADVANCED SEO OPTIMIZER COMPONENT
 * Real-time client-side SEO optimization and monitoring
 * This implements the most sophisticated legitimate techniques
 */

interface SEOMetrics {
  lcp: number
  fid: number
  cls: number
  fcp: number
  ttfb: number
}

interface SEOOptimization {
  structuredData: string
  metaTags: Record<string, string>
  recommendations: string[]
  score: number
}

export default function AdvancedSEOOptimizer() {
  const pathname = usePathname()
  const [metrics, setMetrics] = useState<SEOMetrics>({
    lcp: 0,
    fid: 0,
    cls: 0,
    fcp: 0,
    ttfb: 0
  })
  const [optimization, setOptimization] = useState<SEOOptimization | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)

  useEffect(() => {
    // Initialize advanced performance monitoring
    initializePerformanceMonitoring()
    
    // Initialize advanced SEO optimization
    initializeAdvancedSEO()
    
    // Initialize real-time optimization
    initializeRealTimeOptimization()
    
    // Initialize advanced analytics
    initializeAdvancedAnalytics()
    
  }, [pathname])

  const initializePerformanceMonitoring = () => {
    // Core Web Vitals monitoring with advanced metrics
    if (typeof window !== 'undefined') {
      // Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          setMetrics(prev => ({ ...prev, lcp: entry.startTime }))
          reportMetric('LCP', entry.startTime)
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const fid = (entry as any).processingStart - entry.startTime
          setMetrics(prev => ({ ...prev, fid }))
          reportMetric('FID', fid)
        }
      }).observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift
      let clsValue = 0
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
            setMetrics(prev => ({ ...prev, cls: clsValue }))
            reportMetric('CLS', clsValue)
          }
        }
      }).observe({ entryTypes: ['layout-shift'] })

      // First Contentful Paint
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          setMetrics(prev => ({ ...prev, fcp: entry.startTime }))
          reportMetric('FCP', entry.startTime)
        }
      }).observe({ entryTypes: ['paint'] })

      // Time to First Byte
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.fetchStart
        setMetrics(prev => ({ ...prev, ttfb }))
        reportMetric('TTFB', ttfb)
      }
    }
  }

  const initializeAdvancedSEO = async () => {
    if (typeof window === 'undefined') return

    setIsOptimizing(true)
    
    try {
      // Extract page data for optimization
      const pageData = {
        url: window.location.href,
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
        content: document.body.innerText,
        keywords: extractKeywords(),
        category: extractCategory()
      }

      // Call advanced SEO optimization API
      const response = await fetch('/api/seo-optimizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData)
      })

      if (response.ok) {
        const result = await response.json()
        setOptimization(result.optimizations)
        
        // Apply real-time optimizations
        applyRealTimeOptimizations(result.optimizations)
      }
    } catch (error) {
      console.error('SEO optimization failed:', error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const initializeRealTimeOptimization = () => {
    if (typeof window === 'undefined') return

    // Advanced image lazy loading with intersection observer
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.classList.remove('lazy')
            imageObserver.unobserve(img)
          }
        }
      })
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    })

    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img)
    })

    // Advanced resource prefetching
    const linkObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const link = entry.target as HTMLAnchorElement
          if (link.href && !link.dataset.prefetched) {
            prefetchResource(link.href)
            link.dataset.prefetched = 'true'
          }
        }
      })
    }, {
      rootMargin: '100px 0px'
    })

    // Observe all internal links
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      linkObserver.observe(link)
    })

    // Advanced font loading optimization
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded')
        reportMetric('FontsLoaded', performance.now())
      })
    }
  }

  const initializeAdvancedAnalytics = () => {
    if (typeof window === 'undefined') return

    // Advanced user behavior tracking
    let scrollDepth = 0
    let maxScrollDepth = 0
    let timeOnPage = Date.now()
    let interactions = 0

    // Scroll depth tracking
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      scrollDepth = Math.round((scrollTop / docHeight) * 100)
      maxScrollDepth = Math.max(maxScrollDepth, scrollDepth)
    }

    window.addEventListener('scroll', trackScrollDepth, { passive: true })

    // Interaction tracking
    const trackInteraction = () => {
      interactions++
    }

    document.addEventListener('click', trackInteraction)
    document.addEventListener('keydown', trackInteraction)

    // Send analytics on page unload
    window.addEventListener('beforeunload', () => {
      const sessionData = {
        url: window.location.href,
        timeOnPage: Date.now() - timeOnPage,
        maxScrollDepth,
        interactions,
        metrics,
        userAgent: navigator.userAgent,
        connection: (navigator as any).connection?.effectiveType || 'unknown'
      }

      // Send analytics data
      if ('sendBeacon' in navigator) {
        navigator.sendBeacon('/api/analytics', JSON.stringify(sessionData))
      }
    })
  }

  const extractKeywords = (): string[] => {
    const keywords: string[] = []
    
    // Extract from meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content')
    if (metaKeywords) {
      keywords.push(...metaKeywords.split(',').map(k => k.trim()))
    }
    
    // Extract from headings
    const headings = document.querySelectorAll('h1, h2, h3')
    headings.forEach(heading => {
      const text = heading.textContent?.toLowerCase() || ''
      if (text.includes('ai')) keywords.push('ai tools')
      if (text.includes('artificial intelligence')) keywords.push('artificial intelligence')
      if (text.includes('machine learning')) keywords.push('machine learning')
    })
    
    return Array.from(new Set(keywords))
  }

  const extractCategory = (): string => {
    const pathname = window.location.pathname
    if (pathname.includes('/ai-tools/')) {
      const parts = pathname.split('/')
      return parts[2] || 'ai-tools'
    }
    return 'general'
  }

  const applyRealTimeOptimizations = (optimizations: SEOOptimization) => {
    // Apply structured data
    if (optimizations.structuredData) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = optimizations.structuredData
      document.head.appendChild(script)
    }

    // Apply meta tag optimizations
    Object.entries(optimizations.metaTags).forEach(([name, content]) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = name
        document.head.appendChild(meta)
      }
      meta.content = content
    })

    // Apply performance optimizations
    optimizeResourceLoading()
  }

  const optimizeResourceLoading = () => {
    // Preload critical resources
    const criticalResources = [
      '/api/tools/featured',
      '/api/categories'
    ]

    criticalResources.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = url
      document.head.appendChild(link)
    })

    // Optimize third-party scripts
    const scripts = document.querySelectorAll('script[src]')
    scripts.forEach(script => {
      if (script.getAttribute('src')?.includes('google')) {
        script.setAttribute('loading', 'lazy')
      }
    })
  }

  const prefetchResource = (url: string) => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    document.head.appendChild(link)
  }

  const reportMetric = (name: string, value: number) => {
    // Report to Google Analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      ;(window as any).gtag('event', 'web_vitals', {
        name,
        value: Math.round(value),
        custom_parameter_1: pathname,
        custom_parameter_2: (navigator as any).connection ? (navigator as any).connection.effectiveType : 'unknown'
      })
    }

    // Report to custom analytics
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: name,
        value,
        url: window.location.href,
        timestamp: Date.now()
      })
    }).catch(() => {}) // Fail silently
  }

  // This component doesn't render anything visible
  // It works entirely in the background for SEO optimization
  return null
}