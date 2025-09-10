import { NextRequest } from 'next/server'

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private static instance: RateLimiter
  private requests: Map<string, RateLimitEntry> = new Map()
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter()
    }
    return RateLimiter.instance
  }

  private getClientId(request: NextRequest): string {
    // Try to get real IP from various headers
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const cfConnectingIp = request.headers.get('cf-connecting-ip')
    
    const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'
    
    // Include user agent for additional uniqueness
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    return `${ip}-${Buffer.from(userAgent).toString('base64').slice(0, 10)}`
  }

  private cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []
    
    this.requests.forEach((entry, key) => {
      if (now > entry.resetTime) {
        keysToDelete.push(key)
      }
    })
    
    keysToDelete.forEach(key => {
      this.requests.delete(key)
    })
  }

  checkRateLimit(
    request: NextRequest,
    maxRequests: number = 100,
    windowMs: number = 15 * 60 * 1000 // 15 minutes
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const clientId = this.getClientId(request)
    const now = Date.now()
    const resetTime = now + windowMs

    let entry = this.requests.get(clientId)

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      entry = { count: 1, resetTime }
      this.requests.set(clientId, entry)
      return { allowed: true, remaining: maxRequests - 1, resetTime }
    }

    entry.count++

    if (entry.count > maxRequests) {
      return { allowed: false, remaining: 0, resetTime: entry.resetTime }
    }

    return { allowed: true, remaining: maxRequests - entry.count, resetTime: entry.resetTime }
  }

  // Stricter rate limiting for write operations
  checkWriteRateLimit(request: NextRequest): { allowed: boolean; remaining: number; resetTime: number } {
    return this.checkRateLimit(request, 20, 15 * 60 * 1000) // 20 requests per 15 minutes
  }

  // More lenient for read operations
  checkReadRateLimit(request: NextRequest): { allowed: boolean; remaining: number; resetTime: number } {
    return this.checkRateLimit(request, 200, 15 * 60 * 1000) // 200 requests per 15 minutes
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
  }
}

export const rateLimiter = RateLimiter.getInstance()

export function createRateLimitResponse(resetTime: number) {
  return new Response(
    JSON.stringify({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      resetTime: new Date(resetTime).toISOString()
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
        'X-RateLimit-Reset': resetTime.toString()
      }
    }
  )
}