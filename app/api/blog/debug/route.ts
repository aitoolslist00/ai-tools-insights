import { NextRequest, NextResponse } from 'next/server'
import { validateApiAuth } from '@/lib/auth-enhanced'
import { loadBlogPostsFromFile } from '@/lib/blog-file-manager'
import { existsSync, statSync } from 'fs'
import { resolve } from 'path'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await validateApiAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        cwd: process.cwd()
      },
      files: {
        blogPostsFile: {
          path: resolve(process.cwd(), 'blog-posts.json'),
          exists: existsSync(resolve(process.cwd(), 'blog-posts.json')),
          size: existsSync(resolve(process.cwd(), 'blog-posts.json')) 
            ? statSync(resolve(process.cwd(), 'blog-posts.json')).size 
            : 0,
          lastModified: existsSync(resolve(process.cwd(), 'blog-posts.json'))
            ? statSync(resolve(process.cwd(), 'blog-posts.json')).mtime.toISOString()
            : null
        },
        uploadsDir: {
          path: resolve(process.cwd(), 'public', 'uploads'),
          exists: existsSync(resolve(process.cwd(), 'public', 'uploads')),
          writable: true // We'll test this
        }
      },
      posts: {
        total: 0,
        published: 0,
        drafts: 0,
        withImages: 0
      },
      apis: {
        manage: '/api/blog/manage',
        unified: '/api/blog/unified',
        upload: '/api/upload',
        revalidate: '/api/revalidate'
      }
    }

    // Test file write permissions for uploads directory
    try {
      const uploadsDir = resolve(process.cwd(), 'public', 'uploads')
      const { writeFileSync, unlinkSync, mkdirSync } = await import('fs')
      
      // Ensure uploads directory exists
      if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir, { recursive: true })
      }
      
      // Test write permissions in uploads directory
      const testFile = resolve(uploadsDir, 'test-write.txt')
      writeFileSync(testFile, 'test')
      unlinkSync(testFile)
      debugInfo.files.uploadsDir.writable = true
    } catch (error) {
      console.error('Write permission test failed:', error)
      debugInfo.files.uploadsDir.writable = false
    }

    // Load and analyze posts
    try {
      const posts = await loadBlogPostsFromFile()
      debugInfo.posts.total = posts.length
      debugInfo.posts.published = posts.filter(p => p.published).length
      debugInfo.posts.drafts = posts.filter(p => !p.published).length
      debugInfo.posts.withImages = posts.filter(p => p.image).length
    } catch (error) {
      console.error('Error loading posts for debug:', error)
    }

    return NextResponse.json({
      success: true,
      debug: debugInfo
    })

  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}