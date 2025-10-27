import { NextRequest, NextResponse } from 'next/server'
import { generateEnhancedBlogArticle, BlogGenerationOptions, EnhancedBlogPost } from '@/lib/enhanced-blog-generator'
import { addBlogPost } from '@/lib/blog-file-manager-enhanced'
import { BlogPost } from '@/lib/blog-data'

// Convert EnhancedBlogPost to BlogPost format
function convertToLegacyBlogPost(enhancedPost: EnhancedBlogPost): BlogPost {
  return {
    id: enhancedPost.id,
    title: enhancedPost.title,
    excerpt: enhancedPost.excerpt,
    content: enhancedPost.content,
    author: enhancedPost.author,
    date: enhancedPost.publishDate,
    readTime: `${enhancedPost.readingTime} min`,
    category: enhancedPost.category,
    featured: enhancedPost.featured,
    published: enhancedPost.published,
    image: enhancedPost.image,
    images: enhancedPost.images,
    href: `/blog/${enhancedPost.slug}`,
    tags: enhancedPost.keywords,
    slug: enhancedPost.slug,
    seo: {
      metaTitle: enhancedPost.title,
      metaDescription: enhancedPost.metaDescription,
      keywords: enhancedPost.keywords.join(', '),
      focusKeyword: enhancedPost.keywords[0],
      schema: enhancedPost.schemas
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      keyword,
      targetWordCount = 4000,
      includeComparison = true,
      includeNewsData = true,
      focusKeyword,
      secondaryKeywords = [],
      targetAudience = 'professionals and businesses',
      contentType = 'guide',
      includeImages = true
    } = body

    // Validate required fields
    if (!keyword || !focusKeyword) {
      return NextResponse.json(
        { error: 'Keyword and focus keyword are required' },
        { status: 400 }
      )
    }

    console.log(`🚀 Starting enhanced blog generation for: "${keyword}"`)

    const options: BlogGenerationOptions = {
      keyword,
      targetWordCount,
      includeComparison,
      includeNewsData,
      focusKeyword,
      secondaryKeywords,
      targetAudience,
      contentType,
      includeImages
    }

    // Generate the enhanced blog article
    const enhancedPost = await generateEnhancedBlogArticle(options)

    // Convert and save the blog post
    const legacyPost = convertToLegacyBlogPost(enhancedPost)
    await addBlogPost(legacyPost)

    console.log(`✅ Enhanced blog article generated successfully: "${enhancedPost.title}"`)

    return NextResponse.json({
      success: true,
      post: enhancedPost,
      message: 'Enhanced blog article generated successfully'
    })

  } catch (error) {
    console.error('❌ Error generating enhanced blog article:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate enhanced blog article',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Enhanced Blog Generator API',
    endpoints: {
      'POST /api/blog/generate-enhanced': 'Generate enhanced blog article',
    },
    requiredFields: [
      'keyword',
      'focusKeyword'
    ],
    optionalFields: [
      'targetWordCount',
      'includeComparison',
      'includeNewsData',
      'secondaryKeywords',
      'targetAudience',
      'contentType',
      'includeImages'
    ],
    example: {
      keyword: 'AI Tools 2025',
      focusKeyword: 'best AI tools 2025',
      secondaryKeywords: ['artificial intelligence', 'machine learning', 'AI software'],
      targetAudience: 'business professionals',
      contentType: 'guide',
      targetWordCount: 4000,
      includeComparison: true,
      includeNewsData: true,
      includeImages: true
    }
  })
}