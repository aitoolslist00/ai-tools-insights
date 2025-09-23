const fs = require('fs')
const path = require('path')

// Function to clean and fix blog post formatting
function cleanBlogPost(post) {
  const cleaned = { ...post }
  
  // Clean title - remove markdown symbols and fix formatting
  if (cleaned.title) {
    cleaned.title = cleaned.title
      .replace(/^#+\s*/, '') // Remove leading markdown headers
      .replace(/#+\s*/g, '') // Remove any other # symbols
      .replace(/\s*:\s*#+\s*/g, ': ') // Fix malformed title separators
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
  }
  
  // Clean excerpt - remove markdown formatting and normalize
  if (cleaned.excerpt) {
    cleaned.excerpt = cleaned.excerpt
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      
    // Ensure excerpt ends properly
    if (cleaned.excerpt.length > 160) {
      cleaned.excerpt = cleaned.excerpt.substring(0, 157) + '...'
    }
  }
  
  // Clean SEO metadata
  if (cleaned.seo) {
    if (cleaned.seo.metaTitle) {
      cleaned.seo.metaTitle = cleaned.seo.metaTitle
        .replace(/^#+\s*/, '')
        .replace(/#+\s*/g, '')
        .replace(/\s*:\s*#+\s*/g, ': ')
        .replace(/\s+/g, ' ')
        .trim()
        
      if (cleaned.seo.metaTitle.length > 60) {
        cleaned.seo.metaTitle = cleaned.seo.metaTitle.substring(0, 57) + '...'
      }
    }
    
    if (cleaned.seo.metaDescription) {
      cleaned.seo.metaDescription = cleaned.seo.metaDescription
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        
      if (cleaned.seo.metaDescription.length > 160) {
        cleaned.seo.metaDescription = cleaned.seo.metaDescription.substring(0, 157) + '...'
      }
    }
    
    if (cleaned.seo.ogTitle) {
      cleaned.seo.ogTitle = cleaned.seo.ogTitle
        .replace(/^#+\s*/, '')
        .replace(/#+\s*/g, '')
        .replace(/\s*:\s*#+\s*/g, ': ')
        .replace(/\s+/g, ' ')
        .trim()
    }
    
    if (cleaned.seo.ogDescription) {
      cleaned.seo.ogDescription = cleaned.seo.ogDescription
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        
      if (cleaned.seo.ogDescription.length > 160) {
        cleaned.seo.ogDescription = cleaned.seo.ogDescription.substring(0, 157) + '...'
      }
    }
    
    if (cleaned.seo.twitterTitle) {
      cleaned.seo.twitterTitle = cleaned.seo.twitterTitle
        .replace(/^#+\s*/, '')
        .replace(/#+\s*/g, '')
        .replace(/\s*:\s*#+\s*/g, ': ')
        .replace(/\s+/g, ' ')
        .trim()
    }
    
    if (cleaned.seo.twitterDescription) {
      cleaned.seo.twitterDescription = cleaned.seo.twitterDescription
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        
      if (cleaned.seo.twitterDescription.length > 160) {
        cleaned.seo.twitterDescription = cleaned.seo.twitterDescription.substring(0, 157) + '...'
      }
    }
  }
  
  return cleaned
}

// Main function to fix all blog posts
function fixBlogFormatting() {
  const blogPostsPath = path.join(__dirname, '..', 'blog-posts.json')
  
  try {
    // Read current blog posts
    const blogPostsData = fs.readFileSync(blogPostsPath, 'utf8')
    const blogPosts = JSON.parse(blogPostsData)
    
    console.log(`Found ${blogPosts.length} blog posts to check...`)
    
    // Clean each blog post
    const cleanedPosts = blogPosts.map((post, index) => {
      console.log(`Cleaning post ${index + 1}: ${post.title}`)
      return cleanBlogPost(post)
    })
    
    // Create backup
    const backupPath = path.join(__dirname, '..', 'backups', `blog-posts-formatting-fix-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
    fs.writeFileSync(backupPath, JSON.stringify(blogPosts, null, 2))
    console.log(`Backup created: ${backupPath}`)
    
    // Write cleaned posts
    fs.writeFileSync(blogPostsPath, JSON.stringify(cleanedPosts, null, 2))
    console.log(`✅ Successfully cleaned ${cleanedPosts.length} blog posts!`)
    
    // Show summary of changes
    let changesCount = 0
    blogPosts.forEach((original, index) => {
      const cleaned = cleanedPosts[index]
      if (original.title !== cleaned.title || 
          original.excerpt !== cleaned.excerpt ||
          JSON.stringify(original.seo) !== JSON.stringify(cleaned.seo)) {
        changesCount++
        console.log(`📝 Fixed formatting in: ${cleaned.title}`)
      }
    })
    
    console.log(`\n🎉 Formatting fix complete! ${changesCount} posts were updated.`)
    
  } catch (error) {
    console.error('❌ Error fixing blog formatting:', error)
  }
}

// Run the fix
fixBlogFormatting()