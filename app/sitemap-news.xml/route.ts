import { NextResponse } from 'next/server'
import { blogPosts } from '@/lib/blog-data'

export const dynamic = 'force-static'
export const revalidate = 900 // Revalidate every 15 minutes for news freshness

export async function GET() {
  const baseUrl = 'https://www.aitoolsinsights.com'
  const now = new Date()
  const twoDaysAgo = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000))
  
  // Only include recent blog posts (within last 2 days) for news sitemap
  const recentPosts = blogPosts
    .filter(post => {
      if (!post.published || !post.date) return false
      const postDate = new Date(post.date)
      return postDate >= twoDaysAgo
    })
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
    .slice(0, 1000) // Google News limit

  if (recentPosts.length === 0) {
    // Return empty news sitemap if no recent posts
    const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
</urlset>`

    return new NextResponse(emptySitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=900, s-maxage=900',
      },
    })
  }

  const newsUrls = recentPosts.map(post => {
    const slug = post.slug || post.id
    const pubDate = new Date(post.date!).toISOString()
    
    return `  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <news:news>
      <news:publication>
        <news:name>AI Tools Insights</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${post.title}</news:title>
      <news:keywords>${post.tags.join(', ')}</news:keywords>
    </news:news>
    <lastmod>${pubDate}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>`
  }).join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsUrls}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=900, s-maxage=900',
    },
  })
}