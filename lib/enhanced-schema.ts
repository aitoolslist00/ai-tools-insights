/**
 * Enhanced Schema.org markup optimized for RankBrain understanding
 * Maximum semantic signals for AI content comprehension
 */

export interface EnhancedSchemaConfig {
  type: 'homepage' | 'tool' | 'blog' | 'category'
  title: string
  description: string
  url: string
  image?: string
  author?: string
  datePublished?: string
  dateModified?: string
  tools?: any[]
  category?: string
  rating?: number
  reviewCount?: number
  price?: string
  features?: string[]
}

export class EnhancedSchemaGenerator {
  static generateComprehensiveSchema(config: EnhancedSchemaConfig): string {
    const baseUrl = 'https://www.aitoolsinsights.com'
    const schemas: any[] = []

    // 1. Organization Schema - Maximum authority signals
    schemas.push({
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'AI Tools Insights',
      alternateName: ['AI Tools List', 'AI Tools Directory'],
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 512,
        height: 512
      },
      sameAs: [
        'https://twitter.com/aitoolslist',
        'https://linkedin.com/company/aitoolsinsights',
        'https://github.com/aitoolsinsights'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-555-AI-TOOLS',
        contactType: 'customer service',
        availableLanguage: ['English'],
        areaServed: ['US', 'CA', 'GB', 'AU', 'EU']
      },
      foundingDate: '2024',
      description: 'Comprehensive directory and reviews of AI tools for business and productivity',
      knowsAbout: [
        'Artificial Intelligence',
        'Machine Learning',
        'AI Tools',
        'Business Automation',
        'Productivity Software',
        'AI Image Generation',
        'AI Video Tools',
        'AI Writing Assistants',
        'AI Coding Tools',
        'AI Chatbots'
      ]
    })

