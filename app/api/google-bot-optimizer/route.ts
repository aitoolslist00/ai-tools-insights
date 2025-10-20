import { NextRequest, NextResponse } from 'next/server'
import { GoogleBotAnalyzer } from '@/lib/google-bot-analyzer'
import { AdvancedContentOptimizer } from '@/lib/advanced-content-optimizer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Google Bot Optimization API
 * Analyzes and optimizes content for 95%+ Google Bot understanding
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      action, 
      title, 
      content, 
      primaryKeyword, 
      metaDescription, 
      slug,
      targetScore = 95
    } = body

    // Validate required fields
    if (!primaryKeyword || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: primaryKeyword, title, and content are required' },
        { status: 400 }
      )
    }

    // Action: analyze
    if (action === 'analyze') {
      const analysis = GoogleBotAnalyzer.analyzeKeywordUnderstanding(
        content,
        title,
        primaryKeyword,
        metaDescription || '',
        slug || ''
      )

      const suggestions = GoogleBotAnalyzer.generateOptimizationSuggestions(analysis)

      return NextResponse.json({
        success: true,
        analysis,
        suggestions,
        target: targetScore,
        needsOptimization: analysis.understandingScore < targetScore
      })
    }

    // Action: optimize
    if (action === 'optimize') {
      const result = await AdvancedContentOptimizer.optimizeToTarget(
        title,
        content,
        primaryKeyword,
        metaDescription || '',
        slug || '',
        targetScore
      )

      return NextResponse.json({
        success: true,
        result
      })
    }

    // Action: analyze-and-optimize (complete workflow)
    if (action === 'analyze-and-optimize') {
      // First analyze
      const initialAnalysis = GoogleBotAnalyzer.analyzeKeywordUnderstanding(
        content,
        title,
        primaryKeyword,
        metaDescription || '',
        slug || ''
      )

      console.log(`📊 Initial Analysis: ${initialAnalysis.understandingScore}% understanding score`)
      console.log(`🎯 Target: ${targetScore}%`)

      // If already at target, return analysis only
      if (initialAnalysis.understandingScore >= targetScore) {
        return NextResponse.json({
          success: true,
          alreadyOptimized: true,
          analysis: initialAnalysis,
          message: `Content already meets target score (${initialAnalysis.understandingScore}% >= ${targetScore}%)`
        })
      }

      // Optimize to target
      console.log(`🚀 Starting optimization...`)
      const optimizationResult = await AdvancedContentOptimizer.optimizeToTarget(
        title,
        content,
        primaryKeyword,
        metaDescription || '',
        slug || '',
        targetScore
      )

      console.log(`✅ Optimization complete: ${optimizationResult.optimizedScore}%`)

      return NextResponse.json({
        success: true,
        alreadyOptimized: false,
        result: optimizationResult
      })
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: analyze, optimize, or analyze-and-optimize' },
      { status: 400 }
    )

  } catch (error) {
    console.error('❌ Google Bot Optimizer Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}