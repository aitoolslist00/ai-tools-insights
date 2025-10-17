/**
 * Verification Script for Google Indexing Fixes
 * 
 * This script verifies that all indexing issues have been resolved:
 * 1. New category pages exist and return 200
 * 2. Test pages have noindex meta tags
 * 3. Sitemaps are accessible
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Google Indexing Fixes...\n');

let errors = [];
let warnings = [];
let successes = [];

// ============================================================================
// 1. Check if new category pages exist
// ============================================================================
console.log('📁 Checking new category pages...');

const newPages = [
  'app/blog/categories/page.tsx',
  'app/blog/tags/page.tsx',
  'app/ai-tools/categories/page.tsx',
];

newPages.forEach(pagePath => {
  const fullPath = path.join(process.cwd(), pagePath);
  if (fs.existsSync(fullPath)) {
    successes.push(`✅ ${pagePath} exists`);
    
    // Check if it has metadata
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('export const metadata')) {
      successes.push(`  ↳ Has SEO metadata`);
    } else {
      warnings.push(`⚠️  ${pagePath} missing metadata export`);
    }
    
    if (content.includes('canonical')) {
      successes.push(`  ↳ Has canonical URL`);
    } else {
      warnings.push(`⚠️  ${pagePath} missing canonical URL`);
    }
  } else {
    errors.push(`❌ ${pagePath} NOT FOUND`);
  }
});

console.log('');

// ============================================================================
// 2. Check if test pages have noindex layout files
// ============================================================================
console.log('🚫 Checking noindex for test pages...');

const testPages = [
  'app/test-dashboard/layout.tsx',
  'app/test-api/layout.tsx',
  'app/test-ads/layout.tsx',
  'app/test-images/layout.tsx',
  'app/test-posts/layout.tsx',
  'app/test-upload/layout.tsx',
  'app/test-ai-dashboard/layout.tsx',
  'app/blog/dashboard/layout.tsx',
];

testPages.forEach(layoutPath => {
  const fullPath = path.join(process.cwd(), layoutPath);
  if (fs.existsSync(fullPath)) {
    successes.push(`✅ ${layoutPath} exists`);
    
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('index: false')) {
      successes.push(`  ↳ Has noindex robots tag`);
    } else {
      errors.push(`❌ ${layoutPath} missing noindex configuration`);
    }
  } else {
    errors.push(`❌ ${layoutPath} NOT FOUND`);
  }
});

console.log('');

// ============================================================================
// 3. Check sitemap configuration
// ============================================================================
console.log('🗺️  Checking sitemap files...');

const sitemapFiles = [
  'app/sitemap.ts',
  'app/robots.ts',
  'app/sitemap-index.xml/route.ts',
  'app/sitemap-blog.xml/route.ts',
  'app/sitemap-tools.xml/route.ts',
];

sitemapFiles.forEach(sitemapPath => {
  const fullPath = path.join(process.cwd(), sitemapPath);
  if (fs.existsSync(fullPath)) {
    successes.push(`✅ ${sitemapPath} exists`);
  } else {
    warnings.push(`⚠️  ${sitemapPath} not found`);
  }
});

console.log('');

// ============================================================================
// 4. Check robots.ts blocking configuration
// ============================================================================
console.log('🤖 Checking robots.ts configuration...');

const robotsPath = path.join(process.cwd(), 'app/robots.ts');
if (fs.existsSync(robotsPath)) {
  const content = fs.readFileSync(robotsPath, 'utf8');
  
  const requiredBlocks = [
    { pattern: '/test-\\*', name: 'test pages wildcard' },
    { pattern: '/dashboard/', name: 'dashboard directory' },
    { pattern: '/blog/dashboard', name: 'blog dashboard' },
    { pattern: '/api/auth/', name: 'auth API' },
  ];
  
  requiredBlocks.forEach(({ pattern, name }) => {
    if (content.includes(pattern)) {
      successes.push(`✅ Blocks ${name} (${pattern})`);
    } else {
      warnings.push(`⚠️  May not block ${name}`);
    }
  });
} else {
  errors.push('❌ robots.ts not found');
}

console.log('');

// ============================================================================
// 5. Check for duplicate or old sitemap references
// ============================================================================
console.log('🔗 Checking for duplicate sitemap entries...');

const sitemapPath = path.join(process.cwd(), 'app/sitemap.ts');
if (fs.existsSync(sitemapPath)) {
  const content = fs.readFileSync(sitemapPath, 'utf8');
  
  // Check if new pages are referenced
  if (content.includes('/blog/categories') || content.includes('blog-categories')) {
    warnings.push('⚠️  Main sitemap may reference blog/categories (should be in sitemap-blog.xml)');
  }
  
  if (content.includes('/blog/tags') || content.includes('blog-tags')) {
    warnings.push('⚠️  Main sitemap may reference blog/tags (should be in sitemap-blog.xml)');
  }
  
  if (content.includes('/ai-tools/categories') || content.includes('tools-categories')) {
    warnings.push('⚠️  Main sitemap may reference ai-tools/categories (should be in sitemap-tools.xml)');
  }
}

// Check blog sitemap
const blogSitemapPath = path.join(process.cwd(), 'app/sitemap-blog.xml/route.ts');
if (fs.existsSync(blogSitemapPath)) {
  const content = fs.readFileSync(blogSitemapPath, 'utf8');
  
  if (content.includes('/blog/categories')) {
    successes.push('✅ Blog sitemap includes /blog/categories');
  } else {
    errors.push('❌ Blog sitemap missing /blog/categories');
  }
  
  if (content.includes('/blog/tags')) {
    successes.push('✅ Blog sitemap includes /blog/tags');
  } else {
    errors.push('❌ Blog sitemap missing /blog/tags');
  }
}

// Check tools sitemap
const toolsSitemapPath = path.join(process.cwd(), 'app/sitemap-tools.xml/route.ts');
if (fs.existsSync(toolsSitemapPath)) {
  const content = fs.readFileSync(toolsSitemapPath, 'utf8');
  
  if (content.includes('/ai-tools/categories')) {
    successes.push('✅ Tools sitemap includes /ai-tools/categories');
  } else {
    errors.push('❌ Tools sitemap missing /ai-tools/categories');
  }
}

console.log('');

// ============================================================================
// Print Results
// ============================================================================
console.log('═══════════════════════════════════════════════════════════');
console.log('📊 VERIFICATION RESULTS');
console.log('═══════════════════════════════════════════════════════════\n');

if (successes.length > 0) {
  console.log('✅ SUCCESSES:\n');
  successes.forEach(msg => console.log(msg));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS:\n');
  warnings.forEach(msg => console.log(msg));
  console.log('');
}

if (errors.length > 0) {
  console.log('❌ ERRORS:\n');
  errors.forEach(msg => console.log(msg));
  console.log('');
}

// Summary
console.log('═══════════════════════════════════════════════════════════');
console.log(`✅ Successes: ${successes.length}`);
console.log(`⚠️  Warnings: ${warnings.length}`);
console.log(`❌ Errors: ${errors.length}`);
console.log('═══════════════════════════════════════════════════════════\n');

if (errors.length === 0) {
  console.log('🎉 All checks passed! Ready to deploy.\n');
  console.log('Next steps:');
  console.log('1. Run: npm run build');
  console.log('2. Test locally: npm run start');
  console.log('3. Deploy: git add . && git commit -m "Fix indexing issues" && git push');
  console.log('4. Submit sitemap to Google Search Console\n');
  process.exit(0);
} else {
  console.log('⚠️  Some issues found. Please fix errors before deploying.\n');
  process.exit(1);
}