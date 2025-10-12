import { NextResponse } from 'next/server'
import { aiToolsData } from '@/lib/tools-data'
import { getPublishedBlogPosts } from '@/lib/blog-data'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  const baseUrl = 'https://www.aitoolsinsights.com'
  const tools = aiToolsData
  const posts = getPublishedBlogPosts()
  const now = new Date().toISOString()

  // Tool images
  const toolImages = tools.map(tool => `
  <url>
    <loc>${baseUrl}/screenshots/${tool.id}.jpg</loc>
    <lastmod>${tool.lastUpdated || now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <image:image>
      <image:loc>${baseUrl}/screenshots/${tool.id}.jpg</image:loc>
      <image:title>${tool.name} Screenshot</image:title>
      <image:caption>${tool.description}</image:caption>
    </image:image>
  </url>`).join('')

  // Blog images
  const blogImages = posts
    .filter(post => post.image)
    .map(post => `
  <url>
    <loc>${baseUrl}${post.image}</loc>
    <lastmod>${post.updatedAt || post.publishedAt || now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <image:image>
      <image:loc>${baseUrl}${post.image}</image:loc>
      <image:title>${post.title}</image:title>
      <image:caption>${post.excerpt}</image:caption>
    </image:image>
  </url>`).join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}/og-home.jpg</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${baseUrl}/og-home.jpg</image:loc>
      <image:title>AI Tools Insights - Homepage</image:title>
      <image:caption>Comprehensive directory of AI tools for business and productivity</image:caption>
    </image:image>
  </url>${toolImages}${blogImages}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}