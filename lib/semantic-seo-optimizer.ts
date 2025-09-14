// Semantic SEO Optimizer for AI Tools Directory
// This utility helps optimize content for semantic search and first-page rankings

import { semanticKeywords, toolKeywords, intentKeywords, geoModifiers, trendingModifiers } from './semantic-keywords'

export interface SEOOptimization {
  title: string
  metaDescription: string
  h1: string
  h2s: string[]
  keywords: string[]
  entities: string[]
  internalLinks: string[]
  schemaMarkup: object
  contentStructure: ContentSection[]
}

export interface ContentSection {
  heading: string
  content: string
  keywords: string[]
  wordCount: number
}

export class SemanticSEOOptimizer {
  
  /**
   * Generate comprehensive SEO optimization for a tool page
   */
  static optimizeToolPage(toolId: string, toolData: any): SEOOptimization {
    const toolName = toolData.name
    const category = toolData.category
    const description = toolData.description
    
    // Get semantic keywords for this tool
    const keywords = toolKeywords[toolId.toLowerCase()] || this.generateToolKeywords(toolName, category)
    
    return {
      title: `${toolName} Review 2025: Features, Pricing & Alternatives | AI Tools Directory`,
      metaDescription: `Comprehensive ${toolName} review covering features, pricing, pros/cons, and alternatives. ${description.substring(0, 100)}... Read our expert analysis.`,
      h1: `${toolName} Review: ${this.extractBenefit(description)}`,
      h2s: [
        `What is ${toolName}?`,
        `${toolName} Key Features`,
        `${toolName} Pricing Plans`,
        `${toolName} Pros and Cons`,
        `${toolName} vs Alternatives`,
        `Who Should Use ${toolName}?`,
        `${toolName} Use Cases and Examples`,
        `Getting Started with ${toolName}`,
        `${toolName} FAQ`,
        `Final Verdict: Is ${toolName} Worth It?`
      ],
      keywords: keywords.secondary.concat(keywords.longTail),
      entities: keywords.entities,
      internalLinks: this.generateInternalLinks(toolData),
      schemaMarkup: this.generateToolSchema(toolData),
      contentStructure: this.generateToolContentStructure(toolData)
    }
  }

  /**
   * Generate SEO optimization for category pages
   */
  static optimizeCategoryPage(category: string): SEOOptimization {
    const categoryKey = this.getCategoryKey(category)
    const keywords = semanticKeywords[categoryKey]
    
    if (!keywords) {
      throw new Error(`No semantic keywords found for category: ${category}`)
    }

    return {
      title: `Best ${category} 2025: Top Tools Compared | AI Tools Directory`,
      metaDescription: `Discover the best ${category.toLowerCase()} for your needs. Compare features, pricing, and reviews of top ${category.toLowerCase()} platforms. Updated 2025.`,
      h1: `Best ${category} 2025: Complete Guide & Comparison`,
      h2s: [
        `What are ${category}?`,
        `Top ${category} Compared`,
        `How to Choose the Right ${category.slice(0, -1)}`,
        `${category} for Different Use Cases`,
        `Free vs Paid ${category}`,
        `${category} Pricing Comparison`,
        `Future of ${category}`,
        `Frequently Asked Questions`
      ],
      keywords: keywords.secondary.concat(keywords.longTail),
      entities: keywords.entities,
      internalLinks: this.generateCategoryInternalLinks(category),
      schemaMarkup: this.generateCategorySchema(category),
      contentStructure: this.generateCategoryContentStructure(category)
    }
  }

  /**
   * Generate homepage SEO optimization
   */
  static optimizeHomepage(): SEOOptimization {
    const keywords = semanticKeywords.homepage

    return {
      title: 'AI Tools Directory 2025: Discover the Best AI Software for Your Business',
      metaDescription: 'Find the perfect AI tools for your business from our comprehensive directory of 500+ AI software solutions. Compare features, pricing, and reviews. Updated daily.',
      h1: 'Discover the Best AI Tools for Your Business in 2025',
      h2s: [
        'Featured AI Tools',
        'Popular AI Tool Categories',
        'Why Choose Our AI Tools Directory?',
        'Latest AI Tool Reviews',
        'AI Tools by Use Case',
        'Free vs Premium AI Tools',
        'Getting Started with AI Tools'
      ],
      keywords: keywords.secondary.concat(keywords.longTail),
      entities: keywords.entities,
      internalLinks: this.generateHomepageInternalLinks(),
      schemaMarkup: this.generateHomepageSchema(),
      contentStructure: this.generateHomepageContentStructure()
    }
  }

