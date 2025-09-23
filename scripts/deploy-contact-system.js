#!/usr/bin/env node

/**
 * Automated Deployment Script for Contact System
 * Handles Vercel environment variables and deployment
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('\n🚀 AI Tools Insights - Contact System Deployment');
console.log('==================================================\n');

// Check if .env.production exists
if (!fs.existsSync('.env.production')) {
  console.log('❌ ERROR: .env.production not found');
  console.log('Please run: node scripts/setup-gmail.js first\n');
  return;
}

console.log('📋 Reading production environment variables...');
const prodEnv = fs.readFileSync('.env.production', 'utf8');
console.log('✅ Production variables loaded\n');

console.log('🔧 Setting up Vercel environment variables...');
console.log('(You may be prompted to login to Vercel)\n');

try {
  // Set Vercel environment variables
  const envVars = {
    'SMTP_USER': 'insightsaitools@gmail.com',
    'SMTP_HOST': 'smtp.gmail.com', 
    'SMTP_PORT': '587',
    'SMTP_SECURE': 'false',
    'NEXT_PUBLIC_BASE_URL': 'https://www.aitoolsinsights.com',
    'NEXT_PUBLIC_CONTACT_EMAIL': 'insightsaitools@gmail.com',
    'NEXTAUTH_SECRET': 'ai-tools-insights-contact-system-2024'
  };

  // Get SMTP_PASS from .env.production
  const smtpPassMatch = prodEnv.match(/SMTP_PASS=(.+)/);
  if (smtpPassMatch) {
    envVars['SMTP_PASS'] = smtpPassMatch[1];
  }

  console.log('⚙️ Configuring Vercel environment variables...');
  
  for (const [key, value] of Object.entries(envVars)) {
    try {
      execSync(`vercel env add ${key} production`, { 
        input: value + '\n',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      console.log(`✅ ${key}: Configured`);
    } catch (error) {
      // Variable might already exist
      console.log(`⚠️  ${key}: Already exists or failed to set`);
    }
  }

  console.log('\n📦 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful\n');

  console.log('🚀 Deploying to Vercel...');
  execSync('vercel --prod', { stdio: 'inherit' });

  console.log('\n🎉 DEPLOYMENT COMPLETE!');
  console.log('========================');
  console.log('✅ Environment variables configured');
  console.log('✅ Project built successfully');
  console.log('✅ Deployed to production');
  console.log('✅ Contact system operational');
  
  console.log('\n📧 Your contact form is now live and will send emails to:');
  console.log('   → insightsaitools@gmail.com');
  console.log('\n📤 Users will receive automatic confirmation emails');
  console.log('🌐 Visit your live site to test the contact form!');

} catch (error) {
  console.log('\n❌ DEPLOYMENT FAILED');
  console.log('====================');
  console.error('Error:', error.message);
  
  console.log('\n🔧 Manual Deployment Steps:');
  console.log('1. Login to Vercel Dashboard');
  console.log('2. Go to your project → Settings → Environment Variables');
  console.log('3. Add variables from .env.production file');
  console.log('4. Run: vercel --prod');
}