import fs from 'fs'
import path from 'path'
import { BlogPost } from './blog-data'

const BLOG_POSTS_FILE = path.join(process.cwd(), 'blog-posts.json')

export async function loadBlogPostsFromFile(): Promise<BlogPost[]> {
  try {
    if (fs.existsSync(BLOG_POSTS_FILE)) {
      const fileContent = fs.readFileSync(BLOG_POSTS_FILE, 'utf-8')
      return JSON.parse(fileContent)
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
    
    // Ensure href is correctly set based on post ID
    const postWithHref = {
      ...post,
      href: `/blog/${post.id}`
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