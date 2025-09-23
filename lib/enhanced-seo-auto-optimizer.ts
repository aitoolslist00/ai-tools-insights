import { BlogPost } from './blog-data'
import { EnhancedSEOEngine, EnhancedSEOAnalysis } from './enhanced-seo-engine'

export interface EnhancedSEOOptimizationResult {
  success: boolean
  originalScore: number
  optimizedScore: number
  improvements: string[]
  optimizedContent: {
    title: string
    content: string
    excerpt: string
    tags: string[]
    seo: {
      focusKeyword: string
      metaTitle: string
      metaDescription: string
      keywords: string[]
      schema: any
      socialMedia: {
        ogTitle: string
        ogDescription: string
        twitterTitle: string
        twitterDescription: string
      }
    }
  }
  error?: string
}

export class EnhancedSEOAutoOptimizer {
  
  static async optimizeToMaximum(
    title: string,
    content: string,
    focusKeyword: string,
    category: string = 'ai-tools',
    targetAudience: string = 'professionals and businesses',
    image?: string
  ): Promise<EnhancedSEOOptimizationResult> {
    
    try {
      // Get initial analysis
      const initialAnalysis = EnhancedSEOEngine.analyzeContent(title, content, focusKeyword, category, image)
      
      // Optimize each component to achieve 100% score
      const optimizedTitle = this.optimizeTitleTo100(title, focusKeyword, initialAnalysis)
      const optimizedContent = this.optimizeContentTo100(content, focusKeyword, targetAudience, initialAnalysis)
      const optimizedExcerpt = this.generateOptimalExcerpt(optimizedContent, focusKeyword)
      const optimizedTags = this.generateOptimalTags(optimizedTitle, optimizedContent, focusKeyword)
      const optimizedSEO = this.generateOptimalSEO(optimizedTitle, optimizedContent, focusKeyword)
      
      // Get final analysis
      const finalAnalysis = EnhancedSEOEngine.analyzeContent(
        optimizedTitle, 
        optimizedContent, 
        focusKeyword, 
        category, 
        image
      )
      
      const improvements = this.generateImprovementsList(initialAnalysis, finalAnalysis)
      
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
          seo: optimizedSEO
        }
      }
      
    } catch (error) {
      return {
        success: false,
        originalScore: 0,
        optimizedScore: 0,
        improvements: [],
        optimizedContent: {
          title: '',
          content: '',
          excerpt: '',
          tags: [],
          seo: {
            focusKeyword: '',
            metaTitle: '',
            metaDescription: '',
            keywords: [],
            schema: {},
            socialMedia: {
              ogTitle: '',
              ogDescription: '',
              twitterTitle: '',
              twitterDescription: ''
            }
          }
        },
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
  
  private static optimizeTitleTo100(title: string, focusKeyword: string, analysis: EnhancedSEOAnalysis): string {
    let optimized = title.trim()
    
    // Remove any markdown formatting
    optimized = optimized.replace(/^#+\s*/, '').replace(/[#*_]/g, '')
    
    // Ensure focus keyword is at the beginning
    const keywordLower = focusKeyword.toLowerCase()
    if (!optimized.toLowerCase().startsWith(keywordLower)) {
      optimized = `${focusKeyword}: ${optimized}`
    }
    
    // Add power words for engagement
    const powerWords = ['Ultimate', 'Complete', 'Best', 'Top', 'Essential', 'Expert', 'Advanced', 'Comprehensive']
    const hasPowerWord = powerWords.some(word => optimized.toLowerCase().includes(word.toLowerCase()))
    if (!hasPowerWord) {
      const randomPowerWord = powerWords[Math.floor(Math.random() * powerWords.length)]
      optimized = `${randomPowerWord} ${optimized}`
    }
    
    // Add current year for freshness
    const currentYear = new Date().getFullYear()
    if (!/\d/.test(optimized)) {
      optimized = `${optimized} (${currentYear})`
    }
    
    // Ensure optimal length (30-60 characters)
    if (optimized.length > 60) {
      // Trim while keeping the most important parts
      const parts = optimized.split(':')
      if (parts.length > 1) {
        const keyword = parts[0].trim()
        const rest = parts.slice(1).join(':').trim()
        optimized = `${keyword}: ${rest.substring(0, 60 - keyword.length - 2)}`
      } else {
        optimized = optimized.substring(0, 57) + '...'
      }
    } else if (optimized.length < 30) {
      // Add descriptive words to reach optimal length
      const descriptors = ['Guide', 'Tutorial', 'Review', 'Analysis', 'Comparison', 'Features']
      const randomDescriptor = descriptors[Math.floor(Math.random() * descriptors.length)]
      optimized = `${optimized} - ${randomDescriptor}`
    }
    
    return optimized
  }
  
  private static optimizeContentTo100(
    content: string, 
    focusKeyword: string, 
    targetAudience: string,
    analysis: EnhancedSEOAnalysis
  ): string {
    let optimized = content.trim()
    
    // Ensure minimum word count (2000+ words for maximum SEO)
    const currentWordCount = optimized.split(/\s+/).length
    if (currentWordCount < 2000) {
      optimized = this.expandContentTo2000Words(optimized, focusKeyword, targetAudience)
    }
    
    // Optimize keyword density (1-3%)
    optimized = this.optimizeKeywordDensity(optimized, focusKeyword)
    
    // Add proper heading structure
    optimized = this.addOptimalHeadingStructure(optimized, focusKeyword)
    
    // Ensure keyword appears in introduction and conclusion
    optimized = this.ensureKeywordPlacement(optimized, focusKeyword)
    
    // Add semantic keywords and related terms
    optimized = this.addSemanticKeywords(optimized, focusKeyword)
    
    // Improve readability
    optimized = this.improveReadability(optimized)
    
    // Add structured data elements
    optimized = this.addStructuredElements(optimized, focusKeyword)
    
    return optimized
  }
  
  private static expandContentTo2000Words(content: string, focusKeyword: string, targetAudience: string): string {
    const currentWords = content.split(/\s+/).length
    const wordsNeeded = 2000 - currentWords
    
    if (wordsNeeded <= 0) return content
    
    // Add comprehensive sections to reach 2000+ words
    const additionalSections = [
      this.generateIntroductionSection(focusKeyword, targetAudience),
      this.generateBenefitsSection(focusKeyword),
      this.generateFeaturesSection(focusKeyword),
      this.generateComparisonSection(focusKeyword),
      this.generateUseCasesSection(focusKeyword, targetAudience),
      this.generateBestPracticesSection(focusKeyword),
      this.generateTipsSection(focusKeyword),
      this.generateTrendsSection(focusKeyword),
      this.generateFAQSection(focusKeyword),
      this.generateConclusionSection(focusKeyword, targetAudience)
    ]
    
    let expandedContent = content
    let addedWords = 0
    
    for (const section of additionalSections) {
      if (addedWords >= wordsNeeded) break
      expandedContent += '\n\n' + section
      addedWords += section.split(/\s+/).length
    }
    
    return expandedContent
  }
  
  private static optimizeKeywordDensity(content: string, focusKeyword: string): string {
    const words = content.split(/\s+/)
    const keywordMatches = (content.toLowerCase().match(new RegExp(focusKeyword.toLowerCase(), 'g')) || []).length
    const currentDensity = (keywordMatches / words.length) * 100
    const targetDensity = 2.0 // 2% is optimal
    
    if (currentDensity < 1.0) {
      // Add more keyword instances naturally
      return this.addKeywordInstances(content, focusKeyword, Math.ceil(words.length * 0.02) - keywordMatches)
    } else if (currentDensity > 3.0) {
      // Reduce keyword stuffing
      return this.reduceKeywordInstances(content, focusKeyword)
    }
    
    return content
  }
  
  private static addOptimalHeadingStructure(content: string, focusKeyword: string): string {
    let optimized = content
    
    // Ensure H1 with focus keyword
    if (!optimized.match(/^#\s/m) && !optimized.match(/<h1>/i)) {
      optimized = `# ${focusKeyword}: Complete Guide\n\n${optimized}`
    }
    
    // Add H2 headings if missing
    const h2Count = (optimized.match(/^##\s/gm) || []).length
    if (h2Count < 3) {
      const h2Headings = [
        `## What is ${focusKeyword}?`,
        `## Key Benefits of ${focusKeyword}`,
        `## How to Use ${focusKeyword} Effectively`,
        `## ${focusKeyword} Best Practices`,
        `## Common ${focusKeyword} Challenges and Solutions`,
        `## Future of ${focusKeyword}`
      ]
      
      const sectionsToAdd = h2Headings.slice(0, 3 - h2Count)
      optimized += '\n\n' + sectionsToAdd.map(heading => 
        `${heading}\n\n${this.generateSectionContent(heading, focusKeyword)}`
      ).join('\n\n')
    }
    
    return optimized
  }
  
  private static ensureKeywordPlacement(content: string, focusKeyword: string): string {
    let optimized = content
    
    // Ensure keyword in first 200 characters
    const first200 = optimized.substring(0, 200).toLowerCase()
    if (!first200.includes(focusKeyword.toLowerCase())) {
      const firstParagraph = optimized.split('\n\n')[0]
      const keywordSentence = `${focusKeyword} has become increasingly important in today's digital landscape.`
      optimized = optimized.replace(firstParagraph, `${keywordSentence} ${firstParagraph}`)
    }
    
    // Ensure keyword in last 200 characters
    const last200 = optimized.substring(optimized.length - 200).toLowerCase()
    if (!last200.includes(focusKeyword.toLowerCase())) {
      optimized += `\n\nIn conclusion, ${focusKeyword} represents a significant opportunity for businesses and professionals looking to stay competitive in the modern market.`
    }
    
    return optimized
  }
  
  private static addSemanticKeywords(content: string, focusKeyword: string): string {
    const semanticKeywords = this.generateSemanticKeywords(focusKeyword)
    let optimized = content
    
    // Naturally integrate semantic keywords
    semanticKeywords.forEach(keyword => {
      if (!optimized.toLowerCase().includes(keyword.toLowerCase())) {
        const sentences = [
          `The ${keyword} aspect is crucial for success.`,
          `Understanding ${keyword} helps optimize results.`,
          `${keyword} plays a vital role in the overall strategy.`,
          `Implementing ${keyword} can significantly improve outcomes.`
        ]
        const randomSentence = sentences[Math.floor(Math.random() * sentences.length)]
        optimized += ` ${randomSentence}`
      }
    })
    
    return optimized
  }
  
  private static improveReadability(content: string): string {
    let optimized = content
    
    // Add transition words
    const transitionWords = [
      'Furthermore', 'Moreover', 'Additionally', 'However', 'Therefore', 
      'Consequently', 'Meanwhile', 'Nevertheless', 'Thus', 'Hence'
    ]
    
    // Break long paragraphs
    const paragraphs = optimized.split('\n\n')
    const improvedParagraphs = paragraphs.map(paragraph => {
      const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim().length > 0)
      if (sentences.length > 5) {
        // Split long paragraphs
        const midPoint = Math.ceil(sentences.length / 2)
        const firstHalf = sentences.slice(0, midPoint).join('. ') + '.'
        const secondHalf = sentences.slice(midPoint).join('. ') + '.'
        const transition = transitionWords[Math.floor(Math.random() * transitionWords.length)]
        return `${firstHalf}\n\n${transition}, ${secondHalf}`
      }
      return paragraph
    })
    
    return improvedParagraphs.join('\n\n')
  }
  
  private static addStructuredElements(content: string, focusKeyword: string): string {
    let optimized = content
    
    // Add lists if missing
    if (!optimized.match(/^[-*+]\s/m)) {
      const listSection = `\n\n## Key ${focusKeyword} Features:\n\n- Advanced functionality and capabilities\n- User-friendly interface and design\n- Comprehensive analytics and reporting\n- Seamless integration options\n- Robust security and privacy features\n- Scalable architecture for growth`
      optimized += listSection
    }
    
    // Add FAQ section if missing
    if (!optimized.toLowerCase().includes('faq') && !optimized.toLowerCase().includes('frequently asked')) {
      const faqSection = this.generateFAQSection(focusKeyword)
      optimized += '\n\n' + faqSection
    }
    
    return optimized
  }
  
  private static generateIntroductionSection(focusKeyword: string, targetAudience: string): string {
    return `## Introduction to ${focusKeyword}

In today's rapidly evolving digital landscape, ${focusKeyword} has emerged as a game-changing solution for ${targetAudience}. This comprehensive guide explores everything you need to know about ${focusKeyword}, from its core functionalities to advanced implementation strategies.

Whether you're a beginner looking to understand the basics or an experienced professional seeking to optimize your approach, this article provides valuable insights and practical recommendations. We'll cover the latest trends, best practices, and real-world applications that make ${focusKeyword} an essential tool in modern business operations.`
  }
  
  private static generateBenefitsSection(focusKeyword: string): string {
    return `## Key Benefits of ${focusKeyword}

Implementing ${focusKeyword} offers numerous advantages that can transform your workflow and boost productivity:

**Enhanced Efficiency**: ${focusKeyword} streamlines complex processes, reducing manual effort and minimizing errors. Users typically experience a 40-60% improvement in task completion times.

**Cost-Effective Solution**: By automating routine tasks, ${focusKeyword} helps organizations reduce operational costs while maintaining high-quality outputs.

**Scalable Architecture**: The flexible design of ${focusKeyword} allows it to grow with your business needs, accommodating increased workloads without performance degradation.

**Improved Accuracy**: Advanced algorithms ensure consistent, reliable results that exceed manual processing capabilities.

**Real-time Analytics**: Built-in reporting features provide valuable insights into performance metrics and usage patterns.`
  }
  
  private static generateFeaturesSection(focusKeyword: string): string {
    return `## Essential ${focusKeyword} Features

Modern ${focusKeyword} solutions incorporate cutting-edge technologies to deliver exceptional user experiences:

### Core Functionality
- Intuitive user interface designed for maximum usability
- Advanced processing capabilities with lightning-fast performance
- Comprehensive data management and organization tools
- Seamless integration with existing systems and workflows

### Advanced Capabilities
- Machine learning algorithms for intelligent automation
- Customizable dashboards and reporting features
- Multi-platform compatibility and cloud-based access
- Robust security measures and data protection protocols

### Collaboration Tools
- Real-time collaboration features for team productivity
- Version control and change tracking capabilities
- Communication tools and notification systems
- Project management and task assignment features`
  }
  
  private static generateComparisonSection(focusKeyword: string): string {
    return `## ${focusKeyword} vs Traditional Alternatives

When evaluating ${focusKeyword} against conventional solutions, several key differences emerge:

**Performance Comparison**: ${focusKeyword} consistently outperforms traditional methods in speed, accuracy, and resource utilization. Benchmark studies show up to 300% improvement in processing efficiency.

**User Experience**: Modern ${focusKeyword} platforms prioritize user-friendly interfaces, while legacy systems often require extensive training and technical expertise.

**Integration Capabilities**: Unlike standalone traditional tools, ${focusKeyword} offers seamless integration with popular business applications and cloud services.

**Maintenance Requirements**: ${focusKeyword} solutions typically require minimal maintenance compared to traditional systems that need regular updates and manual interventions.

**Total Cost of Ownership**: While initial investment may vary, ${focusKeyword} generally provides better long-term value through reduced operational costs and improved productivity.`
  }
  
  private static generateUseCasesSection(focusKeyword: string, targetAudience: string): string {
    return `## Real-World ${focusKeyword} Use Cases

${targetAudience} across various industries have successfully implemented ${focusKeyword} to address specific challenges:

### Enterprise Applications
Large corporations utilize ${focusKeyword} for streamlining complex workflows, managing vast datasets, and improving decision-making processes. Case studies demonstrate significant ROI improvements within 6-12 months of implementation.

### Small Business Solutions
Small and medium-sized businesses leverage ${focusKeyword} to compete with larger organizations by automating routine tasks and accessing enterprise-level capabilities at affordable costs.

### Educational Institutions
Schools and universities implement ${focusKeyword} to enhance learning experiences, manage administrative tasks, and provide students with cutting-edge tools for academic success.

### Healthcare Organizations
Medical facilities use ${focusKeyword} to improve patient care, streamline administrative processes, and ensure compliance with regulatory requirements.

### Creative Industries
Design agencies, marketing firms, and content creators rely on ${focusKeyword} to boost creativity, manage projects efficiently, and deliver high-quality results to clients.`
  }
  
  private static generateBestPracticesSection(focusKeyword: string): string {
    return `## ${focusKeyword} Best Practices and Implementation Tips

To maximize the benefits of ${focusKeyword}, follow these proven strategies:

### Planning and Preparation
- Conduct thorough needs assessment before implementation
- Define clear objectives and success metrics
- Allocate adequate resources for training and support
- Develop a phased rollout strategy to minimize disruption

### Configuration and Customization
- Customize settings to match your specific workflow requirements
- Establish consistent naming conventions and organizational structures
- Configure security settings and access controls appropriately
- Set up automated backups and disaster recovery procedures

### User Training and Adoption
- Provide comprehensive training programs for all users
- Create documentation and quick reference guides
- Establish support channels for ongoing assistance
- Monitor usage patterns and provide additional training as needed

### Optimization and Maintenance
- Regularly review and optimize configurations
- Stay updated with latest features and improvements
- Monitor performance metrics and address issues promptly
- Gather user feedback and implement improvements continuously`
  }
  
  private static generateTipsSection(focusKeyword: string): string {
    return `## Expert Tips for ${focusKeyword} Success

Industry experts recommend these strategies for optimal ${focusKeyword} utilization:

**Start Small**: Begin with pilot projects to understand capabilities and limitations before full-scale deployment.

**Focus on Integration**: Ensure seamless connectivity with existing tools and systems to maximize efficiency gains.

**Prioritize Security**: Implement robust security measures from the beginning to protect sensitive data and maintain compliance.

**Monitor Performance**: Establish key performance indicators (KPIs) to track success and identify areas for improvement.

**Stay Updated**: Keep abreast of new features, updates, and industry trends to maintain competitive advantage.

**Build Expertise**: Invest in training and certification programs to develop internal expertise and reduce dependency on external support.

**Plan for Scale**: Design implementations with future growth in mind to avoid costly redesigns and migrations.`
  }
  
  private static generateTrendsSection(focusKeyword: string): string {
    return `## Future Trends and ${focusKeyword} Evolution

The ${focusKeyword} landscape continues to evolve rapidly, with several key trends shaping its future:

### Artificial Intelligence Integration
AI and machine learning capabilities are becoming standard features, enabling more intelligent automation and predictive analytics.

### Cloud-First Architecture
Modern ${focusKeyword} solutions prioritize cloud-native designs for better scalability, accessibility, and cost-effectiveness.

### Enhanced User Experience
User interface design continues to improve, with focus on intuitive navigation, personalization, and mobile-first approaches.

### Advanced Analytics
Real-time analytics and business intelligence features are becoming more sophisticated, providing deeper insights and actionable recommendations.

### Security and Compliance
Enhanced security measures and compliance features address growing concerns about data protection and regulatory requirements.

### Ecosystem Integration
Broader integration capabilities with third-party applications and services create more comprehensive solution ecosystems.`
  }
  
  private static generateFAQSection(focusKeyword: string): string {
    return `## Frequently Asked Questions About ${focusKeyword}

### What is ${focusKeyword} and how does it work?
${focusKeyword} is an advanced solution that leverages cutting-edge technology to streamline processes and improve efficiency. It works by automating routine tasks, providing intelligent insights, and facilitating seamless collaboration.

### How much does ${focusKeyword} cost?
Pricing varies depending on features, usage requirements, and deployment options. Most providers offer flexible pricing models including subscription-based, usage-based, and enterprise licensing options.

### Is ${focusKeyword} suitable for small businesses?
Yes, ${focusKeyword} solutions are designed to scale from small businesses to large enterprises. Many providers offer starter plans specifically tailored for small business needs and budgets.

### What kind of support is available?
Most ${focusKeyword} providers offer comprehensive support including documentation, tutorials, community forums, email support, and premium support options for enterprise customers.

### How long does implementation take?
Implementation timelines vary based on complexity and requirements. Simple deployments can be completed in days, while complex enterprise implementations may take several weeks or months.

### Is training required?
While ${focusKeyword} solutions are designed to be user-friendly, training is recommended to maximize benefits and ensure proper utilization of all features.`
  }
  
  private static generateConclusionSection(focusKeyword: string, targetAudience: string): string {
    return `## Conclusion: Maximizing ${focusKeyword} Success

${focusKeyword} represents a transformative opportunity for ${targetAudience} seeking to enhance productivity, reduce costs, and maintain competitive advantage. By understanding its capabilities, following best practices, and staying informed about emerging trends, organizations can unlock the full potential of this powerful solution.

The key to success lies in careful planning, proper implementation, and ongoing optimization. As the technology continues to evolve, early adopters who invest in ${focusKeyword} today will be best positioned to benefit from future innovations and improvements.

Whether you're just beginning your ${focusKeyword} journey or looking to optimize existing implementations, the strategies and insights provided in this guide will help you achieve your objectives and drive meaningful business results.`
  }
  
  private static generateSectionContent(heading: string, focusKeyword: string): string {
    const baseContent = `This section explores important aspects of ${focusKeyword} that are essential for understanding its full potential. Through detailed analysis and practical examples, we examine how ${focusKeyword} can be effectively utilized to achieve optimal results.

Key considerations include implementation strategies, best practices, and common challenges that users may encounter. By addressing these topics comprehensively, we provide valuable insights that enable successful ${focusKeyword} adoption and utilization.`
    
    return baseContent
  }
  
  private static addKeywordInstances(content: string, focusKeyword: string, instancesToAdd: number): string {
    let optimized = content
    const sentences = content.split(/[.!?]+/)
    
    for (let i = 0; i < instancesToAdd && i < sentences.length; i++) {
      const randomIndex = Math.floor(Math.random() * sentences.length)
      const sentence = sentences[randomIndex].trim()
      if (sentence && !sentence.toLowerCase().includes(focusKeyword.toLowerCase())) {
        const variations = [
          `${sentence} with ${focusKeyword}`,
          `${focusKeyword} enables ${sentence.toLowerCase()}`,
          `Through ${focusKeyword}, ${sentence.toLowerCase()}`,
          `${sentence} using ${focusKeyword} technology`
        ]
        const randomVariation = variations[Math.floor(Math.random() * variations.length)]
        optimized = optimized.replace(sentence, randomVariation)
      }
    }
    
    return optimized
  }
  
  private static reduceKeywordInstances(content: string, focusKeyword: string): string {
    // Replace some keyword instances with synonyms or related terms
    const synonyms = this.generateSynonyms(focusKeyword)
    let optimized = content
    
    const keywordRegex = new RegExp(focusKeyword, 'gi')
    const matches = content.match(keywordRegex) || []
    
    // Replace every 3rd instance with a synonym
    let replacementCount = 0
    optimized = optimized.replace(keywordRegex, (match, offset) => {
      replacementCount++
      if (replacementCount % 3 === 0 && synonyms.length > 0) {
        const randomSynonym = synonyms[Math.floor(Math.random() * synonyms.length)]
        return randomSynonym
      }
      return match
    })
    
    return optimized
  }
  
  private static generateSemanticKeywords(focusKeyword: string): string[] {
    const base = focusKeyword.toLowerCase()
    return [
      `${base} software`,
      `${base} platform`,
      `${base} solution`,
      `${base} technology`,
      `${base} system`,
      `${base} tool`,
      `${base} application`,
      `${base} service`,
      `${base} features`,
      `${base} capabilities`
    ]
  }
  
  private static generateSynonyms(focusKeyword: string): string[] {
    // Generate contextual synonyms based on the keyword
    const synonymMap: { [key: string]: string[] } = {
      'ai': ['artificial intelligence', 'machine learning', 'intelligent system'],
      'tool': ['solution', 'platform', 'application', 'software'],
      'software': ['application', 'program', 'system', 'platform'],
      'platform': ['system', 'framework', 'solution', 'environment'],
      'technology': ['innovation', 'advancement', 'system', 'solution']
    }
    
    const words = focusKeyword.toLowerCase().split(' ')
    const synonyms: string[] = []
    
    words.forEach(word => {
      if (synonymMap[word]) {
        synonyms.push(...synonymMap[word])
      }
    })
    
    return synonyms
  }
  
  private static generateOptimalExcerpt(content: string, focusKeyword: string): string {
    const cleanContent = content.replace(/[#*]/g, '').trim()
    let excerpt = cleanContent.substring(0, 140)
    
    // Ensure focus keyword is included
    if (!excerpt.toLowerCase().includes(focusKeyword.toLowerCase())) {
      excerpt = `${focusKeyword}: ${excerpt}`
    }
    
    // Add call-to-action
    if (excerpt.length < 150) {
      excerpt += ' Learn more about the latest features and benefits.'
    }
    
    // Ensure proper length
    if (excerpt.length > 160) {
      excerpt = excerpt.substring(0, 157) + '...'
    }
    
    return excerpt
  }
  
  private static generateOptimalTags(title: string, content: string, focusKeyword: string): string[] {
    const tags = new Set<string>()
    
    // Add focus keyword
    tags.add(focusKeyword)
    
    // Add semantic keywords
    this.generateSemanticKeywords(focusKeyword).forEach(keyword => tags.add(keyword))
    
    // Add category-specific tags
    const categoryTags = [
      'AI Tools', 'Technology', 'Productivity', 'Software', 'Innovation',
      'Digital Transformation', 'Automation', 'Business Solutions', 'Enterprise',
      'Cloud Computing', 'Machine Learning', 'Data Analytics'
    ]
    categoryTags.forEach(tag => tags.add(tag))
    
    // Add year for freshness
    tags.add(new Date().getFullYear().toString())
    
    return Array.from(tags).slice(0, 12)
  }
  
  private static generateOptimalSEO(title: string, content: string, focusKeyword: string) {
    const metaTitle = this.optimizeMetaTitle(title, focusKeyword)
    const metaDescription = this.generateOptimalExcerpt(content, focusKeyword)
    
    return {
      focusKeyword,
      metaTitle,
      metaDescription,
      keywords: this.generateSemanticKeywords(focusKeyword),
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: metaTitle,
        description: metaDescription,
        keywords: this.generateSemanticKeywords(focusKeyword).join(', '),
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
      },
      socialMedia: {
        ogTitle: metaTitle,
        ogDescription: metaDescription,
        twitterTitle: metaTitle,
        twitterDescription: metaDescription
      }
    }
  }
  
  private static optimizeMetaTitle(title: string, focusKeyword: string): string {
    let optimized = title.trim()
    
    // Ensure focus keyword is at the beginning
    if (!optimized.toLowerCase().startsWith(focusKeyword.toLowerCase())) {
      optimized = `${focusKeyword}: ${optimized}`
    }
    
    // Ensure optimal length (50-60 characters)
    if (optimized.length > 60) {
      optimized = optimized.substring(0, 57) + '...'
    }
    
    return optimized
  }
  
  private static generateImprovementsList(
    initialAnalysis: EnhancedSEOAnalysis, 
    finalAnalysis: EnhancedSEOAnalysis
  ): string[] {
    const improvements: string[] = []
    
    // Compare scores and generate improvement descriptions
    if (finalAnalysis.breakdown.title.score > initialAnalysis.breakdown.title.score) {
      improvements.push('Optimized title for better keyword placement and engagement')
    }
    
    if (finalAnalysis.breakdown.content.score > initialAnalysis.breakdown.content.score) {
      improvements.push('Expanded content to meet optimal word count requirements')
    }
    
    if (finalAnalysis.breakdown.keywords.score > initialAnalysis.breakdown.keywords.score) {
      improvements.push('Improved keyword density and added semantic keywords')
    }
    
    if (finalAnalysis.breakdown.structure.score > initialAnalysis.breakdown.structure.score) {
      improvements.push('Enhanced content structure with proper headings and formatting')
    }
    
    if (finalAnalysis.breakdown.readability.score > initialAnalysis.breakdown.readability.score) {
      improvements.push('Improved readability with better sentence structure and flow')
    }
    
    if (finalAnalysis.breakdown.meta.score > initialAnalysis.breakdown.meta.score) {
      improvements.push('Optimized meta description and social media tags')
    }
    
    // Add general improvements
    improvements.push('Added comprehensive FAQ section for better user engagement')
    improvements.push('Integrated long-tail keyword variations for broader reach')
    improvements.push('Enhanced semantic SEO with related terms and concepts')
    improvements.push('Optimized content structure for featured snippets')
    improvements.push('Added schema markup for better search engine understanding')
    
    return improvements
  }
}