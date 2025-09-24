/**
 * Advanced Internal Link Strategy System
 * Implements Google's latest SEO best practices for internal linking
 * Follows E-A-T (Expertise, Authoritativeness, Trustworthiness) principles
 */

export interface InternalLink {
  url: string
  anchorText: string
  title?: string
  context: 'navigation' | 'contextual' | 'related' | 'footer' | 'sidebar'
  priority: 'high' | 'medium' | 'low'
  category?: string
  keywords: string[]
}

export interface LinkCluster {
  name: string
  category: string
  mainPage: string
  relatedPages: string[]
  keywords: string[]
  priority: number
}

export interface BlogToToolConnection {
  blogSlug: string
  toolIds: string[]
  contextualPhrases: string[]
  conversionIntent: 'high' | 'medium' | 'low'
}

export class InternalLinkStrategy {
  // Core page hierarchy for link equity distribution
  private static readonly PAGE_HIERARCHY = {
    tier1: ['/'], // Homepage - highest authority
    tier2: ['/ai-tools', '/blog'], // Main category pages
    tier3: ['/about', '/contact', '/search'], // Supporting pages
    tier4: [], // Individual tool pages (dynamic)
    tier5: [] // Individual blog posts (dynamic)
  }

  // Strategic link clusters for topical authority
  private static readonly LINK_CLUSTERS: LinkCluster[] = [
    {
      name: 'AI Image Generation Hub',
      category: 'AI Image Generators',
      mainPage: '/ai-tools',
      relatedPages: [
        '/ai-tools/midjourney',
        '/ai-tools/dalle',
        '/ai-tools/stable-diffusion',
        '/ai-tools/adobe-firefly',
        '/ai-tools/ideogram',
        '/ai-tools/leonardo-ai'
      ],
      keywords: ['AI image generator', 'text to image', 'AI art', 'image creation', 'visual AI'],
      priority: 10
    },
    {
      name: 'AI Writing & Content Hub',
      category: 'AI Writing Tools',
      mainPage: '/ai-tools',
      relatedPages: [
        '/ai-tools/chatgpt',
        '/ai-tools/claude-ai',
        '/ai-tools/jasper-ai',
        '/ai-tools/copy-ai'
      ],
      keywords: ['AI writing', 'content creation', 'AI copywriting', 'text generation', 'writing assistant'],
      priority: 9
    },
    {
      name: 'AI Coding & Development Hub',
      category: 'AI Coding Tools',
      mainPage: '/ai-tools',
      relatedPages: [
        '/ai-tools/github-copilot',
        '/ai-tools/tabnine',
        '/ai-tools/codeium',
        '/ai-tools/replit-ghostwriter'
      ],
      keywords: ['AI coding', 'code assistant', 'programming AI', 'developer tools', 'code generation'],
      priority: 8
    },
    {
      name: 'AI Video & Audio Hub',
      category: 'AI Video Tools',
      mainPage: '/ai-tools',
      relatedPages: [
        '/ai-tools/runway',
        '/ai-tools/elevenlabs'
      ],
      keywords: ['AI video', 'video generation', 'AI audio', 'voice synthesis', 'multimedia AI'],
      priority: 7
    },
    {
      name: 'AI Research & Analysis Hub',
      category: 'AI Research Tools',
      mainPage: '/ai-tools',
      relatedPages: [
        '/ai-tools/perplexity-ai',
        '/ai-tools/pi-ai'
      ],
      keywords: ['AI research', 'AI analysis', 'information retrieval', 'AI search', 'research assistant'],
      priority: 6
    }
  ]

  // Blog to tool strategic connections for conversion optimization
  private static readonly BLOG_TOOL_CONNECTIONS: BlogToToolConnection[] = [
    {
      blogSlug: 'ultimate-guide-ai-image-generators-2024',
      toolIds: ['midjourney', 'dalle', 'stable-diffusion', 'adobe-firefly', 'ideogram', 'leonardo-ai'],
      contextualPhrases: [
        'best AI image generator',
        'top AI art tools',
        'professional image creation',
        'AI-powered design tools'
      ],
      conversionIntent: 'high'
    }
  ]

