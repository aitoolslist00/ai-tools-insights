'use client'

import { useEffect } from 'react'

export default function PerformanceMonitor() {
  useEffect(() => {
    // Web Vitals monitoring
    const reportWebVitals = async (metric: any) => {
      // Log in development, send to API in production
      if (process.env.NODE_ENV === 'development') {
        console.log('Performance Metric:', metric)
      } else {
        try {
          await fetch('/api/analytics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...metric,
              url: window.location.pathname,
              timestamp: Date.now()
            }),
          })
        } catch (error) {
          console.error('Failed to send performance metric:', error)
        }
      }
    }

    // Measure Core Web Vitals
    if (typeof window !== 'undefined') {
      // LCP (Largest Contentful Paint)
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        reportWebVitals({
          name: 'LCP',
          value: lastEntry.startTime,
          id: 'lcp'
        })
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          reportWebVitals({
            name: 'FID',
            value: entry.processingStart - entry.startTime,
            id: 'fid'
          })
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // CLS (Cumulative Layout Shift)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            reportWebVitals({
              name: 'CLS',
              value: clsValue,
              id: 'cls'
            })
          }
        })
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      // TTFB (Time to First Byte)
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigationEntry) {
        reportWebVitals({
          name: 'TTFB',
          value: navigationEntry.responseStart - navigationEntry.requestStart,
          id: 'ttfb'
        })
      }
    }
  }, [])

  return null
}