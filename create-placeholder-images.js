const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createPlaceholderImages() {
  // Ensure generated-images directory exists
  const imagesDir = path.join(__dirname, 'public', 'generated-images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // Create placeholder images for AI Tools 2025 Trends
  const images = [
    {
      filename: 'ai-tools-2025-trends-1.jpg',
      title: 'AI Tools 2025 Trends',
      colors: ['#3B82F6', '#8B5CF6'] // Blue to Purple
    },
    {
      filename: 'ai-tools-2025-trends-2.jpg',
      title: 'No-Code AI Platforms',
      colors: ['#10B981', '#3B82F6'] // Green to Blue
    },
    {
      filename: 'ai-tools-2025-trends-3.jpg',
      title: 'Generative AI Innovation',
      colors: ['#F59E0B', '#EF4444'] // Orange to Red
    }
  ];

  for (const img of images) {
    try {
      console.log(`Creating ${img.filename}...`);
      
      // Create SVG gradient
      const svg = `
        <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:${img.colors[0]};stop-opacity:1" />
              <stop offset="100%" style="stop-color:${img.colors[1]};stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad)" />
          <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
                text-anchor="middle" dominant-baseline="middle" fill="white" opacity="0.9">
            ${img.title}
          </text>
        </svg>
      `;
      
      const imagePath = path.join(imagesDir, img.filename);
      
      // Convert SVG to JPEG
      await sharp(Buffer.from(svg))
        .jpeg({ quality: 85 })
        .toFile(imagePath);
        
      // Generate WebP version
      const webpPath = imagePath.replace('.jpg', '.webp');
      await sharp(Buffer.from(svg))
        .webp({ quality: 85 })
        .toFile(webpPath);
        
      // Generate thumbnail
      const thumbPath = imagePath.replace('.jpg', '-thumb.jpg');
      await sharp(Buffer.from(svg))
        .resize(400, 225)
        .jpeg({ quality: 80 })
        .toFile(thumbPath);
        
      console.log(`✅ Created ${img.filename}`);
      
    } catch (error) {
      console.error(`❌ Failed to create ${img.filename}:`, error);
    }
  }
  
  console.log('🎉 Placeholder images created successfully!');
}

createPlaceholderImages();