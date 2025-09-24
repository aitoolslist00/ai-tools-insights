const fs = require('fs');
const path = require('path');

const BLOG_POSTS_FILE = 'F:/my work/programming/vercel/ai-tools-list/blog-posts.json';
const UPLOADS_DIR = 'F:/my work/programming/vercel/ai-tools-list/public/uploads';

async function fixBlogImages() {
  try {
    console.log('🔍 Analyzing blog post images...');
    
    // Load blog posts
    const posts = JSON.parse(fs.readFileSync(BLOG_POSTS_FILE, 'utf8'));
    console.log(`📚 Found ${posts.length} blog posts`);
    
    // Get list of actual files in uploads directory
    const uploadedFiles = fs.readdirSync(UPLOADS_DIR)
      .filter(file => file !== '.gitkeep')
      .map(file => `/uploads/${file}`);
    
    console.log(`📁 Found ${uploadedFiles.length} files in uploads directory:`);
    uploadedFiles.forEach(file => console.log(`  - ${file}`));
    
    // Analyze posts with images
    const postsWithImages = posts.filter(post => post.image && post.image.trim() !== '');
    console.log(`\n🖼️  Found ${postsWithImages.length} posts with images:`);
    
    let fixedCount = 0;
    let removedCount = 0;
    
    postsWithImages.forEach((post, index) => {
      console.log(`\n${index + 1}. "${post.title.substring(0, 50)}..."`);
      console.log(`   Current image: ${post.image}`);
      
      // Check if image is a local upload
      if (post.image.startsWith('/uploads/') || post.image.includes('localhost:3000/uploads/')) {
        const imagePath = post.image.replace('http://localhost:3000', '');
        const imageExists = uploadedFiles.includes(imagePath);
        
        console.log(`   Image exists: ${imageExists}`);
        
        if (!imageExists) {
          // Check if there's a similar file that might match
          const filename = path.basename(imagePath);
          const similarFile = uploadedFiles.find(file => 
            path.basename(file).includes(filename.split('-')[0]) ||
            path.basename(file).includes(filename.split('_')[0])
          );
          
          if (similarFile) {
            console.log(`   ✅ Found similar file: ${similarFile}`);
            post.image = similarFile;
            fixedCount++;
          } else {
            console.log(`   ❌ No matching file found, removing image reference`);
            post.image = '';
            removedCount++;
          }
        } else {
          console.log(`   ✅ Image file exists`);
        }
      } else {
        console.log(`   ℹ️  External image URL (keeping as-is)`);
      }
    });
    
    // Save updated posts
    if (fixedCount > 0 || removedCount > 0) {
      // Create backup
      const backupFile = `F:/my work/programming/vercel/ai-tools-list/backups/blog-posts-image-fix-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      fs.writeFileSync(backupFile, JSON.stringify(posts, null, 2));
      console.log(`\n💾 Created backup: ${path.basename(backupFile)}`);
      
      // Save updated posts
      fs.writeFileSync(BLOG_POSTS_FILE, JSON.stringify(posts, null, 2));
      console.log(`\n✅ Updated blog posts file`);
      console.log(`   - Fixed: ${fixedCount} posts`);
      console.log(`   - Removed broken images: ${removedCount} posts`);
    } else {
      console.log(`\n✅ No changes needed - all images are valid`);
    }
    
    // Suggest available images for posts without images
    const postsWithoutImages = posts.filter(post => !post.image || post.image.trim() === '');
    if (postsWithoutImages.length > 0 && uploadedFiles.length > 0) {
      console.log(`\n💡 Suggestion: ${postsWithoutImages.length} posts don't have images.`);
      console.log(`   Available uploaded images that could be used:`);
      uploadedFiles.forEach(file => console.log(`   - ${file}`));
    }
    
  } catch (error) {
    console.error('❌ Error fixing blog images:', error);
  }
}

fixBlogImages();