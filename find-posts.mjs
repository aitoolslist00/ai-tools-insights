import fs from 'fs';

async function findPosts() {
  try {
    console.log('Reading blog-posts.json...');
    const content = fs.readFileSync('./blog-posts.json', 'utf-8');
    const posts = JSON.parse(content);
    
    console.log(`\nTotal posts: ${posts.length}\n`);
    
    // Find GuinRank post
    console.log('=== Looking for GuinRank post ===');
    const guinrankPost = posts.find(p => 
      p.slug && (
        p.slug.includes('guinrank') || 
        p.slug.includes('seo-content-optimization')
      )
    );
    
    if (guinrankPost) {
      console.log('Found GuinRank post:');
      console.log('  ID:', guinrankPost.id);
      console.log('  Title:', guinrankPost.title);
      console.log('  Slug:', guinrankPost.slug);
      console.log('  Image:', guinrankPost.image);
      console.log('  Images array length:', guinrankPost.images ? guinrankPost.images.length : 0);
      if (guinrankPost.images && guinrankPost.images.length > 0) {
        console.log('  First image:', JSON.stringify(guinrankPost.images[0], null, 4));
      }
    } else {
      console.log('GuinRank post NOT FOUND');
    }
    
    // Find AI News post
    console.log('\n=== Looking for AI News post ===');
    const aiNewsPost = posts.find(p => p.slug === 'ai-news-latest-innovations-trends-applications');
    
    if (aiNewsPost) {
      console.log('Found AI News post:');
      console.log('  ID:', aiNewsPost.id);
      console.log('  Title:', aiNewsPost.title);
      console.log('  Slug:', aiNewsPost.slug);
      console.log('  Image:', aiNewsPost.image);
      console.log('  Images array length:', aiNewsPost.images ? aiNewsPost.images.length : 0);
      if (aiNewsPost.images && aiNewsPost.images.length > 0) {
        console.log('  First image:', JSON.stringify(aiNewsPost.images[0], null, 4));
      }
    } else {
      console.log('AI News post NOT FOUND');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

findPosts();
