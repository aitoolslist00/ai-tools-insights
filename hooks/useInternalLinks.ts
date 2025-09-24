'use client'

import { useState, useEffect, useMemo } from 'react'
import { InternalLinkStrategy, InternalLink } from '@/lib/internal-link-strategy'
import { SEOInternalLinkAutomation, PageAnalysis } from '@/lib/seo-internal-link-automation'

interface UseInternalLinksOptions {
  currentPage: string
  content?: string
  category?: string
  blogSlug?: string
  maxLinks?: number
  context?: 'navigation' | 'contextual' | 'related' | 'footer' | 'breadcrumb'
  autoOptimize?: boolean
}

interface InternalLinksHookReturn {
  links: InternalLink[]
  isLoading: boolean
  error: string | null
  pageAnalysis: PageAnalysis | null
  refreshLinks: () => void
  trackLinkClick: (linkUrl: string) => void
}

/**
 * Custom hook for managing internal links with SEO optimization
 * Provides intelligent link suggestions and performance tracking
 */
export function useInternalLinks({
  currentPage,
  content = '',
  category = 'General',
  blogSlug,
  maxLinks = 5,
  context = 'contextual',
  autoOptimize = true
}: UseInternalLinksOptions): InternalLinksHookReturn {
  const [links, setLinks] = useState<InternalLink[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pageAnalysis, setPageAnalysis] = useState<PageAnalysis | null>(null)

  // Memoize link generation to avoid unnecessary recalculations
  const generateLinks = useMemo(() => {
    return () => {
      try {
        setIsLoading(true)
        setError(null)

        let generatedLinks: InternalLink[] = []

        switch (context) {
          case 'navigation':
            generatedLinks = InternalLinkStrategy.generateNavigationLinks()
            break
          
          case 'contextual':
            if (autoOptimize && content) {
              // Use advanced automation for contextual links
              const analysis = SEOInternalLinkAutomation.analyzePage(
                currentPage,
                extractTitleFromContent(content),
                content,
                category
              )
              setPageAnalysis(analysis)
              generatedLinks = SEOInternalLinkAutomation.generateOptimizedLinks(analysis, maxLinks)
            } else {
              generatedLinks = InternalLinkStrategy.generateContextualLinks(
                currentPage,
                content,
                maxLinks
              )
            }
            break
          
          case 'related':
            if (blogSlug) {
              generatedLinks = InternalLinkStrategy.generateRelatedBlogLinks(
                blogSlug,
                category,
                maxLinks
              )
            } else if (category) {
              generatedLinks = InternalLinkStrategy.generateCategoryHubLinks(category)
            }
            break
          
          case 'footer':
            generatedLinks = InternalLinkStrategy.generateFooterLinks()
            break
          
          case 'breadcrumb':
            generatedLinks = InternalLinkStrategy.generateBreadcrumbLinks(currentPage)
            break
          
          default:
            generatedLinks = []
        }

        setLinks(generatedLinks)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate links')
        setLinks([])
      } finally {
        setIsLoading(false)
      }
    }
  }, [currentPage, content, category, blogSlug, maxLinks, context, autoOptimize])

  // Generate links on mount and when dependencies change
  useEffect(() => {
    generateLinks()
  }, [generateLinks])

  // Track link clicks for performance analysis
  const trackLinkClick = (linkUrl: string) => {
    try {
      // Track the click event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'internal_link_click', {
          link_url: linkUrl,
          source_page: currentPage,
          link_context: context
        })
      }

      // You can also send to your own analytics endpoint
      fetch('/api/analytics/link-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkUrl,
          sourcePage: currentPage,
          context,
          timestamp: new Date().toISOString()
        })
      }).catch(console.error)
    } catch (err) {
      console.error('Failed to track link click:', err)
    }
  }

  return {
    links,
    isLoading,
    error,
    pageAnalysis,
    refreshLinks: generateLinks,
    trackLinkClick
  }
}

/**
 * Hook for blog-to-tool conversion links
 */
export function useBlogToToolLinks(blogSlug: string) {
  return useMemo(() => {
    return InternalLinkStrategy.generateBlogToToolLinks(blogSlug)
  }, [blogSlug])
}

/**
 * Hook for category hub links
 */
export function useCategoryHubLinks(category: string) {
  return useMemo(() => {
    return InternalLinkStrategy.generateCategoryHubLinks(category)
  }, [category])
}

/**
 * Hook for performance-optimized links
 */
export function useOptimizedLinks(
  currentPage: string,
  content: string,
  category: string = 'General'
) {
  const [optimizedLinks, setOptimizedLinks] = useState<InternalLink[]>([])
  const [analysis, setAnalysis] = useState<PageAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (!content || content.length < 100) return

    setIsAnalyzing(true)
    
    try {
      const pageAnalysis = SEOInternalLinkAutomation.analyzePage(
        currentPage,
        extractTitleFromContent(content),
        content,
        category
      )
      
      const links = SEOInternalLinkAutomation.generateOptimizedLinks(pageAnalysis, 8)
      
      setAnalysis(pageAnalysis)
      setOptimizedLinks(links)
    } catch (error) {
      console.error('Failed to generate optimized links:', error)
      setOptimizedLinks([])
    } finally {
      setIsAnalyzing(false)
    }
  }, [currentPage, content, category])

  return {
    links: optimizedLinks,
    analysis,
    isAnalyzing
  }
}

/**
 * Hook for link performance tracking
 */
export function useLinkPerformance(pageUrl: string) {
  const [metrics, setMetrics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const trackClick = (linkUrl: string, anchorText: string) => {
    // Track click event
    if (typeof window !== 'undefined') {
      // Google Analytics 4
      if (window.gtag) {
        window.gtag('event', 'click', {
          event_category: 'internal_link',
          event_label: linkUrl,
          custom_parameter_1: anchorText,
          custom_parameter_2: pageUrl
        })
      }

      // Custom analytics
      fetch('/api/analytics/internal-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'click',
          linkUrl,
          anchorText,
          sourceUrl: pageUrl,
          timestamp: Date.now(),
          userAgent: navigator.userAgent
        })
      }).catch(console.error)
    }
  }

  const trackImpression = (linkUrl: string) => {
    // Track impression event
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/internal-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'impression',
          linkUrl,
          sourceUrl: pageUrl,
          timestamp: Date.now()
        })
      }).catch(console.error)
    }
  }

  return {
    metrics,
    isLoading,
    trackClick,
    trackImpression
  }
}

// Helper functions
function extractTitleFromContent(content: string): string {
  // Try to extract title from h1 tag
  const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/)
  if (h1Match) return h1Match[1]
  
  // Try to extract from first heading
  const headingMatch = content.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/)
  if (headingMatch) return headingMatch[1]
  
  // Fallback to first sentence
  const sentences = content.replace(/<[^>]*>/g, '').split('.')
  return sentences[0]?.trim() || 'Untitled'
}

// Type declarations moved to AdvancedAnalytics.tsx to avoid conflicts

export default useInternalLinks