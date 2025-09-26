// Test both blog post loading and image upload functionality
const fs = require('fs')

async function testBlogFixes() {
  console.log('🧪 Testing Blog Fixes...\n')

  // 1. Test Blog Post Data Fix
  console.log('📝 Testing Blog Post Data...')
  
  try {
    const blogData = JSON.parse(fs.readFileSync('./blog-posts.json', 'utf8'))
    const problematicPost = blogData.find(post => 
      post.id.includes('ai-tools-2025-trends-the-complete-guide-to-the-fut-1758804117635')
    )
    
    if (problematicPost) {
      console.log('✅ Found the blog post')
      console.log('ID:', problematicPost.id)
      console.log('HREF:', problematicPost.href)
      
      // Check if ID matches href
      const expectedHref = `/blog/${problematicPost.id}`
      if (problematicPost.href === expectedHref) {
        console.log('✅ ID and HREF match perfectly!')
      } else {
        console.log('❌ ID and HREF mismatch:')
        console.log('  Expected:', expectedHref)
        console.log('  Actual:  ', problematicPost.href)
      }
    } else {
      console.log('❌ Could not find the problematic post')
    }
  } catch (error) {
    console.log('❌ Error reading blog data:', error.message)
  }

  // 2. Test Blog Post URL Generation
  console.log('\n🌐 Testing URL Generation...')
  
  // Wait for server to be ready
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  const testUrl = 'http://localhost:3000/blog/ai-tools-2025-trends-the-complete-guide-to-the-fut-1758804117635'
  console.log('Testing URL:', testUrl)
  
  try {
    const response = await fetch(testUrl)
    console.log('Status:', response.status)
    
    if (response.status === 200) {
      console.log('✅ Blog post loads successfully!')
    } else if (response.status === 404) {
      console.log('❌ Still getting 404 - may need more investigation')
    } else {
      console.log('⚠️ Unexpected status:', response.status)
    }
  } catch (error) {
    console.log('❌ Network error:', error.message)
    console.log('ℹ️ Make sure the development server is running')
  }

  // 3. Test Image Upload API
  console.log('\n📸 Testing Image Upload API...')
  
  try {
    // First check if we have an auth token
    const authResponse = await fetch('http://localhost:3000/api/blog/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: 'admin', 
        password: process.env.BLOG_ADMIN_PASSWORD || 'your-secure-password-2024!'
      })
    })
    
    if (authResponse.ok) {
      const authData = await authResponse.json()
      console.log('✅ Authentication successful')
      
      // Create a simple test image (1x1 PNG)
      const testImageBuffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGA6dx3JQAAAABJRU5ErkJggg==', 
        'base64'
      )
      
      const formData = new FormData()
      const blob = new Blob([testImageBuffer], { type: 'image/png' })
      formData.append('file', blob, 'test-upload.png')
      
      const uploadResponse = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authData.token}`
        },
        body: formData
      })
      
      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json()
        console.log('✅ Image upload successful!')
        console.log('Image URL:', uploadResult.imageUrl)
      } else {
        const errorText = await uploadResponse.text()
        console.log('❌ Image upload failed:', uploadResponse.status, errorText)
      }
    } else {
      console.log('❌ Authentication failed - check password')
    }
  } catch (error) {
    console.log('❌ Upload test error:', error.message)
  }

  console.log('\n✅ Test completed!')
}

testBlogFixes().catch(console.error)