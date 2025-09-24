/**
 * SEO Internal Link Automation System
 * Automatically manages and optimizes internal links across the entire site
 * Implements Google's latest SEO best practices and E-A-T guidelines
 */

import { InternalLinkStrategy, InternalLink } from './internal-link-strategy'

export interface PageAnalysis {
  url: string
  title: string
  content: string
  category: string
  keywords: string[]
  linkOpportunities: LinkOpportunity[]
  currentLinks: InternalLink[]
  linkDensity: number
  topicalRelevance: number
}

export interface LinkOpportunity {
  targetUrl: string
  anchorText: string
  context: string
  relevanceScore: number
  conversionPotential: 'high' | 'medium' | 'low'
  position: number
  reason: string
}

export interface LinkPerformanceMetrics {
  url: string
  clicks: number
  impressions: number
  ctr: number
  conversionRate: number
  bounceRate: number
  timeOnPage: number
  lastUpdated: Date
}

export class SEOInternalLinkAutomation {
  private static readonly MAX_LINKS_PER_PAGE = 8
  private static readonly MIN_CONTENT_LENGTH = 300
  private static readonly OPTIMAL_LINK_DENSITY = 0.02 // 2% of content
  
  // High-value pages that should receive more internal links
  private static readonly HIGH_VALUE_PAGES = [
    '/',
    '/ai-tools',
    '/blog',
    '/ai-tools/chatgpt',
    '/ai-tools/midjourney',
    '/ai-tools/github-copilot',
    '/ai-tools/dalle',
    '/ai-tools/claude-ai'
  ]

  // Money pages that should be linked to for conversions
  private static readonly MONEY_PAGES = [
    '/ai-tools/chatgpt',
    '/ai-tools/midjourney',
    '/ai-tools/github-copilot',
    '/ai-tools/dalle',
    '/ai-tools/claude-ai',
    '/ai-tools/stable-diffusion',
    '/ai-tools/adobe-firefly'
  ]

  /**
   * Analyze a page and identify internal linking opportunities
   */
  static analyzePage(
    url: string,
    title: string,
    content: string,
    category: string = 'General'
  ): PageAnalysis {
    const keywords = this.extractKeywords(content, title)
    const currentLinks = this.extractCurrentLinks(content)
    const linkOpportunities = this.identifyLinkOpportunities(url, content, category)
    const linkDensity = this.calculateLinkDensity(content, currentLinks.length)
    const topicalRelevance = this.calculateTopicalRelevance(content, category)

    return {
      url,
      title,
      content,
      category,
      keywords,
      linkOpportunities,
      currentLinks,
      linkDensity,
      topicalRelevance
    }
  }

  /**
   * Generate optimized internal links for a specific page
   */
  static generateOptimizedLinks(
    pageAnalysis: PageAnalysis,
    maxLinks: number = this.MAX_LINKS_PER_PAGE
  ): InternalLink[] {
    const { url, content, category, linkOpportunities } = pageAnalysis
    
    // Sort opportunities by relevance and conversion potential
    const sortedOpportunities = linkOpportunities
      .sort((a, b) => {
        const scoreA = this.calculateOpportunityScore(a)
        const scoreB = this.calculateOpportunityScore(b)
        return scoreB - scoreA
      })
      .slice(0, maxLinks)

    // Convert opportunities to internal links
    return sortedOpportunities.map(opportunity => ({
      url: opportunity.targetUrl,
      anchorText: opportunity.anchorText,
      context: 'contextual',
      priority: opportunity.conversionPotential === 'high' ? 'high' : 'medium',
      keywords: this.getTargetPageKeywords(opportunity.targetUrl),
      title: `Learn more about ${this.getPageTitle(opportunity.targetUrl)}`
    }))
  }

