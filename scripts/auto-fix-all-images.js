const fs = require('fs').promises;
const path = require('path');

/**
 * Automatically fix all blog posts by adding proper image structure
 * Uses existing generated images from the public/generated-images directory
 */

async function autoFixAllImages() {
  try {
    console.log('🔧 Starting to auto-fix all blog post images...');
    
    // Read blog posts
    const blogPostsPath = path.join(process.cwd(), 'blog-posts.json');
    const data = await fs.readFile(blogPostsPath, 'utf8');
    const posts = JSON.parse(data);
    
    // Get list of existing images
    const imagesDir = path.join(process.cwd(), 'public', 'generated-images');
    const existingImages = await fs.readdir(imagesDir);
    const imageFiles = existingImages.filter(file => file.endsWith('.jpg') && !file.includes('-thumb'));
    
    console.log(`📚 Found ${posts.length} blog posts to process`);
    console.log(`🖼️  Found ${imageFiles.length} existing images`);
    
    let updatedCount = 0;
    
    // Process each post
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      
      // Skip if post already has images
      if (post.images && Array.isArray(post.images) && post.images.length > 0) {
        console.log(`✅ Post "${post.title}" already has images, skipping`);
        continue;
      }
      
      console.log(`🖼️  Processing post: "${post.title}"`);
      
      // Find relevant images for this post based on keywords
      const postKeywords = [
        post.slug,
        post.id,
        ...(post.keywords || []),
        post.category,
        post.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ')
      ].flat().filter(Boolean);
      
      // Find matching images
      const matchingImages = [];
      for (const keyword of postKeywords) {
        const keywordLower = keyword.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const matchingFiles = imageFiles.filter(file => 
          file.toLowerCase().includes(keywordLower) ||
          keywordLower.includes(file.split('-')[0])
        );
        
        for (const file of matchingFiles.slice(0, 3)) { // Max 3 images per post
          if (!matchingImages.find(img => img.filename === file)) {
            matchingImages.push({
              filename: file,
              path: `/generated-images/${file}`,
              url: `/generated-images/${file}`,
              alt: `${post.title} - Related image`,
              width: 1200,
              height: 630,
              webpPath: `/generated-images/${file.replace('.jpg', '.webp')}`,
              webpUrl: `/generated-images/${file.replace('.jpg', '.webp')}`,
              thumbnailPath: `/generated-images/${file.replace('.jpg', '-thumb.jpg')}`,
              thumbnailUrl: `/generated-images/${file.replace('.jpg', '-thumb.jpg')}`,
              metadata: {
                keyword: keyword,
                style: 'tech',
                generatedAt: new Date().toISOString(),
                optimized: true,
                source: 'existing',
                autoMatched: true
              }
            });
          }
        }
        
        if (matchingImages.length >= 3) break; // Stop when we have enough images
      }
      
      // If no matching images found, use generic AI-related images
      if (matchingImages.length === 0) {
        const genericImages = imageFiles.filter(file => 
          file.includes('ai-tools') || 
          file.includes('artificial-intelligence') ||
          file.includes('ai-')
        ).slice(0, 3);
        
        for (const file of genericImages) {
          matchingImages.push({
            filename: file,
            path: `/generated-images/${file}`,
            url: `/generated-images/${file}`,
            alt: `${post.title} - AI tools illustration`,
            width: 1200,
            height: 630,
            webpPath: `/generated-images/${file.replace('.jpg', '.webp')}`,
            webpUrl: `/generated-images/${file.replace('.jpg', '.webp')}`,
            thumbnailPath: `/generated-images/${file.replace('.jpg', '-thumb.jpg')}`,
            thumbnailUrl: `/generated-images/${file.replace('.jpg', '-thumb.jpg')}`,
            metadata: {
              keyword: 'ai-tools',
              style: 'tech',
              generatedAt: new Date().toISOString(),
              optimized: true,
              source: 'generic',
              autoMatched: true
            }
          });
        }
      }
      
      if (matchingImages.length > 0) {
        // Update post with matched images
        posts[i] = {
          ...post,
          images: matchingImages,
          image: matchingImages[0]?.url, // Set first image as featured
          imageGenerationMetadata: {
            generatedAt: new Date().toISOString(),
            method: 'auto-match',
            imagesGenerated: matchingImages.length,
            autoMatched: true
          },
          lastModified: new Date().toISOString()
        };
        
        updatedCount++;
        console.log(`✅ Updated "${post.title}" with ${matchingImages.length} images`);
      } else {
        console.log(`⚠️  No suitable images found for "${post.title}"`);
      }
    }
    
    // Save updated posts
    await fs.writeFile(blogPostsPath, JSON.stringify(posts, null, 2));
    
    console.log(`🎉 Successfully updated ${updatedCount} blog posts with images!`);
    console.log(`📝 Total posts processed: ${posts.length}`);
    
  } catch (error) {
    console.error('❌ Error auto-fixing images:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  autoFixAllImages();
}

module.exports = { autoFixAllImages };