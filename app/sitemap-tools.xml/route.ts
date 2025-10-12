import { NextResponse } from 'next/server'
import { aiToolsData } from '@/lib/tools-data'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  const baseUrl = 'https://www.aitoolsinsights.com'
  const tools = aiToolsData
  const now = new Date().toISOString()

  const toolsXml = tools.map(tool => `
  <url>
    <loc>${baseUrl}/ai-tools/${tool.id}</loc>
    <lastmod>${tool.lastUpdated || now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${baseUrl}/screenshots/${tool.id}.jpg</image:loc>
      <image:title>${tool.name} - AI Tool Screenshot</image:title>
      <image:caption>${tool.description}</image:caption>
    </image:image>
  </url>`).join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}/ai-tools</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/ai-tools/categories</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>${toolsXml}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}