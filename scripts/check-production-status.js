#!/usr/bin/env node

/**
 * Production Status Checker
 * Tests the actual production endpoints to see what's working
 */

const https = require('https');

const BASE_URL = 'https://www.aitoolsinsights.com';

console.log('🔍 Checking Production Status for AI Tools Insights...\n');

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function checkEndpoint(path, description, method = 'GET', body = null) {
  try {
    console.log(`Testing ${description}...`);
    
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Production-Status-Checker'
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(options.body);
    }
    
    const response = await makeRequest(`${BASE_URL}${path}`, options);
    
    console.log(`✅ ${description}: ${response.statusCode}`);
    
    // Try to parse JSON response
    try {
      const jsonData = JSON.parse(response.data);
      if (jsonData.error) {
        console.log(`   Error: ${jsonData.error}`);
      } else if (jsonData.message) {
        console.log(`   Message: ${jsonData.message}`);
      }
    } catch (e) {
      // Not JSON, that's okay
    }
    
    return response;
  } catch (error) {
    console.log(`❌ ${description}: ${error.message}`);
    return null;
  }
}

async function checkBlogPosts() {
  console.log('\n📝 Checking Blog Posts:');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/blog`);
    const posts = JSON.parse(response.data);
    
    if (Array.isArray(posts)) {
      console.log(`✅ Found ${posts.length} blog posts`);
      if (posts.length > 0) {
        console.log(`   Latest post: "${posts[0].title}" (${posts[0].date})`);
      }
    } else {
      console.log(`⚠️  Unexpected response format`);
    }
  } catch (error) {
    console.log(`❌ Failed to fetch blog posts: ${error.message}`);
  }
}

async function testBlogManagement() {
  console.log('\n🔐 Testing Blog Management (without auth):');
  
  // Test GET request (should work)
  await checkEndpoint('/api/blog/manage', 'Blog Management GET');
  
  // Test POST request (should require auth)
  await checkEndpoint('/api/blog/manage', 'Blog Management POST (no auth)', 'POST', {
    title: 'Test Post',
    content: 'Test content'
  });
}

async function testImageUpload() {
  console.log('\n📷 Testing Image Upload (without file):');
  
  // Test upload endpoint
  await checkEndpoint('/api/upload', 'Image Upload GET');
  
  // Test POST without file (should give error about missing file)
  await checkEndpoint('/api/upload', 'Image Upload POST (no file)', 'POST', {});
}

async function checkMainPages() {
  console.log('\n🌐 Checking Main Pages:');
  
  await checkEndpoint('/', 'Homepage');
  await checkEndpoint('/blog', 'Blog Page');
  await checkEndpoint('/blog/dashboard', 'Blog Dashboard');
}

async function main() {
  console.log(`Base URL: ${BASE_URL}\n`);
  
  // Check main pages
  await checkMainPages();
  
  // Check API endpoints
  console.log('\n🔌 Checking API Endpoints:');
  await checkEndpoint('/api/blog', 'Blog API');
  
  // Check blog posts
  await checkBlogPosts();
  
  // Test blog management
  await testBlogManagement();
  
  // Test image upload
  await testImageUpload();
  
  console.log('\n📊 Status Check Complete!');
  console.log('\n💡 Next Steps:');
  console.log('1. If APIs are returning errors, check Vercel function logs');
  console.log('2. Verify environment variables are set in Vercel Dashboard');
  console.log('3. Make sure Vercel KV and Blob services are configured');
  console.log('4. Try publishing a test article from the dashboard');
  
  console.log('\n🔗 Useful Links:');
  console.log(`   Dashboard: ${BASE_URL}/blog/dashboard`);
  console.log(`   Blog: ${BASE_URL}/blog`);
  console.log(`   Vercel Dashboard: https://vercel.com/dashboard`);
}

main().catch(console.error);