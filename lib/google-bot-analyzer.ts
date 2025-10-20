/**
 * Google Bot Keyword Readability Analyzer
 * Measures how well Google bots understand your primary keyword (Target: 95%+)
 * Based on latest Google algorithm updates and ranking factors
 */

export interface KeywordAnalysis {
  primaryKeyword: string
  understandingScore: number // 0-100, target is 95+
  factors: {
    keywordDensity: { score: number; current: number; optimal: number; status: 'good' | 'warning' | 'critical' }
    titlePresence: { score: number; present: boolean; position: 'start' | 'middle' | 'end' | 'none' }
    h1Presence: { score: number; present: boolean; exact: boolean }
    h2Distribution: { score: number; count: number; withKeyword: number }
    firstParagraph: { score: number; present: boolean; position: number }
    urlOptimization: { score: number; present: boolean; slug: string }
    semanticRelevance: { score: number; relatedTerms: string[]; foundTerms: string[] }
    lsiKeywords: { score: number; expected: string[]; found: string[] }
    keywordProximity: { score: number; clusterScore: number }
    contentDepth: { score: number; wordCount: number; minRequired: number }
    naturalLanguage: { score: number; readability: number; stuffing: boolean }
    entityRecognition: { score: number; entities: string[]; relationships: number }
  }
  issues: Array<{
    severity: 'critical' | 'warning' | 'info'
    factor: string
    message: string
    impact: number
    fix: string
  }>
  opportunities: string[]
  breakdown: {
    critical: number // Issues that prevent 95%+ score
    warning: number  // Issues that affect score
    passed: number   // Factors that are optimal
  }
}

export interface OptimizationSuggestion {
  priority: 'high' | 'medium' | 'low'
  category: string
  action: string
  expectedImpact: number
  implementation: string
}

export class GoogleBotAnalyzer {
  
  /**
   * Analyzes content to determine Google Bot keyword understanding score
   */
  static analyzeKeywordUnderstanding(
    content: string,
    title: string,
    primaryKeyword: string,
    metaDescription: string = '',
    slug: string = ''
  ): KeywordAnalysis {
    
    const contentLower = content.toLowerCase()
    const keywordLower = primaryKeyword.toLowerCase()
    const words = content.split(/\s+/)
    
    // Initialize factors
    const factors = {
      keywordDensity: this.analyzeKeywordDensity(content, primaryKeyword),
      titlePresence: this.analyzeTitlePresence(title, primaryKeyword),
      h1Presence: this.analyzeH1Presence(content, primaryKeyword),
      h2Distribution: this.analyzeH2Distribution(content, primaryKeyword),
      firstParagraph: this.analyzeFirstParagraph(content, primaryKeyword),
      urlOptimization: this.analyzeURLOptimization(slug, primaryKeyword),
      semanticRelevance: this.analyzeSemanticRelevance(content, primaryKeyword),
      lsiKeywords: this.analyzeLSIKeywords(content, primaryKeyword),
      keywordProximity: this.analyzeKeywordProximity(content, primaryKeyword),
      contentDepth: this.analyzeContentDepth(content, primaryKeyword),
      naturalLanguage: this.analyzeNaturalLanguage(content, primaryKeyword),
      entityRecognition: this.analyzeEntityRecognition(content, primaryKeyword)
    }
    
    // Calculate overall understanding score
    const weights = {
      keywordDensity: 12,
      titlePresence: 10,
      h1Presence: 10,
      h2Distribution: 8,
      firstParagraph: 10,
      urlOptimization: 7,
      semanticRelevance: 12,
      lsiKeywords: 10,
      keywordProximity: 8,
      contentDepth: 8,
      naturalLanguage: 10,
      entityRecognition: 5
    }
    
    let totalScore = 0
    let totalWeight = 0
    
    Object.entries(factors).forEach(([key, factor]) => {
      const weight = weights[key as keyof typeof weights]
      totalScore += factor.score * weight
      totalWeight += weight
    })
    
    const understandingScore = Math.round(totalScore / totalWeight)
    
    // Identify issues and opportunities
    const issues = this.identifyIssues(factors, primaryKeyword)
    const opportunities = this.identifyOpportunities(factors, understandingScore)
    
    // Calculate breakdown
    const breakdown = {
      critical: issues.filter(i => i.severity === 'critical').length,
      warning: issues.filter(i => i.severity === 'warning').length,
      passed: Object.values(factors).filter(f => f.score >= 90).length
    }
    
    return {
      primaryKeyword,
      understandingScore,
      factors,
      issues,
      opportunities,
      breakdown
    }
  }
  
