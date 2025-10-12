'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface InternalLink {
  url: string
  title: string
  relevanceScore: number
  category: string
  type: 'tool' | 'blog' | 'category'
}

interface InternalLinkingEngineProps {
  currentPage: string
  content: string
  keywords: string[]
  category?: string
  maxLinks?: number
}

export default function InternalLinkingEngine({
  currentPage,
  content,
  keywords,
  category,
  maxLinks = 5
}: InternalLinkingEngineProps) {
  const [suggestedLinks, setSuggestedLinks] = useState<InternalLink[]>([])

  useEffect(() => {
    const generateInternalLinks = async () => {
      try {
        // Simulate API call to get related content
        const relatedContent = await fetchRelatedContent(keywords, category, currentPage)
        
        // Calculate relevance scores based on keyword matching and semantic similarity
        const scoredLinks = relatedContent.map(item => ({
          ...item,
          relevanceScore: calculateRelevanceScore(item, keywords, content)
        }))

        // Sort by relevance and take top links
        const topLinks = scoredLinks
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .slice(0, maxLinks)

        setSuggestedLinks(topLinks)
      } catch (error) {
        console.error('Error generating internal links:', error)
      }
    }

    generateInternalLinks()
  }, [currentPage, content, keywords, category, maxLinks])

  const calculateRelevanceScore = (item: any, keywords: string[], content: string): number => {
    let score = 0
    
    // Keyword matching in title
    keywords.forEach(keyword => {
      if (item.title.toLowerCase().includes(keyword.toLowerCase())) {
        score += 10
      }
    })

    // Category matching
    if (category && item.category === category) {
      score += 15
    }

    // Content similarity (simplified)
    const contentWords = content.toLowerCase().split(' ')
    const itemWords = (item.description || '').toLowerCase().split(' ')
    const commonWords = contentWords.filter(word => itemWords.includes(word))
    score += commonWords.length * 0.5

    // Boost for different content types
    if (item.type === 'tool') score += 5
    if (item.type === 'blog') score += 3
    if (item.type === 'category') score += 2

    return score
  }

  const fetchRelatedContent = async (keywords: string[], category?: string, currentPage?: string) => {
    // This would typically be an API call
    // For now, return mock data based on common AI tools and blog topics
    const mockContent = [
      {
        url: '/ai-tools/chatgpt',
        title: 'ChatGPT - AI Conversational Assistant',
        description: 'Advanced AI chatbot for conversations, writing, and problem-solving',
        category: 'Chatbots',
        type: 'tool' as const
      },
      {
        url: '/ai-tools/midjourney',
        title: 'Midjourney - AI Image Generator',
        description: 'Create stunning AI-generated images from text prompts',
        category: 'Image Generation',
        type: 'tool' as const
      },
      {
        url: '/blog/best-ai-tools-2025',
        title: 'Best AI Tools for Business in 2025',
        description: 'Comprehensive guide to the top AI tools for productivity and business growth',
        category: 'AI Tools',
        type: 'blog' as const
      },
      {
        url: '/ai-tools/github-copilot',
        title: 'GitHub Copilot - AI Code Assistant',
        description: 'AI-powered code completion and programming assistant',
        category: 'Coding',
        type: 'tool' as const
      },
      {
        url: '/blog/ai-image-generators-comparison',
        title: 'AI Image Generators Comparison 2025',
        description: 'Compare the best AI image generation tools available today',
        category: 'Image Generation',
        type: 'blog' as const
      },
      {
        url: '/ai-tools/categories/video-editing',
        title: 'AI Video Editing Tools',
        description: 'Discover the best AI-powered video editing software',
        category: 'Video Editing',
        type: 'category' as const
      }
    ]

    // Filter out current page and return relevant content
    return mockContent.filter(item => item.url !== currentPage)
  }

  if (suggestedLinks.length === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 my-8 border border-blue-200 dark:border-gray-600">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        Related Resources
      </h3>
      
      <div className="grid gap-3">
        {suggestedLinks.map((link, index) => (
          <Link
            key={link.url}
            href={link.url}
            className="group flex items-start p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200"
          >
            <div className="flex-shrink-0 mr-3 mt-1">
              {link.type === 'tool' && (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              )}
              {link.type === 'blog' && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
              {link.type === 'category' && (
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {link.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                {link.category} • {link.type === 'tool' ? 'AI Tool' : link.type === 'blog' ? 'Article' : 'Category'}
              </p>
            </div>
            
            <div className="flex-shrink-0 ml-2">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
      
      {/* SEO Enhancement: Add structured data for internal links */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Related AI Tools and Resources',
            itemListElement: suggestedLinks.map((link, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `https://www.aitoolsinsights.com${link.url}`,
              name: link.title
            }))
          })
        }}
      />
    </div>
  )
}

// CSS for line-clamp (add to globals.css if not already present)
const styles = `
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
`