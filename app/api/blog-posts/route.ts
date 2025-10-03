import { NextRequest, NextResponse } from 'next/server';
import { loadBlogPostsFromFile, saveBlogPostsToFile } from '@/lib/blog-file-manager';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    
    const posts = await loadBlogPostsFromFile();
    
    if (postId) {
      const post = posts.find(p => p.id === postId);
      if (!post) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, post });
    }
    
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const newPost = await request.json();
    
    if (!newPost.id || !newPost.title) {
      return NextResponse.json(
        { error: 'Post ID and title are required' },
        { status: 400 }
      );
    }
    
    const posts = await loadBlogPostsFromFile();
    
    // Check if post already exists
    const existingPostIndex = posts.findIndex(p => p.id === newPost.id);
    
    if (existingPostIndex !== -1) {
      // Update existing post
      posts[existingPostIndex] = {
        ...posts[existingPostIndex],
        ...newPost,
        lastModified: new Date().toISOString()
      };
    } else {
      // Add new post
      posts.push({
        ...newPost,
        publishedAt: newPost.publishedAt || new Date().toISOString(),
        lastModified: new Date().toISOString()
      });
    }
    
    await saveBlogPostsToFile(posts);
    
    return NextResponse.json({
      success: true,
      message: existingPostIndex !== -1 ? 'Post updated successfully' : 'Post created successfully',
      post: posts[existingPostIndex] || newPost
    });
    
  } catch (error) {
    console.error('Error saving blog post:', error);
    return NextResponse.json(
      { error: 'Failed to save blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedPost = await request.json();
    
    if (!updatedPost.id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    const posts = await loadBlogPostsFromFile();
    const postIndex = posts.findIndex(p => p.id === updatedPost.id);
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    posts[postIndex] = {
      ...posts[postIndex],
      ...updatedPost,
      lastModified: new Date().toISOString()
    };
    
    await saveBlogPostsToFile(posts);
    
    return NextResponse.json({
      success: true,
      message: 'Post updated successfully',
      post: posts[postIndex]
    });
    
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    const posts = await loadBlogPostsFromFile();
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    const deletedPost = posts.splice(postIndex, 1)[0];
    await saveBlogPostsToFile(posts);
    
    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
      post: deletedPost
    });
    
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}