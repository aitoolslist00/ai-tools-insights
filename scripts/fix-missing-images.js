const fs = require('fs');
const path = require('path');

// Articles that need image fixes
const articlesToFix = [
  'free-ai-tools-list',
  'ai-study-tools', 
  'zerogpt',
  'uncensored-ai-tools',
  'turbo-ai-definitive-guide-2025'
];

async function fixMissingImages() {
  console.log('🔧 Starting to fix missing images for articles...');
  
  for (const slug of articlesToFix) {
    console.log(`\n📝 Processing article: ${slug}`);
    
    try {
      // Call the enhanced SEO generator API to regenerate images
      const response = await fetch('http://localhost:3000/api/blog/enhanced-seo-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: slug.replace(/-/g, ' '),
          workflow: 'enhanced', // This will trigger image generation
          regenerateImages: true
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Successfully processed ${slug}`);
        console.log(`   - Generated ${result.images?.length || 0} images`);
      } else {
        console.error(`❌ Failed to process ${slug}: ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${slug}:`, error.message);
    }
    
    // Wait 2 seconds between requests to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🎉 Finished processing all articles!');
}

// Run the fix
fixMissingImages().catch(console.error);