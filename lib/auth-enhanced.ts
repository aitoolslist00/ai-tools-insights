import { NextRequest } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { AUTH_CONFIG } from './auth-config'

// Enhanced authentication system with JWT
// Using config file for password hash to avoid .env parsing issues with $ characters
export const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || AUTH_CONFIG.USERNAME,
  // Hash for password: 140796Aa@@##**
  passwordHash: AUTH_CONFIG.PASSWORD_HASH
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
)

export interface AuthSession {
  username: string
  isAdmin: boolean
  iat: number
  exp: number
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

export async function checkAuth(username: string, password: string): Promise<boolean> {
  console.log('Environment variables:', {
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
    hasPasswordHash: !!process.env.ADMIN_PASSWORD_HASH
  })
  
  console.log('checkAuth called with:', { 
    username, 
    expectedUsername: ADMIN_CREDENTIALS.username,
    passwordHash: ADMIN_CREDENTIALS.passwordHash,
    passwordHashLength: ADMIN_CREDENTIALS.passwordHash.length
  })
  
  if (username !== ADMIN_CREDENTIALS.username) {
    console.log('Username mismatch')
    return false
  }
  
  const result = await verifyPassword(password, ADMIN_CREDENTIALS.passwordHash)
  console.log('Password verification result:', result)
  return result
}

export async function createJWT(username: string): Promise<string> {
  const token = await new SignJWT({ 
    username, 
    isAdmin: true 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET)
  
  return token
}

export async function verifyJWT(token: string): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    
    // Validate the payload has the required properties
    if (
      typeof payload.username === 'string' &&
      typeof payload.isAdmin === 'boolean' &&
      typeof payload.iat === 'number' &&
      typeof payload.exp === 'number'
    ) {
      return {
        username: payload.username,
        isAdmin: payload.isAdmin,
        iat: payload.iat,
        exp: payload.exp
      }
    }
    
    return null
  } catch (error) {
    return null
  }
}

export async function validateApiAuth(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader) {
    return false
  }

  // Support both JWT and Basic auth for backward compatibility
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    const session = await verifyJWT(token)
    return session !== null && session.isAdmin
  }
  
  if (authHeader.startsWith('Basic ')) {
    const base64Credentials = authHeader.substring(6)
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')
    return await checkAuth(username, password)
  }
  
  return false
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  
  const token = localStorage.getItem('blog-auth-token')
  if (!token) return false
  
  try {
    // Basic JWT validation on client side (full validation on server)
    const payload = JSON.parse(atob(token.split('.')[1]))
    const now = Math.floor(Date.now() / 1000)
    
    if (payload.exp < now) {
      localStorage.removeItem('blog-auth-token')
      return false
    }
    
    return payload.isAdmin === true
  } catch {
    localStorage.removeItem('blog-auth-token')
    return false
  }
}

export function setAuthenticated(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('blog-auth-token', token)
}

export function logout(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('blog-auth-token')
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('blog-auth-token')
}