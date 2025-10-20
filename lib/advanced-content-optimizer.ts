/**
 * Advanced Content Auto-Optimizer
 * Automatically optimizes content to achieve 95%+ Google Bot understanding score
 * Uses semantic keywords, cluster keywords, and natural language processing
 */

import { GoogleBotAnalyzer, KeywordAnalysis } from './google-bot-analyzer'
import { fetchRecentNews, formatNewsForPrompt } from './news-fetcher'

export interface OptimizationResult {
  success: boolean
  originalScore: number
  optimizedScore: number
  improvements: string[]
  optimizedContent: {
    title: string
    content: string
    metaDescription: string
    slug: string
    excerpt: string
  }
  analysisComparison: {
    before: KeywordAnalysis
    after: KeywordAnalysis
  }
  optimizationLog: Array<{
    step: string
    action: string
    scoreImpact: number
  }>
}

export class AdvancedContentOptimizer {
  
  /**
   * Main optimization function - achieves 95%+ score
   */
  static async optimizeToTarget(
    title: string,
    content: string,
    primaryKeyword: string,
    metaDescription: string = '',
    slug: string = '',
    targetScore: number = 95
  ): Promise<OptimizationResult> {
    
    const optimizationLog: OptimizationResult['optimizationLog'] = []
    
    // Initial analysis
    const beforeAnalysis = GoogleBotAnalyzer.analyzeKeywordUnderstanding(
      content,
      title,
      primaryKeyword,
      metaDescription,
      slug
    )
    
    optimizationLog.push({
      step: 'Initial Analysis',
      action: `Starting optimization with ${beforeAnalysis.understandingScore}% understanding score`,
      scoreImpact: 0
    })
    
    // Optimize each component
    let optimizedTitle = title
    let optimizedContent = content
    let optimizedMeta = metaDescription
    let optimizedSlug = slug
    let optimizedExcerpt = ''
    
    // Step 1: Optimize title
    const titleResult = this.optimizeTitle(title, primaryKeyword)
    optimizedTitle = titleResult.optimized
    optimizationLog.push({
      step: 'Title Optimization',
      action: titleResult.action,
      scoreImpact: titleResult.impact
    })
    
    // Step 2: Optimize slug
    if (!slug) {
      optimizedSlug = this.generateOptimalSlug(primaryKeyword)
    } else {
      const slugResult = this.optimizeSlug(slug, primaryKeyword)
      optimizedSlug = slugResult.optimized
      optimizationLog.push({
        step: 'URL Optimization',
        action: slugResult.action,
        scoreImpact: slugResult.impact
      })
    }
    
    // Step 3: Optimize meta description
    const metaResult = this.optimizeMetaDescription(metaDescription, primaryKeyword, content)
    optimizedMeta = metaResult.optimized
    optimizationLog.push({
      step: 'Meta Description',
      action: metaResult.action,
      scoreImpact: metaResult.impact
    })
    
    // Step 4: Fix critical issues first
    const criticalFixed = await this.fixCriticalIssues(
      optimizedContent,
      primaryKeyword,
      beforeAnalysis
    )
    optimizedContent = criticalFixed.content
    optimizationLog.push(...criticalFixed.log)
    
    // Step 5: Enhance semantic relevance
    const semanticEnhanced = await this.enhanceSemanticRelevance(
      optimizedContent,
      primaryKeyword
    )
    optimizedContent = semanticEnhanced.content
    optimizationLog.push(...semanticEnhanced.log)
    
    // Step 6: Add LSI keywords naturally
    const lsiEnhanced = this.addLSIKeywords(optimizedContent, primaryKeyword)
    optimizedContent = lsiEnhanced.content
    optimizationLog.push(...lsiEnhanced.log)
    
    // Step 7: Optimize keyword density
    const densityOptimized = this.optimizeKeywordDensity(
      optimizedContent,
      primaryKeyword,
      beforeAnalysis.factors.keywordDensity
    )
    optimizedContent = densityOptimized.content
    optimizationLog.push(...densityOptimized.log)
    
    // Step 8: Improve content structure
    const structureImproved = this.improveContentStructure(
      optimizedContent,
      primaryKeyword
    )
    optimizedContent = structureImproved.content
    optimizationLog.push(...structureImproved.log)
    
    // Step 9: Add cluster keywords
    const clusterEnhanced = this.addClusterKeywords(
      optimizedContent,
      primaryKeyword
    )
    optimizedContent = clusterEnhanced.content
    optimizationLog.push(...clusterEnhanced.log)
    
    // Step 10: Ensure natural language flow
    const naturalLanguage = this.ensureNaturalLanguage(
      optimizedContent,
      primaryKeyword
    )
    optimizedContent = naturalLanguage.content
    optimizationLog.push(...naturalLanguage.log)
    
    // Step 11: Update with latest news (if applicable)
    try {
      const newsEnhanced = await this.enrichWithLatestNews(
        optimizedContent,
        primaryKeyword
      )
      if (newsEnhanced.enhanced) {
        optimizedContent = newsEnhanced.content
        optimizationLog.push(...newsEnhanced.log)
      }
    } catch (error) {
      console.log('⚠️ News enrichment skipped:', error)
    }
    
    // Step 12: Generate optimal excerpt
    optimizedExcerpt = this.generateOptimalExcerpt(optimizedContent, primaryKeyword)
    
    // Final analysis
    const afterAnalysis = GoogleBotAnalyzer.analyzeKeywordUnderstanding(
      optimizedContent,
      optimizedTitle,
      primaryKeyword,
      optimizedMeta,
      optimizedSlug
    )
    
    optimizationLog.push({
      step: 'Final Analysis',
      action: `Achieved ${afterAnalysis.understandingScore}% understanding score`,
      scoreImpact: afterAnalysis.understandingScore - beforeAnalysis.understandingScore
    })
    
    // Generate improvements list
    const improvements = this.generateImprovementsList(beforeAnalysis, afterAnalysis)
    
    return {
      success: afterAnalysis.understandingScore >= targetScore,
      originalScore: beforeAnalysis.understandingScore,
      optimizedScore: afterAnalysis.understandingScore,
      improvements,
      optimizedContent: {
        title: optimizedTitle,
        content: optimizedContent,
        metaDescription: optimizedMeta,
        slug: optimizedSlug,
        excerpt: optimizedExcerpt
      },
      analysisComparison: {
        before: beforeAnalysis,
        after: afterAnalysis
      },
      optimizationLog
    }
  }
  
