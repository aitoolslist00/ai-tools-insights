'use client'

import { useEffect } from 'react'
import { AdvancedPerformanceOptimizer } from '@/lib/advanced-performance-optimizer'

export default function AdvancedPerformanceOptimizerComponent() {
  useEffect(() => {
    try {
      // Initialize Web Vitals optimization
      const webVitalsScript = document.createElement('script')
      webVitalsScript.textContent = AdvancedPerformanceOptimizer.generateWebVitalsOptimization()
      document.head.appendChild(webVitalsScript)

      // Initialize performance budget monitoring
      const performanceScript = document.createElement('script')
      performanceScript.textContent = AdvancedPerformanceOptimizer.generatePerformanceBudgetMonitor()
      document.head.appendChild(performanceScript)

      // Add critical CSS
      const criticalCSS = document.createElement('style')
      criticalCSS.textContent = AdvancedPerformanceOptimizer.generateCriticalCSS()
      document.head.appendChild(criticalCSS)

      // Prefetch likely navigation targets based on user behavior
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement
            if (link.href && !link.dataset.prefetched) {
              const prefetchLink = document.createElement('link')
              prefetchLink.rel = 'prefetch'
              prefetchLink.href = link.href
              document.head.appendChild(prefetchLink)
              link.dataset.prefetched = 'true'
            }
          }
        })
      }, { threshold: 0.5 })

      // Observe navigation links
      document.querySelectorAll('a[href^="/"]').forEach(link => {
        observer.observe(link)
      })

      // Cleanup
      return () => {
        observer.disconnect()
        try {
          if (webVitalsScript.parentNode) {
            document.head.removeChild(webVitalsScript)
          }
          if (performanceScript.parentNode) {
            document.head.removeChild(performanceScript)
          }
          if (criticalCSS.parentNode) {
            document.head.removeChild(criticalCSS)
          }
        } catch (error) {
          console.warn('Error cleaning up performance scripts:', error)
        }
      }
    } catch (error) {
      console.warn('Error initializing performance optimizations:', error)
    }
  }, [])

  return null // This component doesn't render anything
}