import fs from 'fs/promises'
import path from 'path'
import { BlogPost } from './blog-data'
import { revalidatePath, revalidateTag } from 'next/cache'

const BLOG_POSTS_FILE = path.join(process.cwd(), 'blog-posts.json')
const BACKUP_DIR = path.join(process.cwd(), 'backups')

export interface BlogOperationResult {
  success: boolean
  message: string
  data?: any
  error?: string
  timestamp: string
}

export class UnifiedBlogSystem {
  private static instance: UnifiedBlogSystem
  private lockFile = path.join(process.cwd(), '.blog-lock')
  private cache = new Map<string, { data: any; timestamp: number }>()
  private readonly CACHE_TTL = 5000 // 5 seconds in development

  static getInstance(): UnifiedBlogSystem {
    if (!UnifiedBlogSystem.instance) {
      UnifiedBlogSystem.instance = new UnifiedBlogSystem()
    }
    return UnifiedBlogSystem.instance
  }

  private async acquireLock(timeout = 5000): Promise<void> {
    const startTime = Date.now()
    
    while (Date.now() - startTime < timeout) {
      try {
        await fs.writeFile(this.lockFile, process.pid.toString(), { flag: 'wx' })
        return
      } catch (error) {
        await new Promise(resolve => setTimeout(resolve, 50))
      }
    }
    
    throw new Error('Could not acquire file lock within timeout')
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
      const blogBackups = backupFiles
        .filter(file => file.startsWith('blog-posts-'))
        .sort()
        .reverse()
      
      if (blogBackups.length > 10) {
        for (const oldBackup of blogBackups.slice(10)) {
          await fs.unlink(path.join(BACKUP_DIR, oldBackup))
        }
      }
    } catch (error) {
      console.warn('Failed to create backup:', error)
    }
  }

  private getCacheKey(operation: string, params?: any): string {
    return `${operation}_${params ? JSON.stringify(params) : 'all'}`
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T
    }
    return null
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  private clearCache(): void {
    this.cache.clear()
  }

  async loadBlogPosts(): Promise<BlogOperationResult> {
    try {
      const cacheKey = this.getCacheKey('loadPosts')
      const cached = this.getFromCache<BlogPost[]>(cacheKey)
      
      if (cached && process.env.NODE_ENV === 'production') {
        return {
          success: true,
          message: 'Posts loaded from cache',
          data: cached,
          timestamp: new Date().toISOString()
        }
      }

      const data = await fs.readFile(BLOG_POSTS_FILE, 'utf-8')
      const posts: BlogPost[] = JSON.parse(data)
      
      // Validate and clean posts
      const validPosts = posts.filter(post => {
        return post.id && post.title && post.content && post.href
      })

      // Sort by date (newest first)
      validPosts.sort((a, b) => {
        const dateA = new Date(b.publishedAt || b.date || b.updatedAt || '1970-01-01').getTime()
        const dateB = new Date(a.publishedAt || a.date || a.updatedAt || '1970-01-01').getTime()
        return dateA - dateB
      })

      this.setCache(cacheKey, validPosts)

      return {
        success: true,
        message: `Loaded ${validPosts.length} blog posts`,
        data: validPosts,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error loading blog posts:', error)
      return {
        success: false,
        message: 'Failed to load blog posts',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }
  }

  async saveBlogPost(post: BlogPost): Promise<BlogOperationResult> {
    await this.acquireLock()
    
    try {
      // Create backup before making changes
      await this.createBackup()

      // Load current posts
      const loadResult = await this.loadBlogPosts()
      if (!loadResult.success) {
        throw new Error(loadResult.error || 'Failed to load existing posts')
      }

      let posts: BlogPost[] = loadResult.data || []
      
      // Validate required fields
      if (!post.id || !post.title || !post.content) {
        throw new Error('Missing required fields: id, title, or content')
      }

      // Generate proper slug and href if missing
      if (!post.href || post.href === `/blog/${post.id}`) {
        const slug = this.generateSlug(post.title)
        post.id = slug
        post.href = `/blog/${slug}`
      }

      // Set timestamps
      const now = new Date().toISOString()
      post.updatedAt = now
      
      if (post.published && !post.publishedAt) {
        post.publishedAt = now
      }

      // Find existing post or add new one
      const existingIndex = posts.findIndex(p => p.id === post.id)
      
      if (existingIndex >= 0) {
        posts[existingIndex] = post
      } else {
        posts.unshift(post) // Add to beginning
      }

      // Save to file
      await fs.writeFile(BLOG_POSTS_FILE, JSON.stringify(posts, null, 2))

      // Clear cache and trigger revalidation
      this.clearCache()
      await this.revalidateBlogPages(post)

      return {
        success: true,
        message: `Blog post ${existingIndex >= 0 ? 'updated' : 'created'} successfully`,
        data: post,
        timestamp: now
      }
    } catch (error) {
      console.error('Error saving blog post:', error)
      return {
        success: false,
        message: 'Failed to save blog post',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    } finally {
      await this.releaseLock()
    }
  }

  async deleteBlogPost(postId: string): Promise<BlogOperationResult> {
    await this.acquireLock()
    
    try {
      await this.createBackup()

      const loadResult = await this.loadBlogPosts()
      if (!loadResult.success) {
        throw new Error(loadResult.error || 'Failed to load existing posts')
      }

      let posts: BlogPost[] = loadResult.data || []
      const initialLength = posts.length
      
      posts = posts.filter(p => p.id !== postId)
      
      if (posts.length === initialLength) {
        throw new Error('Post not found')
      }

      await fs.writeFile(BLOG_POSTS_FILE, JSON.stringify(posts, null, 2))

      this.clearCache()
      await this.revalidateBlogPages()

      return {
        success: true,
        message: 'Blog post deleted successfully',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error deleting blog post:', error)
      return {
        success: false,
        message: 'Failed to delete blog post',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    } finally {
      await this.releaseLock()
    }
  }

  async getPublishedPosts(): Promise<BlogOperationResult> {
    const loadResult = await this.loadBlogPosts()
    if (!loadResult.success) {
      return loadResult
    }

    const publishedPosts = (loadResult.data || []).filter((post: BlogPost) => post.published)
    
    return {
      success: true,
      message: `Found ${publishedPosts.length} published posts`,
      data: publishedPosts,
      timestamp: new Date().toISOString()
    }
  }

  async getFeaturedPosts(): Promise<BlogOperationResult> {
    const loadResult = await this.loadBlogPosts()
    if (!loadResult.success) {
      return loadResult
    }

    const featuredPosts = (loadResult.data || [])
      .filter((post: BlogPost) => post.published && post.featured)
    
    return {
      success: true,
      message: `Found ${featuredPosts.length} featured posts`,
      data: featuredPosts,
      timestamp: new Date().toISOString()
    }
  }

  async searchPosts(query: string): Promise<BlogOperationResult> {
    const loadResult = await this.loadBlogPosts()
    if (!loadResult.success) {
      return loadResult
    }

    const posts: BlogPost[] = loadResult.data || []
    const searchTerm = query.toLowerCase()
    
    const matchingPosts = posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
    
    return {
      success: true,
      message: `Found ${matchingPosts.length} posts matching "${query}"`,
      data: matchingPosts,
      timestamp: new Date().toISOString()
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50)
  }

  private async revalidateBlogPages(post?: BlogPost): Promise<void> {
    try {
      // Always revalidate main blog page
      revalidateTag('blog-posts')
      revalidatePath('/blog')
      revalidatePath('/blog/[slug]', 'page')
      
      // Revalidate specific post if provided
      if (post && post.published) {
        revalidatePath(post.href)
      }

      // In development, be more aggressive with cache clearing
      if (process.env.NODE_ENV === 'development') {
        const loadResult = await this.loadBlogPosts()
        if (loadResult.success) {
          const allPosts: BlogPost[] = loadResult.data || []
          allPosts.forEach(existingPost => {
            if (existingPost.published) {
              revalidatePath(existingPost.href)
            }
          })
        }
      }
    } catch (error) {
      console.warn('Failed to revalidate pages:', error)
    }
  }

  async getStats(): Promise<BlogOperationResult> {
    const loadResult = await this.loadBlogPosts()
    if (!loadResult.success) {
      return loadResult
    }

    const posts: BlogPost[] = loadResult.data || []
    
    const stats = {
      total: posts.length,
      published: posts.filter(p => p.published).length,
      drafts: posts.filter(p => !p.published).length,
      featured: posts.filter(p => p.featured).length,
      categories: Array.from(new Set(posts.map(p => p.category))).length,
      totalViews: posts.reduce((sum, p) => sum + (p.analytics?.views || 0), 0),
      averageReadTime: posts.length > 0 
        ? Math.round(posts.reduce((sum, p) => {
            const time = parseInt(p.readTime.replace(/\D/g, '')) || 5
            return sum + time
          }, 0) / posts.length)
        : 0
    }
    
    return {
      success: true,
      message: 'Blog statistics calculated',
      data: stats,
      timestamp: new Date().toISOString()
    }
  }

  async validateConnection(): Promise<BlogOperationResult> {
    try {
      const errors: string[] = []
      const warnings: string[] = []

      // Test file access
      try {
        await fs.access(BLOG_POSTS_FILE)
      } catch {
        errors.push('Blog posts file is not accessible')
      }

      // Test data integrity
      const loadResult = await this.loadBlogPosts()
      if (!loadResult.success) {
        errors.push('Cannot load blog posts data')
      } else {
        const posts: BlogPost[] = loadResult.data || []
        
        // Check for duplicate IDs
        const ids = posts.map(p => p.id)
        const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index)
        if (duplicateIds.length > 0) {
          errors.push(`Duplicate post IDs found: ${duplicateIds.join(', ')}`)
        }

        // Check for missing required fields
        posts.forEach(post => {
          if (!post.href || !post.href.startsWith('/blog/')) {
            warnings.push(`Post "${post.title}" has invalid URL structure`)
          }
          if (!post.excerpt || post.excerpt.length < 50) {
            warnings.push(`Post "${post.title}" has short excerpt`)
          }
        })
      }

      const isConnected = errors.length === 0
      
      return {
        success: true,
        message: isConnected ? 'Blog system is healthy' : 'Blog system has issues',
        data: {
          isConnected,
          errors,
          warnings,
          lastCheck: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        message: 'Connection validation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }
  }
}

export const unifiedBlogSystem = UnifiedBlogSystem.getInstance()