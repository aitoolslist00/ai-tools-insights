import fs from 'fs/promises'
import path from 'path'
import { BlogPost } from './blog-data'
import { revalidatePath, revalidateTag } from 'next/cache'

const BLOG_POSTS_FILE = path.join(process.cwd(), 'blog-posts.json')

export interface BlogStorageResult {
  success: boolean
  message: string
  data?: any
  error?: string
  timestamp: string
}

export class FileOnlyBlogStorage {
  private static instance: FileOnlyBlogStorage
  private cache = new Map<string, { data: any; timestamp: number }>()
  private readonly CACHE_TTL = 2000 // 2 seconds - short cache for immediate updates

  static getInstance(): FileOnlyBlogStorage {
    if (!FileOnlyBlogStorage.instance) {
      FileOnlyBlogStorage.instance = new FileOnlyBlogStorage()
    }
    return FileOnlyBlogStorage.instance
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
    console.log('🗑️ Cache cleared')
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

      console.log('📂 Loading posts from file...')
      let posts: BlogPost[] = []

      try {
        const data = await fs.readFile(BLOG_POSTS_FILE, 'utf-8')
        posts = JSON.parse(data)
        console.log(`✅ Loaded ${posts.length} posts from file`)
      } catch (error) {
        if ((error as any).code === 'ENOENT') {
          console.log('📝 No existing file, starting with empty posts')
          posts = []
          // Create empty file
          await fs.writeFile(BLOG_POSTS_FILE, JSON.stringify(posts, null, 2))
        } else {
          throw error
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
        message: `Loaded ${validPosts.length} blog posts from file`,
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
      console.log(`💾 Saving ${posts.length} posts to file...`)
      
      // Save to file system
      await fs.writeFile(BLOG_POSTS_FILE, JSON.stringify(posts, null, 2))
      console.log('✅ Posts saved to file')

      // Clear cache to force reload
      this.clearCache()

      // Trigger immediate revalidation for Next.js
      this.triggerRevalidation()

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

      // Test file system access
      try {
        await fs.access(path.dirname(BLOG_POSTS_FILE))
      } catch (error) {
        errors.push('Cannot access blog posts directory')
      }

      // Test file read/write
      try {
        const testResult = await this.loadPosts()
        if (!testResult.success) {
          errors.push('Cannot read blog posts file')
        }
      } catch (error) {
        errors.push('File system read test failed')
      }

      const isConnected = errors.length === 0
      
      return {
        success: true,
        message: isConnected ? 'File storage connection is healthy' : 'File storage has issues',
        data: {
          isConnected,
          errors,
          warnings,
          lastCheck: new Date().toISOString(),
          storageType: 'file-only',
          filePath: BLOG_POSTS_FILE
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
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  private triggerRevalidation(): void {
    try {
      // Revalidate blog-related pages
      revalidateTag('blog-posts')
      revalidatePath('/blog')
      revalidatePath('/blog/[slug]', 'page')
      console.log('🔄 Blog pages revalidated')
    } catch (error) {
      console.warn('Failed to revalidate pages:', error)
    }
  }
}

export const fileOnlyBlogStorage = FileOnlyBlogStorage.getInstance()