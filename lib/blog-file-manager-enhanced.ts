import fs from 'fs/promises'
import path from 'path'
import { BlogPost } from './blog-data'
import { z } from 'zod'

const BLOG_POSTS_FILE = path.join(process.cwd(), 'blog-posts.json')
const BACKUP_DIR = path.join(process.cwd(), 'backups')

// Validation schema for blog posts
const BlogPostSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  excerpt: z.string().min(1).max(500),
  content: z.string().min(1),
  author: z.string().min(1).max(100),
  date: z.string(),
  readTime: z.string(),
  category: z.string().min(1),
  featured: z.boolean(),
  published: z.boolean(),
  image: z.string().optional(),
  href: z.string().min(1),
  tags: z.array(z.string()).max(20),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.string().optional(),
    focusKeyword: z.string().optional(),
    canonicalUrl: z.string().optional(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    ogImage: z.string().optional(),
    twitterTitle: z.string().optional(),
    twitterDescription: z.string().optional(),
    twitterImage: z.string().optional(),
  }).optional(),
  analytics: z.object({
    views: z.number().optional(),
    shares: z.number().optional(),
    likes: z.number().optional(),
  }).optional(),
  publishedAt: z.string().optional(),
  updatedAt: z.string().optional(),
  status: z.enum(['draft', 'published', 'scheduled']),
  scheduledFor: z.string().optional(),
})

export class BlogFileManager {
  private static instance: BlogFileManager
  private lockFile = path.join(process.cwd(), '.blog-lock')

  static getInstance(): BlogFileManager {
    if (!BlogFileManager.instance) {
      BlogFileManager.instance = new BlogFileManager()
    }
    return BlogFileManager.instance
  }

