/**
 * SEO Checklist and Validation Utilities
 * Comprehensive SEO validation for AI Tools Insights
 */

export interface SEOCheckResult {
  passed: boolean
  score: number
  issues: string[]
  recommendations: string[]
}

export interface SEOMetrics {
  titleLength: number
  descriptionLength: number
  headingStructure: boolean
  imageAltTags: boolean
  internalLinks: number
  externalLinks: number
  schemaMarkup: boolean
  canonicalUrl: boolean
  metaTags: boolean
  openGraph: boolean
  twitterCards: boolean
  robotsMeta: boolean
}

export class SEOChecker {
  static validatePage(
    title: string,
    description: string,
    url: string,
    content?: string
  ): SEOCheckResult {
    const issues: string[] = []
    const recommendations: string[] = []
    let score = 100

    // Title validation
    if (title.length < 30) {
      issues.push(`Title too short (${title.length} chars). Minimum 30 characters.`)
      score -= 10
      recommendations.push('Expand title with relevant keywords')
    }
    if (title.length > 60) {
      issues.push(`Title too long (${title.length} chars). Maximum 60 characters.`)
      score -= 10
      recommendations.push('Shorten title while keeping key information')
    }
    if (!title.includes('AI Tools') && !title.includes('AI')) {
      issues.push('Title missing primary keyword "AI Tools"')
      score -= 15
      recommendations.push('Include "AI Tools" in title for better ranking')
    }

    // Description validation
    if (description.length < 120) {
      issues.push(`Description too short (${description.length} chars). Minimum 120 characters.`)
      score -= 10
      recommendations.push('Expand description with more details and keywords')
    }
    if (description.length > 160) {
      issues.push(`Description too long (${description.length} chars). Maximum 160 characters.`)
      score -= 10
      recommendations.push('Shorten description to fit search result snippets')
    }

    // URL validation
    if (url.length > 100) {
      issues.push('URL too long. Keep under 100 characters.')
      score -= 5
      recommendations.push('Use shorter, more descriptive URLs')
    }
    if (!/^https:\/\//.test(url)) {
      issues.push('URL should use HTTPS')
      score -= 20
      recommendations.push('Ensure all URLs use HTTPS protocol')
    }

    // Content validation (if provided)
    if (content) {
      const wordCount = content.split(/\s+/).length
      if (wordCount < 300) {
        issues.push(`Content too short (${wordCount} words). Minimum 300 words.`)
        score -= 15
        recommendations.push('Add more comprehensive content for better SEO')
      }

      // Check for heading structure
      const h1Count = (content.match(/<h1/g) || []).length
      if (h1Count === 0) {
        issues.push('Missing H1 heading')
        score -= 10
        recommendations.push('Add a clear H1 heading to the page')
      }
      if (h1Count > 1) {
        issues.push('Multiple H1 headings found')
        score -= 5
        recommendations.push('Use only one H1 heading per page')
      }

      // Check for internal links
      const internalLinks = (content.match(/href="\/[^"]*"/g) || []).length
      if (internalLinks < 3) {
        issues.push('Insufficient internal links')
        score -= 5
        recommendations.push('Add more internal links to improve site structure')
      }
    }

    return {
      passed: score >= 80,
      score: Math.max(0, score),
      issues,
      recommendations
    }
  }

  static generateSEOReport(metrics: SEOMetrics): SEOCheckResult {
    const issues: string[] = []
    const recommendations: string[] = []
    let score = 100

    // Title length check
    if (metrics.titleLength < 30 || metrics.titleLength > 60) {
      issues.push('Title length not optimal')
      score -= 10
    }

    // Description length check
    if (metrics.descriptionLength < 120 || metrics.descriptionLength > 160) {
      issues.push('Meta description length not optimal')
      score -= 10
    }

    // Technical SEO checks
    if (!metrics.headingStructure) {
      issues.push('Poor heading structure')
      score -= 15
      recommendations.push('Implement proper H1-H6 hierarchy')
    }

    if (!metrics.imageAltTags) {
      issues.push('Missing image alt tags')
      score -= 10
      recommendations.push('Add descriptive alt tags to all images')
    }

    if (!metrics.schemaMarkup) {
      issues.push('Missing structured data')
      score -= 20
      recommendations.push('Implement Schema.org markup')
    }

    if (!metrics.canonicalUrl) {
      issues.push('Missing canonical URL')
      score -= 15
      recommendations.push('Add canonical link tag')
    }

    if (!metrics.openGraph) {
      issues.push('Missing Open Graph tags')
      score -= 10
      recommendations.push('Add Open Graph meta tags for social sharing')
    }

    if (!metrics.twitterCards) {
      issues.push('Missing Twitter Card tags')
      score -= 5
      recommendations.push('Add Twitter Card meta tags')
    }

    if (metrics.internalLinks < 5) {
      issues.push('Insufficient internal linking')
      score -= 5
      recommendations.push('Add more internal links to improve site structure')
    }

    return {
      passed: score >= 80,
      score: Math.max(0, score),
      issues,
      recommendations
    }
  }

  static getOptimalKeywords(category: string): string[] {
    const keywordMap: Record<string, string[]> = {
      'ai-tools': [
        'AI tools',
        'artificial intelligence tools',
        'AI software',
        'machine learning tools',
        'AI applications',
        'business AI tools',
        'AI productivity tools',
        'AI automation tools'
      ],
      'image-generation': [
        'AI image generator',
        'AI art generator',
        'text to image AI',
        'AI image creation',
        'AI artwork tools',
        'AI design tools',
        'AI graphics generator'
      ],
      'video-tools': [
        'AI video generator',
        'AI video editing',
        'AI video creation',
        'automated video tools',
        'AI video production',
        'AI video maker'
      ],
      'writing-tools': [
        'AI writing assistant',
        'AI content generator',
        'AI copywriting tools',
        'AI text generator',
        'AI writing software',
        'automated writing tools'
      ],
      'coding-tools': [
        'AI coding assistant',
        'AI code generator',
        'AI programming tools',
        'AI development tools',
        'AI code completion',
        'AI debugging tools'
      ],
      'chatbots': [
        'AI chatbot',
        'conversational AI',
        'AI chat assistant',
        'AI customer service',
        'AI virtual assistant',
        'AI chat tools'
      ]
    }

    return keywordMap[category] || keywordMap['ai-tools']
  }

  static generateMetaTitle(toolName: string, category: string, year: number = 2025): string {
    const keywords = this.getOptimalKeywords(category)
    const primaryKeyword = keywords[0]
    
    return `${toolName} Review ${year}: ${primaryKeyword} Features & Pricing`
  }

  static generateMetaDescription(toolName: string, category: string, features: string[]): string {
    const keywords = this.getOptimalKeywords(category)
    const primaryKeyword = keywords[0]
    const featureList = features.slice(0, 3).join(', ')
    
    return `Comprehensive ${toolName} review. Discover this ${primaryKeyword} with ${featureList}. Compare pricing, features & alternatives. Free trial available.`
  }
}

export default SEOChecker