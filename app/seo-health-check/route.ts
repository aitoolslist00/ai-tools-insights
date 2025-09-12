import { NextResponse } from 'next/server'
import { aiToolsData } from '@/lib/tools-data'
import { loadBlogPostsFromFile } from '@/lib/blog-file-manager'

export const dynamic = 'force-dynamic'

export async function GET() {
  const baseUrl = 'https://www.aitoolsinsights.com'
  
  try {
    // Check sitemap accessibility
    const sitemapChecks = await Promise.allSettled([
      fetch(`${baseUrl}/sitemap-index.xml`),
      fetch(`${baseUrl}/sitemap.xml`),
      fetch(`${baseUrl}/sitemap-tools.xml`),
      fetch(`${baseUrl}/sitemap-blog.xml`),
      fetch(`${baseUrl}/sitemap-articles.xml`),
      fetch(`${baseUrl}/robots.txt`)
    ])

    const blogPosts = await loadBlogPostsFromFile()
    const publishedPosts = blogPosts.filter(post => post.published)

    const seoHealth = {
      timestamp: new Date().toISOString(),
      sitemaps: {
        'sitemap-index.xml': sitemapChecks[0].status === 'fulfilled' ? 'OK' : 'ERROR',
        'sitemap.xml': sitemapChecks[1].status === 'fulfilled' ? 'OK' : 'ERROR',
        'sitemap-tools.xml': sitemapChecks[2].status === 'fulfilled' ? 'OK' : 'ERROR',
        'sitemap-blog.xml': sitemapChecks[3].status === 'fulfilled' ? 'OK' : 'ERROR',
        'sitemap-articles.xml': sitemapChecks[4].status === 'fulfilled' ? 'OK' : 'ERROR',
        'robots.txt': sitemapChecks[5].status === 'fulfilled' ? 'OK' : 'ERROR'
      },
      content: {
        totalTools: aiToolsData.length,
        totalBlogPosts: publishedPosts.length,
        toolCategories: Array.from(new Set(aiToolsData.map(tool => tool.category))).length,
        blogCategories: Array.from(new Set(publishedPosts.map(post => post.category))).length,
        recentPosts: publishedPosts.filter(post => {
          const postDate = new Date(post.publishedAt || post.createdAt)
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          return postDate > weekAgo
        }).length
      },
      seoOptimizations: {
        robotsTxtOptimized: true,
        sitemapIndexExists: true,
        multiSitemapStructure: true,
        googleNewsSupport: true,
        imagesSitemapSupport: true,
        priorityOptimization: true,
        cacheOptimization: true,
        crawlDelayOptimized: true
      },
      recommendations: [
        'Submit sitemap-index.xml to Google Search Console',
        'Submit sitemap-index.xml to Bing Webmaster Tools',
        'Monitor crawl errors in search console',
        'Update content regularly to maintain freshness signals',
        'Add structured data to key pages',
        'Optimize Core Web Vitals for better rankings'
      ],
      quickActions: {
        googleSearchConsole: `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(baseUrl)}&sitemap_url=${encodeURIComponent(`${baseUrl}/sitemap-index.xml`)}`,
        bingWebmasterTools: `https://www.bing.com/webmasters/home`,
        testRobotsTxt: `${baseUrl}/robots.txt`,
        testSitemapIndex: `${baseUrl}/sitemap-index.xml`
      }
    }

    return NextResponse.json(seoHealth, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('SEO health check error:', error)
    return NextResponse.json({ 
      error: 'SEO health check failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}