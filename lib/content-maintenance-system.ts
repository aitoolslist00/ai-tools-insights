/**
 * Content Maintenance System
 * Automatically updates content with latest news and maintains freshness
 */

import { fetchRecentNews, NewsData } from './news-fetcher'
import { AdvancedContentOptimizer } from './advanced-content-optimizer'
import { GoogleBotAnalyzer } from './google-bot-analyzer'

export interface MaintenanceResult {
  success: boolean
  contentId: string
  updates: {
    newsAdded: boolean
    scoreImproved: boolean
    freshness: 'current' | 'updated' | 'outdated'
  }
  metrics: {
    originalScore: number
    currentScore: number
    newsArticlesAdded: number
    lastUpdated: string
  }
  recommendations: string[]
}

export interface ContentHealthCheck {
  contentId: string
  primaryKeyword: string
  currentScore: number
  ageInDays: number
  freshnessStatus: 'fresh' | 'aging' | 'stale'
  needsUpdate: boolean
  updatePriority: 'high' | 'medium' | 'low'
  recommendations: string[]
}

export class ContentMaintenanceSystem {
  
  /**
   * Check content health and determine if updates are needed
   */
  static async checkContentHealth(
    contentId: string,
    title: string,
    content: string,
    primaryKeyword: string,
    publishedDate: Date
  ): Promise<ContentHealthCheck> {
    
    // Calculate age
    const now = new Date()
    const ageInDays = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24))
    
    // Analyze current score
    const analysis = GoogleBotAnalyzer.analyzeKeywordUnderstanding(
      content,
      title,
      primaryKeyword,
      '',
      ''
    )
    
    // Determine freshness status
    let freshnessStatus: 'fresh' | 'aging' | 'stale' = 'fresh'
    if (ageInDays > 180) {
      freshnessStatus = 'stale'
    } else if (ageInDays > 90) {
      freshnessStatus = 'aging'
    }
    
    // Determine if update is needed
    const needsUpdate = 
      analysis.understandingScore < 95 || 
      freshnessStatus === 'stale' ||
      (freshnessStatus === 'aging' && analysis.understandingScore < 90)
    
    // Determine priority
    let updatePriority: 'high' | 'medium' | 'low' = 'low'
    if (analysis.understandingScore < 85 || freshnessStatus === 'stale') {
      updatePriority = 'high'
    } else if (analysis.understandingScore < 95 || freshnessStatus === 'aging') {
      updatePriority = 'medium'
    }
    
    // Generate recommendations
    const recommendations: string[] = []
    
    if (analysis.understandingScore < 95) {
      recommendations.push(`Optimize content to reach 95%+ Google Bot understanding (currently ${analysis.understandingScore}%)`)
    }
    
    if (freshnessStatus === 'stale') {
      recommendations.push(`Content is ${ageInDays} days old - add latest news and updates`)
    } else if (freshnessStatus === 'aging') {
      recommendations.push(`Content is aging (${ageInDays} days) - consider refreshing with recent information`)
    }
    
    if (analysis.issues.filter(i => i.severity === 'critical').length > 0) {
      recommendations.push(`Fix ${analysis.issues.filter(i => i.severity === 'critical').length} critical SEO issues`)
    }
    
    return {
      contentId,
      primaryKeyword,
      currentScore: analysis.understandingScore,
      ageInDays,
      freshnessStatus,
      needsUpdate,
      updatePriority,
      recommendations
    }
  }
  
  /**
   * Perform automatic content maintenance
   */
  static async performMaintenance(
    contentId: string,
    title: string,
    content: string,
    primaryKeyword: string,
    metaDescription: string,
    slug: string
  ): Promise<MaintenanceResult> {
    
    console.log(`🔧 Starting maintenance for content: ${contentId}`)
    
    // Get initial score
    const initialAnalysis = GoogleBotAnalyzer.analyzeKeywordUnderstanding(
      content,
      title,
      primaryKeyword,
      metaDescription,
      slug
    )
    
    let updatedContent = content
    let newsAdded = false
    let newsArticlesAdded = 0
    
    // Step 1: Fetch and add latest news
    try {
      const newsData = await fetchRecentNews(primaryKeyword)
      
      if (newsData && newsData.articles.length > 0) {
        console.log(`📰 Found ${newsData.articles.length} recent articles`)
        
        // Check if content already has news section
        const hasNewsSection = content.toLowerCase().includes('latest') || 
                               content.toLowerCase().includes('recent updates')
        
        if (!hasNewsSection) {
          const newsSection = this.generateNewsSection(primaryKeyword, newsData)
          updatedContent = this.insertNewsSection(updatedContent, newsSection)
          newsAdded = true
          newsArticlesAdded = newsData.articles.length
          console.log(`✅ Added news section with ${newsArticlesAdded} articles`)
        } else {
          console.log(`ℹ️ News section already exists, updating...`)
          updatedContent = this.updateNewsSection(updatedContent, primaryKeyword, newsData)
          newsAdded = true
          newsArticlesAdded = newsData.articles.length
        }
      }
    } catch (error) {
      console.log(`⚠️ Could not fetch news:`, error)
    }
    
    // Step 2: Re-optimize if score is below 95%
    let scoreImproved = false
    let finalScore = initialAnalysis.understandingScore
    
    if (initialAnalysis.understandingScore < 95) {
      console.log(`📈 Optimizing content from ${initialAnalysis.understandingScore}% to 95%+`)
      
      try {
        const optimizationResult = await AdvancedContentOptimizer.optimizeToTarget(
          title,
          updatedContent,
          primaryKeyword,
          metaDescription,
          slug,
          95
        )
        
        if (optimizationResult.success) {
          updatedContent = optimizationResult.optimizedContent.content
          finalScore = optimizationResult.optimizedScore
          scoreImproved = true
          console.log(`✅ Score improved: ${initialAnalysis.understandingScore}% → ${finalScore}%`)
        }
      } catch (error) {
        console.log(`⚠️ Optimization skipped:`, error)
      }
    }
    
    // Determine freshness status
    let freshness: 'current' | 'updated' | 'outdated' = 'current'
    if (newsAdded || scoreImproved) {
      freshness = 'updated'
    } else if (initialAnalysis.understandingScore < 85) {
      freshness = 'outdated'
    }
    
    // Generate recommendations
    const recommendations = this.generateMaintenanceRecommendations(
      initialAnalysis.understandingScore,
      finalScore,
      newsAdded,
      scoreImproved
    )
    
    return {
      success: true,
      contentId,
      updates: {
        newsAdded,
        scoreImproved,
        freshness
      },
      metrics: {
        originalScore: initialAnalysis.understandingScore,
        currentScore: finalScore,
        newsArticlesAdded,
        lastUpdated: new Date().toISOString()
      },
      recommendations
    }
  }
  
  /**
   * Generate news section from NewsData
   */
  private static generateNewsSection(keyword: string, newsData: NewsData): string {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    let section = `\n\n## Latest ${keyword} News and Updates (${today})\n\n`
    section += `Stay informed with the most recent developments in ${keyword}:\n\n`
    
    newsData.articles.slice(0, 5).forEach((article, index) => {
      const publishDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
      
      section += `### ${index + 1}. ${article.title}\n\n`
      section += `**Published:** ${publishDate} | **Source:** ${article.source}\n\n`
      if (article.description) {
        section += `${article.description}\n\n`
      }
      section += `[Read more](${article.url})\n\n`
    })
    
    section += `*Note: This section is automatically updated with the latest ${keyword} news to ensure content freshness.*\n\n`
    
    return section
  }
  
  /**
   * Insert news section into content
   */
  private static insertNewsSection(content: string, newsSection: string): string {
    // Try to insert before conclusion or at the end
    const conclusionPatterns = [
      /\n\n##\s+Conclusion/i,
      /\n\n##\s+Final Thoughts/i,
      /\n\n##\s+Summary/i,
      /\n\n##\s+Wrap Up/i
    ]
    
    for (const pattern of conclusionPatterns) {
      if (pattern.test(content)) {
        return content.replace(pattern, `${newsSection}$&`)
      }
    }
    
    // If no conclusion found, append to end
    return content + newsSection
  }
  
  /**
   * Update existing news section
   */
  private static updateNewsSection(content: string, keyword: string, newsData: NewsData): string {
    // Find and replace existing news section
    const newsPattern = /##\s+Latest.*?News.*?\n\n[\s\S]*?(?=\n\n##|\n\n\*Note:.*?\*|$)/i
    
    const newSection = this.generateNewsSection(keyword, newsData)
    
    if (newsPattern.test(content)) {
      return content.replace(newsPattern, newSection.trim())
    }
    
    // If pattern not found, insert new section
    return this.insertNewsSection(content, newSection)
  }
  
  /**
   * Generate maintenance recommendations
   */
  private static generateMaintenanceRecommendations(
    originalScore: number,
    currentScore: number,
    newsAdded: boolean,
    scoreImproved: boolean
  ): string[] {
    const recommendations: string[] = []
    
    if (currentScore >= 95) {
      recommendations.push('✅ Content is fully optimized for Google Bot understanding')
    } else {
      recommendations.push(`🎯 Consider further optimization to reach 95%+ (currently ${currentScore}%)`)
    }
    
    if (newsAdded) {
      recommendations.push('✅ Latest news and updates added for freshness')
      recommendations.push('🔄 Schedule next update in 30-45 days to maintain freshness')
    } else {
      recommendations.push('📰 Consider adding recent news and developments')
    }
    
    if (scoreImproved) {
      recommendations.push(`📈 Score improved by ${(currentScore - originalScore).toFixed(1)}%`)
    }
    
    if (currentScore < 90) {
      recommendations.push('⚠️ Priority: Run full optimization workflow to improve ranking potential')
    }
    
    recommendations.push('📊 Monitor performance and update quarterly for best results')
    
    return recommendations
  }
  
  /**
   * Batch check multiple content items
   */
  static async batchHealthCheck(
    contentItems: Array<{
      contentId: string
      title: string
      content: string
      primaryKeyword: string
      publishedDate: Date
    }>
  ): Promise<ContentHealthCheck[]> {
    
    const healthChecks: ContentHealthCheck[] = []
    
    for (const item of contentItems) {
      try {
        const healthCheck = await this.checkContentHealth(
          item.contentId,
          item.title,
          item.content,
          item.primaryKeyword,
          item.publishedDate
        )
        healthChecks.push(healthCheck)
      } catch (error) {
        console.error(`Failed to check health for ${item.contentId}:`, error)
      }
    }
    
    // Sort by priority
    return healthChecks.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.updatePriority] - priorityOrder[b.updatePriority]
    })
  }
}