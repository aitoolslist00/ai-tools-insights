// Test script to create a new article and verify image generation
const https = require('https');

// Test data for a new article
const testArticle = {
  keyword: "AI automation tools 2025",
  category: "ai-tools",
  apiKey: process.env.GEMINI_API_KEY || "AIzaSyBkPz3R-I8SvUAsbMDksx4U_AedtmAiPcE",
  workflow: "complete"
};

function makeRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          resolve({ raw: data, status: res.statusCode });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testNewArticle() {
  try {
    console.log('Testing new article creation with image generation...');
    console.log('Keyword:', testArticle.keyword);
    
    // Step 1: Generate content with images
    console.log('\n1. Generating content with enhanced SEO generator...');
    const contentResult = await makeRequest('/api/blog/enhanced-seo-generator', 'POST', testArticle);
    
    if (contentResult.success) {
      console.log('✓ Content generated successfully');
      console.log('✓ Images generated:', contentResult.imagesGenerated || 0);
      
      if (contentResult.content) {
        // Step 2: Publish the article
        console.log('\n2. Publishing article...');
        const publishData = {
          content: contentResult.content,
          images: contentResult.content.images,
          autoPublish: true,
          featured: false,
          category: 'ai-tools'
        };
        
        const publishResult = await makeRequest('/api/blog/smart-publish', 'POST', publishData);
        
        if (publishResult.success) {
          console.log('✓ Article published successfully');
          console.log('✓ Article URL:', publishResult.url);
          console.log('✓ SEO Score:', publishResult.seoScore);
          
          // Check if images were included
          if (publishResult.post && publishResult.post.images) {
            console.log('✓ Images included in published article:', publishResult.post.images.length);
            publishResult.post.images.forEach((img, i) => {
              console.log(`  Image ${i + 1}: ${img.url}`);
            });
          } else {
            console.log('⚠ No images found in published article');
          }
        } else {
          console.log('✗ Failed to publish article:', publishResult.error);
        }
      }
    } else {
      console.log('✗ Failed to generate content:', contentResult.error);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Load environment variables and run test
require('dotenv').config({ path: '.env.local' });
testNewArticle();