  /**
   * Analyze keyword density (optimal: 1.5-2.5%)
   */
  private static analyzeKeywordDensity(content: string, keyword: string) {
    const words = content.split(/\s+/)
    const keywordLower = keyword.toLowerCase()
    const matches = content.toLowerCase().split(keywordLower).length - 1
    const density = (matches / words.length) * 100
    
    let score = 0
    let status: 'good' | 'warning' | 'critical' = 'critical'
    
    if (density >= 1.5 && density <= 2.5) {
      score = 100
      status = 'good'
    } else if (density >= 1.0 && density <= 3.0) {
      score = 75
      status = 'warning'
    } else if (density < 1.0) {
      score = Math.min(70, density * 50)
      status = 'critical'
    } else {
      score = Math.max(50, 100 - (density - 3) * 10)
      status = 'warning'
    }
    
    return { score, current: density, optimal: 2.0, status }
  }
  
  /**
   * Analyze title presence and position
   */
  private static analyzeTitlePresence(title: string, keyword: string) {
    const titleLower = title.toLowerCase()
    const keywordLower = keyword.toLowerCase()
    const present = titleLower.includes(keywordLower)
    
    let position: 'start' | 'middle' | 'end' | 'none' = 'none'
    let score = 0
    
    if (present) {
      const index = titleLower.indexOf(keywordLower)
      const titleLength = title.length
      
      if (index < titleLength * 0.25) {
        position = 'start'
        score = 100
      } else if (index < titleLength * 0.75) {
        position = 'middle'
        score = 80
      } else {
        position = 'end'
        score = 70
      }
    }
    
    return { score, present, position }
  }
  