  // Anchor text variations for natural link diversity
  private static readonly ANCHOR_TEXT_VARIATIONS: Record<string, string[]> = {
    'midjourney': [
      'Midjourney',
      'Midjourney AI',
      'the Midjourney platform',
      'this AI art generator',
      'Midjourney\'s image generation',
      'the popular AI art tool',
      'Midjourney AI image generator'
    ],
    'dalle': [
      'DALL-E 3',
      'OpenAI\'s DALL-E',
      'DALL-E image generator',
      'this OpenAI tool',
      'DALL-E 3 platform',
      'OpenAI\'s image AI',
      'the DALL-E system'
    ],
    'chatgpt': [
      'ChatGPT',
      'OpenAI\'s ChatGPT',
      'the ChatGPT platform',
      'this AI chatbot',
      'ChatGPT AI assistant',
      'OpenAI\'s language model',
      'the popular AI chat tool'
    ],
    'claude-ai': [
      'Claude AI',
      'Anthropic\'s Claude',
      'Claude assistant',
      'this AI helper',
      'Claude AI chatbot',
      'Anthropic\'s AI model',
      'the Claude platform'
    ]
  }

  /**
   * Generate contextual internal links for any page
   */
  static generateContextualLinks(
    currentPage: string,
    content: string,
    maxLinks: number = 5
  ): InternalLink[] {
    const links: InternalLink[] = []
    const currentCategory = this.getCategoryFromUrl(currentPage)
    
    // Find relevant clusters
    const relevantClusters = this.LINK_CLUSTERS.filter(cluster => 
      cluster.category === currentCategory || 
      cluster.keywords.some(keyword => 
        content.toLowerCase().includes(keyword.toLowerCase())
      )
    )

    // Generate high-priority contextual links
    relevantClusters.forEach(cluster => {
      cluster.relatedPages.forEach(page => {
        if (page !== currentPage && links.length < maxLinks) {
          const toolId = this.extractToolIdFromUrl(page)
          const anchorVariations = this.ANCHOR_TEXT_VARIATIONS[toolId] || [this.getPageTitle(page)]
          
          links.push({
            url: page,
            anchorText: this.selectBestAnchorText(anchorVariations, content),
            context: 'contextual',
            priority: 'high',
            category: cluster.category,
            keywords: cluster.keywords,
            title: `Learn more about ${this.getPageTitle(page)}`
          })
        }
      })
    })

    return links.slice(0, maxLinks)
  }

  /**
   * Generate strategic navigation links for maximum link equity flow
   */
  static generateNavigationLinks(): InternalLink[] {
    return [
      {
        url: '/',
        anchorText: 'Home',
        context: 'navigation',
        priority: 'high',
        keywords: ['AI tools', 'directory', 'homepage']
      },
      {
        url: '/ai-tools',
        anchorText: 'AI Tools',
        context: 'navigation',
        priority: 'high',
        keywords: ['AI tools directory', 'artificial intelligence tools', 'AI software']
      },
      {
        url: '/blog',
        anchorText: 'Blog',
        context: 'navigation',
        priority: 'high',
        keywords: ['AI blog', 'AI insights', 'AI news', 'AI tutorials']
      },
      {
        url: '/about',
        anchorText: 'About',
        context: 'navigation',
        priority: 'medium',
        keywords: ['about us', 'AI tools experts', 'our mission']
      },
      {
        url: '/contact',
        anchorText: 'Contact',
        context: 'navigation',
        priority: 'medium',
        keywords: ['contact us', 'get in touch', 'support']
      },
      {
        url: '/search',
        anchorText: 'Search Tools',
        context: 'navigation',
        priority: 'high',
        keywords: ['search AI tools', 'find AI software', 'AI tool finder']
      }
    ]
  }

  /**
   * Generate related content links for blog posts
   */
  static generateRelatedBlogLinks(
    currentSlug: string,
    category?: string,
    maxLinks: number = 3
  ): InternalLink[] {
    // This will be populated dynamically as you create more blog posts
    const relatedPosts = [
      {
        slug: 'chatgpt-vs-claude-ai-comparison',
        title: 'ChatGPT vs Claude AI: Which AI Chatbot is Better for Business?',
        category: 'AI Comparisons',
        keywords: ['ChatGPT', 'Claude AI', 'AI chatbot comparison', 'business AI']
      },
      {
        slug: 'ai-coding-assistants-revolutionizing-development',
        title: 'How AI Coding Assistants Are Revolutionizing Software Development',
        category: 'AI Development',
        keywords: ['AI coding', 'GitHub Copilot', 'development tools', 'programming AI']
      },
      {
        slug: 'best-ai-writing-tools-content-creators-2024',
        title: '10 Best AI Writing Tools for Content Creators in 2024',
        category: 'AI Writing',
        keywords: ['AI writing tools', 'content creation', 'copywriting AI', 'writing assistant']
      }
    ]

    return relatedPosts
      .filter(post => post.slug !== currentSlug)
      .slice(0, maxLinks)
      .map(post => ({
        url: `/blog/${post.slug}`,
        anchorText: post.title,
        context: 'related',
        priority: 'medium',
        category: post.category,
        keywords: post.keywords
      }))
  }

