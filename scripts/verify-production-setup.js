#!/usr/bin/env node

/**
 * Production Setup Verification Script
 * Checks if all required environment variables and services are configured
 */

const https = require('https');

console.log('🔍 Verifying Production Setup for AI Tools Insights Blog...\n');

// Check if we're in production environment
const isProduction = process.env.NODE_ENV === 'production';
console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);

// Required environment variables for production
const requiredEnvVars = [
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD_HASH', 
  'JWT_SECRET',
  'BLOG_STORAGE_TYPE',
  'UPLOAD_PROVIDER'
];

// Optional but recommended for production
const productionEnvVars = [
  'KV_REST_API_URL',
  'KV_REST_API_TOKEN',
  'BLOB_READ_WRITE_TOKEN'
];

console.log('\n📋 Checking Required Environment Variables:');
let missingRequired = [];
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`❌ ${varName}: Missing`);
    missingRequired.push(varName);
  }
});

console.log('\n📋 Checking Production Service Variables:');
let missingProduction = [];
productionEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`⚠️  ${varName}: Missing (required for production)`);
    missingProduction.push(varName);
  }
});

// Check blog storage configuration
console.log('\n🗄️  Blog Storage Configuration:');
const storageType = process.env.BLOG_STORAGE_TYPE || 'file';
console.log(`Storage Type: ${storageType}`);

if (storageType === 'vercel-kv') {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    console.log('✅ Vercel KV configured');
  } else {
    console.log('❌ Vercel KV not properly configured');
  }
} else {
  console.log('⚠️  Using file storage (not recommended for production)');
}

// Check upload configuration
console.log('\n📤 Upload Configuration:');
const uploadProvider = process.env.UPLOAD_PROVIDER || 'local';
console.log(`Upload Provider: ${uploadProvider}`);

if (uploadProvider === 'vercel-blob') {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    console.log('✅ Vercel Blob configured');
  } else {
    console.log('❌ Vercel Blob not properly configured');
  }
} else {
  console.log('⚠️  Using local storage (not recommended for production)');
}

// Test API endpoints
console.log('\n🌐 Testing API Endpoints:');

function testEndpoint(url, description) {
  return new Promise((resolve) => {
    const request = https.get(url, (res) => {
      console.log(`✅ ${description}: ${res.statusCode}`);
      resolve(true);
    });
    
    request.on('error', (err) => {
      console.log(`❌ ${description}: Error - ${err.message}`);
      resolve(false);
    });
    
    request.setTimeout(5000, () => {
      console.log(`⏱️  ${description}: Timeout`);
      request.destroy();
      resolve(false);
    });
  });
}

async function testAPIs() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aitoolsinsights.com';
  
  await testEndpoint(`${baseUrl}/api/blog`, 'Blog API');
  await testEndpoint(`${baseUrl}/api/blog/manage`, 'Blog Management API');
  await testEndpoint(`${baseUrl}/api/upload`, 'Upload API');
}

// Summary and recommendations
console.log('\n📊 Summary:');

if (missingRequired.length > 0) {
  console.log(`❌ Missing ${missingRequired.length} required environment variables`);
  console.log('   Required variables:', missingRequired.join(', '));
} else {
  console.log('✅ All required environment variables are set');
}

if (missingProduction.length > 0) {
  console.log(`⚠️  Missing ${missingProduction.length} production service variables`);
  console.log('   Production variables:', missingProduction.join(', '));
} else {
  console.log('✅ All production service variables are set');
}

console.log('\n🚀 Next Steps:');

if (missingRequired.length > 0 || missingProduction.length > 0) {
  console.log('1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables');
  console.log('2. Add the missing environment variables');
  console.log('3. If you need to set up Vercel KV or Blob:');
  console.log('   - Go to Vercel Dashboard → Storage → Create Database');
  console.log('   - Choose KV for blog storage and Blob for image uploads');
  console.log('   - Copy the environment variables to your project settings');
  console.log('4. Redeploy your application');
} else {
  console.log('✅ Configuration looks good! Testing API endpoints...');
  testAPIs().then(() => {
    console.log('\n✅ Setup verification complete!');
  });
}

console.log('\n📖 For detailed setup instructions, see: PRODUCTION_DEPLOYMENT_GUIDE.md');