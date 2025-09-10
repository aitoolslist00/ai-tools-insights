import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, User, Tag, ArrowLeft, Share2, Heart, Eye } from 'lucide-react'
import { loadBlogPostsFromFile } from '@/lib/blog-file-manager'
import { getCategoryById } from '@/lib/blog-data'
import ArticleContent from '@/components/ArticleContent'

interface DevBlogPostPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ t?: string }>
}

// Pure Static Generation (dev override)
export const dynamic = 'force-static'
export const revalidate = false

export default async function DevBlogPostPage({ params, searchParams }: DevBlogPostPageProps) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    redirect('/blog')
  }

  const { slug } = await params
  const { t } = await searchParams
  
  // Always load fresh data with timestamp logging
  console.log(`[DEV-ROUTE] Loading fresh data for ${slug} at ${new Date().toISOString()}`)
  console.log(`[DEV-ROUTE] Cache bust parameter: ${t || 'none'}`)
  
  const posts = await loadBlogPostsFromFile()
  const post = posts.find(p => p.id === slug && p.published)

  if (!post) {
    notFound()
  }

  const category = getCategoryById(post.category)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Development Banner */}
      <div className="bg-red-600 text-white text-center py-2 text-sm font-medium">
        🔧 DEVELOPMENT MODE - FRESH DATA LOADED AT {new Date().toLocaleTimeString()}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Blog */}
        <Link 
          href="/blog" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>

        {/* Article Header */}
        <article className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-8 py-12">
            {/* Category */}
            <div className="flex items-center space-x-4 mb-6">
              <Link 
                href={`/blog?category=${post.category}`}
                className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium hover:bg-primary-200 transition-colors"
              >
                <Tag className="h-3 w-3 mr-1" />
                {category?.name || 'AI Tools'}
              </Link>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(post.publishedAt || post.date || post.updatedAt || new Date()).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {post.readTime}
              </div>
              {post.analytics && (
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  {post.analytics.views} views
                </div>
              )}
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <ArticleContent content={post.content} title={post.title} />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Development Info */}
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">🔧 Development Info</h4>
              <div className="text-sm text-yellow-700 space-y-1">
                <p><strong>Post ID:</strong> {post.id}</p>
                <p><strong>Last Updated:</strong> {post.updatedAt}</p>
                <p><strong>Content Length:</strong> {post.content.length} characters</p>
                <p><strong>Data Loaded:</strong> {new Date().toISOString()}</p>
                <p><strong>Cache Bust:</strong> {t || 'none'}</p>
              </div>
            </div>
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-12 flex justify-between">
          <Link 
            href="/blog" 
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
          <Link 
            href={`/blog/${slug}`}
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            View Production Version
          </Link>
        </div>
      </div>
    </div>
  )
}