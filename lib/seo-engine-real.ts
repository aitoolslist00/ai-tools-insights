import { BlogPost } from './blog-data'

export interface RealSEOAnalysis {
  score: number
  maxScore: number
  issues: SEOIssue[]
  suggestions: string[]
  optimizedData: Partial<BlogPost>
  breakdown: {
    title: { score: number; max: number; issues: string[] }
    content: { score: number; max: number; issues: string[] }
    meta: { score: number; max: number; issues: string[] }
    keywords: { score: number; max: number; issues: string[] }
    structure: { score: number; max: number; issues: string[] }
    readability: { score: number; max: number; issues: string[] }
  }
}

export interface SEOIssue {
  type: 'critical' | 'warning' | 'suggestion'
  category: string
  message: string
  fix: string
  points: number
}

export class RealSEOEngine {
  
  static analyzeContent(
    title: string, 
    content: string, 
    focusKeyword: string,
    category: string = 'ai-tools'
  ): RealSEOAnalysis {
    
    const analysis: RealSEOAnalysis = {
      score: 0,
      maxScore: 100,
      issues: [],
      suggestions: [],
      optimizedData: {},
      breakdown: {
        title: { score: 0, max: 20, issues: [] },
        content: { score: 0, max: 25, issues: [] },
        meta: { score: 0, max: 20, issues: [] },
        keywords: { score: 0, max: 15, issues: [] },
        structure: { score: 0, max: 10, issues: [] },
        readability: { score: 0, max: 10, issues: [] }
      }
    }

    // Analyze title (20 points max)
    this.analyzeTitle(title, focusKeyword, analysis)
    
    // Analyze content (25 points max)
    this.analyzeContentStructure(content, focusKeyword, analysis)
    
    // Analyze meta elements (20 points max)
    this.analyzeMetaElements(title, content, focusKeyword, analysis)
    
    // Analyze keyword usage (15 points max)
    this.analyzeKeywordUsage(title, content, focusKeyword, analysis)
    
    // Analyze content structure (10 points max)
    this.analyzeStructure(content, analysis)
    
    // Analyze readability (10 points max)
    this.analyzeReadability(content, analysis)

    // Calculate total score
    analysis.score = Object.values(analysis.breakdown).reduce((sum, section) => sum + section.score, 0)

    // Generate optimized data based on analysis
    analysis.optimizedData = this.generateOptimizedData(title, content, focusKeyword, category, analysis)

    return analysis
  }

  private static analyzeTitle(title: string, focusKeyword: string, analysis: RealSEOAnalysis): void {
    const titleLength = title.length
    const hasKeyword = title.toLowerCase().includes(focusKeyword.toLowerCase())
    const keywordPosition = title.toLowerCase().indexOf(focusKeyword.toLowerCase())
    
    // Title length check (0-8 points)
    if (titleLength >= 30 && titleLength <= 60) {
      analysis.breakdown.title.score += 8
      analysis.suggestions.push(`✅ Title length is optimal (${titleLength} characters)`)
    } else if (titleLength >= 25 && titleLength <= 70) {
      analysis.breakdown.title.score += 5
      analysis.breakdown.title.issues.push(`Title length could be improved (${titleLength} chars, optimal: 30-60)`)
      analysis.issues.push({
        type: 'warning',
        category: 'Title Length',
        message: `Title is ${titleLength} characters. Optimal range is 30-60 characters.`,
        fix: titleLength < 30 ? 'Make title longer and more descriptive' : 'Shorten title while keeping key information',
        points: 3
      })
    } else {
      analysis.breakdown.title.issues.push(`Title length is poor (${titleLength} chars)`)
      analysis.issues.push({
        type: 'critical',
        category: 'Title Length',
        message: `Title is ${titleLength} characters. This is ${titleLength < 30 ? 'too short' : 'too long'}.`,
        fix: titleLength < 30 ? 'Expand title with more descriptive keywords' : 'Shorten title to under 60 characters',
        points: 8
      })
    }

    // Keyword in title (0-7 points)
    if (hasKeyword) {
      if (keywordPosition <= 10) {
        analysis.breakdown.title.score += 7
        analysis.suggestions.push(`✅ Focus keyword appears early in title`)
      } else {
        analysis.breakdown.title.score += 4
        analysis.breakdown.title.issues.push('Focus keyword should appear earlier in title')
        analysis.issues.push({
          type: 'suggestion',
          category: 'Keyword Position',
          message: 'Focus keyword appears late in title',
          fix: 'Move focus keyword closer to the beginning of the title',
          points: 3
        })
      }
    } else {
      analysis.breakdown.title.issues.push('Focus keyword missing from title')
      analysis.issues.push({
        type: 'critical',
        category: 'Missing Keyword',
        message: 'Focus keyword not found in title',
        fix: 'Include the focus keyword in your title',
        points: 7
      })
    }

    // Title uniqueness and appeal (0-5 points)
    const hasNumbers = /\d/.test(title)
    const hasPowerWords = /\b(best|ultimate|complete|guide|top|essential|proven|expert|advanced|comprehensive)\b/i.test(title)
    
    if (hasNumbers && hasPowerWords) {
      analysis.breakdown.title.score += 5
      analysis.suggestions.push(`✅ Title includes engaging elements (numbers and power words)`)
    } else if (hasNumbers || hasPowerWords) {
      analysis.breakdown.title.score += 3
      analysis.suggestions.push(`Title could be more engaging with ${hasNumbers ? 'power words' : 'numbers'}`)
    } else {
      analysis.breakdown.title.issues.push('Title lacks engaging elements')
      analysis.issues.push({
        type: 'suggestion',
        category: 'Title Appeal',
        message: 'Title could be more engaging',
        fix: 'Add numbers, power words, or emotional triggers to make title more clickable',
        points: 2
      })
    }
  }