  private async acquireLock(): Promise<void> {
    let attempts = 0
    const maxAttempts = 50
    
    while (attempts < maxAttempts) {
      try {
        await fs.writeFile(this.lockFile, process.pid.toString(), { flag: 'wx' })
        return
      } catch (error) {
        attempts++
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    throw new Error('Could not acquire file lock')
  }

  private async releaseLock(): Promise<void> {
    try {
      await fs.unlink(this.lockFile)
    } catch (error) {
      // Lock file might not exist, ignore
    }
  }

  private async ensureBackupDir(): Promise<void> {
    try {
      await fs.access(BACKUP_DIR)
    } catch {
      await fs.mkdir(BACKUP_DIR, { recursive: true })
    }
  }

  private async createBackup(): Promise<void> {
    try {
      await this.ensureBackupDir()
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const backupFile = path.join(BACKUP_DIR, `blog-posts-${timestamp}.json`)
      
      const currentData = await fs.readFile(BLOG_POSTS_FILE, 'utf-8')
      await fs.writeFile(backupFile, currentData)
      
      // Keep only last 10 backups
      const backupFiles = await fs.readdir(BACKUP_DIR)
      const sortedBackups = backupFiles
        .filter(file => file.startsWith('blog-posts-'))
        .sort()
        .reverse()
      
      if (sortedBackups.length > 10) {
        for (const file of sortedBackups.slice(10)) {
          await fs.unlink(path.join(BACKUP_DIR, file))
        }
      }
    } catch (error) {
      console.error('Failed to create backup:', error)
    }
  }

  private validatePost(post: any): BlogPost {
    try {
      // Add default values for missing fields to ensure compatibility
      const postWithDefaults = {
        ...post,
        seo: post.seo || {},
        analytics: post.analytics || {},
        status: post.status || (post.published ? 'published' : 'draft'),
        publishedAt: post.publishedAt || (post.published ? post.date : undefined),
        updatedAt: post.updatedAt || post.date
      }
      
      return BlogPostSchema.parse(postWithDefaults)
    } catch (error) {
      console.error(`Invalid blog post data for post ${post.id}:`, error)
      // Return a basic valid post structure instead of throwing
      return {
        ...post,
        seo: post.seo || {},
        analytics: post.analytics || {},
        status: post.status || (post.published ? 'published' : 'draft'),
        publishedAt: post.publishedAt || (post.published ? post.date : undefined),
        updatedAt: post.updatedAt || post.date
      } as BlogPost
    }
  }

  private sanitizeContent(content: string): string {
    // Basic HTML sanitization - in production, use a proper library like DOMPurify
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
  }

  async loadBlogPostsFromFile(): Promise<BlogPost[]> {
    try {
      await fs.access(BLOG_POSTS_FILE)
      const fileContent = await fs.readFile(BLOG_POSTS_FILE, 'utf-8')
      const posts = JSON.parse(fileContent)
      
      // Validate all posts
      return posts.map((post: any) => this.validatePost(post))
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        return []
      }
      console.error('Error loading blog posts from file:', error)
      throw new Error('Failed to load blog posts')
    }
  }

  async saveBlogPostsToFile(posts: BlogPost[]): Promise<boolean> {
    await this.acquireLock()
    
    try {
      // Validate all posts before saving
      const validatedPosts = posts.map(post => this.validatePost(post))
      
      // Create backup before saving
      try {
        await fs.access(BLOG_POSTS_FILE)
        await this.createBackup()
      } catch {
        // File doesn't exist yet, no backup needed
      }
      
      const jsonContent = JSON.stringify(validatedPosts, null, 2)
      await fs.writeFile(BLOG_POSTS_FILE, jsonContent, 'utf-8')
      
      return true
    } catch (error) {
      console.error('Error saving blog posts to file:', error)
      throw new Error('Failed to save blog posts')
    } finally {
      await this.releaseLock()
    }
  }

  async addBlogPost(post: BlogPost): Promise<boolean> {
    await this.acquireLock()
    
    try {
      console.log('🔍 Enhanced file manager - Adding post:', {
        id: post.id,
        title: post.title,
        published: post.published,
        status: post.status
      })
      
      // Validate and sanitize the post
      const validatedPost = this.validatePost({
        ...post,
        content: this.sanitizeContent(post.content),
        excerpt: this.sanitizeContent(post.excerpt)
      })
      
      console.log('✅ Post validated successfully')
      
      const posts = await this.loadBlogPostsFromFile()
      console.log('📚 Current posts count:', posts.length)
      
      const existingIndex = posts.findIndex(p => p.id === validatedPost.id)
      console.log('🔍 Existing post index:', existingIndex)
      
      const now = new Date().toISOString()
      
      // Ensure href is correctly set based on post ID
      const postWithHref = {
        ...validatedPost,
        href: `/blog/${validatedPost.id}`
      }
      
      if (existingIndex >= 0) {
        // Update existing post - preserve original publishedAt, update updatedAt
        const existingPost = posts[existingIndex]
        posts[existingIndex] = {
          ...postWithHref,
          updatedAt: now,
          publishedAt: existingPost.publishedAt || (validatedPost.published ? now : undefined)
        }
        console.log('🔄 Updated existing post at index:', existingIndex)
      } else {
        // Add new post - set both timestamps
        posts.push({
          ...postWithHref,
          updatedAt: now,
          publishedAt: validatedPost.published ? now : undefined
        })
        console.log('➕ Added new post. Total posts now:', posts.length)
      }
      
      const saveResult = await this.saveBlogPostsToFile(posts)
      console.log('💾 Save result:', saveResult)
      return saveResult
    } catch (error) {
      console.error('Error adding blog post:', error)
      throw error
    } finally {
      await this.releaseLock()
    }
  }

  async deleteBlogPost(postId: string): Promise<boolean> {
    await this.acquireLock()
    
    try {
      const posts = await this.loadBlogPostsFromFile()
      const filteredPosts = posts.filter(p => p.id !== postId)
      
      if (filteredPosts.length === posts.length) {
        throw new Error('Post not found')
      }
      
      return await this.saveBlogPostsToFile(filteredPosts)
    } catch (error) {
      console.error('Error deleting blog post:', error)
      throw error
    } finally {
      await this.releaseLock()
    }
  }

  async getBlogPostById(postId: string): Promise<BlogPost | null> {
    try {
      const posts = await this.loadBlogPostsFromFile()
      return posts.find(p => p.id === postId) || null
    } catch (error) {
      console.error('Error getting blog post by ID:', error)
      throw error
    }
  }

  async getPublishedPosts(page: number = 1, limit: number = 10): Promise<{ posts: BlogPost[], total: number, hasMore: boolean }> {
    try {
      const allPosts = await this.loadBlogPostsFromFile()
      const publishedPosts = allPosts
        .filter(p => p.published)
        .sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0
          const dateB = b.date ? new Date(b.date).getTime() : 0
          return dateB - dateA
        })
      
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const posts = publishedPosts.slice(startIndex, endIndex)
      
      return {
        posts,
        total: publishedPosts.length,
        hasMore: endIndex < publishedPosts.length
      }
    } catch (error) {
      console.error('Error getting published posts:', error)
      throw error
    }
  }

  async getFeaturedPosts(): Promise<BlogPost[]> {
    try {
      const posts = await this.loadBlogPostsFromFile()
      return posts
        .filter(p => p.published && p.featured)
        .sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0
          const dateB = b.date ? new Date(b.date).getTime() : 0
          return dateB - dateA
        })
    } catch (error) {
      console.error('Error getting featured posts:', error)
      throw error
    }
  }

  async searchPosts(query: string, page: number = 1, limit: number = 10): Promise<{ posts: BlogPost[], total: number, hasMore: boolean }> {
    try {
      const allPosts = await this.loadBlogPostsFromFile()
      const searchTerm = query.toLowerCase()
      
      const matchingPosts = allPosts
        .filter(post => 
          post.published && (
            post.title.toLowerCase().includes(searchTerm) ||
            post.excerpt.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
          )
        )
        .sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0
          const dateB = b.date ? new Date(b.date).getTime() : 0
          return dateB - dateA
        })
      
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const posts = matchingPosts.slice(startIndex, endIndex)
      
      return {
        posts,
        total: matchingPosts.length,
        hasMore: endIndex < matchingPosts.length
      }
    } catch (error) {
      console.error('Error searching posts:', error)
      throw error
    }
  }
}

// Export singleton instance
export const blogFileManager = BlogFileManager.getInstance()

// Legacy exports for backward compatibility
export const loadBlogPostsFromFile = () => blogFileManager.loadBlogPostsFromFile()
export const saveBlogPostsToFile = (posts: BlogPost[]) => blogFileManager.saveBlogPostsToFile(posts)
export const addBlogPost = (post: BlogPost) => blogFileManager.addBlogPost(post)
export const deleteBlogPost = (postId: string) => blogFileManager.deleteBlogPost(postId)
export const getBlogPostById = (postId: string) => blogFileManager.getBlogPostById(postId)
export const getPublishedPosts = () => blogFileManager.getPublishedPosts()
export const getFeaturedPosts = () => blogFileManager.getFeaturedPosts()