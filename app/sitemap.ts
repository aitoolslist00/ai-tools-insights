import { MetadataRoute } from 'next'

// Pure Static Generation for main sitemap - optimized for immediate indexing
export const dynamic = 'force-static'
export const revalidate = false

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.aitoolsinsights.com'
  const now = new Date()
  
  // Static pages with optimized priorities for SEO ranking
  const staticPages = [
    // Homepage - Maximum priority
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    // Main category pages - High priority
    {
      url: `${baseUrl}/ai-tools`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    // Search functionality - Important for user experience
    {
      url: `${baseUrl}/search`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    // About page - Important for trust and authority
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    // Contact page - Important for business
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    // Legal pages - Required but lower priority
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    // Sitemap page for transparency
    {
      url: `${baseUrl}/sitemap`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.2,
    },
  ]

  return staticPages
}