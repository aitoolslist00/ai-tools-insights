import { NextRequest, NextResponse } from 'next/server'
import { validateApiAuth } from '@/lib/auth-enhanced'
import fs from 'fs/promises'
import path from 'path'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  metaDescription: string
  keywords: string[]
  readingTime: number
  wordCount: number
  published: boolean
  featured: boolean
  publishDate: string
  lastModified: string
  category: string
  author: string
  seoScore?: number
  schemas?: any
  internalLinks?: string[]
  externalLinks?: string[]
  imagePrompts?: string[]
  headings?: string[]
  images?: any[]
  image?: string
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await validateApiAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postIds, generateForAll = false } = await request.json()

    // Load existing blog posts
    const blogPosts = await loadBlogPosts()
    
    // Filter posts that need images
    let postsToProcess: BlogPost[]
    
    if (generateForAll) {
      postsToProcess = blogPosts.filter(post => !post.images || post.images.length === 0)
    } else if (postIds && Array.isArray(postIds)) {
      postsToProcess = blogPosts.filter(post => 
        postIds.includes(post.id) && (!post.images || post.images.length === 0)
      )
    } else {
      return NextResponse.json({ error: 'Either postIds array or generateForAll=true is required' }, { status: 400 })
    }

    if (postsToProcess.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No posts found that need image generation',
        processed: 0
      })
    }

    console.log(`Processing ${postsToProcess.length} posts for image generation`)

    let successCount = 0
    let failureCount = 0
    const results: any[] = []

    // Process each post
    for (const post of postsToProcess) {
      try {
        console.log(`Generating images for: ${post.title}`)

        // Generate image prompts if not available
        let imagePrompts = post.imagePrompts || []
        if (imagePrompts.length === 0) {
          imagePrompts = generateImagePromptsFromContent(post)
        }

        if (imagePrompts.length === 0) {
          console.warn(`No image prompts available for post: ${post.title}`)
          failureCount++
          results.push({
            postId: post.id,
            title: post.title,
            success: false,
            error: 'No image prompts available'
          })
          continue
        }

        // Call image generation API
        const imageResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/generate-images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': request.headers.get('Authorization') || ''
          },
          body: JSON.stringify({
            prompts: imagePrompts.slice(0, 3), // Limit to 3 images per post
            articleTitle: post.title,
            keywords: post.keywords,
            style: 'tech'
          })
        })

        if (imageResponse.ok) {
          const imageData = await imageResponse.json()
          const generatedImages = imageData.images || []

          if (generatedImages.length > 0) {
            // Update the post with generated images
            post.images = generatedImages
            post.image = generatedImages[0]?.url
            post.imagePrompts = imagePrompts
            post.lastModified = new Date().toISOString()

            successCount++
            results.push({
              postId: post.id,
              title: post.title,
              success: true,
              imagesGenerated: generatedImages.length,
              images: generatedImages
            })

            console.log(`Successfully generated ${generatedImages.length} images for: ${post.title}`)
          } else {
            failureCount++
            results.push({
              postId: post.id,
              title: post.title,
              success: false,
              error: 'No images returned from generation API'
            })
          }
        } else {
          const errorText = await imageResponse.text()
          console.error(`Image generation failed for ${post.title}:`, errorText)
          failureCount++
          results.push({
            postId: post.id,
            title: post.title,
            success: false,
            error: `API error: ${errorText}`
          })
        }

        // Add delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))

      } catch (error) {
        console.error(`Error processing post ${post.title}:`, error)
        failureCount++
        results.push({
          postId: post.id,
          title: post.title,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    // Save updated blog posts
    if (successCount > 0) {
      await createBackup()
      await saveBlogPosts(blogPosts)
      console.log(`Updated ${successCount} posts with generated images`)
    }

    return NextResponse.json({
      success: true,
      processed: postsToProcess.length,
      successful: successCount,
      failed: failureCount,
      results,
      message: `Generated images for ${successCount} out of ${postsToProcess.length} posts`
    })

  } catch (error) {
    console.error('Bulk image generation error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate images'
    }, { status: 500 })
  }
}

function generateImagePromptsFromContent(post: BlogPost): string[] {
  const prompts: string[] = []
  
  // Generate hero image prompt
  const heroPrompt = `Professional tech illustration for "${post.title}" featuring ${post.keywords.slice(0, 3).join(', ')}, modern digital design, clean and minimalist style`
  prompts.push(heroPrompt)
  
  // Generate feature image prompts based on keywords
  if (post.keywords.length > 0) {
    const featurePrompt = `Conceptual illustration showing ${post.keywords[0]} technology, abstract tech elements, blue and purple gradient background`
    prompts.push(featurePrompt)
  }
  
  // Generate content-based prompt from excerpt
  if (post.excerpt) {
    const contentPrompt = `Visual representation of ${post.excerpt.slice(0, 100)}, modern tech aesthetic, professional design`
    prompts.push(contentPrompt)
  }
  
  return prompts
}

async function loadBlogPosts(): Promise<BlogPost[]> {
  try {
    const filePath = path.join(process.cwd(), 'blog-posts.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.warn('No existing blog posts file found')
    return []
  }
}

async function saveBlogPosts(posts: BlogPost[]): Promise<void> {
  const filePath = path.join(process.cwd(), 'blog-posts.json')
  await fs.writeFile(filePath, JSON.stringify(posts, null, 2), 'utf-8')
}

async function createBackup(): Promise<void> {
  try {
    const filePath = path.join(process.cwd(), 'blog-posts.json')
    const backupDir = path.join(process.cwd(), 'backups')
    
    // Ensure backup directory exists
    try {
      await fs.access(backupDir)
    } catch {
      await fs.mkdir(backupDir, { recursive: true })
    }

    // Create backup with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = path.join(backupDir, `blog-posts-${timestamp}.json`)
    
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      await fs.writeFile(backupPath, content, 'utf-8')
    } catch (error) {
      console.log('No existing blog posts to backup')
    }
  } catch (error) {
    console.warn('Failed to create backup:', error)
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Bulk Image Generation API',
    version: '1.0',
    description: 'Generate missing images for existing blog posts',
    usage: {
      'POST /': 'Generate images for posts',
      'body': {
        'postIds': 'Array of post IDs to process (optional)',
        'generateForAll': 'Boolean to process all posts missing images (optional)'
      }
    },
    features: [
      'Bulk image generation for existing posts',
      'Automatic image prompt generation',
      'Rate limiting protection',
      'Backup creation',
      'Detailed processing results'
    ]
  })
}