'use client'

import { useEffect } from 'react'

interface ArticleContentProps {
  content: string
  title: string
}

export default function ArticleContent({ content, title }: ArticleContentProps) {
  // Advanced markdown-like content formatter with better styling
  const formatContent = (content: string) => {
    // Split content into lines for better processing
    const lines = content.split('\n')
    const processedLines: string[] = []
    let inCodeBlock = false
    let inList = false
    let listItems: string[] = []
    
    const flushList = () => {
      if (listItems.length > 0) {
        processedLines.push('<ul class="space-y-3 my-6 ml-4">')
        processedLines.push(...listItems)
        processedLines.push('</ul>')
        listItems = []
        inList = false
      }
    }
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim()
      
      // Skip empty lines but preserve spacing
      if (!line) {
        if (!inCodeBlock) {
          flushList()
          processedLines.push('<div class="my-4"></div>')
        }
        continue
      }
      
      // Handle code blocks
      if (line.startsWith('```')) {
        flushList()
        if (!inCodeBlock) {
          processedLines.push('<pre class="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto my-6 border relative"><code class="text-sm font-mono">')
          inCodeBlock = true
        } else {
          processedLines.push('</code></pre>')
          inCodeBlock = false
        }
        continue
      }
      
      if (inCodeBlock) {
        processedLines.push(line)
        continue
      }
      
      // Handle headers with improved styling
      if (line.startsWith('#### ')) {
        flushList()
        const headerText = line.substring(5).trim()
        const slug = headerText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        processedLines.push(`<h4 id="${slug}" class="text-lg md:text-xl font-semibold text-gray-900 mb-4 mt-8 leading-tight scroll-mt-20 relative group" style="scroll-margin-top: 5rem;"><span class="absolute -left-6 opacity-0 group-hover:opacity-100 transition-opacity text-primary-400 font-normal">#</span>${headerText}</h4>`)
        continue
      }
      
      if (line.startsWith('### ')) {
        flushList()
        const headerText = line.substring(4).trim()
        const slug = headerText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        processedLines.push(`<h3 id="${slug}" class="text-xl md:text-2xl font-bold text-gray-900 mb-5 mt-10 leading-tight scroll-mt-20 relative group" style="scroll-margin-top: 5rem;"><span class="absolute -left-6 opacity-0 group-hover:opacity-100 transition-opacity text-primary-400 font-normal">##</span>${headerText}</h3>`)
        continue
      }
      
      if (line.startsWith('## ')) {
        flushList()
        const headerText = line.substring(3).trim()
        const slug = headerText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        // Special styling for FAQ section
        const isFAQ = headerText.toLowerCase().includes('frequently asked questions')
        const faqClass = isFAQ ? 'bg-gradient-to-r from-primary-50 to-blue-50 -mx-6 px-6 py-4 rounded-xl border-l-4 border-primary-500' : ''
        processedLines.push(`<h2 id="${slug}" class="text-2xl md:text-3xl font-bold text-gray-900 mb-6 mt-12 leading-tight scroll-mt-20 relative group ${faqClass}" style="scroll-margin-top: 5rem;"><span class="absolute -left-6 opacity-0 group-hover:opacity-100 transition-opacity text-primary-400 font-normal">##</span>${headerText}</h2>`)
        continue
      }
      
      if (line.startsWith('# ')) {
        flushList()
        const headerText = line.substring(2).trim()
        const slug = headerText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        processedLines.push(`<h1 id="${slug}" class="text-3xl md:text-4xl font-bold text-gray-900 mb-8 mt-12 first:mt-0 leading-tight scroll-mt-20 relative group" style="scroll-margin-top: 5rem;"><span class="absolute -left-6 opacity-0 group-hover:opacity-100 transition-opacity text-primary-400 font-normal">#</span>${headerText}</h1>`)
        continue
      }
      
      // Handle lists
      if (line.match(/^[\*\-]\s+/) || line.match(/^\d+\.\s+/)) {
        const isNumbered = line.match(/^\d+\.\s+/)
        const listContent = line.replace(/^[\*\-]\s+/, '').replace(/^\d+\.\s+/, '').trim()
        
        if (!inList) {
          inList = true
          listItems = []
        }
        
        if (isNumbered) {
          const number = line.match(/^(\d+)\./)?.[1] || '1'
          listItems.push(`<li class="mb-3 flex items-start"><span class="text-primary-500 mr-3 mt-1 font-medium min-w-[1.5rem]">${number}.</span><span>${formatInlineContent(listContent)}</span></li>`)
        } else {
          listItems.push(`<li class="mb-3 flex items-start"><span class="text-primary-500 mr-3 mt-1 font-bold">•</span><span>${formatInlineContent(listContent)}</span></li>`)
        }
        continue
      } else {
        flushList()
      }
      
      // Handle blockquotes
      if (line.startsWith('> ')) {
        const quoteContent = line.substring(2).trim()
        processedLines.push(`<blockquote class="border-l-4 border-primary-500 bg-primary-50 pl-6 pr-4 py-4 my-6 italic text-gray-700 rounded-r-lg relative"><span class="absolute -left-2 -top-2 text-4xl text-primary-400 opacity-50">"</span>${formatInlineContent(quoteContent)}</blockquote>`)
        continue
      }
      
      // Handle horizontal rules
      if (line === '---' || line === '***') {
        processedLines.push('<hr class="my-12 border-gray-200" />')
        continue
      }
      
      // Handle regular paragraphs with improved typography
      if (line.trim()) {
        // Check if this line starts with special formatting words that should be cleaned
        line = line.replace(/^(Additionally,|Nevertheless,)\s+/, '')
        
        // Check if this is a question (for FAQ styling)
        const isQuestion = line.trim().startsWith('###') && line.includes('?')
        if (isQuestion) {
          const questionText = line.replace(/^###\s*/, '').trim()
          const slug = questionText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          processedLines.push(`<h3 id="${slug}" class="text-lg md:text-xl font-semibold text-primary-700 mb-3 mt-8 leading-tight scroll-mt-20 bg-primary-50 p-4 rounded-lg border-l-4 border-primary-500" style="scroll-margin-top: 5rem;">${questionText}</h3>`)
        } else {
          // Enhanced paragraph styling with better readability
          const isFirstParagraph = processedLines.length === 0 || processedLines[processedLines.length - 1].includes('<h')
          const paragraphClass = isFirstParagraph 
            ? 'mb-6 text-gray-800 leading-relaxed text-lg md:text-xl font-medium first-letter:text-4xl first-letter:font-bold first-letter:text-primary-600 first-letter:float-left first-letter:mr-2 first-letter:mt-1'
            : 'mb-6 text-gray-700 leading-relaxed text-base md:text-lg'
          processedLines.push(`<p class="${paragraphClass}">${formatInlineContent(line)}</p>`)
        }
      }
    }
    
    // Flush any remaining list
    flushList()
    
    return processedLines.join('\n')
  }
  
  // Helper function to format inline content (bold, italic, links, etc.)
  const formatInlineContent = (text: string): string => {
    return text
      // Bold text with enhanced styling
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 bg-yellow-50 px-1 rounded">$1</strong>')
      // Italic text
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
      // Inline code with better styling
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono border shadow-sm">$1</code>')
      // Links with enhanced hover effects
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 hover:text-primary-700 underline decoration-2 underline-offset-2 font-medium transition-all duration-200 hover:bg-primary-50 px-1 rounded" target="_blank" rel="noopener noreferrer">$1 <span class="inline-block ml-1 text-xs">↗</span></a>')
      // Images with better styling
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<figure class="my-8 group"><img src="$2" alt="$1" class="rounded-xl shadow-lg w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" loading="lazy" /><figcaption class="text-sm text-gray-600 text-center mt-3 italic bg-gray-50 py-2 px-4 rounded-lg">$1</figcaption></figure>')
      // Remove citation numbers like [1], [14], etc.
      .replace(/\s*\[\d+(?:,\s*\d+)*\]/g, '')
      // Clean up extra whitespace
      .replace(/\s+/g, ' ')
      .trim()
  }

  useEffect(() => {
    // Reading progress and back to top functionality
    const handleScroll = () => {
      const article = document.querySelector('.article-content') as HTMLElement
      const progress = document.getElementById('reading-progress')
      const backToTop = document.getElementById('back-to-top')
      const scrollTop = window.pageYOffset
      
      // Reading progress
      if (article && progress) {
        const articleTop = article.offsetTop
        const articleHeight = article.offsetHeight
        const windowHeight = window.innerHeight
        const articleBottom = articleTop + articleHeight
        const windowBottom = scrollTop + windowHeight
        
        let progressPercentage = 0
        
        if (scrollTop >= articleTop) {
          if (windowBottom >= articleBottom) {
            progressPercentage = 100
          } else {
            const visibleHeight = windowBottom - articleTop
            progressPercentage = (visibleHeight / articleHeight) * 100
          }
        }
        
        progress.style.width = Math.min(progressPercentage, 100) + '%'
      }
      
      // Back to top button visibility
      if (backToTop) {
        if (scrollTop > 300) {
          backToTop.style.opacity = '1'
          backToTop.style.pointerEvents = 'auto'
        } else {
          backToTop.style.opacity = '0'
          backToTop.style.pointerEvents = 'none'
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Extract headings more carefully, handling various markdown formats
  const headings = content.split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('##') && !line.startsWith('###')) // Only h2 headings
    .map(line => line.replace(/^##\s*/, '').trim())
    .filter(heading => heading.length > 0 && !heading.includes('Nevertheless') && !heading.includes('Additionally'))

  return (
    <>
      {/* Enhanced Reading Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50 shadow-sm">
        <div className="h-full bg-gradient-to-r from-primary-500 to-blue-500 transition-all duration-300 shadow-sm" style={{width: '0%'}} id="reading-progress"></div>
      </div>
      
      {/* Floating Table of Contents for desktop */}
      {headings.length > 3 && (
        <div className="hidden xl:block fixed right-8 top-1/2 transform -translate-y-1/2 z-40">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-xs">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Navigation</h4>
            <nav className="space-y-2">
              {headings.slice(0, 6).map((heading, index) => {
                const slug = heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                return (
                  <a 
                    key={index}
                    href={`#${slug}`}
                    className="block text-xs text-gray-600 hover:text-primary-600 transition-colors duration-200 py-1 border-l-2 border-transparent hover:border-primary-400 pl-2"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    {heading.length > 40 ? heading.substring(0, 40) + '...' : heading}
                  </a>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      <article className="prose prose-xl max-w-none">
        {/* Enhanced Table of Contents */}
        {headings.length > 3 && (
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-6 mb-12 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Table of Contents
            </h3>
            <nav className="space-y-3">
              {headings.map((heading, index) => {
                const slug = heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                return (
                  <div key={index} className="group">
                    <a 
                      href={`#${slug}`}
                      className="flex items-center text-primary-700 hover:text-primary-800 transition-all duration-200 text-base font-medium py-2 px-3 rounded-lg hover:bg-white hover:shadow-sm group-hover:translate-x-1"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      <span className="w-2 h-2 bg-primary-400 rounded-full mr-3 group-hover:bg-primary-600 transition-colors"></span>
                      {heading}
                    </a>
                  </div>
                )
              })}
            </nav>
          </div>
        )}

        {/* Main Content */}
        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ 
            __html: formatContent(content)
          }} 
        />
      </article>

      {/* Back to Top Button */}
      <button
        id="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 z-50 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 pointer-events-none"
        aria-label="Back to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        .article-content {
          line-height: 1.8;
        }
        
        .article-content h1,
        .article-content h2,
        .article-content h3,
        .article-content h4 {
          scroll-margin-top: 5rem;
        }
        
        .article-content h2 {
          position: relative;
        }
        
        .article-content h2::before {
          content: '';
          position: absolute;
          left: -1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 2rem;
          background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
          border-radius: 2px;
          opacity: 0.8;
        }
        
        .article-content table {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .article-content ul li {
          position: relative;
        }
        
        .article-content pre {
          position: relative;
        }
        
        .article-content pre::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(90deg, #374151, #4b5563);
          border-radius: 12px 12px 0 0;
        }
        
        .article-content pre::after {
          content: '⚫ ⚫ ⚫';
          position: absolute;
          top: 12px;
          left: 16px;
          color: #9ca3af;
          font-size: 8px;
          letter-spacing: 4px;
        }
        
        .article-content blockquote {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .article-content blockquote:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }
        
        .article-content p:first-of-type::first-letter {
          font-size: 3.5rem;
          line-height: 1;
          margin-right: 8px;
          margin-top: 4px;
        }
        
        /* Smooth scrolling for the entire page */
        html {
          scroll-behavior: smooth;
        }
        
        /* Enhanced link hover effects */
        .article-content a:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
        }
        
        /* Better mobile typography */
        @media (max-width: 768px) {
          .article-content h1 { font-size: 1.875rem; }
          .article-content h2 { font-size: 1.5rem; }
          .article-content h3 { font-size: 1.25rem; }
          .article-content p { font-size: 1rem; }
          
          /* Hide floating TOC on mobile */
          .fixed.right-8 { display: none; }
        }
        
        /* Print styles */
        @media print {
          .fixed { display: none !important; }
          .article-content { 
            font-size: 12pt; 
            line-height: 1.5;
            color: black;
          }
          .article-content h1, 
          .article-content h2, 
          .article-content h3, 
          .article-content h4 { 
            color: black; 
            page-break-after: avoid;
          }
          .article-content p { 
            orphans: 3; 
            widows: 3; 
          }
          .article-content blockquote {
            border-left: 3px solid #ccc;
            background: #f9f9f9;
          }
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          html {
            scroll-behavior: auto;
          }
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .article-content {
            color: black;
            background: white;
          }
          
          .article-content a {
            color: #0000EE;
            text-decoration: underline;
          }
          
          .article-content h1,
          .article-content h2,
          .article-content h3,
          .article-content h4 {
            color: black;
          }
        }
      `}</style>
    </>
  )
}