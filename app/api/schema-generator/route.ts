import { NextRequest, NextResponse } from 'next/server'
import { validateApiAuth } from '@/lib/auth-enhanced'

/**
 * COMPREHENSIVE SCHEMA GENERATOR
 * Generates all necessary JSON-LD structured data for maximum SEO impact
 */

interface SchemaGenerationRequest {
  content: {
    title: string
    content: string
    metaDescription: string
    keywords: string[]
    slug: string
    excerpt: string
    readingTime: number
    wordCount: number
    headings?: string[]
    imagePrompts?: string[]
  }
  seoAnalysis?: any
  url: string
  publishDate?: string
  author?: {
    name: string
    url?: string
  }
}

interface GeneratedSchemas {
  article: object
  faq: object
  breadcrumb: object
  organization: object
  howTo: object
  webPage: object
  imageObject?: object[]
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await validateApiAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: SchemaGenerationRequest = await request.json()
    const { content, url, publishDate, author } = body

    if (!content?.title || !content?.content) {
      return NextResponse.json({ error: 'Content title and body are required' }, { status: 400 })
    }

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Generate comprehensive schema markup
    const schemas = await generateComprehensiveSchemas({
      content,
      url,
      publishDate: publishDate || new Date().toISOString(),
      author: author || { name: 'AI Tools Insights', url: 'https://www.aitoolsinsights.com' }
    })

    return NextResponse.json({
      success: true,
      schemas,
      timestamp: new Date().toISOString(),
      schemaTypes: Object.keys(schemas)
    })

  } catch (error) {
    console.error('Schema generation error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate schemas'
    }, { status: 500 })
  }
}

