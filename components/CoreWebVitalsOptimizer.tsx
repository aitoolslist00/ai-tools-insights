'use client'

import { useEffect, useState } from 'react'

interface WebVitalsMetrics {
  lcp: number | null
  fid: number | null
  cls: number | null
  fcp: number | null
  ttfb: number | null
  inp: number | null
}

interface CoreWebVitalsOptimizerProps {
  enableReporting?: boolean
  enableOptimizations?: boolean
}

export default function CoreWebVitalsOptimizer({ 
  enableReporting = true, 
  enableOptimizations = true 
}: CoreWebVitalsOptimizerProps) {
  const [metrics, setMetrics] = useState<WebVitalsMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    inp: null
  })

  useEffect(() => {
    if (!enableReporting) return

    // Enhanced Web Vitals tracking for 2025
    const trackWebVitals = async () => {
      try {
        // Dynamic import to avoid blocking main thread
        const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals')

        // Track Core Web Vitals
        onCLS((metric) => {
          setMetrics(prev => ({ ...prev, cls: metric.value }))
          reportMetric('CLS', metric.value, metric.rating)
        })

        onFCP((metric) => {
          setMetrics(prev => ({ ...prev, fcp: metric.value }))
          reportMetric('FCP', metric.value, metric.rating)
        })

        onLCP((metric) => {
          setMetrics(prev => ({ ...prev, lcp: metric.value }))
          reportMetric('LCP', metric.value, metric.rating)
        })

        onTTFB((metric) => {
          setMetrics(prev => ({ ...prev, ttfb: metric.value }))
          reportMetric('TTFB', metric.value, metric.rating)
        })

        // Track INP (Interaction to Next Paint) - 2025 Core Web Vital
        onINP((metric) => {
          setMetrics(prev => ({ ...prev, inp: metric.value }))
          reportMetric('INP', metric.value, metric.rating)
        })

      } catch (error) {
        console.warn('Web Vitals tracking failed:', error)
      }
    }

    trackWebVitals()
  }, [enableReporting])

  useEffect(() => {
    if (!enableOptimizations) return

    // Performance optimizations for 2025
    const optimizePerformance = () => {
      // 1. Optimize images with Intersection Observer
      const images = document.querySelectorAll('img[loading="lazy"]')
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              if (img.dataset.src) {
                img.src = img.dataset.src
                img.removeAttribute('data-src')
                imageObserver.unobserve(img)
              }
            }
          })
        }, { rootMargin: '50px' })

        images.forEach(img => imageObserver.observe(img))
      }

      // 2. Preload critical resources
      const preloadCriticalResources = () => {
        // Preload critical fonts
        const fontLink = document.createElement('link')
        fontLink.rel = 'preload'
        fontLink.href = '/fonts/inter-var.woff2'
        fontLink.as = 'font'
        fontLink.type = 'font/woff2'
        fontLink.crossOrigin = 'anonymous'
        document.head.appendChild(fontLink)

        // Preload critical CSS
        const cssLink = document.createElement('link')
        cssLink.rel = 'preload'
        cssLink.href = '/styles/critical.css'
        cssLink.as = 'style'
        document.head.appendChild(cssLink)
      }

      // 3. Optimize third-party scripts
      const optimizeThirdPartyScripts = () => {
        // Defer non-critical scripts
        const scripts = document.querySelectorAll('script[data-defer]')
        scripts.forEach(script => {
          const newScript = document.createElement('script')
          newScript.src = script.getAttribute('src') || ''
          newScript.defer = true
          script.parentNode?.replaceChild(newScript, script)
        })
      }

      // 4. Implement resource hints
      const implementResourceHints = () => {
        // DNS prefetch for external domains
        const domains = ['fonts.googleapis.com', 'www.google-analytics.com']
        domains.forEach(domain => {
          const link = document.createElement('link')
          link.rel = 'dns-prefetch'
          link.href = `//${domain}`
          document.head.appendChild(link)
        })
      }

      // 5. Optimize animations for better CLS
      const optimizeAnimations = () => {
        const style = document.createElement('style')
        style.textContent = `
          .gpu-accelerated {
            transform: translateZ(0);
            will-change: transform;
          }
          
          .optimize-animations {
            animation-fill-mode: both;
            backface-visibility: hidden;
          }
          
          .reduce-layout-shift {
            contain: layout style paint;
          }
        `
        document.head.appendChild(style)
      }

      preloadCriticalResources()
      optimizeThirdPartyScripts()
      implementResourceHints()
      optimizeAnimations()
    }

    // Run optimizations after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', optimizePerformance)
    } else {
      optimizePerformance()
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', optimizePerformance)
    }
  }, [enableOptimizations])

  const reportMetric = async (name: string, value: number, rating: string) => {
    try {
      // Report to Google Analytics 4
      if (typeof gtag !== 'undefined') {
        gtag('event', name, {
          event_category: 'Web Vitals',
          event_label: rating,
          value: Math.round(value),
          non_interaction: true,
        })
      }

      // Report to custom analytics endpoint
      await fetch('/api/web-vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          value,
          rating,
          url: window.location.href,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          connection: (navigator as any).connection?.effectiveType || 'unknown'
        }),
      })
    } catch (error) {
      console.warn('Failed to report Web Vitals:', error)
    }
  }

  // Development mode display
  if (process.env.NODE_ENV === 'development' && enableReporting) {
    return (
      <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs font-mono z-50">
        <h4 className="font-bold mb-2">Core Web Vitals (2025)</h4>
        <div className="space-y-1">
          <div>LCP: {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'Measuring...'}</div>
          <div>FID: {metrics.fid ? `${Math.round(metrics.fid)}ms` : 'Measuring...'}</div>
          <div>CLS: {metrics.cls ? metrics.cls.toFixed(3) : 'Measuring...'}</div>
          <div>FCP: {metrics.fcp ? `${Math.round(metrics.fcp)}ms` : 'Measuring...'}</div>
          <div>TTFB: {metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'Measuring...'}</div>
          <div>INP: {metrics.inp ? `${Math.round(metrics.inp)}ms` : 'Measuring...'}</div>
        </div>
      </div>
    )
  }

  return null
}

// Helper function to get Web Vitals score
export const getWebVitalsScore = (metrics: WebVitalsMetrics): number => {
  let score = 0
  let count = 0

  // LCP scoring (good: <2.5s, needs improvement: 2.5-4s, poor: >4s)
  if (metrics.lcp !== null) {
    if (metrics.lcp <= 2500) score += 100
    else if (metrics.lcp <= 4000) score += 75
    else score += 50
    count++
  }

  // FID scoring (good: <100ms, needs improvement: 100-300ms, poor: >300ms)
  if (metrics.fid !== null) {
    if (metrics.fid <= 100) score += 100
    else if (metrics.fid <= 300) score += 75
    else score += 50
    count++
  }

  // CLS scoring (good: <0.1, needs improvement: 0.1-0.25, poor: >0.25)
  if (metrics.cls !== null) {
    if (metrics.cls <= 0.1) score += 100
    else if (metrics.cls <= 0.25) score += 75
    else score += 50
    count++
  }

  // INP scoring (good: <200ms, needs improvement: 200-500ms, poor: >500ms)
  if (metrics.inp !== null) {
    if (metrics.inp <= 200) score += 100
    else if (metrics.inp <= 500) score += 75
    else score += 50
    count++
  }

  return count > 0 ? Math.round(score / count) : 0
}