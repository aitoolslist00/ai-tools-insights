import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { metric, value, pathname, userAgent, timestamp } = data

    // Validate required fields
    if (!metric || value === undefined || !pathname) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Log web vitals data (in production, you'd save to database)
    const webVitalsEntry = {
      metric,
      value,
      pathname,
      userAgent: userAgent || 'unknown',
      timestamp: timestamp || Date.now(),
      severity: getSeverity(metric, value),
      date: new Date().toISOString()
    }

    // In production, save to your analytics database
    console.log('Web Vitals Data:', webVitalsEntry)

    // You could also send to external analytics services
    await sendToExternalAnalytics(webVitalsEntry)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing web vitals data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getSeverity(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = {
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    INP: { good: 200, poor: 500 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 }
  }

  const threshold = thresholds[metric as keyof typeof thresholds]
  if (!threshold) return 'good'

  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

async function sendToExternalAnalytics(data: any) {
  // Example: Send to Google Analytics Measurement Protocol
  // or other analytics services like Mixpanel, Amplitude, etc.
  
  try {
    // Google Analytics 4 Measurement Protocol example
    if (process.env.GA_MEASUREMENT_ID && process.env.GA_API_SECRET) {
      const response = await fetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`,
        {
          method: 'POST',
          body: JSON.stringify({
            client_id: 'web-vitals-monitor',
            events: [{
              name: 'web_vitals',
              params: {
                metric_name: data.metric,
                metric_value: data.value,
                page_path: data.pathname,
                severity: data.severity
              }
            }]
          })
        }
      )
    }

    // Example: Send to custom webhook
    if (process.env.ANALYTICS_WEBHOOK_URL) {
      await fetch(process.env.ANALYTICS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    }
  } catch (error) {
    console.error('Error sending to external analytics:', error)
  }
}