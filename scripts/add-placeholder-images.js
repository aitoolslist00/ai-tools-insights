const fs = require('fs');
const path = require('path');

// Articles that need images
const articlesToProcess = [
  'free-ai-tools-list',
  'ai-study-tools', 
  'zerogpt',
  'uncensored-ai-tools',
  'turbo-ai-definitive-guide-2025'
];

function addPlaceholderImages() {
  console.log('🖼️ Adding placeholder images to articles...\n');
  
  // Read the blog posts JSON file
  const blogPostsPath = 'f:\\my work\\programming\\vercel\\ai-tools-list\\blog-posts.json';
  const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));
  
  let updatedCount = 0;
  
  blogPosts.forEach((post, index) => {
    if (articlesToProcess.includes(post.slug)) {
      console.log(`📝 Processing: ${post.slug}`);
      
      // Generate placeholder image URLs
      const baseUrl = 'https://images.unsplash.com/photo-';
      const imageIds = [
        '1677442136019-1595019b9f73', // Tech/AI related
        '1620712943543-bcc4659a8dc4', // Digital/Tech
        '1518709268805-4e9042af9f23', // Modern tech
        '1551288049-bec5c4c4b5b3', // AI/Data
        '1559526324-4b87b5e36e44'  // Technology
      ];
      
      // Create image objects
      post.images = imageIds.map((id, i) => ({
        url: `${baseUrl}${id}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80`,
        alt: `${post.slug.replace(/-/g, ' ')} - Image ${i + 1}`,
        caption: `Professional illustration related to ${post.slug.replace(/-/g, ' ')}`
      }));
      
      console.log(`   ✅ Added ${post.images.length} placeholder images`);
      updatedCount++;
    }
  });
  
  // Write the updated blog posts back to the file
  fs.writeFileSync(blogPostsPath, JSON.stringify(blogPosts, null, 2));
  
  console.log(`\n🎉 Successfully added placeholder images to ${updatedCount} articles!`);
  console.log('📝 Updated blog-posts.json file');
  console.log('\n💡 Note: These are placeholder images from Unsplash. For production, you should generate proper images.');
}

// Run the script
if (require.main === module) {
  addPlaceholderImages();
}

module.exports = { addPlaceholderImages };