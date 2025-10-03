import { NextRequest, NextResponse } from 'next/server'
import { validateApiAuth } from '@/lib/auth-enhanced'
import fs from 'fs/promises'
import path from 'path'

/**
 * SMART PUBLISHING SYSTEM
 * Automatically publishes SEO-optimized content with schema integration
 */

interface SmartPublishRequest {
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
    internalLinks?: string[]
    externalLinks?: string[]
    imagePrompts?: string[]
  }
  seoData?: any
  schemas?: any
  images?: any[]
  autoPublish: boolean
  publishDate?: string
  featured?: boolean
  category?: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  metaDescription: string
  keywords: string[]
  readingTime: number
  wordCount: number
  published: boolean
  featured: boolean
  publishDate: string
  lastModified: string
  category: string
  author: string
  seoScore?: number
  schemas?: any
  internalLinks?: string[]
  externalLinks?: string[]
  imagePrompts?: string[]
  headings?: string[]
  images?: any[]
  image?: string
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await validateApiAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: SmartPublishRequest = await request.json()
    const { content, seoData, schemas, images, autoPublish, publishDate, featured = false, category = 'ai-tools' } = body

    console.log('Smart publish received images:', images)

    if (!content?.title || !content?.content || !content?.slug) {
      return NextResponse.json({ error: 'Content title, body, and slug are required' }, { status: 400 })
    }

    // Create backup before making changes
    await createBackup()

    // Load existing blog posts
    const blogPosts = await loadBlogPosts()

    // Generate unique ID
    const id = generateUniqueId(blogPosts)

    // Calculate SEO score
    const seoScore = calculateSEOScore(content, seoData)

    // Use provided images or generate new ones if imagePrompts are provided
    let generatedImages: any[] = images || []
    if (generatedImages.length === 0 && content.imagePrompts && content.imagePrompts.length > 0) {
      try {
        console.log('Generating images for article:', content.title)
        const imageResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/generate-images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': request.headers.get('Authorization') || ''
          },
          body: JSON.stringify({
            prompts: content.imagePrompts,
            articleTitle: content.title,
            keywords: content.keywords,
            style: 'tech' // Default style, can be made configurable
          })
        })

        if (imageResponse.ok) {
          const imageData = await imageResponse.json()
          generatedImages = imageData.images || []
          console.log(`Successfully generated ${generatedImages.length} images for article`)
        } else {
          console.warn('Failed to generate images:', await imageResponse.text())
        }
      } catch (error) {
        console.error('Error generating images:', error)
      }
    }

    // Create new blog post
    const newPost: BlogPost = {
      id,
      title: content.title,
      slug: content.slug,
      excerpt: content.excerpt,
      content: content.content,
      metaDescription: content.metaDescription,
      keywords: content.keywords,
      readingTime: content.readingTime,
      wordCount: content.wordCount,
      published: autoPublish,
      featured,
      publishDate: publishDate || new Date().toISOString(),
      lastModified: new Date().toISOString(),
      category,
      author: 'AI Tools Insights',
      seoScore,
      schemas,
      internalLinks: content.internalLinks || [],
      externalLinks: content.externalLinks || [],
      imagePrompts: content.imagePrompts || [],
      headings: content.headings || [],
      images: generatedImages.length > 0 ? generatedImages : undefined,
      image: generatedImages.length > 0 ? generatedImages[0]?.url : undefined
    }

    // Check for duplicate slug
    const existingPost = blogPosts.find(post => post.slug === content.slug)
    if (existingPost) {
      // Update existing post
      const updatedPosts = blogPosts.map(post => 
        post.slug === content.slug 
          ? { ...newPost, id: post.id, publishDate: post.publishDate }
          : post
      )
      await saveBlogPosts(updatedPosts)
    } else {
      // Add new post
      blogPosts.push(newPost)
      await saveBlogPosts(blogPosts)
    }

    // Revalidate blog pages
    await revalidateBlogPages(content.slug)

    // Generate sitemap update
    await updateSitemap()

    // Submit to search engines if published
    if (autoPublish) {
      await submitToSearchEngines(content.slug)
    }

    const publishedUrl = `https://www.aitoolsinsights.com/blog/${content.slug}`

    return NextResponse.json({
      success: true,
      post: newPost,
      url: publishedUrl,
      publishedAt: newPost.publishDate,
      seoScore,
      actions: {
        backup: 'created',
        revalidation: 'completed',
        sitemap: 'updated',
        searchEngines: autoPublish ? 'submitted' : 'skipped'
      },
      message: autoPublish 
        ? 'Article successfully published and optimized!'
        : 'Article saved as draft with full optimization.'
    })

  } catch (error) {
    console.error('Smart publish error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to publish content'
    }, { status: 500 })
  }
}

