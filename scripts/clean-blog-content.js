const fs = require('fs')
const path = require('path')

// Function to clean blog post content
function cleanBlogContent(content) {
  return content
    // Remove problematic formatting words at the beginning of lines
    .replace(/^(Additionally,|Nevertheless,)\s+/gm, '')
    // Clean up malformed headers
    .replace(/^(Additionally,|Nevertheless,)\s*##\s*/gm, '## ')
    // Remove citation numbers like [1], [14], etc.
    .replace(/\s*\[\d+(?:,\s*\d+)*\]/g, '')
    // Clean up extra whitespace and line breaks
    .replace(/\s*\n\s*\n\s*/g, '\n\n')
    // Remove extra spaces
    .replace(/\s+/g, ' ')
    // Fix paragraph breaks
    .replace(/\.\s*\n\n/g, '.\n\n')
    .trim()
}

// Main function to clean all blog posts
function cleanAllBlogContent() {
  const blogPostsPath = path.join(__dirname, '..', 'blog-posts.json')
  
  try {
    // Read current blog posts
    const blogPostsData = fs.readFileSync(blogPostsPath, 'utf8')
    const blogPosts = JSON.parse(blogPostsData)
    
    console.log(`Found ${blogPosts.length} blog posts to clean...`)
    
    // Clean each blog post content
    const cleanedPosts = blogPosts.map((post, index) => {
      console.log(`Cleaning content for post ${index + 1}: ${post.title}`)
      
      const cleanedPost = { ...post }
      
      // Clean the main content
      if (cleanedPost.content) {
        const originalLength = cleanedPost.content.length
        cleanedPost.content = cleanBlogContent(cleanedPost.content)
        const newLength = cleanedPost.content.length
        
        if (originalLength !== newLength) {
          console.log(`  📝 Content cleaned: ${originalLength} → ${newLength} characters`)
        }
      }
      
      return cleanedPost
    })
    
    // Create backup
    const backupPath = path.join(__dirname, '..', 'backups', `blog-posts-content-clean-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
    fs.writeFileSync(backupPath, JSON.stringify(blogPosts, null, 2))
    console.log(`Backup created: ${backupPath}`)
    
    // Write cleaned posts
    fs.writeFileSync(blogPostsPath, JSON.stringify(cleanedPosts, null, 2))
    console.log(`✅ Successfully cleaned content for ${cleanedPosts.length} blog posts!`)
    
    // Show summary of changes
    let changesCount = 0
    blogPosts.forEach((original, index) => {
      const cleaned = cleanedPosts[index]
      if (original.content !== cleaned.content) {
        changesCount++
        console.log(`📝 Content updated: ${cleaned.title}`)
      }
    })
    
    console.log(`\n🎉 Content cleaning complete! ${changesCount} posts were updated.`)
    
  } catch (error) {
    console.error('❌ Error cleaning blog content:', error)
  }
}

// Run the cleaning
cleanAllBlogContent()