import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { validateApiAuth } from '@/lib/auth-middleware'

// Development-only endpoint for aggressive cache clearing
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'This endpoint is only available in development' }, { status: 403 })
  }

  // Check authentication
  if (!validateApiAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Clear all blog-related caches aggressively
    revalidateTag('blog-posts')
    
    // Revalidate all blog paths
    revalidatePath('/blog', 'layout')
    revalidatePath('/blog', 'page')
    revalidatePath('/blog/[slug]', 'page')
    
    // Load and revalidate individual posts
    const { loadBlogPostsFromFile } = await import('@/lib/blog-file-manager')
    const allPosts = await loadBlogPostsFromFile()
    
    let revalidatedPosts = 0
    allPosts.forEach(post => {
      revalidatePath(`/blog/${post.id}`)
      revalidatedPosts++
    })
    
    return NextResponse.json({ 
      message: 'Development cache cleared successfully',
      revalidated: true,
      now: Date.now(),
      method: 'development-aggressive-clear',
      postsRevalidated: revalidatedPosts,
      totalPosts: allPosts.length
    })
  } catch (error) {
    console.error('Development cache clear error:', error)
    return NextResponse.json({ 
      error: 'Failed to clear development cache',
      revalidated: false
    }, { status: 500 })
  }
}