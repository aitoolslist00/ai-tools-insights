import { NextRequest, NextResponse } from 'next/server'
import { aiToolsData } from '@/lib/tools-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let filteredTools = [...aiToolsData]

    // Filter by category if provided
    if (category && category !== 'all') {
      filteredTools = filteredTools.filter(tool => 
        tool.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase()
      filteredTools = filteredTools.filter(tool => 
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.category.toLowerCase().includes(searchLower) ||
        tool.features.some(feature => feature.toLowerCase().includes(searchLower)) ||
        tool.useCases.some(useCase => useCase.toLowerCase().includes(searchLower))
      )
    }

    // Apply pagination
    const total = filteredTools.length
    const paginatedTools = filteredTools.slice(offset, offset + limit)

    return NextResponse.json({
      tools: paginatedTools,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Error fetching tools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    )
  }
}

// HEAD request support for prefetching
export async function HEAD() {
  return new Response(null, { 
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}