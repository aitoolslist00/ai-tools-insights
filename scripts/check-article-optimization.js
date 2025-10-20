/**
 * CHECK SPECIFIC ARTICLE OPTIMIZATION
 * Usage: node scripts/check-article-optimization.js [slug or title]
 */

const fs = require('fs')
const path = require('path')

const searchTerm = process.argv[2]

if (!searchTerm) {
  console.log('\n📋 USAGE:')
  console.log('  node scripts/check-article-optimization.js [slug or title]\n')
  console.log('📝 EXAMPLES:')
  console.log('  node scripts/check-article-optimization.js "ai-tools-2025"')
  console.log('  node scripts/check-article-optimization.js "multimodal-ai"\n')
  process.exit(0)
}

// Load blog posts
const blogPostsPath = path.join(process.cwd(), 'blog-posts.json')
let blogPosts = []

try {
  const content = fs.readFileSync(blogPostsPath, 'utf-8')
  blogPosts = JSON.parse(content)
} catch (error) {
  console.error('❌ Could not load blog posts:', error.message)
  process.exit(1)
}

// Search for article
const searchLower = searchTerm.toLowerCase()
const article = blogPosts.find(post => 
  post.slug.toLowerCase().includes(searchLower) ||
  post.title.toLowerCase().includes(searchLower)
)

if (!article) {
  console.log(`\n❌ No article found matching: "${searchTerm}"\n`)
  console.log('Available articles:')
  blogPosts.slice(0, 10).forEach(post => {
    console.log(`  • ${post.title}`)
    console.log(`    Slug: ${post.slug}\n`)
  })
  console.log(`... and ${blogPosts.length - 10} more\n`)
  process.exit(1)
}

// Display article information
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('📄 ARTICLE FOUND')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

console.log(`Title: ${article.title}`)
console.log(`Slug: ${article.slug}`)
console.log(`Published: ${article.published ? 'Yes' : 'No (Draft)'}`)
console.log(`Category: ${article.category}`)
console.log(`Word Count: ${article.wordCount}`)
console.log(`SEO Score: ${article.seoScore || 'N/A'}`)
console.log(`Published Date: ${new Date(article.publishDate).toLocaleDateString()}`)

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🤖 GOOGLE BOT OPTIMIZATION STATUS')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

const hasOptimization = article.googleBotScore !== undefined || 
                        article.googleBotOptimized !== undefined

if (!hasOptimization) {
  console.log('⚠️  This article does NOT have optimization tracking data')
  console.log('📝 This is expected for articles published before the fix\n')
  console.log('To add optimization tracking to this article:')
  console.log('  1. Go to /blog/dashboard')
  console.log('  2. Edit this article')
  console.log('  3. Re-publish it')
  console.log('  4. The optimization data will be added\n')
} else {
  console.log('✅ This article HAS optimization tracking data!\n')
  
  if (article.googleBotScore) {
    console.log(`🎯 Google Bot Score: ${article.googleBotScore}%`)
  }
  
  if (article.googleBotOriginalScore) {
    console.log(`📊 Original Score: ${article.googleBotOriginalScore}%`)
    const improvement = article.googleBotScore - article.googleBotOriginalScore
    console.log(`📈 Improvement: ${improvement > 0 ? '+' : ''}${improvement.toFixed(1)}%`)
  }
  
  if (article.googleBotOptimized !== undefined) {
    console.log(`🔧 Optimization Applied: ${article.googleBotOptimized ? 'Yes' : 'No'}`)
  }
  
  if (article.googleBotImprovements && article.googleBotImprovements.length > 0) {
    console.log('\n📝 Improvements Made:')
    article.googleBotImprovements.forEach((imp, idx) => {
      console.log(`  ${idx + 1}. ${imp}`)
    })
  }
  
  if (article.googleBotAnalysis) {
    console.log('\n📊 Detailed Analysis:')
    console.log(JSON.stringify(article.googleBotAnalysis, null, 2))
  }
  
  console.log('')
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('📊 ARTICLE STATS')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

console.log(`Keywords: ${article.keywords.join(', ')}`)
console.log(`Reading Time: ${article.readingTime} min`)
console.log(`Internal Links: ${article.internalLinks?.length || 0}`)
console.log(`External Links: ${article.externalLinks?.length || 0}`)
console.log(`Images: ${article.images?.length || 0}`)
console.log(`Featured: ${article.featured ? 'Yes' : 'No'}`)

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')