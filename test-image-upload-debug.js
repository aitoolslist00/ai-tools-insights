// Test image upload functionality
const fs = require('fs').promises
const path = require('path')

async function testImageUpload() {
  console.log('🧪 Testing Image Upload System...\n')

  // Check upload directory
  const uploadDir = path.resolve(process.cwd(), 'public', 'uploads')
  console.log('📁 Upload directory:', uploadDir)
  
  try {
    const stats = await fs.stat(uploadDir)
    console.log('✅ Upload directory exists:', stats.isDirectory())
  } catch (error) {
    console.log('❌ Upload directory not found:', error.message)
    
    // Try to create it
    try {
      await fs.mkdir(uploadDir, { recursive: true })
      console.log('✅ Created upload directory')
    } catch (createError) {
      console.log('❌ Failed to create upload directory:', createError.message)
    }
  }

  // Check directory permissions
  try {
    const testFile = path.join(uploadDir, 'test-permission.txt')
    await fs.writeFile(testFile, 'test')
    await fs.unlink(testFile)
    console.log('✅ Directory is writable')
  } catch (error) {
    console.log('❌ Directory permission issue:', error.message)
  }

  // Check existing uploads
  try {
    const files = await fs.readdir(uploadDir)
    console.log(`📸 Found ${files.length} existing uploads:`, files.slice(0, 5))
  } catch (error) {
    console.log('❌ Cannot read upload directory:', error.message)
  }

  // Check image upload adapter
  console.log('\n🔧 Upload Adapter Configuration:')
  console.log('NODE_ENV:', process.env.NODE_ENV || 'development')
  console.log('VERCEL:', process.env.VERCEL || 'not set')
  console.log('UPLOAD_PROVIDER:', process.env.UPLOAD_PROVIDER || 'auto-detect (local)')
  console.log('BLOB_READ_WRITE_TOKEN:', process.env.BLOB_READ_WRITE_TOKEN ? 'configured' : 'not configured')

  console.log('\n✅ Test completed!')
}

testImageUpload().catch(console.error)