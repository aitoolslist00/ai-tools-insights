import { NextRequest, NextResponse } from 'next/server'
import { checkAuth, createJWT } from '@/lib/auth-enhanced'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log('Login attempt:', { username, passwordLength: password?.length })

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
    }

    const isValid = await checkAuth(username, password)
    
    console.log('Auth check result:', isValid)
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await createJWT(username)

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          username,
          isAdmin: true
        }
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Admin Login API',
    version: '1.0'
  })
}