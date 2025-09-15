import { BlogPost } from './blog-data'

export interface EnhancedSEOAnalysis {
  score: number
  maxScore: number
  grade: string
  status: 'excellent' | 'good' | 'needs-improvement' | 'poor'
  details: SEODetail[]
  suggestions: string[]
  optimizedData: Partial<BlogPost>
  breakdown: {
    title: { score: number; max: number; status: string }
    content: { score: number; max: number; status: string }
    keywords: { score: number; max: number; status: string }
    structure: { score: number; max: number; status: string }
    readability: { score: number; max: number; status: string }
    meta: { score: number; max: number; status: string }
    images: { score: number; max: number; status: string }
    performance: { score: number; max: number; status: string }
  }
  improvements: {
    priority: 'high' | 'medium' | 'low'
    category: string
    issue: string
    solution: string
    impact: number
  }[]
}

export interface SEODetail {
  category: string
  message: string
  status: 'good' | 'warning' | 'error'
  score: number
  maxScore: number
  suggestion?: string
}

export class EnhancedSEOEngine {
  
  static analyzeContent(
    title: string, 
    content: string, 
    focusKeyword: string,
    category: string = 'ai-tools',
    image?: string
  ): EnhancedSEOAnalysis {
    
    const analysis: EnhancedSEOAnalysis = {
      score: 0,
      maxScore: 100,
      grade: 'F',
      status: 'poor',
      details: [],
      suggestions: [],
      optimizedData: {},
      breakdown: {
        title: { score: 0, max: 15, status: 'poor' },
        content: { score: 0, max: 20, status: 'poor' },
        keywords: { score: 0, max: 15, status: 'poor' },
        structure: { score: 0, max: 15, status: 'poor' },
        readability: { score: 0, max: 10, status: 'poor' },
        meta: { score: 0, max: 10, status: 'poor' },
        images: { score: 0, max: 10, status: 'poor' },
        performance: { score: 0, max: 5, status: 'poor' }
      },
      improvements: []
    }

    // Comprehensive analysis
    this.analyzeTitle(title, focusKeyword, analysis)
    this.analyzeContentDetails(content, focusKeyword, analysis)
    this.analyzeKeywords(title, content, focusKeyword, analysis)
    this.analyzeStructure(content, analysis)
    this.analyzeReadability(content, analysis)
    this.analyzeMeta(title, content, focusKeyword, analysis)
    this.analyzeImages(image, focusKeyword, title, analysis)
    this.analyzePerformance(content, analysis)

    // Calculate total score
    analysis.score = Object.values(analysis.breakdown).reduce((sum, section) => sum + section.score, 0)
    
    // Determine grade and status
    analysis.grade = this.calculateGrade(analysis.score)
    analysis.status = this.determineStatus(analysis.score)
    
    // Update section statuses
    Object.keys(analysis.breakdown).forEach(key => {
      const section = analysis.breakdown[key as keyof typeof analysis.breakdown]
      const percentage = (section.score / section.max) * 100
      section.status = percentage >= 90 ? 'excellent' : percentage >= 70 ? 'good' : percentage >= 50 ? 'needs-improvement' : 'poor'
    })

    // Generate optimized data
    analysis.optimizedData = this.generateOptimizedData(title, content, focusKeyword, category, analysis)

    return analysis
  }

