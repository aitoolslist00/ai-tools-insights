// Simple authentication system for blog dashboard
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'your-secure-password-123' // Change this to your preferred password
}

export function checkAuth(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  
  const authData = localStorage.getItem('blog-auth')
  if (!authData) return false
  
  try {
    const { timestamp, authenticated } = JSON.parse(authData)
    const now = Date.now()
    const oneHour = 60 * 60 * 1000 // 1 hour in milliseconds
    
    // Check if authentication is still valid (1 hour)
    if (now - timestamp > oneHour) {
      localStorage.removeItem('blog-auth')
      return false
    }
    
    return authenticated === true
  } catch {
    return false
  }
}

export function setAuthenticated(): void {
  if (typeof window === 'undefined') return
  
  const authData = {
    authenticated: true,
    timestamp: Date.now()
  }
  localStorage.setItem('blog-auth', JSON.stringify(authData))
}

export function logout(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('blog-auth')
}