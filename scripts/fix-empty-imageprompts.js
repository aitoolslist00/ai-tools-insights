const fs = require('fs');
const path = require('path');

// Read the blog posts JSON file
const blogPostsPath = 'f:\\my work\\programming\\vercel\\ai-tools-list\\blog-posts.json';
const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));

console.log('🔧 Fixing articles with empty imagePrompts...\n');

let fixedCount = 0;

blogPosts.forEach((post, index) => {
  if (!post.imagePrompts || post.imagePrompts.length === 0) {
    // Generate imagePrompts based on the article's keyword/topic
    const keyword = post.slug.replace(/-/g, ' ');
    
    post.imagePrompts = [
      `A professional illustration showing ${keyword} in action, modern tech style`,
      `Infographic displaying key features and benefits of ${keyword}`,
      `Screenshot or mockup of ${keyword} interface with clean, modern design`,
      `Diagram illustrating how ${keyword} works, step-by-step process`,
      `Comparison chart showing ${keyword} vs alternatives, professional layout`
    ];
    
    console.log(`✅ Fixed imagePrompts for: ${post.slug}`);
    fixedCount++;
  }
});

// Write the updated blog posts back to the file
fs.writeFileSync(blogPostsPath, JSON.stringify(blogPosts, null, 2));

console.log(`\n🎉 Successfully fixed ${fixedCount} articles with empty imagePrompts!`);
console.log('📝 Updated blog-posts.json file');

// Now we need to regenerate the actual images for these articles
console.log('\n🖼️ Next step: Regenerate images for the fixed articles...');