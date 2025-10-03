import { NextRequest, NextResponse } from 'next/server'
import { validateApiAuth } from '@/lib/auth-enhanced'

export async function GET(request: NextRequest) {
  const isAuthenticated = await validateApiAuth(request)
  
  return NextResponse.json({
    authenticated: isAuthenticated,
    authHeader: request.headers.get('authorization'),
    method: 'GET'
  })
}

export async function POST(request: NextRequest) {
  const isAuthenticated = await validateApiAuth(request)
  
  return NextResponse.json({
    authenticated: isAuthenticated,
    authHeader: request.headers.get('authorization'),
    method: 'POST'
  })
}