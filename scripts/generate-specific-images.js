const fs = require('fs');
const path = require('path');

// Articles that need images generated
const articlesToProcess = [
  'free-ai-tools-list',
  'ai-study-tools', 
  'zerogpt',
  'uncensored-ai-tools',
  'turbo-ai-definitive-guide-2025'
];

async function generateImagesForArticles() {
  console.log('🖼️ Starting image generation for specific articles...\n');
  
  // Read the blog posts JSON file
  const blogPostsPath = 'f:\\my work\\programming\\vercel\\ai-tools-list\\blog-posts.json';
  const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));
  
  for (const slug of articlesToProcess) {
    console.log(`📝 Processing article: ${slug}`);
    
    // Find the article in the blog posts
    const article = blogPosts.find(post => post.slug === slug);
    
    if (!article) {
      console.log(`❌ Article not found: ${slug}`);
      continue;
    }
    
    if (!article.imagePrompts || article.imagePrompts.length === 0) {
      console.log(`⚠️  No imagePrompts found for: ${slug}`);
      continue;
    }
    
    console.log(`   Found ${article.imagePrompts.length} imagePrompts`);
    
    try {
      // Call the enhanced SEO generator API to generate images
      const response = await fetch('http://localhost:3000/api/blog/enhanced-seo-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-key' // Add a test auth header
        },
        body: JSON.stringify({
          keyword: slug.replace(/-/g, ' '),
          workflow: 'enhanced',
          apiKey: process.env.GEMINI_API_KEY || 'test-key',
          regenerateImages: true
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Successfully processed ${slug}`);
        console.log(`   - Generated ${result.images?.length || 0} images`);
      } else {
        console.error(`❌ Failed to process ${slug}: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error(`   Error: ${errorText}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${slug}:`, error.message);
    }
    
    // Wait 3 seconds between requests to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log('\n🎉 Finished processing all articles!');
}

// Alternative approach: Direct image generation using Unsplash
async function generateImagesDirectly() {
  console.log('🖼️ Generating images directly using Unsplash...\n');
  
  const { RealImageGenerator } = require('../lib/real-image-generator.ts');
  
  for (const slug of articlesToProcess) {
    console.log(`📝 Processing article: ${slug}`);
    
    try {
      const keyword = slug.replace(/-/g, ' ');
      const imageGenerator = new RealImageGenerator();
      
      // Generate 5 images for each article
      const images = await imageGenerator.generateImages([
        `${keyword} professional illustration`,
        `${keyword} infographic design`,
        `${keyword} interface mockup`,
        `${keyword} workflow diagram`,
        `${keyword} comparison chart`
      ], {
        keyword: keyword,
        style: 'tech',
        aspectRatio: '16:9',
        quality: 'high'
      });
      
      console.log(`✅ Generated ${images.length} images for ${slug}`);
      
    } catch (error) {
      console.error(`❌ Error generating images for ${slug}:`, error.message);
    }
    
    // Wait 2 seconds between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🎉 Finished generating all images!');
}

// Run the script
if (require.main === module) {
  // Try the API approach first, fall back to direct generation
  generateImagesForArticles().catch(() => {
    console.log('\n🔄 API approach failed, trying direct generation...');
    generateImagesDirectly().catch(console.error);
  });
}

module.exports = { generateImagesForArticles, generateImagesDirectly };