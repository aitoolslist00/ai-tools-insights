/**
 * SEO Fix Automation Script
 * Fixes title and meta description length issues in existing blog posts
 */

const fs = require('fs')
const path = require('path')

// SEO optimization functions
function optimizeTitle(title, focusKeyword = '') {
  if (!title) return title
  
  if (title.length <= 60) return title
  
  // Truncate at word boundary, keeping focus keyword if possible
  const words = title.split(' ')
  let truncated = ''
  
  for (const word of words) {
    const testLength = (truncated + ' ' + word).length
    if (testLength <= 57) { // Leave room for "..."
      truncated += (truncated ? ' ' : '') + word
    } else {
      break
    }
  }
  
  return truncated + '...'
}

function optimizeMetaDescription(description, focusKeyword = '') {
  if (!description) return description
  
  if (description.length <= 155) return description
  
  // Truncate at word boundary
  const words = description.split(' ')
  let truncated = ''
  
  for (const word of words) {
    const testLength = (truncated + ' ' + word).length
    if (testLength <= 152) { // Leave room for "..."
      truncated += (truncated ? ' ' : '') + word
    } else {
      break
    }
  }
  
  return truncated + '...'
}

// Main fix function
function fixSEOIssues() {
  const blogPostsPath = path.join(__dirname, '..', 'blog-posts.json')
  
  if (!fs.existsSync(blogPostsPath)) {
    console.error('❌ blog-posts.json not found')
    return
  }
  
  console.log('🔍 Loading blog posts...')
  const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'))
  
  let fixedCount = 0
  let titleIssues = 0
  let descriptionIssues = 0
  
  console.log(`📊 Analyzing ${blogPosts.length} blog posts...\\n`)
  
  // Create backup
  const backupPath = path.join(__dirname, '..', 'backups', `blog-posts-seo-fix-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  const backupDir = path.dirname(backupPath)
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }
  fs.writeFileSync(backupPath, JSON.stringify(blogPosts, null, 2))
  console.log(`💾 Backup created: ${path.basename(backupPath)}`)
  
  // Fix each post
  blogPosts.forEach((post, index) => {
    let postFixed = false
    const focusKeyword = post.keywords?.[0] || ''
    
    // Check and fix title
    if (post.title && post.title.length > 60) {
      const originalTitle = post.title
      post.title = optimizeTitle(post.title, focusKeyword)
      console.log(`📝 Fixed title [${index + 1}]:`)
      console.log(`   Before (${originalTitle.length} chars): ${originalTitle}`)
      console.log(`   After (${post.title.length} chars): ${post.title}\\n`)
      titleIssues++
      postFixed = true
    }
    
    // Check and fix meta description
    if (post.metaDescription && post.metaDescription.length > 155) {
      const originalDesc = post.metaDescription
      post.metaDescription = optimizeMetaDescription(post.metaDescription, focusKeyword)
      console.log(`📄 Fixed meta description [${index + 1}]:`)
      console.log(`   Before (${originalDesc.length} chars): ${originalDesc}`)
      console.log(`   After (${post.metaDescription.length} chars): ${post.metaDescription}\\n`)
      descriptionIssues++
      postFixed = true
    }
    
    if (postFixed) {
      post.lastModified = new Date().toISOString()
      fixedCount++
    }
  })
  
  // Save fixed posts
  fs.writeFileSync(blogPostsPath, JSON.stringify(blogPosts, null, 2))
  
  // Summary
  console.log('\\n' + '='.repeat(50))
  console.log('📈 SEO FIX SUMMARY')
  console.log('='.repeat(50))
  console.log(`✅ Posts processed: ${blogPosts.length}`)
  console.log(`🔧 Posts fixed: ${fixedCount}`)
  console.log(`📝 Title issues fixed: ${titleIssues}`)
  console.log(`📄 Meta description issues fixed: ${descriptionIssues}`)
  console.log(`💾 Backup saved: ${path.basename(backupPath)}`)
  console.log('\\n✨ SEO optimization complete!')
}

// Run the fix
if (require.main === module) {
  fixSEOIssues()
}

module.exports = { fixSEOIssues, optimizeTitle, optimizeMetaDescription }