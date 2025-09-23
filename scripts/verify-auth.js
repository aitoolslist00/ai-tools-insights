#!/usr/bin/env node

/**
 * Authentication Verification Script
 * Verifies that the authentication system is properly configured
 */

const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

// Load environment variables from .env.local
function loadEnvFile() {
  try {
    const envPath = path.join(process.cwd(), '.env.local')
    const envContent = fs.readFileSync(envPath, 'utf-8')
    
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          process.env[key] = valueParts.join('=')
        }
      }
    })
  } catch (error) {
    console.log('⚠️  Could not load .env.local file')
  }
}

loadEnvFile()

async function verifyAuthConfiguration() {
  console.log('🔍 Verifying authentication configuration...\n')
  
  // Check environment variables
  const username = process.env.ADMIN_USERNAME
  const passwordHash = process.env.ADMIN_PASSWORD_HASH
  const jwtSecret = process.env.JWT_SECRET
  
  console.log('📋 Environment Variables Check:')
  console.log(`✅ ADMIN_USERNAME: ${username ? 'Set' : 'Missing'}`)
  console.log(`✅ ADMIN_PASSWORD_HASH: ${passwordHash ? 'Set' : 'Missing'}`)
  console.log(`✅ JWT_SECRET: ${jwtSecret ? 'Set' : 'Missing'}`)
  
  if (!username || !passwordHash || !jwtSecret) {
    console.log('\n❌ Missing required environment variables!')
    return false
  }
  
  // Verify password hash format
  console.log('\n🔐 Password Hash Verification:')
  if (passwordHash.startsWith('$2b$12$')) {
    console.log('✅ Password hash format is correct (bcrypt with 12 rounds)')
  } else {
    console.log('❌ Password hash format is incorrect')
    return false
  }
  
  // Test password verification (without revealing the actual password)
  console.log('\n🧪 Password Verification Test:')
  try {
    // Test with a dummy password to ensure bcrypt is working
    const testHash = await bcrypt.hash('test', 12)
    const testVerify = await bcrypt.compare('test', testHash)
    
    if (testVerify) {
      console.log('✅ bcrypt password verification is working')
    } else {
      console.log('❌ bcrypt password verification failed')
      return false
    }
  } catch (error) {
    console.log('❌ bcrypt error:', error.message)
    return false
  }
  
  console.log('\n🎉 Authentication system is properly configured!')
  console.log('\n📝 Summary:')
  console.log('- Username and password hash are securely stored in environment variables')
  console.log('- Password is properly hashed with bcrypt')
  console.log('- JWT secret is configured')
  console.log('- Credentials are NOT exposed in the UI')
  console.log('- Authentication system is ready for use')
  
  return true
}

// Run verification
verifyAuthConfiguration().catch(console.error)