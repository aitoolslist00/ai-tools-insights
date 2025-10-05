import { NextRequest, NextResponse } from 'next/server'
import { SEOSitemapOptimizer } from '@/lib/seo-sitemap-optimizer'

export async function POST(request: NextRequest) {
  try {
    const baseUrl = 'https://www.aitoolsinsights.com'
    
    // Notify search engines about sitemap updates
    await SEOSitemapOptimizer.notifySearchEngines(baseUrl)
    
    return NextResponse.json({
      success: true,
      message: 'Search engines notified successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error notifying search engines:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to notify search engines',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  const baseUrl = 'https://www.aitoolsinsights.com'
  const report = SEOSitemapOptimizer.generateSEOReport(baseUrl)
  
  return NextResponse.json(report)
}