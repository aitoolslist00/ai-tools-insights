import { NextResponse } from 'next/server'
import { loadBlogPostsFromFile } from '@/lib/blog-file-manager'

export const dynamic = 'force-static'
export const revalidate = false

export async function GET() {
  const baseUrl = 'https://www.aitoolsinsights.com'
  const now = new Date().toISOString()
  
  try {
    // Get blog posts
    const blogPosts = await loadBlogPostsFromFile()
    const publishedPosts = blogPosts.filter(post => post.published)
      .sort((a, b) => new Date(b.publishedAt || b.date || new Date()).getTime() - new Date(a.publishedAt || a.date || new Date()).getTime())

    // Generate XML for blog posts with dynamic priorities
    const postsXml = publishedPosts.map((post, index) => {
      // Higher priority for newer posts and featured content
      const isRecent = new Date(post.publishedAt || post.date || new Date()) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days
      const isFeatured = post.featured || false
      const priority = isFeatured ? 0.9 : isRecent ? 0.8 : index < 10 ? 0.7 : 0.6
      
      return `
  <url>
    <loc>${baseUrl}/blog/${post.id}</loc>
    <lastmod>${new Date(post.updatedAt || post.publishedAt || post.date || new Date()).toISOString()}</lastmod>
    <changefreq>${isRecent ? 'weekly' : 'monthly'}</changefreq>
    <priority>${priority}</priority>
  </url>`
    }).join('')

    // Generate XML for blog categories with proper encoding
    const blogCategories = Array.from(new Set(publishedPosts.map(post => post.category).filter(Boolean)))
    const categoriesXml = blogCategories.map((category) => `
  <url>
    <loc>${baseUrl}/blog?category=${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')

    // Generate XML for blog tags with proper encoding
    const allTags = Array.from(new Set(publishedPosts.flatMap(post => post.tags || []).filter(Boolean)))
    const tagsXml = allTags.slice(0, 50).map((tag) => `
  <url>
    <loc>${baseUrl}/blog?tag=${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'))}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>`).join('')

    // Add popular blog sections
    const blogSections = [
      { path: 'guides', priority: 0.7 },
      { path: 'reviews', priority: 0.7 },
      { path: 'tutorials', priority: 0.6 },
      { path: 'news', priority: 0.6 },
    ]
    const sectionsXml = blogSections.map((section) => `
  <url>
    <loc>${baseUrl}/blog/${section.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${section.priority}</priority>
  </url>`).join('')

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>${postsXml}${categoriesXml}${tagsXml}${sectionsXml}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=3600',
        'X-Robots-Tag': 'noindex',
        'Vary': 'Accept-Encoding',
      },
    })
  } catch (error) {
    console.error('Error generating blog sitemap:', error)
    
    // Return minimal sitemap if there's an error
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`

    return new NextResponse(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=3600',
        'X-Robots-Tag': 'noindex',
        'Vary': 'Accept-Encoding',
      },
    })
  }
}