#!/usr/bin/env node

/**
 * Blog API Testing Script
 * 
 * This script tests all the enhanced blog API endpoints.
 * Run with: node scripts/test-blog-api.js
 */

const https = require('https');
const http = require('http');

class BlogAPITester {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.token = null;
    this.testResults = [];
  }

  async makeRequest(path, options = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;

      const requestOptions = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      };

      const req = client.request(requestOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
          } catch (error) {
            resolve({ status: res.statusCode, data: data, headers: res.headers });
          }
        });
      });

      req.on('error', reject);

      if (options.body) {
        req.write(JSON.stringify(options.body));
      }

      req.end();
    });
  }

  logTest(name, success, details = '') {
    const status = success ? '✅' : '❌';
    console.log(`${status} ${name}${details ? ': ' + details : ''}`);
    this.testResults.push({ name, success, details });
  }

  async testLogin() {
    console.log('\n🔐 Testing Authentication...');
    
    try {
      // Test with invalid credentials
      const invalidResponse = await this.makeRequest('/api/auth/login', {
        method: 'POST',
        body: { username: 'invalid', password: 'invalid' }
      });

      this.logTest(
        'Invalid login rejection',
        invalidResponse.status === 401,
        `Status: ${invalidResponse.status}`
      );

      // Test with valid credentials (you'll need to update these)
      const validResponse = await this.makeRequest('/api/auth/login', {
        method: 'POST',
        body: { username: 'admin', password: 'admin123' } // Update with your credentials
      });

      if (validResponse.status === 200 && validResponse.data.success) {
        this.token = validResponse.data.data.token;
        this.logTest('Valid login success', true, 'Token received');
      } else {
        this.logTest('Valid login success', false, `Status: ${validResponse.status}`);
      }

    } catch (error) {
      this.logTest('Login test', false, error.message);
    }
  }

  async testRateLimit() {
    console.log('\n⏱️ Testing Rate Limiting...');
    
    try {
      const requests = [];
      
      // Make 10 rapid requests
      for (let i = 0; i < 10; i++) {
        requests.push(this.makeRequest('/api/blog/enhanced'));
      }

      const responses = await Promise.all(requests);
      const rateLimited = responses.some(r => r.status === 429);
      
      this.logTest(
        'Rate limiting active',
        rateLimited,
        rateLimited ? 'Rate limit triggered' : 'No rate limit detected'
      );

    } catch (error) {
      this.logTest('Rate limit test', false, error.message);
    }
  }

  async testBlogAPI() {
    console.log('\n📝 Testing Blog API...');
    
    try {
      // Test GET /api/blog/enhanced
      const getResponse = await this.makeRequest('/api/blog/enhanced');
      this.logTest(
        'Get blog posts',
        getResponse.status === 200 && getResponse.data.success,
        `Status: ${getResponse.status}, Posts: ${getResponse.data.data?.length || 0}`
      );

      // Test pagination
      const paginatedResponse = await this.makeRequest('/api/blog/enhanced?page=1&limit=5');
      this.logTest(
        'Pagination',
        paginatedResponse.status === 200 && paginatedResponse.data.meta?.pagination,
        `Pagination meta present: ${!!paginatedResponse.data.meta?.pagination}`
      );

      // Test search
      const searchResponse = await this.makeRequest('/api/blog/enhanced?search=AI');
      this.logTest(
        'Search functionality',
        searchResponse.status === 200,
        `Status: ${searchResponse.status}`
      );

      // Test category filter
      const categoryResponse = await this.makeRequest('/api/blog/enhanced?category=ai-tools');
      this.logTest(
        'Category filtering',
        categoryResponse.status === 200,
        `Status: ${categoryResponse.status}`
      );

    } catch (error) {
      this.logTest('Blog API test', false, error.message);
    }
  }

  async testAuthenticatedEndpoints() {
    console.log('\n🔒 Testing Authenticated Endpoints...');
    
    if (!this.token) {
      this.logTest('Authenticated tests', false, 'No token available');
      return;
    }

    try {
      // Test POST without auth
      const unauthResponse = await this.makeRequest('/api/blog/enhanced', {
        method: 'POST',
        body: { title: 'Test Post' }
      });

      this.logTest(
        'Unauthorized POST rejection',
        unauthResponse.status === 401,
        `Status: ${unauthResponse.status}`
      );

      // Test POST with auth
      const testPost = {
        id: 'test-post-' + Date.now(),
        title: 'Test Post',
        excerpt: 'This is a test post',
        content: 'This is the content of the test post',
        author: 'Test Author',
        date: new Date().toISOString(),
        readTime: '2 min read',
        category: 'ai-tools',
        featured: false,
        published: false,
        href: '/blog/test-post',
        tags: ['test'],
        seo: {},
        status: 'draft'
      };

      const authResponse = await this.makeRequest('/api/blog/enhanced', {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.token}` },
        body: testPost
      });

      this.logTest(
        'Authenticated POST',
        authResponse.status === 200 && authResponse.data.success,
        `Status: ${authResponse.status}`
      );

    } catch (error) {
      this.logTest('Authenticated endpoints test', false, error.message);
    }
  }

  async testErrorHandling() {
    console.log('\n🚨 Testing Error Handling...');
    
    try {
      // Test malformed JSON
      const malformedResponse = await this.makeRequest('/api/blog/enhanced', {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: 'invalid json'
      });

      this.logTest(
        'Malformed JSON handling',
        malformedResponse.status >= 400,
        `Status: ${malformedResponse.status}`
      );

      // Test missing required fields
      const incompleteResponse = await this.makeRequest('/api/blog/enhanced', {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.token}` },
        body: { title: 'Incomplete Post' } // Missing required fields
      });

      this.logTest(
        'Validation error handling',
        incompleteResponse.status >= 400,
        `Status: ${incompleteResponse.status}`
      );

    } catch (error) {
      this.logTest('Error handling test', false, error.message);
    }
  }

  async testPerformance() {
    console.log('\n⚡ Testing Performance...');
    
    try {
      const startTime = Date.now();
      const response = await this.makeRequest('/api/blog/enhanced');
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      this.logTest(
        'Response time',
        responseTime < 1000,
        `${responseTime}ms (target: <1000ms)`
      );

      // Test concurrent requests
      const concurrentStart = Date.now();
      const concurrentRequests = Array(5).fill().map(() => 
        this.makeRequest('/api/blog/enhanced')
      );
      
      await Promise.all(concurrentRequests);
      const concurrentEnd = Date.now();
      const concurrentTime = concurrentEnd - concurrentStart;

      this.logTest(
        'Concurrent requests',
        concurrentTime < 2000,
        `${concurrentTime}ms for 5 concurrent requests`
      );

    } catch (error) {
      this.logTest('Performance test', false, error.message);
    }
  }

  async runAllTests() {
    console.log('🧪 Starting Blog API Tests...');
    console.log(`Testing against: ${this.baseUrl}\n`);

    await this.testLogin();
    await this.testRateLimit();
    await this.testBlogAPI();
    await this.testAuthenticatedEndpoints();
    await this.testErrorHandling();
    await this.testPerformance();

    // Summary
    console.log('\n📊 Test Summary:');
    const passed = this.testResults.filter(t => t.success).length;
    const total = this.testResults.length;
    const percentage = Math.round((passed / total) * 100);

    console.log(`Passed: ${passed}/${total} (${percentage}%)`);
    
    if (percentage === 100) {
      console.log('🎉 All tests passed!');
    } else {
      console.log('⚠️ Some tests failed. Check the details above.');
      
      console.log('\nFailed tests:');
      this.testResults
        .filter(t => !t.success)
        .forEach(t => console.log(`  ❌ ${t.name}: ${t.details}`));
    }

    console.log('\n💡 Tips:');
    console.log('- Make sure your development server is running (npm run dev)');
    console.log('- Update the login credentials in this script');
    console.log('- Check your .env.local file for correct configuration');
    console.log('- Ensure all dependencies are installed');
  }
}

// Command line interface
async function main() {
  const baseUrl = process.argv[2] || 'http://localhost:3000';
  const tester = new BlogAPITester(baseUrl);
  
  try {
    await tester.runAllTests();
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = BlogAPITester;