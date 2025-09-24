import { NextResponse } from 'next/server'
import { getBlogStorageAdapter } from '@/lib/blog-storage-adapter'

// Force dynamic for production compatibility
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const storage = getBlogStorageAdapter()
    const posts = await storage.loadPosts()
    const publishedPosts = posts.filter(post => post.published)
    
    return NextResponse.json(publishedPosts, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json([], { status: 500 })
  }
}