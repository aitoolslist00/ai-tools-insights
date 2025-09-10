import { AITool } from './tools-data'
import { BlogPost } from './blog-data'

export interface SchemaMarkup {
  '@context': string
  '@type': string
  [key: string]: any
}

export class SchemaGenerator {
  private static baseUrl = 'https://www.aitoolslist.com'

  // Organization Schema for the entire site
  static generateOrganizationSchema(): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'AI Tools List',
      description: 'Comprehensive directory of AI tools including image generators, video tools, chatbots, coding assistants, and more.',
      url: this.baseUrl,
      logo: `${this.baseUrl}/logo.png`,
      sameAs: [
        'https://twitter.com/aitoolslist',
        'https://linkedin.com/company/aitoolslist',
        'https://facebook.com/aitoolslist'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-555-0123',
        contactType: 'customer service',
        availableLanguage: ['English']
      },
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'US'
      }
    }
  }

  // Website Schema
  static generateWebsiteSchema(): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'AI Tools List',
      description: 'Find the perfect AI tools for your business. Comprehensive directory featuring AI image generators, video tools, chatbots, and more.',
      url: this.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.baseUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      },
      publisher: {
        '@type': 'Organization',
        name: 'AI Tools List',
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/logo.png`
        }
      }
    }
  }

  // Breadcrumb Schema
  static generateBreadcrumbSchema(items: Array<{name: string, url: string}>): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    }
  }

  // Software Application Schema for AI Tools
  static generateSoftwareApplicationSchema(tool: AITool): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.name,
      description: tool.longDescription,
      url: tool.officialUrl,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        url: tool.pricingUrl,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: tool.rating,
        ratingCount: parseInt(tool.users.replace(/[^\d]/g, '')) || 100,
        bestRating: 5,
        worstRating: 1
      },
      review: {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: tool.rating,
          bestRating: 5
        },
        author: {
          '@type': 'Organization',
          name: 'AI Tools List'
        },
        reviewBody: `Complete ${tool.name} review covering features, pricing, pros and cons. ${tool.description}`
      },
      featureList: tool.features,
      screenshot: `${this.baseUrl}/screenshots/${tool.id}.jpg`,
      softwareVersion: '2024',
      datePublished: tool.lastUpdated,
      dateModified: tool.lastUpdated,
      publisher: {
        '@type': 'Organization',
        name: 'AI Tools List'
      }
    }
  }

  // Article Schema for Blog Posts
  static generateArticleSchema(post: BlogPost): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      image: post.image,
      author: {
        '@type': 'Person',
        name: post.author,
        url: `${this.baseUrl}/author/${post.author.toLowerCase().replace(/\s+/g, '-')}`
      },
      publisher: {
        '@type': 'Organization',
        name: 'AI Tools List',
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/logo.png`
        }
      },
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${this.baseUrl}${post.href}`
      },
      articleSection: post.category,
      keywords: post.tags.join(', '),
      wordCount: post.content.split(' ').length,
      timeRequired: post.readTime,
      inLanguage: 'en-US'
    }
  }

  // FAQ Schema
  static generateFAQSchema(faqs: Array<{question: string, answer: string}>): SchemaMarkup {
    if (!Array.isArray(faqs) || faqs.length === 0) {
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: []
      }
    }

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

  // How-to Schema for Tutorial Content
  static generateHowToSchema(title: string, steps: Array<{name: string, text: string}>): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: title,
      description: `Learn ${title.toLowerCase()} with this comprehensive guide`,
      image: `${this.baseUrl}/how-to-images/${title.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      totalTime: 'PT30M',
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: '0'
      },
      supply: [],
      tool: [],
      step: steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
        image: `${this.baseUrl}/step-images/step-${index + 1}.jpg`
      }))
    }
  }

  // Product Collection Schema for AI Tools Categories
  static generateCollectionPageSchema(category: string, tools: AITool[]): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Best ${category} - AI Tools List`,
      description: `Discover the best ${category.toLowerCase()} tools. Compare features, pricing, and reviews.`,
      url: `${this.baseUrl}/ai-tools?category=${category.toLowerCase().replace(/\s+/g, '-')}`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: tools.length,
        itemListElement: tools.map((tool, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'SoftwareApplication',
            name: tool.name,
            description: tool.description,
            url: `${this.baseUrl}/ai-tools/${tool.id}`,
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: tool.rating,
              ratingCount: parseInt(tool.users.replace(/[^\d]/g, '')) || 100
            }
          }
        }))
      }
    }
  }

  // Local Business Schema (if applicable)
  static generateLocalBusinessSchema(): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'AI Tools List',
      description: 'Professional AI tools directory and consulting services',
      url: this.baseUrl,
      telephone: '+1-555-0123',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Tech Street',
        addressLocality: 'San Francisco',
        addressRegion: 'CA',
        postalCode: '94105',
        addressCountry: 'US'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 37.7749,
        longitude: -122.4194
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00'
      },
      sameAs: [
        'https://twitter.com/aitoolslist',
        'https://linkedin.com/company/aitoolslist'
      ]
    }
  }

  // Video Schema for video content
  static generateVideoSchema(title: string, description: string, videoUrl: string, thumbnailUrl: string): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: title,
      description: description,
      thumbnailUrl: thumbnailUrl,
      uploadDate: new Date().toISOString(),
      duration: 'PT5M',
      contentUrl: videoUrl,
      embedUrl: videoUrl,
      publisher: {
        '@type': 'Organization',
        name: 'AI Tools List',
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/logo.png`
        }
      }
    }
  }

  // Generate combined schema for a page
  static generateCombinedSchema(schemas: SchemaMarkup[]): string {
    if (schemas.length === 1) {
      return JSON.stringify(schemas[0], null, 2)
    }
    
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': schemas
    }, null, 2)
  }
}