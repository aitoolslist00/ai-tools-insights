import { NextResponse } from 'next/server'
import { aiToolsData } from '@/lib/tools-data'
import { blogPosts } from '@/lib/blog-data'

export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

// Helper function to escape XML characters
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function GET() {
  const baseUrl = 'https://www.aitoolsinsights.com'
  const now = new Date().toISOString()
  
  // Generate image entries for AI tool screenshots
  const toolImageUrls = aiToolsData.map(tool => {
    return `  <url>
    <loc>${baseUrl}/ai-tools/${tool.id}</loc>
    <lastmod>${now}</lastmod>
    <image:image>
      <image:loc>${baseUrl}/screenshots/${tool.id}.jpg</image:loc>
      <image:title>${escapeXml(tool.name)} - AI Tool Interface</image:title>
      <image:caption>${escapeXml(tool.description)}</image:caption>
      <image:geo_location>United States</image:geo_location>
      <image:license>${baseUrl}/terms</image:license>
    </image:image>
  </url>`
  }).join('\n')

  // Generate image entries for blog post images
  const blogImageUrls = blogPosts
    .filter(post => post.published && post.image)
    .map(post => {
      const slug = post.slug || post.id
      return `  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${post.date ? new Date(post.date).toISOString() : now}</lastmod>
    <image:image>
      <image:loc>${baseUrl}${post.image}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
      <image:caption>${escapeXml(post.excerpt || '')}</image:caption>
      <image:geo_location>United States</image:geo_location>
      <image:license>${baseUrl}/terms</image:license>
    </image:image>
  </url>`
    }).join('\n')

  // Generate entries for generated images
  const generatedImageUrls = `  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <image:image>
      <image:loc>${baseUrl}/hero-bg.webp</image:loc>
      <image:title>AI Tools Directory - Hero Background</image:title>
      <image:caption>Comprehensive directory of AI tools for businesses and developers</image:caption>
      <image:geo_location>United States</image:geo_location>
      <image:license>${baseUrl}/terms</image:license>
    </image:image>
  </url>
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <image:image>
      <image:loc>${baseUrl}/og-home.jpg</image:loc>
      <image:title>AI Tools Insights - Social Media Preview</image:title>
      <image:caption>Discover the best AI tools for your business needs</image:caption>
      <image:geo_location>United States</image:geo_location>
      <image:license>${baseUrl}/terms</image:license>
    </image:image>
  </url>`

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${toolImageUrls}
${blogImageUrls}
${generatedImageUrls}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}