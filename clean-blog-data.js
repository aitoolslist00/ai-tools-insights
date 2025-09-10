const fs = require('fs');
const path = require('path');

// Read the current blog posts
const blogPostsPath = path.join(__dirname, 'blog-posts.json');
const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf-8'));

// Clean up function to remove markdown symbols from titles
function cleanTitle(title) {
  if (!title) return title;
  return title.replace(/^#+\s*/, '').trim();
}

// Clean up all blog posts
const cleanedPosts = blogPosts.map(post => ({
  ...post,
  title: cleanTitle(post.title),
  seo: {
    ...post.seo,
    metaTitle: cleanTitle(post.seo?.metaTitle),
    ogTitle: cleanTitle(post.seo?.ogTitle),
    twitterTitle: cleanTitle(post.seo?.twitterTitle)
  }
}));

// Write the cleaned data back
fs.writeFileSync(blogPostsPath, JSON.stringify(cleanedPosts, null, 2), 'utf-8');

console.log('Blog post data cleaned successfully!');
console.log('Cleaned titles:');
cleanedPosts.forEach(post => {
  console.log(`- ${post.title}`);
});