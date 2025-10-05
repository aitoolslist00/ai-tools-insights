import { NextResponse } from 'next/server'
import { blogPosts } from '@/lib/blog-data'

export const dynamic = 'force-static'
export const revalidate = 1800 // Revalidate every 30 minutes for fresh content

// Helper function to escape XML characters
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function GET() {
  const baseUrl = 'https://www.aitoolsinsights.com'
  const now = new Date().toISOString()
  
  // Generate URLs for all published blog posts
  const blogUrls = blogPosts
    .filter(post => post.published)
    .map(post => {
      const lastModified = post.date ? new Date(post.date).toISOString() : now
      const slug = post.slug || post.id
      
      // Include featured image if available
      const imageXml = post.image ? `
    <image:image>
      <image:loc>${baseUrl}${post.image}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
      <image:caption>${escapeXml(post.excerpt || '')}</image:caption>
    </image:image>` : ''
      
      return `  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>${imageXml}
  </url>`
    }).join('\n')

  // Generate category pages for blog
  const categorySet = new Set(blogPosts.filter(post => post.published && post.category).map(post => post.category))
  const categories = Array.from(categorySet)
  const categoryUrls = categories.map(category => {
    const slug = category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    return `  <url>
    <loc>${baseUrl}/blog/category/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>`
  }).join('\n')

  // Generate tag pages
  const tagSet = new Set(blogPosts.filter(post => post.published && post.tags).flatMap(post => post.tags))
  const allTags = Array.from(tagSet)
  const tagUrls = allTags.map(tag => {
    const slug = tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    return `  <url>
    <loc>${baseUrl}/blog/tag/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.4</priority>
  </url>`
  }).join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${blogUrls}
${categoryUrls}
${tagUrls}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800',
    },
  })
}