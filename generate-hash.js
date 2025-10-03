const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = '140796Aa@@##**';
  const hash = await bcrypt.hash(password, 12);
  console.log('Generated hash:', hash);
  console.log('Hash length:', hash.length);
  
  // Test the hash
  const isValid = await bcrypt.compare(password, hash);
  console.log('Hash validation:', isValid);
}

generateHash().catch(console.error);