  private static analyzeTitle(title: string, focusKeyword: string, analysis: EnhancedSEOAnalysis): void {
    const titleLength = title.length
    const hasKeyword = title.toLowerCase().includes(focusKeyword.toLowerCase())
    const keywordAtStart = title.toLowerCase().startsWith(focusKeyword.toLowerCase())
    const hasNumbers = /\d/.test(title)
    const hasPowerWords = /\b(best|ultimate|complete|guide|top|essential|proven|expert|advanced|comprehensive|effective|powerful|amazing|incredible|outstanding|revolutionary|innovative|cutting-edge|state-of-the-art)\b/i.test(title)
    
    let titleScore = 0
    
    // Length optimization (4 points)
    if (titleLength >= 30 && titleLength <= 60) {
      titleScore += 4
      analysis.details.push({
        category: 'Title Length',
        message: `Perfect title length: ${titleLength} characters`,
        status: 'good',
        score: 4,
        maxScore: 4
      })
    } else if (titleLength >= 25 && titleLength <= 70) {
      titleScore += 2
      analysis.details.push({
        category: 'Title Length',
        message: `Good title length: ${titleLength} characters`,
        status: 'warning',
        score: 2,
        maxScore: 4,
        suggestion: 'Optimize to 30-60 characters for best results'
      })
    } else {
      analysis.details.push({
        category: 'Title Length',
        message: `Poor title length: ${titleLength} characters`,
        status: 'error',
        score: 0,
        maxScore: 4,
        suggestion: 'Adjust title to 30-60 characters'
      })
      analysis.improvements.push({
        priority: 'high',
        category: 'Title',
        issue: 'Title length not optimized',
        solution: 'Adjust title to 30-60 characters',
        impact: 4
      })
    }
    
    // Keyword presence (4 points)
    if (hasKeyword) {
      if (keywordAtStart) {
        titleScore += 4
        analysis.details.push({
          category: 'Title Keyword',
          message: 'Focus keyword at beginning of title',
          status: 'good',
          score: 4,
          maxScore: 4
        })
      } else {
        titleScore += 2
        analysis.details.push({
          category: 'Title Keyword',
          message: 'Focus keyword present in title',
          status: 'warning',
          score: 2,
          maxScore: 4,
          suggestion: 'Move focus keyword to the beginning'
        })
      }
    } else {
      analysis.details.push({
        category: 'Title Keyword',
        message: 'Focus keyword missing from title',
        status: 'error',
        score: 0,
        maxScore: 4,
        suggestion: 'Include focus keyword in title'
      })
      analysis.improvements.push({
        priority: 'high',
        category: 'Title',
        issue: 'Focus keyword not in title',
        solution: 'Include focus keyword at the beginning of title',
        impact: 4
      })
    }
    
    // Numbers in title (2 points)
    if (hasNumbers) {
      titleScore += 2
      analysis.details.push({
        category: 'Title Numbers',
        message: 'Title contains numbers for better CTR',
        status: 'good',
        score: 2,
        maxScore: 2
      })
    } else {
      analysis.details.push({
        category: 'Title Numbers',
        message: 'No numbers in title',
        status: 'warning',
        score: 0,
        maxScore: 2,
        suggestion: 'Add year or numbers to improve click-through rate'
      })
    }
    
    // Power words (3 points)
    if (hasPowerWords) {
      titleScore += 3
      analysis.details.push({
        category: 'Title Power Words',
        message: 'Title contains engaging power words',
        status: 'good',
        score: 3,
        maxScore: 3
      })
    } else {
      analysis.details.push({
        category: 'Title Power Words',
        message: 'No power words in title',
        status: 'warning',
        score: 0,
        maxScore: 3,
        suggestion: 'Add power words like "Ultimate", "Best", "Complete" for better engagement'
      })
    }
    
    // Readability (2 points)
    const wordCount = title.split(' ').length
    if (wordCount >= 4 && wordCount <= 12) {
      titleScore += 2
      analysis.details.push({
        category: 'Title Readability',
        message: `Good word count: ${wordCount} words`,
        status: 'good',
        score: 2,
        maxScore: 2
      })
    } else {
      analysis.details.push({
        category: 'Title Readability',
        message: `Suboptimal word count: ${wordCount} words`,
        status: 'warning',
        score: 1,
        maxScore: 2,
        suggestion: 'Aim for 4-12 words in title'
      })
      titleScore += 1
    }
    
    analysis.breakdown.title.score = titleScore
  }

