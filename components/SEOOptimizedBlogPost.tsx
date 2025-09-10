'use client'

import { useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Calendar, Clock, User, Tag, Eye, Heart, Share2, ArrowLeft, ArrowRight } from 'lucide-react'
import { BlogPost, getCategoryById } from '@/lib/blog-data'

interface SEOOptimizedBlogPostProps {
  post: BlogPost
  relatedPosts?: BlogPost[]
  previousPost?: BlogPost
  nextPost?: BlogPost
}

export default function SEOOptimizedBlogPost({ 
  post, 
  relatedPosts = [], 
  previousPost, 
  nextPost 
}: SEOOptimizedBlogPostProps) {
  const category = getCategoryById(post.category)
  
  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image || `${process.env.NEXT_PUBLIC_SITE_URL}/images/blog/default.jpg`,
    "author": {
      "@type": "Person",
      "name": post.author,
      "url": `${process.env.NEXT_PUBLIC_SITE_URL}/author/${post.author.toLowerCase().replace(/\s+/g, '-')}`
    },
    "publisher": {
      "@type": "Organization",
      "name": process.env.NEXT_PUBLIC_SITE_NAME || "AI Tools Insights",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`
      }
    },
    "datePublished": post.publishedAt || post.date,
    "dateModified": post.updatedAt || post.publishedAt || post.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL}${post.href}`
    },
    "articleSection": category?.name || post.category,
    "keywords": post.tags.join(', '),
    "wordCount": post.content.split(/\s+/).length,
    "timeRequired": post.readTime,
    "url": `${process.env.NEXT_PUBLIC_SITE_URL}${post.href}`,
    "isPartOf": {
      "@type": "Blog",
      "name": `${process.env.NEXT_PUBLIC_SITE_NAME} Blog`,
      "url": `${process.env.NEXT_PUBLIC_SITE_URL}/blog`
    }
  }

  // Add FAQ structured data if content contains questions
  const faqMatches = post.content.match(/#{2,3}\s*(.+\?)/g)
  if (faqMatches && faqMatches.length > 0) {
    const faqStructuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqMatches.map(question => ({
        "@type": "Question",
        "name": question.replace(/#{2,3}\s*/, ''),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Detailed answer content..." // This would need to be extracted from content
        }
      }))
    }
  }

  // Breadcrumb structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": process.env.NEXT_PUBLIC_SITE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": category?.name || post.category,
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}/blog?category=${post.category}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": post.title,
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}${post.href}`
      }
    ]
  }

  // Track page view
  useEffect(() => {
    // Analytics tracking would go here
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: post.title,
        page_location: window.location.href,
        content_group1: 'Blog Post',
        content_group2: category?.name || post.category
      })
    }
  }, [post.title, category?.name, post.category])

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{post.seo?.metaTitle || post.title}</title>
        <meta name="title" content={post.seo?.metaTitle || post.title} />
        <meta name="description" content={post.seo?.metaDescription || post.excerpt} />
        <meta name="keywords" content={post.seo?.keywords || post.tags.join(', ')} />
        <meta name="author" content={post.author} />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />

        {/* Canonical URL */}
        <link rel="canonical" href={post.seo?.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL}${post.href}`} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}${post.href}`} />
        <meta property="og:title" content={post.seo?.ogTitle || post.title} />
        <meta property="og:description" content={post.seo?.ogDescription || post.excerpt} />
        <meta property="og:image" content={post.seo?.ogImage || post.image || `${process.env.NEXT_PUBLIC_SITE_URL}/images/blog/default.jpg`} />
        <meta property="og:site_name" content={process.env.NEXT_PUBLIC_SITE_NAME || "AI Tools List"} />
        <meta property="article:published_time" content={post.publishedAt || post.date} />
        <meta property="article:modified_time" content={post.updatedAt || post.publishedAt || post.date} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={category?.name || post.category} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}${post.href}`} />
        <meta property="twitter:title" content={post.seo?.twitterTitle || post.title} />
        <meta property="twitter:description" content={post.seo?.twitterDescription || post.excerpt} />
        <meta property="twitter:image" content={post.seo?.twitterImage || post.image || `${process.env.NEXT_PUBLIC_SITE_URL}/images/blog/default.jpg`} />

        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
        />
      </Head>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-primary-600 transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/blog" className="hover:text-primary-600 transition-colors">
                Blog
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link 
                href={`/blog?category=${post.category}`} 
                className="hover:text-primary-600 transition-colors"
              >
                {category?.name || post.category}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium truncate">
              {post.title}
            </li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          {/* Category Badge */}
          <div className="mb-4">
            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${category?.color || 'bg-gray-100 text-gray-700'}`}>
              {category?.name || post.category}
            </span>
            {post.featured && (
              <span className="ml-2 inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>By {post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <time dateTime={post.date}>
                {post.date ? new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'No date'}
              </time>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{post.readTime}</span>
            </div>
            {post.analytics?.views && (
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                <span>{post.analytics.views.toLocaleString()} views</span>
              </div>
            )}
          </div>

          {/* Featured Image */}
          {post.image && (
            <div className="mb-8">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
                loading="eager"
              />
            </div>
          )}

          {/* Social Sharing */}
          <div className="flex items-center justify-between py-4 border-y border-gray-200">
            <div className="flex items-center space-x-4">
              {post.analytics?.likes && (
                <button className="flex items-center text-gray-500 hover:text-red-500 transition-colors">
                  <Heart className="h-5 w-5 mr-1" />
                  <span>{post.analytics.likes}</span>
                </button>
              )}
              {post.analytics?.shares && (
                <button className="flex items-center text-gray-500 hover:text-blue-500 transition-colors">
                  <Share2 className="h-5 w-5 mr-1" />
                  <span>{post.analytics.shares}</span>
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigator.share?.({ 
                  title: post.title, 
                  text: post.excerpt, 
                  url: window.location.href 
                })}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                Share Article
              </button>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div 
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
            className="leading-relaxed"
          />
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Link
                  key={index}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                About {post.author}
              </h3>
              <p className="text-gray-600 mb-3">
                Expert writer and AI enthusiast, sharing insights about the latest AI tools and technologies.
              </p>
              <Link
                href={`/author/${post.author.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                View all posts by {post.author} →
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center py-6 border-t border-gray-200 mb-8">
          {previousPost ? (
            <Link
              href={previousPost.href}
              className="flex items-center text-primary-600 hover:text-primary-700 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              <div className="text-left">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Previous</div>
                <div className="font-medium">{previousPost.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextPost && (
            <Link
              href={nextPost.href}
              className="flex items-center text-primary-600 hover:text-primary-700 transition-colors group text-right"
            >
              <div className="text-right">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Next</div>
                <div className="font-medium">{nextPost.title}</div>
              </div>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.slice(0, 3).map((relatedPost) => (
                <article key={relatedPost.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary-600/30">
                      {relatedPost.title.charAt(0)}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      <Link href={relatedPost.href} className="hover:text-primary-600 transition-colors">
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{relatedPost.readTime}</span>
                      <time dateTime={relatedPost.date}>
                        {relatedPost.date ? new Date(relatedPost.date).toLocaleDateString() : 'No date'}
                      </time>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Call to Action */}
        <div className="bg-primary-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Stay Updated with AI Tools
          </h2>
          <p className="text-gray-600 mb-6">
            Get the latest AI tools and insights delivered to your inbox weekly.
          </p>
          <Link
            href="/newsletter"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Subscribe to Newsletter
          </Link>
        </div>
      </article>
    </>
  )
}