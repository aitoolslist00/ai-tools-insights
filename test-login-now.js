const bcrypt = require('bcryptjs');

async function testLogin() {
  const username = 'ahmedibrahim';
  const password = '140796Aa@@##**';
  const hash = '$2b$12$5gw0ainaDCIsoKBmh3B23OP/WjvJxWc5ycm7ln8xdt2VxybTPYPvu';
  
  console.log('Testing credentials:');
  console.log('Username:', username);
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('');
  
  // Test hash verification
  const isValid = await bcrypt.compare(password, hash);
  console.log('✓ Hash verification:', isValid ? '✅ SUCCESS' : '❌ FAILED');
  
  // Test actual login API
  console.log('\nTesting login API...');
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    console.log('API Response Status:', response.status);
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    if (response.ok && data.success) {
      console.log('\n✅ LOGIN SUCCESSFUL! You can now use these credentials.');
    } else {
      console.log('\n❌ LOGIN FAILED');
    }
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testLogin();