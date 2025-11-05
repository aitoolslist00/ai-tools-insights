const fs = require('fs');

// Import the content formatter functions
const { formatContent } = require('./lib/content-formatter.ts');

// Load a blog post with images
const blogPosts = JSON.parse(fs.readFileSync('blog-posts.json', 'utf8'));
const postWithImages = blogPosts.find(post => 
  post.images && 
  post.images.length > 0 && 
  post.published &&
  post.slug === 'ai-tools-2025-trends'
);

if (postWithImages) {
  console.log('=== BLOG POST DEBUG ===');
  console.log('Title:', postWithImages.title);
  console.log('Has images:', !!postWithImages.images);
  console.log('Image count:', postWithImages.images.length);
  console.log('Featured image:', postWithImages.image);
  console.log('First image URL:', postWithImages.images[0].url);
  
  // Test the content formatting
  console.log('\n=== CONTENT FORMATTING TEST ===');
  const formattedContent = formatContent(postWithImages.content, postWithImages);
  
  // Check if images are in the formatted content
  const hasImageTags = formattedContent.includes('<img');
  console.log('Formatted content has <img> tags:', hasImageTags);
  
  if (hasImageTags) {
    const imageMatches = formattedContent.match(/<img[^>]*>/g);
    console.log('Number of <img> tags found:', imageMatches ? imageMatches.length : 0);
    if (imageMatches) {
      console.log('First image tag:', imageMatches[0]);
    }
  }
  
  // Check if the image path exists
  const imagePath = `public${postWithImages.images[0].url}`;
  console.log('\n=== FILE SYSTEM CHECK ===');
  console.log('Checking path:', imagePath);
  console.log('File exists:', fs.existsSync(imagePath));
  
  // Write the formatted content to a file for inspection
  fs.writeFileSync('debug-formatted-content.html', `
<!DOCTYPE html>
<html>
<head>
    <title>Debug Content</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        img { max-width: 100%; height: auto; border: 2px solid red; }
    </style>
</head>
<body>
    <h1>Debug: Formatted Content</h1>
    ${formattedContent}
</body>
</html>
  `);
  
  console.log('\n=== DEBUG FILE CREATED ===');
  console.log('Created debug-formatted-content.html for inspection');
  
} else {
  console.log('No blog post found with images');
}