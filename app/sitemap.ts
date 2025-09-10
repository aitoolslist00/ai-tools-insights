import { MetadataRoute } from 'next'
import { aiToolsData } from '@/lib/tools-data'
import { loadBlogPostsFromFile } from '@/lib/blog-file-manager'

// Pure Static Generation for main sitemap
export const dynamic = 'force-static'
export const revalidate = false

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.aitoolsinsights.com'
  
  // Get blog posts
  const blogPosts = await loadBlogPostsFromFile()
  const publishedPosts = blogPosts.filter(post => post.published)

  // Static pages with high priority
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ai-tools`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // AI Tools pages
  const toolPages = aiToolsData.map((tool) => ({
    url: `${baseUrl}/ai-tools/${tool.id}`,
    lastModified: new Date(tool.lastUpdated),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Blog post pages
  const blogPages = publishedPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.updatedAt || post.publishedAt || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Category pages for AI Tools
  const categories = Array.from(new Set(aiToolsData.map(tool => tool.category)))
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/ai-tools?category=${category.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Blog category pages
  const blogCategories = Array.from(new Set(publishedPosts.map(post => post.category)))
  const blogCategoryPages = blogCategories.map((category) => ({
    url: `${baseUrl}/blog?category=${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  // Tag pages for blog
  const allTags = Array.from(new Set(publishedPosts.flatMap(post => post.tags)))
  const tagPages = allTags.map((tag) => ({
    url: `${baseUrl}/blog?tag=${tag.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.4,
  }))

  return [
    ...staticPages,
    ...toolPages,
    ...blogPages,
    ...categoryPages,
    ...blogCategoryPages,
    ...tagPages,
  ]
}