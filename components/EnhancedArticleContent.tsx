'use client'

import { useEffect, useState, useRef } from 'react'
import { 
  Clock, 
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
  ArrowRight
} from 'lucide-react'

interface EnhancedArticleContentProps {
  content: string
  title: string
  readTime?: string
  author?: string
  publishedAt?: string
  tags?: string[]
  category?: string
}

interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

export default function EnhancedArticleContent({ 
  content, 
  title, 
  readTime = "5 min read",
  author = "AI Tools Expert",
  publishedAt,
  tags = [],
  category
}: EnhancedArticleContentProps) {
  const [readingProgress, setReadingProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const [showTOC, setShowTOC] = useState(false)
  const [copiedText, setCopiedText] = useState('')
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [estimatedReadTime, setEstimatedReadTime] = useState(readTime)
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([])
  const contentRef = useRef<HTMLDivElement>(null)

  // Enhanced markdown formatter with modern design elements
  const formatContent = (content: string) => {
    // Clean up content first - remove any leading title if it matches the post title
    let cleanContent = content.trim()
    
    // Remove any leading H1 that matches the title (case insensitive)
    if (title) {
      const titleRegex = new RegExp(`^#\\s*${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\n?`, 'i')
      cleanContent = cleanContent.replace(titleRegex, '')
    }
    
    // Remove any standalone # at the beginning
    cleanContent = cleanContent.replace(/^#\s*\n?/, '')
    
    const lines = cleanContent.split('\n')
    const processedLines: string[] = []
    let inCodeBlock = false
    let inList = false
    let inTable = false
    let listItems: string[] = []
    let tableRows: string[] = []
    let codeLanguage = ''
    
    const flushList = () => {
      if (listItems.length > 0) {
        processedLines.push(`
          <div class="my-8">
            <ul class="space-y-4 relative">
              <div class="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-400 to-primary-600 opacity-30"></div>
              ${listItems.join('')}
            </ul>
          </div>
        `)
        listItems = []
        inList = false
      }
    }

    const flushTable = () => {
      if (tableRows.length > 0) {
        const headerRow = tableRows[0]
        const bodyRows = tableRows.slice(2) // Skip separator row
        
        processedLines.push(`
          <div class="my-12 overflow-hidden rounded-2xl shadow-xl border border-gray-200">
            <table class="w-full">
              <thead class="bg-gradient-to-r from-primary-600 to-blue-600">
                ${headerRow}
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                ${bodyRows.join('')}
              </tbody>
            </table>
          </div>
        `)
        tableRows = []
        inTable = false
      }
    }
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim()
      
      if (!line) {
        if (!inCodeBlock) {
          flushList()
          processedLines.push('<div class="my-6"></div>')
        }
        continue
      }
      
      // Enhanced code blocks with syntax highlighting simulation
      if (line.startsWith('```')) {
        flushList()
        if (!inCodeBlock) {
          codeLanguage = line.substring(3).trim() || 'text'
          processedLines.push(`
            <div class="my-8 group">
              <div class="bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-xl px-6 py-3 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="flex space-x-1.5">
                    <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span class="text-gray-400 text-sm font-mono">${codeLanguage}</span>
                </div>
                <button onclick="copyCode(this)" class="text-gray-400 hover:text-white transition-colors p-1 rounded opacity-0 group-hover:opacity-100">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </button>
              </div>
              <pre class="bg-gray-900 text-gray-100 p-6 rounded-b-xl overflow-x-auto border-t border-gray-700"><code class="text-sm font-mono leading-relaxed">
          `)
          inCodeBlock = true
        } else {
          processedLines.push('</code></pre></div>')
          inCodeBlock = false
        }
        continue
      }
      
      if (inCodeBlock) {
        processedLines.push(line)
        continue
      }
      
      // Enhanced headers with modern styling and auto-generated IDs
      if (line.startsWith('#### ')) {
        flushList()
        flushTable()
        const headerText = line.substring(5).trim()
        const slug = headerText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        processedLines.push(`
          <h4 id="${slug}" class="text-xl font-semibold text-gray-900 mb-4 mt-8 leading-tight scroll-mt-24">
            <span class="text-gray-900">${headerText}</span>
          </h4>
        `)
        continue
      }
      
      if (line.startsWith('### ')) {
        flushList()
        flushTable()
        const headerText = line.substring(4).trim()
        const slug = headerText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        processedLines.push(`
          <h3 id="${slug}" class="text-2xl font-bold text-gray-900 mb-6 mt-12 leading-tight scroll-mt-24">
            <span class="text-gray-900">${headerText}</span>
          </h3>
        `)
        continue
      }
      
      if (line.startsWith('## ')) {
        flushList()
        flushTable()
        const headerText = line.substring(3).trim()
        const slug = headerText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        
        processedLines.push(`
          <h2 id="${slug}" class="text-3xl font-bold text-gray-900 mb-8 mt-16 leading-tight scroll-mt-24">
            <span class="text-gray-900">${headerText}</span>
          </h2>
        `)
        continue
      }
      
      if (line.startsWith('# ')) {
        flushList()
        flushTable()
        const headerText = line.substring(2).trim()
        
        // Skip if this header matches the title (avoid duplicate titles)
        if (title && headerText.toLowerCase() === title.toLowerCase()) {
          continue
        }
        
        const slug = headerText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        processedLines.push(`
          <h1 id="${slug}" class="text-4xl md:text-5xl font-bold text-gray-900 mb-10 mt-16 first:mt-0 leading-tight scroll-mt-24">
            <span class="text-gray-900">${headerText}</span>
          </h1>
        `)
        continue
      }
      
      // Enhanced table processing
      if (line.includes('|') && line.trim().startsWith('|') && line.trim().endsWith('|')) {
        flushList()
        
        if (!inTable) {
          inTable = true
          tableRows = []
        }
        
        const cells = line.split('|').slice(1, -1).map(cell => cell.trim())
        
        // Skip separator rows (like |:-----|:-----|)
        if (cells.every(cell => cell.match(/^:?-+:?$/))) {
          continue
        }
        
        const isHeader = tableRows.length === 0
        const cellTag = isHeader ? 'th' : 'td'
        const cellClass = isHeader 
          ? 'px-6 py-4 text-left text-sm font-semibold text-white' 
          : 'px-6 py-4 text-sm text-gray-900'
        
        const row = `
          <tr class="${isHeader ? '' : 'hover:bg-gray-50 transition-colors'}">
            ${cells.map(cell => `<${cellTag} class="${cellClass}">${formatInlineContent(cell)}</${cellTag}>`).join('')}
          </tr>
        `
        
        tableRows.push(row)
        continue
      } else {
        flushTable()
      }

      // Enhanced lists with modern styling
      if (line.match(/^[\*\-]\s+/) || line.match(/^\d+\.\s+/)) {
        flushTable()
        const isNumbered = line.match(/^\d+\.\s+/)
        const listContent = line.replace(/^[\*\-]\s+/, '').replace(/^\d+\.\s+/, '').trim()
        
        if (!inList) {
          inList = true
          listItems = []
        }
        
        if (isNumbered) {
          const number = line.match(/^(\d+)\./)?.[1] || '1'
          listItems.push(`
            <li class="mb-3 flex items-start pl-8 relative">
              <span class="absolute left-0 top-0 w-6 h-6 bg-primary-600 text-white text-sm font-bold rounded-full flex items-center justify-center shadow-sm">${number}</span>
              <span class="text-gray-700 leading-relaxed">${formatInlineContent(listContent)}</span>
            </li>
          `)
        } else {
          listItems.push(`
            <li class="mb-3 flex items-start pl-6 relative">
              <span class="absolute left-0 top-2 w-2 h-2 bg-primary-600 rounded-full"></span>
              <span class="text-gray-700 leading-relaxed">${formatInlineContent(listContent)}</span>
            </li>
          `)
        }
        continue
      } else {
        flushList()
      }
      
      // Enhanced blockquotes with different types
      if (line.startsWith('> ')) {
        const quoteContent = line.substring(2).trim()
        let quoteType = 'default'
        let icon = 'quote'
        let colorClass = 'border-primary-500 bg-primary-50'
        
        if (quoteContent.toLowerCase().includes('tip') || quoteContent.toLowerCase().includes('pro tip')) {
          quoteType = 'tip'
          icon = 'lightbulb'
          colorClass = 'border-green-500 bg-green-50'
        } else if (quoteContent.toLowerCase().includes('warning') || quoteContent.toLowerCase().includes('caution')) {
          quoteType = 'warning'
          icon = 'alert-triangle'
          colorClass = 'border-yellow-500 bg-yellow-50'
        } else if (quoteContent.toLowerCase().includes('info') || quoteContent.toLowerCase().includes('note')) {
          quoteType = 'info'
          icon = 'info'
          colorClass = 'border-blue-500 bg-blue-50'
        }
        
        processedLines.push(`
          <div class="my-8 ${colorClass} border-l-4 rounded-r-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                ${getIconSVG(icon)}
              </div>
              <div class="flex-1">
                <div class="text-gray-800 leading-relaxed font-medium">${formatInlineContent(quoteContent)}</div>
              </div>
            </div>
          </div>
        `)
        continue
      }
      
      // Skip standalone # characters or lines that are just markdown artifacts
      if (line.trim() === '#' || line.trim() === '##' || line.trim() === '###') {
        continue
      }
      
      // Enhanced paragraphs with smart typography
      if (line.trim()) {
        flushTable()
        
        const isQuestion = line.includes('?') && line.length < 100
        if (isQuestion) {
          const slug = line.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          processedLines.push(`
            <div id="${slug}" class="my-8 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-6 shadow-sm scroll-mt-24">
              <h3 class="text-lg font-semibold text-primary-800 mb-3 flex items-center">
                <span class="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">Q</span>
                ${formatInlineContent(line)}
              </h3>
            </div>
          `)
        } else {
          const isFirstParagraph = processedLines.length === 0 || processedLines[processedLines.length - 1].includes('<h')
          const paragraphClass = isFirstParagraph 
            ? 'mb-6 text-gray-800 leading-relaxed text-lg first-letter:text-5xl first-letter:font-bold first-letter:text-primary-600 first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-none'
            : 'mb-6 text-gray-700 leading-relaxed text-base'
          
          processedLines.push(`<p class="${paragraphClass}">${formatInlineContent(line)}</p>`)
        }
      }
    }
    
    flushList()
    flushTable()
    return processedLines.join('\n')
  }

  // Enhanced inline content formatting
  const formatInlineContent = (text: string): string => {
    return text
      // Enhanced bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      // Enhanced italic text
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
      // Enhanced inline code
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>')
      // Enhanced links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 hover:text-primary-700 font-medium underline decoration-primary-300 hover:decoration-primary-500 transition-colors" target="_blank" rel="noopener noreferrer">$1</a>')
      // Enhanced images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<figure class="my-8"><div class="relative overflow-hidden rounded-xl shadow-lg"><img src="$2" alt="$1" class="w-full object-cover" loading="lazy" /></div><figcaption class="text-sm text-gray-600 text-center mt-3 italic">$1</figcaption></figure>')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Helper function to get icon SVG
  const getIconSVG = (iconName: string) => {
    const icons = {
      quote: '<svg class="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>',
      lightbulb: '<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>',
      'alert-triangle': '<svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>',
      info: '<svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    }
    return icons[iconName as keyof typeof icons] || icons.quote
  }

  // Extract table of contents
  useEffect(() => {
    const headings = content.split('\n')
      .map(line => line.trim())
      .filter(line => line.match(/^#{1,4}\s+/))
      .map(line => {
        const level = (line.match(/^#+/) || [''])[0].length
        const text = line.replace(/^#+\s*/, '').trim()
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        return { id, text, level }
      })
      .filter(item => item.text.length > 0)

    setTableOfContents(headings)
  }, [content])

  // Reading progress and active section tracking
  useEffect(() => {
    const handleScroll = () => {
      const article = contentRef.current
      if (!article) return

      const scrollTop = window.pageYOffset
      const windowHeight = window.innerHeight
      const articleTop = article.offsetTop
      const articleHeight = article.offsetHeight

      // Calculate reading progress
      const progress = Math.min(
        Math.max((scrollTop - articleTop + windowHeight * 0.3) / articleHeight * 100, 0),
        100
      )
      setReadingProgress(progress)

      // Find active section
      const headings = article.querySelectorAll('h1, h2, h3, h4')
      let currentSection = ''
      
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect()
        if (rect.top <= 100) {
          currentSection = heading.id
        }
      })
      
      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Copy code functionality
  useEffect(() => {
    const copyCode = (button: HTMLButtonElement) => {
      const codeBlock = button.closest('.group')?.querySelector('code')
      if (codeBlock) {
        navigator.clipboard.writeText(codeBlock.textContent || '')
        setCopiedText('Code copied!')
        setTimeout(() => setCopiedText(''), 2000)
      }
    }

    // Make copyCode available globally
    ;(window as any).copyCode = copyCode
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setShowTOC(false)
    }
  }

  const shareArticle = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: window.location.href
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopiedText('Link copied!')
      setTimeout(() => setCopiedText(''), 2000)
    }
  }

  return (
    <>
      {/* Enhanced Reading Progress */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50 shadow-sm">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 via-blue-500 to-purple-500 transition-all duration-300 shadow-sm" 
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed right-6 bottom-6 z-40 flex flex-col space-y-3">
        {/* Table of Contents Toggle */}
        {tableOfContents.length > 3 && (
          <button
            onClick={() => setShowTOC(!showTOC)}
            className="w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
            aria-label="Table of Contents"
          >
            {showTOC ? (
              <X className="w-5 h-5 text-gray-600 group-hover:text-primary-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600 group-hover:text-primary-600" />
            )}
          </button>
        )}

        {/* Share Button */}
        <button
          onClick={shareArticle}
          className="w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
          aria-label="Share Article"
        >
          <Share2 className="w-5 h-5 text-gray-600 group-hover:text-primary-600" />
        </button>

        {/* Bookmark Button */}
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
          aria-label="Bookmark Article"
        >
          <Bookmark className={`w-5 h-5 transition-colors ${isBookmarked ? 'text-primary-600 fill-current' : 'text-gray-600 group-hover:text-primary-600'}`} />
        </button>

        {/* Back to Top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 ${readingProgress > 10 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label="Back to Top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>

      {/* Floating Table of Contents */}
      {showTOC && tableOfContents.length > 3 && (
        <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
          {/* Mobile Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 lg:hidden"
            onClick={() => setShowTOC(false)}
          />
          
          {/* TOC Panel */}
          <div className="absolute right-6 top-20 bottom-20 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden lg:fixed lg:right-8 lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:bottom-auto lg:h-auto lg:max-h-96">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-blue-50">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Menu className="w-4 h-4 mr-2 text-primary-600" />
                  Quick Navigation
                </h4>
                <button
                  onClick={() => setShowTOC(false)}
                  className="p-1 hover:bg-white rounded-lg transition-colors lg:hidden"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-80">
              <nav className="space-y-2">
                {tableOfContents.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center group ${
                      activeSection === item.id 
                        ? 'bg-primary-100 text-primary-800 border-l-2 border-primary-500' 
                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                    style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}
                  >
                    <span className={`w-2 h-2 rounded-full mr-3 transition-colors ${
                      activeSection === item.id ? 'bg-primary-500' : 'bg-gray-300 group-hover:bg-primary-400'
                    }`} />
                    <span className="text-sm font-medium truncate">{item.text}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Article Metadata Bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm mb-8">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-primary-500" />
                <span>{estimatedReadTime}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2 text-primary-500" />
                <span>Reading: {Math.round(readingProgress)}%</span>
              </div>
              {author && (
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-blue-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-xs font-bold text-white">{author.charAt(0)}</span>
                  </div>
                  <span>{author}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Article Content */}
      <article className="max-w-none" ref={contentRef}>
        {/* Enhanced Table of Contents for Desktop */}
        {tableOfContents.length > 3 && (
          <div className="bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50 border border-primary-200 rounded-2xl p-8 mb-12 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <Menu className="w-5 h-5 text-white" />
              </div>
              Table of Contents
            </h3>
            <nav className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tableOfContents.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center text-left p-4 bg-white rounded-xl hover:bg-primary-50 transition-all duration-200 group border border-gray-100 hover:border-primary-200 hover:shadow-sm"
                >
                  <span className="w-8 h-8 bg-gradient-to-br from-primary-100 to-blue-100 text-primary-600 rounded-lg flex items-center justify-center text-sm font-bold mr-4 group-hover:scale-110 transition-transform">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 group-hover:text-primary-700 font-medium text-sm leading-tight">
                    {item.text}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Formatted Content */}
        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ 
            __html: formatContent(content)
          }} 
        />
      </article>

      {/* Success Message */}
      {copiedText && (
        <div className="fixed bottom-20 right-6 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
          <Check className="w-4 h-4 mr-2" />
          {copiedText}
        </div>
      )}

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        .article-content {
          line-height: 1.7;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        .article-content h1,
        .article-content h2,
        .article-content h3,
        .article-content h4 {
          scroll-margin-top: 6rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          font-weight: 700;
          letter-spacing: -0.025em;
        }
        
        .article-content p {
          margin-bottom: 1.5rem;
          font-size: 1.125rem;
          line-height: 1.7;
          color: #374151;
        }
        
        .article-content p:first-of-type::first-letter {
          font-size: 4rem;
          line-height: 1;
          margin-right: 8px;
          margin-top: 4px;
          font-family: serif;
          font-weight: 700;
          color: #3b82f6;
          float: left;
        }
        
        .article-content strong {
          font-weight: 600;
          color: #111827;
        }
        
        .article-content em {
          font-style: italic;
          color: #6b7280;
        }
        
        .article-content ul, .article-content ol {
          margin: 1.5rem 0;
        }
        
        .article-content li {
          margin-bottom: 0.75rem;
        }
        
        .article-content blockquote {
          margin: 2rem 0;
          padding: 1.5rem;
          border-left: 4px solid #3b82f6;
          background: #f8fafc;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #4b5563;
        }
        
        .article-content code {
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
          font-size: 0.875rem;
        }
        
        .article-content pre {
          margin: 2rem 0;
          padding: 1.5rem;
          background: #1f2937;
          border-radius: 8px;
          overflow-x: auto;
          font-size: 0.875rem;
          line-height: 1.5;
        }
        
        .article-content pre code {
          color: #e5e7eb;
          background: none;
          padding: 0;
        }
        
        .article-content a {
          color: #3b82f6;
          text-decoration: underline;
          text-decoration-color: #93c5fd;
          text-underline-offset: 2px;
          transition: all 0.2s ease;
        }
        
        .article-content a:hover {
          color: #1d4ed8;
          text-decoration-color: #3b82f6;
        }
        
        /* Enhanced mobile responsiveness */
        @media (max-width: 768px) {
          .article-content p {
            font-size: 1rem;
            line-height: 1.6;
          }
          
          .article-content p:first-of-type::first-letter {
            font-size: 3rem;
            margin-right: 6px;
            margin-top: 2px;
          }
          
          .article-content h1 { 
            font-size: 2rem; 
            line-height: 1.2;
          }
          .article-content h2 { 
            font-size: 1.75rem; 
            line-height: 1.3;
          }
          .article-content h3 { 
            font-size: 1.5rem; 
            line-height: 1.3;
          }
          .article-content h4 { 
            font-size: 1.25rem; 
            line-height: 1.4;
          }
        }
        
        /* Print optimization */
        @media print {
          .fixed { display: none !important; }
          .sticky { position: static !important; }
          .article-content { 
            font-size: 12pt; 
            line-height: 1.6;
            color: black;
          }
          .article-content h1, 
          .article-content h2, 
          .article-content h3, 
          .article-content h4 { 
            color: black; 
            page-break-after: avoid;
          }
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
          .article-content {
            color: black;
            background: white;
          }
          
          .article-content a {
            color: #0000EE;
            text-decoration: underline;
          }
        }
      `}</style>
    </>
  )
}