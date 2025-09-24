const fs = require('fs');
const path = require('path');

// Test upload API
async function testUpload() {
  try {
    console.log('Testing upload API...');
    
    // Create a simple test image file
    const testImagePath = path.join(__dirname, 'test-image.png');
    
    // Create a minimal PNG file (1x1 pixel transparent PNG)
    const pngData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
      0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    
    fs.writeFileSync(testImagePath, pngData);
    console.log('Created test image:', testImagePath);
    
    // Create FormData
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', fs.createReadStream(testImagePath), {
      filename: 'test-image.png',
      contentType: 'image/png'
    });
    
    // Make request to upload API using dynamic import
    const { default: fetch } = await import('node-fetch');
    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });
    
    const result = await response.json();
    console.log('Upload response:', result);
    
    if (result.success) {
      console.log('✅ Upload successful!');
      console.log('Image URL:', result.imageUrl);
      
      // Test if the uploaded file can be accessed
      const imageResponse = await fetch(`http://localhost:3000${result.imageUrl}`);
      console.log('Image access status:', imageResponse.status);
      
      if (imageResponse.ok) {
        console.log('✅ Uploaded image is accessible!');
      } else {
        console.log('❌ Uploaded image is not accessible');
      }
    } else {
      console.log('❌ Upload failed:', result.error);
    }
    
    // Clean up test file
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
      console.log('Cleaned up test image');
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

// Wait for server to start
setTimeout(testUpload, 8000);