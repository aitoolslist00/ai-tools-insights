import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
    const kvUrl = process.env.KV_REST_API_URL
    const kvToken = process.env.KV_REST_API_TOKEN
    const kvConfigured = !!(kvUrl && kvToken)
    
    // Test KV connection if configured
    let kvStatus = 'not-configured'
    let kvError = null
    
    if (kvConfigured) {
      try {
        // Try to import and test KV
        const { kv } = await import('@vercel/kv')
        await kv.ping()
        kvStatus = 'connected'
      } catch (error) {
        kvStatus = 'error'
        kvError = error instanceof Error ? error.message : 'Unknown error'
      }
    }
    
    const config = {
      environment: isProduction ? 'production' : 'development',
      kv: {
        configured: kvConfigured,
        status: kvStatus,
        error: kvError,
        hasUrl: !!kvUrl,
        hasToken: !!kvToken,
        urlPreview: kvUrl ? `${kvUrl.substring(0, 20)}...` : null
      },
      vercel: {
        isVercel: !!process.env.VERCEL,
        region: process.env.VERCEL_REGION || null,
        env: process.env.VERCEL_ENV || null
      },
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('❌ Config check error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}