  /**
   * Generate blog post SEO optimization
   */
  static optimizeBlogPost(topic: string, category: string): SEOOptimization {
    const keywords = this.generateBlogKeywords(topic, category)
    
    return {
      title: `${topic} | Complete Guide 2025 | AI Tools Directory`,
      metaDescription: `Complete guide to ${topic.toLowerCase()}. Learn best practices, compare tools, and discover expert tips. Updated 2025.`,
      h1: topic,
      h2s: this.generateBlogH2s(topic),
      keywords: keywords,
      entities: this.extractEntities(topic, category),
      internalLinks: this.generateBlogInternalLinks(topic, category),
      schemaMarkup: this.generateBlogSchema(topic),
      contentStructure: this.generateBlogContentStructure(topic)
    }
  }

  /**
   * Generate semantic keywords for a tool
   */
  private static generateToolKeywords(toolName: string, category: string) {
    return {
      primary: `${toolName} review`,
      secondary: [
        `${toolName} pricing`,
        `${toolName} features`,
        `${toolName} alternatives`,
        `${toolName} vs competitors`,
        `how to use ${toolName}`
      ],
      longTail: [
        `${toolName} review 2025`,
        `is ${toolName} worth it`,
        `${toolName} for business`,
        `${toolName} pros and cons`,
        `best ${toolName} alternatives`
      ],
      lsi: this.getCategoryLSI(category),
      entities: [toolName, category, 'AI Tool', 'Software Review'],
      intent: 'commercial' as const,
      searchVolume: 'medium' as const,
      difficulty: 'medium' as const
    }
  }

  /**
   * Extract main benefit from description
   */
  private static extractBenefit(description: string): string {
    // Extract the main benefit/value proposition from the description
    const sentences = description.split('.')
    return sentences[0] || description.substring(0, 60) + '...'
  }

  /**
   * Generate internal links for tool pages
   */
  private static generateInternalLinks(toolData: any): string[] {
    return [
      `/ai-tools/${toolData.category.toLowerCase().replace(/\s+/g, '-')}`,
      ...toolData.alternatives.map((alt: string) => `/ai-tools/${alt}`),
      `/blog/how-to-choose-${toolData.category.toLowerCase().replace(/\s+/g, '-')}`,
      `/blog/${toolData.category.toLowerCase().replace(/\s+/g, '-')}-comparison`
    ]
  }

