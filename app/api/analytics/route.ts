import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Log performance metrics
    console.log('Performance Metric:', {
      name: data.name,
      value: data.value,
      id: data.id,
      timestamp: new Date().toISOString(),
      url: data.url || 'unknown'
    })
    
    // Here you can send data to your analytics service
    // Examples: Google Analytics, Vercel Analytics, DataDog, etc.
    
    // For now, we'll just log it
    if (process.env.NODE_ENV === 'production') {
      // Send to your analytics service
      // await sendToAnalytics(data)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to process analytics data' },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint for health check
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  })
}