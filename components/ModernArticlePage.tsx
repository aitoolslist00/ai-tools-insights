'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Clock, 
  Calendar,
  User,
  Eye, 
  Share2, 
  Bookmark, 
  ChevronUp, 
  Menu, 
  X, 
  Copy, 
  Check,
  ExternalLink,
  Quote,
  Lightbulb,
  AlertTriangle,
  Info,
  CheckCircle,
  Zap,
  TrendingUp,
  Star,
  Heart,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon
} from 'lucide-react'
import { Disclosure } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { BlogPost } from '@/lib/blog-data'
import { formatContent as formatContentWithImages, formatContentForTOC, enhanceContentFormatting } from '@/lib/content-formatter'

interface ModernArticlePageProps {
  post: BlogPost
  relatedPosts: BlogPost[]
  nextPost?: BlogPost
  prevPost?: BlogPost
}

interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

interface FAQ {
  question: string
  answer: string
}

export default function ModernArticlePage({ 
  post, 
  relatedPosts = [], 
  nextPost,
  prevPost 
}: ModernArticlePageProps) {
  const [readingProgress, setReadingProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const [showTOC, setShowTOC] = useState(false)
  const [copiedText, setCopiedText] = useState('')
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([])
  const [faqs, setFAQs] = useState<FAQ[]>([])
  const [isSticky, setIsSticky] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const tocRef = useRef<HTMLDivElement>(null)

  // Helper function to format content with images
  const formatPostContent = (content: string) => {
    return formatContentWithImages(content, post)
  }

  // Extract Table of Contents and FAQs from content
  useEffect(() => {
    if (!post.content) return

    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = formatContentForTOC(post.content)
    
    // Extract TOC items
    const headers = tempDiv.querySelectorAll('h1, h2, h3')
    const tocItems: TableOfContentsItem[] = []
    
    headers.forEach((header) => {
      if (!header.id) {
        const id = header.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ''
        header.id = id
      }
      
      tocItems.push({
        id: header.id,
        text: header.textContent || '',
        level: parseInt(header.tagName.charAt(1))
      })
    })
    
    setTableOfContents(tocItems)

    // Extract FAQs only if there's no dedicated FAQ section in the content
    const faqItems: FAQ[] = []
    const hasExistingFAQSection = post.content.toLowerCase().includes('## faq') || 
                                  post.content.toLowerCase().includes('# faq') ||
                                  post.content.toLowerCase().includes('frequently asked questions')
    
    if (!hasExistingFAQSection) {
      const paragraphs = tempDiv.querySelectorAll('p')
      
      paragraphs.forEach((p, index) => {
        const text = p.textContent || ''
        if (text.includes('?') && text.length < 200 && text.length > 20) {
          const nextP = paragraphs[index + 1]
          if (nextP) {
            faqItems.push({
              question: text,
              answer: nextP.textContent || ''
            })
          }
        }
      })
    }
    
    setFAQs(faqItems.slice(0, 8)) // Limit to 8 FAQs
  }, [post.content])

  // Reading progress and scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = (winScroll / height) * 100
      setReadingProgress(scrolled)

      // Check if TOC should be sticky
      const tocElement = tocRef.current
      if (tocElement) {
        const rect = tocElement.getBoundingClientRect()
        setIsSticky(rect.top <= 80)
      }

      // Update active section
      let currentActiveSection = ''
      const headers = document.querySelectorAll('h1[id], h2[id], h3[id]')
      
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



  // Callout box component
  const CalloutBox = ({ type, children }: { type: 'tip' | 'warning' | 'info' | 'success', children: React.ReactNode }) => {
    const configs = {
      tip: { bg: 'bg-green-50', border: 'border-green-200', icon: Lightbulb, iconColor: 'text-green-600' },
      warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: AlertTriangle, iconColor: 'text-yellow-600' },
      info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: Info, iconColor: 'text-blue-600' },
      success: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle, iconColor: 'text-emerald-600' }
    }
    
    const config = configs[type]
    const Icon = config.icon

    return (
      <div className={`my-8 ${config.bg} ${config.border} border-l-4 rounded-r-lg p-6`}>
        <div className="flex items-start space-x-4">
          <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    )
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

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(59 130 246 / 0.1)'%3e%3cpath d='m0 .5 32 32M31.5 0 0 32'/%3e%3c/svg%3e")`
          }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
            <span className="inline-flex px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            {post.title.replace(/^#+\s*/, '')}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 mb-10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {post.author.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900">{post.author}</div>
                <div className="text-sm text-gray-500">AI Technology Writer</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'Date not available'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {post.image && !post.image.includes('placeholder') ? (
            <div className="mb-16 group">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src={post.image}
                  alt={post.images && post.images.length > 0 ? post.images[0].alt : post.title}
                  width={1200}
                  height={675}
                  className="w-full h-64 md:h-96 lg:h-[28rem] object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement?.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 h-64 md:h-96 lg:h-[28rem] rounded-2xl flex items-center justify-center">
                          <div class="text-center text-white p-8">
                            <svg class="w-24 h-24 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                            <h3 class="text-2xl font-bold mb-2">${post.title.replace(/^#+\s*/, '').substring(0, 60)}</h3>
                            <p class="text-sm opacity-90">${post.category}</p>
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ) : (
            <div className="mb-16">
              <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 h-64 md:h-96 lg:h-[28rem] rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.3)'%3e%3cpath d='M0 .5l32 32M31.5 0L0 32'/%3e%3c/svg%3e")`
                }} />
                <div className="text-center text-white p-8 relative z-10">
                  <svg className="w-24 h-24 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">{post.title.replace(/^#+\s*/, '').substring(0, 60)}</h3>
                  <p className="text-sm md:text-base opacity-90">{post.category}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Table of Contents Sidebar */}
          {tableOfContents.length > 0 && (
            <div className="lg:w-64 flex-shrink-0">
              <div ref={tocRef} className={`${isSticky ? 'sticky top-20' : ''} transition-all duration-200`}>
                <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Table of Contents</h3>
                    <button
                      onClick={() => setShowTOC(!showTOC)}
                      className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                      {showTOC ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {(showTOC || window.innerWidth >= 1024) && (
                      <motion.nav
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        {tableOfContents.map((item) => (
                          <a
                            key={item.id}
                            href={`#${item.id}`}
                            className={`block py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                              activeSection === item.id
                                ? 'bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-500'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            } ${
                              item.level === 1 ? 'font-semibold' :
                              item.level === 2 ? 'pl-4' :
                              'pl-6 text-xs'
                            }`}
                            style={{ marginLeft: `${(item.level - 1) * 8}px` }}
                          >
                            {item.text}
                          </a>
                        ))}
                      </motion.nav>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 max-w-none">
            <article ref={contentRef} className="prose prose-lg max-w-none">
              {/* Article Content */}
              <div 
                className="article-content"
                dangerouslySetInnerHTML={{ __html: enhanceContentFormatting(formatPostContent(post.content)) }}
              />

              {/* Callout Examples */}
              <CalloutBox type="tip">
                <p className="text-gray-800 font-medium">Pro Tip</p>
                <p className="text-gray-700 mt-1">This is how you can make your AI tools more effective by implementing these strategies consistently.</p>
              </CalloutBox>

              <CalloutBox type="info">
                <p className="text-gray-800 font-medium">Important Information</p>
                <p className="text-gray-700 mt-1">Keep in mind that AI technology evolves rapidly, so staying updated with the latest developments is crucial.</p>
              </CalloutBox>
            </article>

            {/* FAQ Section */}
            {faqs.length > 0 && (
              <div className="mt-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <Disclosure key={index} as="div" className="bg-white border border-gray-200 rounded-xl shadow-sm">
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex w-full justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors">
                            <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${open ? 'transform rotate-180' : ''}`} />
                          </Disclosure.Button>
                          <Disclosure.Panel className="px-6 pb-6 text-gray-700 leading-relaxed">
                            {faq.answer}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-gray-200">
                <div className="flex items-center flex-wrap gap-3">
                  <span className="text-gray-600 font-medium">Tags:</span>
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Sharing */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 font-medium">Share this article:</span>
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    
                    <AnimatePresence>
                      {showShareMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-xl p-2 min-w-48 z-10"
                        >
                          <button
                            onClick={() => handleShare('twitter')}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Twitter className="w-4 h-4 text-blue-400" />
                            <span>Twitter</span>
                          </button>
                          <button
                            onClick={() => handleShare('facebook')}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Facebook className="w-4 h-4 text-blue-600" />
                            <span>Facebook</span>
                          </button>
                          <button
                            onClick={() => handleShare('linkedin')}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Linkedin className="w-4 h-4 text-blue-700" />
                            <span>LinkedIn</span>
                          </button>
                          <button
                            onClick={() => handleShare('copy')}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <LinkIcon className="w-4 h-4 text-gray-500" />
                            <span>Copy Link</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-2 rounded-lg transition-colors ${
                      isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
              
              {copiedText && (
                <div className="mt-4 text-sm text-green-600 font-medium">
                  {copiedText}
                </div>
              )}
            </div>

            {/* Author Bio */}
            <div className="mt-16 p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl">
              <div className="flex items-start space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-white">
                    {post.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.author}</h3>
                  <p className="text-gray-600 mb-4">
                    Expert writer specializing in AI tools and technology trends. Passionate about exploring cutting-edge artificial intelligence solutions and their practical applications in business and daily life.
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-blue-700 hover:text-blue-800 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <div className="mt-20">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">You May Also Like</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedPosts.slice(0, 3).map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={relatedPost.href}
                      className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      {relatedPost.image && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{relatedPost.readTime}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{relatedPost.publishedAt ? new Date(relatedPost.publishedAt).toLocaleDateString() : 'Date not available'}</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            {(prevPost || nextPost) && (
              <div className="mt-20 pt-8 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  {prevPost ? (
                    <Link
                      href={prevPost.href}
                      className="flex items-center space-x-4 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 max-w-md group"
                    >
                      <ArrowLeft className="w-6 h-6 text-blue-600 group-hover:-translate-x-1 transition-transform" />
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Previous</div>
                        <div className="font-medium text-gray-900 line-clamp-2">{prevPost.title}</div>
                      </div>
                    </Link>
                  ) : <div />}
                  
                  {nextPost && (
                    <Link
                      href={nextPost.href}
                      className="flex items-center space-x-4 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 max-w-md group text-right"
                    >
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Next</div>
                        <div className="font-medium text-gray-900 line-clamp-2">{nextPost.title}</div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Social Share */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 hidden xl:block z-40">
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => handleShare('twitter')}
            className="p-3 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors shadow-lg"
            title="Share on Twitter"
          >
            <Twitter className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
            title="Share on Facebook"
          >
            <Facebook className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleShare('linkedin')}
            className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors shadow-lg"
            title="Share on LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg z-40 ${
          readingProgress > 20 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </div>
  )
}