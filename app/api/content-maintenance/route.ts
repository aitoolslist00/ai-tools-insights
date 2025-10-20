import { NextRequest, NextResponse } from 'next/server'
import { ContentMaintenanceSystem } from '@/lib/content-maintenance-system'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Content Maintenance API
 * Automatically maintains and updates content with latest news
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, contentId, title, content, primaryKeyword, metaDescription, slug, publishedDate } = body

    // Action: health-check
    if (action === 'health-check') {
      if (!contentId || !title || !content || !primaryKeyword || !publishedDate) {
        return NextResponse.json(
          { error: 'Missing required fields for health check' },
          { status: 400 }
        )
      }

      const healthCheck = await ContentMaintenanceSystem.checkContentHealth(
        contentId,
        title,
        content,
        primaryKeyword,
        new Date(publishedDate)
      )

      return NextResponse.json({
        success: true,
        healthCheck
      })
    }

    // Action: maintain
    if (action === 'maintain') {
      if (!contentId || !title || !content || !primaryKeyword) {
        return NextResponse.json(
          { error: 'Missing required fields for maintenance' },
          { status: 400 }
        )
      }

      const result = await ContentMaintenanceSystem.performMaintenance(
        contentId,
        title,
        content,
        primaryKeyword,
        metaDescription || '',
        slug || ''
      )

      return NextResponse.json({
        success: true,
        result
      })
    }

    // Action: batch-check (check multiple content items)
    if (action === 'batch-check') {
      const { contentItems } = body

      if (!contentItems || !Array.isArray(contentItems)) {
        return NextResponse.json(
          { error: 'contentItems array is required for batch check' },
          { status: 400 }
        )
      }

      const healthChecks = await ContentMaintenanceSystem.batchHealthCheck(
        contentItems.map((item: any) => ({
          ...item,
          publishedDate: new Date(item.publishedDate)
        }))
      )

      return NextResponse.json({
        success: true,
        healthChecks,
        summary: {
          total: healthChecks.length,
          needsUpdate: healthChecks.filter(h => h.needsUpdate).length,
          highPriority: healthChecks.filter(h => h.updatePriority === 'high').length,
          mediumPriority: healthChecks.filter(h => h.updatePriority === 'medium').length,
          lowPriority: healthChecks.filter(h => h.updatePriority === 'low').length
        }
      })
    }

    // Action: auto-maintain-all (maintenance for all blog posts)
    if (action === 'auto-maintain-all') {
      try {
        // Read blog posts
        const blogPostsPath = join(process.cwd(), 'blog-posts.json')
        const blogPostsData = readFileSync(blogPostsPath, 'utf-8')
        const blogPosts = JSON.parse(blogPostsData)

        let maintained = 0
        let failed = 0
        const results = []

        for (const post of blogPosts) {
          try {
            // Check if post needs maintenance
            const healthCheck = await ContentMaintenanceSystem.checkContentHealth(
              post.id,
              post.title,
              post.content,
              post.seo?.focusKeyword || post.title,
              new Date(post.date)
            )

            if (healthCheck.needsUpdate && healthCheck.updatePriority === 'high') {
              console.log(`🔧 Maintaining: ${post.title}`)

              const maintenanceResult = await ContentMaintenanceSystem.performMaintenance(
                post.id,
                post.title,
                post.content,
                post.seo?.focusKeyword || post.title,
                post.seo?.metaDescription || post.excerpt,
                post.slug
              )

              // Update post if maintenance successful
              if (maintenanceResult.success && maintenanceResult.updates.freshness === 'updated') {
                // Note: In production, you'd update the actual post here
                maintained++
                results.push({
                  postId: post.id,
                  title: post.title,
                  status: 'maintained',
                  metrics: maintenanceResult.metrics
                })
              }
            }
          } catch (error) {
            console.error(`Failed to maintain ${post.id}:`, error)
            failed++
            results.push({
              postId: post.id,
              title: post.title,
              status: 'failed',
              error: error instanceof Error ? error.message : 'Unknown error'
            })
          }
        }

        return NextResponse.json({
          success: true,
          summary: {
            total: blogPosts.length,
            maintained,
            failed,
            skipped: blogPosts.length - maintained - failed
          },
          results
        })
      } catch (error) {
        return NextResponse.json(
          { 
            error: 'Failed to perform auto-maintenance',
            message: error instanceof Error ? error.message : 'Unknown error'
          },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: health-check, maintain, batch-check, or auto-maintain-all' },
      { status: 400 }
    )

  } catch (error) {
    console.error('❌ Content Maintenance Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}