import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { metric, value, url, timestamp } = body

    // Log metrics for debugging (in production, you might want to store these in a database)
    console.log('📊 Metrics received:', {
      metric,
      value,
      url,
      timestamp: new Date(timestamp).toISOString()
    })

    // Here you could store metrics in a database, send to analytics service, etc.
    // For now, we'll just acknowledge receipt
    
    return NextResponse.json({ 
      success: true, 
      message: 'Metric recorded successfully' 
    })
  } catch (error) {
    console.error('❌ Error processing metrics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process metrics' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Return basic metrics info
  return NextResponse.json({
    success: true,
    message: 'Metrics endpoint is active',
    timestamp: new Date().toISOString()
  })
}