// Semantic Keywords Database for AI Tools Directory
// This file contains comprehensive keyword mappings for semantic SEO

export interface SemanticKeyword {
  primary: string
  secondary: string[]
  longTail: string[]
  lsi: string[] // Latent Semantic Indexing keywords
  entities: string[]
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational'
  searchVolume: 'high' | 'medium' | 'low'
  difficulty: 'high' | 'medium' | 'low'
}

export const semanticKeywords: Record<string, SemanticKeyword> = {
  // Homepage Keywords
  homepage: {
    primary: 'AI tools directory',
    secondary: [
      'best AI tools 2025',
      'AI software comparison',
      'artificial intelligence tools',
      'AI tools for business',
      'comprehensive AI directory'
    ],
    longTail: [
      'complete directory of AI tools for business',
      'best artificial intelligence tools comparison 2025',
      'comprehensive AI software directory with reviews',
      'find the best AI tools for your business needs'
    ],
    lsi: [
      'machine learning',
      'automation',
      'productivity',
      'digital transformation',
      'software solutions',
      'technology stack',
      'business intelligence',
      'workflow optimization'
    ],
    entities: [
      'AI Tools Directory',
      'Artificial Intelligence Software',
      'Business Automation',
      'Productivity Tools',
      'Software Comparison'
    ],
    intent: 'informational',
    searchVolume: 'high',
    difficulty: 'high'
  },

  // AI Image Generation
  aiImageGeneration: {
    primary: 'AI image generation tools',
    secondary: [
      'best AI image generators 2025',
      'AI art creation software',
      'text to image AI tools',
      'AI graphic design tools',
      'professional AI image makers'
    ],
    longTail: [
      'best AI image generation tools for designers',
      'professional AI art creation software comparison',
      'text to image AI tools for marketing',
      'AI image generators for social media content'
    ],
    lsi: [
      'digital art',
      'creative design',
      'visual content',
      'graphic creation',
      'image synthesis',
      'artistic generation',
      'visual AI',
      'creative automation'
    ],
    entities: [
      'AI Image Generation',
      'Digital Art Creation',
      'Visual Content Tools',
      'Graphic Design Software',
      'Creative AI Applications'
    ],
    intent: 'commercial',
    searchVolume: 'high',
    difficulty: 'medium'
  },

  // AI Video Tools
  aiVideoTools: {
    primary: 'AI video creation tools',
    secondary: [
      'AI video editing software',
      'text to video AI tools',
      'automated video generation',
      'AI video marketing tools',
      'professional video AI'
    ],
    longTail: [
      'best AI video creation tools for content creators',
      'AI video editing software for marketing',
      'automated video generation for social media',
      'professional AI video tools comparison'
    ],
    lsi: [
      'video production',
      'content creation',
      'multimedia editing',
      'video automation',
      'visual storytelling',
      'motion graphics',
      'video marketing',
      'content automation'
    ],
    entities: [
      'AI Video Creation',
      'Video Production Tools',
      'Content Creation Software',
      'Marketing Automation',
      'Multimedia Applications'
    ],
    intent: 'commercial',
    searchVolume: 'high',
    difficulty: 'medium'
  },

  // AI Writing Tools
  aiWritingTools: {
    primary: 'AI writing tools',
    secondary: [
      'AI content writing software',
      'AI copywriting tools',
      'automated content creation',
      'AI blog writing assistants',
      'AI marketing copy generators'
    ],
    longTail: [
      'best AI writing tools for content marketing',
      'AI copywriting software for businesses',
      'automated blog writing tools comparison',
      'professional AI content creation platforms'
    ],
    lsi: [
      'content marketing',
      'copywriting',
      'content strategy',
      'writing automation',
      'content optimization',
      'editorial assistance',
      'content generation',
      'writing productivity'
    ],
    entities: [
      'AI Writing Software',
      'Content Creation Tools',
      'Copywriting Automation',
      'Marketing Content',
      'Writing Assistance'
    ],
    intent: 'commercial',
    searchVolume: 'high',
    difficulty: 'medium'
  },

  // AI Coding Tools
  aiCodingTools: {
    primary: 'AI coding assistants',
    secondary: [
      'AI programming tools',
      'code completion AI',
      'AI development assistants',
      'automated coding tools',
      'AI pair programming'
    ],
    longTail: [
      'best AI coding assistants for developers',
      'AI programming tools comparison 2025',
      'code completion AI software review',
      'AI development tools for productivity'
    ],
    lsi: [
      'software development',
      'programming assistance',
      'code optimization',
      'development productivity',
      'coding automation',
      'software engineering',
      'development tools',
      'programming efficiency'
    ],
    entities: [
      'AI Coding Tools',
      'Development Software',
      'Programming Assistance',
      'Software Engineering',
      'Code Automation'
    ],
    intent: 'commercial',
    searchVolume: 'medium',
    difficulty: 'medium'
  },

  // AI Voice Tools
  aiVoiceTools: {
    primary: 'AI voice generation tools',
    secondary: [
      'text to speech AI',
      'AI voice cloning software',
      'AI audio creation tools',
      'voice synthesis platforms',
      'AI narration tools'
    ],
    longTail: [
      'best AI voice generation tools for content',
      'professional text to speech AI software',
      'AI voice cloning tools comparison',
      'voice synthesis platforms for business'
    ],
    lsi: [
      'voice synthesis',
      'audio production',
      'speech generation',
      'voice automation',
      'audio content',
      'narration tools',
      'voice technology',
      'audio AI'
    ],
    entities: [
      'AI Voice Technology',
      'Speech Synthesis',
      'Audio Production Tools',
      'Voice Generation Software',
      'Audio Content Creation'
    ],
    intent: 'commercial',
    searchVolume: 'medium',
    difficulty: 'low'
  },

  // AI Chatbots
  aiChatbots: {
    primary: 'AI chatbots',
    secondary: [
      'conversational AI tools',
      'AI customer service bots',
      'intelligent chatbot platforms',
      'AI virtual assistants',
      'automated chat solutions'
    ],
    longTail: [
      'best AI chatbots for customer service',
      'conversational AI tools for business',
      'AI chatbot platforms comparison',
      'intelligent virtual assistants for websites'
    ],
    lsi: [
      'customer service',
      'conversational AI',
      'virtual assistance',
      'automated support',
      'chat automation',
      'customer engagement',
      'support automation',
      'interactive AI'
    ],
    entities: [
      'AI Chatbots',
      'Conversational AI',
      'Customer Service Automation',
      'Virtual Assistants',
      'Support Technology'
    ],
    intent: 'commercial',
    searchVolume: 'high',
    difficulty: 'medium'
  },

  // AI Music Tools
  aiMusicTools: {
    primary: 'AI music generation tools',
    secondary: [
      'AI music creation software',
      'automated music composition',
      'AI audio production tools',
      'music generation AI',
      'AI soundtrack creators'
    ],
    longTail: [
      'best AI music generation tools for creators',
      'AI music composition software comparison',
      'automated music creation for content',
      'professional AI music production tools'
    ],
    lsi: [
      'music production',
      'audio composition',
      'sound design',
      'music creation',
      'audio generation',
      'soundtrack production',
      'musical AI',
      'audio synthesis'
    ],
    entities: [
      'AI Music Generation',
      'Music Production Software',
      'Audio Creation Tools',
      'Composition Technology',
      'Sound Design Applications'
    ],
    intent: 'commercial',
    searchVolume: 'medium',
    difficulty: 'low'
  }
}