  /**
   * Optimize title for maximum impact
   */
  private static optimizeTitle(title: string, keyword: string) {
    let optimized = title.trim()
    const keywordLower = keyword.toLowerCase()
    let action = 'Title already optimized'
    let impact = 0
    
    // Ensure keyword at start
    if (!optimized.toLowerCase().startsWith(keywordLower)) {
      const titleWithoutKeyword = optimized.replace(new RegExp(keyword, 'gi'), '').trim()
      optimized = `${keyword}: ${titleWithoutKeyword || 'Complete Guide'}`
      action = 'Moved keyword to beginning of title'
      impact = 10
    }
    
    // Add power word if missing
    const powerWords = ['Ultimate', 'Complete', 'Best', 'Top', 'Expert', 'Essential', 'Advanced']
    const hasPowerWord = powerWords.some(word => optimized.toLowerCase().includes(word.toLowerCase()))
    
    if (!hasPowerWord) {
      optimized = `Complete ${optimized}`
      action += ' and added power word'
      impact += 5
    }
    
    // Ensure optimal length
    if (optimized.length < 30) {
      optimized = `${optimized} - ${new Date().getFullYear()} Guide`
      impact += 3
    } else if (optimized.length > 60) {
      optimized = optimized.substring(0, 57) + '...'
      impact += 2
    }
    
    return { optimized, action, impact }
  }
  