  /**
   * Identify strategic linking opportunities based on content analysis
   */
  private static identifyLinkOpportunities(
    currentUrl: string,
    content: string,
    category: string
  ): LinkOpportunity[] {
    const opportunities: LinkOpportunity[] = []
    const contentLower = content.toLowerCase()
    
    // 1. Tool-specific opportunities
    this.MONEY_PAGES.forEach(toolUrl => {
      if (toolUrl === currentUrl) return
      
      const toolName = this.getToolNameFromUrl(toolUrl)
      const toolKeywords = this.getToolKeywords(toolUrl)
      
      toolKeywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase()
        const position = contentLower.indexOf(keywordLower)
        
        if (position !== -1) {
          opportunities.push({
            targetUrl: toolUrl,
            anchorText: this.selectBestAnchorText(toolName, content),
            context: this.getContextAroundPosition(content, position, 100),
            relevanceScore: this.calculateRelevanceScore(keyword, content, category),
            conversionPotential: this.assessConversionPotential(toolUrl, currentUrl),
            position,
            reason: `Found mention of "${keyword}" - relevant tool link opportunity`
          })
        }
      })
    })

    // 2. Category-based opportunities
    const categoryLinks = InternalLinkStrategy.generateCategoryHubLinks(category)
    categoryLinks.forEach(link => {
      if (link.url === currentUrl) return
      
      const relevanceScore = this.calculateCategoryRelevance(content, link.keywords || [])
      if (relevanceScore > 0.3) {
        opportunities.push({
          targetUrl: link.url,
          anchorText: link.anchorText,
          context: 'category-related',
          relevanceScore,
          conversionPotential: 'medium',
          position: 0,
          reason: `High category relevance for ${category}`
        })
      }
    })

    // 3. Blog cross-linking opportunities
    if (currentUrl.includes('/blog/')) {
      const relatedPosts = InternalLinkStrategy.generateRelatedBlogLinks(
        this.extractSlugFromUrl(currentUrl),
        category,
        5
      )
      
      relatedPosts.forEach(post => {
        opportunities.push({
          targetUrl: post.url,
          anchorText: post.anchorText,
          context: 'related-content',
          relevanceScore: 0.7,
          conversionPotential: 'low',
          position: 0,
          reason: 'Related blog content for user engagement'
        })
      })
    }

    // 4. High-value page opportunities
    this.HIGH_VALUE_PAGES.forEach(pageUrl => {
      if (pageUrl === currentUrl) return
      
      const pageRelevance = this.calculatePageRelevance(content, pageUrl)
      if (pageRelevance > 0.4) {
        opportunities.push({
          targetUrl: pageUrl,
          anchorText: this.getPageTitle(pageUrl),
          context: 'high-value-page',
          relevanceScore: pageRelevance,
          conversionPotential: 'high',
          position: 0,
          reason: 'High-value page with good relevance match'
        })
      }
    })

    return opportunities
  }

  /**
   * Calculate opportunity score for prioritization
   */
  private static calculateOpportunityScore(opportunity: LinkOpportunity): number {
    let score = opportunity.relevanceScore * 100
    
    // Boost conversion potential
    switch (opportunity.conversionPotential) {
      case 'high':
        score += 50
        break
      case 'medium':
        score += 25
        break
      case 'low':
        score += 10
        break
    }
    
    // Boost money pages
    if (this.MONEY_PAGES.includes(opportunity.targetUrl)) {
      score += 30
    }
    
    // Boost high-value pages
    if (this.HIGH_VALUE_PAGES.includes(opportunity.targetUrl)) {
      score += 20
    }
    
    return score
  }

  /**
   * Extract keywords from content and title
   */
  private static extractKeywords(content: string, title: string): string[] {
    const text = `${title} ${content}`.toLowerCase()
    const words = text.match(/\b\w{3,}\b/g) || []
    
    // Count word frequency
    const wordCount: Record<string, number> = {}
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })
    
    // Return top keywords
    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word)
  }

  /**
   * Extract current internal links from content
   */
  private static extractCurrentLinks(content: string): InternalLink[] {
    const linkRegex = /<a[^>]+href="([^"]*)"[^>]*>([^<]*)<\/a>/gi
    const links: InternalLink[] = []
    let match
    
    while ((match = linkRegex.exec(content)) !== null) {
      const [, url, anchorText] = match
      if (url.startsWith('/') || url.includes(process.env.NEXT_PUBLIC_SITE_URL || '')) {
        links.push({
          url: url.startsWith('/') ? url : new URL(url).pathname,
          anchorText,
          context: 'contextual',
          priority: 'medium',
          keywords: [anchorText.toLowerCase()]
        })
      }
    }
    
    return links
  }

  /**
   * Calculate link density (links per content length)
   */
  private static calculateLinkDensity(content: string, linkCount: number): number {
    const wordCount = content.split(/\s+/).length
    return linkCount / wordCount
  }

  /**
   * Calculate topical relevance score
   */
  private static calculateTopicalRelevance(content: string, category: string): number {
    const categoryKeywords = this.getCategoryKeywords(category)
    const contentLower = content.toLowerCase()
    
    let matches = 0
    categoryKeywords.forEach(keyword => {
      if (contentLower.includes(keyword.toLowerCase())) {
        matches++
      }
    })
    
    return matches / categoryKeywords.length
  }

  /**
   * Calculate relevance score between keyword and content
   */
  private static calculateRelevanceScore(
    keyword: string,
    content: string,
    category: string
  ): number {
    const contentLower = content.toLowerCase()
    const keywordLower = keyword.toLowerCase()
    
    // Base score from keyword frequency
    const matches = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length
    let score = Math.min(matches * 0.1, 0.8)
    
    // Boost if keyword is in category
    const categoryKeywords = this.getCategoryKeywords(category)
    if (categoryKeywords.some(ck => ck.toLowerCase().includes(keywordLower))) {
      score += 0.2
    }
    
    return Math.min(score, 1.0)
  }

  /**
   * Assess conversion potential of linking from source to target
   */
  private static assessConversionPotential(
    targetUrl: string,
    sourceUrl: string
  ): 'high' | 'medium' | 'low' {
    // Money pages have high conversion potential
    if (this.MONEY_PAGES.includes(targetUrl)) {
      return 'high'
    }
    
    // Category pages have medium potential
    if (targetUrl.includes('/ai-tools') && !targetUrl.includes('/ai-tools/')) {
      return 'medium'
    }
    
    // Blog to blog has low conversion potential
    if (sourceUrl.includes('/blog/') && targetUrl.includes('/blog/')) {
      return 'low'
    }
    
    return 'medium'
  }

  /**
   * Calculate category relevance score
   */
  private static calculateCategoryRelevance(content: string, keywords: string[]): number {
    const contentLower = content.toLowerCase()
    let matches = 0
    
    keywords.forEach(keyword => {
      if (contentLower.includes(keyword.toLowerCase())) {
        matches++
      }
    })
    
    return keywords.length > 0 ? matches / keywords.length : 0
  }

  /**
   * Calculate page relevance score
   */
  private static calculatePageRelevance(content: string, pageUrl: string): number {
    const pageKeywords = this.getPageKeywords(pageUrl)
    return this.calculateCategoryRelevance(content, pageKeywords)
  }

  /**
   * Get context around a specific position in content
   */
  private static getContextAroundPosition(
    content: string,
    position: number,
    contextLength: number = 100
  ): string {
    const start = Math.max(0, position - contextLength)
    const end = Math.min(content.length, position + contextLength)
    return content.substring(start, end)
  }

  /**
   * Select best anchor text variation
   */
  private static selectBestAnchorText(toolName: string, content: string): string {
    const variations = [
      toolName,
      `${toolName} AI`,
      `the ${toolName} platform`,
      `${toolName} tool`,
      `${toolName} review`
    ]
    
    // Select variation that hasn't been used in content
    return variations.find(variation => 
      !content.toLowerCase().includes(variation.toLowerCase())
    ) || toolName
  }

  // Helper methods
  private static getToolNameFromUrl(url: string): string {
    const slug = url.split('/').pop() || ''
    return slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  private static getToolKeywords(url: string): string[] {
    const toolKeywords: Record<string, string[]> = {
      '/ai-tools/chatgpt': ['ChatGPT', 'AI chatbot', 'OpenAI', 'conversational AI'],
      '/ai-tools/midjourney': ['Midjourney', 'AI art', 'image generation', 'AI artist'],
      '/ai-tools/github-copilot': ['GitHub Copilot', 'AI coding', 'code assistant', 'programming AI'],
      '/ai-tools/dalle': ['DALL-E', 'AI images', 'OpenAI images', 'text to image'],
      '/ai-tools/claude-ai': ['Claude AI', 'Anthropic', 'AI assistant', 'helpful AI']
    }
    return toolKeywords[url] || []
  }

  private static getCategoryKeywords(category: string): string[] {
    const categoryKeywords: Record<string, string[]> = {
      'AI Image Generators': ['image generation', 'AI art', 'text to image', 'visual AI'],
      'AI Writing Tools': ['AI writing', 'content creation', 'copywriting', 'text generation'],
      'AI Coding Tools': ['AI coding', 'code assistant', 'programming', 'developer tools'],
      'AI Video Tools': ['AI video', 'video generation', 'video editing', 'multimedia'],
      'AI Research Tools': ['AI research', 'information retrieval', 'analysis', 'search']
    }
    return categoryKeywords[category] || []
  }

  private static getPageKeywords(url: string): string[] {
    const pageKeywords: Record<string, string[]> = {
      '/': ['AI tools', 'directory', 'artificial intelligence', 'AI software'],
      '/ai-tools': ['AI tools directory', 'AI software', 'artificial intelligence tools'],
      '/blog': ['AI blog', 'AI insights', 'AI news', 'AI tutorials']
    }
    return pageKeywords[url] || []
  }

  private static getPageTitle(url: string): string {
    const titles: Record<string, string> = {
      '/': 'AI Tools Directory',
      '/ai-tools': 'AI Tools',
      '/blog': 'AI Insights Blog',
      '/about': 'About Us',
      '/contact': 'Contact'
    }
    return titles[url] || this.getToolNameFromUrl(url)
  }

  private static extractSlugFromUrl(url: string): string {
    return url.split('/').pop() || ''
  }

  private static getTargetPageKeywords(url: string): string[] {
    if (url.includes('/ai-tools/')) {
      return this.getToolKeywords(url)
    }
    return this.getPageKeywords(url)
  }
}

