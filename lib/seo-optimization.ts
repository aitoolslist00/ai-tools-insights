// SEO Optimization utilities for immediate indexing and ranking

export interface SEOMetadata {
  title: string
  description: string
  keywords: string[]
  canonicalUrl: string
  ogImage?: string
  structuredData?: any
}

export function generateOptimizedMetadata(
  type: 'homepage' | 'tool' | 'blog' | 'category',
  data: any
): SEOMetadata {
  const baseUrl = 'https://www.aitoolsinsights.com'
  
  switch (type) {
    case 'homepage':
      return {
        title: 'AI Tools Insights - Discover the Best AI Tools & Technologies 2024',
        description: 'Find and compare the best AI tools for your needs. Comprehensive reviews, ratings, and insights on ChatGPT, Midjourney, Claude, and 500+ AI tools.',
        keywords: [
          'AI tools', 'artificial intelligence', 'ChatGPT', 'Midjourney', 'AI software',
          'machine learning tools', 'AI directory', 'best AI tools 2024'
        ],
        canonicalUrl: baseUrl,
        ogImage: `${baseUrl}/images/og-homepage.jpg`,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'AI Tools Insights',
          url: baseUrl,
          description: 'Comprehensive directory of AI tools and technologies',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${baseUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        }
      }

    case 'tool':
      return {
        title: `${data.name} Review - Features, Pricing & Alternatives | AI Tools Insights`,
        description: `${data.description} Read our comprehensive ${data.name} review, compare features, pricing, and find the best alternatives.`,
        keywords: [
          data.name.toLowerCase(),
          `${data.name} review`,
          `${data.name} pricing`,
          `${data.name} alternatives`,
          data.category.toLowerCase(),
          'AI tool review'
        ],
        canonicalUrl: `${baseUrl}/ai-tools/${data.id}`,
        ogImage: `${baseUrl}/images/tools/${data.id}-og.jpg`,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: data.name,
          description: data.longDescription,
          applicationCategory: data.category,
          operatingSystem: 'Web Browser',
          offers: {
            '@type': 'Offer',
            url: data.pricingUrl,
            priceCurrency: 'USD'
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: data.rating,
            ratingCount: parseInt(data.users.replace(/[^\d]/g, '')) || 100
          }
        }
      }

    case 'blog':
      return {
        title: `${data.title} | AI Tools Insights Blog`,
        description: data.excerpt || data.description || `Read about ${data.title} on AI Tools Insights blog`,
        keywords: data.tags || ['AI tools', 'artificial intelligence', 'technology'],
        canonicalUrl: `${baseUrl}/blog/${data.id}`,
        ogImage: data.image || `${baseUrl}/images/blog-default-og.jpg`,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.title,
          description: data.excerpt || data.description,
          image: data.image,
          author: {
            '@type': 'Person',
            name: data.author || 'AI Tools Insights Editorial Team'
          },
          publisher: {
            '@type': 'Organization',
            name: 'AI Tools Insights',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/images/logo.png`
            }
          },
          datePublished: data.publishedAt || data.createdAt,
          dateModified: data.updatedAt || data.publishedAt || data.createdAt
        }
      }

    case 'category':
      return {
        title: `${data.category} AI Tools - Best ${data.category} Software 2024`,
        description: `Discover the best ${data.category.toLowerCase()} AI tools. Compare features, pricing, and reviews of top ${data.category.toLowerCase()} software.`,
        keywords: [
          `${data.category.toLowerCase()} AI tools`,
          `best ${data.category.toLowerCase()} software`,
          `${data.category.toLowerCase()} tools 2024`,
          'AI software comparison'
        ],
        canonicalUrl: `${baseUrl}/ai-tools?category=${data.category.toLowerCase().replace(/\s+/g, '-')}`,
        ogImage: `${baseUrl}/images/categories/${data.category.toLowerCase().replace(/\s+/g, '-')}-og.jpg`,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${data.category} AI Tools`,
          description: `Collection of the best ${data.category.toLowerCase()} AI tools`,
          url: `${baseUrl}/ai-tools?category=${data.category.toLowerCase().replace(/\s+/g, '-')}`
        }
      }

    default:
      return {
        title: 'AI Tools Insights',
        description: 'Discover the best AI tools and technologies',
        keywords: ['AI tools', 'artificial intelligence'],
        canonicalUrl: baseUrl
      }
  }
}

export function generateBreadcrumbStructuredData(breadcrumbs: Array<{name: string, url: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  }
}

export function generateFAQStructuredData(faqs: Array<{question: string, answer: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

// Priority URLs for immediate indexing
export const PRIORITY_URLS = [
  'https://www.aitoolsinsights.com',
  'https://www.aitoolsinsights.com/ai-tools',
  'https://www.aitoolsinsights.com/blog',
  'https://www.aitoolsinsights.com/ai-tools/chatgpt',
  'https://www.aitoolsinsights.com/ai-tools/midjourney',
  'https://www.aitoolsinsights.com/ai-tools/claude-ai',
  'https://www.aitoolsinsights.com/ai-tools/dalle',
  'https://www.aitoolsinsights.com/ai-tools/github-copilot'
]

// SEO optimization checklist
export const SEO_CHECKLIST = {
  technical: [
    'Robots.txt optimized for search engines',
    'Sitemap index with multiple specialized sitemaps',
    'Fast loading times (Core Web Vitals)',
    'Mobile-responsive design',
    'HTTPS enabled',
    'Structured data implemented'
  ],
  content: [
    'Unique, high-quality content',
    'Optimized title tags and meta descriptions',
    'Proper heading structure (H1, H2, H3)',
    'Internal linking strategy',
    'Regular content updates',
    'User-generated content (reviews, ratings)'
  ],
  indexing: [
    'Submit to Google Search Console',
    'Submit to Bing Webmaster Tools',
    'Ping search engines on updates',
    'Social media sharing for discovery',
    'Build high-quality backlinks',
    'Monitor indexing status regularly'
  ]
}