  private static analyzeContentStructure(content: string, focusKeyword: string, analysis: RealSEOAnalysis): void {
    const wordCount = content.split(/\s+/).length
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0)
    
    // Word count analysis (0-10 points)
    if (wordCount >= 1500) {
      analysis.breakdown.content.score += 10
      analysis.suggestions.push(`✅ Excellent content length (${wordCount} words)`)
    } else if (wordCount >= 1000) {
      analysis.breakdown.content.score += 7
      analysis.suggestions.push(`Good content length (${wordCount} words), consider expanding for better SEO`)
    } else if (wordCount >= 500) {
      analysis.breakdown.content.score += 4
      analysis.breakdown.content.issues.push(`Content is short (${wordCount} words)`)
      analysis.issues.push({
        type: 'warning',
        category: 'Content Length',
        message: `Content is only ${wordCount} words. Longer content typically ranks better.`,
        fix: 'Expand content to at least 1000 words with valuable information',
        points: 6
      })
    } else {
      analysis.breakdown.content.issues.push(`Content is too short (${wordCount} words)`)
      analysis.issues.push({
        type: 'critical',
        category: 'Content Length',
        message: `Content is only ${wordCount} words. This is too short for good SEO.`,
        fix: 'Write comprehensive content of at least 1000 words',
        points: 10
      })
    }

    // Paragraph structure (0-5 points)
    const avgParagraphLength = paragraphs.reduce((sum, p) => sum + p.split(/\s+/).length, 0) / paragraphs.length
    if (avgParagraphLength <= 150 && paragraphs.length >= 5) {
      analysis.breakdown.content.score += 5
      analysis.suggestions.push(`✅ Good paragraph structure (${paragraphs.length} paragraphs)`)
    } else if (avgParagraphLength <= 200) {
      analysis.breakdown.content.score += 3
      analysis.suggestions.push(`Paragraph structure is decent, consider breaking up longer paragraphs`)
    } else {
      analysis.breakdown.content.issues.push('Paragraphs are too long')
      analysis.issues.push({
        type: 'suggestion',
        category: 'Readability',
        message: 'Paragraphs are too long for optimal readability',
        fix: 'Break long paragraphs into shorter ones (aim for 2-4 sentences each)',
        points: 2
      })
    }

    // Content freshness and value (0-10 points)
    const hasCurrentYear = content.includes('2024') || content.includes('2025')
    const hasActionableContent = /\b(how to|step|guide|tutorial|tips|strategies|methods)\b/i.test(content)
    const hasExamples = /\b(example|for instance|such as|like|including)\b/i.test(content)
    
    let freshnessScore = 0
    if (hasCurrentYear) freshnessScore += 3
    if (hasActionableContent) freshnessScore += 4
    if (hasExamples) freshnessScore += 3
    
    analysis.breakdown.content.score += Math.min(freshnessScore, 10)
    