/**
 * Link Performance Tracker
 */
export class LinkPerformanceTracker {
  /**
   * Track link performance metrics
   */
  static trackLinkPerformance(
    linkUrl: string,
    sourceUrl: string,
    event: 'click' | 'impression' | 'conversion'
  ): void {
    // This would integrate with your analytics system
    console.log(`Link performance: ${event} on ${linkUrl} from ${sourceUrl}`)
  }

  /**
   * Get link performance metrics
   */
  static getLinkMetrics(url: string): LinkPerformanceMetrics {
    // This would fetch from your analytics database
    return {
      url,
      clicks: 0,
      impressions: 0,
      ctr: 0,
      conversionRate: 0,
      bounceRate: 0,
      timeOnPage: 0,
      lastUpdated: new Date()
    }
  }

  /**
   * Optimize links based on performance data
   */
  static optimizeLinksBasedOnPerformance(
    pageAnalysis: PageAnalysis,
    performanceData: LinkPerformanceMetrics[]
  ): InternalLink[] {
    // Remove underperforming links and boost high-performing ones
    const optimizedLinks = SEOInternalLinkAutomation.generateOptimizedLinks(pageAnalysis)
    
    return optimizedLinks.filter(link => {
      const metrics = performanceData.find(m => m.url === link.url)
      return !metrics || metrics.ctr > 0.01 // Remove links with very low CTR
    })
  }
}

export default SEOInternalLinkAutomation