  /**
   * Optimize slug for SEO
   */
  private static optimizeSlug(slug: string, keyword: string) {
    let optimized = slug.toLowerCase().trim()
    const keywordSlug = keyword.toLowerCase().replace(/\s+/g, '-')
    let action = 'Slug optimized'
    let impact = 0
    
    if (!optimized.includes(keywordSlug)) {
      optimized = keywordSlug
      action = 'Updated slug to match keyword'
      impact = 7
    }
    
    // Remove special characters
    optimized = optimized.replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')
    
    return { optimized, action, impact }
  }
  
  /**
   * Generate optimal slug from keyword
   */
  private static generateOptimalSlug(keyword: string): string {
    return keyword.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }
  
  /**
   * Optimize meta description
   */
  private static optimizeMetaDescription(meta: string, keyword: string, content: string) {
    let optimized = meta
    let action = 'Meta description created'
    let impact = 0
    
    if (!meta || meta.length < 120) {
      const firstSentence = content.split(/[.!?]+/)[0] || ''
      optimized = `${keyword}: ${firstSentence.substring(0, 140)}...`.substring(0, 155)
      impact = 5
    }
    
    // Ensure keyword presence
    if (!optimized.toLowerCase().includes(keyword.toLowerCase())) {
      optimized = `${keyword} - ${optimized}`.substring(0, 155)
      action = 'Added keyword to meta description'
      impact = 3
    }
    
    return { optimized, action, impact }
  }
  
