import React from 'react'
import Link from 'next/link'
import { Calendar, Clock, User, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import InternalLinkManager, { BlogToToolLinks, CategoryHubLinks } from '@/components/InternalLinkManager'
import { InternalLinkStrategy } from '@/lib/internal-link-strategy'

interface BlogPostProps {
  title: string
  description: string
  content: string
  author: string
  publishDate: string
  readTime: string
  category: string
  slug: string
  tags: string[]
  relatedTools?: string[]
  tableOfContents?: Array<{
    title: string
    href: string
  }>
}

/**
 * SEO-Optimized Blog Post Component with Strategic Internal Linking
 * Implements advanced internal link strategy for maximum SEO impact and user engagement
 */
export default function SEOOptimizedBlogPost({
  title,
  description,
  content,
  author,
  publishDate,
  readTime,
  category,
  slug,
  tags,
  relatedTools = [],
  tableOfContents = []
}: BlogPostProps) {
  
  // Generate contextual links based on content
  const contextualLinks = InternalLinkStrategy.generateContextualLinks(`/blog/${slug}`, content, 5)
  
  // Generate related blog posts
  const relatedPosts = InternalLinkStrategy.generateRelatedBlogLinks(slug, category, 3)
  
  // Generate breadcrumb navigation
  const breadcrumbs = InternalLinkStrategy.generateBreadcrumbLinks(`/blog/${slug}`)

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation for SEO */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <InternalLinkManager
            currentPage={`/blog/${slug}`}
            context="breadcrumb"
            className="text-sm"
          />
        </div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8 group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to AI Insights Blog
          </Link>
          
          <div className="mb-6">
            <Link 
              href={`/blog?category=${encodeURIComponent(category)}`}
              className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full hover:bg-primary-200 transition-colors"
            >
              {category}
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {description}
          </p>
          
          <div className="flex items-center text-gray-500 space-x-6">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>{author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{publishDate}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{readTime}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar with Table of Contents and Strategic Links */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Table of Contents
                  </h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item, index) => (
                      <a
                        key={index}
                        href={item.href}
                        className="block text-sm text-gray-600 hover:text-primary-600 transition-colors py-1 border-l-2 border-transparent hover:border-primary-600 pl-3"
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Featured AI Tools - High Converting Sidebar */}
              {relatedTools.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Featured Tools
                  </h3>
                  <div className="space-y-3">
                    {relatedTools.map((toolSlug, index) => (
                      <Link
                        key={index}
                        href={`/ai-tools/${toolSlug}`}
                        className="flex items-center p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 group-hover:bg-blue-700"></div>
                        <span className="text-gray-900 font-medium group-hover:text-blue-700 capitalize">
                          {toolSlug.replace('-', ' ')}
                        </span>
                        <ExternalLink className="w-3 h-3 ml-auto text-gray-400 group-hover:text-blue-600" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Contextual Links */}
              <InternalLinkManager
                currentPage={`/blog/${slug}`}
                content={content}
                context="related"
                category={category}
                blogSlug={slug}
                maxLinks={4}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="prose prose-lg prose-blue max-w-4xl mx-auto">
              {/* Enhanced content with automatic link injection would go here */}
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </article>

            {/* Strategic Blog-to-Tool Conversion Section */}
            <div className="mt-12">
              <BlogToToolLinks blogSlug={slug} />
            </div>

            {/* Tags Section with Internal Links */}
            {tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary-100 hover:text-primary-700 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
              <section className="mt-16 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                  </svg>
                  Continue Reading
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((post, index) => (
                    <Link
                      key={index}
                      href={post.url}
                      className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-200"
                    >
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 mb-3 line-clamp-2">
                        {post.anchorText}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {post.keywords?.join(' • ')}
                      </p>
                      <div className="flex items-center text-primary-600 group-hover:text-primary-700 text-sm font-medium">
                        Read more
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Category Hub Links for Topical Authority */}
            <div className="mt-16">
              <CategoryHubLinks category={category} />
            </div>

            {/* Newsletter Signup with Internal Link Context */}
            <div className="mt-16 bg-gradient-to-r from-primary-50 to-blue-50 p-8 rounded-xl border border-primary-200">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Stay Updated with AI Tools
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Get the latest AI tool reviews, comparisons, and insights delivered to your inbox. 
                  Join thousands of professionals who trust our AI expertise.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                    Subscribe
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  By subscribing, you agree to our{' '}
                  <Link href="/privacy-policy" className="text-primary-600 hover:text-primary-700">
                    Privacy Policy
                  </Link>
                  . Unsubscribe at any time.
                </p>
              </div>
            </div>

            {/* Navigation to Previous/Next Posts */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to All Articles
                </Link>
                <Link
                  href="/ai-tools"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group"
                >
                  Explore AI Tools
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Enhanced Blog Post with Automatic Link Injection
 */
export function EnhancedBlogContent({ content, currentPage }: { content: string, currentPage: string }) {
  // This would typically be processed server-side
  // For now, we'll show the content as-is with contextual suggestions
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      
      {/* Contextual Link Suggestions */}
      <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
        <h4 className="text-lg font-semibold text-blue-900 mb-4">Related Resources</h4>
        <InternalLinkManager
          currentPage={currentPage}
          content={content}
          context="contextual"
          maxLinks={5}
          className="flex flex-wrap gap-2"
        />
      </div>
    </div>
  )
}