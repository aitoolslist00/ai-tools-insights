import { BlogPost } from './blog-data'
import { fileOnlyBlogStorage } from './blog-storage-file-only'
import { revalidatePath, revalidateTag } from 'next/cache'

// Storage adapter interface
export interface BlogStorageAdapter {
  loadPosts(): Promise<BlogPost[]>
  savePosts(posts: BlogPost[]): Promise<boolean>
  addPost(post: BlogPost): Promise<boolean>
  updatePost(post: BlogPost): Promise<boolean>
  deletePost(postId: string): Promise<boolean>
}

// File-based storage adapter (unified for all environments)
class FileStorageAdapter implements BlogStorageAdapter {
  private triggerRevalidation(): void {
    try {
      revalidateTag('blog-posts')
      revalidatePath('/blog')
      revalidatePath('/blog/[slug]', 'page')
      console.log('🔄 Blog pages revalidated after storage change')
    } catch (error) {
      console.warn('Failed to revalidate pages:', error)
    }
  }

  async loadPosts(): Promise<BlogPost[]> {
    const result = await fileOnlyBlogStorage.loadPosts()
    return result.success ? result.data || [] : []
  }

  async savePosts(posts: BlogPost[]): Promise<boolean> {
    const result = await fileOnlyBlogStorage.savePosts(posts)
    if (result.success) {
      this.triggerRevalidation()
    }
    return result.success
  }

  async addPost(post: BlogPost): Promise<boolean> {
    const result = await fileOnlyBlogStorage.savePost(post)
    if (result.success) {
      this.triggerRevalidation()
    }
    return result.success
  }

  async updatePost(post: BlogPost): Promise<boolean> {
    const result = await fileOnlyBlogStorage.savePost(post)
    if (result.success) {
      this.triggerRevalidation()
    }
    return result.success
  }

  async deletePost(postId: string): Promise<boolean> {
    const result = await fileOnlyBlogStorage.deletePost(postId)
    if (result.success) {
      this.triggerRevalidation()
    }
    return result.success
  }
}

// Vercel KV storage (for production)
class VercelKVStorageAdapter implements BlogStorageAdapter {
  private kv: any = null
  private kvAvailable: boolean | null = null

  private async checkKVAvailability(): Promise<boolean> {
    if (this.kvAvailable !== null) {
      return this.kvAvailable
    }

    try {
      // Check if @vercel/kv is available
      await import('@vercel/kv')
      this.kvAvailable = true
      return true
    } catch (error) {
      console.warn('⚠️ @vercel/kv package not available:', error instanceof Error ? error.message : String(error))
      this.kvAvailable = false
      return false
    }
  }

  private async getKV() {
    if (!this.kv) {
      const isAvailable = await this.checkKVAvailability()
      if (!isAvailable) {
        throw new Error('Vercel KV package not installed. Run: npm install @vercel/kv')
      }

      try {
        const { kv } = await import('@vercel/kv')
        this.kv = kv
      } catch (error) {
        console.error('Vercel KV not available:', error)
        throw new Error('Vercel KV not configured. Please set up Vercel KV in your dashboard.')
      }
    }
    return this.kv
  }

  async loadPosts(): Promise<BlogPost[]> {
    try {
      const kv = await this.getKV()
      let posts = await kv.get('blog-posts')

      // If no posts in KV, migrate from file storage
      if (!posts || posts.length === 0) {
        console.log('🔄 Migrating blog posts from file to KV...')
        try {
          const filePosts = await import('./blog-storage-file-only').then(m => m.fileOnlyBlogStorage.loadPosts())
          if (filePosts.success && filePosts.data) {
            posts = filePosts.data
            await kv.set('blog-posts', posts)
            console.log(`✅ Migrated ${posts.length} posts to KV`)
          } else {
            posts = []
          }
        } catch (error) {
          console.warn('Failed to migrate from file:', error)
          posts = []
        }
      }

      return posts || []
    } catch (error) {
      console.error('Error loading posts from KV:', error)
      return []
    }
  }

