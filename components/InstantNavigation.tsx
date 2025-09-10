'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function InstantNavigation() {
  const router = useRouter()

  useEffect(() => {
    // Prefetch critical routes immediately when component mounts
    const criticalRoutes = ['/ai-tools', '/blog', '/about', '/contact']
    
    criticalRoutes.forEach(route => {
      router.prefetch(route)
    })

    // Add hover prefetching for navigation links
    const addHoverPrefetch = () => {
      const navLinks = document.querySelectorAll('nav a[href^="/"]')
      
      navLinks.forEach(link => {
        const href = link.getAttribute('href')
        if (href) {
          // Prefetch on mouseenter for instant loading
          link.addEventListener('mouseenter', () => {
            router.prefetch(href)
          }, { once: true })
          
          // Also prefetch on focus for keyboard navigation
          link.addEventListener('focus', () => {
            router.prefetch(href)
          }, { once: true })
        }
      })
    }

    // Add hover prefetching after a short delay to ensure DOM is ready
    const timer = setTimeout(addHoverPrefetch, 100)

    // Preload critical page data
    const preloadPageData = async () => {
      try {
        // Only preload in production or after a delay in development
        const delay = process.env.NODE_ENV === 'development' ? 2000 : 0
        
        setTimeout(() => {
          // Preload AI tools data
          fetch('/api/tools', { method: 'HEAD' })
            .catch(() => console.log('API tools preload failed - this is normal in development'))
          
          // Preload blog data  
          fetch('/api/blog', { method: 'HEAD' })
            .catch(() => console.log('API blog preload failed - this is normal in development'))
          
          // Preload latest blog posts
          fetch('/api/blog/latest', { method: 'HEAD' })
            .catch(() => console.log('API blog/latest preload failed - this is normal in development'))
            
          // Preload blog posts endpoint
          fetch('/api/blog-posts', { method: 'HEAD' })
            .catch(() => console.log('API blog-posts preload failed - this is normal in development'))
        }, delay)
      } catch (error) {
        // Silently fail - this is just for preloading
        console.log('Preload error:', error)
      }
    }

    preloadPageData()

    return () => {
      clearTimeout(timer)
    }
  }, [router])

  // Add intersection observer for viewport-based prefetching
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement
            const href = link.getAttribute('href')
            if (href && href.startsWith('/')) {
              router.prefetch(href)
            }
          }
        })
      },
      { rootMargin: '50px' }
    )

    // Observe all internal links
    const timer = setTimeout(() => {
      const links = document.querySelectorAll('a[href^="/"]')
      links.forEach(link => observer.observe(link))
    }, 500)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [router])

  return null
}