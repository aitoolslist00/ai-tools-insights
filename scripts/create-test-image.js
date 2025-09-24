const fs = require('fs');
const path = require('path');

function createTestImage() {
  console.log('🎨 Creating a proper test image...');
  
  // Create a simple 100x100 PNG image with a colored background
  // This is a minimal valid PNG file
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A // PNG signature
  ]);
  
  // IHDR chunk for 100x100 image, 8-bit RGB
  const ihdrData = Buffer.from([
    0x00, 0x00, 0x00, 0x64, // width: 100
    0x00, 0x00, 0x00, 0x64, // height: 100
    0x08, // bit depth: 8
    0x02, // color type: RGB
    0x00, // compression: deflate
    0x00, // filter: adaptive
    0x00  // interlace: none
  ]);
  
  // Calculate CRC for IHDR
  const crc32 = require('zlib').crc32;
  const ihdrType = Buffer.from('IHDR');
  const ihdrCrc = crc32(Buffer.concat([ihdrType, ihdrData]));
  
  const ihdrChunk = Buffer.concat([
    Buffer.from([0x00, 0x00, 0x00, 0x0D]), // length: 13
    ihdrType,
    ihdrData,
    Buffer.from([
      (ihdrCrc >>> 24) & 0xFF,
      (ihdrCrc >>> 16) & 0xFF,
      (ihdrCrc >>> 8) & 0xFF,
      ihdrCrc & 0xFF
    ])
  ]);
  
  // Simple IDAT chunk with minimal compressed data for a solid color
  const idatData = Buffer.from([
    0x78, 0x9C, 0xED, 0xC1, 0x01, 0x01, 0x00, 0x00, 0x00, 0x80, 0x90, 0xFE,
    0x37, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ]);
  
  const idatType = Buffer.from('IDAT');
  const idatCrc = crc32(Buffer.concat([idatType, idatData]));
  
  const idatChunk = Buffer.concat([
    Buffer.from([0x00, 0x00, 0x00, idatData.length]), // length
    idatType,
    idatData,
    Buffer.from([
      (idatCrc >>> 24) & 0xFF,
      (idatCrc >>> 16) & 0xFF,
      (idatCrc >>> 8) & 0xFF,
      idatCrc & 0xFF
    ])
  ]);
  
  // IEND chunk
  const iendChunk = Buffer.from([
    0x00, 0x00, 0x00, 0x00, // length: 0
    0x49, 0x45, 0x4E, 0x44, // "IEND"
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);
  
  // Combine all chunks
  const pngBuffer = Buffer.concat([
    pngHeader,
    ihdrChunk,
    idatChunk,
    iendChunk
  ]);
  
  // Save the test image
  const testImagePath = 'F:/my work/programming/vercel/ai-tools-list/public/uploads/test-blog-image.png';
  fs.writeFileSync(testImagePath, pngBuffer);
  
  console.log(`✅ Created test image: ${testImagePath}`);
  console.log(`📏 Image size: ${pngBuffer.length} bytes`);
  
  return testImagePath;
}

// Also create a simple debugging script for the editor
function createEditorDebugScript() {
  const debugScript = `
// Add this to your browser console when testing the blog editor
// to debug image upload issues

console.log('🔍 Blog Editor Image Upload Debugger');

// Monitor image state changes
const originalSetImage = window.setImage;
if (typeof originalSetImage === 'function') {
  window.setImage = function(url) {
    console.log('📸 Image URL set to:', url);
    return originalSetImage(url);
  };
}

// Monitor form submissions
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.addEventListener('submit', (e) => {
    console.log('📝 Form submitted');
    const formData = new FormData(form);
    for (let [key, value] of formData.entries()) {
      if (key.includes('image') || key === 'image') {
        console.log('🖼️ Image field in form:', key, value);
      }
    }
  });
});

// Monitor fetch requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const url = args[0];
  if (typeof url === 'string' && (url.includes('/api/upload') || url.includes('/api/blog'))) {
    console.log('🌐 API Request:', url);
    if (args[1] && args[1].body) {
      console.log('📦 Request body type:', typeof args[1].body);
      if (args[1].body instanceof FormData) {
        console.log('📋 FormData entries:');
        for (let [key, value] of args[1].body.entries()) {
          console.log('  -', key, typeof value === 'object' ? value.constructor.name : value);
        }
      }
    }
  }
  
  return originalFetch.apply(this, args).then(response => {
    if (typeof url === 'string' && (url.includes('/api/upload') || url.includes('/api/blog'))) {
      console.log('📨 API Response:', response.status, response.statusText);
      if (url.includes('/api/upload')) {
        response.clone().json().then(data => {
          console.log('📸 Upload response:', data);
        }).catch(() => {});
      }
    }
    return response;
  });
};

console.log('✅ Debug monitoring active. Upload an image to see debug info.');
`;

  const debugPath = 'F:/my work/programming/vercel/ai-tools-list/debug-image-upload.js';
  fs.writeFileSync(debugPath, debugScript);
  console.log(`🐛 Created debug script: ${debugPath}`);
  console.log('📋 Copy and paste the contents into your browser console when testing');
}

try {
  createTestImage();
  createEditorDebugScript();
} catch (error) {
  console.error('❌ Error creating test files:', error);
}