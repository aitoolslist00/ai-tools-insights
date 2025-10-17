// Load environment variables
require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const https = require('https');

// Simple image downloader function
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Function to search Unsplash for images
async function searchUnsplashImage(query) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    throw new Error('UNSPLASH_ACCESS_KEY not found in environment variables');
  }

  const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
  
  return new Promise((resolve, reject) => {
    https.get(searchUrl, {
      headers: {
        'Authorization': `Client-ID ${accessKey}`,
        'Accept-Version': 'v1'
      }
    }, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.results && result.results.length > 0) {
            resolve(result.results[0]);
          } else {
            reject(new Error('No images found'));
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

async function generateImagesForPosts() {
  try {
    console.log('Loading blog posts...');
    const blogPosts = JSON.parse(fs.readFileSync('./blog-posts.json', 'utf-8'));
    
    // Ensure generated-images directory exists
    const imagesDir = './public/generated-images';
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    console.log(`Processing ${blogPosts.length} posts...`);
    
    let processed = 0;
    let successful = 0;
    let failed = 0;
    
    for (const post of blogPosts.slice(0, 5)) { // Process first 5 posts as a test
      processed++;
      console.log(`\nProcessing ${processed}/5: ${post.title}`);
      
      try {
        // Create search query from keywords
        const searchQuery = post.keywords.slice(0, 2).join(' ') + ' technology';
        console.log(`  Searching for: ${searchQuery}`);
        
        // Search for image
        const unsplashImage = await searchUnsplashImage(searchQuery);
        
        // Download image
        const filename = `${post.slug}-${Date.now()}.jpg`;
        const filepath = path.join(imagesDir, filename);
        
        console.log(`  Downloading: ${unsplashImage.urls.regular}`);
        await downloadImage(unsplashImage.urls.regular, filepath);
        
        // Update post with real image data
        const imageUrl = `/generated-images/${filename}`;
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
        
        post.lastModified = new Date().toISOString();
        successful++;
        console.log(`  ✓ Successfully generated image: ${filename}`);
        
        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`  ✗ Failed to generate image: ${error.message}`);
        failed++;
      }
    }
    
    if (successful > 0) {
      // Create backup
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = `./backups/blog-posts-${timestamp}.json`;
      
      if (!fs.existsSync('./backups')) {
        fs.mkdirSync('./backups', { recursive: true });
      }
      
      fs.writeFileSync(backupPath, fs.readFileSync('./blog-posts.json', 'utf-8'));
      console.log(`\nBackup created: ${backupPath}`);
      
      // Save updated posts
      fs.writeFileSync('./blog-posts.json', JSON.stringify(blogPosts, null, 2));
      console.log(`\n✓ Updated ${successful} posts with real images`);
    }
    
    console.log(`\n=== SUMMARY ===`);
    console.log(`Posts processed: ${processed}`);
    console.log(`Successfully updated: ${successful}`);
    console.log(`Failed: ${failed}`);
    
  } catch (error) {
    console.error('Error generating images:', error);
  }
}

// Run the script
generateImagesForPosts();