    // 2. Website Schema - Enhanced for RankBrain
    schemas.push({
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: 'AI Tools Insights',
      description: config.description,
      publisher: { '@id': `${baseUrl}/#organization` },
      inLanguage: 'en-US',
      potentialAction: [
        {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      ],
      about: [
        {
          '@type': 'Thing',
          name: 'Artificial Intelligence Tools',
          sameAs: 'https://en.wikipedia.org/wiki/Artificial_intelligence'
        },
        {
          '@type': 'Thing', 
          name: 'Business Software',
          sameAs: 'https://en.wikipedia.org/wiki/Business_software'
        }
      ]
    })

    // 3. Breadcrumb Schema - Enhanced navigation signals
    if (config.type !== 'homepage') {
      const breadcrumbItems = [
        { name: 'Home', url: baseUrl },
        { name: 'AI Tools', url: `${baseUrl}/ai-tools` }
      ]

      if (config.category) {
        breadcrumbItems.push({
          name: config.category,
          url: `${baseUrl}/ai-tools/${config.category}`
        })
      }

      schemas.push({
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      })
    }

    // 4. Type-specific schemas
    switch (config.type) {
      case 'homepage':
        schemas.push(this.generateHomepageSchema(config, baseUrl))
        break
      case 'tool':
        schemas.push(this.generateToolSchema(config, baseUrl))
        break
      case 'blog':
        schemas.push(this.generateBlogSchema(config, baseUrl))
        break
      case 'category':
        schemas.push(this.generateCategorySchema(config, baseUrl))
        break
    }

    // 5. FAQ Schema for all pages (RankBrain loves Q&A content)
    schemas.push(this.generateFAQSchema(config.type))

    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': schemas
    }, null, 2)
  }

  private static generateHomepageSchema(config: EnhancedSchemaConfig, baseUrl: string) {
    return {
      '@type': 'WebPage',
      '@id': `${baseUrl}/#webpage`,
      url: baseUrl,
      name: config.title,
      description: config.description,
      isPartOf: { '@id': `${baseUrl}/#website` },
      about: { '@id': `${baseUrl}/#organization` },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: config.image || `${baseUrl}/og-home.jpg`,
        width: 1200,
        height: 630
      },
      datePublished: '2024-01-01',
      dateModified: new Date().toISOString(),
      mainEntity: {
        '@type': 'ItemList',
        name: 'AI Tools Directory',
        description: 'Comprehensive list of AI tools for business and productivity',
        numberOfItems: 500,
        itemListElement: Array.from({ length: 10 }, (_, i) => ({
          '@type': 'SoftwareApplication',
          position: i + 1,
          name: `AI Tool ${i + 1}`,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web Browser'
        }))
      },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', '.hero-description', '.featured-tools']
      }
    }
  }

  private static generateToolSchema(config: EnhancedSchemaConfig, baseUrl: string) {
    return {
      '@type': 'SoftwareApplication',
      '@id': `${config.url}/#software`,
      name: config.title,
      description: config.description,
      url: config.url,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: config.price || '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      aggregateRating: config.rating ? {
        '@type': 'AggregateRating',
        ratingValue: config.rating,
        reviewCount: config.reviewCount || 1,
        bestRating: 5,
        worstRating: 1
      } : undefined,
      featureList: config.features || [],
      screenshot: config.image,
      author: { '@id': `${baseUrl}/#organization` },
      publisher: { '@id': `${baseUrl}/#organization` }
    }
  }

  private static generateBlogSchema(config: EnhancedSchemaConfig, baseUrl: string) {
    return {
      '@type': 'Article',
      '@id': `${config.url}/#article`,
      headline: config.title,
      description: config.description,
      url: config.url,
      datePublished: config.datePublished || new Date().toISOString(),
      dateModified: config.dateModified || new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: config.author || 'AI Tools Insights Team',
        url: `${baseUrl}/about`
      },
      publisher: { '@id': `${baseUrl}/#organization` },
      mainEntityOfPage: config.url,
      image: {
        '@type': 'ImageObject',
        url: config.image || `${baseUrl}/og-home.jpg`,
        width: 1200,
        height: 630
      },
      articleSection: 'AI Tools',
      keywords: [
        'AI tools',
        'artificial intelligence',
        'business automation',
        'productivity tools'
      ]
    }
  }

  private static generateCategorySchema(config: EnhancedSchemaConfig, baseUrl: string) {
    return {
      '@type': 'CollectionPage',
      '@id': `${config.url}/#collection`,
      name: config.title,
      description: config.description,
      url: config.url,
      mainEntity: {
        '@type': 'ItemList',
        name: `${config.category} AI Tools`,
        description: `Best ${config.category} AI tools for business and productivity`,
        numberOfItems: config.tools?.length || 50,
        itemListElement: (config.tools || []).slice(0, 10).map((tool, index) => ({
          '@type': 'SoftwareApplication',
          position: index + 1,
          name: tool.name,
          description: tool.description,
          url: `${baseUrl}/ai-tools/${tool.slug}`
        }))
      }
    }
  }

  private static generateFAQSchema(pageType: string) {
    const faqMap: Record<string, Array<{question: string, answer: string}>> = {
      homepage: [
        {
          question: 'What are the best AI tools for business in 2025?',
          answer: 'The best AI tools for business include ChatGPT for content creation, Midjourney for image generation, GitHub Copilot for coding, and Jasper for marketing copy. Our directory features over 500 AI tools across all categories.'
        },
        {
          question: 'Are there free AI tools available?',
          answer: 'Yes, many AI tools offer free tiers including ChatGPT, DALL-E, Stable Diffusion, and Google Bard. Our directory clearly marks which tools have free options available.'
        },
        {
          question: 'How do I choose the right AI tool for my business?',
          answer: 'Consider your specific use case, budget, team size, and integration requirements. Our detailed reviews and comparison features help you make informed decisions based on your needs.'
        }
      ],
      tool: [
        {
          question: 'How much does this AI tool cost?',
          answer: 'Pricing varies by plan and usage. Check our detailed pricing breakdown and compare with alternatives to find the best value for your needs.'
        },
        {
          question: 'Is there a free trial available?',
          answer: 'Most AI tools offer free trials or freemium plans. Check the pricing section for current trial offers and free tier limitations.'
        }
      ],
      blog: [
        {
          question: 'How often is this content updated?',
          answer: 'Our blog content is regularly updated to reflect the latest AI tool developments, new features, and industry trends.'
        }
      ],
      category: [
        {
          question: 'What are the top AI tools in this category?',
          answer: 'Our curated list features the most popular and effective AI tools in this category, ranked by user reviews, features, and value for money.'
        }
      ]
    }

    const faqs = faqMap[pageType] || faqMap.homepage

    return {
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
}

export default EnhancedSchemaGenerator