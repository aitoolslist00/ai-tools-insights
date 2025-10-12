import { MetadataRoute } from 'next'

// Pure Static Generation for robots - optimized for immediate indexing
export const dynamic = 'force-static'
export const revalidate = false

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.aitoolsinsights.com'
  
  return {
    rules: [
      // Googlebot - MAXIMUM crawling permissions for fastest indexing
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/auth/',
          '/api/admin/',
          '/admin/',
          '/dashboard/',
          '/_next/static/chunks/',
          '/temp/',
          '/test-*',
          '/*.json$',
          '/blog/dashboard',
          '/uploads/temp/',
        ],
        // NO crawlDelay for Google - Maximum speed
      },
      
      // Google Image Bot - Critical for AI tool screenshots and blog images
      {
        userAgent: 'Googlebot-Image',
        allow: [
          '/',
          '/screenshots/',
          '/uploads/',
          '/generated-images/',
          '/public/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/_next/static/chunks/',
          '/temp/',
          '/uploads/temp/',
        ],
      },
      
      // Google News Bot - For blog content
      {
        userAgent: 'Googlebot-News',
        allow: [
          '/',
          '/blog/',
          '/ai-tools/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/_next/',
          '/temp/',
        ],
      },
      
      // Bingbot - Second priority search engine
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/auth/',
          '/api/admin/',
          '/admin/',
          '/dashboard/',
          '/_next/static/chunks/',
          '/temp/',
          '/test-*',
          '/uploads/temp/',
        ],
        crawlDelay: 0.5,
      },
      
      // Other major search engines - Allow full access
      {
        userAgent: ['Slurp', 'DuckDuckBot', 'Baiduspider', 'YandexBot'],
        allow: '/',
        disallow: [
          '/api/auth/',
          '/api/admin/',
          '/admin/',
          '/dashboard/',
          '/_next/static/chunks/',
          '/temp/',
          '/test-*',
          '/uploads/temp/',
        ],
        crawlDelay: 1,
      },
      
      // Social Media Crawlers - Allow for rich previews
      {
        userAgent: [
          'facebookexternalhit',
          'Twitterbot',
          'LinkedInBot',
          'WhatsApp',
          'SkypeUriPreview',
          'TelegramBot',
          'Applebot',
          'Slackbot',
          'DiscordBot',
        ],
        allow: [
          '/',
          '/ai-tools/',
          '/blog/',
          '/screenshots/',
          '/uploads/',
          '/generated-images/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/temp/',
        ],
      },
      
      // All other crawlers - Selective access
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
          '/sitemap',
          '/screenshots/',
          '/uploads/',
          '/generated-images/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/test-*',
          '/_next/',
          '/uploads/temp/',
          '/temp/',
          '/*.json$',
          '/*?*sort=*',
          '/*?*filter=*',
          '/*?utm_*',
          '/*?ref=*',
          '/*?source=*',
          '/*?fbclid=*',
          '/*?gclid=*',
          '/*?_ga=*',
          '/*?sessionid=*',
        ],
        crawlDelay: 2,
      },
      
      // Block AI training crawlers and resource-intensive bots
      {
        userAgent: [
          'MJ12bot',
          'DotBot',
          'BLEXBot',
          'PetalBot',
          'SeznamBot',
          'CCBot',
          'GPTBot',
          'ChatGPT-User',
          'anthropic-ai',
          'Claude-Web',
          'OpenAI-SearchBot',
          'PerplexityBot',
          'YouBot',
          'Meta-ExternalAgent',
          'Meta-ExternalFetcher',
          'FacebookBot',
          'Bytespider',
          'ImagesiftBot',
        ],
        disallow: '/',
      },
      
      // Allow DataForSeoBot with restrictions for SEO monitoring
      {
        userAgent: 'DataForSeoBot',
        allow: [
          '/',
          '/ai-tools/',
          '/blog/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/uploads/',
          '/screenshots/',
        ],
        crawlDelay: 5,
      },
      
      // Allow important SEO crawlers with restrictions
      {
        userAgent: ['AhrefsBot', 'SemrushBot'],
        allow: [
          '/',
          '/ai-tools/',
          '/blog/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/uploads/',
          '/screenshots/',
        ],
        crawlDelay: 10, // Slow them down to preserve resources
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap-index.xml`,
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-tools.xml`,
      `${baseUrl}/sitemap-blog.xml`,
      `${baseUrl}/sitemap-images.xml`,
      `${baseUrl}/sitemap-news.xml`,
    ],
    host: baseUrl,
  }
}