import { BlogPost } from './blog-data'
import { RealSEOEngine, RealSEOAnalysis } from './seo-engine-real'

export interface SEOOptimizationResult {
  success: boolean
  originalScore: number
  optimizedScore: number
  improvements: string[]
  optimizedContent: {
    title: string
    content: string
    excerpt: string
    tags: string[]
    seo: any
  }
  changes: {
    category: string
    before: string
    after: string
    impact: number
  }[]
}

export class SEOAutoOptimizer {
  
  static async optimizeToMaximum(
    title: string,
    content: string,
    focusKeyword: string,
    category: string = 'ai-tools',
    targetAudience: string = 'professionals and businesses'
  ): Promise<SEOOptimizationResult> {
    
    // Get initial analysis
    const initialAnalysis = RealSEOEngine.analyzeContent(title, content, focusKeyword, category)
    
    let optimizedTitle = title
    let optimizedContent = content
    let optimizedTags: string[] = []
    const improvements: string[] = []
    const changes: any[] = []
    
    // 1. OPTIMIZE TITLE (Target: 20/20 points)
    const titleOptimization = this.optimizeTitle(title, focusKeyword)
    if (titleOptimization.improved) {
      optimizedTitle = titleOptimization.optimizedTitle
      improvements.push(`✅ Title optimized: ${titleOptimization.improvements.join(', ')}`)
      changes.push({
        category: 'Title',
        before: title,
        after: optimizedTitle,
        impact: titleOptimization.scoreImprovement
      })
    }
    
    // 2. OPTIMIZE CONTENT STRUCTURE (Target: 25/25 points)
    const contentOptimization = this.optimizeContentStructure(optimizedContent, focusKeyword, targetAudience)
    if (contentOptimization.improved) {
      optimizedContent = contentOptimization.optimizedContent
      improvements.push(`✅ Content structure enhanced: ${contentOptimization.improvements.join(', ')}`)
      changes.push({
        category: 'Content Structure',
        before: 'Original content',
        after: 'SEO-optimized content with proper structure',
        impact: contentOptimization.scoreImprovement
      })
    }
    
    // 3. OPTIMIZE KEYWORD USAGE (Target: 15/15 points)
    const keywordOptimization = this.optimizeKeywordUsage(optimizedContent, focusKeyword)
    if (keywordOptimization.improved) {
      optimizedContent = keywordOptimization.optimizedContent
      improvements.push(`✅ Keyword optimization: ${keywordOptimization.improvements.join(', ')}`)
      changes.push({
        category: 'Keyword Usage',
        before: 'Suboptimal keyword density',
        after: `Optimal keyword density (${keywordOptimization.finalDensity}%)`,
        impact: keywordOptimization.scoreImprovement
      })
    }
    
    // 4. ENHANCE READABILITY (Target: 10/10 points)
    const readabilityOptimization = this.optimizeReadability(optimizedContent)
    if (readabilityOptimization.improved) {
      optimizedContent = readabilityOptimization.optimizedContent
      improvements.push(`✅ Readability improved: ${readabilityOptimization.improvements.join(', ')}`)
      changes.push({
        category: 'Readability',
        before: 'Complex sentences and structure',
        after: 'Clear, readable content with good flow',
        impact: readabilityOptimization.scoreImprovement
      })
    }
    
    // 5. OPTIMIZE CONTENT LENGTH (Ensure 1500+ words)
    const lengthOptimization = this.optimizeContentLength(optimizedContent, focusKeyword, category)
    if (lengthOptimization.improved) {
      optimizedContent = lengthOptimization.optimizedContent
      improvements.push(`✅ Content expanded: ${lengthOptimization.improvements.join(', ')}`)
      changes.push({
        category: 'Content Length',
        before: `${lengthOptimization.originalWordCount} words`,
        after: `${lengthOptimization.finalWordCount} words`,
        impact: lengthOptimization.scoreImprovement
      })
    }
    
    // 6. GENERATE OPTIMAL TAGS
    optimizedTags = this.generateOptimalTags(optimizedTitle, optimizedContent, focusKeyword, category)
    improvements.push(`✅ Generated ${optimizedTags.length} SEO-optimized tags`)
    
    // 7. CREATE PERFECT EXCERPT
    const optimizedExcerpt = this.generateOptimalExcerpt(optimizedContent, focusKeyword)
    improvements.push(`✅ Created SEO-optimized excerpt with focus keyword`)
    
    // 8. GENERATE COMPREHENSIVE SEO METADATA
    const seoMetadata = this.generateOptimalSEOMetadata(optimizedTitle, optimizedExcerpt, optimizedTags, focusKeyword)
    improvements.push(`✅ Generated complete SEO metadata (title, description, keywords, social media)`)
    
    // Get final analysis
    const finalAnalysis = RealSEOEngine.analyzeContent(optimizedTitle, optimizedContent, focusKeyword, category)
    
    return {
      success: true,
      originalScore: initialAnalysis.score,
      optimizedScore: finalAnalysis.score,
      improvements,
      optimizedContent: {
        title: optimizedTitle,
        content: optimizedContent,
        excerpt: optimizedExcerpt,
        tags: optimizedTags,
        seo: seoMetadata
      },
      changes
    }
  }
  
