import { loadBlogPostsFromFile } from '@/lib/blog-file-manager'

// Pure Static Generation for sitemap
export const dynamic = 'force-static' 
export const revalidate = false

export async function GET() {
  const baseUrl = 'https://www.aitoolsinsights.com'
  const blogPosts = await loadBlogPostsFromFile()
  const publishedPosts = blogPosts.filter(post => post.published)
  
  // Enhanced Article Sitemap with Structured Data
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:article="http://www.google.com/schemas/article/1.0">
  ${publishedPosts.map((post) => {
    const publishedDate = new Date(post.publishedAt || post.updatedAt || new Date())
    const updatedDate = new Date(post.updatedAt || post.publishedAt || new Date())
    const isRecent = (Date.now() - publishedDate.getTime()) < (7 * 24 * 60 * 60 * 1000) // 7 days
    const isFeatured = post.featured || false
    const priority = isFeatured ? '1.0' : isRecent ? '0.9' : '0.8'
    const changefreq = isRecent ? 'daily' : 'weekly'
    
    return `
  <url>
    <loc>${baseUrl}/blog/${post.id}</loc>
    <lastmod>${updatedDate.toISOString()}</lastmod>
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
    <article:article>
      <article:title>${post.title.replace(/^#+\s*/, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</article:title>
      <article:author>${post.author || 'AI Tools Insights'}</article:author>
      <article:publish_date>${publishedDate.toISOString()}</article:publish_date>
      <article:modification_date>${updatedDate.toISOString()}</article:modification_date>
      <article:section>${post.category || 'AI Tools'}</article:section>
      <article:keywords>${post.tags.join(', ')}</article:keywords>
      <article:stock_tickers>${post.tags.filter(tag => tag.match(/^[A-Z]{2,5}$/)).join(', ')}</article:stock_tickers>
    </article:article>
  </url>`
  }).join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=1800, s-maxage=3600',
    },
  })
}