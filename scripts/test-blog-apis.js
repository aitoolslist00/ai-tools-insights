#!/usr/bin/env node

/**
 * Blog API Testing Script
 * Tests all blog-related APIs to ensure they're working correctly
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const AUTH_TOKEN = process.env.BLOG_AUTH_TOKEN || 'your-test-token';

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : require('http');
    
    const req = protocol.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = body ? JSON.parse(body) : {};
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: jsonBody
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

// Test function
async function runTest(name, testFn) {
  console.log(`\n🧪 Testing: ${name}`);
  try {
    const result = await testFn();
    if (result.success) {
      console.log(`✅ PASS: ${name}`);
      results.passed++;
    } else {
      console.log(`❌ FAIL: ${name} - ${result.message}`);
      results.failed++;
    }
    results.tests.push({ name, ...result });
  } catch (error) {
    console.log(`❌ ERROR: ${name} - ${error.message}`);
    results.failed++;
    results.tests.push({ name, success: false, message: error.message });
  }
}

// Test 1: Debug API
async function testDebugAPI() {
  const url = new URL('/api/blog/debug', BASE_URL);
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${AUTH_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  const response = await makeRequest(options);
  
  if (response.statusCode === 200 && response.body.success) {
    return {
      success: true,
      message: 'Debug API working correctly',
      data: response.body.debug
    };
  } else {
    return {
      success: false,
      message: `Debug API failed: ${response.statusCode} - ${response.body.error || 'Unknown error'}`
    };
  }
}

// Test 2: Unified Blog API - Load Posts
async function testUnifiedAPILoad() {
  const url = new URL('/api/blog/unified', BASE_URL);
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const response = await makeRequest(options);
  
  if (response.statusCode === 200 && response.body.success) {
    return {
      success: true,
      message: `Loaded ${response.body.data.length} posts`,
      data: { postCount: response.body.data.length }
    };
  } else {
    return {
      success: false,
      message: `Unified API load failed: ${response.statusCode} - ${response.body.error || 'Unknown error'}`
    };
  }
}

// Test 3: Unified Blog API - Stats
async function testUnifiedAPIStats() {
  const url = new URL('/api/blog/unified?action=stats', BASE_URL);
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname + url.search,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const response = await makeRequest(options);
  
  if (response.statusCode === 200 && response.body.success) {
    return {
      success: true,
      message: 'Stats API working correctly',
      data: response.body.data
    };
  } else {
    return {
      success: false,
      message: `Stats API failed: ${response.statusCode} - ${response.body.error || 'Unknown error'}`
    };
  }
}

// Test 4: Revalidate API
async function testRevalidateAPI() {
  const url = new URL('/api/revalidate', BASE_URL);
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AUTH_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  const data = JSON.stringify({});
  const response = await makeRequest(options, data);
  
  if (response.statusCode === 200 && response.body.revalidated) {
    return {
      success: true,
      message: 'Revalidate API working correctly',
      data: { method: response.body.method }
    };
  } else {
    return {
      success: false,
      message: `Revalidate API failed: ${response.statusCode} - ${response.body.error || 'Unknown error'}`
    };
  }
}

// Test 5: Authentication Test
async function testAuthentication() {
  // Test with invalid token
  const url = new URL('/api/blog/debug', BASE_URL);
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer invalid-token',
      'Content-Type': 'application/json'
    }
  };

  const response = await makeRequest(options);
  
  if (response.statusCode === 401) {
    return {
      success: true,
      message: 'Authentication properly rejecting invalid tokens'
    };
  } else {
    return {
      success: false,
      message: `Authentication not working: Expected 401, got ${response.statusCode}`
    };
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Blog API Tests');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log(`🔑 Using Auth Token: ${AUTH_TOKEN.substring(0, 10)}...`);
  
  await runTest('Debug API', testDebugAPI);
  await runTest('Unified API - Load Posts', testUnifiedAPILoad);
  await runTest('Unified API - Stats', testUnifiedAPIStats);
  await runTest('Revalidate API', testRevalidateAPI);
  await runTest('Authentication', testAuthentication);
  
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);
  
  if (results.failed > 0) {
    console.log('\n🔍 Failed Tests:');
    results.tests
      .filter(test => !test.success)
      .forEach(test => {
        console.log(`  - ${test.name}: ${test.message}`);
      });
  }
  
  // Save detailed results
  const reportPath = path.join(__dirname, '..', 'test-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Detailed results saved to: ${reportPath}`);
  
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = { runAllTests, makeRequest };