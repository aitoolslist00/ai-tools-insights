import fs from 'fs'
import path from 'path'
import { BlogPost } from './blog-data'

const BLOG_POSTS_FILE = path.join(process.cwd(), 'blog-posts.json')

export async function loadBlogPostsFromFile(): Promise<BlogPost[]> {
  try {
    if (fs.existsSync(BLOG_POSTS_FILE)) {
      const fileContent = fs.readFileSync(BLOG_POSTS_FILE, 'utf-8')
      const rawPosts = JSON.parse(fileContent)
      
      // Transform data to match BlogPost interface
      return rawPosts.map((post: any) => ({
        ...post,
        // Ensure required fields are present with correct types
        tags: post.tags || post.keywords || [],
        readTime: post.readTime || (post.readingTime ? `${post.readingTime} min read` : '5 min read'),
        date: post.date || post.publishedAt || post.publishDate,
        href: post.href || `/blog/${post.slug || post.id}`,
        // Ensure boolean fields are properly typed
        published: Boolean(post.published),
        featured: Boolean(post.featured),
      }))
    }
    return []
  } catch (error) {
    console.error('Error loading blog posts from file:', error)
    return []
  }
}

export async function saveBlogPostsToFile(posts: BlogPost[]): Promise<boolean> {
  try {
    const jsonContent = JSON.stringify(posts, null, 2)
    fs.writeFileSync(BLOG_POSTS_FILE, jsonContent, 'utf-8')
    return true
  } catch (error) {
    console.error('Error saving blog posts to file:', error)
    return false
  }
}

export async function addBlogPost(post: BlogPost): Promise<boolean> {
  try {
    const posts = await loadBlogPostsFromFile()
    const existingIndex = posts.findIndex(p => p.id === post.id)
    
    const now = new Date().toISOString()
    
    // Ensure href is correctly set based on post slug or ID
    const postWithHref = {
      ...post,
      href: `/blog/${post.slug || post.id}`
    }
    
    if (existingIndex >= 0) {
      // Update existing post - preserve original publishedAt, update updatedAt
      const existingPost = posts[existingIndex]
      posts[existingIndex] = {
        ...postWithHref,
        updatedAt: now,
        publishedAt: existingPost.publishedAt || (post.published ? now : undefined)
      }
    } else {
      // Add new post - set both timestamps
      posts.push({
        ...postWithHref,
        updatedAt: now,
        publishedAt: post.published ? now : undefined
      })
    }
    
    return await saveBlogPostsToFile(posts)
  } catch (error) {
    console.error('Error adding blog post:', error)
    return false
  }
}

export async function deleteBlogPost(postId: string): Promise<boolean> {
  try {
    const posts = await loadBlogPostsFromFile()
    const filteredPosts = posts.filter(p => p.id !== postId)
    return await saveBlogPostsToFile(filteredPosts)
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return false
  }
}

export async function getBlogPostById(postId: string): Promise<BlogPost | null> {
  try {
    const posts = await loadBlogPostsFromFile()
    return posts.find(p => p.id === postId) || null
  } catch (error) {
    console.error('Error getting blog post by ID:', error)
    return null
  }
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const posts = await loadBlogPostsFromFile()
    return posts.filter(p => p.published)
  } catch (error) {
    console.error('Error getting published posts:', error)
    return []
  }
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  try {
    const posts = await loadBlogPostsFromFile()
    return posts.filter(p => p.published && p.featured)
  } catch (error) {
    console.error('Error getting featured posts:', error)
    return []
  }
}