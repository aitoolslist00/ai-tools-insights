require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const https = require('https');

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

function searchUnsplashImage(query) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    throw new Error('UNSPLASH_ACCESS_KEY not found in .env.local');
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

async function fixPlaceholderImages() {
  try {
    console.log('Loading blog posts...');
    const blogPosts = JSON.parse(fs.readFileSync('./blog-posts.json', 'utf-8'));
    
    const imagesDir = './public/generated-images';
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    const postsWithPlaceholders = blogPosts.filter(post => 
      post.image && post.image.includes('placeholder')
    );
    
    console.log(`Found ${postsWithPlaceholders.length} posts with placeholder images\n`);
    
    if (postsWithPlaceholders.length === 0) {
      console.log('No posts with placeholder images found!');
      return;
    }
    
    let successful = 0;
    let failed = 0;
    
    for (let i = 0; i < postsWithPlaceholders.length; i++) {
      const post = postsWithPlaceholders[i];
      console.log(`Processing ${i + 1}/${postsWithPlaceholders.length}: ${post.title}`);
      
      try {
        const searchQuery = (post.keywords && post.keywords.length > 0) 
          ? post.keywords.slice(0, 2).join(' ') + ' technology'
          : post.title.substring(0, 50);
        
        console.log(`  Searching for: ${searchQuery}`);
        
        const unsplashImage = await searchUnsplashImage(searchQuery);
        
        const timestamp = Date.now();
        const filename = `${post.slug}-${timestamp}.jpg`;
        const filepath = path.join(imagesDir, filename);
        
        console.log(`  Downloading from Unsplash...`);
        await downloadImage(unsplashImage.urls.regular, filepath);
        
        const imageUrl = `/generated-images/${filename}`;
        post.image = imageUrl;
        
        post.images = [{
          filename: filename,
          path: filepath,
          url: imageUrl,
          alt: `${post.title.replace(/^#+\s*/, '')} - Featured Image`,
          title: post.title.replace(/^#+\s*/, ''),
          caption: `Illustration for ${post.title.replace(/^#+\s*/, '')}`,
          width: 1200,
          height: 675,
          format: 'jpg',
          metadata: {
            keyword: post.keywords ? post.keywords[0] : post.title,
            style: 'tech',
            generatedAt: new Date().toISOString(),
            optimized: true,
            source: 'unsplash',
            unsplashId: unsplashImage.id,
            photographer: unsplashImage.user.name,
            photographerUrl: unsplashImage.user.links.html
          }
        }];
        
        post.lastModified = new Date().toISOString();
        successful++;
        console.log(`  ✓ Successfully generated image: ${filename}\n`);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
      } catch (error) {
        console.error(`  ✗ Failed: ${error.message}\n`);
        failed++;
      }
    }
    
    if (successful > 0) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = `./backups/blog-posts-${timestamp}.json`;
      
      if (!fs.existsSync('./backups')) {
        fs.mkdirSync('./backups', { recursive: true });
      }
      
      fs.writeFileSync(backupPath, fs.readFileSync('./blog-posts.json', 'utf-8'));
      console.log(`\nBackup created: ${backupPath}`);
      
      fs.writeFileSync('./blog-posts.json', JSON.stringify(blogPosts, null, 2));
      console.log(`\n✓ Updated ${successful} posts with real images`);
    }
    
    console.log(`\n=== SUMMARY ===`);
    console.log(`Posts with placeholders: ${postsWithPlaceholders.length}`);
    console.log(`Successfully updated: ${successful}`);
    console.log(`Failed: ${failed}`);
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixPlaceholderImages();
