import { NextResponse } from 'next/server'
import { loadBlogPostsFromFile } from '@/lib/blog-file-manager'

export const dynamic = 'force-static'
export const revalidate = false

export async function GET() {
  const baseUrl = 'https://www.aitoolsinsights.com'
  
  try {
    // Get blog posts
    const blogPosts = await loadBlogPostsFromFile()
    const publishedPosts = blogPosts.filter(post => post.published)

    // Generate XML for blog posts
    const postsXml = publishedPosts.map((post) => `
  <url>
    <loc>${baseUrl}/blog/${post.id}</loc>
    <lastmod>${new Date(post.updatedAt || post.publishedAt || new Date()).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')

    // Generate XML for blog categories
    const blogCategories = Array.from(new Set(publishedPosts.map(post => post.category)))
    const categoriesXml = blogCategories.map((category) => `
  <url>
    <loc>${baseUrl}/blog?category=${category}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`).join('')

    // Generate XML for blog tags
    const allTags = Array.from(new Set(publishedPosts.flatMap(post => post.tags)))
    const tagsXml = allTags.map((tag) => `
  <url>
    <loc>${baseUrl}/blog?tag=${tag.toLowerCase().replace(/\s+/g, '-')}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>`).join('')

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>${postsXml}${categoriesXml}${tagsXml}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Error generating blog sitemap:', error)
    
    // Return minimal sitemap if there's an error
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`

    return new NextResponse(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  }
}