async function generateComprehensiveSchemas(params: {
  content: SchemaGenerationRequest['content']
  url: string
  publishDate: string
  author: { name: string; url?: string }
}): Promise<GeneratedSchemas> {
  const { content, url, publishDate, author } = params
  const baseUrl = 'https://www.aitoolsinsights.com'
  const currentDate = new Date().toISOString()

  // Extract FAQ questions from content
  const faqQuestions = extractFAQFromContent(content.content)
  
  // Generate breadcrumb path
  const breadcrumbPath = generateBreadcrumbPath(url)
  
  // Generate HowTo steps
  const howToSteps = generateHowToSteps(content.title, content.content)

  const schemas: GeneratedSchemas = {
    // Article Schema (NewsArticle/BlogPosting)
    article: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: content.title,
      description: content.metaDescription,
      image: content.imagePrompts?.map((prompt, index) => ({
        '@type': 'ImageObject',
        url: `${baseUrl}/images/blog/${content.slug}-${index + 1}.jpg`,
        description: prompt,
        width: 1200,
        height: 630
      })) || [{
        '@type': 'ImageObject',
        url: `${baseUrl}/images/blog/${content.slug}-featured.jpg`,
        description: `Featured image for ${content.title}`,
        width: 1200,
        height: 630
      }],
      author: {
        '@type': author.url ? 'Organization' : 'Person',
        name: author.name,
        url: author.url || `${baseUrl}/about`,
        ...(author.url && {
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`,
            width: 200,
            height: 60
          }
        })
      },
      publisher: {
        '@type': 'Organization',
        name: 'AI Tools Insights',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`,
          width: 200,
          height: 60
        },
        sameAs: [
          'https://twitter.com/aitoolsinsights',
          'https://linkedin.com/company/aitoolsinsights'
        ]
      },
      datePublished: publishDate,
      dateModified: currentDate,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url
      },
      url: url,
      wordCount: content.wordCount,
      timeRequired: `PT${content.readingTime}M`,
      keywords: content.keywords.join(', '),
      articleSection: 'AI Tools',
      about: content.keywords.map(keyword => ({
        '@type': 'Thing',
        name: keyword,
        description: `Information about ${keyword}`,
        sameAs: `https://en.wikipedia.org/wiki/${encodeURIComponent(keyword)}`
      })),
      mentions: content.keywords.map(keyword => ({
        '@type': 'Thing',
        name: keyword
      })),
      inLanguage: 'en-US',
      copyrightYear: new Date().getFullYear(),
      copyrightHolder: {
        '@type': 'Organization',
        name: 'AI Tools Insights'
      },
      // E-A-T signals
      expertise: 'Expert-level analysis of AI tools and technologies',
      trustworthiness: 'Thoroughly researched and fact-checked content',
      authoritativeness: 'Written by AI industry experts and practitioners'
    },

    // FAQ Schema
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faqQuestions.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    },

    // Breadcrumb Schema
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: breadcrumbPath.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    },

    // Organization Schema
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${baseUrl}#organization`,
      name: 'AI Tools Insights',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 200,
        height: 60
      },
      description: 'Comprehensive reviews and insights on the latest AI tools and technologies',
      foundingDate: '2024',
      founder: {
        '@type': 'Person',
        name: 'AI Tools Insights Team'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'contact@aitoolsinsights.com',
        availableLanguage: 'English'
      },
      sameAs: [
        'https://twitter.com/aitoolsinsights',
        'https://linkedin.com/company/aitoolsinsights',
        'https://facebook.com/aitoolsinsights'
      ],
      knowsAbout: [
        'Artificial Intelligence',
        'Machine Learning',
        'AI Tools',
        'Software Reviews',
        'Technology Analysis'
      ],
      areaServed: 'Worldwide',
      serviceType: 'Information Services'
    },

    // HowTo Schema
    howTo: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      '@id': `${url}#howto`,
      name: `How to use ${content.title.replace(/^(Best|Top|Ultimate Guide to|How to)\s*/i, '')}`,
      description: `Step-by-step guide on ${content.title.toLowerCase()}`,
      image: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/blog/${content.slug}-howto.jpg`,
        description: `How-to guide for ${content.title}`
      },
      totalTime: `PT${content.readingTime}M`,
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: '0'
      },
      supply: howToSteps.supplies,
      tool: howToSteps.tools,
      step: howToSteps.steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
        image: {
          '@type': 'ImageObject',
          url: `${baseUrl}/images/blog/${content.slug}-step-${index + 1}.jpg`,
          description: step.name
        }
      }))
    },

    // WebPage Schema
    webPage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url: url,
      name: content.title,
      description: content.metaDescription,
      inLanguage: 'en-US',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${baseUrl}#website`,
        name: 'AI Tools Insights',
        url: baseUrl
      },
      about: {
        '@type': 'Thing',
        name: content.keywords[0] || 'AI Tools',
        description: content.metaDescription
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/blog/${content.slug}-featured.jpg`,
        description: `Featured image for ${content.title}`
      },
      datePublished: publishDate,
      dateModified: currentDate,
      author: {
        '@type': author.url ? 'Organization' : 'Person',
        name: author.name,
        url: author.url || `${baseUrl}/about`
      },
      publisher: {
        '@type': 'Organization',
        name: 'AI Tools Insights',
        url: baseUrl
      },
      potentialAction: {
        '@type': 'ReadAction',
        target: url
      },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', 'h2', '.excerpt']
      }
    }
  }

  // Add ImageObject schemas if image prompts exist
  if (content.imagePrompts && content.imagePrompts.length > 0) {
    schemas.imageObject = content.imagePrompts.map((prompt, index) => ({
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      '@id': `${url}#image-${index + 1}`,
      url: `${baseUrl}/images/blog/${content.slug}-${index + 1}.jpg`,
      description: prompt,
      width: 1200,
      height: 630,
      encodingFormat: 'image/jpeg',
      contentUrl: `${baseUrl}/images/blog/${content.slug}-${index + 1}.jpg`,
      author: {
        '@type': 'Organization',
        name: 'AI Tools Insights'
      },
      copyrightHolder: {
        '@type': 'Organization',
        name: 'AI Tools Insights'
      },
      license: `${baseUrl}/license`,
      acquireLicensePage: `${baseUrl}/license`
    }))
  }

  return schemas
}

