const bcrypt = require('bcryptjs');

async function generatePasswordHash() {
  const password = '140796Aa@@##**';
  const saltRounds = 12;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Password:', password);
    console.log('Hash:', hash);
    
    // Verify the hash works
    const isValid = await bcrypt.compare(password, hash);
    console.log('Verification:', isValid ? 'SUCCESS' : 'FAILED');
    
    return hash;
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generatePasswordHash();