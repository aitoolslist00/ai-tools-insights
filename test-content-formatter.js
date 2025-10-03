const fs = require('fs');
const path = require('path');

// Read the blog posts data
const blogPostsPath = path.join(__dirname, 'blog-posts.json');
const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));

// Find the multimodal AI assistants post
const multimodalPost = blogPosts.find(post => post.slug === 'multimodal-ai-assistants');

if (multimodalPost) {
  console.log('Found multimodal AI assistants post:');
  console.log('Title:', multimodalPost.title);
  console.log('Images count:', multimodalPost.images?.length || 0);
  
  if (multimodalPost.images) {
    console.log('\nImages:');
    multimodalPost.images.forEach((image, index) => {
      console.log(`${index + 1}. ${image.filename}`);
      console.log(`   URL: ${image.url}`);
      console.log(`   Alt: ${image.alt}`);
      console.log(`   Size: ${image.width}x${image.height}`);
      
      // Check if file exists
      const fullPath = path.join(__dirname, 'public', image.url.replace('/', ''));
      const exists = fs.existsSync(fullPath);
      console.log(`   File exists: ${exists}`);
      console.log('');
    });
  }
  
  // Check content structure
  const h2Count = (multimodalPost.content.match(/## /g) || []).length;
  console.log(`Content has ${h2Count} H2 headers`);
  
  // Show first few H2 headers
  const h2Headers = multimodalPost.content.match(/## [^\n]+/g);
  if (h2Headers) {
    console.log('\nFirst few H2 headers:');
    h2Headers.slice(0, 5).forEach((header, index) => {
      console.log(`${index + 1}. ${header}`);
    });
  }
} else {
  console.log('Multimodal AI assistants post not found!');
}