  private static optimizeTitle(title: string, focusKeyword: string) {
    // Clean the title first - remove markdown symbols and fix formatting
    let optimizedTitle = title
      .replace(/^#+\s*/, '') // Remove leading markdown headers
      .replace(/#+\s*/g, '') // Remove any other # symbols
      .replace(/\s*:\s*#+\s*/g, ': ') // Fix malformed title separators
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
    
    const improvements: string[] = []
    let scoreImprovement = 0
    let improved = false
    
    // If title was cleaned, note the improvement
    if (optimizedTitle !== title) {
      improvements.push('Cleaned title formatting and removed markdown symbols')
      scoreImprovement += 2
      improved = true
    }
    
    // Ensure focus keyword is at the beginning
    if (!optimizedTitle.toLowerCase().startsWith(focusKeyword.toLowerCase())) {
      optimizedTitle = `${focusKeyword}: ${optimizedTitle}`
      improvements.push('Moved focus keyword to beginning')
      scoreImprovement += 3
      improved = true
    }
    
    // Optimize length (30-60 characters)
    if (optimizedTitle.length < 30) {
      const powerWords = ['Ultimate Guide', 'Complete', 'Best', 'Top', '2024', 'Expert', 'Professional']
      const randomPowerWord = powerWords[Math.floor(Math.random() * powerWords.length)]
      optimizedTitle = `${randomPowerWord} ${optimizedTitle}`
      improvements.push('Extended title length with power words')
      scoreImprovement += 4
      improved = true
    } else if (optimizedTitle.length > 60) {
      optimizedTitle = optimizedTitle.substring(0, 57) + '...'
      improvements.push('Shortened title to optimal length')
      scoreImprovement += 2
      improved = true
    }
    
    // Add numbers if not present
    if (!/\d/.test(optimizedTitle)) {
      const currentYear = new Date().getFullYear()
      optimizedTitle = `${optimizedTitle} (${currentYear})`
      improvements.push('Added current year for freshness')
      scoreImprovement += 2
      improved = true
    }
    
    // Add power words if missing
    const powerWords = ['best', 'ultimate', 'complete', 'guide', 'top', 'essential', 'proven', 'expert', 'advanced']
    const hasPowerWord = powerWords.some(word => optimizedTitle.toLowerCase().includes(word))
    if (!hasPowerWord) {
      optimizedTitle = `Ultimate ${optimizedTitle}`
      improvements.push('Added power word for engagement')
      scoreImprovement += 3
      improved = true
    }
    
    return {
      optimizedTitle,
      improvements,
      scoreImprovement,
      improved
    }
  }
  
  private static optimizeContentStructure(content: string, focusKeyword: string, targetAudience: string) {
    let optimizedContent = content
    const improvements: string[] = []
    let scoreImprovement = 0
    let improved = false
    
    // Ensure focus keyword in first paragraph
    const paragraphs = content.split('\n\n')
    if (paragraphs.length > 0 && !paragraphs[0].toLowerCase().includes(focusKeyword.toLowerCase())) {
      const introSentence = `When it comes to ${focusKeyword}, ${targetAudience} need comprehensive solutions that deliver real results. `
      paragraphs[0] = introSentence + paragraphs[0]
      optimizedContent = paragraphs.join('\n\n')
      improvements.push('Added focus keyword to opening paragraph')
      scoreImprovement += 4
      improved = true
    }
    
    // Add proper heading structure if missing
    if (!content.includes('# ') && !content.includes('## ')) {
      const sections = [
        `# ${focusKeyword}: Complete Guide for ${new Date().getFullYear()}`,
        `## What is ${focusKeyword}?`,
        `## Why ${focusKeyword} Matters for Your Business`,
        `## Best Practices for ${focusKeyword}`,
        `## Top Tools and Solutions`,
        `## Implementation Guide`,
        `## Common Challenges and Solutions`,
        `## Future Trends and Predictions`,
        `## Conclusion`
      ]
      
      // Split content into sections and add headings
      const contentParts = optimizedContent.split('\n\n')
      const sectionsPerPart = Math.ceil(contentParts.length / sections.length)
      let structuredContent = ''
      
      for (let i = 0; i < sections.length && i * sectionsPerPart < contentParts.length; i++) {
        structuredContent += sections[i] + '\n\n'
        const startIdx = i * sectionsPerPart
        const endIdx = Math.min((i + 1) * sectionsPerPart, contentParts.length)
        structuredContent += contentParts.slice(startIdx, endIdx).join('\n\n') + '\n\n'
      }
      
      optimizedContent = structuredContent.trim()
      improvements.push('Added comprehensive heading structure')
      scoreImprovement += 6
      improved = true
    }
    
    // Add bullet points and lists for better structure
    if (!content.includes('- ') && !content.includes('* ')) {
      const benefitsList = `
## Key Benefits of ${focusKeyword}:

- **Improved Efficiency**: Streamline your workflow and save valuable time
- **Enhanced Performance**: Achieve better results with optimized processes
- **Cost Reduction**: Minimize expenses while maximizing output
- **Scalability**: Grow your operations without proportional cost increases
- **Competitive Advantage**: Stay ahead of competitors with cutting-edge solutions
- **User Experience**: Provide better experiences for your customers and team
- **Data-Driven Insights**: Make informed decisions based on real analytics
- **Future-Proof Technology**: Invest in solutions that will remain relevant

`
      optimizedContent = optimizedContent + benefitsList
      improvements.push('Added structured benefits list')
      scoreImprovement += 4
      improved = true
    }
    
    // Add FAQ section for better SEO
    if (!content.toLowerCase().includes('faq') && !content.toLowerCase().includes('frequently asked')) {
      const faqSection = `
## Frequently Asked Questions About ${focusKeyword}

### What is the best way to implement ${focusKeyword}?
The most effective approach to implementing ${focusKeyword} involves careful planning, proper tool selection, and gradual rollout. Start with a pilot program to test effectiveness before full deployment.

### How much does ${focusKeyword} cost?
Costs vary depending on your specific needs, scale, and chosen solutions. Most businesses see ROI within 3-6 months of implementation.

### Is ${focusKeyword} suitable for small businesses?
Absolutely! ${focusKeyword} solutions are available for businesses of all sizes, with scalable options that grow with your needs.

### What are the common challenges with ${focusKeyword}?
The most common challenges include initial setup complexity, team training, and integration with existing systems. However, these are easily overcome with proper planning and support.

### How long does it take to see results from ${focusKeyword}?
Most businesses start seeing improvements within 2-4 weeks, with significant results typically visible within 2-3 months of implementation.

`
      optimizedContent = optimizedContent + faqSection
      improvements.push('Added comprehensive FAQ section')
      scoreImprovement += 5
      improved = true
    }
    
    return {
      optimizedContent,
      improvements,
      scoreImprovement,
      improved
    }
  }
  
  private static optimizeKeywordUsage(content: string, focusKeyword: string) {
    let optimizedContent = content
    const improvements: string[] = []
    let scoreImprovement = 0
    let improved = false
    
    const words = content.split(/\s+/)
    const keywordMatches = (content.toLowerCase().match(new RegExp(focusKeyword.toLowerCase(), 'g')) || []).length
    const currentDensity = (keywordMatches / words.length) * 100
    const targetDensity = 2.5 // Optimal density
    
    if (currentDensity < 1.0) {
      // Add more keyword instances naturally
      const keywordVariations = this.generateKeywordVariations(focusKeyword)
      const sentences = content.split(/[.!?]+/)
      
      // Add keyword variations throughout content
      for (let i = 0; i < sentences.length; i += 3) {
        if (i < sentences.length && !sentences[i].toLowerCase().includes(focusKeyword.toLowerCase())) {
          const variation = keywordVariations[i % keywordVariations.length]
          sentences[i] = sentences[i] + ` This approach to ${variation} ensures optimal results.`
        }
      }
      
      optimizedContent = sentences.join('. ').replace(/\.\s*\./g, '.')
      improvements.push(`Increased keyword density from ${currentDensity.toFixed(1)}% to optimal range`)
      scoreImprovement += 6
      improved = true
    } else if (currentDensity > 4.0) {
      // Reduce keyword density to avoid over-optimization
      const keywordRegex = new RegExp(focusKeyword, 'gi')
      let matches = 0
      optimizedContent = content.replace(keywordRegex, (match) => {
        matches++
        if (matches % 3 === 0) {
          return 'this solution' // Replace every 3rd occurrence
        }
        return match
      })
      improvements.push(`Reduced keyword density from ${currentDensity.toFixed(1)}% to avoid over-optimization`)
      scoreImprovement += 4
      improved = true
    }
    
    const finalWords = optimizedContent.split(/\s+/)
    const finalMatches = (optimizedContent.toLowerCase().match(new RegExp(focusKeyword.toLowerCase(), 'g')) || []).length
    const finalDensity = (finalMatches / finalWords.length) * 100
    
    return {
      optimizedContent,
      improvements,
      scoreImprovement,
      improved,
      finalDensity: finalDensity.toFixed(1)
    }
  }
  
  private static optimizeReadability(content: string) {
    let optimizedContent = content
    const improvements: string[] = []
    let scoreImprovement = 0
    let improved = false
    
    // Break long sentences
    const sentences = content.split(/[.!?]+/)
    const longSentences = sentences.filter(s => s.split(/\s+/).length > 25)
    
    if (longSentences.length > 0) {
      sentences.forEach((sentence, index) => {
        const words = sentence.split(/\s+/)
        if (words.length > 25) {
          // Split long sentences at conjunctions
          const splitPoints = ['however', 'therefore', 'furthermore', 'moreover', 'additionally', 'consequently']
          let splitSentence = sentence
          
          splitPoints.forEach(point => {
            if (sentence.toLowerCase().includes(point)) {
              splitSentence = sentence.replace(new RegExp(`\\s+${point}\\s+`, 'gi'), `. ${point.charAt(0).toUpperCase() + point.slice(1)} `)
            }
          })
          
          sentences[index] = splitSentence
        }
      })
      
      optimizedContent = sentences.join('. ').replace(/\.\s*\./g, '.')
      improvements.push('Broke down long sentences for better readability')
      scoreImprovement += 3
      improved = true
    }
    
    // Add transition words
    const transitionWords = ['However', 'Therefore', 'Furthermore', 'Moreover', 'Additionally', 'Consequently', 'Meanwhile', 'Nevertheless']
    const paragraphs = optimizedContent.split('\n\n')
    
    paragraphs.forEach((paragraph, index) => {
      if (index > 0 && index < paragraphs.length - 1) {
        const firstSentence = paragraph.split('.')[0]
        const hasTransition = transitionWords.some(word => firstSentence.includes(word))
        
        if (!hasTransition && Math.random() > 0.7) {
          const randomTransition = transitionWords[Math.floor(Math.random() * transitionWords.length)]
          paragraphs[index] = `${randomTransition}, ${paragraph}`
        }
      }
    })
    
    if (paragraphs.join('\n\n') !== optimizedContent) {
      optimizedContent = paragraphs.join('\n\n')
      improvements.push('Added transition words for better flow')
      scoreImprovement += 2
      improved = true
    }
    
    // Ensure active voice
    const passiveIndicators = ['was', 'were', 'been', 'being']
    let passiveCount = 0
    passiveIndicators.forEach(indicator => {
      const matches = optimizedContent.toLowerCase().match(new RegExp(`\\b${indicator}\\b`, 'g'))
      if (matches) passiveCount += matches.length
    })
    
    if (passiveCount > optimizedContent.split(/\s+/).length * 0.1) {
      // Convert some passive to active voice
      optimizedContent = optimizedContent
        .replace(/was created by/gi, 'created')
        .replace(/was developed by/gi, 'developed')
        .replace(/was designed by/gi, 'designed')
        .replace(/were implemented by/gi, 'implemented')
        .replace(/is being used by/gi, 'use')
        .replace(/are being utilized by/gi, 'utilize')
      
      improvements.push('Converted passive voice to active voice')
      scoreImprovement += 2
      improved = true
    }
    
    return {
      optimizedContent,
      improvements,
      scoreImprovement,
      improved
    }
  }
  
  private static optimizeContentLength(content: string, focusKeyword: string, category: string) {
    const words = content.split(/\s+/).filter(w => w.length > 0)
    const originalWordCount = words.length
    let optimizedContent = content
    const improvements: string[] = []
    let scoreImprovement = 0
    let improved = false
    
    if (originalWordCount < 1500) {
      // Add comprehensive sections to reach optimal length
      const additionalSections = this.generateAdditionalContent(focusKeyword, category, 1500 - originalWordCount)
      optimizedContent = content + '\n\n' + additionalSections
      
      const finalWordCount = optimizedContent.split(/\s+/).filter(w => w.length > 0).length
      improvements.push(`Expanded content from ${originalWordCount} to ${finalWordCount} words`)
      scoreImprovement += Math.min(10, Math.floor((finalWordCount - originalWordCount) / 100))
      improved = true
      
      return {
        optimizedContent,
        improvements,
        scoreImprovement,
        improved,
        originalWordCount,
        finalWordCount
      }
    }
    
    return {
      optimizedContent,
      improvements,
      scoreImprovement,
      improved,
      originalWordCount,
      finalWordCount: originalWordCount
    }
  }
  
  private static generateAdditionalContent(focusKeyword: string, category: string, targetWords: number): string {
    const sections = [
      `## Advanced Strategies for ${focusKeyword}

To maximize the effectiveness of ${focusKeyword}, it's essential to implement advanced strategies that go beyond basic implementation. Professional organizations worldwide have discovered that a systematic approach yields significantly better results than ad-hoc implementations.

The key to success lies in understanding the underlying principles that make ${focusKeyword} effective. Research shows that businesses implementing comprehensive ${focusKeyword} strategies see an average improvement of 40-60% in their key performance indicators within the first quarter.

### Strategic Implementation Framework

1. **Assessment Phase**: Begin with a thorough evaluation of your current situation and identify specific areas where ${focusKeyword} can provide the most value.

2. **Planning Phase**: Develop a detailed roadmap that includes timelines, resource allocation, and success metrics.

3. **Execution Phase**: Implement ${focusKeyword} solutions systematically, starting with high-impact, low-risk initiatives.

4. **Optimization Phase**: Continuously monitor performance and make data-driven adjustments to maximize effectiveness.`,

      `## Industry Best Practices for ${focusKeyword}

Leading organizations across various industries have established proven methodologies for implementing ${focusKeyword} successfully. These best practices have been refined through years of real-world application and continuous improvement.

### Enterprise-Level Implementation

Large enterprises typically approach ${focusKeyword} with a phased rollout strategy that minimizes risk while maximizing adoption rates. This approach involves:

- **Pilot Programs**: Starting with small, controlled implementations to validate effectiveness
- **Stakeholder Engagement**: Ensuring buy-in from all levels of the organization
- **Training and Support**: Providing comprehensive education and ongoing assistance
- **Performance Monitoring**: Establishing clear metrics and regular review processes

### Small to Medium Business Approaches

Smaller organizations often benefit from more agile implementation strategies that can be adapted quickly based on results and changing needs. Key considerations include:

- **Resource Optimization**: Making the most of limited budgets and personnel
- **Scalable Solutions**: Choosing options that can grow with the business
- **Quick Wins**: Focusing on implementations that provide immediate value
- **Vendor Partnerships**: Leveraging external expertise when internal resources are limited`,

      `## Measuring Success with ${focusKeyword}

Effective measurement is crucial for understanding the true impact of ${focusKeyword} initiatives. Organizations that implement comprehensive measurement frameworks are 3x more likely to achieve their desired outcomes.

### Key Performance Indicators (KPIs)

The most successful ${focusKeyword} implementations track a combination of leading and lagging indicators:

**Leading Indicators:**
- User adoption rates
- Training completion percentages
- System utilization metrics
- Process efficiency improvements

**Lagging Indicators:**
- Revenue impact
- Cost reduction achievements
- Customer satisfaction scores
- Market share improvements

### Analytics and Reporting

Modern ${focusKeyword} solutions provide sophisticated analytics capabilities that enable organizations to gain deep insights into performance and identify optimization opportunities. Regular reporting should include:

- **Executive Dashboards**: High-level summaries for leadership teams
- **Operational Reports**: Detailed metrics for day-to-day management
- **Trend Analysis**: Long-term performance patterns and projections
- **Comparative Studies**: Benchmarking against industry standards`,

      `## Future Trends and Innovations in ${focusKeyword}

The landscape of ${focusKeyword} continues to evolve rapidly, with new technologies and methodologies emerging regularly. Staying ahead of these trends is essential for maintaining competitive advantage.

### Emerging Technologies

Several technological advances are reshaping how organizations approach ${focusKeyword}:

- **Artificial Intelligence Integration**: AI-powered solutions are making ${focusKeyword} more intelligent and automated
- **Cloud-Native Architectures**: Modern cloud platforms provide unprecedented scalability and flexibility
- **Mobile-First Designs**: Solutions optimized for mobile devices are becoming the standard
- **Real-Time Analytics**: Instant insights enable faster decision-making and response times

### Industry Evolution

The ${focusKeyword} industry itself is undergoing significant transformation, driven by changing customer expectations and technological capabilities. Key trends include:

- **Increased Personalization**: Solutions tailored to specific user needs and preferences
- **Enhanced Security**: Advanced protection measures to address growing cybersecurity concerns
- **Sustainability Focus**: Environmentally conscious approaches to ${focusKeyword} implementation
- **Collaborative Ecosystems**: Integrated platforms that connect multiple stakeholders and systems

### Preparing for the Future

Organizations that want to remain competitive must proactively prepare for these evolving trends. This preparation involves:

- **Continuous Learning**: Staying informed about industry developments and best practices
- **Technology Investment**: Allocating resources for modern, future-ready solutions
- **Skill Development**: Training teams on emerging technologies and methodologies
- **Strategic Partnerships**: Building relationships with innovative vendors and service providers`
    ]
    
    let additionalContent = ''
    let currentWords = 0
    
    for (const section of sections) {
      if (currentWords >= targetWords) break
      additionalContent += section + '\n\n'
      currentWords += section.split(/\s+/).length
    }
    
    return additionalContent.trim()
  }
  
  private static generateKeywordVariations(focusKeyword: string): string[] {
    const words = focusKeyword.toLowerCase().split(' ')
    const variations = [
      focusKeyword,
      `${focusKeyword} solutions`,
      `${focusKeyword} tools`,
      `${focusKeyword} strategies`,
      `${focusKeyword} implementation`,
      `${focusKeyword} best practices`,
      `${focusKeyword} optimization`,
      `advanced ${focusKeyword}`,
      `professional ${focusKeyword}`,
      `enterprise ${focusKeyword}`
    ]
    
    return variations
  }
  
  private static generateOptimalTags(title: string, content: string, focusKeyword: string, category: string): string[] {
    const tags = new Set<string>()
    
    // Add focus keyword
    tags.add(focusKeyword)
    
    // Add category-related tags
    const categoryTags = {
      'ai-tools': ['AI', 'Artificial Intelligence', 'Machine Learning', 'Automation', 'Technology'],
      'productivity': ['Productivity', 'Efficiency', 'Workflow', 'Organization', 'Time Management'],
      'business': ['Business', 'Strategy', 'Growth', 'Management', 'Enterprise'],
      'marketing': ['Marketing', 'Digital Marketing', 'SEO', 'Content Marketing', 'Social Media'],
      'development': ['Development', 'Programming', 'Software', 'Coding', 'Web Development']
    }
    
    const relevantTags = categoryTags[category as keyof typeof categoryTags] || ['Technology', 'Tools', 'Solutions']
    relevantTags.forEach(tag => tags.add(tag))
    
    // Extract important terms from content
    const words = content.toLowerCase().match(/\b[a-z]{4,}\b/g) || []
    const wordFreq: Record<string, number> = {}
    
    words.forEach(word => {
      if (!['this', 'that', 'with', 'from', 'they', 'have', 'been', 'will', 'your', 'more', 'than', 'also', 'can', 'all'].includes(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1
      }
    })
    
    const topWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1))
    
    topWords.forEach(word => {
      if (tags.size < 12) {
        tags.add(word)
      }
    })
    
    // Add current year for freshness
    tags.add(new Date().getFullYear().toString())
    
    return Array.from(tags).slice(0, 10)
  }
  
  private static generateOptimalExcerpt(content: string, focusKeyword: string): string {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
    
    // Find sentences containing the focus keyword
    const keywordSentences = sentences.filter(s => 
      s.toLowerCase().includes(focusKeyword.toLowerCase())
    )
    
    let excerpt = ''
    
    if (keywordSentences.length > 0) {
      excerpt = keywordSentences[0].trim()
      if (keywordSentences.length > 1) {
        excerpt += '. ' + keywordSentences[1].trim()
      }
    } else {
      // Use first two sentences and inject keyword
      excerpt = `Discover everything you need to know about ${focusKeyword}. ${sentences[0]?.trim() || ''}`
    }
    
    // Ensure optimal length (120-160 characters)
    if (excerpt.length > 160) {
      excerpt = excerpt.substring(0, 157) + '...'
    } else if (excerpt.length < 120) {
      excerpt += ` Learn how ${focusKeyword} can transform your business with proven strategies and expert insights.`
      if (excerpt.length > 160) {
        excerpt = excerpt.substring(0, 157) + '...'
      }
    }
    
    return excerpt
  }
  
  private static generateOptimalSEOMetadata(title: string, excerpt: string, tags: string[], focusKeyword: string) {
    const slug = title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50)
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-tools-list.com'
    
    return {
      metaTitle: title.length <= 60 ? title : title.substring(0, 57) + '...',
      metaDescription: excerpt,
      keywords: tags.join(', '),
      focusKeyword: focusKeyword,
      canonicalUrl: `${baseUrl}/blog/${slug}`,
      ogTitle: title,
      ogDescription: excerpt,
      ogImage: `${baseUrl}/images/blog/${slug}-og.jpg`,
      ogType: 'article',
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: excerpt,
      twitterImage: `${baseUrl}/images/blog/${slug}-twitter.jpg`,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: excerpt,
        keywords: tags.join(', '),
        author: {
          '@type': 'Organization',
          name: 'AI Tools List'
        },
        publisher: {
          '@type': 'Organization',
          name: 'AI Tools List',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`
          }
        },
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${baseUrl}/blog/${slug}`
        }
      }
    }
  }
}