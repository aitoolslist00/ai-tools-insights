const fs = require('fs');

// Load the blog posts
const blogPosts = JSON.parse(fs.readFileSync('blog-posts.json', 'utf8'));

// Find a post that should have images
const postWithImages = blogPosts.find(post => 
  post.images && 
  post.images.length > 0 && 
  post.published
);

if (postWithImages) {
  console.log('Found post with images:');
  console.log('Title:', postWithImages.title);
  console.log('Slug:', postWithImages.slug || postWithImages.id);
  console.log('Featured Image:', postWithImages.image);
  console.log('Number of images:', postWithImages.images.length);
  console.log('First image URL:', postWithImages.images[0].url);
  console.log('First image alt:', postWithImages.images[0].alt);
  
  // Check if the image file exists
  const imagePath = `public${postWithImages.images[0].url}`;
  if (fs.existsSync(imagePath)) {
    console.log('✅ Image file exists at:', imagePath);
  } else {
    console.log('❌ Image file NOT found at:', imagePath);
  }
  
  console.log('\nURL to test: http://localhost:3000/blog/' + (postWithImages.slug || postWithImages.id));
} else {
  console.log('No published posts with images found');
}

// Check if there's a post with "rank" in the title or slug
const rankPost = blogPosts.find(post => 
  (post.title && post.title.toLowerCase().includes('rank')) ||
  (post.slug && post.slug.toLowerCase().includes('rank')) ||
  (post.id && post.id.toLowerCase().includes('rank'))
);

if (rankPost) {
  console.log('\nFound post with "rank":');
  console.log('Title:', rankPost.title);
  console.log('Slug:', rankPost.slug || rankPost.id);
  console.log('Has images:', !!rankPost.images);
} else {
  console.log('\nNo post found with "rank" in title/slug/id');
}