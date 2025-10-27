/**
 * Advanced SEO Optimizer 2025 - Google Ranking Focused
 * Implements latest SEO best practices for maximum ranking potential
 */

import { EnhancedBlogPost } from './enhanced-blog-generator'

export interface SEOAnalysis {
  score: number
  issues: SEOIssue[]
  recommendations: SEORecommendation[]
  keywordAnalysis: KeywordAnalysis
  technicalSEO: TechnicalSEOAnalysis
  contentQuality: ContentQualityAnalysis
  eeatScore: EEATAnalysis
}

export interface SEOIssue {
  type: 'critical' | 'warning' | 'suggestion'
  category: 'title' | 'meta' | 'content' | 'keywords' | 'structure' | 'technical'
  message: string
  fix: string
  impact: number // 1-10 scale
}

export interface SEORecommendation {
  priority: 'high' | 'medium' | 'low'
  category: string
  title: string
  description: string
  implementation: string
  expectedImpact: string
}

export interface KeywordAnalysis {
  focusKeywordDensity: number
  optimalDensity: number
  keywordDistribution: Array<{
    keyword: string
    count: number
    density: number
    positions: number[]
  }>
  semanticKeywords: string[]
  missingKeywords: string[]
  keywordStuffing: boolean
}

export interface TechnicalSEOAnalysis {
  titleLength: number
  metaDescriptionLength: number
  headingStructure: Array<{
    level: number
    text: string
    hasKeyword: boolean
  }>
  internalLinks: number
  externalLinks: number
  imageOptimization: {
    totalImages: number
    optimizedImages: number
    missingAltText: number
  }
  structuredData: boolean
  readabilityScore: number
}

export interface ContentQualityAnalysis {
  wordCount: number
  readingTime: number
  sentenceLength: number
  paragraphLength: number
  uniqueness: number
  topicalRelevance: number
  userIntent: 'informational' | 'navigational' | 'transactional' | 'commercial'
  contentDepth: number
}

export interface EEATAnalysis {
  expertise: {
    score: number
    signals: string[]
  }
  experience: {
    score: number
    signals: string[]
  }
  authoritativeness: {
    score: number
    signals: string[]
  }
  trustworthiness: {
    score: number
    signals: string[]
  }
  overallScore: number
}

/**
 * Comprehensive SEO analysis of blog post
 */
export function analyzeSEO(post: EnhancedBlogPost, focusKeyword: string): SEOAnalysis {
  const issues: SEOIssue[] = []
  const recommendations: SEORecommendation[] = []

  // Analyze title
  const titleAnalysis = analyzeTitleSEO(post.title, focusKeyword)
  issues.push(...titleAnalysis.issues)
  recommendations.push(...titleAnalysis.recommendations)

  // Analyze meta description
  const metaAnalysis = analyzeMetaDescription(post.metaDescription, focusKeyword)
  issues.push(...metaAnalysis.issues)
  recommendations.push(...metaAnalysis.recommendations)

  // Analyze content
  const contentAnalysis = analyzeContentSEO(post.content, focusKeyword, post.keywords)
  issues.push(...contentAnalysis.issues)
  recommendations.push(...contentAnalysis.recommendations)

  // Analyze keyword usage
  const keywordAnalysis = analyzeKeywords(post.content, focusKeyword, post.keywords)

  // Analyze technical SEO
  const technicalSEO = analyzeTechnicalSEO(post)

  // Analyze content quality
  const contentQuality = analyzeContentQuality(post)

  // Analyze E-E-A-T
  const eeatScore = analyzeEEAT(post)

  // Calculate overall score
  const score = calculateOverallSEOScore({
    titleScore: titleAnalysis.score,
    metaScore: metaAnalysis.score,
    contentScore: contentAnalysis.score,
    keywordScore: keywordAnalysis.score,
    technicalScore: technicalSEO.score,
    qualityScore: contentQuality.score,
    eeatScore: eeatScore.overallScore
  })

  return {
    score,
    issues,
    recommendations,
    keywordAnalysis: keywordAnalysis.analysis,
    technicalSEO: technicalSEO.analysis,
    contentQuality: contentQuality.analysis,
    eeatScore
  }
}

