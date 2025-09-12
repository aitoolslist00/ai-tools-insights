import { NextRequest, NextResponse } from 'next/server'

// Google Indexing API helper endpoint
export async function POST(request: NextRequest) {
  try {
    const { urls, action = 'URL_UPDATED' } = await request.json()
    
    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json({ error: 'URLs array is required' }, { status: 400 })
    }

    // This would require Google Service Account credentials
    // For now, return the URLs that should be submitted to Google
    const baseUrl = 'https://www.aitoolsinsights.com'
    
    const priorityUrls = [
      `${baseUrl}`,
      `${baseUrl}/ai-tools`,
      `${baseUrl}/blog`,
      `${baseUrl}/sitemap-index.xml`,
      ...urls
    ]

    // In production, you would use Google's Indexing API here
    // const indexingResults = await submitToGoogleIndexingAPI(priorityUrls, action)

    return NextResponse.json({
      message: 'URLs prepared for Google Indexing API submission',
      urls: priorityUrls,
      action,
      note: 'Configure Google Service Account credentials to enable automatic submission'
    })
  } catch (error) {
    console.error('Google Indexing API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to get all important URLs for indexing
export async function GET() {
  const baseUrl = 'https://www.aitoolsinsights.com'
  
  const importantUrls = [
    // Core pages
    baseUrl,
    `${baseUrl}/ai-tools`,
    `${baseUrl}/blog`,
    `${baseUrl}/about`,
    `${baseUrl}/contact`,
    `${baseUrl}/search`,
    
    // Sitemaps
    `${baseUrl}/sitemap-index.xml`,
    `${baseUrl}/sitemap.xml`,
    `${baseUrl}/sitemap-tools.xml`,
    `${baseUrl}/sitemap-blog.xml`,
    `${baseUrl}/sitemap-articles.xml`,
    
    // High-priority tool pages
    `${baseUrl}/ai-tools/chatgpt`,
    `${baseUrl}/ai-tools/midjourney`,
    `${baseUrl}/ai-tools/claude-ai`,
    `${baseUrl}/ai-tools/dalle`,
    `${baseUrl}/ai-tools/github-copilot`,
    
    // High-priority blog posts
    `${baseUrl}/blog/ultimate-guide-ai-image-generators-2024`,
  ]

  return NextResponse.json({
    message: 'Important URLs for immediate indexing',
    urls: importantUrls,
    count: importantUrls.length,
    instructions: {
      googleSearchConsole: 'Submit these URLs manually in Google Search Console',
      bingWebmasterTools: 'Submit these URLs in Bing Webmaster Tools',
      googleIndexingAPI: 'Use POST endpoint with these URLs for automated submission'
    }
  })
}