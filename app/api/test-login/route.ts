import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function GET() {
  const username = process.env.ADMIN_USERNAME
  const hash = process.env.ADMIN_PASSWORD_HASH
  const password = '140796Aa@@##**'
  
  console.log('=== DEBUG INFO ===')
  console.log('Username from env:', username)
  console.log('Hash from env:', hash)
  console.log('Hash length:', hash?.length)
  
  let verificationResult = false
  let error = null
  
  try {
    if (hash) {
      verificationResult = await bcrypt.compare(password, hash)
      console.log('Bcrypt verification:', verificationResult)
    }
  } catch (e: any) {
    error = e.message
    console.error('Bcrypt error:', e)
  }
  
  return NextResponse.json({
    username,
    hashLength: hash?.length,
    hashStart: hash?.substring(0, 20),
    verificationResult,
    error,
    testPassword: password
  })
}