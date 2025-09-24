import { NextRequest, NextResponse } from 'next/server'
import { BlogPost } from '@/lib/blog-data'
import { getBlogStorageAdapter } from '@/lib/blog-storage-adapter'
import { validateApiAuth } from '@/lib/auth-enhanced'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await validateApiAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const storage = getBlogStorageAdapter()
    const posts = await storage.loadPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await validateApiAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const newPost: BlogPost = await request.json()
    
    // Validate required fields
    if (!newPost.title || !newPost.content || !newPost.seo?.focusKeyword) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, content, and focus keyword' 
      }, { status: 400 })
    }

    // Use storage adapter
    const storage = getBlogStorageAdapter()
    
    // Add or update post using storage adapter
    const success = await storage.addPost(newPost)
    
    if (!success) {
      throw new Error('Failed to save post to storage')
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Post saved successfully',
      post: newPost
    })
    
  } catch (error) {
    console.error('Error saving blog post:', error)
    return NextResponse.json({ 
      error: 'Failed to save post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await validateApiAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updatedPost: BlogPost = await request.json()
    
    if (!updatedPost.id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    const storage = getBlogStorageAdapter()
    const success = await storage.updatePost(updatedPost)
    
    if (!success) {
      return NextResponse.json({ error: 'Post not found or failed to update' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Post updated successfully',
      post: updatedPost
    })
    
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json({ 
      error: 'Failed to update post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await validateApiAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('id')
    
    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    const storage = getBlogStorageAdapter()
    const success = await storage.deletePost(postId)
    
    if (!success) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Post deleted successfully',
      postId
    })
    
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({ 
      error: 'Failed to delete post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}