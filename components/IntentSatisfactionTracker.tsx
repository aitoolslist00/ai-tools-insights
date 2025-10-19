'use client'

import { useEffect, useState } from 'react'

interface IntentMetrics {
  timeOnPage: number
  scrollDepth: number
  engagementScore: number
  bounceRate: number
  taskCompletion: boolean
  userSatisfaction: number
}

interface IntentSatisfactionTrackerProps {
  pageType: 'homepage' | 'tool' | 'blog' | 'category' | 'search'
  contentType?: string
  keywords?: string[]
}

export default function IntentSatisfactionTracker({ 
  pageType, 
  contentType, 
  keywords = [] 
}: IntentSatisfactionTrackerProps) {
  const [metrics, setMetrics] = useState<IntentMetrics>({
    timeOnPage: 0,
    scrollDepth: 0,
    engagementScore: 0,
    bounceRate: 0,
    taskCompletion: false,
    userSatisfaction: 0
  })

  useEffect(() => {
    // Track time on page
    const startTime = Date.now()
    let maxScrollDepth = 0
    let engagementEvents = 0
    let lastScrollTime = Date.now()

    // Scroll depth tracking with engagement scoring
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent
        
        // Award engagement points for meaningful scroll
        if (Date.now() - lastScrollTime > 1000) { // Slow, deliberate scrolling
          engagementEvents += 1
        }
        lastScrollTime = Date.now()
      }
    }

    // Click tracking for engagement
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Track meaningful interactions
      if (target.tagName === 'A' || 
          target.tagName === 'BUTTON' || 
          target.closest('[data-engagement]') ||
          target.closest('.tool-card') ||
          target.closest('.blog-card') ||
          target.closest('.faq-item')) {
        engagementEvents += 2
      }
    }

    // Copy text tracking (indicates content value)
    const handleCopy = () => {
      engagementEvents += 3 // High value engagement
    }

    // Search within page tracking
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        engagementEvents += 1 // User searching for specific info
      }
    }

    // Tab visibility tracking (focus/blur)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched tabs - potential dissatisfaction
        setMetrics(prev => ({
          ...prev,
          userSatisfaction: Math.max(0, prev.userSatisfaction - 0.1)
        }))
      }
    }

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('click', handleClick)
    document.addEventListener('copy', handleCopy)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Update metrics every 5 seconds
    const metricsInterval = setInterval(() => {
      const timeOnPage = (Date.now() - startTime) / 1000
      const engagementScore = Math.min(100, (engagementEvents / (timeOnPage / 30)) * 100)
      
      // Calculate user satisfaction based on multiple factors
      let satisfaction = 50 // Base satisfaction
      
      // Time-based satisfaction (sweet spot: 30s - 5min)
      if (timeOnPage > 30 && timeOnPage < 300) {
        satisfaction += 20
      } else if (timeOnPage > 300) {
        satisfaction += 30
      }
      
      // Scroll-based satisfaction
      if (maxScrollDepth > 25) satisfaction += 10
      if (maxScrollDepth > 50) satisfaction += 10
      if (maxScrollDepth > 75) satisfaction += 10
      
      // Engagement-based satisfaction
      if (engagementScore > 20) satisfaction += 10
      if (engagementScore > 50) satisfaction += 15
      
      // Task completion indicators
      const taskCompletion = 
        maxScrollDepth > 80 || // Read most of content
        engagementEvents > 3 || // Multiple interactions
        timeOnPage > 120 // Spent significant time
      
      if (taskCompletion) satisfaction += 20

      setMetrics({
        timeOnPage,
        scrollDepth: maxScrollDepth,
        engagementScore,
        bounceRate: timeOnPage < 10 ? 100 : Math.max(0, 100 - (timeOnPage * 2)),
        taskCompletion,
        userSatisfaction: Math.min(100, satisfaction)
      })
    }, 5000)

    // Send metrics on page unload
    const handleBeforeUnload = () => {
      const finalMetrics = {
        ...metrics,
        timeOnPage: (Date.now() - startTime) / 1000,
        scrollDepth: maxScrollDepth,
        engagementScore: Math.min(100, (engagementEvents / ((Date.now() - startTime) / 30000)) * 100)
      }

      // Send to analytics (Google Analytics 4, custom endpoint, etc.)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'intent_satisfaction', {
          page_type: pageType,
          content_type: contentType,
          time_on_page: finalMetrics.timeOnPage,
          scroll_depth: finalMetrics.scrollDepth,
          engagement_score: finalMetrics.engagementScore,
          task_completion: finalMetrics.taskCompletion,
          user_satisfaction: finalMetrics.userSatisfaction,
          keywords: keywords.join(',')
        })
      }

      // Send to custom analytics endpoint
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/intent-metrics', JSON.stringify({
          ...finalMetrics,
          pageType,
          contentType,
          keywords,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer
        }))
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      clearInterval(metricsInterval)
    }
  }, [pageType, contentType, keywords])

  // Generate structured data for Intent Satisfaction
  // Using valid Schema.org WebPage type with interactionStatistic
  const intentSatisfactionSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'url': typeof window !== 'undefined' ? window.location.href : '',
    'name': typeof document !== 'undefined' ? document.title : '',
    'interactionStatistic': [
      {
        '@type': 'InteractionCounter',
        'interactionType': 'https://schema.org/ReadAction',
        'userInteractionCount': metrics.engagementScore
      },
      {
        '@type': 'InteractionCounter',
        'interactionType': 'https://schema.org/ViewAction',
        'userInteractionCount': Math.max(1, metrics.engagementScore)
      }
    ],
    'isPartOf': {
      '@type': 'WebSite',
      'name': 'AI Tools Insights',
      'url': 'https://www.aitoolsinsights.com'
    }
  }

  return (
    <>
      {/* Intent Satisfaction Schema for 2025 Algorithm Compliance */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(intentSatisfactionSchema)
        }}
      />
      
      {/* Hidden metrics for debugging (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div 
          style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 9999,
            maxWidth: '200px'
          }}
        >
          <div>Time: {Math.round(metrics.timeOnPage)}s</div>
          <div>Scroll: {metrics.scrollDepth}%</div>
          <div>Engagement: {Math.round(metrics.engagementScore)}</div>
          <div>Satisfaction: {Math.round(metrics.userSatisfaction)}%</div>
          <div>Task Complete: {metrics.taskCompletion ? '✅' : '❌'}</div>
        </div>
      )}
    </>
  )
}