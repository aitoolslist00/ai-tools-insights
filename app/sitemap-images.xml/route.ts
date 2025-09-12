import { NextResponse } from 'next/server'
import { aiToolsData } from '@/lib/tools-data'
import { loadBlogPostsFromFile } from '@/lib/blog-file-manager'

export const dynamic = 'force-static'
export const revalidate = false

export async function GET() {
  const baseUrl = 'https://www.aitoolsinsights.com'
  const now = new Date().toISOString()
  
  try {
    const blogPosts = await loadBlogPostsFromFile()
    const publishedPosts = blogPosts.filter(post => post.published)

    // Generate image sitemap for AI tools
    const toolImagesXml = aiToolsData.map((tool) => {
      const toolImageUrl = `${baseUrl}/images/tools/${tool.id}.jpg`
      const logoUrl = `${baseUrl}/images/logos/${tool.id}.png`
      
      return `
  <url>
    <loc>${baseUrl}/ai-tools/${tool.id}</loc>
    <image:image>
      <image:loc>${toolImageUrl}</image:loc>
      <image:title>${tool.name} - AI Tool Screenshot</image:title>
      <image:caption>${tool.description}</image:caption>
      <image:geo_location>United States</image:geo_location>
      <image:license>${baseUrl}/terms</image:license>
    </image:image>
    <image:image>
      <image:loc>${logoUrl}</image:loc>
      <image:title>${tool.name} Logo</image:title>
      <image:caption>Official ${tool.name} logo and branding</image:caption>
      <image:geo_location>United States</image:geo_location>
      <image:license>${baseUrl}/terms</image:license>
    </image:image>
    <lastmod>${new Date(tool.lastUpdated).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    }).join('')

    // Generate image sitemap for blog posts
    const blogImagesXml = publishedPosts
      .filter(post => post.image)
      .map((post) => {
        const imageUrl = post.image.startsWith('http') ? post.image : `${baseUrl}${post.image}`
        const escapeXml = (text) => text?.toString()
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;') || ''
        
        return `
  <url>
    <loc>${baseUrl}/blog/${post.id}</loc>
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
      <image:caption>${escapeXml(post.excerpt || post.description)}</image:caption>
      <image:geo_location>United States</image:geo_location>
      <image:license>${baseUrl}/terms</image:license>
    </image:image>
    <lastmod>${new Date(post.updatedAt || post.publishedAt || post.createdAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
      }).join('')

    // Add category and homepage images
    const staticImagesXml = `
  <url>
    <loc>${baseUrl}</loc>
    <image:image>
      <image:loc>${baseUrl}/images/hero-banner.jpg</image:loc>
      <image:title>AI Tools Insights - Discover the Best AI Tools</image:title>
      <image:caption>Comprehensive directory of AI tools and technologies for professionals and enthusiasts</image:caption>
      <image:geo_location>United States</image:geo_location>
      <image:license>${baseUrl}/terms</image:license>
    </image:image>
    <image:image>
      <image:loc>${baseUrl}/images/ai-tools-collage.jpg</image:loc>
      <image:title>AI Tools Collection Overview</image:title>
      <image:caption>Visual overview of popular AI tools and platforms available today</image:caption>
      <image:geo_location>United States</image:geo_location>
      <image:license>${baseUrl}/terms</image:license>
    </image:image>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/ai-tools</loc>
    <image:image>
      <image:loc>${baseUrl}/images/ai-tools-directory.jpg</image:loc>
      <image:title>AI Tools Directory</image:title>
      <image:caption>Browse and discover AI tools by category and functionality</image:caption>
      <image:geo_location>United States</image:geo_location>
      <image:license>${baseUrl}/terms</image:license>
    </image:image>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${staticImagesXml}${toolImagesXml}${blogImagesXml}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200',
        'X-Robots-Tag': 'noindex',
        'Vary': 'Accept-Encoding',
      },
    })
  } catch (error) {
    console.error('Error generating images sitemap:', error)
    
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}</loc>
    <image:image>
      <image:loc>${baseUrl}/images/hero-banner.jpg</image:loc>
      <image:title>AI Tools Insights - Discover the Best AI Tools</image:title>
      <image:caption>Comprehensive directory of AI tools and technologies</image:caption>
      <image:geo_location>United States</image:geo_location>
      <image:license>${baseUrl}/terms</image:license>
    </image:image>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

    return new NextResponse(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'X-Robots-Tag': 'noindex',
        'Vary': 'Accept-Encoding',
      },
    })
  }
}