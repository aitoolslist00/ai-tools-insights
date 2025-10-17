const fs = require('fs').promises;
const path = require('path');

/**
 * Fix missing images in blog posts by generating actual image URLs
 * This script converts schema image definitions to actual image arrays
 */

async function fixMissingImages() {
  try {
    console.log('🔧 Starting to fix missing images in blog posts...');
    
    // Read blog posts
    const blogPostsPath = path.join(process.cwd(), 'blog-posts.json');
    const data = await fs.readFile(blogPostsPath, 'utf8');
    const posts = JSON.parse(data);
    
    console.log(`📚 Found ${posts.length} blog posts to process`);
    
    let updatedCount = 0;
    
    // Process each post
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      
      // Skip if post already has images
      if (post.images && Array.isArray(post.images) && post.images.length > 0) {
        console.log(`✅ Post "${post.title}" already has images, skipping`);
        continue;
      }
      
      // Check if post has schema images
      const schemaImages = post.schemas?.article?.image;
      if (!schemaImages || !Array.isArray(schemaImages)) {
        console.log(`⚠️  Post "${post.title}" has no schema images, skipping`);
        continue;
      }
      
      console.log(`🖼️  Processing post: "${post.title}"`);
      
      // Convert schema images to actual images array
      const actualImages = schemaImages.map((schemaImg, index) => ({
        filename: `${post.slug || post.id}-${index + 1}.jpg`,
        path: `/generated-images/${post.slug || post.id}-${index + 1}.jpg`,
        url: `/generated-images/${post.slug || post.id}-${index + 1}.jpg`,
        alt: schemaImg.description || `${post.title} - Image ${index + 1}`,
        width: schemaImg.width || 1200,
        height: schemaImg.height || 630,
        webpPath: `/generated-images/${post.slug || post.id}-${index + 1}.webp`,
        webpUrl: `/generated-images/${post.slug || post.id}-${index + 1}.webp`,
        thumbnailPath: `/generated-images/${post.slug || post.id}-${index + 1}-thumb.jpg`,
        thumbnailUrl: `/generated-images/${post.slug || post.id}-${index + 1}-thumb.jpg`,
        metadata: {
          keyword: post.keywords?.[0] || post.title,
          style: 'tech',
          generatedAt: new Date().toISOString(),
          optimized: true,
          source: 'placeholder',
          convertedFromSchema: true
        }
      }));
      
      // Update post with actual images
      posts[i] = {
        ...post,
        images: actualImages,
        image: actualImages[0]?.url, // Set first image as featured
        imageGenerationMetadata: {
          generatedAt: new Date().toISOString(),
          method: 'schema-conversion',
          imagesGenerated: actualImages.length,
          convertedFromSchema: true
        },
        lastModified: new Date().toISOString()
      };
      
      updatedCount++;
      console.log(`✅ Updated "${post.title}" with ${actualImages.length} images`);
    }
    
    // Save updated posts
    await fs.writeFile(blogPostsPath, JSON.stringify(posts, null, 2));
    
    console.log(`🎉 Successfully updated ${updatedCount} blog posts with images!`);
    console.log(`📝 Total posts processed: ${posts.length}`);
    
    // Generate placeholder images for the converted posts
    console.log('\n🎨 Now generating placeholder images...');
    await generatePlaceholderImages(posts.filter(p => p.imageGenerationMetadata?.convertedFromSchema));
    
  } catch (error) {
    console.error('❌ Error fixing missing images:', error);
    process.exit(1);
  }
}

async function generatePlaceholderImages(postsWithNewImages) {
  const sharp = require('sharp');
  
  // Ensure generated-images directory exists
  const imagesDir = path.join(process.cwd(), 'public', 'generated-images');
  try {
    await fs.mkdir(imagesDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
  
  for (const post of postsWithNewImages) {
    if (!post.images) continue;
    
    console.log(`🎨 Generating placeholder images for: "${post.title}"`);
    
    for (let i = 0; i < Math.min(post.images.length, 3); i++) {
      const image = post.images[i];
      const imagePath = path.join(process.cwd(), 'public', image.path);
      
      try {
        // Create a simple gradient placeholder
        const width = image.width || 1200;
        const height = image.height || 630;
        
        // Generate gradient colors based on post category
        const colors = {
          'ai-tools': ['#3B82F6', '#8B5CF6'], // Blue to Purple
          'productivity': ['#10B981', '#3B82F6'], // Green to Blue  
          'design': ['#F59E0B', '#EF4444'], // Orange to Red
          'development': ['#6366F1', '#8B5CF6'], // Indigo to Purple
          'default': ['#6B7280', '#374151'] // Gray gradient
        };
        
        const [color1, color2] = colors[post.category] || colors.default;
        
        // Create SVG gradient
        const svg = `
          <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad)" />
            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
                  text-anchor="middle" dominant-baseline="middle" fill="white" opacity="0.9">
              ${post.title.substring(0, 30)}${post.title.length > 30 ? '...' : ''}
            </text>
          </svg>
        `;
        
        // Convert SVG to image
        await sharp(Buffer.from(svg))
          .jpeg({ quality: 85 })
          .toFile(imagePath);
          
        // Generate WebP version
        const webpPath = imagePath.replace('.jpg', '.webp');
        await sharp(Buffer.from(svg))
          .webp({ quality: 85 })
          .toFile(webpPath);
          
        // Generate thumbnail
        const thumbPath = imagePath.replace('.jpg', '-thumb.jpg');
        await sharp(Buffer.from(svg))
          .resize(400, 225)
          .jpeg({ quality: 80 })
          .toFile(thumbPath);
          
        console.log(`✅ Generated image: ${image.filename}`);
        
      } catch (error) {
        console.warn(`⚠️  Failed to generate image ${image.filename}:`, error.message);
      }
    }
  }
  
  console.log('🎉 Placeholder image generation complete!');
}

// Run the script
if (require.main === module) {
  fixMissingImages();
}

module.exports = { fixMissingImages };