  private static analyzeContentDetails(content: string, focusKeyword: string, analysis: EnhancedSEOAnalysis): void {
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const hasIntroKeyword = content.substring(0, 200).toLowerCase().includes(focusKeyword.toLowerCase())
    const hasConclusionKeyword = content.substring(content.length - 200).toLowerCase().includes(focusKeyword.toLowerCase())
    
    let contentScore = 0
    
    // Word count (6 points)
    if (wordCount >= 1500) {
      contentScore += 6
      analysis.details.push({
        category: 'Content Length',
        message: `Excellent word count: ${wordCount} words`,
        status: 'good',
        score: 6,
        maxScore: 6
      })
    } else if (wordCount >= 1000) {
      contentScore += 4
      analysis.details.push({
        category: 'Content Length',
        message: `Good word count: ${wordCount} words`,
        status: 'warning',
        score: 4,
        maxScore: 6,
        suggestion: 'Expand to 1500+ words for better SEO'
      })
    } else if (wordCount >= 500) {
      contentScore += 2
      analysis.details.push({
        category: 'Content Length',
        message: `Minimum word count: ${wordCount} words`,
        status: 'warning',
        score: 2,
        maxScore: 6,
        suggestion: 'Expand content significantly for better rankings'
      })
    } else {
      analysis.details.push({
        category: 'Content Length',
        message: `Too short: ${wordCount} words`,
        status: 'error',
        score: 0,
        maxScore: 6,
        suggestion: 'Write at least 1500 words for competitive rankings'
      })
      analysis.improvements.push({
        priority: 'high',
        category: 'Content',
        issue: 'Content too short',
        solution: 'Expand content to at least 1500 words',
        impact: 6
      })
    }
    
    // Keyword in introduction (3 points)
    if (hasIntroKeyword) {
      contentScore += 3
      analysis.details.push({
        category: 'Introduction Keyword',
        message: 'Focus keyword in first 200 characters',
        status: 'good',
        score: 3,
        maxScore: 3
      })
    } else {
      analysis.details.push({
        category: 'Introduction Keyword',
        message: 'Focus keyword missing from introduction',
        status: 'error',
        score: 0,
        maxScore: 3,
        suggestion: 'Include focus keyword in the first paragraph'
      })
      analysis.improvements.push({
        priority: 'high',
        category: 'Content',
        issue: 'No focus keyword in introduction',
        solution: 'Add focus keyword to first paragraph',
        impact: 3
      })
    }
    
    // Keyword in conclusion (3 points)
    if (hasConclusionKeyword) {
      contentScore += 3
      analysis.details.push({
        category: 'Conclusion Keyword',
        message: 'Focus keyword in conclusion',
        status: 'good',
        score: 3,
        maxScore: 3
      })
    } else {
      analysis.details.push({
        category: 'Conclusion Keyword',
        message: 'Focus keyword missing from conclusion',
        status: 'warning',
        score: 0,
        maxScore: 3,
        suggestion: 'Include focus keyword in conclusion'
      })
    }
    
    // Paragraph structure (4 points)
    const avgParagraphLength = paragraphs.reduce((sum, p) => sum + p.split(' ').length, 0) / paragraphs.length
    if (paragraphs.length >= 5 && avgParagraphLength <= 150) {
      contentScore += 4
      analysis.details.push({
        category: 'Paragraph Structure',
        message: `Good paragraph structure: ${paragraphs.length} paragraphs`,
        status: 'good',
        score: 4,
        maxScore: 4
      })
    } else if (paragraphs.length >= 3) {
      contentScore += 2
      analysis.details.push({
        category: 'Paragraph Structure',
        message: `Adequate paragraphs: ${paragraphs.length}`,
        status: 'warning',
        score: 2,
        maxScore: 4,
        suggestion: 'Break content into more paragraphs for better readability'
      })
    } else {
      analysis.details.push({
        category: 'Paragraph Structure',
        message: `Poor paragraph structure: ${paragraphs.length} paragraphs`,
        status: 'error',
        score: 0,
        maxScore: 4,
        suggestion: 'Break content into at least 5 well-structured paragraphs'
      })
    }
    
    // Sentence variety (4 points)
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length
    if (avgSentenceLength >= 10 && avgSentenceLength <= 20) {
      contentScore += 4
      analysis.details.push({
        category: 'Sentence Structure',
        message: `Optimal sentence length: ${Math.round(avgSentenceLength)} words average`,
        status: 'good',
        score: 4,
        maxScore: 4
      })
    } else {
      contentScore += 2
      analysis.details.push({
        category: 'Sentence Structure',
        message: `Sentence length needs improvement: ${Math.round(avgSentenceLength)} words average`,
        status: 'warning',
        score: 2,
        maxScore: 4,
        suggestion: 'Aim for 10-20 words per sentence on average'
      })
    }
    
    analysis.breakdown.content.score = contentScore
  }

