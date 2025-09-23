import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    timestamp: string
    requestId?: string
    pagination?: {
      page: number
      limit: number
      total: number
      hasMore: boolean
    }
  }
}

export class ApiResponseBuilder {
  static success<T>(data: T, message?: string, meta?: any): NextResponse<ApiResponse<T>> {
    return NextResponse.json({
      success: true,
      data,
      message,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta
      }
    })
  }

  static error(
    error: string,
    status: number = 500,
    details?: any
  ): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error,
        meta: {
          timestamp: new Date().toISOString(),
          details: process.env.NODE_ENV === 'development' ? details : undefined
        }
      },
      { status }
    )
  }

  static validationError(errors: any): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        meta: {
          timestamp: new Date().toISOString(),
          validationErrors: errors
        }
      },
      { status: 400 }
    )
  }

  static unauthorized(message: string = 'Unauthorized'): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error: message,
        meta: {
          timestamp: new Date().toISOString()
        }
      },
      { status: 401 }
    )
  }

  static notFound(resource: string = 'Resource'): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error: `${resource} not found`,
        meta: {
          timestamp: new Date().toISOString()
        }
      },
      { status: 404 }
    )
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
  ): NextResponse<ApiResponse<T[]>> {
    return NextResponse.json({
      success: true,
      data,
      message,
      meta: {
        timestamp: new Date().toISOString(),
        pagination: {
          page,
          limit,
          total,
          hasMore: page * limit < total
        }
      }
    })
  }
}

export function handleApiError(error: any): NextResponse<ApiResponse> {
  console.error('API Error:', error)

  if (error.name === 'ValidationError') {
    return ApiResponseBuilder.validationError(error.errors)
  }

  if (error.message?.includes('not found')) {
    return ApiResponseBuilder.notFound()
  }

  if (error.message?.includes('Unauthorized')) {
    return ApiResponseBuilder.unauthorized()
  }

  return ApiResponseBuilder.error(
    process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Internal server error',
    500,
    error
  )
}