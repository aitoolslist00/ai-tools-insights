'use client'

import { useEffect } from 'react'

export default function PreloadResources() {
  useEffect(() => {
    // Preload critical images
    const criticalImages = [
      '/hero-bg.jpg',
      '/logo.png',
      '/featured-tool-1.jpg',
      '/featured-tool-2.jpg',
      '/featured-tool-3.jpg'
    ]

    criticalImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })

    // Preload critical API endpoints
    const criticalEndpoints = [
      '/api/tools',
      '/api/blog/latest'
    ]

    criticalEndpoints.forEach(endpoint => {
      fetch(endpoint, { method: 'HEAD' }).catch(() => {
        // Silently fail - this is just for preloading
      })
    })

    // Aggressively prefetch critical pages for instant navigation
    const criticalPages = [
      '/ai-tools',
      '/blog',
      '/about',
      '/contact'
    ]

    criticalPages.forEach(page => {
      // Use preload for immediate pages (higher priority than prefetch)
      const preloadLink = document.createElement('link')
      preloadLink.rel = 'preload'
      preloadLink.as = 'document'
      preloadLink.href = page
      document.head.appendChild(preloadLink)
      
      // Also add prefetch as fallback
      const prefetchLink = document.createElement('link')
      prefetchLink.rel = 'prefetch'
      prefetchLink.href = page
      document.head.appendChild(prefetchLink)
    })

    // Preload critical JavaScript chunks for instant navigation
    const criticalChunks = [
      '/_next/static/chunks/pages/ai-tools.js',
      '/_next/static/chunks/pages/blog.js'
    ]

    criticalChunks.forEach(chunk => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'script'
      link.href = chunk
      document.head.appendChild(link)
    })

  }, [])

  return null
}