  /**
   * Generate schema markup for tool pages
   */
  private static generateToolSchema(toolData: any) {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": toolData.name,
      "description": toolData.description,
      "applicationCategory": toolData.category,
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "url": toolData.pricingUrl,
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": toolData.rating,
        "ratingCount": "100",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": {
        "@type": "Review",
        "author": {
          "@type": "Organization",
          "name": "AI Tools Directory"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": toolData.rating,
          "bestRating": "5",
          "worstRating": "1"
        }
      }
    }
  }

  /**
   * Generate content structure for tool pages
   */
  private static generateToolContentStructure(toolData: any): ContentSection[] {
    return [
      {
        heading: `What is ${toolData.name}?`,
        content: `${toolData.name} is ${toolData.longDescription}`,
        keywords: [toolData.name, toolData.category, 'AI tool'],
        wordCount: 200
      },
      {
        heading: `${toolData.name} Key Features`,
        content: `Explore the powerful features that make ${toolData.name} stand out...`,
        keywords: toolData.features,
        wordCount: 300
      },
      {
        heading: `${toolData.name} Pricing Plans`,
        content: `Understanding ${toolData.name} pricing structure...`,
        keywords: [`${toolData.name} pricing`, 'cost', 'plans'],
        wordCount: 250
      },
      {
        heading: `${toolData.name} Pros and Cons`,
        content: `Balanced analysis of ${toolData.name} advantages and limitations...`,
        keywords: [`${toolData.name} review`, 'pros', 'cons'],
        wordCount: 300
      }
    ]
  }

  /**
   * Get category key for semantic keywords lookup
   */
  private static getCategoryKey(category: string): string {
    const categoryMap: Record<string, string> = {
      'AI Image Generators': 'aiImageGeneration',
      'AI Video Tools': 'aiVideoTools',
      'AI Writing Tools': 'aiWritingTools',
      'AI Coding Assistants': 'aiCodingTools',
      'AI Voice Tools': 'aiVoiceTools',
      'AI Chatbots': 'aiChatbots',
      'AI Music Tools': 'aiMusicTools'
    }
    
    return categoryMap[category] || 'homepage'
  }

  /**
   * Get LSI keywords for category
   */
  private static getCategoryLSI(category: string): string[] {
    const categoryKey = this.getCategoryKey(category)
    return semanticKeywords[categoryKey]?.lsi || []
  }

  /**
   * Generate internal links for category pages
   */
  private static generateCategoryInternalLinks(category: string): string[] {
    return [
      '/',
      `/blog/best-${category.toLowerCase().replace(/\s+/g, '-')}-2025`,
      `/blog/how-to-choose-${category.toLowerCase().replace(/\s+/g, '-')}`,
      `/blog/${category.toLowerCase().replace(/\s+/g, '-')}-comparison`
    ]
  }

  /**
   * Generate schema for category pages
   */
  private static generateCategorySchema(category: string) {
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `Best ${category} 2025`,
      "description": `Comprehensive directory of the best ${category.toLowerCase()} available in 2025`,
      "url": `https://www.aitoolsinsights.com/ai-tools/${category.toLowerCase().replace(/\s+/g, '-')}`,
      "mainEntity": {
        "@type": "ItemList",
        "name": `${category} Directory`,
        "description": `Curated list of top ${category.toLowerCase()}`
      }
    }
  }

  /**
   * Generate content structure for category pages
   */
  private static generateCategoryContentStructure(category: string): ContentSection[] {
    return [
      {
        heading: `What are ${category}?`,
        content: `${category} are artificial intelligence applications that...`,
        keywords: [category, 'AI tools', 'artificial intelligence'],
        wordCount: 300
      },
      {
        heading: `Top ${category} Compared`,
        content: `Compare the leading ${category.toLowerCase()} in the market...`,
        keywords: [`best ${category}`, 'comparison', 'features'],
        wordCount: 500
      },
      {
        heading: `How to Choose the Right ${category.slice(0, -1)}`,
        content: `Guide to selecting the perfect ${category.toLowerCase().slice(0, -1)} for your needs...`,
        keywords: ['how to choose', category, 'selection guide'],
        wordCount: 400
      }
    ]
  }

  /**
   * Generate homepage internal links
   */
  private static generateHomepageInternalLinks(): string[] {
    return [
      '/ai-tools/ai-image-generators',
      '/ai-tools/ai-video-tools',
      '/ai-tools/ai-writing-tools',
      '/ai-tools/ai-coding-assistants',
      '/blog/best-ai-tools-2025',
      '/blog/how-to-choose-ai-tools'
    ]
  }

  /**
   * Generate homepage schema
   */
  private static generateHomepageSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "AI Tools Directory",
      "description": "Comprehensive directory of the best AI tools for business and personal use",
      "url": "https://www.aitoolsinsights.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.aitoolsinsights.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "AI Tools Directory",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.aitoolsinsights.com/logo.png"
        }
      }
    }
  }

  /**
   * Generate homepage content structure
   */
  private static generateHomepageContentStructure(): ContentSection[] {
    return [
      {
        heading: 'Featured AI Tools',
        content: 'Discover the most popular and effective AI tools...',
        keywords: ['featured AI tools', 'popular AI tools', 'best AI software'],
        wordCount: 300
      },
      {
        heading: 'Popular AI Tool Categories',
        content: 'Explore AI tools by category to find exactly what you need...',
        keywords: ['AI tool categories', 'types of AI tools', 'AI software types'],
        wordCount: 400
      }
    ]
  }

  /**
   * Generate blog keywords
   */
  private static generateBlogKeywords(topic: string, category: string): string[] {
    return [
      topic,
      `${topic} 2025`,
      `${topic} guide`,
      `${topic} tips`,
      `${topic} best practices`,
      category,
      'AI tools'
    ]
  }

  /**
   * Generate blog H2 headings
   */
  private static generateBlogH2s(topic: string): string[] {
    return [
      `What is ${topic}?`,
      `Why ${topic} Matters in 2025`,
      `Best Practices for ${topic}`,
      `Common Mistakes to Avoid`,
      `Tools and Resources`,
      `Future Trends`,
      'Conclusion'
    ]
  }

  /**
   * Extract entities from topic and category
   */
  private static extractEntities(topic: string, category: string): string[] {
    return [topic, category, 'AI Tools', 'Technology', 'Software']
  }

  /**
   * Generate blog internal links
   */
  private static generateBlogInternalLinks(topic: string, category: string): string[] {
    return [
      '/',
      `/ai-tools/${category.toLowerCase().replace(/\s+/g, '-')}`,
      '/blog',
      `/blog/${category.toLowerCase().replace(/\s+/g, '-')}-guide`
    ]
  }

  /**
   * Generate blog schema
   */
  private static generateBlogSchema(topic: string) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": topic,
      "author": {
        "@type": "Organization",
        "name": "AI Tools Directory"
      },
      "publisher": {
        "@type": "Organization",
        "name": "AI Tools Directory",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.aitoolsinsights.com/logo.png"
        }
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString()
    }
  }

  /**
   * Generate blog content structure
   */
  private static generateBlogContentStructure(topic: string): ContentSection[] {
    return [
      {
        heading: `What is ${topic}?`,
        content: `Understanding ${topic} and its importance...`,
        keywords: [topic, 'definition', 'explanation'],
        wordCount: 300
      },
      {
        heading: `Why ${topic} Matters in 2025`,
        content: `The significance of ${topic} in today's landscape...`,
        keywords: [topic, '2025', 'importance', 'trends'],
        wordCount: 400
      },
      {
        heading: `Best Practices for ${topic}`,
        content: `Expert recommendations for ${topic}...`,
        keywords: [topic, 'best practices', 'tips', 'guide'],
        wordCount: 500
      }
    ]
  }
}

export default SemanticSEOOptimizer