/**
 * Analyzes title SEO optimization
 */
function analyzeTitleSEO(title: string, focusKeyword: string) {
  const issues: SEOIssue[] = []
  const recommendations: SEORecommendation[] = []
  let score = 100

  // Check title length
  if (title.length < 30) {
    issues.push({
      type: 'warning',
      category: 'title',
      message: 'Title is too short',
      fix: 'Expand title to 50-60 characters for optimal SEO',
      impact: 7
    })
    score -= 15
  } else if (title.length > 60) {
    issues.push({
      type: 'critical',
      category: 'title',
      message: 'Title is too long and may be truncated in search results',
      fix: 'Shorten title to under 60 characters',
      impact: 8
    })
    score -= 20
  }

  // Check focus keyword in title
  if (!title.toLowerCase().includes(focusKeyword.toLowerCase())) {
    issues.push({
      type: 'critical',
      category: 'title',
      message: 'Focus keyword not found in title',
      fix: `Include "${focusKeyword}" in the title`,
      impact: 9
    })
    score -= 25
  }

  // Check keyword position
  const keywordPosition = title.toLowerCase().indexOf(focusKeyword.toLowerCase())
  if (keywordPosition > 30) {
    recommendations.push({
      priority: 'high',
      category: 'title',
      title: 'Move focus keyword earlier in title',
      description: 'Keywords at the beginning of titles have more SEO weight',
      implementation: 'Restructure title to place focus keyword within first 30 characters',
      expectedImpact: 'Improved keyword relevance and click-through rates'
    })
    score -= 10
  }

  // Check for power words
  const powerWords = ['ultimate', 'complete', 'best', 'top', 'guide', '2025', 'expert', 'professional']
  const hasPowerWords = powerWords.some(word => title.toLowerCase().includes(word))
  
  if (!hasPowerWords) {
    recommendations.push({
      priority: 'medium',
      category: 'title',
      title: 'Add power words to increase click-through rate',
      description: 'Power words make titles more compelling and clickable',
      implementation: 'Include words like "Ultimate", "Complete", "Best", or "Expert"',
      expectedImpact: 'Higher click-through rates from search results'
    })
    score -= 5
  }

  return { score, issues, recommendations }
}

/**
 * Analyzes meta description SEO
 */
function analyzeMetaDescription(metaDescription: string, focusKeyword: string) {
  const issues: SEOIssue[] = []
  const recommendations: SEORecommendation[] = []
  let score = 100

  // Check meta description length
  if (metaDescription.length < 120) {
    issues.push({
      type: 'warning',
      category: 'meta',
      message: 'Meta description is too short',
      fix: 'Expand meta description to 150-160 characters',
      impact: 6
    })
    score -= 15
  } else if (metaDescription.length > 160) {
    issues.push({
      type: 'critical',
      category: 'meta',
      message: 'Meta description is too long and may be truncated',
      fix: 'Shorten meta description to under 160 characters',
      impact: 7
    })
    score -= 20
  }

  // Check focus keyword in meta description
  if (!metaDescription.toLowerCase().includes(focusKeyword.toLowerCase())) {
    issues.push({
      type: 'critical',
      category: 'meta',
      message: 'Focus keyword not found in meta description',
      fix: `Include "${focusKeyword}" in the meta description`,
      impact: 8
    })
    score -= 25
  }

  // Check for call-to-action
  const ctaWords = ['discover', 'learn', 'find out', 'explore', 'get', 'download', 'read more']
  const hasCTA = ctaWords.some(word => metaDescription.toLowerCase().includes(word))
  
  if (!hasCTA) {
    recommendations.push({
      priority: 'medium',
      category: 'meta',
      title: 'Add call-to-action to meta description',
      description: 'CTAs encourage users to click through from search results',
      implementation: 'Include action words like "Discover", "Learn", or "Explore"',
      expectedImpact: 'Improved click-through rates'
    })
    score -= 10
  }

  return { score, issues, recommendations }
}

/**
 * Analyzes content SEO optimization
 */
