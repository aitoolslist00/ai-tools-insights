'use client'

import { useEffect } from 'react'

interface PerformanceMetrics {
  buildTime?: string
  renderTime?: number
  hydrationTime?: number
  cacheHit?: boolean
}

export default function SSGPerformanceMonitor() {
  useEffect(() => {
    // Only run in development or when performance monitoring is enabled
    if (process.env.NODE_ENV !== 'development' && !process.env.NEXT_PUBLIC_ENABLE_PERF_MONITORING) {
      return
    }

    const measurePerformance = () => {
      // Measure hydration time
      const hydrationStart = performance.mark('hydration-start')
      
      // Measure when the page is fully interactive
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            console.log('🚀 SSG Performance Metrics:', {
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
              firstPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-paint')?.startTime,
              firstContentfulPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime,
              cacheStatus: navEntry.transferSize === 0 ? 'cache-hit' : 'network',
              renderingMode: 'SSG'
            })
          }
        })
      })

      observer.observe({ entryTypes: ['navigation'] })

      // Measure Core Web Vitals for SSG
      const measureWebVitals = () => {
        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          console.log('📊 LCP (SSG):', lastEntry.startTime)
        }).observe({ entryTypes: ['largest-contentful-paint'] })

        // First Input Delay
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            const fidEntry = entry as any // Type assertion for FID entry
            if (fidEntry.processingStart) {
              console.log('⚡ FID (SSG):', fidEntry.processingStart - fidEntry.startTime)
            }
          })
        }).observe({ entryTypes: ['first-input'] })

        // Cumulative Layout Shift
        let clsValue = 0
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          console.log('📐 CLS (SSG):', clsValue)
        }).observe({ entryTypes: ['layout-shift'] })
      }

      // Delay measurement to ensure page is fully loaded
      setTimeout(measureWebVitals, 1000)
    }

    // Run performance measurement
    measurePerformance()

    // Log SSG-specific information
    console.log('🏗️ Page rendered via SSG with ISR')
    console.log('⚡ Static generation benefits: Faster TTFB, Better SEO, Improved caching')
    
  }, [])

  // This component doesn't render anything
  return null
}

// Export performance utilities
export const logSSGMetrics = (pageName: string, buildTime?: string) => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log(`📄 SSG Page: ${pageName}`)
    if (buildTime) {
      console.log(`⏱️ Build Time: ${buildTime}`)
    }
    console.log('🎯 Optimization: Static generation with ISR enabled')
  }
}