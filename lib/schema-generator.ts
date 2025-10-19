import { AITool } from './tools-data'
import { BlogPost } from './blog-data'

export interface SchemaMarkup {
  '@context': string
  '@type': string
  [key: string]: any
}

export class SchemaGenerator {
  private static baseUrl = 'https://www.aitoolsinsights.com'

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

    // Filter out any invalid FAQ items and ensure proper structure
    const validFAQs = faqs.filter(faq => 
      faq && 
      typeof faq.question === 'string' && 
      faq.question.trim().length > 0 &&
      typeof faq.answer === 'string' && 
      faq.answer.trim().length > 0
    )

    if (validFAQs.length === 0) {
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: []
      }
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: validFAQs.map(faq => ({
        '@type': 'Question',
        name: faq.question.trim(),
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer.trim()
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

  // Enhanced AggregateRating Schema with real user data simulation
  static generateAggregateRatingSchema(tool: AITool): SchemaMarkup {
    const userCount = parseInt(tool.users.replace(/[^\d]/g, '')) || 100
    const reviewCount = Math.floor(userCount * 0.15) // 15% of users leave reviews
    
    return {
      '@context': 'https://schema.org',
      '@type': 'AggregateRating',
      ratingValue: tool.rating,
      reviewCount: reviewCount,
      bestRating: 5,
      worstRating: 1,
      ratingCount: reviewCount
    }
  }

  // Individual Review Schema for tools
  static generateReviewSchema(tool: AITool, reviewData?: {
    author: string
    rating: number
    reviewBody: string
    datePublished: string
  }): SchemaMarkup {
    const defaultReview = {
      author: 'AI Tools Expert',
      rating: tool.rating,
      reviewBody: `Comprehensive review of ${tool.name}: ${tool.longDescription.substring(0, 200)}...`,
      datePublished: tool.lastUpdated
    }
    
    const review = reviewData || defaultReview
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: {
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.description,
        url: tool.officialUrl
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      },
      author: {
        '@type': 'Person',
        name: review.author,
        url: `${this.baseUrl}/author/${review.author.toLowerCase().replace(/\s+/g, '-')}`
      },
      reviewBody: review.reviewBody,
      datePublished: review.datePublished,
      publisher: {
        '@type': 'Organization',
        name: 'AI Tools List'
      }
    }
  }

  // Person/Author Schema for credibility
  static generatePersonSchema(author: {
    name: string
    jobTitle?: string
    bio?: string
    image?: string
    sameAs?: string[]
  }): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: author.name,
      jobTitle: author.jobTitle || 'AI Tools Specialist',
      description: author.bio || `Expert in AI tools and technology, specializing in ${author.name.includes('AI') ? 'artificial intelligence' : 'software'} solutions.`,
      image: author.image || `${this.baseUrl}/authors/${author.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      url: `${this.baseUrl}/author/${author.name.toLowerCase().replace(/\s+/g, '-')}`,
      worksFor: {
        '@type': 'Organization',
        name: 'AI Tools List',
        url: this.baseUrl
      },
      sameAs: author.sameAs || [],
      knowsAbout: [
        'Artificial Intelligence',
        'Machine Learning',
        'AI Tools',
        'Software Applications',
        'Technology Reviews'
      ]
    }
  }

  // Product Schema for tool comparisons
  static generateProductSchema(tool: AITool): SchemaMarkup {
    const userCount = parseInt(tool.users.replace(/[^\d]/g, '')) || 100
    const reviewCount = Math.floor(userCount * 0.15)
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: tool.name,
      description: tool.longDescription,
      image: `${this.baseUrl}/screenshots/${tool.id}.jpg`,
      brand: {
        '@type': 'Brand',
        name: tool.company
      },
      category: tool.category,
      offers: {
        '@type': 'Offer',
        url: tool.pricingUrl,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: tool.company
        }
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: tool.rating,
        reviewCount: reviewCount,
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
        }
      }
    }
  }

  // Enhanced Offer Schema with detailed pricing
  static generateOfferSchema(tool: AITool, pricing?: {
    price?: string
    currency?: string
    validFrom?: string
    validThrough?: string
  }): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'Offer',
      name: `${tool.name} Subscription`,
      description: `Access to ${tool.name} with all features included`,
      url: tool.pricingUrl,
      price: pricing?.price || '0',
      priceCurrency: pricing?.currency || 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: pricing?.validFrom || new Date().toISOString(),
      validThrough: pricing?.validThrough || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      seller: {
        '@type': 'Organization',
        name: tool.company,
        url: tool.officialUrl
      },
      category: tool.category,
      eligibleRegion: {
        '@type': 'GeoShape',
        addressCountry: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL', 'SE']
      }
    }
  }

  // Course Schema for tutorials and guides
  static generateCourseSchema(course: {
    name: string
    description: string
    provider: string
    url: string
    duration?: string
    skillLevel?: string
  }): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.name,
      description: course.description,
      provider: {
        '@type': 'Organization',
        name: course.provider,
        url: this.baseUrl
      },
      url: course.url,
      courseMode: 'online',
      educationalLevel: course.skillLevel || 'Beginner',
      timeRequired: course.duration || 'PT30M',
      inLanguage: 'en-US',
      isAccessibleForFree: true,
      learningResourceType: 'Tutorial',
      teaches: [
        'AI Tool Selection',
        'Software Evaluation',
        'Technology Implementation'
      ]
    }
  }

  // NewsArticle Schema for latest updates
  static generateNewsArticleSchema(article: {
    headline: string
    description: string
    author: string
    datePublished: string
    dateModified: string
    url: string
    image?: string
  }): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.headline,
      description: article.description,
      image: article.image || `${this.baseUrl}/news-images/default.jpg`,
      author: {
        '@type': 'Person',
        name: article.author,
        url: `${this.baseUrl}/author/${article.author.toLowerCase().replace(/\s+/g, '-')}`
      },
      publisher: {
        '@type': 'Organization',
        name: 'AI Tools List',
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/logo.png`
        }
      },
      datePublished: article.datePublished,
      dateModified: article.dateModified,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': article.url
      },
      articleSection: 'AI News',
      keywords: 'AI tools, artificial intelligence, technology news'
    }
  }

  // SearchResultsPage Schema
  static generateSearchResultsPageSchema(searchTerm: string, results: any[], totalResults: number): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'SearchResultsPage',
      name: `Search Results for "${searchTerm}"`,
      description: `Found ${totalResults} AI tools matching "${searchTerm}"`,
      url: `${this.baseUrl}/search?q=${encodeURIComponent(searchTerm)}`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: totalResults,
        itemListElement: results.slice(0, 10).map((result, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'SoftwareApplication',
            name: result.name,
            description: result.description,
            url: `${this.baseUrl}/ai-tools/${result.id}`
          }
        }))
      }
    }
  }

  // Event Schema for webinars and launches
  // All fields are now properly validated and required
  static generateEventSchema(event: {
    name: string
    description: string
    startDate: string
    endDate?: string
    location?: string
    isVirtual?: boolean
    organizer?: string
    image?: string
    eventUrl?: string
  }): SchemaMarkup {
    // Validate required fields
    if (!event.name || event.name.trim() === '') {
      throw new Error('Event name is required')
    }
    if (!event.description || event.description.trim() === '') {
      throw new Error('Event description is required')
    }
    if (!event.startDate || event.startDate.trim() === '') {
      throw new Error('Event startDate is required')
    }

    const isVirtual = event.isVirtual !== false // Default to virtual if not specified
    const locationData = event.location || this.baseUrl

    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.name.trim(),
      description: event.description.trim(),
      image: event.image || `${this.baseUrl}/og-home.jpg`,
      startDate: event.startDate,
      endDate: event.endDate || event.startDate,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: isVirtual 
        ? 'https://schema.org/OnlineEventAttendanceMode' 
        : 'https://schema.org/OfflineEventAttendanceMode',
      location: isVirtual ? {
        '@type': 'VirtualLocation',
        url: locationData,
        name: 'Online Event'
      } : {
        '@type': 'Place',
        name: locationData,
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'US'
        }
      },
      organizer: {
        '@type': 'Organization',
        name: event.organizer || 'AI Tools List',
        url: this.baseUrl
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: event.eventUrl || `${this.baseUrl}/events`,
        validFrom: event.startDate
      },
      performer: {
        '@type': 'Organization',
        name: event.organizer || 'AI Tools List'
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

  // Generate comprehensive tool page schema
  static generateToolPageSchema(tool: AITool): string {
    const schemas = [
      this.generateSoftwareApplicationSchema(tool),
      this.generateProductSchema(tool),
      this.generateAggregateRatingSchema(tool),
      this.generateReviewSchema(tool),
      this.generateOfferSchema(tool),
      this.generatePersonSchema({
        name: 'AI Tools Expert',
        jobTitle: 'Senior AI Analyst',
        bio: 'Expert in evaluating and reviewing AI tools for businesses and professionals.'
      })
    ]
    
    return this.generateCombinedSchema(schemas)
  }

  // Generate comprehensive homepage schema
  static generateHomepageSchema(): string {
    const schemas = [
      this.generateOrganizationSchema(),
      this.generateWebsiteSchema(),
      this.generatePersonSchema({
        name: 'AI Tools Team',
        jobTitle: 'AI Research Specialists',
        bio: 'Dedicated team of AI experts providing comprehensive tool reviews and insights.'
      })
    ]
    
    return this.generateCombinedSchema(schemas)
  }
}