import { NextRequest } from 'next/server'
import { checkAuth } from './auth-enhanced'

export async function validateApiAuth(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false
  }

  try {
    const base64Credentials = authHeader.slice(6)
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')
    
    return await checkAuth(username, password)
  } catch {
    return false
  }
}

export function createAuthHeader(username: string, password: string): string {
  const credentials = Buffer.from(`${username}:${password}`).toString('base64')
  return `Basic ${credentials}`
}