    if (freshnessScore >= 8) {
      analysis.suggestions.push(`✅ Content appears fresh and valuable`)
    } else {
      const missing = []
      if (!hasCurrentYear) missing.push('current year references')
      if (!hasActionableContent) missing.push('actionable advice')
      if (!hasExamples) missing.push('examples')
      
      analysis.issues.push({
        type: 'suggestion',
        category: 'Content Value',
        message: 'Content could be more valuable and current',
        fix: `Add ${missing.join(', ')} to improve content value`,
        points: 10 - freshnessScore
      })
    }
  }

  private static analyzeMetaElements(title: string, content: string, focusKeyword: string, analysis: RealSEOAnalysis): void {
    // Generate meta description from content
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
    const metaDescription = sentences.slice(0, 2).join('. ').substring(0, 155) + '...'
    
    // Meta description length (0-10 points)
    if (metaDescription.length >= 120 && metaDescription.length <= 160) {
      analysis.breakdown.meta.score += 10
      analysis.suggestions.push(`✅ Meta description length is optimal`)
    } else {
      analysis.breakdown.meta.score += 5
      analysis.breakdown.meta.issues.push('Meta description length needs optimization')
      analysis.issues.push({
        type: 'warning',
        category: 'Meta Description',
        message: `Meta description should be 120-160 characters`,
        fix: 'Adjust meta description length to optimal range',
        points: 5
      })
    }

    // Meta description keyword (0-5 points)
    if (metaDescription.toLowerCase().includes(focusKeyword.toLowerCase())) {
      analysis.breakdown.meta.score += 5
      analysis.suggestions.push(`✅ Focus keyword found in meta description`)
    } else {
      analysis.breakdown.meta.issues.push('Focus keyword missing from meta description')
      analysis.issues.push({
        type: 'warning',
        category: 'Meta Keywords',
        message: 'Focus keyword not found in meta description',
        fix: 'Include focus keyword naturally in meta description',
        points: 5
      })
    }

    // Meta title optimization (0-5 points)
    const metaTitle = title.length <= 60 ? title : title.substring(0, 57) + '...'
    if (metaTitle.includes(focusKeyword) && metaTitle.length <= 60) {
      analysis.breakdown.meta.score += 5
      analysis.suggestions.push(`✅ Meta title is well optimized`)
    } else {
      analysis.breakdown.meta.issues.push('Meta title needs optimization')
      analysis.issues.push({
        type: 'suggestion',
        category: 'Meta Title',
        message: 'Meta title could be better optimized',
        fix: 'Ensure meta title includes focus keyword and is under 60 characters',
        points: 2
      })
    }
  }

  private static analyzeKeywordUsage(title: string, content: string, focusKeyword: string, analysis: RealSEOAnalysis): void {
    const totalWords = content.split(/\s+/).length
    const keywordMatches = (content.toLowerCase().match(new RegExp(focusKeyword.toLowerCase(), 'g')) || []).length
    const keywordDensity = (keywordMatches / totalWords) * 100

    // Keyword density (0-8 points)
    if (keywordDensity >= 1 && keywordDensity <= 3) {
      analysis.breakdown.keywords.score += 8
      analysis.suggestions.push(`✅ Keyword density is optimal (${keywordDensity.toFixed(1)}%)`)
    } else if (keywordDensity >= 0.5 && keywordDensity <= 4) {
      analysis.breakdown.keywords.score += 5
      analysis.suggestions.push(`Keyword density is acceptable (${keywordDensity.toFixed(1)}%)`)
    } else {
      analysis.breakdown.keywords.issues.push(`Keyword density is ${keywordDensity < 0.5 ? 'too low' : 'too high'} (${keywordDensity.toFixed(1)}%)`)
      analysis.issues.push({
        type: keywordDensity < 0.5 ? 'warning' : 'critical',
        category: 'Keyword Density',
        message: `Keyword density is ${keywordDensity.toFixed(1)}%. Optimal range is 1-3%.`,
        fix: keywordDensity < 0.5 ? 'Use focus keyword more naturally throughout content' : 'Reduce keyword usage to avoid over-optimization',
        points: keywordDensity < 0.5 ? 3 : 6
      })
    }

    // Keyword in first paragraph (0-4 points)
    const firstParagraph = content.split('\n\n')[0] || content.substring(0, 200)
    if (firstParagraph.toLowerCase().includes(focusKeyword.toLowerCase())) {
      analysis.breakdown.keywords.score += 4
      analysis.suggestions.push(`✅ Focus keyword appears in first paragraph`)
    } else {
      analysis.breakdown.keywords.issues.push('Focus keyword missing from first paragraph')
      analysis.issues.push({
        type: 'warning',
        category: 'Keyword Placement',
        message: 'Focus keyword should appear in the first paragraph',
        fix: 'Include focus keyword naturally in the opening paragraph',
        points: 4
      })
    }

    // Keyword variations (0-3 points)
    const keywordWords = focusKeyword.toLowerCase().split(/\s+/)
    const hasVariations = keywordWords.some(word => {
      const variations = [word + 's', word + 'ing', word + 'ed', word + 'er']
      return variations.some(variation => content.toLowerCase().includes(variation))
    })

    if (hasVariations) {
      analysis.breakdown.keywords.score += 3
      analysis.suggestions.push(`✅ Keyword variations found`)
    } else {
      analysis.breakdown.keywords.issues.push('Consider using keyword variations')
      analysis.issues.push({
        type: 'suggestion',
        category: 'Keyword Variations',
        message: 'Using keyword variations can improve SEO',
        fix: 'Include related terms and variations of your focus keyword',
        points: 1
      })
    }
  }

  private static analyzeStructure(content: string, analysis: RealSEOAnalysis): void {
    const h1Count = (content.match(/^# /gm) || []).length
    const h2Count = (content.match(/^## /gm) || []).length
    const h3Count = (content.match(/^### /gm) || []).length
    
    // Heading structure (0-6 points)
    if (h1Count === 1 && h2Count >= 3) {
      analysis.breakdown.structure.score += 6
      analysis.suggestions.push(`✅ Good heading structure (H1: ${h1Count}, H2: ${h2Count})`)
    } else if (h1Count <= 1 && h2Count >= 1) {
      analysis.breakdown.structure.score += 3
      analysis.suggestions.push(`Heading structure is basic, consider adding more H2 headings`)
    } else {
      analysis.breakdown.structure.issues.push('Poor heading structure')
      analysis.issues.push({
        type: 'warning',
        category: 'Content Structure',
        message: 'Content needs better heading structure',
        fix: 'Use one H1 and multiple H2 headings to organize content',
        points: 3
      })
    }

    // Lists and formatting (0-4 points)
    const hasBulletLists = content.includes('- ') || content.includes('* ')
    const hasNumberedLists = /^\d+\./m.test(content)
    const hasBoldText = content.includes('**') || content.includes('__')
    
    let formatScore = 0
    if (hasBulletLists) formatScore += 2
    if (hasNumberedLists) formatScore += 1
    if (hasBoldText) formatScore += 1
    
    analysis.breakdown.structure.score += Math.min(formatScore, 4)
    
    if (formatScore >= 3) {
      analysis.suggestions.push(`✅ Good use of formatting elements`)
    } else {
      analysis.issues.push({
        type: 'suggestion',
        category: 'Content Formatting',
        message: 'Content could benefit from better formatting',
        fix: 'Add bullet points, numbered lists, and bold text for better readability',
        points: 4 - formatScore
      })
    }
  }

  private static analyzeReadability(content: string, analysis: RealSEOAnalysis): void {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = content.split(/\s+/)
    const avgWordsPerSentence = words.length / sentences.length
    
    // Sentence length (0-5 points)
    if (avgWordsPerSentence <= 20) {
      analysis.breakdown.readability.score += 5
      analysis.suggestions.push(`✅ Good sentence length (avg: ${avgWordsPerSentence.toFixed(1)} words)`)
    } else if (avgWordsPerSentence <= 25) {
      analysis.breakdown.readability.score += 3
      analysis.suggestions.push(`Sentence length is acceptable`)
    } else {
      analysis.breakdown.readability.issues.push('Sentences are too long')
      analysis.issues.push({
        type: 'suggestion',
        category: 'Readability',
        message: 'Sentences are too long for optimal readability',
        fix: 'Break long sentences into shorter ones (aim for under 20 words)',
        points: 2
      })
    }

    // Transition words (0-3 points)
    const transitionWords = ['however', 'therefore', 'furthermore', 'moreover', 'additionally', 'consequently', 'meanwhile', 'nevertheless']
    const hasTransitions = transitionWords.some(word => content.toLowerCase().includes(word))
    
    if (hasTransitions) {
      analysis.breakdown.readability.score += 3
      analysis.suggestions.push(`✅ Good use of transition words`)
    } else {
      analysis.breakdown.readability.issues.push('Consider adding transition words')
      analysis.issues.push({
        type: 'suggestion',
        category: 'Flow',
        message: 'Content could flow better with transition words',
        fix: 'Add transition words to connect ideas and improve flow',
        points: 1
      })
    }

    // Active voice (0-2 points)
    const passiveIndicators = ['was', 'were', 'been', 'being']
    const passiveCount = passiveIndicators.reduce((count, word) => {
      return count + (content.toLowerCase().match(new RegExp(`\\b${word}\\b`, 'g')) || []).length
    }, 0)
    
    const passiveRatio = passiveCount / words.length
    if (passiveRatio < 0.1) {
      analysis.breakdown.readability.score += 2
      analysis.suggestions.push(`✅ Good use of active voice`)
    } else {
      analysis.breakdown.readability.issues.push('Consider using more active voice')
      analysis.issues.push({
        type: 'suggestion',
        category: 'Voice',
        message: 'Content has some passive voice usage',
        fix: 'Convert passive sentences to active voice where possible',
        points: 1
      })
    }
  }

  private static generateOptimizedData(
    title: string, 
    content: string, 
    focusKeyword: string, 
    category: string,
    analysis: RealSEOAnalysis
  ): Partial<BlogPost> {
    
    // Generate optimized slug
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50)

    // Generate meta description from content
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
    let metaDescription = sentences.slice(0, 2).join('. ')
    
    // Ensure focus keyword is in meta description
    if (!metaDescription.toLowerCase().includes(focusKeyword.toLowerCase())) {
      metaDescription = `${focusKeyword}: ${metaDescription}`
    }
    
    // Trim to optimal length
    if (metaDescription.length > 155) {
      metaDescription = metaDescription.substring(0, 152) + '...'
    }

    // Generate meta title
    let metaTitle = title
    if (!metaTitle.toLowerCase().includes(focusKeyword.toLowerCase())) {
      metaTitle = `${focusKeyword}: ${metaTitle}`
    }
    if (metaTitle.length > 60) {
      metaTitle = metaTitle.substring(0, 57) + '...'
    }

    // Extract tags from content
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'a', 'an']
    const words = content.toLowerCase().match(/\b[a-z]{3,}\b/g) || []
    const wordFreq = words.reduce((freq: Record<string, number>, word) => {
      if (!commonWords.includes(word)) {
        freq[word] = (freq[word] || 0) + 1
      }
      return freq
    }, {})
    
    const tags = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1))
    
    // Add focus keyword as first tag if not already included
    const focusKeywordCapitalized = focusKeyword.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
    
    if (!tags.some(tag => tag.toLowerCase() === focusKeyword.toLowerCase())) {
      tags.unshift(focusKeywordCapitalized)
    }

    // Calculate read time
    const wordCount = content.split(/\s+/).length
    const readTime = Math.max(1, Math.round(wordCount / 200))

    // Generate excerpt
    const firstSentences = content.split(/[.!?]+/).slice(0, 3).join('. ')
    let excerpt = firstSentences.length > 200 ? firstSentences.substring(0, 197) + '...' : firstSentences

    return {
      id: slug,
      title: title,
      excerpt: excerpt,
      content: content,
      author: 'AI Tools Expert',
      date: new Date().toISOString().split('T')[0],
      readTime: `${readTime} min read`,
      category: category,
      featured: false,
      published: false,
      image: `/images/blog/${slug}.jpg`,
      href: `/blog/${slug}`,
      tags: tags.slice(0, 6),
      status: 'draft',
      publishedAt: undefined,
      updatedAt: new Date().toISOString(),
      seo: {
        metaTitle: metaTitle,
        metaDescription: metaDescription,
        keywords: tags.slice(0, 10).join(', '),
        focusKeyword: focusKeyword,
        canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-tools-list.com'}/blog/${slug}`,
        ogTitle: metaTitle,
        ogDescription: metaDescription,
        ogImage: `/images/blog/${slug}-og.jpg`,
        twitterTitle: metaTitle,
        twitterDescription: metaDescription,
        twitterImage: `/images/blog/${slug}-twitter.jpg`
      },
      analytics: {
        views: 0,
        shares: 0,
        likes: 0
      }
    }
  }

  static getSEOScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  static getSEOScoreBg(score: number): string {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200'
    if (score >= 40) return 'bg-orange-50 border-orange-200'
    return 'bg-red-50 border-red-200'
  }

  static getSEOGrade(score: number): string {
    if (score >= 90) return 'A+'
    if (score >= 80) return 'A'
    if (score >= 70) return 'B+'
    if (score >= 60) return 'B'
    if (score >= 50) return 'C+'
    if (score >= 40) return 'C'
    if (score >= 30) return 'D'
    return 'F'
  }
}