/**
 * Featured Snippet Optimizer
 * Optimizes content for Google Featured Snippets (Position Zero)
 * Featured snippets generate 8-12% additional organic traffic
 * 
 * This system identifies the best snippet type for each query and
 * formats content to maximize the chance of being selected for position 0
 */

export type SnippetType = 'definition' | 'list' | 'table' | 'paragraph' | 'comparison' | 'steps'

export interface SnippetOpportunity {
  type: SnippetType
  keyword: string
  recommendedLength: number
  placementAdvice: string
  exampleFormat: string
}

export interface OptimizedSnippet {
  type: SnippetType
  content: string
  markup: string
  keyword: string
  quality: number
  reasoning: string
}

export class FeaturedSnippetOptimizer {
  /**
   * Determine the best snippet type for a keyword
   */
  static determineSnippetType(keyword: string): SnippetType {
    const lower = keyword.toLowerCase()

    // Definition queries
    if (lower.includes('what is') || lower.includes('definition') || lower.includes('explain')) {
      return 'definition'
    }

    // List queries
    if (lower.includes('best') || lower.includes('top') || lower.includes('list') || lower.includes('types of')) {
      return 'list'
    }

    // Table queries
    if (lower.includes('vs') || lower.includes('compare') || lower.includes('comparison')) {
      return 'table'
    }

    // How-to queries
    if (lower.includes('how to') || lower.includes('steps') || lower.includes('guide')) {
      return 'steps'
    }

    // Comparison queries
    if (lower.includes('difference between') || lower.includes('unlike') || lower.includes('similar')) {
      return 'comparison'
    }

    // Default to paragraph for general queries
    return 'paragraph'
  }

  /**
   * Create optimized definition snippet
   */
  static createDefinitionSnippet(term: string, definition: string, context: string): OptimizedSnippet {
    const markup = `## What is ${term}?\n\n${definition}\n\n${context}`

    return {
      type: 'definition',
      content: definition,
      markup,
      keyword: term,
      quality: 95,
      reasoning: 'Definition snippets appear for "what is" queries - most reliable type'
    }
  }

  /**
   * Create optimized list snippet
   */
  static createListSnippet(query: string, items: string[]): OptimizedSnippet {
    // Limit to 6-8 items for optimal snippet display
    const optimizedItems = items.slice(0, 8)
    
    let markup = `## ${query}\n\n`
    optimizedItems.forEach((item, index) => {
      markup += `${index + 1}. ${item}\n`
    })

    const content = optimizedItems.join('\n')

    return {
      type: 'list',
      content,
      markup,
      keyword: query,
      quality: 90,
      reasoning: 'List snippets ideal for "best", "top", "types of" queries - highly visible'
    }
  }

  /**
   * Create optimized table snippet
   */
  static createTableSnippet(
    query: string,
    headers: string[],
    rows: string[][]
  ): OptimizedSnippet {
    // Limit table to 4-5 rows for snippet display
    const optimizedRows = rows.slice(0, 5)

    let markup = `| ${headers.join(' | ')} |\n`
    markup += `|${headers.map(() => ' --- ').join('|')}|\n`
    optimizedRows.forEach(row => {
      markup += `| ${row.join(' | ')} |\n`
    })

    return {
      type: 'table',
      content: markup,
      markup: `## ${query}\n\n${markup}`,
      keyword: query,
      quality: 85,
      reasoning: 'Table snippets perfect for comparisons and structured data'
    }
  }

  /**
   * Create optimized step-by-step snippet
   */
  static createStepsSnippet(query: string, steps: string[]): OptimizedSnippet {
    // Limit to 5-7 steps
    const optimizedSteps = steps.slice(0, 7)

    let markup = `## ${query}\n\n`
    optimizedSteps.forEach((step, index) => {
      markup += `**Step ${index + 1}**: ${step}\n\n`
    })

    const content = optimizedSteps.join('\n')

    return {
      type: 'steps',
      content,
      markup,
      keyword: query,
      quality: 88,
      reasoning: 'How-to snippets have high click-through rates and featured snippet likelihood'
    }
  }

  /**
   * Create optimized paragraph snippet
   */
  static createParagraphSnippet(query: string, answer: string): OptimizedSnippet {
    // Keep paragraph to 40-60 words for snippet display
    const words = answer.split(/\s+/)
    const optimizedAnswer = words.slice(0, 60).join(' ')

    const markup = `## ${query}\n\n${optimizedAnswer}`

    return {
      type: 'paragraph',
      content: optimizedAnswer,
      markup,
      keyword: query,
      quality: 82,
      reasoning: 'Paragraph snippets good for definitional and general queries'
    }
  }

