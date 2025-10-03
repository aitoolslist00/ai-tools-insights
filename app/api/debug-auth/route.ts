import { NextResponse } from 'next/server'
import { ADMIN_CREDENTIALS } from '@/lib/auth-enhanced'

export async function GET() {
  return NextResponse.json({
    username: ADMIN_CREDENTIALS.username,
    passwordHashLength: ADMIN_CREDENTIALS.passwordHash?.length,
    passwordHashStart: ADMIN_CREDENTIALS.passwordHash?.substring(0, 10),
    envUsername: process.env.ADMIN_USERNAME,
    envPasswordHashLength: process.env.ADMIN_PASSWORD_HASH?.length,
    envPasswordHashStart: process.env.ADMIN_PASSWORD_HASH?.substring(0, 10)
  })
}