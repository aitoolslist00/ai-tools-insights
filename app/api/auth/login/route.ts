import { NextRequest } from 'next/server'
import { checkAuth, createJWT } from '@/lib/auth-enhanced'
import { rateLimiter, createRateLimitResponse } from '@/lib/rate-limiter'
import { ApiResponseBuilder, handleApiError } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    // Apply strict rate limiting for login attempts
    const rateLimit = rateLimiter.checkRateLimit(request, 5, 15 * 60 * 1000) // 5 attempts per 15 minutes
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit.resetTime)
    }

    const { username, password } = await request.json()

    if (!username || !password) {
      return ApiResponseBuilder.validationError({
        username: username ? undefined : 'Username is required',
        password: password ? undefined : 'Password is required'
      })
    }

    const isValid = await checkAuth(username, password)
    
    if (!isValid) {
      // Add a small delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 1000))
      return ApiResponseBuilder.unauthorized('Invalid credentials')
    }

    const token = await createJWT(username)
    
    return ApiResponseBuilder.success(
      { token, expiresIn: '24h' },
      'Login successful'
    )
  } catch (error) {
    return handleApiError(error)
  }
}