  /**
   * Generate footer links for comprehensive site coverage
   */
  static generateFooterLinks(): InternalLink[] {
    return [
      // Main categories
      {
        url: '/ai-tools',
        anchorText: 'AI Tools Directory',
        context: 'footer',
        priority: 'high',
        keywords: ['AI tools', 'directory', 'artificial intelligence']
      },
      {
        url: '/blog',
        anchorText: 'AI Insights Blog',
        context: 'footer',
        priority: 'high',
        keywords: ['AI blog', 'insights', 'tutorials']
      },
      
      // Top tools (high-converting pages)
      {
        url: '/ai-tools/chatgpt',
        anchorText: 'ChatGPT Review',
        context: 'footer',
        priority: 'high',
        keywords: ['ChatGPT', 'AI chatbot', 'OpenAI']
      },
      {
        url: '/ai-tools/midjourney',
        anchorText: 'Midjourney Guide',
        context: 'footer',
        priority: 'high',
        keywords: ['Midjourney', 'AI art', 'image generation']
      },
      {
        url: '/ai-tools/github-copilot',
        anchorText: 'GitHub Copilot Review',
        context: 'footer',
        priority: 'high',
        keywords: ['GitHub Copilot', 'AI coding', 'development']
      },
      
      // Legal and support
      {
        url: '/privacy-policy',
        anchorText: 'Privacy Policy',
        context: 'footer',
        priority: 'low',
        keywords: ['privacy', 'policy', 'data protection']
      },
      {
        url: '/terms-of-service',
        anchorText: 'Terms of Service',
        context: 'footer',
        priority: 'low',
        keywords: ['terms', 'service', 'legal']
      }
    ]
  }

  /**
   * Generate blog-to-tool conversion links
   */
  static generateBlogToToolLinks(blogSlug: string): InternalLink[] {
    const connection = this.BLOG_TOOL_CONNECTIONS.find(conn => conn.blogSlug === blogSlug)
    if (!connection) return []

    return connection.toolIds.map(toolId => ({
      url: `/ai-tools/${toolId}`,
      anchorText: this.selectRandomAnchorText(toolId),
      context: 'contextual',
      priority: connection.conversionIntent === 'high' ? 'high' : 'medium',
      keywords: this.getToolKeywords(toolId),
      title: `Explore ${this.getToolName(toolId)} features and pricing`
    }))
  }

  /**
   * Generate category hub links for topical authority
   */
  static generateCategoryHubLinks(category: string): InternalLink[] {
    const cluster = this.LINK_CLUSTERS.find(c => c.category === category)
    if (!cluster) return []

    return cluster.relatedPages.map(page => ({
      url: page,
      anchorText: this.getPageTitle(page),
      context: 'related',
      priority: 'high',
      category: cluster.category,
      keywords: cluster.keywords
    }))
  }

  /**
   * Generate breadcrumb navigation links
   */
  static generateBreadcrumbLinks(currentPath: string): InternalLink[] {
    const pathSegments = currentPath.split('/').filter(Boolean)
    const breadcrumbs: InternalLink[] = [
      {
        url: '/',
        anchorText: 'Home',
        context: 'navigation',
        priority: 'high',
        keywords: ['home', 'AI tools directory']
      }
    ]

    let currentUrl = ''
    pathSegments.forEach((segment, index) => {
      currentUrl += `/${segment}`
      if (index < pathSegments.length - 1) { // Don't link to current page
        breadcrumbs.push({
          url: currentUrl,
          anchorText: this.formatBreadcrumbText(segment),
          context: 'navigation',
          priority: 'medium',
          keywords: this.getBreadcrumbKeywords(segment)
        })
      }
    })

    return breadcrumbs
  }

  // Helper methods
  private static getCategoryFromUrl(url: string): string {
    if (url.includes('/ai-tools/')) {
      // Extract tool ID and map to category
      const toolId = this.extractToolIdFromUrl(url)
      return this.getToolCategory(toolId)
    }
    return 'General'
  }

  private static extractToolIdFromUrl(url: string): string {
    return url.split('/').pop() || ''
  }

  private static getPageTitle(url: string): string {
    const toolId = this.extractToolIdFromUrl(url)
    return this.getToolName(toolId)
  }

  private static selectBestAnchorText(variations: string[], content: string): string {
    // Select anchor text that hasn't been used recently in the content
    return variations.find(variation => 
      !content.toLowerCase().includes(variation.toLowerCase())
    ) || variations[0]
  }

  private static selectRandomAnchorText(toolId: string): string {
    const variations = this.ANCHOR_TEXT_VARIATIONS[toolId] || [toolId]
    return variations[Math.floor(Math.random() * variations.length)]
  }

