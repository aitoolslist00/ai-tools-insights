const fs = require('fs');
const path = require('path');

// Load blog posts
console.log('Loading blog posts...');
const blogPosts = JSON.parse(fs.readFileSync('./blog-posts.json', 'utf-8'));

console.log(`Total posts: ${blogPosts.length}`);

let postsWithImages = 0;
let postsWithoutImages = 0;
let postsUpdated = 0;

// Process each post
blogPosts.forEach((post, index) => {
  if (post.images && post.images.length > 0) {
    postsWithImages++;
  } else {
    postsWithoutImages++;
    
    // Add placeholder image data for posts without images
    const imageFilename = `${post.slug}-placeholder.jpg`;
    const imageUrl = `/generated-images/${imageFilename}`;
    
    post.image = imageUrl;
    post.images = [{
      url: imageUrl,
      alt: `${post.title} - Featured Image`,
      title: post.title,
      caption: `Illustration for ${post.title}`,
      width: 1200,
      height: 675,
      format: 'jpg'
    }];
    
    // Add image prompts for future generation
    post.imagePrompts = [
      `Professional tech illustration for "${post.title}" featuring ${post.keywords.slice(0, 3).join(', ')}, modern digital design, clean and minimalist style`,
      `Conceptual illustration showing ${post.keywords[0]} technology, abstract tech elements, blue and purple gradient background`
    ];
    
    post.lastModified = new Date().toISOString();
    postsUpdated++;
  }
});

console.log(`Posts with images: ${postsWithImages}`);
console.log(`Posts without images: ${postsWithoutImages}`);
console.log(`Posts updated: ${postsUpdated}`);

if (postsUpdated > 0) {
  // Create backup
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `./backups/blog-posts-${timestamp}.json`;
  
  // Ensure backup directory exists
  if (!fs.existsSync('./backups')) {
    fs.mkdirSync('./backups', { recursive: true });
  }
  
  // Create backup
  fs.writeFileSync(backupPath, fs.readFileSync('./blog-posts.json', 'utf-8'));
  console.log(`Backup created: ${backupPath}`);
  
  // Save updated posts
  fs.writeFileSync('./blog-posts.json', JSON.stringify(blogPosts, null, 2));
  console.log(`Updated ${postsUpdated} posts with placeholder image data`);
  console.log('Note: Actual images will be generated when the server starts with proper API keys');
} else {
  console.log('All posts already have images!');
}