  async savePosts(posts: BlogPost[]): Promise<boolean> {
    try {
      const kv = await this.getKV()
      await kv.set('blog-posts', posts)
      return true
    } catch (error) {
      console.error('Error saving posts to KV:', error)
      return false
    }
  }

  async addPost(post: BlogPost): Promise<boolean> {
    const posts = await this.loadPosts()
    const existingIndex = posts.findIndex(p => p.id === post.id)
    
    const now = new Date().toISOString()
    const postWithHref = {
      ...post,
      href: `/blog/${post.id}`,
      updatedAt: now
    }

    if (existingIndex >= 0) {
      posts[existingIndex] = {
        ...postWithHref,
        publishedAt: posts[existingIndex].publishedAt || (post.published ? now : undefined)
      }
    } else {
      posts.unshift({
        ...postWithHref,
        publishedAt: post.published ? now : undefined
      })
    }

    return await this.savePosts(posts)
  }

  async updatePost(post: BlogPost): Promise<boolean> {
    const posts = await this.loadPosts()
    const index = posts.findIndex(p => p.id === post.id)
    if (index >= 0) {
      posts[index] = { 
        ...post, 
        updatedAt: new Date().toISOString(),
        href: `/blog/${post.id}`
      }
      return await this.savePosts(posts)
    }
    return false
  }

  async deletePost(postId: string): Promise<boolean> {
    const posts = await this.loadPosts()
    const filteredPosts = posts.filter(p => p.id !== postId)
    if (filteredPosts.length !== posts.length) {
      return await this.savePosts(filteredPosts)
    }
    return false
  }
}

// Memory storage (fallback)
class MemoryStorageAdapter implements BlogStorageAdapter {
  private posts: BlogPost[] = []

  async loadPosts(): Promise<BlogPost[]> {
    return [...this.posts]
  }

  async savePosts(posts: BlogPost[]): Promise<boolean> {
    this.posts = [...posts]
    return true
  }

  async addPost(post: BlogPost): Promise<boolean> {
    const existingIndex = this.posts.findIndex(p => p.id === post.id)
    const now = new Date().toISOString()
    
    const postWithHref = {
      ...post,
      href: `/blog/${post.id}`,
      updatedAt: now
    }

    if (existingIndex >= 0) {
      this.posts[existingIndex] = {
        ...postWithHref,
        publishedAt: this.posts[existingIndex].publishedAt || (post.published ? now : undefined)
      }
    } else {
      this.posts.unshift({
        ...postWithHref,
        publishedAt: post.published ? now : undefined
      })
    }

    return true
  }

  async updatePost(post: BlogPost): Promise<boolean> {
    const index = this.posts.findIndex(p => p.id === post.id)
    if (index >= 0) {
      this.posts[index] = { 
        ...post, 
        updatedAt: new Date().toISOString(),
        href: `/blog/${post.id}`
      }
      return true
    }
    return false
  }

  async deletePost(postId: string): Promise<boolean> {
    const initialLength = this.posts.length
    this.posts = this.posts.filter(p => p.id !== postId)
    return this.posts.length !== initialLength
  }
}

// Factory function to get the appropriate storage adapter
export function getBlogStorageAdapter(): BlogStorageAdapter {
  const storageType = process.env.BLOG_STORAGE_TYPE || 'file'
  
  console.log('🗄️ Blog storage type:', storageType)
  
  switch (storageType) {
    case 'vercel-kv':
      return new VercelKVStorageAdapter()
    case 'file':
      return new FileStorageAdapter()
    case 'memory':
      return new MemoryStorageAdapter()
    default:
      // Default to file storage in development, memory in production if KV not available
      if (process.env.NODE_ENV === 'development') {
        return new FileStorageAdapter()
      } else {
        console.warn('⚠️ No persistent storage configured for production. Using memory storage (data will be lost on restart).')
        return new MemoryStorageAdapter()
      }
  }
}