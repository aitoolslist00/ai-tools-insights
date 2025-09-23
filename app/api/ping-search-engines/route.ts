import { NextResponse } from 'next/server'

// Ping search engines about sitemap updates for faster discovery
export async function POST() {
  const baseUrl = 'https://www.aitoolsinsights.com'
  const sitemapUrl = `${baseUrl}/sitemap.xml`
  
  const searchEngines = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://search.yahooapis.com/SiteExplorerService/V1/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  ]
  
  const results = []
  
  for (const pingUrl of searchEngines) {
    try {
      const response = await fetch(pingUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'AI Tools Insights Sitemap Ping Bot'
        }
      })
      
      results.push({
        engine: pingUrl.includes('google') ? 'Google' : 
                pingUrl.includes('bing') ? 'Bing' : 'Yahoo',
        status: response.ok ? 'success' : 'failed',
        statusCode: response.status
      })
    } catch (error) {
      results.push({
        engine: pingUrl.includes('google') ? 'Google' : 
                pingUrl.includes('bing') ? 'Bing' : 'Yahoo',
        status: 'error',
        error: 'Network error'
      })
    }
  }
  
  return NextResponse.json({
    success: true,
    message: 'Sitemap ping completed',
    results,
    timestamp: new Date().toISOString()
  })
}

// Auto-ping on content updates
export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to ping search engines',
    endpoints: {
      ping: 'POST /api/ping-search-engines',
      submit: 'POST /api/submit-to-google'
    }
  })
}