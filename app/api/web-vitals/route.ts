import { NextRequest, NextResponse } from 'next/server'

interface WebVitalMetric {
  name: string
  value: number
  rating: string
  url: string
  timestamp: number
  userAgent: string
  connection: string
}

export async function POST(request: NextRequest) {
  try {
    const metric: WebVitalMetric = await request.json()

    // Validate the metric data
    if (!metric.name || typeof metric.value !== 'number' || !metric.url) {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      )
    }

    // Log the metric (in production, you'd store this in a database)
    console.log('Web Vital Metric:', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      url: metric.url,
      timestamp: new Date(metric.timestamp).toISOString(),
      userAgent: metric.userAgent,
      connection: metric.connection
    })

    // Calculate performance score based on 2025 standards
    const performanceScore = calculatePerformanceScore(metric)

    // Store in database (example with hypothetical database)
    // await storeMetric(metric)

    // Send to external analytics if needed
    if (process.env.ANALYTICS_ENDPOINT) {
      try {
        await fetch(process.env.ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ANALYTICS_TOKEN}`
          },
          body: JSON.stringify({
            ...metric,
            performanceScore,
            source: 'ai-tools-insights'
          })
        })
      } catch (error) {
        console.warn('Failed to send to external analytics:', error)
      }
    }

    return NextResponse.json({
      success: true,
      performanceScore,
      recommendations: getPerformanceRecommendations(metric)
    })

  } catch (error) {
    console.error('Error processing web vital metric:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculatePerformanceScore(metric: WebVitalMetric): number {
  switch (metric.name) {
    case 'LCP':
      // Largest Contentful Paint scoring (2025 standards)
      if (metric.value <= 2500) return 100
      if (metric.value <= 4000) return 75
      return 50

    case 'FID':
      // First Input Delay scoring
      if (metric.value <= 100) return 100
      if (metric.value <= 300) return 75
      return 50

    case 'CLS':
      // Cumulative Layout Shift scoring
      if (metric.value <= 0.1) return 100
      if (metric.value <= 0.25) return 75
      return 50

    case 'FCP':
      // First Contentful Paint scoring
      if (metric.value <= 1800) return 100
      if (metric.value <= 3000) return 75
      return 50

    case 'TTFB':
      // Time to First Byte scoring
      if (metric.value <= 800) return 100
      if (metric.value <= 1800) return 75
      return 50

    case 'INP':
      // Interaction to Next Paint scoring (2025 Core Web Vital)
      if (metric.value <= 200) return 100
      if (metric.value <= 500) return 75
      return 50

    default:
      return 0
  }
}

function getPerformanceRecommendations(metric: WebVitalMetric): string[] {
  const recommendations: string[] = []

  switch (metric.name) {
    case 'LCP':
      if (metric.value > 2500) {
        recommendations.push('Optimize images and use next-gen formats (WebP, AVIF)')
        recommendations.push('Implement critical resource preloading')
        recommendations.push('Optimize server response times')
        recommendations.push('Use a Content Delivery Network (CDN)')
      }
      break

    case 'FID':
      if (metric.value > 100) {
        recommendations.push('Reduce JavaScript execution time')
        recommendations.push('Split large JavaScript bundles')
        recommendations.push('Use web workers for heavy computations')
        recommendations.push('Optimize third-party scripts')
      }
      break

    case 'CLS':
      if (metric.value > 0.1) {
        recommendations.push('Set explicit dimensions for images and videos')
        recommendations.push('Reserve space for dynamic content')
        recommendations.push('Avoid inserting content above existing content')
        recommendations.push('Use CSS containment for layout stability')
      }
      break

    case 'INP':
      if (metric.value > 200) {
        recommendations.push('Optimize event handlers and reduce blocking time')
        recommendations.push('Use requestIdleCallback for non-critical tasks')
        recommendations.push('Implement virtual scrolling for large lists')
        recommendations.push('Debounce frequent user interactions')
      }
      break

    case 'TTFB':
      if (metric.value > 800) {
        recommendations.push('Optimize server-side rendering')
        recommendations.push('Use edge computing and CDN')
        recommendations.push('Implement efficient caching strategies')
        recommendations.push('Optimize database queries')
      }
      break
  }

  return recommendations
}

// GET endpoint for retrieving aggregated metrics
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const timeframe = url.searchParams.get('timeframe') || '24h'
    const metric = url.searchParams.get('metric')

    // In a real implementation, you'd query your database here
    const mockData = {
      timeframe,
      metrics: {
        lcp: { average: 2100, p75: 2800, p95: 4200 },
        fid: { average: 85, p75: 120, p95: 280 },
        cls: { average: 0.08, p75: 0.15, p95: 0.35 },
        inp: { average: 180, p75: 250, p95: 450 },
        fcp: { average: 1600, p75: 2200, p95: 3500 },
        ttfb: { average: 650, p75: 900, p95: 1500 }
      },
      overallScore: 87,
      trend: 'improving'
    }

    if (metric && mockData.metrics[metric as keyof typeof mockData.metrics]) {
      return NextResponse.json({
        metric,
        data: mockData.metrics[metric as keyof typeof mockData.metrics]
      })
    }

    return NextResponse.json(mockData)

  } catch (error) {
    console.error('Error retrieving web vitals data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}