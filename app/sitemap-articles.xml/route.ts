import { NextResponse } from 'next/server'
import { loadBlogPostsFromFile } from '@/lib/blog-file-manager'

// Pure Static Generation for sitemap - optimized for Google News and Articles
export const dynamic = 'force-static' 
export const revalidate = false

export async function GET() {
  const baseUrl = 'https://www.aitoolsinsights.com'
  const now = new Date().toISOString()
  
  try {
    const blogPosts = await loadBlogPostsFromFile()
    const publishedPosts = blogPosts
      .filter(post => post.published)
      .sort((a, b) => new Date(b.publishedAt || b.date || new Date()).getTime() - new Date(a.publishedAt || a.date || new Date()).getTime())
    
    // Enhanced Article Sitemap with Structured Data and News Support
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${publishedPosts.map((post) => {
    const publishedDate = new Date(post.publishedAt || post.date || new Date())
    const updatedDate = new Date(post.updatedAt || post.publishedAt || post.date || new Date())
    const isRecent = (Date.now() - publishedDate.getTime()) < (7 * 24 * 60 * 60 * 1000) // 7 days
    const isNews = (Date.now() - publishedDate.getTime()) < (2 * 24 * 60 * 60 * 1000) // 2 days for news
    const isFeatured = post.featured || false
    const priority = isFeatured ? '1.0' : isRecent ? '0.9' : '0.8'
    const changefreq = isRecent ? 'hourly' : 'daily'
    
    // Safe text escaping function
    const escapeXml = (text: any) => {
      if (!text) return ''
      return text.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
    }
    
    const title = escapeXml(post.title?.replace(/^#+\s*/, '') || 'AI Tools Article')
    const excerpt = escapeXml(post.excerpt || 'AI Tools and Technology Insights')
    const author = escapeXml(post.author || 'AI Tools Insights Editorial Team')
    const category = escapeXml(post.category || 'AI Tools')
    const keywords = escapeXml((post.tags || []).join(', '))
    
    return `
  <url>
    <loc>${baseUrl}/blog/${post.id}</loc>
    <lastmod>${updatedDate.toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    ${post.image ? `
    <image:image>
      <image:loc>${post.image.startsWith('http') ? post.image : baseUrl + post.image}</image:loc>
      <image:title>${title}</image:title>
      <image:caption>${excerpt}</image:caption>
      <image:geo_location>United States</image:geo_location>
      <image:license>${baseUrl}/terms</image:license>
    </image:image>` : ''}
    ${isNews ? `
    <news:news>
      <news:publication>
        <news:name>AI Tools Insights</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${publishedDate.toISOString()}</news:publication_date>
      <news:title><![CDATA[${title}]]></news:title>
      <news:keywords><![CDATA[${keywords}]]></news:keywords>
      <news:stock_tickers><![CDATA[${(post.tags || []).filter(tag => tag.match(/^[A-Z]{2,5}$/)).join(', ')}]]></news:stock_tickers>
    </news:news>` : ''}
  </url>`
  }).join('')}
  
  <!-- Static high-value articles -->
  <url>
    <loc>${baseUrl}/blog/ultimate-guide-ai-image-generators-2024</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${baseUrl}/images/ai-image-generators-guide.jpg</image:loc>
      <image:title>Ultimate Guide to AI Image Generators 2024</image:title>
      <image:caption>Comprehensive guide covering the best AI image generation tools available in 2024</image:caption>
      <image:geo_location>United States</image:geo_location>
      <image:license>${baseUrl}/terms</image:license>
    </image:image>
  </url>
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=900, s-maxage=900, stale-while-revalidate=1800',
        'X-Robots-Tag': 'noindex',
        'Vary': 'Accept-Encoding',
      },
    })
  } catch (error) {
    console.error('Error generating articles sitemap:', error)
    
    // Fallback sitemap
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}/blog/ultimate-guide-ai-image-generators-2024</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${baseUrl}/images/ai-image-generators-guide.jpg</image:loc>
      <image:title>Ultimate Guide to AI Image Generators 2024</image:title>
      <image:caption>Comprehensive guide covering the best AI image generation tools available in 2024</image:caption>
      <image:geo_location>United States</image:geo_location>
      <image:license>${baseUrl}/terms</image:license>
    </image:image>
  </url>
</urlset>`

    return new NextResponse(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=900, s-maxage=900, stale-while-revalidate=1800',
        'X-Robots-Tag': 'noindex',
        'Vary': 'Accept-Encoding',
      },
    })
  }
}