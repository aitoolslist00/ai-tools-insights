import { NextRequest, NextResponse } from 'next/server'

interface IntentMetrics {
  timeOnPage: number
  scrollDepth: number
  engagementScore: number
  bounceRate: number
  taskCompletion: boolean
  userSatisfaction: number
  pageType: string
  contentType?: string
  keywords: string[]
  timestamp: string
  userAgent: string
  referrer: string
}

export async function POST(request: NextRequest) {
  try {
    const metrics: IntentMetrics = await request.json()
    
    // Validate required fields
    if (!metrics.pageType || !metrics.timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Log metrics for analysis (in production, send to analytics service)
    console.log('Intent Satisfaction Metrics:', {
      pageType: metrics.pageType,
      contentType: metrics.contentType,
      userSatisfaction: metrics.userSatisfaction,
      engagementScore: metrics.engagementScore,
      taskCompletion: metrics.taskCompletion,
      timeOnPage: metrics.timeOnPage,
      scrollDepth: metrics.scrollDepth,
      timestamp: metrics.timestamp
    })

    // Calculate Intent Satisfaction Score (ISS) for 2025 Algorithm
    const intentSatisfactionScore = calculateISS(metrics)
    
    // Get IP address from headers
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    // Store metrics (implement your preferred storage solution)
    await storeMetrics({
      ...metrics,
      intentSatisfactionScore,
      ip,
      country: 'unknown', // Geo data would need to be obtained from a separate service
      city: 'unknown'
    })

    // Send to external analytics if configured
    if (process.env.GOOGLE_ANALYTICS_ID) {
      await sendToGoogleAnalytics(metrics, intentSatisfactionScore)
    }

    return NextResponse.json({
      success: true,
      intentSatisfactionScore,
      message: 'Metrics recorded successfully'
    })

  } catch (error) {
    console.error('Error processing intent metrics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateISS(metrics: IntentMetrics): number {
  // Intent Satisfaction Score calculation based on 2025 algorithm factors
  let score = 0
  
  // Time engagement (30% weight)
  if (metrics.timeOnPage > 30) score += 30
  if (metrics.timeOnPage > 120) score += 20
  if (metrics.timeOnPage > 300) score += 10
  
  // Content consumption (25% weight)
  score += (metrics.scrollDepth / 100) * 25
  
  // User engagement (25% weight)
  score += (metrics.engagementScore / 100) * 25
  
  // Task completion (20% weight)
  if (metrics.taskCompletion) score += 20
  
  // Bounce rate penalty
  if (metrics.bounceRate > 80) score -= 10
  
  return Math.min(100, Math.max(0, score))
}

async function storeMetrics(metrics: IntentMetrics & { 
  intentSatisfactionScore: number
  ip: string
  country: string
  city: string
}) {
  // Implement your storage solution here
  // Examples: Database, file system, external service
  
  // For now, we'll just log to console
  // In production, you might want to:
  // - Store in a database (PostgreSQL, MongoDB, etc.)
  // - Send to analytics service (Google Analytics, Mixpanel, etc.)
  // - Store in a data warehouse for analysis
  
  console.log('Storing metrics:', {
    timestamp: metrics.timestamp,
    pageType: metrics.pageType,
    iss: metrics.intentSatisfactionScore,
    location: `${metrics.city}, ${metrics.country}`
  })
}

async function sendToGoogleAnalytics(
  metrics: IntentMetrics, 
  intentSatisfactionScore: number
) {
  try {
    // Send custom event to Google Analytics 4
    const measurementId = process.env.GOOGLE_ANALYTICS_ID
    const apiSecret = process.env.GOOGLE_ANALYTICS_API_SECRET
    
    if (!measurementId || !apiSecret) {
      console.warn('Google Analytics credentials not configured')
      return
    }

    const payload = {
      client_id: generateClientId(),
      events: [{
        name: 'intent_satisfaction_2025',
        params: {
          page_type: metrics.pageType,
          content_type: metrics.contentType || 'unknown',
          time_on_page: Math.round(metrics.timeOnPage),
          scroll_depth: metrics.scrollDepth,
          engagement_score: Math.round(metrics.engagementScore),
          task_completion: metrics.taskCompletion,
          user_satisfaction: Math.round(metrics.userSatisfaction),
          intent_satisfaction_score: Math.round(intentSatisfactionScore),
          keywords: metrics.keywords.join(','),
          custom_parameter_1: 'perspective_update_2025'
        }
      }]
    }

    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }
    )

    if (!response.ok) {
      console.error('Failed to send to Google Analytics:', response.statusText)
    }

  } catch (error) {
    console.error('Error sending to Google Analytics:', error)
  }
}

function generateClientId(): string {
  // Generate a unique client ID for analytics
  return 'client_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
}

// GET endpoint for retrieving aggregated metrics (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageType = searchParams.get('pageType')
    const timeframe = searchParams.get('timeframe') || '7d'
    
    // In a real implementation, you would query your database here
    // For now, return mock aggregated data
    const mockData = {
      averageIntentSatisfactionScore: 78.5,
      totalPageViews: 15420,
      averageTimeOnPage: 145,
      averageScrollDepth: 67,
      taskCompletionRate: 0.73,
      topPerformingPages: [
        { page: '/ai-tools/chatgpt', iss: 89.2 },
        { page: '/ai-tools/midjourney', iss: 86.7 },
        { page: '/blog/best-ai-tools-2025', iss: 84.3 }
      ],
      timeframe,
      pageType: pageType || 'all'
    }
    
    return NextResponse.json(mockData)
    
  } catch (error) {
    console.error('Error retrieving metrics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}