// Keyword mapping for specific tools
export const toolKeywords: Record<string, SemanticKeyword> = {
  midjourney: {
    primary: 'Midjourney AI',
    secondary: [
      'Midjourney review',
      'Midjourney vs DALL-E',
      'Midjourney pricing',
      'Midjourney alternatives'
    ],
    longTail: [
      'Midjourney AI art generator review',
      'how to use Midjourney for business',
      'Midjourney vs DALL-E comparison 2025',
      'best Midjourney alternatives for designers'
    ],
    lsi: [
      'AI art generation',
      'digital art creation',
      'creative AI tools',
      'image synthesis',
      'artistic AI',
      'visual content creation'
    ],
    entities: [
      'Midjourney',
      'AI Art Generator',
      'Digital Art Creation',
      'Creative AI Tool',
      'Image Generation Software'
    ],
    intent: 'commercial',
    searchVolume: 'high',
    difficulty: 'high'
  },

  chatgpt: {
    primary: 'ChatGPT',
    secondary: [
      'ChatGPT review',
      'ChatGPT vs Claude',
      'ChatGPT pricing',
      'ChatGPT alternatives'
    ],
    longTail: [
      'ChatGPT for business use cases',
      'how to use ChatGPT for content creation',
      'ChatGPT vs Claude AI comparison',
      'best ChatGPT alternatives for writing'
    ],
    lsi: [
      'conversational AI',
      'AI assistant',
      'natural language processing',
      'AI chatbot',
      'language model',
      'AI communication'
    ],
    entities: [
      'ChatGPT',
      'OpenAI',
      'Conversational AI',
      'AI Assistant',
      'Language Model'
    ],
    intent: 'commercial',
    searchVolume: 'high',
    difficulty: 'high'
  }
}

// Intent-based keyword categories
export const intentKeywords = {
  informational: [
    'what is AI',
    'how AI works',
    'AI tools guide',
    'AI technology explained',
    'AI benefits for business',
    'AI trends 2025',
    'AI implementation guide'
  ],
  commercial: [
    'best AI tools',
    'AI tools comparison',
    'AI software review',
    'top AI platforms',
    'AI tools for business',
    'professional AI tools',
    'enterprise AI solutions'
  ],
  transactional: [
    'buy AI software',
    'AI tools pricing',
    'AI software discount',
    'subscribe to AI tool',
    'AI tool free trial',
    'purchase AI license',
    'AI software deals'
  ],
  navigational: [
    'ChatGPT login',
    'Midjourney dashboard',
    'OpenAI platform',
    'AI tool support',
    'AI software documentation',
    'AI tool tutorials',
    'AI platform help'
  ]
}

// Geographic and demographic modifiers
export const geoModifiers = [
  'for small business',
  'for enterprises',
  'for startups',
  'for freelancers',
  'for agencies',
  'for developers',
  'for designers',
  'for marketers',
  'for content creators',
  'for students',
  'for professionals',
  'for teams'
]

// Seasonal and trending modifiers
export const trendingModifiers = [
  '2025',
  'latest',
  'new',
  'updated',
  'trending',
  'popular',
  'top rated',
  'most used',
  'recommended',
  'featured'
]

export default semanticKeywords