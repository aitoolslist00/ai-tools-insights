const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('./blog-posts.json', 'utf8'));
  console.log('Total posts:', data.length);
  
  // Search for guinrank or related
  console.log('\n=== Searching for GuinRank/SEO Content Optimization ===');
  const guinrankPosts = data.filter(p => 
    p.title && (
      p.title.toLowerCase().includes('guinrank') || 
      p.title.toLowerCase().includes('seo content optimization') ||
      (p.slug && p.slug.includes('guinrank'))
    )
  );
  
  if (guinrankPosts.length > 0) {
    guinrankPosts.forEach(post => {
      console.log('\nPost found:');
      console.log('Title:', post.title);
      console.log('Slug:', post.slug);
      console.log('Image:', post.image);
      console.log('Images array:', JSON.stringify(post.images, null, 2));
    });
  } else {
    console.log('No GuinRank posts found');
  }
  
  // Search for ai-news
  console.log('\n=== Searching for AI News article ===');
  const aiNewsPost = data.find(p => p.slug === 'ai-news-latest-innovations-trends-applications');
  
  if (aiNewsPost) {
    console.log('\nPost found:');
    console.log('Title:', aiNewsPost.title);
    console.log('Slug:', aiNewsPost.slug);
    console.log('Image:', aiNewsPost.image);
    console.log('Images array:', JSON.stringify(aiNewsPost.images, null, 2));
  } else {
    console.log('AI News post not found');
  }
  
} catch (error) {
  console.error('Error:', error.message);
}