function analyzeContentSEO(content: string, focusKeyword: string, keywords: string[]) {
  const issues: SEOIssue[] = []
  const recommendations: SEORecommendation[] = []
  let score = 100

  const wordCount = content.split(/\s+/).length
  const keywordCount = (content.toLowerCase().match(new RegExp(focusKeyword.toLowerCase(), 'g')) || []).length
  const keywordDensity = (keywordCount / wordCount) * 100

  // Check word count
  if (wordCount < 1500) {
    issues.push({
      type: 'warning',
      category: 'content',
      message: 'Content is too short for competitive ranking',
      fix: 'Expand content to at least 2000 words for better SEO',
      impact: 8
    })
    score -= 20
  }

  // Check keyword density
  if (keywordDensity < 0.5) {
    issues.push({
      type: 'warning',
      category: 'keywords',
      message: 'Focus keyword density is too low',
      fix: 'Increase focus keyword usage to 1-2% density',
      impact: 7
    })
    score -= 15
  } else if (keywordDensity > 3) {
    issues.push({
      type: 'critical',
      category: 'keywords',
      message: 'Keyword stuffing detected',
      fix: 'Reduce keyword density to under 2%',
      impact: 9
    })
    score -= 30
  }

  // Check heading structure
  const headings = content.match(/^#{1,6}\s+.+$/gm) || []
  if (headings.length < 3) {
    issues.push({
      type: 'warning',
      category: 'structure',
      message: 'Insufficient heading structure',
      fix: 'Add more headings (H2, H3) to improve content structure',
      impact: 6
    })
    score -= 10
  }

  // Check for focus keyword in first paragraph
  const firstParagraph = content.split('\n\n')[0] || ''
  if (!firstParagraph.toLowerCase().includes(focusKeyword.toLowerCase())) {
    issues.push({
      type: 'warning',
      category: 'keywords',
      message: 'Focus keyword not found in first paragraph',
      fix: 'Include focus keyword in the opening paragraph',
      impact: 7
    })
    score -= 15
  }

  // Check for semantic keywords
  const semanticKeywordCount = keywords.filter(keyword => 
    content.toLowerCase().includes(keyword.toLowerCase())
  ).length

  if (semanticKeywordCount < keywords.length * 0.7) {
    recommendations.push({
      priority: 'high',
      category: 'keywords',
      title: 'Include more semantic keywords',
      description: 'Semantic keywords help Google understand content context',
      implementation: 'Naturally incorporate related keywords throughout the content',
      expectedImpact: 'Better topical relevance and ranking potential'
    })
    score -= 10
  }

  return { score, issues, recommendations }
}

/**
 * Analyzes keyword usage and distribution
 */
function analyzeKeywords(content: string, focusKeyword: string, keywords: string[]) {
  const words = content.toLowerCase().split(/\s+/)
  const totalWords = words.length

  const keywordAnalysis = keywords.map(keyword => {
    const keywordLower = keyword.toLowerCase()
    const count = (content.toLowerCase().match(new RegExp(keywordLower, 'g')) || []).length
    const density = (count / totalWords) * 100
    
    // Find positions of keyword occurrences
    const positions: number[] = []
    let index = content.toLowerCase().indexOf(keywordLower)
    while (index !== -1) {
      positions.push(index)
      index = content.toLowerCase().indexOf(keywordLower, index + 1)
    }

    return {
      keyword,
      count,
      density,
      positions
    }
  })

  const focusKeywordData = keywordAnalysis.find(k => k.keyword.toLowerCase() === focusKeyword.toLowerCase())
  const focusKeywordDensity = focusKeywordData?.density || 0

  // Generate semantic keywords suggestions
  const semanticKeywords = generateSemanticKeywords(focusKeyword)
  
  // Find missing important keywords
  const missingKeywords = semanticKeywords.filter(keyword => 
    !content.toLowerCase().includes(keyword.toLowerCase())
  )

  // Check for keyword stuffing
  const keywordStuffing = keywordAnalysis.some(k => k.density > 3)

  let score = 100
  if (focusKeywordDensity < 0.5) score -= 20
  if (focusKeywordDensity > 3) score -= 40
  if (keywordStuffing) score -= 30
  if (missingKeywords.length > semanticKeywords.length * 0.5) score -= 15

  return {
    score,
    analysis: {
      focusKeywordDensity,
      optimalDensity: 1.5,
      keywordDistribution: keywordAnalysis,
      semanticKeywords,
      missingKeywords,
      keywordStuffing
    }
  }
}

/**
 * Analyzes technical SEO factors
 */
function analyzeTechnicalSEO(post: EnhancedBlogPost) {
  const headings = post.content.match(/^#{1,6}\s+.+$/gm) || []
  const headingStructure = headings.map(heading => {
    const level = (heading.match(/^#+/) || [''])[0].length
    const text = heading.replace(/^#+\s+/, '')
    const hasKeyword = post.keywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    )
    return { level, text, hasKeyword }
  })

  const internalLinks = (post.content.match(/\[([^\]]+)\]\(\/[^)]+\)/g) || []).length
  const externalLinks = (post.content.match(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/g) || []).length

  const imageOptimization = {
    totalImages: post.images.length,
    optimizedImages: post.images.filter(img => img.alt && img.title).length,
    missingAltText: post.images.filter(img => !img.alt).length
  }

  const structuredData = !!(post.schemas.article && post.schemas.breadcrumb)
  const readabilityScore = calculateReadabilityScore(post.content)

  let score = 100
  if (post.title.length > 60) score -= 15
  if (post.metaDescription.length > 160) score -= 15
  if (headingStructure.length < 3) score -= 10
  if (internalLinks < 3) score -= 10
  if (imageOptimization.missingAltText > 0) score -= 15
  if (!structuredData) score -= 20
  if (readabilityScore < 60) score -= 10

  return {
    score,
    analysis: {
      titleLength: post.title.length,
      metaDescriptionLength: post.metaDescription.length,
      headingStructure,
      internalLinks,
      externalLinks,
      imageOptimization,
      structuredData,
      readabilityScore
    }
  }
}

/**
 * Analyzes content quality factors
 */
function analyzeContentQuality(post: EnhancedBlogPost) {
  const sentences = post.content.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const paragraphs = post.content.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length
  const avgParagraphLength = paragraphs.reduce((sum, p) => sum + p.split(/\s+/).length, 0) / paragraphs.length

  // Estimate uniqueness (simplified)
  const uniqueness = Math.min(100, post.wordCount / 50) // Rough estimate

  // Estimate topical relevance
  const topicalRelevance = calculateTopicalRelevance(post.content, post.keywords)

  // Determine user intent
  const userIntent = determineUserIntent(post.title, post.content)

  // Calculate content depth
  const contentDepth = calculateContentDepth(post)

  let score = 100
  if (post.wordCount < 2000) score -= 20
  if (avgSentenceLength > 25) score -= 10
  if (avgParagraphLength > 150) score -= 10
  if (topicalRelevance < 70) score -= 15
  if (contentDepth < 70) score -= 10

  return {
    score,
    analysis: {
      wordCount: post.wordCount,
      readingTime: post.readingTime,
      sentenceLength: Math.round(avgSentenceLength),
      paragraphLength: Math.round(avgParagraphLength),
      uniqueness,
      topicalRelevance,
      userIntent,
      contentDepth
    }
  }
}

/**
 * Analyzes E-E-A-T signals
 */
function analyzeEEAT(post: EnhancedBlogPost): EEATAnalysis {
  const expertise = analyzeExpertise(post)
  const experience = analyzeExperience(post)
  const authoritativeness = analyzeAuthoritativeness(post)
  const trustworthiness = analyzeTrustworthiness(post)

  const overallScore = Math.round((expertise.score + experience.score + authoritativeness.score + trustworthiness.score) / 4)

  return {
    expertise,
    experience,
    authoritativeness,
    trustworthiness,
    overallScore
  }
}

/**
 * Helper functions
 */
function generateSemanticKeywords(focusKeyword: string): string[] {
  // This would typically use an API or database of semantic keywords
  // For now, return a basic set based on common patterns
  const baseKeywords = focusKeyword.toLowerCase().split(' ')
  const semanticKeywords: string[] = []

  baseKeywords.forEach(word => {
    if (word === 'ai') {
      semanticKeywords.push('artificial intelligence', 'machine learning', 'automation', 'intelligent systems')
    } else if (word === 'tools') {
      semanticKeywords.push('software', 'platforms', 'applications', 'solutions', 'services')
    } else if (word === '2025') {
      semanticKeywords.push('latest', 'modern', 'current', 'updated', 'new')
    }
  })

  return Array.from(new Set(semanticKeywords))
}

function calculateReadabilityScore(content: string): number {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const words = content.split(/\s+/).filter(w => w.length > 0)
  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0)

  // Flesch Reading Ease Score
  const avgSentenceLength = words.length / sentences.length
  const avgSyllablesPerWord = syllables / words.length

  const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord)
  return Math.max(0, Math.min(100, score))
}

