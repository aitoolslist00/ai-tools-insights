'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface WebVitalsMetrics {
  lcp: number | null
  fid: number | null
  cls: number | null
  inp: number | null
  fcp: number | null
  ttfb: number | null
}

interface PerformanceIssue {
  metric: string
  value: number
  threshold: number
  severity: 'good' | 'needs-improvement' | 'poor'
  recommendation: string
}

export default function CoreWebVitalsMonitor() {
  const [metrics, setMetrics] = useState<WebVitalsMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    inp: null,
    fcp: null,
    ttfb: null
  })
  const [issues, setIssues] = useState<PerformanceIssue[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      setIsMonitoring(true)
      initializeWebVitalsMonitoring()
    }
  }, [pathname])

  const initializeWebVitalsMonitoring = () => {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      const lcp = lastEntry.startTime
      
      setMetrics(prev => ({ ...prev, lcp }))
      checkThreshold('LCP', lcp, 2500, 4000, 'Optimize images and remove render-blocking resources')
      
      // Send to analytics
      sendToAnalytics('LCP', lcp)
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay (FID) - Legacy
    const fidObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const fidEntry = entry as any // Cast to access processingStart
        const fid = fidEntry.processingStart - fidEntry.startTime
        setMetrics(prev => ({ ...prev, fid }))
        checkThreshold('FID', fid, 100, 300, 'Reduce JavaScript execution time and optimize event handlers')
        sendToAnalytics('FID', fid)
      }
    })
    fidObserver.observe({ entryTypes: ['first-input'] })

    // Interaction to Next Paint (INP) - New metric for 2024+
    const inpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const inpEntry = entry as any // Cast to access processingStart
        const inp = inpEntry.processingStart - inpEntry.startTime
        setMetrics(prev => ({ ...prev, inp }))
        checkThreshold('INP', inp, 200, 500, 'Optimize JavaScript and reduce main thread blocking')
        sendToAnalytics('INP', inp)
      }
    })
    inpObserver.observe({ entryTypes: ['event'] })

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const clsEntry = entry as any // Cast to access hadRecentInput and value
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value
        }
      }
      setMetrics(prev => ({ ...prev, cls: clsValue }))
      checkThreshold('CLS', clsValue, 0.1, 0.25, 'Add size attributes to images and avoid inserting content above existing content')
      sendToAnalytics('CLS', clsValue)
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })

    // First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const fcp = entry.startTime
        setMetrics(prev => ({ ...prev, fcp }))
        checkThreshold('FCP', fcp, 1800, 3000, 'Optimize server response time and eliminate render-blocking resources')
        sendToAnalytics('FCP', fcp)
      }
    })
    fcpObserver.observe({ entryTypes: ['paint'] })

    // Time to First Byte (TTFB)
    const navigationObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const navEntry = entry as any // Cast to access responseStart and requestStart
        const ttfb = navEntry.responseStart - navEntry.requestStart
        setMetrics(prev => ({ ...prev, ttfb }))
        checkThreshold('TTFB', ttfb, 800, 1800, 'Optimize server response time and use CDN')
        sendToAnalytics('TTFB', ttfb)
      }
    })
    navigationObserver.observe({ entryTypes: ['navigation'] })
  }

  const checkThreshold = (
    metric: string,
    value: number,
    goodThreshold: number,
    poorThreshold: number,
    recommendation: string
  ) => {
    let severity: 'good' | 'needs-improvement' | 'poor'
    
    if (value <= goodThreshold) {
      severity = 'good'
    } else if (value <= poorThreshold) {
      severity = 'needs-improvement'
    } else {
      severity = 'poor'
    }

    if (severity !== 'good') {
      const issue: PerformanceIssue = {
        metric,
        value,
        threshold: severity === 'needs-improvement' ? goodThreshold : poorThreshold,
        severity,
        recommendation
      }

      setIssues(prev => {
        const filtered = prev.filter(i => i.metric !== metric)
        return [...filtered, issue]
      })
    }
  }

  const sendToAnalytics = (metric: string, value: number) => {
    // Send to Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        name: metric,
        value: Math.round(metric === 'CLS' ? value * 1000 : value),
        event_category: 'Web Vitals',
        custom_parameter_1: pathname,
        custom_parameter_2: navigator.userAgent
      })
    }

    // Send to custom analytics endpoint
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric,
          value,
          pathname,
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      }).catch(console.error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'good': return 'text-green-600 bg-green-100'
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100'
      case 'poor': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatValue = (metric: string, value: number | null) => {
    if (value === null) return 'Measuring...'
    
    switch (metric) {
      case 'CLS':
        return value.toFixed(3)
      case 'LCP':
      case 'FID':
      case 'INP':
      case 'FCP':
      case 'TTFB':
        return `${Math.round(value)}ms`
      default:
        return value.toString()
    }
  }

  if (!isMonitoring) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Core Web Vitals
          </h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {key.toUpperCase()}:
              </span>
              <span className="text-gray-900 dark:text-white">
                {formatValue(key, value)}
              </span>
            </div>
          ))}
        </div>

        {issues.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
            <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
              Performance Issues
            </h4>
            <div className="space-y-2">
              {issues.map((issue, index) => (
                <div key={index} className="text-xs">
                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                    {issue.metric}: {formatValue(issue.metric, issue.value)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs">
                    {issue.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Page: {pathname}
          </p>
        </div>
      </div>
    </div>
  )
}

// Type declarations
declare global {
  function gtag(...args: any[]): void
}