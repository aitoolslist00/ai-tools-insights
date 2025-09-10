import { loadBlogPostsFromFile } from '@/lib/blog-file-manager'

// Pure Static Generation for sitemap
export const dynamic = 'force-static'
export const revalidate = false

export async function GET() {
  const baseUrl = 'https://www.aitoolsinsights.com'
  const blogPosts = await loadBlogPostsFromFile()
  const publishedPosts = blogPosts.filter(post => post.published)
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${publishedPosts.map((post) => {
    const publishedDate = new Date(post.publishedAt || post.updatedAt || new Date())
    const isRecent = (Date.now() - publishedDate.getTime()) < (30 * 24 * 60 * 60 * 1000) // 30 days
    const isFeatured = post.featured || false
    const priority = isFeatured ? '0.9' : isRecent ? '0.8' : '0.7'
    const changefreq = isRecent ? 'weekly' : 'monthly'
    
    return `
  <url>
    <loc>${baseUrl}/blog/${post.id}</loc>
    <lastmod>${new Date(post.updatedAt || post.publishedAt || new Date()).toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    ${post.image ? `
    <image:image>
      <image:loc>${post.image.startsWith('http') ? post.image : baseUrl + post.image}</image:loc>
      <image:title>${post.title.replace(/^#+\s*/, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:title>
      <image:caption>${post.excerpt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:caption>
      <image:geo_location>United States</image:geo_location>
      <image:license>${baseUrl}/terms</image:license>
    </image:image>` : ''}
    ${(Date.now() - publishedDate.getTime()) < (48 * 60 * 60 * 1000) ? `
    <news:news>
      <news:publication>
        <news:name>AI Tools Insights</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${publishedDate.toISOString()}</news:publication_date>
      <news:title>${post.title.replace(/^#+\s*/, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</news:title>
      <news:keywords>${post.tags.join(', ')}</news:keywords>
      <news:stock_tickers>${post.tags.filter(tag => tag.match(/^[A-Z]{2,5}$/)).join(', ')}</news:stock_tickers>
    </news:news>` : ''}
  </url>`
  }).join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}