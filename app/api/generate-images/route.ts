import { NextRequest, NextResponse } from 'next/server';
import ImageGenerator from '@/lib/image-generator';
import { RealImageGenerator } from '@/lib/real-image-generator';
import ContentImageOptimizer from '@/lib/content-image-optimizer';
import { loadBlogPostsFromFile, saveBlogPostsToFile } from '@/lib/blog-file-manager';
import { validateApiAuth } from '@/lib/auth-enhanced';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await validateApiAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      postId, 
      regenerate = false, 
      useRealGeneration = true, 
      optimizeContent = true,
      keywords,
      // New parameters for workflow-based generation
      prompts,
      articleTitle,
      style = 'tech'
    } = await request.json();
    
    // Handle workflow-based generation (when called from EnhancedAISEOEditor)
    if (prompts && articleTitle && !postId) {
      return await handleWorkflowImageGeneration({
        prompts,
        articleTitle,
        keywords: keywords || [],
        style
      });
    }
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required when not using workflow generation' },
        { status: 400 }
      );
    }
    
    // Load blog posts
    const posts = await loadBlogPostsFromFile();
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Check if post already has images and regenerate is false
    if (post.images && Array.isArray(post.images) && post.images.length > 0 && !regenerate) {
      return NextResponse.json({
        success: true,
        message: 'Post already has images',
        images: post.images
      });
    }
    
    let generatedImages;
    let optimizedContent = post.content;
    
    // Extract keywords from post if not provided
    const imageKeywords = keywords || [
      post.title,
      ...(post.tags || []),
      post.category
    ].filter(Boolean);
    
    if (useRealGeneration) {
      // Use real image generation with Gemini AI
      const realImageGenerator = new RealImageGenerator();
      generatedImages = await realImageGenerator.generateArticleImages(
        post.title, 
        imageKeywords, 
        post.content || ''
      );
    } else {
      // Use placeholder image generation
      const imageGenerator = new ImageGenerator();
      generatedImages = await imageGenerator.generateImagesForPost(postId, post);
    }
    
    if (generatedImages.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate images' },
        { status: 500 }
      );
    }
    
    // Optimize content with generated images if requested
    if (optimizeContent && post.content && generatedImages.length > 0) {
      try {
        const contentOptimizer = new ContentImageOptimizer();
        
        // Convert GeneratedImageResult[] to GeneratedImage[] if needed
        const imagesForOptimization = generatedImages.map(img => ({
          filename: img.filename,
          path: img.path,
          url: img.url,
          alt: img.alt,
          width: img.width,
          height: img.height,
          optimized: ('metadata' in img && img.metadata?.optimized) || ('optimized' in img && img.optimized) || false
        }));
        
        optimizedContent = await contentOptimizer.optimizeContentWithImages(
          post.content, 
          imagesForOptimization, 
          post.title
        );
      } catch (optimizeError) {
        console.warn('Content optimization failed, using original content:', optimizeError);
        optimizedContent = post.content;
      }
    }
    
    // Update post with generated images and optimized content
    const updatedPost = {
      ...post,
      images: generatedImages,
      image: generatedImages[0]?.url, // Set first image as featured image
      content: optimizedContent,
      lastModified: new Date().toISOString(),
      imageGenerationMetadata: {
        generatedAt: new Date().toISOString(),
        method: useRealGeneration ? 'real' as const : 'placeholder' as const,
        contentOptimized: optimizeContent,
        keywordsUsed: imageKeywords
      }
    };
    
    // Update posts array
    const updatedPosts = posts.map(p => p.id === postId ? updatedPost : p);
    
    // Save updated posts
    await saveBlogPostsToFile(updatedPosts);
    
    return NextResponse.json({
      success: true,
      message: `Generated ${generatedImages.length} images successfully${optimizeContent ? ' and optimized content' : ''}`,
      images: generatedImages,
      post: updatedPost,
      contentOptimized: optimizeContent && optimizedContent !== post.content
    });
    
  } catch (error) {
    console.error('Error generating images:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate images',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await validateApiAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    // Load blog posts
    const posts = await loadBlogPostsFromFile();
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      images: post.images || [],
      hasImages: !!(post.images && Array.isArray(post.images) && post.images.length > 0)
    });
    
  } catch (error) {
    console.error('Error fetching post images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post images' },
      { status: 500 }
    );
  }
}

/**
 * Handle workflow-based image generation (called from EnhancedAISEOEditor)
 */
async function handleWorkflowImageGeneration({
  prompts,
  articleTitle,
  keywords,
  style
}: {
  prompts: string[];
  articleTitle: string;
  keywords: string[];
  style: string;
}) {
  try {
    const realImageGenerator = new RealImageGenerator();
    const generatedImages = [];

    // Generate images based on the provided prompts
    for (let i = 0; i < Math.min(prompts.length, 3); i++) {
      const prompt = prompts[i];
      const keyword = keywords[i] || articleTitle;
      
      try {
        const image = await realImageGenerator.generateImage({
          keyword: keyword,
          style: style as any,
          aspectRatio: i === 0 ? '16:9' : '4:3', // First image is hero, others are feature
          width: i === 0 ? 1200 : 800,
          height: i === 0 ? 675 : 600
        });
        
        generatedImages.push(image);
      } catch (imageError) {
        console.warn(`Failed to generate image for prompt "${prompt}":`, imageError);
        // Continue with other images even if one fails
      }
    }

    if (generatedImages.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate any images' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${generatedImages.length} images successfully`,
      images: generatedImages,
      count: generatedImages.length
    });

  } catch (error) {
    console.error('Error in workflow image generation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate images for workflow',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}