#!/usr/bin/env node

/**
 * SSG Build Optimization Script
 * Optimizes the build process for static site generation
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Starting SSG optimized build...')

// Pre-build optimizations
function preBuildOptimizations() {
  console.log('📋 Running pre-build optimizations...')
  
  // Clear Next.js cache for fresh build
  const nextDir = path.join(process.cwd(), '.next')
  if (fs.existsSync(nextDir)) {
    console.log('🧹 Clearing .next cache...')
    fs.rmSync(nextDir, { recursive: true, force: true })
  }
  
  // Verify blog posts file exists
  const blogPostsFile = path.join(process.cwd(), 'blog-posts.json')
  if (!fs.existsSync(blogPostsFile)) {
    console.log('📝 Creating empty blog-posts.json...')
    fs.writeFileSync(blogPostsFile, JSON.stringify([], null, 2))
  }
  
  console.log('✅ Pre-build optimizations complete')
}

// Post-build optimizations
function postBuildOptimizations() {
  console.log('🔧 Running post-build optimizations...')
  
  // Generate sitemap if needed
  const publicDir = path.join(process.cwd(), 'public')
  const sitemapPath = path.join(publicDir, 'sitemap.xml')
  
  if (!fs.existsSync(sitemapPath)) {
    console.log('🗺️ Generating basic sitemap...')
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.aitoolslist.com</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.aitoolslist.com/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`
    fs.writeFileSync(sitemapPath, sitemap)
  }
  
  console.log('✅ Post-build optimizations complete')
}

// Main build process
function runBuild() {
  try {
    preBuildOptimizations()
    
    console.log('🏗️ Running Next.js build...')
    execSync('npm run build', { stdio: 'inherit' })
    
    postBuildOptimizations()
    
    console.log('🎉 SSG build completed successfully!')
    console.log('📊 Build statistics:')
    
    // Show build statistics
    const buildDir = path.join(process.cwd(), '.next')
    if (fs.existsSync(buildDir)) {
      const stats = fs.statSync(buildDir)
      console.log(`   Build directory size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`)
    }
    
  } catch (error) {
    console.error('❌ Build failed:', error.message)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  runBuild()
}

module.exports = { runBuild, preBuildOptimizations, postBuildOptimizations }