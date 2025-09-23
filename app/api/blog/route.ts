import { NextResponse } from 'next/server'
import { loadBlogPostsFromFile } from '@/lib/blog-file-manager'

// Force static generation for API route
export const dynamic = 'force-static'
export const revalidate = false

export async function GET() {
  try {
    const posts = await loadBlogPostsFromFile()
    const publishedPosts = posts.filter(post => post.published)
    
    return NextResponse.json(publishedPosts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json([], { status: 500 })
  }
}