/**
 * Event Schema Checker
 * 
 * This script checks for Event structured data across your site
 * to help diagnose Google Search Console Event schema issues.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for Event Structured Data...\n');

let foundEventSchemas = false;

// Check blog-posts.json
console.log('📝 Checking blog-posts.json...');
try {
  const blogPostsPath = path.join(__dirname, '..', 'blog-posts.json');
  const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));
  
  blogPosts.forEach((post, index) => {
    if (post.schemas) {
      const schemaStr = JSON.stringify(post.schemas);
      if (schemaStr.includes('"@type":"Event"') || schemaStr.includes('"@type": "Event"')) {
        console.log(`   ❌ Found Event schema in blog post: ${post.title}`);
        console.log(`      Post ID: ${post.id}`);
        foundEventSchemas = true;
      }
    }
  });
  
  if (!foundEventSchemas) {
    console.log('   ✅ No Event schemas found in blog posts');
  }
} catch (error) {
  console.log('   ⚠️  Could not check blog-posts.json:', error.message);
}

// Check TypeScript/JavaScript files for Event schema usage
console.log('\n📦 Checking TypeScript/JavaScript files...');
const checkDirectory = (dir, pattern) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    // Skip node_modules and .next
    if (file.name === 'node_modules' || file.name === '.next' || file.name === '.git') {
      continue;
    }
    
    if (file.isDirectory()) {
      checkDirectory(fullPath, pattern);
    } else if (file.name.match(/\.(tsx?|jsx?)$/)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Check for Event schema patterns
        if (content.includes('generateEventSchema') || 
            content.includes('"@type":"Event"') || 
            content.includes('"@type": "Event"') ||
            content.includes("'@type':'Event'") ||
            content.includes("'@type': 'Event'")) {
          
          const lines = content.split('\n');
          lines.forEach((line, lineNum) => {
            if (line.includes('generateEventSchema') || 
                line.includes('@type') && (line.includes('Event'))) {
              console.log(`   ⚠️  Potential Event schema usage:`);
              console.log(`      File: ${fullPath}`);
              console.log(`      Line ${lineNum + 1}: ${line.trim()}`);
              foundEventSchemas = true;
            }
          });
        }
      } catch (error) {
        // Ignore read errors
      }
    }
  }
};

try {
  const appDir = path.join(__dirname, '..', 'app');
  const libDir = path.join(__dirname, '..', 'lib');
  
  checkDirectory(appDir);
  checkDirectory(libDir);
  
  if (!foundEventSchemas) {
    console.log('   ✅ No Event schema usage found in code');
  }
} catch (error) {
  console.log('   ⚠️  Could not check files:', error.message);
}

// Check for static HTML files
console.log('\n📄 Checking static HTML files...');
try {
  const publicDir = path.join(__dirname, '..', 'public');
  const checkHtmlFiles = (dir) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        checkHtmlFiles(fullPath);
      } else if (file.name.match(/\.html$/)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          
          if (content.includes('"@type":"Event"') || content.includes('"@type": "Event"')) {
            console.log(`   ❌ Found Event schema in: ${fullPath}`);
            foundEventSchemas = true;
          }
        } catch (error) {
          // Ignore read errors
        }
      }
    }
  };
  
  checkHtmlFiles(publicDir);
  
  if (!foundEventSchemas) {
    console.log('   ✅ No Event schemas found in static HTML files');
  }
} catch (error) {
  console.log('   ⚠️  Could not check HTML files:', error.message);
}

// Final summary
console.log('\n' + '='.repeat(60));
console.log('📊 SUMMARY');
console.log('='.repeat(60));

if (foundEventSchemas) {
  console.log('\n❌ Event schemas were found on your site!');
  console.log('\n📋 Next Steps:');
  console.log('   1. Review the locations listed above');
  console.log('   2. Decide if you want to keep or remove Event schemas');
  console.log('   3. If keeping: Ensure all required fields are present');
  console.log('   4. If removing: Delete the Event schema markup');
  console.log('   5. Request validation in Google Search Console');
} else {
  console.log('\n✅ No Event schemas found on your site!');
  console.log('\n📋 Next Steps:');
  console.log('   1. Go to Google Search Console');
  console.log('   2. Navigate to: Enhancements → Event structured data');
  console.log('   3. Click "VALIDATE FIX" to re-crawl affected pages');
  console.log('   4. Wait 1-2 weeks for Google to process validation');
  console.log('\n💡 The errors are likely from cached/old content that no longer exists.');
}

console.log('\n📚 For detailed guidance, see: EVENT_SCHEMA_FIX_GUIDE.md');
console.log('='.repeat(60) + '\n');