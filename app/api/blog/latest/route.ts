import { NextRequest, NextResponse } from 'next/server'
import { loadBlogPostsFromFile } from '@/lib/blog-file-manager'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '6')
    
    const allPosts = await loadBlogPostsFromFile()
    
    // Filter published posts and sort by date
    const publishedPosts = allPosts
      .filter(post => post.published)
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.updatedAt || a.date || 0)
        const dateB = new Date(b.publishedAt || b.updatedAt || b.date || 0)
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, limit)

    return NextResponse.json({
      posts: publishedPosts,
      total: publishedPosts.length
    })
  } catch (error) {
    console.error('Error fetching latest blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch latest blog posts' },
      { status: 500 }
    )
  }
}

// HEAD request support
export async function HEAD() {
  return new Response(null, { 
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=1800'
    }
  })
}