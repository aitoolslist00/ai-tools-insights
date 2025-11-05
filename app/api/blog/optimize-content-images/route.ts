import { NextRequest, NextResponse } from 'next/server';
import { validateApiAuth } from '@/lib/auth-enhanced';
import { ContentImageOptimizer } from '@/lib/content-image-optimizer';

interface OptimizeContentImagesRequest {
  content: string;
  images: Array<{
    filename: string;
    path: string;
    url: string;
    alt: string;
    width: number;
    height: number;
    optimized?: boolean;
  }>;
  title: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await validateApiAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, images, title }: OptimizeContentImagesRequest = await request.json();

    if (!content || !images || !title) {
      return NextResponse.json(
        { error: 'Content, images, and title are required' },
        { status: 400 }
      );
    }

    if (images.length === 0) {
      return NextResponse.json({
        success: true,
        optimizedContent: content,
        imagesIntegrated: 0,
        message: 'No images to integrate'
      });
    }

    console.log(`🖼️ Optimizing content with ${images.length} images...`);

    // Initialize content image optimizer
    const contentOptimizer = new ContentImageOptimizer();

    // Convert images to the expected format
    const optimizedImages = images.map(img => ({
      filename: img.filename,
      path: img.path,
      url: img.url,
      alt: img.alt,
      width: img.width,
      height: img.height,
      optimized: img.optimized || true
    }));

    // Optimize content with images
    const optimizedContent = await contentOptimizer.optimizeContentWithImages(
      content,
      optimizedImages,
      title
    );

    console.log('✅ Content optimization completed successfully');

    return NextResponse.json({
      success: true,
      optimizedContent: optimizedContent,
      imagesIntegrated: images.length,
      originalContentLength: content.length,
      optimizedContentLength: optimizedContent.length,
      message: `Successfully integrated ${images.length} images into content`
    });

  } catch (error) {
    console.error('Error optimizing content with images:', error);
    return NextResponse.json(
      { 
        error: 'Failed to optimize content with images',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}