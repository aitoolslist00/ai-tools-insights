import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
    ADMIN_PASSWORD_HASH_LENGTH: process.env.ADMIN_PASSWORD_HASH?.length,
    JWT_SECRET_EXISTS: !!process.env.JWT_SECRET,
    ALL_ENV_KEYS: Object.keys(process.env).filter(k => k.startsWith('ADMIN') || k === 'JWT_SECRET')
  })
}