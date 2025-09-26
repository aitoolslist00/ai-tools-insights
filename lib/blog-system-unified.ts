import fs from 'fs/promises'
import path from 'path'
import { BlogPost } from './blog-data'
import { revalidatePath, revalidateTag } from 'next/cache'
import { fileOnlyBlogStorage } from './blog-storage-file-only'

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
  private readonly CACHE_TTL = 2000 // 2 seconds for immediate updates
  private storage = fileOnlyBlogStorage

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
      console.log('🔄 UnifiedBlogSystem: Loading posts via file storage...')
      const result = await this.storage.loadPosts()
      
      if (result.success) {
        // Cache the result in our local cache too
        const cacheKey = this.getCacheKey('loadPosts')
        this.setCache(cacheKey, result.data)
        console.log(`✅ UnifiedBlogSystem: Loaded ${result.data?.length || 0} posts`)
      }
      
      return result
    } catch (error) {
      console.error('❌ UnifiedBlogSystem: Error loading blog posts:', error)
      return {
        success: false,
        message: 'Failed to load blog posts',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }
  }

  async saveBlogPost(post: BlogPost): Promise<BlogOperationResult> {
    try {
      console.log('💾 UnifiedBlogSystem: Saving post via file storage...')
      
      // Create backup before making changes
      await this.createBackup()

      const result = await this.storage.savePost(post)
      
      if (result.success) {
        // Clear local cache
        this.clearCache()
        
        // Trigger revalidation
        await this.revalidateBlogPages(result.data)
        
        console.log(`✅ UnifiedBlogSystem: Post saved successfully: ${post.title}`)
      }
      
      return result
    } catch (error) {
      console.error('❌ UnifiedBlogSystem: Error saving blog post:', error)
      return {
        success: false,
        message: 'Failed to save blog post',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }
  }

  async deleteBlogPost(postId: string): Promise<BlogOperationResult> {
    try {
      console.log(`🗑️ UnifiedBlogSystem: Deleting post via file storage: ${postId}`)
      
      // Create backup before making changes
      await this.createBackup()

      const result = await this.storage.deletePost(postId)
      
      if (result.success) {
        // Clear local cache
        this.clearCache()
        
        // Trigger revalidation
        await this.revalidateBlogPages()
        
        console.log(`✅ UnifiedBlogSystem: Post deleted successfully: ${postId}`)
      }
      
      return result
    } catch (error) {
      console.error('❌ UnifiedBlogSystem: Error deleting blog post:', error)
      return {
        success: false,
        message: 'Failed to delete blog post',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
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

      // Test storage connection
      try {
        const connectionTest = await this.storage.validateConnection()
        if (!connectionTest.success) {
          errors.push(`Storage connection failed: ${connectionTest.error}`)
        }
      } catch (error) {
        errors.push(`Storage connection error: ${error instanceof Error ? error.message : 'Unknown error'}`)
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