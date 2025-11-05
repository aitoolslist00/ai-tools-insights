const fs = require('fs');
const path = require('path');

// Read the blog posts JSON file
const blogPostsPath = 'f:\\my work\\programming\\vercel\\ai-tools-list\\blog-posts.json';
const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));

console.log('🔍 Scanning for articles with empty imagePrompts...\n');

const articlesWithEmptyImagePrompts = [];

blogPosts.forEach((post, index) => {
  if (!post.imagePrompts || post.imagePrompts.length === 0) {
    articlesWithEmptyImagePrompts.push({
      index,
      slug: post.slug,
      title: post.title
    });
  }
});

console.log(`Found ${articlesWithEmptyImagePrompts.length} articles with empty imagePrompts:\n`);

articlesWithEmptyImagePrompts.forEach(article => {
  console.log(`📝 ${article.slug}`);
  console.log(`   Title: ${article.title.substring(0, 80)}...`);
  console.log(`   Index: ${article.index}\n`);
});

// Save the results to a file for reference
fs.writeFileSync(
  'f:\\my work\\programming\\vercel\\ai-tools-list\\scripts\\empty-imageprompts-report.json',
  JSON.stringify(articlesWithEmptyImagePrompts, null, 2)
);

console.log('📊 Report saved to: scripts/empty-imageprompts-report.json');