  private static getToolKeywords(toolId: string): string[] {
    // Map tool IDs to their primary keywords
    const keywordMap: Record<string, string[]> = {
      'midjourney': ['AI art', 'image generation', 'creative AI', 'digital art'],
      'dalle': ['AI images', 'OpenAI', 'text to image', 'image AI'],
      'chatgpt': ['AI chatbot', 'conversational AI', 'OpenAI', 'language model'],
      'claude-ai': ['AI assistant', 'Anthropic', 'helpful AI', 'AI chat'],
      'github-copilot': ['AI coding', 'code assistant', 'GitHub', 'programming AI'],
      'stable-diffusion': ['open source AI', 'image generation', 'free AI', 'customizable AI']
    }
    return keywordMap[toolId] || [toolId]
  }

  private static getToolName(toolId: string): string {
    const nameMap: Record<string, string> = {
      'midjourney': 'Midjourney',
      'dalle': 'DALL-E 3',
      'chatgpt': 'ChatGPT',
      'claude-ai': 'Claude AI',
      'github-copilot': 'GitHub Copilot',
      'stable-diffusion': 'Stable Diffusion',
      'adobe-firefly': 'Adobe Firefly',
      'ideogram': 'Ideogram',
      'leonardo-ai': 'Leonardo AI',
      'elevenlabs': 'ElevenLabs',
      'runway': 'Runway',
      'perplexity-ai': 'Perplexity AI',
      'pi-ai': 'Pi AI',
      'tabnine': 'Tabnine',
      'codeium': 'Codeium',
      'replit-ghostwriter': 'Replit Ghostwriter',
      'jasper-ai': 'Jasper AI',
      'copy-ai': 'Copy.ai'
    }
    return nameMap[toolId] || toolId
  }

  private static getToolCategory(toolId: string): string {
    const categoryMap: Record<string, string> = {
      'midjourney': 'AI Image Generators',
      'dalle': 'AI Image Generators',
      'stable-diffusion': 'AI Image Generators',
      'adobe-firefly': 'AI Image Generators',
      'ideogram': 'AI Image Generators',
      'leonardo-ai': 'AI Image Generators',
      'chatgpt': 'AI Writing Tools',
      'claude-ai': 'AI Writing Tools',
      'jasper-ai': 'AI Writing Tools',
      'copy-ai': 'AI Writing Tools',
      'github-copilot': 'AI Coding Tools',
      'tabnine': 'AI Coding Tools',
      'codeium': 'AI Coding Tools',
      'replit-ghostwriter': 'AI Coding Tools',
      'runway': 'AI Video Tools',
      'elevenlabs': 'AI Video Tools',
      'perplexity-ai': 'AI Research Tools',
      'pi-ai': 'AI Research Tools'
    }
    return categoryMap[toolId] || 'AI Tools'
  }

  private static formatBreadcrumbText(segment: string): string {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  private static getBreadcrumbKeywords(segment: string): string[] {
    const keywordMap: Record<string, string[]> = {
      'ai-tools': ['AI tools', 'artificial intelligence', 'AI directory'],
      'blog': ['AI blog', 'AI insights', 'AI news'],
      'about': ['about us', 'company info'],
      'contact': ['contact', 'support']
    }
    return keywordMap[segment] || [segment]
  }
}

/**
 * Link injection utilities for automatic contextual linking
 */
export class LinkInjector {
  /**
   * Inject contextual links into content
   */
  static injectContextualLinks(
    content: string,
    currentPage: string,
    maxLinks: number = 3
  ): string {
    const links = InternalLinkStrategy.generateContextualLinks(currentPage, content, maxLinks)
    let modifiedContent = content

    links.forEach(link => {
      const regex = new RegExp(`\\b${link.anchorText}\\b`, 'gi')
      const replacement = `<a href="${link.url}" title="${link.title || ''}" class="text-primary-600 hover:text-primary-700 font-medium">${link.anchorText}</a>`
      
      // Only replace first occurrence to avoid over-linking
      modifiedContent = modifiedContent.replace(regex, replacement)
    })

    return modifiedContent
  }

  /**
   * Generate related links section HTML
   */
  static generateRelatedLinksHTML(links: InternalLink[]): string {
    if (links.length === 0) return ''

    const linksHTML = links.map(link => `
      <li>
        <a href="${link.url}" 
           title="${link.title || ''}"
           class="text-primary-600 hover:text-primary-700 font-medium transition-colors">
          ${link.anchorText}
        </a>
      </li>
    `).join('')

    return `
      <div class="related-links bg-gray-50 p-6 rounded-lg mt-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Related Resources</h3>
        <ul class="space-y-2">
          ${linksHTML}
        </ul>
      </div>
    `
  }
}

export default InternalLinkStrategy