  /**
   * Generate featured snippet opportunities from content
   */
  static identifySnippetOpportunities(content: string, keywords: string[]): SnippetOpportunity[] {
    const opportunities: SnippetOpportunity[] = []

    keywords.forEach(keyword => {
      const type = this.determineSnippetType(keyword)
      
      let recommendation: SnippetOpportunity = {
        type,
        keyword,
        recommendedLength: type === 'paragraph' ? 50 : 100,
        placementAdvice: '',
        exampleFormat: ''
      }

      switch (type) {
        case 'definition':
          recommendation.placementAdvice = 'Place within first 200 words of content'
          recommendation.exampleFormat = '## What is [keyword]?\n[40-60 word clear definition]'
          recommendation.recommendedLength = 50
          break
        case 'list':
          recommendation.placementAdvice = 'Place in second section with clear heading'
          recommendation.exampleFormat = '## [Keyword]\n1. Item\n2. Item\n3. Item'
          recommendation.recommendedLength = 150
          break
        case 'table':
          recommendation.placementAdvice = 'Place after comparison introduction'
          recommendation.exampleFormat = '| Feature | Option A | Option B |\n|---|---|---|'
          recommendation.recommendedLength = 200
          break
        case 'steps':
          recommendation.placementAdvice = 'Place in how-to section with numbered steps'
          recommendation.exampleFormat = '**Step 1**: ...\n**Step 2**: ...'
          recommendation.recommendedLength = 150
          break
        case 'comparison':
          recommendation.placementAdvice = 'Place in comparison section'
          recommendation.exampleFormat = 'A is [characteristic], while B is [characteristic]'
          recommendation.recommendedLength = 100
          break
      }

      opportunities.push(recommendation)
    })

    return opportunities.slice(0, 5) // Return top 5 opportunities
  }

  /**
   * Optimize section for featured snippet
   */
  static optimizeForSnippet(
    section: string,
    heading: string,
    keyword: string
  ): string {
    const type = this.determineSnippetType(keyword)
    
    // Ensure proper heading
    let optimized = `## ${heading}\n\n`

    // Add snippet-specific formatting
    switch (type) {
      case 'list':
        // Convert to numbered list if not already
        if (!section.includes('\n1.') && !section.includes('\n-')) {
          const sentences = section.split(/[.!?]+/).filter(s => s.trim())
          optimized += sentences.slice(0, 8).map((s, i) => `${i + 1}. ${s.trim()}`).join('\n')
        } else {
          optimized += section
        }
        break

      case 'steps':
        // Convert to numbered steps
        const stepSentences = section.split(/[.!?]+/).filter(s => s.trim())
        optimized += stepSentences.slice(0, 7).map((s, i) => `**Step ${i + 1}**: ${s.trim()}`).join('\n\n')
        break

      case 'definition':
        // Keep first sentence as definition
        const firstSentence = section.split(/[.!?]+/)[0]
        optimized += firstSentence
        break

      default:
        // Limit paragraph to 60 words
        const words = section.split(/\s+/)
        optimized += words.slice(0, 60).join(' ')
    }

    return optimized
  }

  /**
   * Rate snippet optimization quality
   */
  static rateSnippetQuality(
    content: string,
    type: SnippetType,
    keyword: string
  ): {
    quality: number
    issues: string[]
    suggestions: string[]
  } {
    let quality = 100
    const issues: string[] = []
    const suggestions: string[] = []

    // Check word count
    const wordCount = content.split(/\s+/).length
    if (type === 'paragraph' && wordCount > 70) {
      quality -= 10
      issues.push('Paragraph snippet too long (max 60 words recommended)')
      suggestions.push('Trim content to 50-60 words for better snippet inclusion')
    }

    if (type === 'list' && content.split('\n').length > 10) {
      quality -= 5
      issues.push('List has too many items')
      suggestions.push('Limit to 6-8 items for optimal display')
    }

    // Check for keyword inclusion
    if (!content.toLowerCase().includes(keyword.toLowerCase())) {
      quality -= 15
      issues.push('Keyword not included in snippet content')
      suggestions.push(`Include the keyword "${keyword}" in the snippet`)
    }

    // Check for clarity
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    if (sentences.length === 0) {
      quality -= 20
      issues.push('Content lacks complete sentences')
      suggestions.push('Ensure content is written in complete, clear sentences')
    }

    // Check for formatting
    if (type === 'list' && !content.includes('\n')) {
      quality -= 10
      issues.push('List items not properly formatted')
      suggestions.push('Format as proper list with line breaks')
    }

    // Boost quality if keyword-rich
    if ((content.match(new RegExp(keyword, 'gi')) || []).length >= 2) {
      quality = Math.min(100, quality + 5)
      suggestions.push('Good keyword repetition in snippet')
    }

    return {
      quality: Math.max(40, quality),
      issues,
      suggestions
    }
  }

