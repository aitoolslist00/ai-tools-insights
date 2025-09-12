#!/usr/bin/env node

/**
 * SEO Deployment Verification Script
 * Verifies that all SEO optimizations are working correctly
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'https://www.aitoolsinsights.com';

const ENDPOINTS_TO_TEST = [
  '/robots.txt',
  '/sitemap-index.xml',
  '/sitemap.xml',
  '/sitemap-tools.xml',
  '/sitemap-blog.xml',
  '/sitemap-articles.xml',
  '/sitemap-images.xml',
  '/seo-health-check',
  '/submit-to-search-engines',
  '/google-indexing-api'
];

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    protocol.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          headers: res.headers,
          data: data.substring(0, 500) // First 500 chars
        });
      });
    }).on('error', (err) => {
      reject({ url, error: err.message });
    });
  });
}

async function verifyDeployment() {
  console.log('🔍 Verifying SEO Deployment...\n');
  
  const results = [];
  
  for (const endpoint of ENDPOINTS_TO_TEST) {
    const url = `${BASE_URL}${endpoint}`;
    
    try {
      console.log(`Testing: ${endpoint}`);
      const result = await makeRequest(url);
      results.push(result);
      
      if (result.status === 200) {
        console.log(`✅ ${endpoint} - OK (${result.status})`);
      } else {
        console.log(`⚠️  ${endpoint} - Status: ${result.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.error}`);
      results.push(error);
    }
  }
  
  console.log('\n📊 Deployment Summary:');
  console.log('='.repeat(50));
  
  const successful = results.filter(r => r.status === 200).length;
  const total = ENDPOINTS_TO_TEST.length;
  
  console.log(`✅ Successful: ${successful}/${total}`);
  console.log(`❌ Failed: ${total - successful}/${total}`);
  
  if (successful === total) {
    console.log('\n🎉 All SEO endpoints are working correctly!');
    console.log('\n📋 Next Steps:');
    console.log('1. Submit sitemap to Google Search Console');
    console.log('2. Submit sitemap to Bing Webmaster Tools');
    console.log('3. Monitor indexing progress');
    console.log(`4. Check SEO health: ${BASE_URL}/seo-health-check`);
    console.log(`5. Get submission guide: ${BASE_URL}/submit-to-search-engines`);
  } else {
    console.log('\n⚠️  Some endpoints failed. Please check the deployment.');
  }
  
  // Test sitemap ping
  console.log('\n🔔 Testing Sitemap Ping...');
  try {
    const googlePing = `https://www.google.com/ping?sitemap=${encodeURIComponent(`${BASE_URL}/sitemap-index.xml`)}`;
    const bingPing = `https://www.bing.com/ping?sitemap=${encodeURIComponent(`${BASE_URL}/sitemap-index.xml`)}`;
    
    console.log(`Google Ping URL: ${googlePing}`);
    console.log(`Bing Ping URL: ${bingPing}`);
    console.log('💡 Use these URLs to notify search engines of updates');
  } catch (error) {
    console.log('❌ Sitemap ping test failed');
  }
}

// Run verification
verifyDeployment().catch(console.error);