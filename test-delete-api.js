const fs = require('fs');

// Test the delete functionality by checking the blog posts file
async function testDeleteAPI() {
  console.log('🧪 Testing Delete API Functionality');
  
  // Read current blog posts
  const blogPostsPath = './blog-posts.json';
  const posts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf-8'));
  
  console.log('📊 Current posts:');
  posts.forEach((post, index) => {
    console.log(`  ${index + 1}. ${post.id} - "${post.title}"`);
  });
  
  console.log(`\n📈 Total posts: ${posts.length}`);
  
  // Check if we have any test posts we can safely delete
  const testPosts = posts.filter(post => 
    post.id.includes('test') || 
    post.title.toLowerCase().includes('test')
  );
  
  console.log(`\n🧪 Test posts found: ${testPosts.length}`);
  testPosts.forEach(post => {
    console.log(`  - ${post.id}: "${post.title}"`);
  });
  
  if (testPosts.length > 0) {
    console.log('\n✅ You can test delete functionality with these test posts');
    console.log('💡 Try deleting one of the test posts from the dashboard');
  } else {
    console.log('\n⚠️  No test posts found. All posts appear to be real content.');
    console.log('💡 Consider creating a test post first before testing delete');
  }
}

testDeleteAPI().catch(console.error);