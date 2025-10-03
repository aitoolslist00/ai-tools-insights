const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function testAdminLogin() {
  const username = 'ahmedibrahim';
  const password = '140796Aa@@##**';
  
  const envUsername = process.env.ADMIN_USERNAME;
  const envPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  
  console.log('Testing Admin Login...');
  console.log('Username from env:', envUsername);
  console.log('Password hash from env:', envPasswordHash);
  console.log('');
  
  // Test username
  const usernameMatch = username === envUsername;
  console.log('Username match:', usernameMatch ? 'SUCCESS' : 'FAILED');
  
  // Test password
  if (envPasswordHash) {
    try {
      const passwordMatch = await bcrypt.compare(password, envPasswordHash);
      console.log('Password match:', passwordMatch ? 'SUCCESS' : 'FAILED');
      
      if (usernameMatch && passwordMatch) {
        console.log('\n✅ ADMIN LOGIN TEST: SUCCESS');
        console.log('You can now login with:');
        console.log('Username: ahmedibrahim');
        console.log('Password: 140796Aa@@##**');
      } else {
        console.log('\n❌ ADMIN LOGIN TEST: FAILED');
      }
    } catch (error) {
      console.error('Error testing password:', error);
    }
  } else {
    console.log('❌ No password hash found in environment');
  }
}

testAdminLogin();