const bcrypt = require('bcryptjs')

async function testAuth() {
  const password = 'ahmedibrahim'
  const hash = '$2b$12$YzgAzvsa48RtqclLs0LNgeRRMiItxoh9ZwDmuFzY3irIwqQ88pdFG'
  
  console.log('Testing password verification...')
  console.log('Password:', password)
  console.log('Hash:', hash)
  
  const isValid = await bcrypt.compare(password, hash)
  console.log('Is valid:', isValid)
  
  if (!isValid) {
    console.log('Creating new hash...')
    const newHash = await bcrypt.hash(password, 12)
    console.log('New hash:', newHash)
  }
}

testAuth().catch(console.error)