  private static analyzeKeywords(title: string, content: string, focusKeyword: string, analysis: EnhancedSEOAnalysis): void {
    const fullText = (title + ' ' + content).toLowerCase()
    const words = fullText.split(/\s+/)
    const keywordMatches = (fullText.match(new RegExp(focusKeyword.toLowerCase(), 'g')) || []).length
    const keywordDensity = (keywordMatches / words.length) * 100
    
    // Generate related keywords
    const relatedKeywords = this.generateRelatedKeywords(focusKeyword)
    const relatedKeywordCount = relatedKeywords.filter(keyword => 
      fullText.includes(keyword.toLowerCase())
    ).length
    
    let keywordScore = 0
    
    // Keyword density (8 points)
    if (keywordDensity >= 1.0 && keywordDensity <= 3.0) {
      keywordScore += 8
      analysis.details.push({
        category: 'Keyword Density',
        message: `Perfect keyword density: ${keywordDensity.toFixed(2)}%`,
        status: 'good',
        score: 8,
        maxScore: 8
      })
    } else if (keywordDensity >= 0.5 && keywordDensity <= 4.0) {
      keywordScore += 5
      analysis.details.push({
        category: 'Keyword Density',
        message: `Good keyword density: ${keywordDensity.toFixed(2)}%`,
        status: 'warning',
        score: 5,
        maxScore: 8,
        suggestion: 'Optimize to 1-3% for best results'
      })
    } else {
      analysis.details.push({
        category: 'Keyword Density',
        message: `Poor keyword density: ${keywordDensity.toFixed(2)}%`,
        status: 'error',
        score: 0,
        maxScore: 8,
        suggestion: keywordDensity < 0.5 ? 'Increase keyword usage' : 'Reduce keyword stuffing'
      })
      analysis.improvements.push({
        priority: 'high',
        category: 'Keywords',
        issue: 'Keyword density not optimized',
        solution: 'Adjust keyword usage to 1-3% density',
        impact: 8
      })
    }
    
    // Related keywords (4 points)
    if (relatedKeywordCount >= 5) {
      keywordScore += 4
      analysis.details.push({
        category: 'Related Keywords',
        message: `Excellent semantic coverage: ${relatedKeywordCount} related terms`,
        status: 'good',
        score: 4,
        maxScore: 4
      })
    } else if (relatedKeywordCount >= 3) {
      keywordScore += 2
      analysis.details.push({
        category: 'Related Keywords',
        message: `Good semantic coverage: ${relatedKeywordCount} related terms`,
        status: 'warning',
        score: 2,
        maxScore: 4,
        suggestion: 'Include more related keywords for better semantic SEO'
      })
    } else {
      analysis.details.push({
        category: 'Related Keywords',
        message: `Poor semantic coverage: ${relatedKeywordCount} related terms`,
        status: 'error',
        score: 0,
        maxScore: 4,
        suggestion: 'Include more related keywords and synonyms'
      })
    }
    
    // Long-tail variations (3 points)
    const longTailVariations = this.generateLongTailVariations(focusKeyword)
    const longTailCount = longTailVariations.filter(variation => 
      fullText.includes(variation.toLowerCase())
    ).length
    
    if (longTailCount >= 3) {
      keywordScore += 3
      analysis.details.push({
        category: 'Long-tail Keywords',
        message: `Great long-tail coverage: ${longTailCount} variations`,
        status: 'good',
        score: 3,
        maxScore: 3
      })
    } else if (longTailCount >= 1) {
      keywordScore += 1
      analysis.details.push({
        category: 'Long-tail Keywords',
        message: `Some long-tail coverage: ${longTailCount} variations`,
        status: 'warning',
        score: 1,
        maxScore: 3,
        suggestion: 'Include more long-tail keyword variations'
      })
    } else {
      analysis.details.push({
        category: 'Long-tail Keywords',
        message: 'No long-tail keyword variations found',
        status: 'error',
        score: 0,
        maxScore: 3,
        suggestion: 'Include long-tail keyword variations'
      })
    }
    
    analysis.breakdown.keywords.score = keywordScore
  }

