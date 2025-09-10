import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getBlogPostById, deleteBlogPost } from '@/lib/blog-file-manager'
import { validateApiAuth } from '@/lib/auth-middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const post = await getBlogPostById(id)
    
    if (post) {
      return NextResponse.json(post)
    } else {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load blog post' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication for delete operations
  if (!(await validateApiAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const success = await deleteBlogPost(id)
    
    if (success) {
      // Revalidate using tags for more efficient cache invalidation
      revalidateTag('blog-posts')
      
      // Also revalidate specific paths
      revalidatePath('/blog')
      revalidatePath('/blog/[slug]', 'page')
      revalidatePath(`/blog/${id}`)
      
      return NextResponse.json({ message: 'Blog post deleted successfully' })
    } else {
      return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}