import { NextResponse } from 'next/server'
import { aiToolsData } from '@/lib/tools-data'

export const dynamic = 'force-static'
export const revalidate = false

export async function GET() {
  const baseUrl = 'https://www.aitoolsinsights.com'
  const now = new Date().toISOString()
  
  // Generate XML for AI tools with optimized priorities
  const toolsXml = aiToolsData.map((tool) => {
    // Higher priority for popular tools (based on rating and users)
    const priority = tool.rating >= 4.5 ? 0.9 : tool.rating >= 4.0 ? 0.8 : 0.7
    
    return `
  <url>
    <loc>${baseUrl}/ai-tools/${tool.id}</loc>
    <lastmod>${new Date(tool.lastUpdated).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
  }).join('')

  // Generate XML for categories with SEO-friendly URLs
  const categories = Array.from(new Set(aiToolsData.map(tool => tool.category)))
  const categoriesXml = categories.map((category) => `
  <url>
    <loc>${baseUrl}/ai-tools?category=${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')

  // Generate XML for popular search terms and filters
  const popularFilters = [
    'free',
    'paid',
    'enterprise',
    'api-available',
    'no-signup-required'
  ]
  const filtersXml = popularFilters.map((filter) => `
  <url>
    <loc>${baseUrl}/ai-tools?filter=${filter}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`).join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}/ai-tools</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>${toolsXml}${categoriesXml}${filtersXml}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=3600',
      'X-Robots-Tag': 'noindex',
      'Vary': 'Accept-Encoding',
    },
  })
}