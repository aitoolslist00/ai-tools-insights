import { NextResponse } from 'next/server'
import { aiToolsData } from '@/lib/tools-data'

export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  const baseUrl = 'https://www.aitoolsinsights.com'
  const now = new Date().toISOString()
  
  // Generate URLs for all AI tools
  const toolUrls = aiToolsData.map(tool => {
    const lastModified = tool.lastUpdated ? new Date(tool.lastUpdated).toISOString() : now
    
    return `  <url>
    <loc>${baseUrl}/ai-tools/${tool.id}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${baseUrl}/screenshots/${tool.id}.jpg</image:loc>
      <image:title>${tool.name} - AI Tool Screenshot</image:title>
      <image:caption>${tool.description}</image:caption>
    </image:image>
  </url>`
  }).join('\n')

  // Generate category pages
  const categorySet = new Set(aiToolsData.map(tool => tool.category))
  const categories = Array.from(categorySet)
  const categoryUrls = categories.map(category => {
    const slug = category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    return `  <url>
    <loc>${baseUrl}/ai-tools/category/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`
  }).join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${toolUrls}
${categoryUrls}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}