const bcrypt = require('bcryptjs')

async function debugAuth() {
  const username = 'ahmedibrahim'
  const password = 'ahmedibrahim'
  const hash = '$2b$12$iQe1bN9Fv.gZrZxk63avNuKdd9uH2W.QniAQnRrz4x/E/jaIqrd7C'
  
  console.log('=== Auth Debug ===')
  console.log('Username:', username)
  console.log('Password:', password)
  console.log('Hash:', hash)
  
  // Test the credentials
  const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64')
  console.log('Base64 credentials:', base64Credentials)
  
  // Decode to verify
  const decoded = Buffer.from(base64Credentials, 'base64').toString('ascii')
  console.log('Decoded credentials:', decoded)
  
  const [decodedUsername, decodedPassword] = decoded.split(':')
  console.log('Decoded username:', decodedUsername)
  console.log('Decoded password:', decodedPassword)
  
  // Test bcrypt
  console.log('Testing bcrypt...')
  const isValid = await bcrypt.compare(decodedPassword, hash)
  console.log('Bcrypt result:', isValid)
  
  // Test environment variables
  console.log('Environment check:')
  console.log('ADMIN_USERNAME:', process.env.ADMIN_USERNAME)
  console.log('ADMIN_PASSWORD_HASH:', process.env.ADMIN_PASSWORD_HASH)
}

debugAuth().catch(console.error)