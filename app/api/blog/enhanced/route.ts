import { NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { blogFileManager } from '@/lib/blog-file-manager-enhanced'
import { BlogPost } from '@/lib/blog-data'
import { validateApiAuth } from '@/lib/auth-enhanced'
import { rateLimiter, createRateLimitResponse } from '@/lib/rate-limiter'
import { ApiResponseBuilder, handleApiError } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    // Apply read rate limiting
    const rateLimit = rateLimiter.checkReadRateLimit(request)
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit.resetTime)
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50) // Max 50 per page
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured') === 'true'
    const published = searchParams.get('published') !== 'false' // Default to published only

    let result

    if (search) {
      result = await blogFileManager.searchPosts(search, page, limit)
    } else if (featured) {
      const featuredPosts = await blogFileManager.getFeaturedPosts()
      result = {
        posts: featuredPosts.slice((page - 1) * limit, page * limit),
        total: featuredPosts.length,
        hasMore: page * limit < featuredPosts.length
      }
    } else {
      // For dashboard, load all posts (published and drafts)
      if (published === false) {
        const allPosts = await blogFileManager.loadBlogPostsFromFile()
        result = {
          posts: allPosts.slice((page - 1) * limit, page * limit),
          total: allPosts.length,
          hasMore: page * limit < allPosts.length
        }
      } else {
        result = await blogFileManager.getPublishedPosts(page, limit)
      }
    }

    // Filter by category if specified
    if (category && category !== 'all') {
      result.posts = result.posts.filter(post => post.category === category)
      result.total = result.posts.length
      result.hasMore = false // Recalculate if needed
    }

    return ApiResponseBuilder.paginated(
      result.posts,
      page,
      limit,
      result.total,
      'Blog posts retrieved successfully'
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Apply write rate limiting
    const rateLimit = rateLimiter.checkWriteRateLimit(request)
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit.resetTime)
    }

    // Check authentication
    const isAuthenticated = await validateApiAuth(request)
    console.log('🔐 API Authentication check:', isAuthenticated)
    
    if (!isAuthenticated) {
      const authHeader = request.headers.get('authorization')
      console.log('❌ Authentication failed. Auth header:', authHeader ? 'Present' : 'Missing')
      return ApiResponseBuilder.unauthorized()
    }

    const post: BlogPost = await request.json()
    console.log('📝 Received post data:', {
      id: post.id,
      title: post.title,
      published: post.published,
      status: post.status
    })
    
    const result = await blogFileManager.addBlogPost(post)
    console.log('💾 Blog file manager result:', result)
    
    // Revalidate cache
    revalidateTag('blog-posts')
    revalidatePath('/blog')
    revalidatePath('/blog/[slug]', 'page')
    revalidatePath(`/blog/${post.id}`)
    
    // In development, also try to revalidate all existing posts
    if (process.env.NODE_ENV === 'development') {
      try {
        const allPosts = await blogFileManager.loadBlogPostsFromFile()
        allPosts.forEach(existingPost => {
          if (existingPost.published) {
            revalidatePath(`/blog/${existingPost.id}`)
          }
        })
      } catch (error) {
        console.warn('Could not revalidate all posts in development:', error)
      }
    }
    
    return ApiResponseBuilder.success(
      { postId: post.id },
      'Blog post saved successfully'
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Apply write rate limiting
    const rateLimit = rateLimiter.checkWriteRateLimit(request)
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit.resetTime)
    }

    // Check authentication
    if (!await validateApiAuth(request)) {
      return ApiResponseBuilder.unauthorized()
    }

    const posts: BlogPost[] = await request.json()
    
    // Validate array length to prevent abuse
    if (posts.length > 100) {
      return ApiResponseBuilder.error('Too many posts in bulk operation', 400)
    }

    await blogFileManager.saveBlogPostsToFile(posts)
    
    // Revalidate cache
    revalidateTag('blog-posts')
    revalidatePath('/blog')
    revalidatePath('/blog/[slug]', 'page')
    
    // Revalidate individual post pages
    posts.forEach(post => {
      if (post.published) {
        revalidatePath(`/blog/${post.id}`)
      }
    })
    
    return ApiResponseBuilder.success(
      { postsUpdated: posts.length },
      'Blog posts updated successfully'
    )
  } catch (error) {
    return handleApiError(error)
  }
}