  private static analyzeStructure(content: string, analysis: EnhancedSEOAnalysis): void {
    const hasH1 = /^#\s/.test(content) || /<h1>/i.test(content)
    const hasH2 = /^##\s/m.test(content) || /<h2>/i.test(content)
    const hasH3 = /^###\s/m.test(content) || /<h3>/i.test(content)
    const hasList = /^[-*+]\s/m.test(content) || /<[uo]l>/i.test(content)
    const hasTable = /\|.*\|/m.test(content) || /<table>/i.test(content)
    const hasFAQ = /faq|frequently asked|questions?/i.test(content)
    
    let structureScore = 0
    
    // H1 heading (3 points)
    if (hasH1) {
      structureScore += 3
      analysis.details.push({
        category: 'H1 Heading',
        message: 'H1 heading present',
        status: 'good',
        score: 3,
        maxScore: 3
      })
    } else {
      analysis.details.push({
        category: 'H1 Heading',
        message: 'Missing H1 heading',
        status: 'error',
        score: 0,
        maxScore: 3,
        suggestion: 'Add H1 heading with focus keyword'
      })
      analysis.improvements.push({
        priority: 'high',
        category: 'Structure',
        issue: 'Missing H1 heading',
        solution: 'Add H1 heading with focus keyword',
        impact: 3
      })
    }
    
    // H2 headings (4 points)
    if (hasH2) {
      const h2Count = (content.match(/^##\s/gm) || []).length + (content.match(/<h2>/gi) || []).length
      if (h2Count >= 3) {
        structureScore += 4
        analysis.details.push({
          category: 'H2 Headings',
          message: `Excellent H2 structure: ${h2Count} headings`,
          status: 'good',
          score: 4,
          maxScore: 4
        })
      } else {
        structureScore += 2
        analysis.details.push({
          category: 'H2 Headings',
          message: `Some H2 headings: ${h2Count}`,
          status: 'warning',
          score: 2,
          maxScore: 4,
          suggestion: 'Add more H2 headings for better structure'
        })
      }
    } else {
      analysis.details.push({
        category: 'H2 Headings',
        message: 'No H2 headings found',
        status: 'error',
        score: 0,
        maxScore: 4,
        suggestion: 'Add H2 headings to structure content'
      })
    }
    
    // H3 headings (2 points)
    if (hasH3) {
      structureScore += 2
      analysis.details.push({
        category: 'H3 Headings',
        message: 'H3 headings present for detailed structure',
        status: 'good',
        score: 2,
        maxScore: 2
      })
    } else {
      analysis.details.push({
        category: 'H3 Headings',
        message: 'No H3 headings found',
        status: 'warning',
        score: 0,
        maxScore: 2,
        suggestion: 'Add H3 headings for detailed structure'
      })
    }
    
    // Lists (2 points)
    if (hasList) {
      structureScore += 2
      analysis.details.push({
        category: 'Lists',
        message: 'Lists present for better readability',
        status: 'good',
        score: 2,
        maxScore: 2
      })
    } else {
      analysis.details.push({
        category: 'Lists',
        message: 'No lists found',
        status: 'warning',
        score: 0,
        maxScore: 2,
        suggestion: 'Add bullet points or numbered lists'
      })
    }
    
    // Tables (2 points)
    if (hasTable) {
      structureScore += 2
      analysis.details.push({
        category: 'Tables',
        message: 'Tables present for data organization',
        status: 'good',
        score: 2,
        maxScore: 2
      })
    } else {
      analysis.details.push({
        category: 'Tables',
        message: 'No tables found',
        status: 'warning',
        score: 0,
        maxScore: 2,
        suggestion: 'Consider adding tables for data presentation'
      })
    }
    
    // FAQ section (2 points)
    if (hasFAQ) {
      structureScore += 2
      analysis.details.push({
        category: 'FAQ Section',
        message: 'FAQ section present',
        status: 'good',
        score: 2,
        maxScore: 2
      })
    } else {
      analysis.details.push({
        category: 'FAQ Section',
        message: 'No FAQ section found',
        status: 'warning',
        score: 0,
        maxScore: 2,
        suggestion: 'Add FAQ section for better user experience'
      })
    }
    
    analysis.breakdown.structure.score = structureScore
  }

  private static analyzeReadability(content: string, analysis: EnhancedSEOAnalysis): void {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = content.split(/\s+/).filter(w => w.length > 0)
    const avgWordsPerSentence = words.length / sentences.length
    const avgSyllablesPerWord = words.reduce((sum, word) => sum + this.countSyllables(word), 0) / words.length
    
    // Flesch Reading Ease Score
    const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
    
    let readabilityScore = 0
    
    // Flesch score analysis (6 points)
    if (fleschScore >= 60) {
      readabilityScore += 6
      analysis.details.push({
        category: 'Reading Ease',
        message: `Excellent readability: ${Math.round(fleschScore)} Flesch score`,
        status: 'good',
        score: 6,
        maxScore: 6
      })
    } else if (fleschScore >= 30) {
      readabilityScore += 4
      analysis.details.push({
        category: 'Reading Ease',
        message: `Good readability: ${Math.round(fleschScore)} Flesch score`,
        status: 'warning',
        score: 4,
        maxScore: 6,
        suggestion: 'Simplify sentences for better readability'
      })
    } else {
      analysis.details.push({
        category: 'Reading Ease',
        message: `Poor readability: ${Math.round(fleschScore)} Flesch score`,
        status: 'error',
        score: 0,
        maxScore: 6,
        suggestion: 'Significantly simplify language and sentence structure'
      })
    }
    
    // Transition words (2 points)
    const transitionWords = ['however', 'therefore', 'furthermore', 'moreover', 'additionally', 'consequently', 'meanwhile', 'nevertheless', 'thus', 'hence', 'accordingly', 'similarly', 'likewise', 'in contrast', 'on the other hand', 'for example', 'for instance', 'in conclusion', 'finally', 'first', 'second', 'third', 'next', 'then', 'also', 'besides', 'indeed', 'certainly', 'obviously', 'clearly']
    const transitionCount = transitionWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length
    
    if (transitionCount >= 5) {
      readabilityScore += 2
      analysis.details.push({
        category: 'Transition Words',
        message: `Good flow: ${transitionCount} transition words`,
        status: 'good',
        score: 2,
        maxScore: 2
      })
    } else {
      analysis.details.push({
        category: 'Transition Words',
        message: `Limited flow: ${transitionCount} transition words`,
        status: 'warning',
        score: 0,
        maxScore: 2,
        suggestion: 'Add more transition words for better flow'
      })
    }
    
    // Active voice (2 points)
    const passiveIndicators = ['was', 'were', 'been', 'being', 'is', 'are', 'am']
    const passiveCount = passiveIndicators.reduce((count, indicator) => {
      return count + (content.toLowerCase().match(new RegExp(`\\b${indicator}\\b`, 'g')) || []).length
    }, 0)
    const passiveRatio = passiveCount / sentences.length
    
    if (passiveRatio < 0.2) {
      readabilityScore += 2
      analysis.details.push({
        category: 'Active Voice',
        message: 'Good use of active voice',
        status: 'good',
        score: 2,
        maxScore: 2
      })
    } else {
      analysis.details.push({
        category: 'Active Voice',
        message: 'Too much passive voice',
        status: 'warning',
        score: 0,
        maxScore: 2,
        suggestion: 'Use more active voice for better engagement'
      })
    }
    
    analysis.breakdown.readability.score = readabilityScore
  }

  private static analyzeMeta(title: string, content: string, focusKeyword: string, analysis: EnhancedSEOAnalysis): void {
    // Generate optimal meta description
    const excerpt = content.substring(0, 300).replace(/[#*]/g, '').trim()
    const metaDescription = this.generateMetaDescription(excerpt, focusKeyword)
    
    let metaScore = 0
    
    // Meta description length (4 points)
    if (metaDescription.length >= 120 && metaDescription.length <= 160) {
      metaScore += 4
      analysis.details.push({
        category: 'Meta Description',
        message: `Perfect meta description length: ${metaDescription.length} characters`,
        status: 'good',
        score: 4,
        maxScore: 4
      })
    } else {
      metaScore += 2
      analysis.details.push({
        category: 'Meta Description',
        message: `Meta description needs optimization: ${metaDescription.length} characters`,
        status: 'warning',
        score: 2,
        maxScore: 4,
        suggestion: 'Optimize meta description to 120-160 characters'
      })
    }
    
    // Meta keyword presence (3 points)
    if (metaDescription.toLowerCase().includes(focusKeyword.toLowerCase())) {
      metaScore += 3
      analysis.details.push({
        category: 'Meta Keywords',
        message: 'Focus keyword in meta description',
        status: 'good',
        score: 3,
        maxScore: 3
      })
    } else {
      analysis.details.push({
        category: 'Meta Keywords',
        message: 'Focus keyword missing from meta description',
        status: 'error',
        score: 0,
        maxScore: 3,
        suggestion: 'Include focus keyword in meta description'
      })
    }
    
    // Call-to-action in meta (3 points)
    const ctaWords = ['learn', 'discover', 'find out', 'get', 'download', 'try', 'start', 'explore', 'see how', 'read more']
    const hasCTA = ctaWords.some(cta => metaDescription.toLowerCase().includes(cta))
    
    if (hasCTA) {
      metaScore += 3
      analysis.details.push({
        category: 'Meta CTA',
        message: 'Call-to-action present in meta description',
        status: 'good',
        score: 3,
        maxScore: 3
      })
    } else {
      analysis.details.push({
        category: 'Meta CTA',
        message: 'No call-to-action in meta description',
        status: 'warning',
        score: 0,
        maxScore: 3,
        suggestion: 'Add compelling call-to-action to meta description'
      })
    }
    
    analysis.breakdown.meta.score = metaScore
  }

  private static analyzeImages(image: string | undefined, focusKeyword: string, title: string, analysis: EnhancedSEOAnalysis): void {
    let imageScore = 0
    
    if (image) {
      // Image present (4 points)
      imageScore += 4
      analysis.details.push({
        category: 'Featured Image',
        message: 'Featured image present',
        status: 'good',
        score: 4,
        maxScore: 4
      })
      
      // Image optimization (6 points)
      const isOptimized = image.includes('.webp') || image.includes('optimized') || image.includes('compressed')
      if (isOptimized) {
        imageScore += 6
        analysis.details.push({
          category: 'Image Optimization',
          message: 'Image appears to be optimized',
          status: 'good',
          score: 6,
          maxScore: 6
        })
      } else {
        imageScore += 3
        analysis.details.push({
          category: 'Image Optimization',
          message: 'Image optimization could be improved',
          status: 'warning',
          score: 3,
          maxScore: 6,
          suggestion: 'Use WebP format and compress images'
        })
      }
    } else {
      analysis.details.push({
        category: 'Featured Image',
        message: 'No featured image',
        status: 'error',
        score: 0,
        maxScore: 10,
        suggestion: 'Add a relevant featured image with proper alt text'
      })
      analysis.improvements.push({
        priority: 'high',
        category: 'Images',
        issue: 'Missing featured image',
        solution: 'Add relevant featured image with SEO-optimized alt text',
        impact: 10
      })
    }
    
    analysis.breakdown.images.score = imageScore
  }

  private static analyzePerformance(content: string, analysis: EnhancedSEOAnalysis): void {
    const wordCount = content.split(/\s+/).length
    const estimatedReadTime = Math.ceil(wordCount / 200) // 200 words per minute
    
    let performanceScore = 0
    
    // Content depth (3 points)
    if (wordCount >= 2000) {
      performanceScore += 3
      analysis.details.push({
        category: 'Content Depth',
        message: `Comprehensive content: ${wordCount} words`,
        status: 'good',
        score: 3,
        maxScore: 3
      })
    } else if (wordCount >= 1500) {
      performanceScore += 2
      analysis.details.push({
        category: 'Content Depth',
        message: `Good content length: ${wordCount} words`,
        status: 'warning',
        score: 2,
        maxScore: 3,
        suggestion: 'Consider expanding to 2000+ words for maximum impact'
      })
    } else {
      performanceScore += 1
      analysis.details.push({
        category: 'Content Depth',
        message: `Limited content depth: ${wordCount} words`,
        status: 'warning',
        score: 1,
        maxScore: 3,
        suggestion: 'Expand content for better search performance'
      })
    }
    
    // Read time optimization (2 points)
    if (estimatedReadTime >= 5 && estimatedReadTime <= 15) {
      performanceScore += 2
      analysis.details.push({
        category: 'Read Time',
        message: `Optimal read time: ${estimatedReadTime} minutes`,
        status: 'good',
        score: 2,
        maxScore: 2
      })
    } else {
      performanceScore += 1
      analysis.details.push({
        category: 'Read Time',
        message: `Read time: ${estimatedReadTime} minutes`,
        status: 'warning',
        score: 1,
        maxScore: 2,
        suggestion: 'Aim for 5-15 minute read time for optimal engagement'
      })
    }
    
    analysis.breakdown.performance.score = performanceScore
  }

  private static generateOptimizedData(
    title: string, 
    content: string, 
    focusKeyword: string, 
    category: string,
    analysis: EnhancedSEOAnalysis
  ): Partial<BlogPost> {
    const wordCount = content.split(/\s+/).length
    const estimatedReadTime = Math.ceil(wordCount / 200)
    
    return {
      title: this.optimizeTitle(title, focusKeyword),
      excerpt: this.generateMetaDescription(content.substring(0, 300), focusKeyword),
      readTime: `${estimatedReadTime} min read`,
      category,
      tags: this.generateOptimalTags(title, content, focusKeyword),
      seo: {
        focusKeyword,
        metaTitle: this.optimizeTitle(title, focusKeyword),
        metaDescription: this.generateMetaDescription(content.substring(0, 300), focusKeyword),
        keywords: this.generateRelatedKeywords(focusKeyword).join(', '),
        schema: this.generateSchemaMarkup(title, content, focusKeyword),
        socialMedia: {
          ogTitle: this.optimizeTitle(title, focusKeyword),
          ogDescription: this.generateMetaDescription(content.substring(0, 300), focusKeyword),
          twitterTitle: this.optimizeTitle(title, focusKeyword),
          twitterDescription: this.generateMetaDescription(content.substring(0, 300), focusKeyword)
        }
      }
    }
  }

  private static optimizeTitle(title: string, focusKeyword: string): string {
    let optimized = title.trim()
    
    // Remove markdown symbols
    optimized = optimized.replace(/^#+\s*/, '').replace(/#+\s*/g, '')
    
    // Ensure keyword is at the beginning
    if (!optimized.toLowerCase().startsWith(focusKeyword.toLowerCase())) {
      optimized = `${focusKeyword}: ${optimized}`
    }
    
    // Add power words if missing
    const powerWords = ['Ultimate', 'Complete', 'Best', 'Top', 'Essential', 'Expert']
    const hasPowerWord = powerWords.some(word => optimized.toLowerCase().includes(word.toLowerCase()))
    if (!hasPowerWord) {
      optimized = `Ultimate ${optimized}`
    }
    
    // Add current year if no numbers present
    if (!/\d/.test(optimized)) {
      const currentYear = new Date().getFullYear()
      optimized = `${optimized} (${currentYear})`
    }
    
    // Ensure optimal length
    if (optimized.length > 60) {
      optimized = optimized.substring(0, 57) + '...'
    }
    
    return optimized
  }

  private static generateMetaDescription(content: string, focusKeyword: string): string {
    const cleanContent = content.replace(/[#*]/g, '').trim()
    let description = cleanContent.substring(0, 120)
    
    // Ensure focus keyword is included
    if (!description.toLowerCase().includes(focusKeyword.toLowerCase())) {
      description = `${focusKeyword}: ${description}`
    }
    
    // Add call-to-action
    const ctas = ['Learn more', 'Discover how', 'Find out', 'Get started', 'Explore']
    const randomCTA = ctas[Math.floor(Math.random() * ctas.length)]
    
    if (description.length < 140) {
      description += ` ${randomCTA} today!`
    }
    
    // Ensure optimal length
    if (description.length > 160) {
      description = description.substring(0, 157) + '...'
    }
    
    return description
  }

  private static generateOptimalTags(title: string, content: string, focusKeyword: string): string[] {
    const tags = new Set<string>()
    
    // Add focus keyword
    tags.add(focusKeyword)
    
    // Add related keywords
    this.generateRelatedKeywords(focusKeyword).forEach(keyword => tags.add(keyword))
    
    // Add category-specific tags
    const categoryTags = ['AI Tools', 'Technology', 'Productivity', 'Software', 'Innovation', 'Digital Transformation']
    categoryTags.forEach(tag => tags.add(tag))
    
    // Add year for freshness
    tags.add(new Date().getFullYear().toString())
    
    return Array.from(tags).slice(0, 10)
  }

  private static generateRelatedKeywords(focusKeyword: string): string[] {
    const base = focusKeyword.toLowerCase()
    return [
      `${base} software`,
      `${base} tools`,
      `${base} platform`,
      `${base} solution`,
      `${base} technology`,
      `best ${base}`,
      `${base} guide`,
      `${base} review`,
      `${base} comparison`,
      `${base} features`
    ]
  }

  private static generateLongTailVariations(focusKeyword: string): string[] {
    const base = focusKeyword.toLowerCase()
    return [
      `how to use ${base}`,
      `${base} for beginners`,
      `${base} vs alternatives`,
      `${base} pricing and features`,
      `${base} implementation guide`,
      `${base} best practices`,
      `${base} case studies`,
      `${base} success stories`
    ]
  }

  private static generateSchemaMarkup(title: string, content: string, focusKeyword: string): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: this.generateMetaDescription(content, focusKeyword),
      keywords: this.generateRelatedKeywords(focusKeyword).join(', '),
      author: {
        '@type': 'Person',
        name: 'AI Tools Expert'
      },
      publisher: {
        '@type': 'Organization',
        name: 'AI Tools Insights'
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString()
    }
  }

  private static countSyllables(word: string): number {
    word = word.toLowerCase()
    if (word.length <= 3) return 1
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    word = word.replace(/^y/, '')
    const matches = word.match(/[aeiouy]{1,2}/g)
    return matches ? matches.length : 1
  }

  private static calculateGrade(score: number): string {
    if (score >= 95) return 'A+'
    if (score >= 90) return 'A'
    if (score >= 85) return 'A-'
    if (score >= 80) return 'B+'
    if (score >= 75) return 'B'
    if (score >= 70) return 'B-'
    if (score >= 65) return 'C+'
    if (score >= 60) return 'C'
    if (score >= 55) return 'C-'
    if (score >= 50) return 'D'
    return 'F'
  }

  private static determineStatus(score: number): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
    if (score >= 90) return 'excellent'
    if (score >= 70) return 'good'
    if (score >= 50) return 'needs-improvement'
    return 'poor'
  }

  static getSEOScoreColor(score: number): string {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  static getSEOScoreBg(score: number): string {
    if (score >= 90) return 'border-green-200 bg-green-50'
    if (score >= 70) return 'border-yellow-200 bg-yellow-50'
    return 'border-red-200 bg-red-50'
  }

  static getSEOGrade(score: number): string {
    return this.calculateGrade(score)
  }
}