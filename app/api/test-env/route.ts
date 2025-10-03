import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH ? 'SET' : 'NOT SET',
    ADMIN_PASSWORD_HASH_LENGTH: process.env.ADMIN_PASSWORD_HASH?.length || 0,
    JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV
  })
}