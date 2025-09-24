const fs = require('fs');
const path = require('path');

async function comprehensiveImageTest() {
  console.log('🧪 Comprehensive Image Upload Test\n');
  
  try {
    // Step 1: Verify test image exists and is valid
    console.log('1️⃣ Verifying test image...');
    const testImagePath = 'F:/my work/programming/vercel/ai-tools-list/public/uploads/test-blog-image.png';
    
    if (!fs.existsSync(testImagePath)) {
      console.log('❌ Test image not found');
      return;
    }
    
    const imageStats = fs.statSync(testImagePath);
    console.log(`✅ Test image found: ${imageStats.size} bytes`);
    
    // Step 2: Create a test blog post with the image
    console.log('\n2️⃣ Creating test blog post with image...');
    
    const blogPostsFile = 'F:/my work/programming/vercel/ai-tools-list/blog-posts.json';
    const posts = JSON.parse(fs.readFileSync(blogPostsFile, 'utf8'));
    
    const testPostId = `image-test-${Date.now()}`;
    const testImageUrl = '/uploads/test-blog-image.png';
    
    const testPost = {
      id: testPostId,
      title: 'Image Upload Test Post',
      content: '# Image Upload Test\n\nThis post is testing the image upload functionality.\n\n![Test Image](' + testImageUrl + ')\n\nThe image should appear both as a featured image and in the content.',
      excerpt: 'Testing image upload functionality in the blog system',
      author: 'Test Author',
      category: 'ai-tools',
      tags: ['test', 'image-upload', 'debugging'],
      image: testImageUrl,
      featured: false,
      published: true,
      readTime: '2 min read',
      date: new Date().toISOString().split('T')[0],
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      seo: {
        metaTitle: 'Image Upload Test Post - AI Tools List',
        metaDescription: 'Testing image upload functionality in the blog system',
        keywords: ['test', 'image-upload', 'debugging'],
        focusKeyword: 'image-upload',
        canonicalUrl: `https://www.aitoolsinsights.com/blog/${testPostId}`,
        ogTitle: 'Image Upload Test Post',
        ogDescription: 'Testing image upload functionality in the blog system',
        ogImage: testImageUrl,
        twitterTitle: 'Image Upload Test Post',
        twitterDescription: 'Testing image upload functionality in the blog system',
        twitterImage: testImageUrl
      }
    };
    
    // Remove any existing test posts
    const filteredPosts = posts.filter(post => !post.id.startsWith('image-test-'));
    
    // Add the new test post at the beginning
    filteredPosts.unshift(testPost);
    
    // Create backup
    const backupFile = `F:/my work/programming/vercel/ai-tools-list/backups/blog-posts-comprehensive-test-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    fs.writeFileSync(backupFile, JSON.stringify(posts, null, 2));
    console.log(`💾 Created backup: ${path.basename(backupFile)}`);
    
    // Save updated posts
    fs.writeFileSync(blogPostsFile, JSON.stringify(filteredPosts, null, 2));
    
    console.log('✅ Test post created successfully');
    console.log(`📝 Post ID: ${testPostId}`);
    console.log(`🖼️ Image URL: ${testImageUrl}`);
    
    // Step 3: Verify the post was saved correctly
    console.log('\n3️⃣ Verifying post was saved correctly...');
    
    const updatedPosts = JSON.parse(fs.readFileSync(blogPostsFile, 'utf8'));
    const savedPost = updatedPosts.find(post => post.id === testPostId);
    
    if (savedPost) {
      console.log('✅ Post found in saved data');
      console.log(`📸 Image field: ${savedPost.image}`);
      console.log(`🔍 SEO OG Image: ${savedPost.seo?.ogImage}`);
      console.log(`📱 Twitter Image: ${savedPost.seo?.twitterImage}`);
      console.log(`📊 Published: ${savedPost.published}`);
    } else {
      console.log('❌ Post not found in saved data');
      return;
    }
    
    // Step 4: Check image accessibility
    console.log('\n4️⃣ Checking image accessibility...');
    
    const fullImagePath = path.join('F:/my work/programming/vercel/ai-tools-list/public', testImageUrl);
    const imageExists = fs.existsSync(fullImagePath);
    console.log(`📁 Image file exists: ${imageExists ? '✅' : '❌'}`);
    
    if (imageExists) {
      const stats = fs.statSync(fullImagePath);
      console.log(`📏 Image size: ${stats.size} bytes`);
      console.log(`📅 Last modified: ${stats.mtime.toISOString()}`);
    }
    
    // Step 5: Generate test URLs
    console.log('\n5️⃣ Test URLs:');
    console.log(`🌐 Blog post URL: https://www.aitoolsinsights.com/blog/${testPostId}`);
    console.log(`🖼️ Image URL: https://www.aitoolsinsights.com${testImageUrl}`);
    console.log(`📋 Dashboard URL: https://www.aitoolsinsights.com/blog/dashboard`);
    
    // Step 6: Create debugging checklist
    console.log('\n6️⃣ Debugging Checklist:');
    console.log('');
    console.log('✅ Test image created and exists');
    console.log('✅ Blog post created with image reference');
    console.log('✅ Image URL saved in post data');
    console.log('✅ SEO metadata includes image URLs');
    console.log('');
    console.log('🔍 Next steps to debug in browser:');
    console.log('1. Open browser developer tools (F12)');
    console.log('2. Go to https://www.aitoolsinsights.com/blog/dashboard');
    console.log('3. Look for the test post in the dashboard');
    console.log('4. Check if the image preview shows in the post list');
    console.log('5. Edit the test post and check if the image appears in the editor');
    console.log('6. Check browser console for any JavaScript errors');
    console.log('7. Check Network tab for failed image requests');
    console.log('');
    console.log('🐛 Common issues to check:');
    console.log('- Image URLs should be relative (/uploads/...) not absolute');
    console.log('- Check if Next.js is serving static files correctly');
    console.log('- Verify no CORS issues with image loading');
    console.log('- Check if image state is preserved during React re-renders');
    console.log('- Verify the save API is receiving and storing image URLs');
    
    // Step 7: Create a simple HTML test page
    console.log('\n7️⃣ Creating HTML test page...');
    
    const htmlTest = `<!DOCTYPE html>
<html>
<head>
    <title>Image Upload Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .test-section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; }
        img { max-width: 300px; border: 1px solid #ccc; }
        .error { color: red; }
        .success { color: green; }
    </style>
</head>
<body>
    <h1>Image Upload Test Page</h1>
    
    <div class="test-section">
        <h2>Test Image Direct Access</h2>
        <p>Testing direct access to uploaded image:</p>
        <img src="${testImageUrl}" alt="Test Image" onload="this.nextSibling.innerHTML='✅ Image loaded successfully'" onerror="this.nextSibling.innerHTML='❌ Image failed to load'">
        <div class="result"></div>
    </div>
    
    <div class="test-section">
        <h2>Test Image via Full URL</h2>
        <p>Testing image access via full URL:</p>
        <img src="https://www.aitoolsinsights.com${testImageUrl}" alt="Test Image Full URL" onload="this.nextSibling.innerHTML='✅ Image loaded successfully'" onerror="this.nextSibling.innerHTML='❌ Image failed to load'">
        <div class="result"></div>
    </div>
    
    <div class="test-section">
        <h2>Blog Post Data</h2>
        <pre>${JSON.stringify(savedPost, null, 2)}</pre>
    </div>
    
    <script>
        console.log('🧪 Image test page loaded');
        console.log('📸 Test image URL:', '${testImageUrl}');
        console.log('📝 Test post ID:', '${testPostId}');
    </script>
</body>
</html>`;
    
    const htmlTestPath = 'F:/my work/programming/vercel/ai-tools-list/public/image-test.html';
    fs.writeFileSync(htmlTestPath, htmlTest);
    console.log(`📄 Created HTML test page: ${htmlTestPath}`);
    console.log(`🌐 Access at: http://localhost:3000/image-test.html`);
    
    console.log('\n🎉 Comprehensive test completed!');
    console.log('\n📋 Summary:');
    console.log(`- Test post created: ${testPostId}`);
    console.log(`- Image URL: ${testImageUrl}`);
    console.log(`- Image file exists: ${imageExists ? 'Yes' : 'No'}`);
    console.log(`- Post saved with image: Yes`);
    console.log(`- HTML test page: /image-test.html`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

comprehensiveImageTest();