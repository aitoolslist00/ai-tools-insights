#!/usr/bin/env node

/**
 * Blog Authentication Setup Script
 * 
 * This script helps you set up secure authentication for the blog dashboard.
 * Run with: node scripts/setup-auth.js
 */

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🔐 Blog Authentication Setup\n');

// Generate secure JWT secret
function generateJWTSecret() {
  return crypto.randomBytes(32).toString('hex');
}

// Hash password
async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

// Verify password
async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Main setup function
async function setupAuth() {
  try {
    // Get user input
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (query) => new Promise((resolve) => readline.question(query, resolve));

    console.log('Let\'s set up your blog dashboard authentication:\n');

    // Get username
    const username = await question('Enter admin username (default: admin): ') || 'admin';

    // Get password
    let password;
    while (!password || password.length < 8) {
      password = await question('Enter admin password (min 8 characters): ');
      if (!password || password.length < 8) {
        console.log('❌ Password must be at least 8 characters long.\n');
      }
    }

    // Confirm password
    const confirmPassword = await question('Confirm admin password: ');
    if (password !== confirmPassword) {
      console.log('❌ Passwords do not match. Please run the script again.');
      readline.close();
      return;
    }

    readline.close();

    console.log('\n🔄 Generating secure credentials...\n');

    // Generate credentials
    const passwordHash = await hashPassword(password);
    const jwtSecret = generateJWTSecret();

    // Verify the hash works
    const isValid = await verifyPassword(password, passwordHash);
    if (!isValid) {
      throw new Error('Password hash verification failed');
    }

    console.log('✅ Credentials generated successfully!\n');

    // Create .env.local content
    const envContent = `# Blog Dashboard Authentication
ADMIN_USERNAME=${username}
ADMIN_PASSWORD_HASH=${passwordHash}
JWT_SECRET=${jwtSecret}

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://www.aitoolslist.com
NEXT_PUBLIC_SITE_NAME=AI Tools List

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GTM_ID=

# Newsletter/Email Service (Optional)
MAILCHIMP_API_KEY=
MAILCHIMP_AUDIENCE_ID=

# Contact Form (Optional)
CONTACT_EMAIL=contact@aitoolslist.com

# Database (Optional - for future features)
DATABASE_URL=

# API Keys (Optional - for future integrations)
OPENAI_API_KEY=
`;

    // Write to .env.local
    const envPath = path.join(process.cwd(), '.env.local');
    fs.writeFileSync(envPath, envContent);

    console.log('📝 Environment file created: .env.local\n');

    // Display summary
    console.log('🎉 Setup Complete!\n');
    console.log('Your credentials:');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`Password Hash: ${passwordHash}`);
    console.log(`JWT Secret: ${jwtSecret}\n`);

    console.log('⚠️  IMPORTANT SECURITY NOTES:');
    console.log('1. Keep your .env.local file secure and never commit it to version control');
    console.log('2. Change the default password in production');
    console.log('3. Use a strong, unique JWT secret');
    console.log('4. Consider using environment variables in production instead of .env.local\n');

    console.log('🚀 You can now start your development server:');
    console.log('npm run dev\n');

    console.log('🔗 Access your blog dashboard at:');
    console.log('http://localhost:3000/blog/dashboard\n');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Test existing credentials
async function testCredentials() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    
    if (!fs.existsSync(envPath)) {
      console.log('❌ No .env.local file found. Run setup first.');
      return;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const usernameMatch = envContent.match(/ADMIN_USERNAME=(.+)/);
    const hashMatch = envContent.match(/ADMIN_PASSWORD_HASH=(.+)/);
    const secretMatch = envContent.match(/JWT_SECRET=(.+)/);

    if (!usernameMatch || !hashMatch || !secretMatch) {
      console.log('❌ Missing credentials in .env.local file.');
      return;
    }

    const username = usernameMatch[1];
    const hash = hashMatch[1];
    const secret = secretMatch[1];

    console.log('🔍 Testing existing credentials...\n');
    console.log(`Username: ${username}`);
    console.log(`Hash: ${hash.substring(0, 20)}...`);
    console.log(`JWT Secret: ${secret.substring(0, 10)}...\n`);

    // Test password prompt
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (query) => new Promise((resolve) => readline.question(query, resolve));
    const testPassword = await question('Enter password to test: ');
    readline.close();

    const isValid = await verifyPassword(testPassword, hash);
    
    if (isValid) {
      console.log('✅ Password is correct!');
    } else {
      console.log('❌ Password is incorrect.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'test':
    testCredentials();
    break;
  case 'setup':
  default:
    setupAuth();
    break;
}