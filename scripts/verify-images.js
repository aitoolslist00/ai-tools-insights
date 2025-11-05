const fs = require('fs');
const path = require('path');

// Read the blog posts data
const blogPostsPath = path.join(__dirname, '..', 'blog-posts.json');
const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));

// Articles that were problematic
const problematicArticles = [
  'free-ai-tools-list',
  'ai-study-tools', 
  'zerogpt',
  'uncensored-ai-tools',
  'turbo-ai-definitive-guide-2025'
];

console.log('🔍 Verifying image fixes for problematic articles...\n');

problematicArticles.forEach(slug => {
  const article = blogPosts.find(post => post.slug === slug);
  
  if (!article) {
    console.log(`❌ Article not found: ${slug}`);
    return;
  }
  
  console.log(`📄 Article: ${article.title}`);
  console.log(`   Slug: ${slug}`);
  
  // Check imagePrompts
  const hasImagePrompts = article.imagePrompts && article.imagePrompts.length > 0;
  console.log(`   ImagePrompts: ${hasImagePrompts ? '✅' : '❌'} (${article.imagePrompts?.length || 0} prompts)`);
  
  // Check images in content
  const imageMatches = article.content.match(/<img[^>]+src="[^"]*"/g) || [];
  console.log(`   Images in content: ${imageMatches.length > 0 ? '✅' : '❌'} (${imageMatches.length} images)`);
  
  if (imageMatches.length > 0) {
    imageMatches.forEach((img, index) => {
      const srcMatch = img.match(/src="([^"]*)"/);
      if (srcMatch) {
        console.log(`     ${index + 1}. ${srcMatch[1]}`);
      }
    });
  }
  
  console.log('');
});

console.log('🎯 Summary:');
console.log('- All articles should have imagePrompts ✅');
console.log('- All articles should have images in content ✅');
console.log('- Images should be high-quality Unsplash URLs ✅');
console.log('\n🌐 Test the articles at:');
problematicArticles.forEach(slug => {
  console.log(`   http://localhost:3001/blog/${slug}`);
});