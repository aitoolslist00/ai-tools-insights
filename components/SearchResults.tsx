'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, Star, Users, ExternalLink } from 'lucide-react'
import { aiToolsData } from '@/lib/tools-data'
import { BlogPost } from '@/lib/blog-data'
import { trackSearch } from './AdvancedAnalytics'

interface SearchResultsProps {
  query?: string
  category?: string
  type?: string
}

interface SearchResult {
  id: string
  title: string
  description: string
  url: string
  type: 'tool' | 'blog'
  category: string
  rating?: number
  users?: string
  image?: string
  tags?: string[]
}

export default function SearchResults({ query = '', category = '', type = '' }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'popularity'>('relevance')
  const [filterType, setFilterType] = useState<'all' | 'tool' | 'blog'>(() => {
    // Initialize filterType based on URL parameter
    if (type === 'tools' || type === 'tool') return 'tool'
    if (type === 'blog') return 'blog'
    return 'all'
  })

  // Update filterType when type prop changes
  useEffect(() => {
    if (type === 'tools' || type === 'tool') {
      setFilterType('tool')
    } else if (type === 'blog') {
      setFilterType('blog')
    } else if (!type) {
      setFilterType('all')
    }
  }, [type])

  useEffect(() => {
    const searchContent = async () => {
      setLoading(true)
      
      try {
        // Search AI Tools
        const toolResults: SearchResult[] = aiToolsData
          .filter(tool => {
            // If no query, show all tools (matchesQuery = true)
            const matchesQuery = !query.trim() || 
              tool.name.toLowerCase().includes(query.toLowerCase()) ||
              tool.description.toLowerCase().includes(query.toLowerCase()) ||
              tool.longDescription.toLowerCase().includes(query.toLowerCase()) ||
              tool.features.some(feature => feature.toLowerCase().includes(query.toLowerCase())) ||
              tool.useCases.some(useCase => useCase.toLowerCase().includes(query.toLowerCase()))
            
            // If no category, show all categories (matchesCategory = true)
            const matchesCategory = !category.trim() || 
              tool.category.toLowerCase().includes(category.toLowerCase()) ||
              tool.category.toLowerCase() === category.toLowerCase()
            
            return matchesQuery && matchesCategory
          })
          .map(tool => ({
            id: tool.id,
            title: tool.name,
            description: tool.description,
            url: `/ai-tools/${tool.id}`,
            type: 'tool' as const,
            category: tool.category,
            rating: tool.rating,
            users: tool.users,
            image: `/screenshots/${tool.id}.jpg`,
            tags: [tool.category, ...tool.features.slice(0, 3)]
          }))

        // Search Blog Posts
        let blogResults: SearchResult[] = []
        try {
          const blogResponse = await fetch('/api/blog')
          if (blogResponse.ok) {
            const blogPosts: BlogPost[] = await blogResponse.json()
            blogResults = blogPosts
              .filter(post => {
                // If no query, show all posts (matchesQuery = true)
                const matchesQuery = !query.trim() ||
                  post.title.toLowerCase().includes(query.toLowerCase()) ||
                  post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
                  post.content.toLowerCase().includes(query.toLowerCase()) ||
                  post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
                
                // If no category, show all categories (matchesCategory = true)
                const matchesCategory = !category.trim() || 
                  post.category.toLowerCase().includes(category.toLowerCase()) ||
                  post.category.toLowerCase() === category.toLowerCase()
                
                return matchesQuery && matchesCategory
              })
              .map(post => ({
                id: post.id,
                title: post.title.replace(/^#+\s*/, ''),
                description: post.excerpt,
                url: `/blog/${post.id}`,
                type: 'blog' as const,
                category: post.category,
                image: post.image,
                tags: post.tags
              }))
          }
        } catch (error) {
          console.error('Error fetching blog posts:', error)
          // Continue with empty blog results
        }

        // Combine and filter results
        let allResults = [...toolResults, ...blogResults]
        
        // Apply type filter
        if (filterType !== 'all') {
          allResults = allResults.filter(result => result.type === filterType)
        }

        // Sort results
        allResults.sort((a, b) => {
          switch (sortBy) {
            case 'rating':
              return (b.rating || 0) - (a.rating || 0)
            case 'popularity':
              const aUsers = parseInt(a.users?.replace(/[^\d]/g, '') || '0')
              const bUsers = parseInt(b.users?.replace(/[^\d]/g, '') || '0')
              return bUsers - aUsers
            default: // relevance
              // Simple relevance scoring based on query matches
              const aScore = calculateRelevanceScore(a, query)
              const bScore = calculateRelevanceScore(b, query)
              return bScore - aScore
          }
        })

        setResults(allResults)
        
        // Track search
        if (query) {
          trackSearch(query, allResults.length)
        }
        
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    searchContent()
  }, [query, category, type, sortBy, filterType])

  const calculateRelevanceScore = (result: SearchResult, searchQuery: string): number => {
    if (!searchQuery) return 0
    
    const queryLower = searchQuery.toLowerCase()
    let score = 0
    
    // Title matches (highest weight)
    if (result.title.toLowerCase().includes(queryLower)) {
      score += 10
    }
    
    // Description matches
    if (result.description.toLowerCase().includes(queryLower)) {
      score += 5
    }
    
    // Tag matches
    if (result.tags?.some(tag => tag.toLowerCase().includes(queryLower))) {
      score += 3
    }
    
    // Category matches
    if (result.category.toLowerCase().includes(queryLower)) {
      score += 2
    }
    
    return score
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {results.length} results {query && `for "${query}"`}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'tool' | 'blog')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Results</option>
            <option value="tool">AI Tools</option>
            <option value="blog">Blog Posts</option>
          </select>
          
          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'relevance' | 'rating' | 'popularity')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="relevance">Most Relevant</option>
            <option value="rating">Highest Rated</option>
            <option value="popularity">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No results found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Try adjusting your search terms or browse our categories.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {results.map((result) => (
            <div
              key={`${result.type}-${result.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Image */}
                {result.image && (
                  <div className="flex-shrink-0">
                    <img
                      src={result.image}
                      alt={result.title}
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder-tool.jpg'
                      }}
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          result.type === 'tool' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {result.type === 'tool' ? 'AI Tool' : 'Blog Post'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {result.category}
                        </span>
                      </div>
                      
                      <Link
                        href={result.url}
                        className="block group"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {result.title}
                        </h3>
                      </Link>
                      
                      <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                        {result.description}
                      </p>
                      
                      {/* Tags */}
                      {result.tags && result.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {result.tags.slice(0, 4).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Metadata */}
                    <div className="flex flex-col items-end gap-2 text-sm text-gray-500 dark:text-gray-400">
                      {result.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{result.rating}</span>
                        </div>
                      )}
                      
                      {result.users && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{result.users}</span>
                        </div>
                      )}
                      
                      <Link
                        href={result.url}
                        className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}