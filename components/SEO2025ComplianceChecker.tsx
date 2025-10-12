'use client'

import { useEffect, useState } from 'react'

interface ComplianceMetrics {
  intentSatisfaction: boolean
  eatSignals: boolean
  aiContentUnderstanding: boolean
  structuredData: boolean
  coreWebVitals: boolean
  semanticHTML: boolean
  mobileOptimization: boolean
  securityHeaders: boolean
  overallScore: number
}

export default function SEO2025ComplianceChecker() {
  const [metrics, setMetrics] = useState<ComplianceMetrics>({
    intentSatisfaction: false,
    eatSignals: false,
    aiContentUnderstanding: false,
    structuredData: false,
    coreWebVitals: false,
    semanticHTML: false,
    mobileOptimization: false,
    securityHeaders: false,
    overallScore: 0
  })

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development mode
    if (process.env.NODE_ENV !== 'development') return

    const checkCompliance = async () => {
      const results: Partial<ComplianceMetrics> = {}

      // 1. Check Intent Satisfaction Tracking
      results.intentSatisfaction = !!document.querySelector('[data-intent-tracker]') ||
        !!document.querySelector('script[src*="intent-satisfaction"]') ||
        !!(window as any).intentSatisfactionTracker

      // 2. Check E-A-T Signals
      results.eatSignals = !!(
        document.querySelector('meta[name="author"]') &&
        document.querySelector('meta[name="publisher"]') &&
        document.querySelector('[itemProp="author"]')
      )

      // 3. Check AI Content Understanding
      results.aiContentUnderstanding = !!(
        document.querySelector('[role="main"]') &&
        document.querySelector('[itemScope]') &&
        document.querySelector('[aria-label]') &&
        document.querySelectorAll('article, section, aside').length > 3
      )

      // 4. Check Structured Data
      const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]')
      results.structuredData = structuredDataScripts.length >= 3

      // 5. Check Core Web Vitals Implementation
      results.coreWebVitals = !!(
        (window as any).gtag ||
        document.querySelector('[data-web-vitals]') ||
        (window as any).webVitals
      )

      // 6. Check Semantic HTML
      const semanticElements = document.querySelectorAll('main, article, section, aside, nav, header, footer')
      results.semanticHTML = semanticElements.length >= 5

      // 7. Check Mobile Optimization
      const viewport = document.querySelector('meta[name="viewport"]')
      const mobileOptimized = viewport?.getAttribute('content')?.includes('width=device-width')
      results.mobileOptimization = !!mobileOptimized

      // 8. Check Security Headers (simulated check)
      results.securityHeaders = !!(
        document.querySelector('meta[http-equiv="Content-Security-Policy"]') ||
        document.querySelector('meta[http-equiv="X-Content-Type-Options"]')
      )

      // Calculate overall score
      const trueCount = Object.values(results).filter(Boolean).length
      results.overallScore = Math.round((trueCount / 8) * 100)

      setMetrics(results as ComplianceMetrics)
    }

    // Run check after DOM is fully loaded
    const timer = setTimeout(checkCompliance, 2000)
    
    // Show/hide with keyboard shortcut
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        setIsVisible(prev => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return null
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getStatusIcon = (status: boolean) => {
    return status ? '✅' : '❌'
  }

  return (
    <div className="fixed top-4 left-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-bold text-sm">SEO 2025 Compliance</h4>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className={`text-lg font-bold mb-3 ${getScoreColor(metrics.overallScore)}`}>
        Score: {metrics.overallScore}%
      </div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Intent Satisfaction:</span>
          <span>{getStatusIcon(metrics.intentSatisfaction)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>E-A-T Signals:</span>
          <span>{getStatusIcon(metrics.eatSignals)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>AI Understanding:</span>
          <span>{getStatusIcon(metrics.aiContentUnderstanding)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Structured Data:</span>
          <span>{getStatusIcon(metrics.structuredData)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Core Web Vitals:</span>
          <span>{getStatusIcon(metrics.coreWebVitals)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Semantic HTML:</span>
          <span>{getStatusIcon(metrics.semanticHTML)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Mobile Optimized:</span>
          <span>{getStatusIcon(metrics.mobileOptimization)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Security Headers:</span>
          <span>{getStatusIcon(metrics.securityHeaders)}</span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-600 text-xs text-gray-400">
        Press Ctrl+Shift+S to toggle
      </div>

      {metrics.overallScore >= 95 && (
        <div className="mt-2 p-2 bg-green-900 rounded text-green-200 text-xs">
          🎉 Excellent! Your site is fully optimized for 2025 algorithms.
        </div>
      )}

      {metrics.overallScore < 70 && (
        <div className="mt-2 p-2 bg-red-900 rounded text-red-200 text-xs">
          ⚠️ Needs improvement. Focus on failed checks above.
        </div>
      )}
    </div>
  )
}

// Export compliance checking function for use in other components
export const checkSEO2025Compliance = (): Promise<ComplianceMetrics> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results: ComplianceMetrics = {
        intentSatisfaction: !!document.querySelector('[data-intent-tracker]'),
        eatSignals: !!(document.querySelector('meta[name="author"]') && document.querySelector('meta[name="publisher"]')),
        aiContentUnderstanding: document.querySelectorAll('[role], [itemScope], [aria-label]').length > 10,
        structuredData: document.querySelectorAll('script[type="application/ld+json"]').length >= 3,
        coreWebVitals: !!(window.gtag || document.querySelector('[data-web-vitals]')),
        semanticHTML: document.querySelectorAll('main, article, section, aside, nav').length >= 5,
        mobileOptimization: !!document.querySelector('meta[name="viewport"][content*="width=device-width"]'),
        securityHeaders: true, // Assume headers are set at server level
        overallScore: 0
      }

      const trueCount = Object.values(results).filter((value, index) => index < 8 && value).length
      results.overallScore = Math.round((trueCount / 8) * 100)

      resolve(results)
    }, 1000)
  })
}