import { MetadataRoute } from 'next'

// Pure Static Generation for robots - optimized for immediate indexing
export const dynamic = 'force-static'
export const revalidate = false

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.aitoolsinsights.com'
  
  return {
    rules: [
      // Googlebot - Highest priority with MAXIMUM crawling permissions
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/_next/',
          '/temp/',
          '/blog/dashboard',
          '/test-*',
          '/*.json$',
        ],
        crawlDelay: 0, // ZERO delay - Maximum crawl speed for Google
      },
      // Google Image Bot - for AI tool images
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/_next/',
          '/temp/',
        ],
        crawlDelay: 0.1,
      },
      // Bingbot - Second priority
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/_next/',
          '/temp/',
          '/test-*',
        ],
        crawlDelay: 0.5,
      },
      // Other major search engines
      {
        userAgent: ['Slurp', 'DuckDuckBot', 'Baiduspider'],
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/_next/',
          '/temp/',
          '/test-*',
        ],
        crawlDelay: 1,
      },
      // All other crawlers - more restrictive
      {
        userAgent: '*',
        allow: [
          '/',
          '/ai-tools/',
          '/blog/',
          '/about',
          '/contact',
          '/search',
          '/privacy',
          '/terms',
          '/cookie-policy',
          '/privacy-policy',
          '/terms-of-service',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/test-*',
          '/_next/',
          '/uploads/',
          '/temp/',
          '/*.json$',
          '/*?*sort=*',
          '/*?*filter=*',
          '/*?utm_*',
          '/*?ref=*',
          '/*?source=*',
        ],
        crawlDelay: 2,
      },
      // Block aggressive/commercial crawlers to preserve server resources
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'MJ12bot',
          'DotBot',
          'BLEXBot',
          'DataForSeoBot',
          'PetalBot',
          'YandexBot',
          'SeznamBot',
          'facebookexternalhit',
          'Twitterbot',
          'LinkedInBot',
          'WhatsApp',
          'SkypeUriPreview',
          'Applebot',
        ],
        disallow: '/',
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap-index.xml`,
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-tools.xml`,
      `${baseUrl}/sitemap-blog.xml`,
      `${baseUrl}/sitemap-articles.xml`,
      `${baseUrl}/sitemap-images.xml`,
    ],
    host: baseUrl,
  }
}