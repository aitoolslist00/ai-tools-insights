/**
 * Semantic SEO Optimizer for RankBrain Understanding
 * Maximizes semantic signals and entity recognition
 */

export interface SemanticEntity {
  name: string
  type: 'Person' | 'Organization' | 'Product' | 'Technology' | 'Concept'
  description: string
  sameAs?: string[]
  relatedTerms: string[]
}

export class SemanticOptimizer {
  // Core AI entities that RankBrain recognizes
  static readonly AI_ENTITIES: SemanticEntity[] = [
    {
      name: 'Artificial Intelligence',
      type: 'Technology',
      description: 'Computer systems able to perform tasks that typically require human intelligence',
      sameAs: ['https://en.wikipedia.org/wiki/Artificial_intelligence'],
      relatedTerms: ['AI', 'machine learning', 'deep learning', 'neural networks', 'automation']
    },
    {
      name: 'Machine Learning',
      type: 'Technology', 
      description: 'Method of data analysis that automates analytical model building',
      sameAs: ['https://en.wikipedia.org/wiki/Machine_learning'],
      relatedTerms: ['ML', 'algorithms', 'training data', 'predictive models', 'AI']
    },
    {
      name: 'Natural Language Processing',
      type: 'Technology',
      description: 'Branch of AI that helps computers understand and interpret human language',
      sameAs: ['https://en.wikipedia.org/wiki/Natural_language_processing'],
      relatedTerms: ['NLP', 'text analysis', 'language models', 'chatbots', 'text generation']
    },
    {
      name: 'Computer Vision',
      type: 'Technology',
      description: 'Field of AI that trains computers to interpret and understand visual information',
      sameAs: ['https://en.wikipedia.org/wiki/Computer_vision'],
      relatedTerms: ['image recognition', 'object detection', 'image generation', 'visual AI']
    },
    {
      name: 'OpenAI',
      type: 'Organization',
      description: 'AI research laboratory consisting of the for-profit OpenAI LP and non-profit OpenAI Inc',
      sameAs: ['https://en.wikipedia.org/wiki/OpenAI', 'https://openai.com'],
      relatedTerms: ['ChatGPT', 'GPT-4', 'DALL-E', 'AI research', 'language models']
    },
    {
      name: 'ChatGPT',
      type: 'Product',
      description: 'AI chatbot developed by OpenAI based on large language models',
      sameAs: ['https://en.wikipedia.org/wiki/ChatGPT'],
      relatedTerms: ['conversational AI', 'language model', 'text generation', 'AI assistant']
    }
  ]

  static generateSemanticMarkup(content: string, entities?: SemanticEntity[]): string {
    const allEntities = [...this.AI_ENTITIES, ...(entities || [])]
    let enrichedContent = content

    // Add semantic markup for recognized entities
    allEntities.forEach(entity => {
      const regex = new RegExp(`\\b${entity.name}\\b`, 'gi')
      enrichedContent = enrichedContent.replace(regex, (match) => {
        return `<span itemscope itemtype="https://schema.org/${entity.type}" itemProp="about">
          <span itemProp="name">${match}</span>
          <meta itemProp="description" content="${entity.description}" />
          ${entity.sameAs ? `<meta itemProp="sameAs" content="${entity.sameAs[0]}" />` : ''}
        </span>`
      })
    })

    return enrichedContent
  }

  static generateEntitySchema(entities: SemanticEntity[]): any[] {
    return entities.map(entity => ({
      '@type': entity.type,
      name: entity.name,
      description: entity.description,
      ...(entity.sameAs && { sameAs: entity.sameAs }),
      ...(entity.relatedTerms && { 
        keywords: entity.relatedTerms.join(', '),
        about: entity.relatedTerms.map(term => ({
          '@type': 'Thing',
          name: term
        }))
      })
    }))
  }

