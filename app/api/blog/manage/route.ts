import { NextRequest, NextResponse } from 'next/server'
import { BlogPost } from '@/lib/blog-data'
import { loadBlogPostsFromFile, saveBlogPostsToFile } from '@/lib/blog-file-manager'
import { validateApiAuth } from '@/lib/auth-enhanced'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await validateApiAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posts = await loadBlogPostsFromFile()
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

    // Load existing posts
    const existingPosts = await loadBlogPostsFromFile()
    
    // Check if post with same ID exists
    const existingPostIndex = existingPosts.findIndex(post => post.id === newPost.id)
    
    if (existingPostIndex >= 0) {
      // Update existing post
      existingPosts[existingPostIndex] = {
        ...newPost,
        updatedAt: new Date().toISOString()
      }
    } else {
      // Add new post
      const postWithTimestamp = {
        ...newPost,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      existingPosts.unshift(postWithTimestamp)
    }

    // Save updated posts
    await saveBlogPostsToFile(existingPosts)
    
    return NextResponse.json({ 
      success: true, 
      message: existingPostIndex >= 0 ? 'Post updated successfully' : 'Post created successfully',
      post: existingPosts[existingPostIndex >= 0 ? existingPostIndex : 0]
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

    const existingPosts = await loadBlogPostsFromFile()
    const postIndex = existingPosts.findIndex(post => post.id === updatedPost.id)
    
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Update the post
    existingPosts[postIndex] = {
      ...updatedPost,
      updatedAt: new Date().toISOString()
    }

    await saveBlogPostsToFile(existingPosts)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Post updated successfully',
      post: existingPosts[postIndex]
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

    const existingPosts = await loadBlogPostsFromFile()
    const postIndex = existingPosts.findIndex(post => post.id === postId)
    
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Remove the post
    const deletedPost = existingPosts.splice(postIndex, 1)[0]
    await saveBlogPostsToFile(existingPosts)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Post deleted successfully',
      deletedPost
    })
    
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({ 
      error: 'Failed to delete post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}