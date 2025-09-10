'use client'

import { useEffect } from 'react'

interface PerformanceOptimizerProps {
  enablePreloading?: boolean
  enablePrefetching?: boolean
  enableImageOptimization?: boolean
}

export default function PerformanceOptimizer({
  enablePreloading = true,
  enablePrefetching = true,
  enableImageOptimization = true
}: PerformanceOptimizerProps) {
  
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Preload critical resources
    if (enablePreloading) {
      const criticalResources = [
        '/fonts/inter-var.woff2',
        '/logo.png',
        '/og-default.jpg'
      ]

      criticalResources.forEach(resource => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.href = resource
        link.as = resource.includes('.woff2') ? 'font' : 'image'
        if (resource.includes('.woff2')) {
          link.crossOrigin = 'anonymous'
        }
        document.head.appendChild(link)
      })
    }

    // Prefetch likely next pages
    if (enablePrefetching) {
      const prefetchPages = [
        '/ai-tools',
        '/blog',
        '/about'
      ]

      prefetchPages.forEach(page => {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = page
        document.head.appendChild(link)
      })
    }

    // Optimize images with Intersection Observer
    if (enableImageOptimization) {
      const images = document.querySelectorAll('img[data-src]')
      
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            img.src = img.dataset.src || ''
            img.classList.remove('lazy')
            observer.unobserve(img)
          }
        })
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      })

      images.forEach(img => imageObserver.observe(img))
    }

    // Optimize Core Web Vitals
    const optimizeCWV = () => {
      // Reduce layout shift by setting image dimensions
      const images = document.querySelectorAll('img:not([width]):not([height])')
      images.forEach(img => {
        const imgElement = img as HTMLImageElement
        if (imgElement.naturalWidth && imgElement.naturalHeight) {
          imgElement.width = imgElement.naturalWidth
          imgElement.height = imgElement.naturalHeight
        }
      })

      // Optimize LCP by preloading hero images
      const heroImages = document.querySelectorAll('.hero-image, .featured-image')
      heroImages.forEach(img => {
        const imgElement = img as HTMLImageElement
        if (imgElement.src) {
          const link = document.createElement('link')
          link.rel = 'preload'
          link.href = imgElement.src
          link.as = 'image'
          document.head.appendChild(link)
        }
      })
    }

    // Run optimization after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', optimizeCWV)
    } else {
      optimizeCWV()
    }

    // Monitor performance
    if ('PerformanceObserver' in window) {
      // Monitor LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        
        // Track LCP in analytics
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            name: 'LCP',
            value: Math.round(lastEntry.startTime),
            event_category: 'Web Vitals'
          })
        }
      })
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        // LCP not supported
      }

      // Monitor FID
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              name: 'FID',
              value: Math.round(entry.processingStart - entry.startTime),
              event_category: 'Web Vitals'
            })
          }
        })
      })
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] })
      } catch (e) {
        // FID not supported
      }

      // Monitor CLS
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            name: 'CLS',
            value: Math.round(clsValue * 1000),
            event_category: 'Web Vitals'
          })
        }
      })
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        // CLS not supported
      }
    }

    // Service Worker for caching
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration)
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError)
        })
    }

  }, [enablePreloading, enablePrefetching, enableImageOptimization])

  return null
}

// Service Worker content
export const serviceWorkerContent = `
const CACHE_NAME = 'ai-tools-list-v1'
const urlsToCache = [
  '/',
  '/ai-tools',
  '/blog',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/logo.png',
  '/fonts/inter-var.woff2'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})
`