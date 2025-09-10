import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import { Calendar, Clock, User, Tag, ArrowLeft, Share2, Heart, Eye } from 'lucide-react'
import { loadBlogPostsFromFile } from '@/lib/blog-file-manager'
import { getCategoryById } from '@/lib/blog-data'
import EnhancedArticleContent from '@/components/EnhancedArticleContent'
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation'
import AdvancedAnalytics from '@/components/AdvancedAnalytics'
import { SchemaGenerator } from '@/lib/schema-generator'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

// Pure Static Generation - No ISR
export const dynamic = 'force-static'
export const revalidate = false

// Get blog posts with static generation optimization
const getBlogPosts = async () => {
  // Always load from file system for static generation
  return await loadBlogPostsFromFile()
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts
    .filter(post => post.published)
    .map(post => ({
      slug: post.id
    }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const posts = await getBlogPosts()
  const post = posts.find(p => p.id === slug && p.published)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }

  const metaTitle = `${(post.seo?.metaTitle || post.title).replace(/^#+\s*/, '')} | AI Tools List Blog 2025`
  const metaDescription = `${(post.seo?.metaDescription || post.excerpt).substring(0, 150)}... Read time: ${post.readTime}. Expert insights on AI tools.`

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: `${post.seo?.keywords || post.tags.join(', ')}, AI tools blog, artificial intelligence news, AI technology insights 2025`,
    authors: [{ name: post.author }],
    openGraph: {
      title: (post.seo?.ogTitle || post.title).replace(/^#+\s*/, ''),
      description: post.seo?.ogDescription || post.excerpt,
      url: `https://www.aitoolsinsights.com/blog/${post.id}`,
      siteName: 'AI Tools Insights',
      images: post.seo?.ogImage ? [post.seo.ogImage] : post.image ? [post.image] : [],
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: (post.seo?.twitterTitle || post.title).replace(/^#+\s*/, ''),
      description: post.seo?.twitterDescription || post.excerpt,
      images: post.seo?.twitterImage ? [post.seo.twitterImage] : post.image ? [post.image] : [],
      creator: '@aitoolslist',
      site: '@aitoolslist',
    },
    alternates: {
      canonical: post.seo?.canonicalUrl || `https://www.aitoolslist.com/blog/${post.id}`,
    },
    other: {
      'article:author': post.author,
      'article:published_time': post.publishedAt || '',
      'article:modified_time': post.updatedAt || '',
      'article:section': post.category,
      'article:tag': post.tags.join(','),
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const posts = await getBlogPosts()
  const post = posts.find(p => p.id === slug && p.published)

  if (!post) {
    notFound()
  }

  const category = getCategoryById(post.category)
  const relatedPosts = posts
    .filter(p => p.published && p.id !== post.id && p.category === post.category)
    .slice(0, 3)

  // Generate breadcrumbs
  const breadcrumbs = [
    { name: 'Blog', href: '/blog' },
    { name: category?.name || 'Article', href: `/blog?category=${post.category}` },
    { name: post.title.replace(/^#+\s*/, '').substring(0, 50) + '...', href: `/blog/${post.id}`, current: true }
  ]

  // Generate structured data
  const articleSchema = SchemaGenerator.generateArticleSchema(post)

  const breadcrumbSchema = SchemaGenerator.generateBreadcrumbSchema(
    [{ name: 'Home', url: 'https://www.aitoolslist.com' }, ...breadcrumbs.map(b => ({ name: b.name, url: `https://www.aitoolslist.com${b.href}` }))]
  )

  const combinedSchema = SchemaGenerator.generateCombinedSchema([
    articleSchema,
    breadcrumbSchema
  ])

  return (
    <div className="min-h-screen bg-white">
      {/* Advanced Analytics */}
      <AdvancedAnalytics />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: combinedSchema }}
      />
      {/* Breadcrumb Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNavigation items={breadcrumbs} />
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>

          {/* Category */}
          {category && (
            <div className="mb-4">
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${category.color}`}>
                {category.name}
              </span>
            </div>
          )}

          {/* Title with enhanced typography */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            {post.title.replace(/^#+\s*/, '')}
          </h1>

          {/* Excerpt with better styling */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-4xl font-medium">
            {post.excerpt}
          </p>

          {/* Enhanced Meta Information */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-600 mb-8">
            <div className="flex items-center bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200 shadow-sm">
              <User className="h-4 w-4 mr-2 text-primary-500" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200 shadow-sm">
              <Calendar className="h-4 w-4 mr-2 text-primary-500" />
              <span>{new Date(post.publishedAt || post.date || post.updatedAt || new Date()).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200 shadow-sm">
              <Clock className="h-4 w-4 mr-2 text-primary-500" />
              <span>{post.readTime}</span>
            </div>
            {post.analytics && (
              <div className="flex items-center bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200 shadow-sm">
                <Eye className="h-4 w-4 mr-2 text-primary-500" />
                <span>{post.analytics.views} views</span>
              </div>
            )}
          </div>

          {/* Enhanced Featured Image */}
          {post.image && (
            <div className="mb-8 group">
              <div className="relative overflow-hidden rounded-xl shadow-2xl">
                <img
                  src={post.image}
                  alt={post.title.replace(/^#+\s*/, '')}
                  className="w-full h-64 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EnhancedArticleContent 
          content={post.content} 
          title={post.title}
          readTime={post.readTime}
          author={post.author}
          publishedAt={post.publishedAt}
          tags={post.tags}
          category={post.category}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center flex-wrap gap-2">
              <Tag className="h-4 w-4 text-gray-500" />
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Sharing */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Share this article:</span>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </div>
            {post.analytics && (
              <div className="text-sm text-gray-500">
                {post.analytics.likes} likes • {post.analytics.shares} shares
              </div>
            )}
          </div>
        </div>

        {/* Author Bio */}
        <div className="mt-12 p-6 bg-gray-50 rounded-xl">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-primary-600">
                {post.author.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{post.author}</h3>
              <p className="text-gray-600 mt-1">
                Content writer and AI enthusiast passionate about exploring the latest developments in artificial intelligence and technology.
              </p>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={relatedPost.href}
                  className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {relatedPost.image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center mt-3 text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{new Date(relatedPost.publishedAt || relatedPost.date || relatedPost.updatedAt || new Date()).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>{relatedPost.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 p-8 bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h3>
          <p className="text-gray-600 mb-6">
            Get the latest AI tools and insights delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>


    </div>
  )
}