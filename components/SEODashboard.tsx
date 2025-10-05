'use client'

import { useState, useEffect } from 'react'
import { SEOSitemapOptimizer } from '@/lib/seo-sitemap-optimizer'

interface SEOReport {
  status: 'excellent' | 'good' | 'needs-improvement'
  score: number
  robotsTxt: {
    isValid: boolean
    hasOptimalSettings: boolean
    issues: string[]
    recommendations: string[]
  }
  sitemaps: {
    isValid: boolean
    count: number
    hasIndex: boolean
    issues: string[]
    recommendations: string[]
  }
  metrics: {
    crawlability: number
    indexability: number
    freshness: number
    performance: number
  }
  submissionUrls: {
    google: string
    bing: string
    yandex: string
  }
  nextSteps: string[]
}

export default function SEODashboard() {
  const [report, setReport] = useState<SEOReport | null>(null)
  const [isNotifying, setIsNotifying] = useState(false)
  const [lastNotification, setLastNotification] = useState<string | null>(null)

  useEffect(() => {
    const baseUrl = 'https://www.aitoolsinsights.com'
    const seoReport = SEOSitemapOptimizer.generateSEOReport(baseUrl)
    setReport(seoReport)
  }, [])

  const handleNotifySearchEngines = async () => {
    setIsNotifying(true)
    try {
      const response = await fetch('/api/seo/notify-search-engines', {
        method: 'POST'
      })
      const result = await response.json()
      
      if (result.success) {
        setLastNotification(result.timestamp)
        alert('Search engines notified successfully!')
      } else {
        alert('Failed to notify search engines: ' + result.message)
      }
    } catch (error) {
      alert('Error notifying search engines: ' + (error as Error).message)
    } finally {
      setIsNotifying(false)
    }
  }

  if (!report) {
    return <div className="p-6">Loading SEO Dashboard...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">SEO Dashboard</h1>
        
        {/* Overall Score */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-green-800">SEO Score: {report.score}/100</h2>
              <p className="text-green-600 capitalize">Status: {report.status}</p>
            </div>
            <div className="text-6xl text-green-500">🚀</div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800">Crawlability</h3>
            <p className="text-2xl font-bold text-blue-600">{report.metrics.crawlability}%</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-800">Indexability</h3>
            <p className="text-2xl font-bold text-purple-600">{report.metrics.indexability}%</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-semibold text-orange-800">Freshness</h3>
            <p className="text-2xl font-bold text-orange-600">{report.metrics.freshness}%</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800">Performance</h3>
            <p className="text-2xl font-bold text-green-600">{report.metrics.performance}%</p>
          </div>
        </div>

        {/* Robots.txt Status */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Robots.txt Configuration</h3>
          <div className="mb-4">
            <p className={`font-semibold ${report.robotsTxt.isValid ? 'text-green-600' : 'text-red-600'}`}>
              Status: {report.robotsTxt.isValid ? 'Valid' : 'Issues Found'}
            </p>
            <p className={`text-sm ${report.robotsTxt.hasOptimalSettings ? 'text-green-600' : 'text-yellow-600'}`}>
              Optimization: {report.robotsTxt.hasOptimalSettings ? 'Optimal' : 'Can be improved'}
            </p>
          </div>
          {report.robotsTxt.issues.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-red-800 mb-2">Issues:</h4>
              <div className="space-y-1">
                {report.robotsTxt.issues.map((issue, index) => (
                  <p key={index} className="text-red-600 text-sm">{issue}</p>
                ))}
              </div>
            </div>
          )}
          <div>
            <h4 className="font-semibold text-green-800 mb-2">Recommendations:</h4>
            <div className="space-y-1">
              {report.robotsTxt.recommendations.map((rec, index) => (
                <p key={index} className="text-green-600 text-sm">{rec}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Sitemap Status */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Sitemap Optimization</h3>
          <div className="mb-4">
            <p className={`font-semibold ${report.sitemaps.isValid ? 'text-green-600' : 'text-red-600'}`}>
              Status: {report.sitemaps.isValid ? 'Valid' : 'Issues Found'}
            </p>
            <p className="text-sm text-gray-600">
              Sitemaps: {report.sitemaps.count} | Index: {report.sitemaps.hasIndex ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {report.sitemaps.issues.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-800 mb-2">Issues</h4>
                <div className="space-y-1">
                  {report.sitemaps.issues.map((issue, index) => (
                    <p key={index} className="text-red-600 text-sm">{issue}</p>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Recommendations</h4>
              <div className="space-y-1">
                {report.sitemaps.recommendations.map((rec, index) => (
                  <p key={index} className="text-green-600 text-sm">{rec}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search Engine Notification */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Search Engine Notifications</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 mb-2">Notify search engines about sitemap updates</p>
              {lastNotification && (
                <p className="text-sm text-gray-500">Last notification: {new Date(lastNotification).toLocaleString()}</p>
              )}
            </div>
            <button
              onClick={handleNotifySearchEngines}
              disabled={isNotifying}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-semibold"
            >
              {isNotifying ? 'Notifying...' : 'Notify Search Engines'}
            </button>
          </div>
        </div>

        {/* Submission URLs */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Webmaster Tools Submission</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href={report.submissionUrls.google}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-center font-semibold"
            >
              Google Search Console
            </a>
            <a
              href={report.submissionUrls.bing}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center font-semibold"
            >
              Bing Webmaster Tools
            </a>
            <a
              href={report.submissionUrls.yandex}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-center font-semibold"
            >
              Yandex Webmaster
            </a>
          </div>
        </div>



        {/* Next Steps */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h3>
          <ol className="space-y-2">
            {report.nextSteps.map((step, index) => (
              <li key={index} className="text-gray-700">{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}