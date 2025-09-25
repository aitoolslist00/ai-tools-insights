import { kv } from '@vercel/kv'
import fs from 'fs/promises'
import path from 'path'
import { BlogPost } from './blog-data'

const BLOG_POSTS_FILE = path.join(process.cwd(), 'blog-posts.json')
const KV_BLOG_POSTS_KEY = 'blog:posts'
const KV_BLOG_STATS_KEY = 'blog:stats'

export interface BlogStorageResult {
  success: boolean
  message: string
  data?: any
  error?: string
  timestamp: string
}

export class VercelBlogStorage {
  private static instance: VercelBlogStorage
  private isProduction = process.env.NODE_ENV === 'production'
  private cache = new Map<string, { data: any; timestamp: number }>()
  private readonly CACHE_TTL = this.isProduction ? 30000 : 5000 // 30s prod, 5s dev

  static getInstance(): VercelBlogStorage {
    if (!VercelBlogStorage.instance) {
      VercelBlogStorage.instance = new VercelBlogStorage()
    }
    return VercelBlogStorage.instance
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

  async loadPosts(): Promise<BlogStorageResult> {
    try {
      const cacheKey = this.getCacheKey('loadPosts')
      const cached = this.getFromCache<BlogPost[]>(cacheKey)
      
      if (cached) {
        return {
          success: true,
          message: 'Posts loaded from cache',
          data: cached,
          timestamp: new Date().toISOString()
        }
      }

      let posts: BlogPost[] = []

      if (this.isProduction) {
        // Use Vercel KV in production
        console.log('🔄 Loading posts from Vercel KV...')
        const kvData = await kv.get<BlogPost[]>(KV_BLOG_POSTS_KEY)
        
        if (kvData) {
          posts = kvData
          console.log(`✅ Loaded ${posts.length} posts from KV`)
        } else {
          // If no data in KV, try to migrate from file (first time setup)
          console.log('📦 No data in KV, attempting migration from file...')
          try {
            const fileData = await fs.readFile(BLOG_POSTS_FILE, 'utf-8')
            posts = JSON.parse(fileData)
            
            // Save to KV for future use
            await kv.set(KV_BLOG_POSTS_KEY, posts)
            console.log(`🔄 Migrated ${posts.length} posts to KV`)
          } catch (fileError) {
            console.log('📝 No existing file data, starting with empty posts')
            posts = []
            await kv.set(KV_BLOG_POSTS_KEY, posts)
          }
        }
      } else {
        // Use file system in development
        console.log('🔄 Loading posts from file system (development)...')
        try {
          const data = await fs.readFile(BLOG_POSTS_FILE, 'utf-8')
          posts = JSON.parse(data)
          console.log(`✅ Loaded ${posts.length} posts from file`)
        } catch (error) {
          console.log('📝 No existing file, starting with empty posts')
          posts = []
          // Create empty file
          await fs.writeFile(BLOG_POSTS_FILE, JSON.stringify(posts, null, 2))
        }
      }

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
        message: `Loaded ${validPosts.length} blog posts from ${this.isProduction ? 'KV' : 'file'}`,
        data: validPosts,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('❌ Error loading blog posts:', error)
      return {
        success: false,
        message: 'Failed to load blog posts',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }
  }

  async savePosts(posts: BlogPost[]): Promise<BlogStorageResult> {
    try {
      console.log(`💾 Saving ${posts.length} posts to ${this.isProduction ? 'KV' : 'file'}...`)

      if (this.isProduction) {
        // Save to Vercel KV in production
        await kv.set(KV_BLOG_POSTS_KEY, posts)
        console.log('✅ Posts saved to KV')
      } else {
        // Save to file system in development
        await fs.writeFile(BLOG_POSTS_FILE, JSON.stringify(posts, null, 2))
        console.log('✅ Posts saved to file')
      }

      // Clear cache
      this.clearCache()

      return {
        success: true,
        message: `Successfully saved ${posts.length} posts`,
        data: posts,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('❌ Error saving posts:', error)
      return {
        success: false,
        message: 'Failed to save posts',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }
  }

  async savePost(post: BlogPost): Promise<BlogStorageResult> {
    try {
      console.log(`💾 Saving post: ${post.title}`)
      
      // Load existing posts
      const loadResult = await this.loadPosts()
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
        console.log(`📝 Updated existing post: ${post.id}`)
      } else {
        posts.unshift(post) // Add to beginning
        console.log(`➕ Added new post: ${post.id}`)
      }

      // Save all posts
      const saveResult = await this.savePosts(posts)
      if (!saveResult.success) {
        throw new Error(saveResult.error || 'Failed to save posts')
      }

      return {
        success: true,
        message: `Blog post ${existingIndex >= 0 ? 'updated' : 'created'} successfully`,
        data: post,
        timestamp: now
      }
    } catch (error) {
      console.error('❌ Error saving blog post:', error)
      return {
        success: false,
        message: 'Failed to save blog post',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }
  }

  async deletePost(postId: string): Promise<BlogStorageResult> {
    try {
      console.log(`🗑️ Deleting post: ${postId}`)
      
      // Load existing posts
      const loadResult = await this.loadPosts()
      if (!loadResult.success) {
        throw new Error(loadResult.error || 'Failed to load existing posts')
      }

      let posts: BlogPost[] = loadResult.data || []
      const initialLength = posts.length
      
      posts = posts.filter(p => p.id !== postId)
      
      if (posts.length === initialLength) {
        throw new Error('Post not found')
      }

      // Save updated posts
      const saveResult = await this.savePosts(posts)
      if (!saveResult.success) {
        throw new Error(saveResult.error || 'Failed to save posts after deletion')
      }

      console.log(`✅ Post deleted: ${postId}`)

      return {
        success: true,
        message: 'Blog post deleted successfully',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('❌ Error deleting blog post:', error)
      return {
        success: false,
        message: 'Failed to delete blog post',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }
  }

  async getStats(): Promise<BlogStorageResult> {
    try {
      const loadResult = await this.loadPosts()
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
    } catch (error) {
      console.error('❌ Error calculating stats:', error)
      return {
        success: false,
        message: 'Failed to calculate stats',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }
  }

  async validateConnection(): Promise<BlogStorageResult> {
    try {
      const errors: string[] = []
      const warnings: string[] = []

      if (this.isProduction) {
        // Test KV connection
        try {
          await kv.ping()
          console.log('✅ KV connection successful')
        } catch (kvError) {
          errors.push('Cannot connect to Vercel KV')
          console.error('❌ KV connection failed:', kvError)
        }
      } else {
        // Test file access in development
        try {
          await fs.access(BLOG_POSTS_FILE)
          console.log('✅ File access successful')
        } catch {
          warnings.push('Blog posts file will be created on first save')
        }
      }

      // Test data integrity
      const loadResult = await this.loadPosts()
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
        message: isConnected ? `Blog system is healthy (${this.isProduction ? 'KV' : 'File'})` : 'Blog system has issues',
        data: {
          isConnected,
          errors,
          warnings,
          storageType: this.isProduction ? 'Vercel KV' : 'File System',
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

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50)
  }
}

export const vercelBlogStorage = VercelBlogStorage.getInstance()