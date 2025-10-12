import { NextResponse } from 'next/server'
import { getPublishedBlogPosts } from '@/lib/blog-data'

export const dynamic = 'force-static'
export const revalidate = 1800 // 30 minutes for news

export async function GET() {
  const baseUrl = 'https://www.aitoolsinsights.com'
  const posts = getPublishedBlogPosts()
  const now = new Date()
  
  // Only include posts from the last 2 days for Google News
  const twoDaysAgo = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000))
  const recentPosts = posts.filter(post => {
    const publishDate = new Date(post.publishedAt || post.date || now)
    return publishDate >= twoDaysAgo
  })

  const newsXml = recentPosts.map(post => {
    const publishDate = new Date(post.publishedAt || post.date || now)
    return `
  <url>
    <loc>${baseUrl}/blog/${post.id}</loc>
    <news:news>
      <news:publication>
        <news:name>AI Tools Insights</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${publishDate.toISOString()}</news:publication_date>
      <news:title>${post.title}</news:title>
      <news:keywords>${post.tags?.join(', ') || 'AI tools, artificial intelligence, technology'}</news:keywords>
    </news:news>
    <lastmod>${post.updatedAt || post.publishedAt || now.toISOString()}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>`
  }).join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${newsXml}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800',
    },
  })
}