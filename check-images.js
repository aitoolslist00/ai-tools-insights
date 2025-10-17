const fs = require('fs');

try {
  const posts = JSON.parse(fs.readFileSync('./blog-posts.json', 'utf-8'));
  const withoutImages = posts.filter(p => !p.images || p.images.length === 0);
  
  console.log('Total posts:', posts.length);
  console.log('Posts without images:', withoutImages.length);
  console.log('Posts with images:', posts.length - withoutImages.length);
  
  if (withoutImages.length > 0) {
    console.log('\nPosts without images:');
    withoutImages.slice(0, 5).forEach((post, i) => {
      console.log(`${i + 1}. ${post.title} (${post.slug})`);
    });
    if (withoutImages.length > 5) {
      console.log(`... and ${withoutImages.length - 5} more`);
    }
  }
} catch (error) {
  console.error('Error:', error.message);
}