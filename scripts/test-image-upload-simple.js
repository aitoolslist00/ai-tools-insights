const fs = require('fs');
const path = require('path');

async function testImageUploadFlow() {
  console.log('🧪 Testing image upload flow (simplified)...\n');
  
  try {
    // Step 1: Check current state of uploads directory
    console.log('1️⃣ Checking uploads directory...');
    const uploadsDir = 'F:/my work/programming/vercel/ai-tools-list/public/uploads';
    
    if (!fs.existsSync(uploadsDir)) {
      console.log('❌ Uploads directory does not exist!');
      return;
    }
    
    const files = fs.readdirSync(uploadsDir).filter(f => f !== '.gitkeep');
    console.log(`📁 Found ${files.length} files in uploads directory:`);
    files.forEach(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      console.log(`  - ${file} (${Math.round(stats.size / 1024)}KB, ${stats.mtime.toISOString()})`);
    });
    
    // Step 2: Check blog posts with images
    console.log('\n2️⃣ Checking blog posts with images...');
    const blogPostsFile = 'F:/my work/programming/vercel/ai-tools-list/blog-posts.json';
    const posts = JSON.parse(fs.readFileSync(blogPostsFile, 'utf8'));
    
    const postsWithImages = posts.filter(post => post.image && post.image.trim() !== '');
    console.log(`📚 Found ${postsWithImages.length} posts with images:`);
    
    postsWithImages.forEach((post, index) => {
      console.log(`\n${index + 1}. "${post.title.substring(0, 50)}..."`);
      console.log(`   Image: ${post.image}`);
      console.log(`   Published: ${post.published}`);
      
      // Check if local image exists
      if (post.image.startsWith('/uploads/')) {
        const imagePath = path.join('F:/my work/programming/vercel/ai-tools-list/public', post.image);
        const exists = fs.existsSync(imagePath);
        console.log(`   File exists: ${exists ? '✅' : '❌'}`);
        
        if (exists) {
          const stats = fs.statSync(imagePath);
          console.log(`   File size: ${Math.round(stats.size / 1024)}KB`);
        }
      } else {
        console.log(`   External URL: ℹ️`);
      }
    });
    
    // Step 3: Create a test blog post with existing image
    console.log('\n3️⃣ Creating test blog post with existing image...');
    
    if (files.length > 0) {
      const testImageUrl = `/uploads/${files[0]}`;
      const testPost = {
        id: `test-image-display-${Date.now()}`,
        title: 'Test Image Display Post',
        content: '# Test Image Display\\n\\nThis post tests if images are properly displayed in the blog.',
        excerpt: 'Testing image display functionality',
        author: 'Test Author',
        category: 'ai-tools',
        tags: ['test', 'image-display'],
        image: testImageUrl,
        featured: false,
        published: true,
        readTime: '1 min read',
        date: new Date().toISOString().split('T')[0],
        seo: {
          metaTitle: 'Test Image Display Post',
          metaDescription: 'Testing image display functionality',
          keywords: ['test', 'image-display'],
          focusKeyword: 'test',
          canonicalUrl: `https://www.aitoolsinsights.com/blog/test-image-display-${Date.now()}`,
          ogTitle: 'Test Image Display Post',
          ogDescription: 'Testing image display functionality',
          ogImage: testImageUrl,
          twitterTitle: 'Test Image Display Post',
          twitterDescription: 'Testing image display functionality',
          twitterImage: testImageUrl
        }
      };
      
      // Remove any existing test posts
      const filteredPosts = posts.filter(post => !post.id.startsWith('test-image-display-'));
      
      // Add the new test post at the beginning
      filteredPosts.unshift(testPost);
      
      // Create backup
      const backupFile = `F:/my work/programming/vercel/ai-tools-list/backups/blog-posts-image-test-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      fs.writeFileSync(backupFile, JSON.stringify(posts, null, 2));
      console.log(`💾 Created backup: ${path.basename(backupFile)}`);
      
      // Save updated posts
      fs.writeFileSync(blogPostsFile, JSON.stringify(filteredPosts, null, 2));
      
      console.log('✅ Created test blog post with image');
      console.log(`📝 Post ID: ${testPost.id}`);
      console.log(`🖼️ Image URL: ${testPost.image}`);
      console.log(`🔗 Blog URL: https://www.aitoolsinsights.com/blog/${testPost.id}`);
      
      console.log('\n🎯 Next steps to test:');
      console.log('1. Visit the blog dashboard: https://www.aitoolsinsights.com/blog/dashboard');
      console.log('2. Check if the test post appears with the image');
      console.log('3. Try editing the post to see if the image is preserved');
      console.log('4. Visit the public blog post URL to see if the image displays');
      
    } else {
      console.log('❌ No images available for testing');
    }
    
    // Step 4: Provide debugging information
    console.log('\n🔍 Debugging Information:');
    console.log('- Upload API endpoint: /api/upload');
    console.log('- Blog management API: /api/blog/manage');
    console.log('- Static files served from: /public/uploads/');
    console.log('- Blog posts file: blog-posts.json');
    
    console.log('\n💡 Common issues and solutions:');
    console.log('1. Images upload but don\'t save to posts:');
    console.log('   - Check browser console for JavaScript errors');
    console.log('   - Verify the image state is properly set in ModernArticleEditor');
    console.log('   - Check if the save function includes the image field');
    
    console.log('2. Images save to posts but don\'t display:');
    console.log('   - Check if image URLs are correct (relative vs absolute)');
    console.log('   - Verify static file serving is working');
    console.log('   - Check browser network tab for failed image requests');
    
    console.log('3. Images work in development but not production:');
    console.log('   - Check if uploads directory exists in production');
    console.log('   - Verify file permissions');
    console.log('   - Consider using external image hosting for production');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testImageUploadFlow();