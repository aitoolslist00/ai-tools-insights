import { BlogPost } from './blog-data'

export interface BlogConnectionStatus {
  isConnected: boolean
  publishedPosts: number
  draftPosts: number
  featuredPosts: number
  totalPosts: number
  lastSync: string
  errors: string[]
  warnings: string[]
}

export class BlogConnectionValidator {
  static async validateConnection(): Promise<BlogConnectionStatus> {
    const errors: string[] = []
    const warnings: string[] = []
    let publishedPosts = 0
    let draftPosts = 0
    let featuredPosts = 0
    let totalPosts = 0

    try {
      // Test basic API connection
      const basicResponse = await fetch('/api/blog')
      if (!basicResponse.ok) {
        errors.push('Basic blog API is not responding')
      } else {
        const posts: BlogPost[] = await basicResponse.json()
        totalPosts = posts.length
        publishedPosts = posts.filter(p => p.published).length
        draftPosts = posts.filter(p => !p.published).length
        featuredPosts = posts.filter(p => p.featured).length

        // Validate each published post has proper URL structure
        const publishedPostsData = posts.filter(p => p.published)
        for (const post of publishedPostsData) {
          if (!post.href || !post.href.startsWith('/blog/')) {
            warnings.push(`Post "${post.title}" has invalid URL structure`)
          }
          
          if (!post.seo || !post.seo.metaTitle) {
            warnings.push(`Post "${post.title}" is missing SEO meta title`)
          }
          
          if (!post.excerpt || post.excerpt.length < 50) {
            warnings.push(`Post "${post.title}" has short or missing excerpt`)
          }
        }
      }

      // Test enhanced API connection
      const enhancedResponse = await fetch('/api/blog/enhanced?published=false&limit=1')
      if (!enhancedResponse.ok) {
        warnings.push('Enhanced blog API is not responding properly')
      }

      // Test revalidation endpoint
      const revalidateResponse = await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '/blog', test: true })
      })
      if (!revalidateResponse.ok) {
        warnings.push('Blog revalidation endpoint is not working')
      }

    } catch (error) {
      errors.push(`Connection test failed: ${error}`)
    }

    return {
      isConnected: errors.length === 0,
      publishedPosts,
      draftPosts,
      featuredPosts,
      totalPosts,
      lastSync: new Date().toISOString(),
      errors,
      warnings
    }
  }

  static async testPublishedPostAccess(postId: string): Promise<boolean> {
    try {
      const response = await fetch(`/blog/${postId}`)
      return response.ok
    } catch {
      return false
    }
  }

  static async validateSEOOptimization(posts: BlogPost[]): Promise<{
    optimized: number
    needsWork: number
    issues: Array<{ postId: string; title: string; issues: string[] }>
  }> {
    let optimized = 0
    let needsWork = 0
    const issues: Array<{ postId: string; title: string; issues: string[] }> = []

    for (const post of posts) {
      const postIssues: string[] = []

      // Check SEO basics
      if (!post.seo?.metaTitle || post.seo.metaTitle.length < 30 || post.seo.metaTitle.length > 60) {
        postIssues.push('Meta title should be 30-60 characters')
      }

      if (!post.seo?.metaDescription || post.seo.metaDescription.length < 120 || post.seo.metaDescription.length > 160) {
        postIssues.push('Meta description should be 120-160 characters')
      }

      if (!post.seo?.focusKeyword) {
        postIssues.push('Missing focus keyword')
      }

      if (!post.tags || post.tags.length < 3) {
        postIssues.push('Should have at least 3 tags')
      }

      if (post.content.length < 300) {
        postIssues.push('Content is too short (minimum 300 words recommended)')
      }

      if (!post.image) {
        postIssues.push('Missing featured image')
      }

      if (postIssues.length === 0) {
        optimized++
      } else {
        needsWork++
        issues.push({
          postId: post.id,
          title: post.title,
          issues: postIssues
        })
      }
    }

    return { optimized, needsWork, issues }
  }

  static generateConnectionReport(status: BlogConnectionStatus): string {
    let report = `# Blog Connection Report\n\n`
    report += `**Status**: ${status.isConnected ? '✅ Connected' : '❌ Disconnected'}\n`
    report += `**Last Check**: ${new Date(status.lastSync).toLocaleString()}\n\n`
    
    report += `## Statistics\n`
    report += `- Total Posts: ${status.totalPosts}\n`
    report += `- Published: ${status.publishedPosts}\n`
    report += `- Drafts: ${status.draftPosts}\n`
    report += `- Featured: ${status.featuredPosts}\n\n`

    if (status.errors.length > 0) {
      report += `## Errors\n`
      status.errors.forEach(error => {
        report += `- ❌ ${error}\n`
      })
      report += `\n`
    }

    if (status.warnings.length > 0) {
      report += `## Warnings\n`
      status.warnings.forEach(warning => {
        report += `- ⚠️ ${warning}\n`
      })
      report += `\n`
    }

    if (status.errors.length === 0 && status.warnings.length === 0) {
      report += `## Status\n✅ All systems operational!\n`
    }

    return report
  }
}