  static generateTopicClusters(mainTopic: string): {
    primary: string[]
    secondary: string[]
    longtail: string[]
    semantic: string[]
  } {
    const topicMap: Record<string, any> = {
      'ai-tools': {
        primary: ['AI tools', 'artificial intelligence tools', 'AI software', 'machine learning tools'],
        secondary: ['business AI', 'AI applications', 'AI platforms', 'AI solutions', 'AI technology'],
        longtail: [
          'best AI tools for business 2025',
          'free AI tools for productivity',
          'AI tools for content creation',
          'enterprise AI software solutions',
          'AI automation tools for small business'
        ],
        semantic: [
          'intelligent automation',
          'cognitive computing',
          'algorithmic processing',
          'predictive analytics',
          'neural network applications'
        ]
      },
      'image-generation': {
        primary: ['AI image generator', 'AI art generator', 'text to image AI'],
        secondary: ['AI artwork', 'AI design tools', 'AI graphics', 'AI illustration'],
        longtail: [
          'best AI image generators 2025',
          'free AI art generators online',
          'AI image creation tools for business',
          'professional AI design software'
        ],
        semantic: [
          'generative adversarial networks',
          'diffusion models',
          'computer vision',
          'visual content creation',
          'automated design'
        ]
      }
    }

    return topicMap[mainTopic] || topicMap['ai-tools']
  }

  static generateContextualKeywords(category: string, tool?: string): string[] {
    const baseKeywords = this.generateTopicClusters(category)
    const contextual = [
      ...baseKeywords.primary,
      ...baseKeywords.secondary,
      ...baseKeywords.longtail.slice(0, 3),
      ...baseKeywords.semantic.slice(0, 2)
    ]

    if (tool) {
      contextual.push(
        `${tool} review`,
        `${tool} features`,
        `${tool} pricing`,
        `${tool} alternatives`,
        `how to use ${tool}`,
        `${tool} vs competitors`
      )
    }

    return contextual
  }

  static generateSemanticHTML(title: string, description: string, category: string): string {
    const entities = this.AI_ENTITIES.filter(e => 
      title.toLowerCase().includes(e.name.toLowerCase()) ||
      description.toLowerCase().includes(e.name.toLowerCase())
    )

    const keywords = this.generateContextualKeywords(category)
    
    return `
      <div itemscope itemtype="https://schema.org/SoftwareApplication">
        <h1 itemProp="name">${title}</h1>
        <meta itemProp="description" content="${description}" />
        <meta itemProp="applicationCategory" content="BusinessApplication" />
        <meta itemProp="keywords" content="${keywords.join(', ')}" />
        
        ${entities.map(entity => `
          <div itemscope itemtype="https://schema.org/${entity.type}" itemProp="about">
            <meta itemProp="name" content="${entity.name}" />
            <meta itemProp="description" content="${entity.description}" />
            ${entity.sameAs ? `<meta itemProp="sameAs" content="${entity.sameAs[0]}" />` : ''}
          </div>
        `).join('')}
        
        <div itemProp="offers" itemscope itemtype="https://schema.org/Offer">
          <meta itemProp="availability" content="https://schema.org/InStock" />
          <meta itemProp="priceCurrency" content="USD" />
        </div>
      </div>
    `
  }

  static generateRankBrainSignals(content: string): {
    semanticDensity: number
    entityCount: number
    topicRelevance: number
    contextualSignals: string[]
  } {
    const entities = this.AI_ENTITIES.filter(entity =>
      content.toLowerCase().includes(entity.name.toLowerCase())
    )

    const words = content.split(/\s+/).length
    const semanticWords = entities.reduce((count, entity) => {
      return count + entity.relatedTerms.filter(term =>
        content.toLowerCase().includes(term.toLowerCase())
      ).length
    }, 0)

    return {
      semanticDensity: (semanticWords / words) * 100,
      entityCount: entities.length,
      topicRelevance: Math.min(100, (entities.length * 20) + (semanticWords * 2)),
      contextualSignals: entities.flatMap(e => e.relatedTerms).slice(0, 10)
    }
  }
}

export default SemanticOptimizer