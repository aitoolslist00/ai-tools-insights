// Test what environment variables the server sees
async function testEnvVars() {
  try {
    const response = await fetch('http://localhost:3000/api/test-env', {
      method: 'GET',
    });
    
    const data = await response.json();
    console.log('Environment Variables Test:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testEnvVars();