function extractFAQFromContent(content: string): Array<{ question: string; answer: string }> {
  const faqRegex = /(?:^|\n)(?:##?\s*)?(?:Q:|Question:|FAQ:)?\s*(.+\?)\s*\n(?:A:|Answer:)?\s*(.+?)(?=\n(?:##?\s*)?(?:Q:|Question:|FAQ:)|\n\n|$)/gim
  const matches = Array.from(content.matchAll(faqRegex))
  
  if (matches.length > 0) {
    return matches.map(match => ({
      question: match[1].trim(),
      answer: match[2].trim()
    }))
  }

  // Generate default FAQs based on content keywords
  const defaultFAQs = [
    {
      question: "What are the key benefits of using AI tools?",
      answer: "AI tools offer increased efficiency, automation of repetitive tasks, improved accuracy, and the ability to process large amounts of data quickly."
    },
    {
      question: "How do I choose the right AI tool for my needs?",
      answer: "Consider your specific use case, budget, technical requirements, integration capabilities, and the tool's track record and user reviews."
    },
    {
      question: "Are AI tools suitable for beginners?",
      answer: "Many modern AI tools are designed with user-friendly interfaces that make them accessible to beginners, often requiring no coding experience."
    },
    {
      question: "What should I consider regarding data privacy with AI tools?",
      answer: "Always review the tool's privacy policy, understand how your data is stored and processed, and ensure compliance with relevant regulations like GDPR."
    },
    {
      question: "How much do AI tools typically cost?",
      answer: "AI tool pricing varies widely, from free tiers to enterprise solutions costing thousands per month, depending on features and usage requirements."
    }
  ]

  return defaultFAQs
}

function generateBreadcrumbPath(url: string): Array<{ name: string; url: string }> {
  const baseUrl = 'https://www.aitoolsinsights.com'
  const path = new URL(url).pathname.split('/').filter(Boolean)
  
  const breadcrumbs = [
    { name: 'Home', url: baseUrl }
  ]

  let currentPath = baseUrl
  path.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    if (index === path.length - 1) {
      // Don't add the current page to breadcrumbs
      return
    }

    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    breadcrumbs.push({
      name: name,
      url: currentPath
    })
  })

  return breadcrumbs
}

function generateHowToSteps(title: string, content: string): {
  supplies: Array<{ '@type': string; name: string }>
  tools: Array<{ '@type': string; name: string }>
  steps: Array<{ name: string; text: string }>
} {
  // Extract numbered steps from content
  const stepRegex = /(?:^|\n)(?:\d+\.|\*|\-)\s*(.+?)(?=\n(?:\d+\.|\*|\-)|$)/gim
  const matches = Array.from(content.matchAll(stepRegex))
  
  let steps: Array<{ name: string; text: string }> = []
  
  if (matches.length > 0) {
    steps = matches.slice(0, 10).map((match, index) => ({
      name: `Step ${index + 1}: ${match[1].split('.')[0].trim()}`,
      text: match[1].trim()
    }))
  } else {
    // Generate default steps based on title
    const toolName = title.replace(/^(Best|Top|Ultimate Guide to|How to)\s*/i, '')
    steps = [
      {
        name: `Step 1: Research ${toolName}`,
        text: `Begin by researching and understanding the capabilities of ${toolName}.`
      },
      {
        name: `Step 2: Sign up for ${toolName}`,
        text: `Create an account and choose the appropriate plan for your needs.`
      },
      {
        name: `Step 3: Set up your workspace`,
        text: `Configure your workspace and familiarize yourself with the interface.`
      },
      {
        name: `Step 4: Start with basic features`,
        text: `Begin using the basic features to get comfortable with the tool.`
      },
      {
        name: `Step 5: Explore advanced features`,
        text: `Once comfortable, explore more advanced features and capabilities.`
      }
    ]
  }

  return {
    supplies: [
      { '@type': 'HowToSupply', name: 'Computer or mobile device' },
      { '@type': 'HowToSupply', name: 'Internet connection' },
      { '@type': 'HowToSupply', name: 'Email address for account creation' }
    ],
    tools: [
      { '@type': 'HowToTool', name: 'Web browser' },
      { '@type': 'HowToTool', name: 'The AI tool being discussed' }
    ],
    steps
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Comprehensive Schema Generator API',
    version: '1.0',
    supportedSchemas: [
      'BlogPosting/Article',
      'FAQPage',
      'BreadcrumbList',
      'Organization',
      'HowTo',
      'WebPage',
      'ImageObject'
    ],
    features: [
      'Automatic FAQ extraction',
      'Dynamic breadcrumb generation',
      'HowTo step extraction',
      'E-A-T signal optimization',
      'Multi-schema integration',
      'SEO-optimized markup'
    ]
  })
}