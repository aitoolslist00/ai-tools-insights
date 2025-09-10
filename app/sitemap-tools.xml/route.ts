import { aiToolsData } from '@/lib/tools-data'

// Pure Static Generation for sitemap
export const dynamic = 'force-static'
export const revalidate = false

export async function GET() {
  const baseUrl = 'https://www.aitoolsinsights.com'
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${aiToolsData.map((tool) => `
  <url>
    <loc>${baseUrl}/ai-tools/${tool.id}</loc>
    <lastmod>${new Date(tool.lastUpdated).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${baseUrl}/screenshots/${tool.id}.jpg</image:loc>
      <image:title>${tool.name} - ${tool.category}</image:title>
      <image:caption>Screenshot of ${tool.name} interface showing key features</image:caption>
    </image:image>
  </url>`).join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}