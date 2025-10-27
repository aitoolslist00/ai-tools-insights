'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Calendar, 
  Clock, 
  User, 
  Eye, 
  Share2, 
  Bookmark, 
  ChevronUp, 
  ChevronDown,
  ExternalLink,
  Star,
  TrendingUp,
  Award,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react'
import { EnhancedBlogPost } from '@/lib/enhanced-blog-generator'

interface EnhancedBlogArticleProps {
  post: EnhancedBlogPost
  relatedPosts?: EnhancedBlogPost[]
}

export default function EnhancedBlogArticle({ post, relatedPosts = [] }: EnhancedBlogArticleProps) {
  const [readingProgress, setReadingProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const [showTOC, setShowTOC] = useState(false)
  const [copiedText, setCopiedText] = useState('')
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = (winScroll / height) * 100
      setReadingProgress(scrolled)

      // Update active section
      const headers = document.querySelectorAll('h2[id], h3[id]')
      let currentActiveSection = ''
      
      for (let i = headers.length - 1; i >= 0; i--) {
        const header = headers[i] as HTMLElement
        const rect = header.getBoundingClientRect()
        
        if (rect.top <= 100) {
          currentActiveSection = header.id
          break
        }
      }
      
      setActiveSection(currentActiveSection)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Share functionality
  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(post.title)
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      copy: ''
    }

    if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href)
      setCopiedText('Link copied!')
      setTimeout(() => setCopiedText(''), 2000)
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
    setShowShareMenu(false)
  }

  // Smooth scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.replace('#', ''))
    if (element) {
      const yOffset = -100
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  // Format content with proper HTML structure
  const formatContent = (content: string) => {
    return content
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/^# (.+)$/gm, '<h1 id="$1">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 id="$1">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 id="$1">$1</h3>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>[\s\S]*?<\/li>)/g, '<ol>$1</ol>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.+)$/gm, '<p>$1</p>')
      .replace(/<p><h/g, '<h')
      .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
      .replace(/<p><ul>/g, '<ul>')
      .replace(/<\/ul><\/p>/g, '</ul>')
      .replace(/<p><ol>/g, '<ol>')
      .replace(/<\/ol><\/p>/g, '</ol>')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(post.schemas.article) }}
      />
      {post.schemas.faq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(post.schemas.faq) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(post.schemas.breadcrumb) }}
      />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(59 130 246 / 0.1)'%3e%3cpath d='m0 .5 32 32M31.5 0 0 32'/%3e%3c/svg%3e")`
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li><Link href="/blog" className="hover:text-blue-600">Blog</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">{post.category}</li>
            </ol>
          </nav>

          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>

          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              <Award className="w-4 h-4 mr-2" />
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-4xl">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-8 mb-10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {post.author.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900">{post.author}</div>
                <div className="text-sm text-gray-500">AI Technology Expert</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(post.publishDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{post.readingTime} min read</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{post.wordCount} words</span>
              </div>
            </div>

            {/* SEO Score Badge */}
            <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">SEO Score: {post.seoScore}/100</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mb-12">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                isBookmarked 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">Share</span>
              </button>

              {showShareMenu && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                  >
                    <Facebook className="w-4 h-4" />
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                  >
                    {copiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedText || 'Copy Link'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          {post.image && (
            <div className="mb-16 group">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src={post.image}
                  alt={post.images[0]?.alt || post.title}
                  width={1200}
                  height={675}
                  className="w-full h-64 md:h-96 lg:h-[32rem] object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              {post.images[0]?.caption && (
                <p className="text-sm text-gray-600 text-center mt-4 italic">
                  {post.images[0].caption}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-20 space-y-8">
              {/* Table of Contents */}
              {post.tableOfContents.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Table of Contents</h3>
                    <button
                      onClick={() => setShowTOC(!showTOC)}
                      className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                      {showTOC ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <nav className={`space-y-2 ${showTOC || 'hidden lg:block'}`}>
                    {post.tableOfContents.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => scrollToSection(item.href)}
                        className={`block w-full text-left text-sm py-2 px-3 rounded-lg transition-colors ${
                          activeSection === item.href.replace('#', '')
                            ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                        style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}
                      >
                        {item.title}
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* E-E-A-T Signals */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Expert Content
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-700">Expert Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700">Industry Experience</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">Up-to-date Information</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-gray-700">Fact-checked Content</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="flex-1 max-w-none">
            <article className="prose prose-lg prose-blue max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                className="enhanced-content"
              />
            </article>

            {/* Comparison Table */}
            {post.comparisonTable && (
              <div className="my-12 bg-gray-50 rounded-xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Comprehensive Comparison
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-white border-b-2 border-gray-300">
                        {post.comparisonTable.headers.map((header, index) => (
                          <th key={index} className="text-left py-4 px-6 font-semibold text-gray-900">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {post.comparisonTable.rows.map((row, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-white transition-colors">
                          {post.comparisonTable!.headers.map((header, cellIndex) => (
                            <td key={cellIndex} className="py-4 px-6 text-gray-700">
                              {row[header]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FAQ Section */}
            {post.faq.length > 0 && (
              <div className="my-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {post.faq.map((item, index) => (
                    <details key={index} className="bg-white border border-gray-200 rounded-lg p-6 group">
                      <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-gray-900 group-open:text-blue-600">
                        {item.question}
                        <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="mt-4 text-gray-700 leading-relaxed">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.slice(0, 3).map((relatedPost, index) => (
                    <Link
                      key={index}
                      href={`/blog/${relatedPost.slug}`}
                      className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                    >
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 mb-3 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center text-blue-600 group-hover:text-blue-700 text-sm font-medium">
                        Read more
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter Signup */}
            <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200">
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
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 ${
          readingProgress > 20 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      <style jsx>{`
        .enhanced-content h1,
        .enhanced-content h2,
        .enhanced-content h3,
        .enhanced-content h4,
        .enhanced-content h5,
        .enhanced-content h6 {
          scroll-margin-top: 100px;
        }
        
        .enhanced-content strong {
          font-weight: 700;
          color: #1f2937;
        }
        
        .enhanced-content em {
          font-style: italic;
          color: #374151;
        }
        
        .enhanced-content ul,
        .enhanced-content ol {
          margin: 1.5rem 0;
          padding-left: 1.5rem;
        }
        
        .enhanced-content li {
          margin: 0.5rem 0;
          line-height: 1.7;
        }
        
        .enhanced-content p {
          margin: 1.5rem 0;
          line-height: 1.8;
          color: #374151;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}