function countSyllables(word: string): number {
  word = word.toLowerCase()
  if (word.length <= 3) return 1
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '')
  const matches = word.match(/[aeiouy]{1,2}/g)
  return matches ? matches.length : 1
}

function calculateTopicalRelevance(content: string, keywords: string[]): number {
  const contentLower = content.toLowerCase()
  const keywordMatches = keywords.filter(keyword => 
    contentLower.includes(keyword.toLowerCase())
  ).length

  return Math.round((keywordMatches / keywords.length) * 100)
}

function determineUserIntent(title: string, content: string): 'informational' | 'navigational' | 'transactional' | 'commercial' {
  const titleLower = title.toLowerCase()
  const contentLower = content.toLowerCase()

  if (titleLower.includes('how to') || titleLower.includes('guide') || titleLower.includes('tutorial')) {
    return 'informational'
  } else if (titleLower.includes('best') || titleLower.includes('top') || titleLower.includes('review')) {
    return 'commercial'
  } else if (contentLower.includes('buy') || contentLower.includes('price') || contentLower.includes('purchase')) {
    return 'transactional'
  } else {
    return 'informational'
  }
}

function calculateContentDepth(post: EnhancedBlogPost): number {
  let score = 0

  // Word count factor
  if (post.wordCount >= 4000) score += 30
  else if (post.wordCount >= 2000) score += 20
  else score += 10

  // Structure factor
  const headings = post.content.match(/^#{1,6}\s+.+$/gm) || []
  if (headings.length >= 8) score += 20
  else if (headings.length >= 5) score += 15
  else score += 10

  // Features factor
  if (post.comparisonTable) score += 15
  if (post.faq.length >= 5) score += 15
  if (post.images.length >= 3) score += 10

  // Table of contents factor
  if (post.tableOfContents.length >= 8) score += 10

  return Math.min(100, score)
}

function analyzeExpertise(post: EnhancedBlogPost) {
  const signals: string[] = []
  let score = 0

  // Check for technical depth
  if (post.wordCount >= 3000) {
    signals.push('Comprehensive content length')
    score += 25
  }

  // Check for detailed explanations
  if (post.content.includes('technical') || post.content.includes('advanced')) {
    signals.push('Technical depth and complexity')
    score += 20
  }

  // Check for comparison table
  if (post.comparisonTable) {
    signals.push('Detailed comparison analysis')
    score += 20
  }

  // Check for FAQ section
  if (post.faq.length >= 5) {
    signals.push('Comprehensive FAQ addressing user questions')
    score += 15
  }

  // Check for structured content
  if (post.tableOfContents.length >= 6) {
    signals.push('Well-structured, organized content')
    score += 20
  }

  return { score: Math.min(100, score), signals }
}

function analyzeExperience(post: EnhancedBlogPost) {
  const signals: string[] = []
  let score = 0

  // Check for practical examples
  if (post.content.includes('example') || post.content.includes('case study')) {
    signals.push('Real-world examples and case studies')
    score += 30
  }

  // Check for personal insights
  if (post.content.includes('experience') || post.content.includes('tested')) {
    signals.push('First-hand experience and testing')
    score += 25
  }

  // Check for specific details
  if (post.content.includes('screenshot') || post.content.includes('step-by-step')) {
    signals.push('Detailed, actionable instructions')
    score += 20
  }

  // Check for recent information
  if (post.content.includes('2025') || post.content.includes('latest')) {
    signals.push('Up-to-date, current information')
    score += 25
  }

  return { score: Math.min(100, score), signals }
}

function analyzeAuthoritativeness(post: EnhancedBlogPost) {
  const signals: string[] = []
  let score = 0

  // Check for citations and references
  if (post.content.includes('according to') || post.content.includes('research shows')) {
    signals.push('Citations and references to authoritative sources')
    score += 30
  }

  // Check for statistics and data
  if (post.content.includes('%') || post.content.includes('study') || post.content.includes('survey')) {
    signals.push('Statistical data and research backing')
    score += 25
  }

  // Check for expert quotes
  if (post.content.includes('expert') || post.content.includes('specialist')) {
    signals.push('Expert opinions and insights')
    score += 20
  }

  // Check for comprehensive coverage
  if (post.wordCount >= 4000) {
    signals.push('Comprehensive, authoritative coverage')
    score += 25
  }

  return { score: Math.min(100, score), signals }
}

function analyzeTrustworthiness(post: EnhancedBlogPost) {
  const signals: string[] = []
  let score = 0

  // Check for transparency
  if (post.content.includes('pros and cons') || post.content.includes('limitations')) {
    signals.push('Transparent, balanced assessment')
    score += 30
  }

  // Check for regular updates
  if (post.lastModified && new Date(post.lastModified) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) {
    signals.push('Recently updated content')
    score += 25
  }

  // Check for structured data
  if (post.schemas.article && post.schemas.breadcrumb) {
    signals.push('Proper structured data implementation')
    score += 20
  }

  // Check for author information
  if (post.author && post.author !== 'Anonymous') {
    signals.push('Clear author attribution')
    score += 25
  }

  return { score: Math.min(100, score), signals }
}

function calculateOverallSEOScore(scores: {
  titleScore: number
  metaScore: number
  contentScore: number
  keywordScore: number
  technicalScore: number
  qualityScore: number
  eeatScore: number
}): number {
  const weights = {
    title: 0.15,
    meta: 0.10,
    content: 0.25,
    keyword: 0.20,
    technical: 0.15,
    quality: 0.10,
    eeat: 0.05
  }

  return Math.round(
    scores.titleScore * weights.title +
    scores.metaScore * weights.meta +
    scores.contentScore * weights.content +
    scores.keywordScore * weights.keyword +
    scores.technicalScore * weights.technical +
    scores.qualityScore * weights.quality +
    scores.eeatScore * weights.eeat
  )
}

/**
 * Optimizes blog post for better SEO
 */
export function optimizeBlogPost(post: EnhancedBlogPost, analysis: SEOAnalysis): EnhancedBlogPost {
  const optimizedPost = { ...post }

  // Fix critical issues automatically
  analysis.issues.forEach(issue => {
    if (issue.type === 'critical') {
      switch (issue.category) {
        case 'title':
          if (issue.message.includes('too long')) {
            optimizedPost.title = optimizedPost.title.substring(0, 57) + '...'
          }
          break
        case 'meta':
          if (issue.message.includes('too long')) {
            optimizedPost.metaDescription = optimizedPost.metaDescription.substring(0, 157) + '...'
          }
          break
      }
    }
  })

  // Update SEO score
  optimizedPost.seoScore = Math.max(analysis.score, optimizedPost.seoScore)

  return optimizedPost
}

/**
 * Generates SEO improvement suggestions
 */
export function generateSEOImprovements(analysis: SEOAnalysis): string[] {
  const improvements: string[] = []

  // High priority improvements
  analysis.issues
    .filter(issue => issue.type === 'critical')
    .forEach(issue => {
      improvements.push(`🔴 CRITICAL: ${issue.message} - ${issue.fix}`)
    })

  // Medium priority improvements
  analysis.issues
    .filter(issue => issue.type === 'warning')
    .forEach(issue => {
      improvements.push(`🟡 WARNING: ${issue.message} - ${issue.fix}`)
    })

  // Recommendations
  analysis.recommendations
    .filter(rec => rec.priority === 'high')
    .forEach(rec => {
      improvements.push(`💡 RECOMMENDATION: ${rec.title} - ${rec.implementation}`)
    })

  return improvements
}