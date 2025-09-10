import { Metadata } from 'next'
import { Suspense } from 'react'
import BlogPageClient from '@/components/BlogPageClient'
import { BlogPost } from '@/lib/blog-data'
import { Calendar, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Tools Blog - Latest AI News, Reviews & Insights | AI Tools Insights',
  description: 'Stay updated with the latest AI tools, reviews, comparisons, and industry insights. Expert analysis on artificial intelligence trends and technologies.',
}

// Pure Static Generation - Build time only
export const dynamic = 'force-static'
export const revalidate = false

// Fetch blog posts directly from file system for SSG
async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const { loadBlogPostsFromFile } = await import('@/lib/blog-file-manager')
    const posts = await loadBlogPostsFromFile()
    
    // Filter published posts and sort by date
    return posts
      .filter(post => post.published)
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.updatedAt || a.date || 0)
        const dateB = new Date(b.publishedAt || b.updatedAt || b.date || 0)
        return dateB.getTime() - dateA.getTime()
      })
  } catch (error) {
    console.error('Error loading blog posts:', error)
    return []
  }
}



function LoadingState() {
  return (
    <div className="space-y-16">
      <section>
        <div className="flex items-center mb-8">
          <div className="w-6 h-6 bg-gray-200 rounded mr-3 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-64 bg-gray-200 animate-pulse" />
              <div className="p-8 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AI Tools Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Stay updated with the latest AI tools, expert reviews, and industry insights 
              from our team of AI specialists.
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Updated Daily</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span>{posts.length} Articles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<LoadingState />}>
            <BlogPageClient initialPosts={posts} />
          </Suspense>
        </div>
      </section>
    </div>
  )
}