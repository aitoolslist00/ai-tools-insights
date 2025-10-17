const fs = require('fs');
const path = require('path');
// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { RealImageGenerator } = require('./lib/real-image-generator.ts');

async function generateMissingImages() {
  try {
    console.log('Loading blog posts...');
    
    // Load blog posts
    const blogPostsPath = path.join(__dirname, 'blog-posts.json');
    const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf-8'));
    
    console.log(`Found ${blogPosts.length} blog posts`);
    
    // Filter posts that don't have images
    const postsWithoutImages = blogPosts.filter(post => !post.images || post.images.length === 0);
    
    console.log(`Found ${postsWithoutImages.length} posts without images`);
    
    if (postsWithoutImages.length === 0) {
      console.log('All posts already have images!');
      return;
    }
    
    // Initialize image generator
    const imageGenerator = new RealImageGenerator();
    
    let successCount = 0;
    let failureCount = 0;
    
    // Process each post
    for (let i = 0; i < postsWithoutImages.length; i++) {
      const post = postsWithoutImages[i];
      console.log(`\nProcessing ${i + 1}/${postsWithoutImages.length}: ${post.title}`);
      
      try {
        // Generate image prompts if not available
        let imagePrompts = post.imagePrompts || [];
        if (imagePrompts.length === 0) {
          imagePrompts = [
            `Professional tech illustration for "${post.title}" featuring ${post.keywords.slice(0, 3).join(', ')}, modern digital design, clean and minimalist style`,
            `Conceptual illustration showing ${post.keywords[0]} technology, abstract tech elements, blue and purple gradient background`
          ];
        }
        
        const generatedImages = [];
        
        // Generate up to 2 images per post
        for (let j = 0; j < Math.min(imagePrompts.length, 2); j++) {
          try {
            const image = await imageGenerator.generateImage({
              keyword: post.keywords[j] || post.title,
              style: 'tech',
              aspectRatio: j === 0 ? '16:9' : '4:3',
              width: j === 0 ? 1200 : 800,
              height: j === 0 ? 675 : 600
            });
            
            generatedImages.push({
              url: image.url,
              alt: `${post.title} - Image ${j + 1}`,
              title: `${post.title} - Image ${j + 1}`,
              caption: `Illustration for ${post.title}`,
              width: image.width,
              height: image.height,
              format: 'jpg'
            });
            
            console.log(`  ✓ Generated image ${j + 1}: ${image.url}`);
          } catch (imageError) {
            console.warn(`  ✗ Failed to generate image ${j + 1}:`, imageError.message);
          }
        }
        
        if (generatedImages.length > 0) {
          // Update the post with generated images
          post.images = generatedImages;
          post.image = generatedImages[0].url;
          post.imagePrompts = imagePrompts;
          post.lastModified = new Date().toISOString();
          
          successCount++;
          console.log(`  ✓ Successfully added ${generatedImages.length} images to "${post.title}"`);
        } else {
          failureCount++;
          console.log(`  ✗ No images generated for "${post.title}"`);
        }
        
        // Add delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`  ✗ Error processing "${post.title}":`, error.message);
        failureCount++;
      }
    }
    
    // Save updated blog posts
    if (successCount > 0) {
      // Create backup
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(__dirname, 'backups', `blog-posts-${timestamp}.json`);
      
      // Ensure backup directory exists
      const backupDir = path.dirname(backupPath);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      // Create backup
      fs.writeFileSync(backupPath, fs.readFileSync(blogPostsPath, 'utf-8'));
      console.log(`\nBackup created: ${backupPath}`);
      
      // Save updated posts
      fs.writeFileSync(blogPostsPath, JSON.stringify(blogPosts, null, 2));
      console.log(`\n✓ Updated ${successCount} posts with images`);
    }
    
    console.log(`\n=== SUMMARY ===`);
    console.log(`Posts processed: ${postsWithoutImages.length}`);
    console.log(`Successfully updated: ${successCount}`);
    console.log(`Failed: ${failureCount}`);
    
  } catch (error) {
    console.error('Error generating missing images:', error);
    process.exit(1);
  }
}

// Run the script
generateMissingImages().then(() => {
  console.log('\nImage generation complete!');
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});