  /**
   * Analyze H1 presence
   */
  private static analyzeH1Presence(content: string, keyword: string) {
    const h1Match = content.match(/^#\s+(.+)$/m)
    const keywordLower = keyword.toLowerCase()
    
    let present = false
    let exact = false
    let score = 0
    
    if (h1Match) {
      const h1Text = h1Match[1].toLowerCase()
      present = h1Text.includes(keywordLower)
      exact = h1Text === keywordLower
      
      if (exact) {
        score = 100
      } else if (present) {
        score = 85
      }
    }
    
    return { score, present, exact }
  }
  
  /**
   * Analyze H2 distribution
   */
  private static analyzeH2Distribution(content: string, keyword: string) {
    const h2Matches = content.match(/^##\s+(.+)$/gm) || []
    const count = h2Matches.length
    const keywordLower = keyword.toLowerCase()
    
    let withKeyword = 0
    h2Matches.forEach(h2 => {
      if (h2.toLowerCase().includes(keywordLower)) {
        withKeyword++
      }
    })
    
    let score = 0
    if (count === 0) {
      score = 0
    } else if (withKeyword === 0) {
      score = 40
    } else {
      const ratio = withKeyword / count
      if (ratio >= 0.3 && ratio <= 0.5) {
        score = 100
      } else if (ratio >= 0.2 && ratio <= 0.6) {
        score = 85
      } else {
        score = 70
      }
    }
    
    return { score, count, withKeyword }
  }
  
  /**
   * Analyze first paragraph keyword presence
   */
  private static analyzeFirstParagraph(content: string, keyword: string) {
    const paragraphs = content.split('\n\n').filter(p => p.trim() && !p.match(/^#+\s/))
    const firstParagraph = paragraphs[0] || ''
    const keywordLower = keyword.toLowerCase()
    
    const present = firstParagraph.toLowerCase().includes(keywordLower)
    const position = firstParagraph.toLowerCase().indexOf(keywordLower)
    
    let score = 0
    if (present) {
      if (position < 100) {
        score = 100
      } else if (position < 200) {
        score = 85
      } else {
        score = 70
      }
    }
    
    return { score, present, position }
  }
  
  /**
   * Analyze URL optimization
   */
  private static analyzeURLOptimization(slug: string, keyword: string) {
    const slugLower = slug.toLowerCase().replace(/-/g, ' ')
    const keywordLower = keyword.toLowerCase()
    const present = slugLower.includes(keywordLower)
    
    const score = present ? 100 : 0
    
    return { score, present, slug }
  }
  
  /**
   * Analyze semantic relevance
   */
  private static analyzeSemanticRelevance(content: string, keyword: string) {
    const relatedTerms = this.generateSemanticTerms(keyword)
    const contentLower = content.toLowerCase()
    
    const foundTerms = relatedTerms.filter(term => 
      contentLower.includes(term.toLowerCase())
    )
    
    const ratio = foundTerms.length / relatedTerms.length
    const score = Math.min(100, ratio * 120)
    
    return { score, relatedTerms, foundTerms }
  }
  
  /**
   * Analyze LSI keywords
   */
  private static analyzeLSIKeywords(content: string, keyword: string) {
    const expected = this.generateLSIKeywords(keyword)
    const contentLower = content.toLowerCase()
    
    const found = expected.filter(lsi => 
      contentLower.includes(lsi.toLowerCase())
    )
    
    const ratio = found.length / expected.length
    const score = Math.min(100, ratio * 130)
    
    return { score, expected, found }
  }
  
  /**
   * Analyze keyword proximity (keywords appearing close together)
   */
  private static analyzeKeywordProximity(content: string, keyword: string) {
    const sentences = content.split(/[.!?]+/)
    const keywordLower = keyword.toLowerCase()
    const relatedTerms = this.generateSemanticTerms(keyword)
    
    let clusterScore = 0
    let clusters = 0
    
    sentences.forEach(sentence => {
      const sentenceLower = sentence.toLowerCase()
      if (sentenceLower.includes(keywordLower)) {
        const relatedInSentence = relatedTerms.filter(term =>
          sentenceLower.includes(term.toLowerCase())
        ).length
        
        if (relatedInSentence > 0) {
          clusters++
          clusterScore += relatedInSentence
        }
      }
    })
    
    const score = Math.min(100, (clusters / Math.max(1, sentences.length / 10)) * 100)
    
    return { score, clusterScore }
  }
  
  /**
   * Analyze content depth
   */
  private static analyzeContentDepth(content: string, keyword: string) {
    const words = content.split(/\s+/)
    const wordCount = words.length
    const minRequired = 1500
    
    let score = 0
    if (wordCount >= 2500) {
      score = 100
    } else if (wordCount >= 2000) {
      score = 90
    } else if (wordCount >= minRequired) {
      score = 80
    } else {
      score = Math.min(70, (wordCount / minRequired) * 80)
    }
    
    return { score, wordCount, minRequired }
  }
  
  /**
   * Analyze natural language usage
   */
  private static analyzeNaturalLanguage(content: string, keyword: string) {
    const keywordLower = keyword.toLowerCase()
    const sentences = content.split(/[.!?]+/)
    
    // Check for keyword stuffing
    const keywordMatches = content.toLowerCase().split(keywordLower).length - 1
    const avgWordsPerSentence = content.split(/\s+/).length / sentences.length
    
    let stuffing = false
    let readability = 100
    
    // Detect keyword stuffing patterns
    sentences.forEach(sentence => {
      const sentenceWords = sentence.split(/\s+/).length
      const keywordInSentence = sentence.toLowerCase().split(keywordLower).length - 1
      
      if (keywordInSentence > 2 && sentenceWords < 30) {
        stuffing = true
        readability -= 10
      }
    })
    
    // Check readability
    if (avgWordsPerSentence > 25) {
      readability -= 15
    } else if (avgWordsPerSentence < 10) {
      readability -= 10
    }
    
    const score = Math.max(0, readability)
    
    return { score, readability, stuffing }
  }
  
  /**
   * Analyze entity recognition
   */
  private static analyzeEntityRecognition(content: string, keyword: string) {
    const entities = this.extractEntities(content, keyword)
    const relationships = this.countRelationships(content, entities)
    
    const score = Math.min(100, (entities.length * 10) + (relationships * 5))
    
    return { score, entities, relationships }
  }
  
  /**
   * Generate semantic terms for a keyword
   */
  private static generateSemanticTerms(keyword: string): string[] {
    const keywordLower = keyword.toLowerCase()
    const terms: string[] = []
    
    // Add common patterns
    terms.push(`${keywordLower} tool`, `${keywordLower} software`, `${keywordLower} platform`)
    terms.push(`best ${keywordLower}`, `${keywordLower} solution`, `${keywordLower} service`)
    terms.push(`${keywordLower} features`, `${keywordLower} benefits`, `${keywordLower} use cases`)
    terms.push(`how to use ${keywordLower}`, `${keywordLower} tutorial`, `${keywordLower} guide`)
    
    // Add related concepts
    if (keywordLower.includes('ai')) {
      terms.push('artificial intelligence', 'machine learning', 'automation', 'technology')
    }
    if (keywordLower.includes('seo')) {
      terms.push('search engine', 'optimization', 'ranking', 'visibility', 'traffic')
    }
    if (keywordLower.includes('content')) {
      terms.push('writing', 'creation', 'publishing', 'marketing', 'strategy')
    }
    
    return terms
  }
  
  /**
   * Generate LSI keywords
   */
  private static generateLSIKeywords(keyword: string): string[] {
    const keywordLower = keyword.toLowerCase()
    const lsi: string[] = []
    
    // Context-aware LSI generation
    lsi.push('technology', 'solution', 'platform', 'system', 'service')
    lsi.push('features', 'capabilities', 'functionality', 'performance', 'efficiency')
    lsi.push('users', 'businesses', 'professionals', 'teams', 'organizations')
    lsi.push('benefits', 'advantages', 'value', 'results', 'outcomes')
    lsi.push('implementation', 'integration', 'deployment', 'setup', 'configuration')
    
    return lsi
  }
  
  /**
   * Extract entities from content
   */
  private static extractEntities(content: string, keyword: string): string[] {
    const entities: string[] = []
    
    // Extract capitalized words (potential entities)
    const capitalizedWords = content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || []
    
    // Filter and deduplicate
    const uniqueEntities = Array.from(new Set(capitalizedWords))
    entities.push(...uniqueEntities.slice(0, 10))
    
    return entities
  }
  
  /**
   * Count relationships between entities
   */
  private static countRelationships(content: string, entities: string[]): number {
    let relationships = 0
    const sentences = content.split(/[.!?]+/)
    
    sentences.forEach(sentence => {
      const entitiesInSentence = entities.filter(entity =>
        sentence.includes(entity)
      )
      
      if (entitiesInSentence.length > 1) {
        relationships += entitiesInSentence.length - 1
      }
    })
    
    return relationships
  }
  
  /**
   * Identify issues preventing 95%+ score
   */
  private static identifyIssues(
    factors: KeywordAnalysis['factors'],
    keyword: string
  ): KeywordAnalysis['issues'] {
    const issues: KeywordAnalysis['issues'] = []
    
    // Keyword density issues
    if (factors.keywordDensity.score < 75) {
      issues.push({
        severity: 'critical',
        factor: 'Keyword Density',
        message: `Current density ${factors.keywordDensity.current.toFixed(2)}% is not optimal (target: 1.5-2.5%)`,
        impact: 15,
        fix: 'Add keyword naturally throughout content to reach 2% density'
      })
    }
    
    // Title issues
    if (factors.titlePresence.score < 80) {
      issues.push({
        severity: 'critical',
        factor: 'Title Optimization',
        message: 'Keyword should appear at the beginning of the title',
        impact: 12,
        fix: 'Place keyword within first 5 words of title'
      })
    }
    
    // H1 issues
    if (factors.h1Presence.score < 85) {
      issues.push({
        severity: 'critical',
        factor: 'H1 Heading',
        message: 'H1 should contain the primary keyword',
        impact: 12,
        fix: 'Add keyword to H1 heading naturally'
      })
    }
    
    // First paragraph issues
    if (factors.firstParagraph.score < 85) {
      issues.push({
        severity: 'critical',
        factor: 'First Paragraph',
        message: 'Keyword should appear in first 100 characters',
        impact: 10,
        fix: 'Add keyword to opening sentence'
      })
    }
    
    // Semantic relevance issues
    if (factors.semanticRelevance.score < 70) {
      issues.push({
        severity: 'warning',
        factor: 'Semantic Relevance',
        message: 'Need more related terms and semantic keywords',
        impact: 15,
        fix: `Add terms like: ${factors.semanticRelevance.relatedTerms.slice(0, 5).join(', ')}`
      })
    }
    
    // LSI keyword issues
    if (factors.lsiKeywords.score < 70) {
      issues.push({
        severity: 'warning',
        factor: 'LSI Keywords',
        message: 'Missing important LSI keywords',
        impact: 12,
        fix: `Include terms: ${factors.lsiKeywords.expected.slice(0, 5).join(', ')}`
      })
    }
    
    // Content depth issues
    if (factors.contentDepth.score < 80) {
      issues.push({
        severity: 'warning',
        factor: 'Content Depth',
        message: `Content is too short (${factors.contentDepth.wordCount} words, minimum ${factors.contentDepth.minRequired})`,
        impact: 10,
        fix: 'Expand content with more detailed information and examples'
      })
    }
    
    // Natural language issues
    if (factors.naturalLanguage.stuffing) {
      issues.push({
        severity: 'critical',
        factor: 'Keyword Stuffing',
        message: 'Detected unnatural keyword usage',
        impact: 20,
        fix: 'Rewrite sentences to use keyword more naturally'
      })
    }
    
    return issues
  }
  
  /**
   * Identify optimization opportunities
   */
  private static identifyOpportunities(
    factors: KeywordAnalysis['factors'],
    currentScore: number
  ): string[] {
    const opportunities: string[] = []
    
    if (currentScore < 95) {
      opportunities.push('🎯 Target: Reach 95%+ for maximum Google visibility')
    }
    
    if (factors.h2Distribution.score < 90) {
      opportunities.push('📝 Add keyword to 30-50% of H2 headings for better structure')
    }
    
    if (factors.entityRecognition.score < 80) {
      opportunities.push('🏢 Include more brand names and entities related to your topic')
    }
    
    if (factors.keywordProximity.score < 85) {
      opportunities.push('🔗 Place related terms closer to primary keyword for better context')
    }
    
    if (factors.contentDepth.wordCount < 2500) {
      opportunities.push('📚 Expand to 2500+ words for comprehensive coverage')
    }
    
    return opportunities
  }
  
  /**
   * Generate optimization suggestions
   */
  static generateOptimizationSuggestions(analysis: KeywordAnalysis): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = []
    
    // Sort issues by impact
    const sortedIssues = [...analysis.issues].sort((a, b) => b.impact - a.impact)
    
    sortedIssues.forEach(issue => {
      suggestions.push({
        priority: issue.severity === 'critical' ? 'high' : issue.severity === 'warning' ? 'medium' : 'low',
        category: issue.factor,
        action: issue.message,
        expectedImpact: issue.impact,
        implementation: issue.fix
      })
    })
    
    return suggestions
  }
}