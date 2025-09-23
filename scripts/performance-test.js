#!/usr/bin/env node

/**
 * Advanced Performance Testing Script
 * Tests all implemented optimizations and generates comprehensive reports
 */

const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const fs = require('fs').promises
const path = require('path')

class AdvancedPerformanceTester {
  constructor() {
    this.testUrls = [
      'http://localhost:3000',
      'http://localhost:3000/ai-tools',
      'http://localhost:3000/blog',
      'http://localhost:3000/ai-tools/chatgpt',
      'http://localhost:3000/search'
    ]
    
    this.reports = []
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  }

  async runComprehensiveTests() {
    console.log('🚀 Starting Advanced Performance Testing...')
    
    try {
      // Test Core Web Vitals
      await this.testCoreWebVitals()
      
      // Test Caching Performance
      await this.testCachingPerformance()
      
      // Test SEO Optimization
      await this.testSEOOptimization()
      
      // Test Image Optimization
      await this.testImageOptimization()
      
      // Test Bundle Performance
      await this.testBundlePerformance()
      
      // Generate comprehensive report
      await this.generateComprehensiveReport()
      
      console.log('✅ All performance tests completed successfully!')
      
    } catch (error) {
      console.error('❌ Performance testing failed:', error)
      process.exit(1)
    }
  }

