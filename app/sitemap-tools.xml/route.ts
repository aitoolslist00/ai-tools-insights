import { NextResponse } from 'next/server'
import { aiToolsData } from '@/lib/tools-data'

export const dynamic = 'force-static'
export const revalidate = false

export async function GET() {
  const baseUrl = 'https://www.aitoolsinsights.com'
  
  // Generate XML for AI tools
  const toolsXml = aiToolsData.map((tool) => `
  <url>
    <loc>${baseUrl}/ai-tools/${tool.id}</loc>
    <lastmod>${new Date(tool.lastUpdated).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')

  // Generate XML for categories
  const categories = Array.from(new Set(aiToolsData.map(tool => tool.category)))
  const categoriesXml = categories.map((category) => `
  <url>
    <loc>${baseUrl}/ai-tools?category=${category.toLowerCase().replace(/\s+/g, '-')}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/ai-tools</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>${toolsXml}${categoriesXml}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}