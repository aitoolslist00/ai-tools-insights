#!/usr/bin/env node

/**
 * Automated Gmail App Password Setup Helper
 * This script helps you set up Gmail App Password automatically
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🎯 AI Tools Insights - Automated Gmail Setup');
console.log('===============================================\n');

console.log('📧 Setting up email system for: insightsaitools@gmail.com\n');

console.log('🔐 STEP 1: Gmail App Password Setup');
console.log('-----------------------------------');
console.log('1. Open: https://myaccount.google.com/security');
console.log('2. Enable 2-Factor Authentication (if not already enabled)');
console.log('3. Go to: https://myaccount.google.com/apppasswords');
console.log('4. Select "Mail" → "Other" → Name it "AI Tools Insights"');
console.log('5. Copy the 16-character password (format: abcd efgh ijkl mnop)\n');

rl.question('📋 Enter your Gmail App Password (16 characters with spaces): ', (appPassword) => {
  if (!appPassword || appPassword.length < 16) {
    console.log('\n❌ Invalid app password. Please enter the full 16-character password.\n');
    rl.close();
    return;
  }

  // Update .env.local file
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Replace placeholder with actual password
  envContent = envContent.replace('your_gmail_app_password_here', appPassword);
  
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Gmail App Password saved to .env.local');
  
  // Create production environment variables file
  const prodEnvContent = `# Production Environment Variables for Vercel
# Copy these to your Vercel Dashboard → Settings → Environment Variables

SMTP_USER=insightsaitools@gmail.com
SMTP_PASS=${appPassword}
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
NEXT_PUBLIC_BASE_URL=https://www.aitoolsinsights.com
NEXT_PUBLIC_CONTACT_EMAIL=insightsaitools@gmail.com
NEXTAUTH_SECRET=ai-tools-insights-contact-system-2024
`;

  fs.writeFileSync('.env.production', prodEnvContent);
  console.log('✅ Production environment variables saved to .env.production');
  
  console.log('\n🚀 SETUP COMPLETE!');
  console.log('==================');
  console.log('✅ Gmail App Password configured');
  console.log('✅ Local environment variables set');  
  console.log('✅ Production variables ready for Vercel');
  console.log('✅ Contact system ready to use');
  
  console.log('\n📋 Next Steps:');
  console.log('1. Test the contact form: npm run dev');
  console.log('2. For production: Copy .env.production to Vercel Dashboard');
  console.log('3. Deploy: vercel --prod');
  
  console.log('\n📧 Contact form will now send emails to: insightsaitools@gmail.com');
  console.log('📤 Users will receive auto-reply confirmations');
  
  rl.close();
});