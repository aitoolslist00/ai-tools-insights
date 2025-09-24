#!/usr/bin/env node

/**
 * Check Vercel Environment Variables
 * This script helps verify what environment variables are currently set
 */

console.log('🔍 Checking Current Environment Variables...\n');

// List of all environment variables we need
const envVars = {
  'Authentication': [
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD_HASH', 
    'JWT_SECRET'
  ],
  'Storage Configuration': [
    'BLOG_STORAGE_TYPE',
    'UPLOAD_PROVIDER'
  ],
  'Vercel KV (Blog Storage)': [
    'KV_REST_API_URL',
    'KV_REST_API_TOKEN'
  ],
  'Vercel Blob (Image Storage)': [
    'BLOB_READ_WRITE_TOKEN'
  ],
  'General': [
    'NEXT_PUBLIC_BASE_URL',
    'NODE_ENV'
  ]
};

let totalMissing = 0;
let criticalMissing = 0;

Object.entries(envVars).forEach(([category, vars]) => {
  console.log(`📋 ${category}:`);
  
  vars.forEach(varName => {
    const value = process.env[varName];
    const isCritical = ['ADMIN_USERNAME', 'ADMIN_PASSWORD_HASH', 'JWT_SECRET', 'KV_REST_API_URL', 'KV_REST_API_TOKEN', 'BLOB_READ_WRITE_TOKEN'].includes(varName);
    
    if (value) {
      // Show partial value for security
      const displayValue = value.length > 20 ? `${value.substring(0, 10)}...${value.substring(value.length - 5)}` : value;
      console.log(`   ✅ ${varName}: ${displayValue}`);
    } else {
      const symbol = isCritical ? '❌' : '⚠️ ';
      console.log(`   ${symbol} ${varName}: Not set`);
      totalMissing++;
      if (isCritical) criticalMissing++;
    }
  });
  
  console.log('');
});

// Summary
console.log('📊 Summary:');
console.log(`   Total variables checked: ${Object.values(envVars).flat().length}`);
console.log(`   Missing variables: ${totalMissing}`);
console.log(`   Critical missing: ${criticalMissing}`);

if (criticalMissing > 0) {
  console.log('\n❌ CRITICAL: Missing essential environment variables!');
  console.log('   Your blog and image upload will not work in production.');
  console.log('   Please set up Vercel KV and Blob services immediately.');
} else if (totalMissing > 0) {
  console.log('\n⚠️  Some optional variables are missing, but core functionality should work.');
} else {
  console.log('\n✅ All environment variables are configured!');
}

console.log('\n🚀 Next Steps:');
if (criticalMissing > 0) {
  console.log('1. Go to Vercel Dashboard → Storage → Create KV Database');
  console.log('2. Go to Vercel Dashboard → Storage → Create Blob Storage');
  console.log('3. Copy the environment variables to your project settings');
  console.log('4. Redeploy your application');
} else {
  console.log('1. Test your blog dashboard: https://www.aitoolsinsights.com/blog/dashboard');
  console.log('2. Try publishing a test article');
  console.log('3. Verify images upload correctly');
}

console.log('\n📖 For detailed instructions: IMMEDIATE_DEPLOYMENT_STEPS.md');