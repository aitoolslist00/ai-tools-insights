import { NextResponse } from 'next/server'
import { loadBlogPostsFromFile } from '@/lib/blog-file-manager'

export async function GET() {
  try {
    const posts = await loadBlogPostsFromFile()
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error loading blog posts:', error)
    return NextResponse.json({ error: 'Failed to load blog posts' }, { status: 500 })
  }
}