  /**
   * Generate featured snippet schema markup
   */
  static generateSnippetSchema(
    snippet: OptimizedSnippet,
    url: string,
    position: number = 1
  ): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': position,
          'name': snippet.keyword,
          'item': url
        }
      ],
      'mainEntity': {
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': snippet.keyword,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': snippet.content
            }
          }
        ]
      }
    }
  }

  /**
   * Generate FAQ schema for featured snippets
   */
  static generateFAQSchema(questions: string[], answers: string[]): object {
    const faqs = questions.map((q, i) => ({
      '@type': 'Question',
      'name': q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': answers[i] || 'See article for detailed answer'
      }
    }))

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.slice(0, 10) // Limit to 10 FAQs
    }
  }

  /**
   * Inject featured snippet optimization into content
   */
  static injectSnippetOptimizations(
    content: string,
    keywords: string[]
  ): {
    optimizedContent: string
    snippets: OptimizedSnippet[]
    schema: object
  } {
    const snippets: OptimizedSnippet[] = []
    let optimizedContent = content

    // Identify top 3 snippet opportunities
    const opportunities = this.identifySnippetOpportunities(content, keywords).slice(0, 3)

    opportunities.forEach(opp => {
      const sampleContent = `Example content for ${opp.keyword}`
      const snippet = this.createDefinitionSnippet(opp.keyword, sampleContent, '')
      snippets.push(snippet)

      // Insert optimized sections
      optimizedContent += `\n\n${snippet.markup}`
    })

    // Generate FAQ schema
    const questions = keywords.slice(0, 5).map(k => `What is ${k}?`)
    const answers = keywords.slice(0, 5).map(k => `${k} is a key concept in this domain.`)
    const schema = this.generateFAQSchema(questions, answers)

    return {
      optimizedContent,
      snippets,
      schema
    }
  }

  /**
   * Analyze content for snippet readiness
   */
  static analyzeSnippetReadiness(content: string, keywords: string[]): {
    readiness: number
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
  } {
    let readiness = 70
    const strengths: string[] = []
    const weaknesses: string[] = []
    const recommendations: string[] = []

    // Check structure
    const hasHeadings = content.includes('##') || content.includes('###')
    if (hasHeadings) {
      strengths.push('Good content structure with headings')
    } else {
      weaknesses.push('Missing clear section headings')
      recommendations.push('Add ## headings for better section organization')
      readiness -= 10
    }

    // Check for lists
    const hasLists = content.includes('\n-') || content.includes('\n1.')
    if (hasLists) {
      strengths.push('Includes formatted lists')
    } else {
      weaknesses.push('No formatted lists detected')
      recommendations.push('Add 1-2 bulleted or numbered lists')
      readiness -= 5
    }

    // Check keyword distribution
    const keywordMatches = keywords.filter(kw => 
      content.toLowerCase().includes(kw.toLowerCase())
    ).length
    if (keywordMatches >= keywords.length * 0.7) {
      strengths.push('Good keyword coverage')
    } else {
      weaknesses.push('Keywords not well distributed')
      recommendations.push('Include keywords in headings and early sections')
      readiness -= 10
    }

    // Check content length
    const wordCount = content.split(/\s+/).length
    if (wordCount >= 1000) {
      strengths.push('Sufficient content length')
    } else if (wordCount >= 500) {
      weaknesses.push('Content could be longer')
      recommendations.push('Expand to 1000+ words for better coverage')
      readiness -= 5
    } else {
      weaknesses.push('Content too short for featured snippet')
      recommendations.push('Expand to at least 500 words')
      readiness -= 15
    }

    // Check for tables/comparisons
    if (content.includes('|') && content.includes('---')) {
      strengths.push('Includes formatted table data')
    } else if (keywords.some(k => k.toLowerCase().includes('vs'))) {
      weaknesses.push('Comparison queries need tables')
      recommendations.push('Add comparison table for comparison queries')
      readiness -= 10
    }

    return {
      readiness: Math.max(30, Math.min(100, readiness)),
      strengths,
      weaknesses,
      recommendations
    }
  }
}

export default FeaturedSnippetOptimizer