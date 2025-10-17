const bcrypt = require('bcryptjs');

const password = '140796Aa@@##**';
const envHash = '$2b$12$9w/.lOq23ZAUsYrYc/UNZOeXlXCGgYv9JSsB5MiqoALOTMSBX7302'; // from .env.local
const fallbackHash = '$2b$12$R5xQjIxlAeA0y0XvftLL4O5oFHV893.Zkyr1ZRn2kAV2aEGngwAsC'; // from code

async function test() {
  console.log('Testing password:', password);
  console.log('\n--- .env.local hash ---');
  const envResult = await bcrypt.compare(password, envHash);
  console.log('Result:', envResult ? '✓ MATCH' : '✗ NO MATCH');
  
  console.log('\n--- Code fallback hash ---');
  const fallbackResult = await bcrypt.compare(password, fallbackHash);
  console.log('Result:', fallbackResult ? '✓ MATCH' : '✗ NO MATCH');
  
  console.log('\n=== CONCLUSION ===');
  if (envResult && !fallbackResult) {
    console.log('✓ Environment variable is working');
  } else if (!envResult && fallbackResult) {
    console.log('⚠ Using FALLBACK hash - environment variable NOT loaded!');
  } else if (envResult && fallbackResult) {
    console.log('✓ Both hashes match (unlikely but possible)');
  } else {
    console.log('✗ Neither hash matches - wrong password!');
  }
}

test();