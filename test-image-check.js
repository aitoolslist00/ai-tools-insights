const fs = require('fs');
const path = require('path');

// Load blog posts
const blogPosts = JSON.parse(fs.readFileSync('blog-posts.json', 'utf8'));

console.log('Checking images for the latest 6 articles...\n');

// Check first 6 articles
for (let i = 0; i < Math.min(6, blogPosts.length); i++) {
  const post = blogPosts[i];
  console.log(`${i + 1}. ${post.title}`);
  console.log(`   Published: ${post.published ? 'Yes' : 'No'}`);
  console.log(`   Main image: ${post.image || 'None'}`);
  
  if (post.image) {
    const imagePath = path.join('public', post.image);
    const exists = fs.existsSync(imagePath);
    console.log(`   Image exists: ${exists ? 'YES' : 'NO'}`);
    if (!exists) {
      console.log(`   ❌ Missing: ${imagePath}`);
    }
  }
  
  if (post.images && post.images.length > 0) {
    console.log(`   Images array: ${post.images.length} images`);
    post.images.forEach((img, idx) => {
      const imagePath = path.join('public', img.url);
      const exists = fs.existsSync(imagePath);
      console.log(`     ${idx + 1}. ${img.url} - ${exists ? 'EXISTS' : 'MISSING'}`);
    });
  } else {
    console.log(`   Images array: None`);
  }
  
  console.log('');
}