import { MetadataRoute } from 'next'

// Pure Static Generation for main sitemap - optimized for immediate indexing
export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.aitoolsinsights.com'
  const now = new Date()
  
  // Static pages with optimized priorities for SEO ranking
  const staticPages = [
    // Homepage - Maximum priority for fastest indexing
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'hourly' as const,
      priority: 1.0,
    },
    // Main category pages - High priority for discovery
    {
      url: `${baseUrl}/ai-tools`,
      lastModified: now,
      changeFrequency: 'hourly' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    // Search functionality - Critical for user experience
    {
      url: `${baseUrl}/search`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    // About page - Trust and authority signals
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    // Contact page - Business credibility
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    // Sitemap page for transparency and crawlability
    {
      url: `${baseUrl}/sitemap`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.5,
    },
    // Legal pages - Required for compliance
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
  ]

  return staticPages
}