async function loadBlogPosts(): Promise<BlogPost[]> {
  try {
    const filePath = path.join(process.cwd(), 'blog-posts.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.warn('No existing blog posts file found, creating new one')
    return []
  }
}

async function saveBlogPosts(posts: BlogPost[]): Promise<void> {
  const filePath = path.join(process.cwd(), 'blog-posts.json')
  await fs.writeFile(filePath, JSON.stringify(posts, null, 2), 'utf-8')
}

async function createBackup(): Promise<void> {
  try {
    const filePath = path.join(process.cwd(), 'blog-posts.json')
    const backupDir = path.join(process.cwd(), 'backups')
    
    // Ensure backup directory exists
    try {
      await fs.access(backupDir)
    } catch {
      await fs.mkdir(backupDir, { recursive: true })
    }

    // Create backup with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = path.join(backupDir, `blog-posts-${timestamp}.json`)
    
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      await fs.writeFile(backupPath, content, 'utf-8')
    } catch (error) {
      // File doesn't exist yet, skip backup
      console.log('No existing blog posts to backup')
    }
  } catch (error) {
    console.warn('Failed to create backup:', error)
  }
}

function generateUniqueId(existingPosts: BlogPost[]): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  let id = `post-${timestamp}-${random}`
  
  // Ensure uniqueness
  while (existingPosts.some(post => post.id === id)) {
    id = `post-${timestamp}-${Math.floor(Math.random() * 10000)}`
  }
  
  return id
}

function calculateSEOScore(content: any, seoData?: any): number {
  let score = 0
  
  // Title optimization (20 points)
  if (content.title.length >= 30 && content.title.length <= 60) score += 15
  if (content.title.toLowerCase().includes('ai') || content.title.toLowerCase().includes('tool')) score += 5
  
  // Meta description (15 points)
  if (content.metaDescription.length >= 120 && content.metaDescription.length <= 160) score += 15
  
  // Content length (20 points)
  if (content.wordCount >= 1000) score += 10
  if (content.wordCount >= 1500) score += 5
  if (content.wordCount >= 2000) score += 5
  
  // Keywords (15 points)
  if (content.keywords.length >= 3) score += 10
  if (content.keywords.length <= 7) score += 5
  
  // Structure (10 points)
  if (content.headings && content.headings.length >= 3) score += 5
  if (content.content.includes('##') || content.content.includes('#')) score += 5
  
  // Links (10 points)
  if (content.internalLinks && content.internalLinks.length > 0) score += 5
  if (content.externalLinks && content.externalLinks.length > 0) score += 5
  
  // Reading experience (10 points)
  if (content.readingTime >= 3 && content.readingTime <= 15) score += 10
  
  return Math.min(100, score)
}

async function revalidateBlogPages(slug: string): Promise<void> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    
    // Revalidate blog index
    await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/blog' })
    })
    
    // Revalidate specific blog post
    await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: `/blog/${slug}` })
    })
    
    // Revalidate home page (for featured posts)
    await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/' })
    })
    
  } catch (error) {
    console.warn('Failed to revalidate pages:', error)
  }
}

async function updateSitemap(): Promise<void> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    
    // Trigger sitemap regeneration
    await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/sitemap.xml' })
    })
    
  } catch (error) {
    console.warn('Failed to update sitemap:', error)
  }
}

async function submitToSearchEngines(slug: string): Promise<void> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aitoolsinsights.com'
    const url = `${baseUrl}/blog/${slug}`
    
    // Submit to Google
    await fetch(`${baseUrl}/api/submit-to-google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    }).catch(error => console.warn('Google submission failed:', error))
    
    // Ping search engines
    await fetch(`${baseUrl}/api/ping-search-engines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    }).catch(error => console.warn('Search engine ping failed:', error))
    
  } catch (error) {
    console.warn('Failed to submit to search engines:', error)
  }
}

// Batch publishing endpoint
export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await validateApiAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, postIds } = await request.json()
    
    if (!action || !postIds || !Array.isArray(postIds)) {
      return NextResponse.json({ error: 'Action and postIds array are required' }, { status: 400 })
    }

    const blogPosts = await loadBlogPosts()
    let updatedCount = 0

    const updatedPosts = blogPosts.map(post => {
      if (postIds.includes(post.id)) {
        updatedCount++
        switch (action) {
          case 'publish':
            return { ...post, published: true, lastModified: new Date().toISOString() }
          case 'unpublish':
            return { ...post, published: false, lastModified: new Date().toISOString() }
          case 'feature':
            return { ...post, featured: true, lastModified: new Date().toISOString() }
          case 'unfeature':
            return { ...post, featured: false, lastModified: new Date().toISOString() }
          default:
            return post
        }
      }
      return post
    })

    if (updatedCount > 0) {
      await createBackup()
      await saveBlogPosts(updatedPosts)
      
      // Revalidate affected pages
      for (const post of updatedPosts.filter(p => postIds.includes(p.id))) {
        await revalidateBlogPages(post.slug)
      }
    }

    return NextResponse.json({
      success: true,
      updatedCount,
      action,
      message: `Successfully ${action}ed ${updatedCount} post(s)`
    })

  } catch (error) {
    console.error('Batch publish error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to perform batch action'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Smart Publishing System API',
    version: '1.0',
    features: [
      'Automated blog post publishing',
      'SEO score calculation',
      'Schema integration',
      'Automatic backups',
      'Page revalidation',
      'Sitemap updates',
      'Search engine submission',
      'Batch operations'
    ],
    endpoints: {
      'POST /': 'Publish single post',
      'PUT /': 'Batch operations (publish/unpublish/feature)',
      'GET /': 'API information'
    }
  })
}