  async testCoreWebVitals() {
    console.log('\n📊 Testing Core Web Vitals...')
    
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })
    
    try {
      for (const url of this.testUrls) {
        console.log(`Testing: ${url}`)
        
        const options = {
          logLevel: 'info',
          output: 'json',
          onlyCategories: ['performance'],
          port: chrome.port,
        }
        
        const runnerResult = await lighthouse(url, options)
        const report = runnerResult.lhr
        
        const coreWebVitals = {
          url,
          lcp: report.audits['largest-contentful-paint'].numericValue,
          fid: report.audits['max-potential-fid'].numericValue,
          cls: report.audits['cumulative-layout-shift'].numericValue,
          fcp: report.audits['first-contentful-paint'].numericValue,
          ttfb: report.audits['server-response-time'].numericValue,
          performanceScore: report.categories.performance.score * 100
        }
        
        this.reports.push({
          type: 'Core Web Vitals',
          ...coreWebVitals
        })
        
        console.log(`  LCP: ${coreWebVitals.lcp}ms`)
        console.log(`  FID: ${coreWebVitals.fid}ms`)
        console.log(`  CLS: ${coreWebVitals.cls}`)
        console.log(`  Performance Score: ${coreWebVitals.performanceScore}`)
      }
    } finally {
      await chrome.kill()
    }
  }

  async testCachingPerformance() {
    console.log('\n💾 Testing Caching Performance...')
    
    const testCaching = async (url) => {
      const startTime = Date.now()
      
      // First request (no cache)
      const response1 = await fetch(url, { cache: 'no-store' })
      const firstLoadTime = Date.now() - startTime
      
      // Second request (should be cached)
      const startTime2 = Date.now()
      const response2 = await fetch(url)
      const secondLoadTime = Date.now() - startTime2
      
      const cacheHeaders = {
        cacheControl: response2.headers.get('cache-control'),
        etag: response2.headers.get('etag'),
        lastModified: response2.headers.get('last-modified'),
      }
      
      return {
        url,
        firstLoadTime,
        secondLoadTime,
        cacheEfficiency: ((firstLoadTime - secondLoadTime) / firstLoadTime * 100).toFixed(2),
        cacheHeaders
      }
    }
    
    for (const url of this.testUrls) {
      try {
        const cacheTest = await testCaching(url)
        this.reports.push({
          type: 'Caching Performance',
          ...cacheTest
        })
        
        console.log(`  ${url}:`)
        console.log(`    First load: ${cacheTest.firstLoadTime}ms`)
        console.log(`    Cached load: ${cacheTest.secondLoadTime}ms`)
        console.log(`    Cache efficiency: ${cacheTest.cacheEfficiency}%`)
      } catch (error) {
        console.log(`    Error testing ${url}: ${error.message}`)
      }
    }
  }

  async testSEOOptimization() {
    console.log('\n🔍 Testing SEO Optimization...')
    
    const testSEO = async (url) => {
      try {
        const response = await fetch(url)
        const html = await response.text()
        
        const seoMetrics = {
          url,
          hasTitle: /<title>/.test(html),
          hasMetaDescription: /<meta[^>]*name="description"/.test(html),
          hasCanonical: /<link[^>]*rel="canonical"/.test(html),
          hasOpenGraph: /<meta[^>]*property="og:/.test(html),
          hasTwitterCard: /<meta[^>]*name="twitter:/.test(html),
          hasStructuredData: /<script[^>]*type="application\/ld\+json"/.test(html),
          hasHreflang: /<link[^>]*hreflang=/.test(html),
          robotsDirective: (html.match(/<meta[^>]*name="robots"[^>]*content="([^"]*)"/) || [])[1] || 'not found'
        }
        
        return seoMetrics
      } catch (error) {
        console.log(`    Error testing SEO for ${url}: ${error.message}`)
        return { url, error: error.message }
      }
    }
    
    for (const url of this.testUrls) {
      const seoTest = await testSEO(url)
      this.reports.push({
        type: 'SEO Optimization',
        ...seoTest
      })
      
      console.log(`  ${url}:`)
      console.log(`    Title: ${seoTest.hasTitle ? '✅' : '❌'}`)
      console.log(`    Meta Description: ${seoTest.hasMetaDescription ? '✅' : '❌'}`)
      console.log(`    Canonical: ${seoTest.hasCanonical ? '✅' : '❌'}`)
      console.log(`    Open Graph: ${seoTest.hasOpenGraph ? '✅' : '❌'}`)
      console.log(`    Structured Data: ${seoTest.hasStructuredData ? '✅' : '❌'}`)
    }
  }

  async testImageOptimization() {
    console.log('\n🖼️ Testing Image Optimization...')
    
    const imageFormats = ['webp', 'avif', 'jpg', 'png']
    const testImage = '/hero-bg.webp'
    
    for (const format of imageFormats) {
      try {
        const url = `http://localhost:3000${testImage}?format=${format}`
        const startTime = Date.now()
        const response = await fetch(url)
        const loadTime = Date.now() - startTime
        
        const imageMetrics = {
          format,
          url,
          loadTime,
          size: parseInt(response.headers.get('content-length') || '0'),
          contentType: response.headers.get('content-type'),
          success: response.ok
        }
        
        this.reports.push({
          type: 'Image Optimization',
          ...imageMetrics
        })
        
        console.log(`  ${format.toUpperCase()}: ${loadTime}ms, ${Math.round(imageMetrics.size / 1024)}KB`)
      } catch (error) {
        console.log(`    Error testing ${format}: ${error.message}`)
      }
    }
  }

  async testBundlePerformance() {
    console.log('\n📦 Testing Bundle Performance...')
    
    try {
      // Check if build stats exist
      const buildStatsPath = path.join(process.cwd(), '.next', 'analyze')
      
      const bundleMetrics = {
        buildTime: 'N/A',
        bundleSize: 'N/A',
        chunkCount: 'N/A',
        compressionRatio: 'N/A'
      }
      
      try {
        const stats = await fs.readFile(path.join(buildStatsPath, 'stats.json'), 'utf8')
        const parsed = JSON.parse(stats)
        
        bundleMetrics.bundleSize = parsed.assets?.reduce((total, asset) => total + asset.size, 0) || 'N/A'
        bundleMetrics.chunkCount = parsed.chunks?.length || 'N/A'
      } catch (error) {
        console.log('    Build stats not available - run npm run build:analyze first')
      }
      
      this.reports.push({
        type: 'Bundle Performance',
        ...bundleMetrics
      })
      
      console.log(`  Bundle size: ${bundleMetrics.bundleSize}`)
      console.log(`  Chunk count: ${bundleMetrics.chunkCount}`)
    } catch (error) {
      console.log(`    Error testing bundle: ${error.message}`)
    }
  }

  async generateComprehensiveReport() {
    console.log('\n📋 Generating Comprehensive Report...')
    
    const reportData = {
      timestamp: this.timestamp,
      testUrls: this.testUrls,
      summary: this.generateSummary(),
      detailedReports: this.reports,
      recommendations: this.generateRecommendations()
    }
    
    const reportPath = path.join(process.cwd(), 'performance-reports')
    await fs.mkdir(reportPath, { recursive: true })
    
    // JSON Report
    await fs.writeFile(
      path.join(reportPath, `performance-report-${this.timestamp}.json`),
      JSON.stringify(reportData, null, 2)
    )
    
    // HTML Report
    const htmlReport = this.generateHTMLReport(reportData)
    await fs.writeFile(
      path.join(reportPath, `performance-report-${this.timestamp}.html`),
      htmlReport
    )
    
    console.log(`✅ Reports saved to performance-reports/`)
    console.log(`📊 View HTML report: performance-reports/performance-report-${this.timestamp}.html`)
  }

  generateSummary() {
    const webVitalsReports = this.reports.filter(r => r.type === 'Core Web Vitals')
    const avgPerformanceScore = webVitalsReports.reduce((sum, r) => sum + r.performanceScore, 0) / webVitalsReports.length
    
    return {
      averagePerformanceScore: Math.round(avgPerformanceScore),
      totalTestsRun: this.reports.length,
      passedTests: this.reports.filter(r => !r.error).length,
      failedTests: this.reports.filter(r => r.error).length
    }
  }

  generateRecommendations() {
    const recommendations = []
    
    // Performance recommendations
    const webVitalsReports = this.reports.filter(r => r.type === 'Core Web Vitals')
    const avgLCP = webVitalsReports.reduce((sum, r) => sum + r.lcp, 0) / webVitalsReports.length
    
    if (avgLCP > 2500) {
      recommendations.push('🔧 LCP is above 2.5s - Consider optimizing images and critical resource loading')
    }
    
    // SEO recommendations
    const seoReports = this.reports.filter(r => r.type === 'SEO Optimization')
    const missingSEO = seoReports.filter(r => !r.hasStructuredData)
    
    if (missingSEO.length > 0) {
      recommendations.push('🔍 Some pages missing structured data - Implement JSON-LD schemas')
    }
    
    // Caching recommendations
    const cacheReports = this.reports.filter(r => r.type === 'Caching Performance')
    const lowCacheEfficiency = cacheReports.filter(r => parseFloat(r.cacheEfficiency) < 50)
    
    if (lowCacheEfficiency.length > 0) {
      recommendations.push('💾 Low cache efficiency detected - Review cache headers and strategies')
    }
    
    return recommendations
  }

  generateHTMLReport(data) {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Performance Report - ${data.timestamp}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
    h2 { color: #374151; margin-top: 30px; }
    .summary { background: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0; }
    .metric { display: inline-block; margin: 10px 20px 10px 0; padding: 10px 15px; background: #e5e7eb; border-radius: 4px; }
    .recommendations { background: #fef3c7; padding: 20px; border-radius: 6px; border-left: 4px solid #f59e0b; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { background: #f9fafb; font-weight: bold; }
    .pass { color: #10b981; }
    .fail { color: #ef4444; }
    .score { font-size: 1.2em; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 Advanced Performance Report</h1>
    <p><strong>Generated:</strong> ${data.timestamp}</p>
    
    <div class="summary">
      <h2>📊 Summary</h2>
      <div class="metric">Average Performance Score: <span class="score">${data.summary.averagePerformanceScore}/100</span></div>
      <div class="metric">Total Tests: ${data.summary.totalTestsRun}</div>
      <div class="metric">Passed: <span class="pass">${data.summary.passedTests}</span></div>
      <div class="metric">Failed: <span class="fail">${data.summary.failedTests}</span></div>
    </div>
    
    ${data.recommendations.length > 0 ? `
    <div class="recommendations">
      <h2>💡 Recommendations</h2>
      <ul>
        ${data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
    </div>
    ` : ''}
    
    <h2>📈 Detailed Results</h2>
    <table>
      <thead>
        <tr>
          <th>Test Type</th>
          <th>URL</th>
          <th>Results</th>
        </tr>
      </thead>
      <tbody>
        ${data.detailedReports.map(report => `
          <tr>
            <td>${report.type}</td>
            <td>${report.url || 'N/A'}</td>
            <td>${JSON.stringify(report, null, 2).slice(0, 200)}...</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>
    `
  }
}

// Run the tests
const tester = new AdvancedPerformanceTester()
tester.runComprehensiveTests().catch(console.error)