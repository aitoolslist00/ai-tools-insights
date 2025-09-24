import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { validateApiAuth } from '@/lib/auth-enhanced'

export async function POST(request: NextRequest) {
  // Check authentication for revalidation operations
  const isAuthenticated = await validateApiAuth(request)
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { path, tag } = body

    if (path) {
      // Revalidate specific path
      revalidatePath(path)
      return NextResponse.json({ 
        message: `Path ${path} revalidated successfully`,
        revalidated: true,
        now: Date.now()
      })
    }

    if (tag) {
      // Revalidate by tag
      revalidateTag(tag)
      return NextResponse.json({ 
        message: `Tag ${tag} revalidated successfully`,
        revalidated: true,
        now: Date.now()
      })
    }

    // Default: revalidate all blog-related content using tags
    revalidateTag('blog-posts')
    
    // Also revalidate specific paths
    revalidatePath('/blog')
    revalidatePath('/blog/[slug]', 'page')
    
    // In development, also try to revalidate individual posts
    if (process.env.NODE_ENV === 'development') {
      try {
        const { loadBlogPostsFromFile } = await import('@/lib/blog-file-manager')
        const allPosts = await loadBlogPostsFromFile()
        
        allPosts.forEach(post => {
          if (post.published) {
            revalidatePath(`/blog/${post.id}`)
          }
        })
        
        return NextResponse.json({ 
          message: `Blog pages revalidated successfully (development mode - ${allPosts.length} posts)`,
          revalidated: true,
          now: Date.now(),
          method: 'development-aggressive',
          postsRevalidated: allPosts.length
        })
      } catch (error) {
        console.error('Error in development revalidation:', error)
      }
    }
    
    return NextResponse.json({ 
      message: 'Blog pages revalidated successfully using cache tags',
      revalidated: true,
      now: Date.now(),
      method: 'cache-tags'
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json({ 
      error: 'Failed to revalidate',
      revalidated: false
    }, { status: 500 })
  }
}