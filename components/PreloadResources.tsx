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
      // Use prefetch for pages (preload with 'document' is not supported)
      const prefetchLink = document.createElement('link')
      prefetchLink.rel = 'prefetch'
      prefetchLink.href = page
      document.head.appendChild(prefetchLink)
    })

    // Note: In Next.js 15 App Router, JavaScript chunks are automatically optimized
    // and don't follow the pages/_app.js pattern. Removing manual chunk preloading
    // as Next.js handles this automatically with better optimization.

  }, [])

  return null
}