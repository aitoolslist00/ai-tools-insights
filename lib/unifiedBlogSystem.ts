import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  author: string
  category: string
  tags: string[]
  readTime: number
  image?: string
  featured?: boolean
}

export interface BlogStats {
  totalPosts: number
  totalViews: number
  totalComments: number
  categoryCounts: Record<string, number>
  recentPosts: BlogPost[]
}

class UnifiedBlogSystem {
  private postsDirectory: string

  constructor() {
    this.postsDirectory = path.join(process.cwd(), 'content', 'blog')
  }

  async loadBlogPosts(): Promise<BlogPost[]> {
    try {
      // Check if blog directory exists
      if (!fs.existsSync(this.postsDirectory)) {
        console.log('Blog directory does not exist, creating sample posts...')
        return this.createSamplePosts()
      }

      const fileNames = fs.readdirSync(this.postsDirectory)
      const posts = fileNames
        .filter(name => name.endsWith('.md') || name.endsWith('.mdx'))
        .map(fileName => {
          const fullPath = path.join(this.postsDirectory, fileName)
          const fileContents = fs.readFileSync(fullPath, 'utf8')
          const { data, content } = matter(fileContents)
          
          const slug = fileName.replace(/\.(md|mdx)$/, '')
          
          return {
            slug,
            title: data.title || 'Untitled',
            excerpt: data.excerpt || content.substring(0, 160) + '...',
            content,
            date: data.date || new Date().toISOString(),
            author: data.author || 'AI Tools Team',
            category: data.category || 'General',
            tags: data.tags || [],
            readTime: this.calculateReadTime(content),
            image: data.image,
            featured: data.featured || false
          } as BlogPost
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      return posts
    } catch (error) {
      console.error('Error loading blog posts:', error)
      return this.createSamplePosts()
    }
  }

  async getBlogStats(): Promise<BlogStats> {
    try {
      const posts = await this.loadBlogPosts()
      
      const categoryCounts: Record<string, number> = {}
      posts.forEach(post => {
        categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1
      })

      return {
        totalPosts: posts.length,
        totalViews: posts.length * 150, // Mock data
        totalComments: posts.length * 12, // Mock data
        categoryCounts,
        recentPosts: posts.slice(0, 5)
      }
    } catch (error) {
      console.error('Error getting blog stats:', error)
      return {
        totalPosts: 0,
        totalViews: 0,
        totalComments: 0,
        categoryCounts: {},
        recentPosts: []
      }
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const posts = await this.loadBlogPosts()
      return posts.find(post => post.slug === slug) || null
    } catch (error) {
      console.error('Error getting post by slug:', error)
      return null
    }
  }

  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    try {
      const posts = await this.loadBlogPosts()
      return posts.filter(post => post.category.toLowerCase() === category.toLowerCase())
    } catch (error) {
      console.error('Error getting posts by category:', error)
      return []
    }
  }

  async getFeaturedPosts(): Promise<BlogPost[]> {
    try {
      const posts = await this.loadBlogPosts()
      return posts.filter(post => post.featured).slice(0, 3)
    } catch (error) {
      console.error('Error getting featured posts:', error)
      return []
    }
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  private createSamplePosts(): BlogPost[] {
    return [
      {
        slug: 'getting-started-with-ai-tools',
        title: 'Getting Started with AI Tools in 2024',
        excerpt: 'A comprehensive guide to choosing and using AI tools for productivity, creativity, and business growth.',
        content: `# Getting Started with AI Tools in 2024

Artificial Intelligence has revolutionized the way we work, create, and solve problems. In this comprehensive guide, we'll explore the best AI tools available today and how to integrate them into your workflow.

## Why AI Tools Matter

AI tools can help you:
- Increase productivity by automating repetitive tasks
- Enhance creativity with AI-powered generation
- Make better decisions with data-driven insights
- Save time on content creation and editing

## Top Categories of AI Tools

### 1. AI Writing Assistants
Tools like ChatGPT, Jasper, and Copy.ai can help with content creation, editing, and brainstorming.

### 2. AI Image Generators
Midjourney, DALL-E, and Stable Diffusion enable anyone to create stunning visuals from text descriptions.

### 3. AI Coding Assistants
GitHub Copilot and CodeT5 can accelerate development and help with debugging.

## Getting Started

1. Identify your needs
2. Start with free tools
3. Learn the basics
4. Gradually integrate into your workflow
5. Stay updated with new developments

The future of work is AI-augmented, and the time to start is now.`,
        date: '2024-01-15T10:00:00Z',
        author: 'AI Tools Team',
        category: 'Guides',
        tags: ['AI', 'Productivity', 'Getting Started'],
        readTime: 5,
        image: '/blog/ai-tools-guide.jpg',
        featured: true
      },
      {
        slug: 'best-ai-image-generators-2024',
        title: 'Best AI Image Generators of 2024',
        excerpt: 'Compare the top AI image generation tools including Midjourney, DALL-E 3, and Stable Diffusion.',
        content: `# Best AI Image Generators of 2024

AI image generation has reached incredible heights in 2024. Here's our comprehensive comparison of the leading platforms.

## Top Contenders

### 1. Midjourney
- **Strengths**: Artistic quality, community
- **Best for**: Creative artwork, concept art
- **Pricing**: $10-60/month

### 2. DALL-E 3
- **Strengths**: Text understanding, safety
- **Best for**: Precise image generation
- **Pricing**: Pay-per-use

### 3. Stable Diffusion
- **Strengths**: Open source, customizable
- **Best for**: Technical users, custom models
- **Pricing**: Free (self-hosted)

## Choosing the Right Tool

Consider these factors:
- Your skill level
- Budget constraints
- Intended use case
- Quality requirements

Each tool has its strengths, and the best choice depends on your specific needs.`,
        date: '2024-01-10T14:30:00Z',
        author: 'Sarah Chen',
        category: 'Reviews',
        tags: ['AI', 'Image Generation', 'Midjourney', 'DALL-E'],
        readTime: 7,
        image: '/blog/ai-image-generators.jpg',
        featured: true
      },
      {
        slug: 'ai-coding-assistants-comparison',
        title: 'AI Coding Assistants: A Developer\'s Guide',
        excerpt: 'Explore how AI coding assistants like GitHub Copilot and CodeT5 are transforming software development.',
        content: `# AI Coding Assistants: A Developer's Guide

AI coding assistants are revolutionizing software development. Let's explore the top tools and how they can boost your productivity.

## Leading AI Coding Tools

### GitHub Copilot
- **Features**: Code completion, function generation
- **Languages**: 30+ programming languages
- **Integration**: VS Code, JetBrains IDEs
- **Price**: $10/month

### CodeT5
- **Features**: Code generation, documentation
- **Strengths**: Open source, customizable
- **Best for**: Research, custom implementations

### Tabnine
- **Features**: AI code completion
- **Strengths**: Privacy-focused, on-premise options
- **Languages**: 30+ languages

## Benefits for Developers

1. **Faster Development**: Reduce time spent on boilerplate code
2. **Learning Aid**: Discover new patterns and approaches
3. **Bug Reduction**: AI-suggested code often follows best practices
4. **Documentation**: Auto-generate comments and docs

## Best Practices

- Review AI-generated code carefully
- Use as a starting point, not final solution
- Understand the code before implementing
- Keep learning and improving your skills

AI assistants are tools to enhance, not replace, developer expertise.`,
        date: '2024-01-05T09:15:00Z',
        author: 'Mike Rodriguez',
        category: 'Development',
        tags: ['AI', 'Coding', 'GitHub Copilot', 'Development'],
        readTime: 6,
        image: '/blog/ai-coding-assistants.jpg',
        featured: false
      }
    ]
  }
}

export const unifiedBlogSystem = new UnifiedBlogSystem()