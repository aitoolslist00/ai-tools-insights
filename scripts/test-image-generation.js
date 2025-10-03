/**
 * Test script to generate images for existing blog posts
 * Uses Basic authentication
 */

const API_BASE_URL = 'http://localhost:3000'

// Default credentials (change these if needed)
const USERNAME = 'ahmedibrahim'
const PASSWORD = 'ahmedibrahim'

async function testImageGeneration() {
  try {
    console.log('🖼️  Testing image generation for existing articles...')
    
    // Create Basic auth header
    const credentials = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64')
    const authHeader = `Basic ${credentials}`
    
    console.log('🔐 Using Basic authentication...')
    
    const response = await fetch(`${API_BASE_URL}/api/blog/generate-missing-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        generateForAll: true // Generate for all posts missing images
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const result = await response.json()
    
    console.log('\n✅ Image generation completed!')
    console.log(`📊 Results:`)
    console.log(`   • Posts processed: ${result.processed}`)
    console.log(`   • Successful: ${result.successful}`)
    console.log(`   • Failed: ${result.failed}`)
    
    if (result.results && result.results.length > 0) {
      console.log('\n📝 Detailed results:')
      result.results.forEach((item, index) => {
        const status = item.success ? '✅' : '❌'
        const details = item.success 
          ? `(${item.imagesGenerated} images generated)`
          : `(${item.error})`
        
        console.log(`   ${index + 1}. ${status} ${item.title} ${details}`)
      })
    }
    
    console.log(`\n${result.message}`)
    
  } catch (error) {
    console.error('❌ Error generating images:', error.message)
    process.exit(1)
  }
}

// Run the script
testImageGeneration()