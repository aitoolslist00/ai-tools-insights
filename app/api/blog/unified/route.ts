import { NextRequest, NextResponse } from 'next/server'
import { unifiedBlogSystem } from '@/lib/blog-system-unified'
import { BlogPost } from '@/lib/blog-data'
import { validateApiAuth } from '@/lib/auth-enhanced'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const query = searchParams.get('query')
    const postId = searchParams.get('id')

    let result

    switch (action) {
      case 'published':
        result = await unifiedBlogSystem.getPublishedPosts()
        break
      case 'featured':
        result = await unifiedBlogSystem.getFeaturedPosts()
        break
      case 'search':
        if (!query) {
          return NextResponse.json({ 
            success: false, 
            error: 'Query parameter required for search' 
          }, { status: 400 })
        }
        result = await unifiedBlogSystem.searchPosts(query)
        break
      case 'stats':
        result = await unifiedBlogSystem.getStats()
        break
      case 'validate':
        result = await unifiedBlogSystem.validateConnection()
        break
      default:
        result = await unifiedBlogSystem.loadBlogPosts()
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: result.message,
        timestamp: result.timestamp
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        message: result.message,
        timestamp: result.timestamp
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Unified blog API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await validateApiAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access'
      }, { status: 401 })
    }

    const post: BlogPost = await request.json()
    
    // Validate required fields
    if (!post.title || !post.content) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: title and content are required'
      }, { status: 400 })
    }

    const result = await unifiedBlogSystem.saveBlogPost(post)

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: result.message,
        timestamp: result.timestamp
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        message: result.message,
        timestamp: result.timestamp
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error saving blog post:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await validateApiAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access'
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('id')

    if (!postId) {
      return NextResponse.json({
        success: false,
        error: 'Post ID is required'
      }, { status: 400 })
    }

    const result = await unifiedBlogSystem.deleteBlogPost(postId)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        timestamp: result.timestamp
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        message: result.message,
        timestamp: result.timestamp
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}