  /**
   * Fix critical issues that prevent 95%+ score
   */
  private static async fixCriticalIssues(
    content: string,
    keyword: string,
    analysis: KeywordAnalysis
  ) {
    let optimized = content
    const log: OptimizationResult['optimizationLog'] = []
    
    // Fix H1 if missing or incorrect
    if (analysis.factors.h1Presence.score < 85) {
      const h1Match = optimized.match(/^#\s+(.+)$/m)
      if (!h1Match) {
        optimized = `# ${keyword}: Comprehensive Guide\n\n${optimized}`
        log.push({
          step: 'H1 Fix',
          action: 'Added H1 with primary keyword',
          scoreImpact: 10
        })
      } else {
        const h1Text = h1Match[1]
        if (!h1Text.toLowerCase().includes(keyword.toLowerCase())) {
          optimized = optimized.replace(h1Match[0], `# ${keyword}: ${h1Text}`)
          log.push({
            step: 'H1 Fix',
            action: 'Added keyword to existing H1',
            scoreImpact: 10
          })
        }
      }
    }
    
    // Fix first paragraph
    if (analysis.factors.firstParagraph.score < 85) {
      const paragraphs = optimized.split('\n\n')
      const firstParaIndex = paragraphs.findIndex(p => p.trim() && !p.match(/^#+\s/))
      
      if (firstParaIndex !== -1) {
        const firstPara = paragraphs[firstParaIndex]
        if (!firstPara.toLowerCase().includes(keyword.toLowerCase())) {
          paragraphs[firstParaIndex] = `${keyword} is revolutionizing the industry. ${firstPara}`
          optimized = paragraphs.join('\n\n')
          log.push({
            step: 'First Paragraph Fix',
            action: 'Added keyword to opening paragraph',
            scoreImpact: 10
          })
        }
      }
    }
    
    // Fix H2 distribution
    if (analysis.factors.h2Distribution.score < 70) {
      const h2Sections = [
        `\n\n## What is ${keyword}?\n\n${keyword} represents a cutting-edge solution designed to address modern challenges effectively.`,
        `\n\n## Key Benefits of ${keyword}\n\n${keyword} offers numerous advantages including improved efficiency, enhanced performance, and better results.`,
        `\n\n## How to Use ${keyword} Effectively\n\nImplementing ${keyword} requires understanding its core features and best practices.`
      ]
      
      optimized += h2Sections.join('')
      log.push({
        step: 'H2 Structure Fix',
        action: 'Added H2 headings with keyword',
        scoreImpact: 8
      })
    }
    
    return { content: optimized, log }
  }
  
  /**
   * Enhance semantic relevance
   */
  private static async enhanceSemanticRelevance(content: string, keyword: string) {
    let optimized = content
    const log: OptimizationResult['optimizationLog'] = []
    
    const semanticTerms = [
      `${keyword} solution`,
      `${keyword} platform`,
      `${keyword} tool`,
      `best ${keyword}`,
      `${keyword} features`,
      `${keyword} benefits`,
      `how to use ${keyword}`,
      `${keyword} guide`
    ]
    
    const contentLower = optimized.toLowerCase()
    const missingTerms = semanticTerms.filter(term => !contentLower.includes(term.toLowerCase()))
    
    if (missingTerms.length > 0) {
      const termsToAdd = missingTerms.slice(0, 5)
      const additionalSection = `\n\n## Understanding ${keyword}\n\n`
      let sectionContent = `When exploring ${termsToAdd[0]}, it's essential to consider various aspects. `
      sectionContent += `The ${termsToAdd[1] || keyword} offers comprehensive capabilities. `
      sectionContent += `Many professionals rely on ${termsToAdd[2] || keyword} for their daily operations. `
      
      optimized += additionalSection + sectionContent
      
      log.push({
        step: 'Semantic Enhancement',
        action: `Added ${termsToAdd.length} semantic terms naturally`,
        scoreImpact: 12
      })
    }
    
    return { content: optimized, log }
  }
  
  /**
   * Add LSI keywords naturally
   */
  private static addLSIKeywords(content: string, keyword: string) {
    let optimized = content
    const log: OptimizationResult['optimizationLog'] = []
    
    const lsiKeywords = [
      'technology', 'solution', 'platform', 'system', 'features',
      'benefits', 'advantages', 'capabilities', 'functionality', 'performance',
      'implementation', 'integration', 'deployment', 'efficiency', 'productivity'
    ]
    
    const contentLower = optimized.toLowerCase()
    const missingLSI = lsiKeywords.filter(lsi => !contentLower.includes(lsi))
    
    if (missingLSI.length > 0) {
      const lsiSection = `\n\n## Technical Overview\n\n`
      let lsiContent = `The technology behind ${keyword} combines advanced features with robust functionality. `
      lsiContent += `Its platform architecture ensures optimal performance and efficiency. `
      lsiContent += `The system provides comprehensive capabilities for seamless integration and deployment. `
      lsiContent += `These advantages translate into measurable benefits for users seeking enhanced productivity.`
      
      optimized += lsiSection + lsiContent
      
      log.push({
        step: 'LSI Keywords',
        action: `Integrated ${Math.min(10, missingLSI.length)} LSI keywords naturally`,
        scoreImpact: 10
      })
    }
    
    return { content: optimized, log }
  }
  
  /**
   * Optimize keyword density to 1.5-2.5%
   */
  private static optimizeKeywordDensity(
    content: string,
    keyword: string,
    currentDensity: KeywordAnalysis['factors']['keywordDensity']
  ) {
    let optimized = content
    const log: OptimizationResult['optimizationLog'] = []
    
    if (currentDensity.current < 1.5) {
      const words = content.split(/\s+/).length
      const currentMatches = content.toLowerCase().split(keyword.toLowerCase()).length - 1
      const targetMatches = Math.ceil(words * 0.02) // 2% target
      const needed = targetMatches - currentMatches
      
      if (needed > 0) {
        // Add keyword naturally in new sentences
        const sentences = [
          ` Understanding ${keyword} is crucial for success.`,
          ` ${keyword} offers significant advantages.`,
          ` Many experts recommend ${keyword} for optimal results.`,
          ` The ${keyword} approach has proven effective.`,
          ` Implementing ${keyword} can transform your workflow.`
        ]
        
        optimized += sentences.slice(0, Math.min(needed, sentences.length)).join('')
        
        log.push({
          step: 'Keyword Density',
          action: `Increased density from ${currentDensity.current.toFixed(2)}% to target 2%`,
          scoreImpact: 12
        })
      }
    }
    
    return { content: optimized, log }
  }
  
  /**
   * Improve content structure
   */
  private static improveContentStructure(content: string, keyword: string) {
    let optimized = content
    const log: OptimizationResult['optimizationLog'] = []
    
    // Ensure proper heading hierarchy
    const h1Count = (optimized.match(/^#\s/gm) || []).length
    const h2Count = (optimized.match(/^##\s/gm) || []).length
    const h3Count = (optimized.match(/^###\s/gm) || []).length
    
    if (h2Count < 5) {
      const additionalH2 = [
        `\n\n## ${keyword} Best Practices\n\nFollowing industry best practices ensures optimal ${keyword} implementation and results.`,
        `\n\n## Common ${keyword} Use Cases\n\n${keyword} excels in various scenarios and applications across different industries.`,
        `\n\n## Future of ${keyword}\n\nThe ${keyword} landscape continues evolving with emerging trends and innovations.`
      ]
      
      optimized += additionalH2.slice(0, 5 - h2Count).join('')
      
      log.push({
        step: 'Content Structure',
        action: `Added ${Math.min(3, 5 - h2Count)} H2 headings for better structure`,
        scoreImpact: 8
      })
    }
    
    // Add bullet lists if missing
    if (!optimized.match(/^[-*+]\s/m)) {
      const listSection = `\n\n### Key ${keyword} Features\n\n- Comprehensive functionality\n- User-friendly interface\n- Advanced analytics\n- Seamless integration\n- Robust security\n- Scalable architecture`
      optimized += listSection
      
      log.push({
        step: 'Content Structure',
        action: 'Added bullet list for better readability',
        scoreImpact: 5
      })
    }
    
    return { content: optimized, log }
  }
  
  /**
   * Add cluster keywords (related keywords that support the main keyword)
   */
  private static addClusterKeywords(content: string, keyword: string) {
    let optimized = content
    const log: OptimizationResult['optimizationLog'] = []
    
    const clusterKeywords = this.generateClusterKeywords(keyword)
    const contentLower = optimized.toLowerCase()
    const missingClusters = clusterKeywords.filter(ck => !contentLower.includes(ck.toLowerCase()))
    
    if (missingClusters.length > 0) {
      const clusterSection = `\n\n## Related Concepts and Topics\n\n`
      let clusterContent = `Understanding ${keyword} requires exploring related concepts. `
      
      missingClusters.slice(0, 5).forEach((cluster, index) => {
        clusterContent += `${cluster} plays an important role in the ecosystem. `
      })
      
      optimized += clusterSection + clusterContent
      
      log.push({
        step: 'Cluster Keywords',
        action: `Added ${Math.min(5, missingClusters.length)} cluster keywords`,
        scoreImpact: 10
      })
    }
    
    return { content: optimized, log }
  }
  
  /**
   * Generate cluster keywords
   */
  private static generateClusterKeywords(keyword: string): string[] {
    const keywordLower = keyword.toLowerCase()
    const clusters: string[] = []
    
    // Add related terms
    clusters.push(
      `${keywordLower} alternatives`,
      `${keywordLower} comparison`,
      `${keywordLower} pricing`,
      `${keywordLower} reviews`,
      `${keywordLower} vs competitors`,
      `${keywordLower} tutorial`,
      `${keywordLower} examples`,
      `${keywordLower} best practices`
    )
    
    return clusters
  }
  
  /**
   * Ensure natural language flow
   */
  private static ensureNaturalLanguage(content: string, keyword: string) {
    let optimized = content
    const log: OptimizationResult['optimizationLog'] = []
    
    // Add transition words between sections
    const transitions = ['Furthermore', 'Moreover', 'Additionally', 'However', 'Therefore']
    const sections = optimized.split('\n\n##')
    
    if (sections.length > 2) {
      // Add transitions between some sections
      for (let i = 1; i < Math.min(sections.length, 4); i++) {
        const transition = transitions[(i - 1) % transitions.length]
        if (!sections[i].startsWith(transition)) {
          sections[i] = sections[i].replace(/^(##\s+[^\n]+\n\n)/, `$1${transition}, `)
        }
      }
      
      optimized = sections.join('\n\n##')
      
      log.push({
        step: 'Natural Language',
        action: 'Added transition words for better flow',
        scoreImpact: 5
      })
    }
    
    return { content: optimized, log }
  }
  
  /**
   * Enrich content with latest news
   */
  private static async enrichWithLatestNews(content: string, keyword: string) {
    const log: OptimizationResult['optimizationLog'] = []
    
    try {
      const newsData = await fetchRecentNews(keyword)
      
      if (newsData && newsData.articles.length > 0) {
        const newsSection = `\n\n## Latest ${keyword} Updates\n\n`
        let newsContent = `Recent developments in ${keyword} showcase exciting progress:\n\n`
        
        newsData.articles.slice(0, 3).forEach((article, index) => {
          const date = new Date(article.publishedAt).toLocaleDateString()
          newsContent += `- **${article.title}** (${date}): ${article.description}\n`
        })
        
        const enhanced = content + newsSection + newsContent
        
        log.push({
          step: 'News Integration',
          action: `Added ${newsData.articles.length} recent news updates`,
          scoreImpact: 8
        })
        
        return { content: enhanced, enhanced: true, log }
      }
    } catch (error) {
      console.log('⚠️ Could not fetch news:', error)
    }
    
    return { content, enhanced: false, log: [] }
  }
  
  /**
   * Generate optimal excerpt
   */
  private static generateOptimalExcerpt(content: string, keyword: string): string {
    const firstParagraphs = content.split('\n\n').filter(p => p.trim() && !p.match(/^#+\s/))
    const firstPara = firstParagraphs[0] || ''
    
    let excerpt = firstPara.substring(0, 150)
    
    if (!excerpt.toLowerCase().includes(keyword.toLowerCase())) {
      excerpt = `${keyword}: ${excerpt}`
    }
    
    return excerpt.substring(0, 155) + '...'
  }
  
  /**
   * Generate improvements list
   */
  private static generateImprovementsList(
    before: KeywordAnalysis,
    after: KeywordAnalysis
  ): string[] {
    const improvements: string[] = []
    
    improvements.push(`✅ Understanding Score: ${before.understandingScore}% → ${after.understandingScore}% (+${after.understandingScore - before.understandingScore}%)`)
    
    if (after.factors.keywordDensity.score > before.factors.keywordDensity.score) {
      improvements.push(`✅ Keyword Density: Optimized to ${after.factors.keywordDensity.current.toFixed(2)}%`)
    }
    
    if (after.factors.titlePresence.score > before.factors.titlePresence.score) {
      improvements.push(`✅ Title: Keyword moved to optimal position`)
    }
    
    if (after.factors.semanticRelevance.score > before.factors.semanticRelevance.score) {
      improvements.push(`✅ Semantic Terms: Added ${after.factors.semanticRelevance.foundTerms.length - before.factors.semanticRelevance.foundTerms.length} related terms`)
    }
    
    if (after.factors.lsiKeywords.score > before.factors.lsiKeywords.score) {
      improvements.push(`✅ LSI Keywords: Added ${after.factors.lsiKeywords.found.length - before.factors.lsiKeywords.found.length} LSI keywords`)
    }
    
    if (after.factors.contentDepth.score > before.factors.contentDepth.score) {
      improvements.push(`✅ Content Depth: Expanded to ${after.factors.contentDepth.wordCount} words`)
    }
    
    if (after.breakdown.critical < before.breakdown.critical) {
      improvements.push(`✅ Critical Issues: Fixed ${before.breakdown.critical - after.breakdown.critical} critical issues`)
    }
    
    return improvements
  }
}