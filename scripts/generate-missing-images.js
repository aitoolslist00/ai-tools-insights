/**
 * Script to generate missing images for existing blog posts
 * Run this script to add images to articles that don't have them
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

async function generateMissingImages() {
  try {
    console.log('🖼️  Starting bulk image generation for existing articles...')
    
    const response = await fetch(`${API_BASE_URL}/api/blog/generate-missing-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add your auth token here if needed
        // 'Authorization': 'Bearer your-token-here'
      },
      body: JSON.stringify({
        generateForAll: true // Generate for all posts missing images
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
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
if (require.main === module) {
  generateMissingImages()
}

module.exports = { generateMissingImages }