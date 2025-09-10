'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Filter, X, Calendar, Tag, TrendingUp, Clock } from 'lucide-react'
import { BlogPost, blogCategories } from '@/lib/blog-data'

interface BlogSearchAndFilterProps {
  posts: BlogPost[]
  onFilteredPosts: (posts: BlogPost[]) => void
}

type SortOption = 'newest' | 'oldest' | 'featured' | 'popular'

export default function BlogSearchAndFilter({ posts, onFilteredPosts }: BlogSearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showFilters, setShowFilters] = useState(false)

  // Get all unique tags from posts
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    posts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [posts])

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = posts.filter(post => {
      // Search query filter
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Category filter
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory

      // Tags filter
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => post.tags.includes(tag))

      return matchesSearch && matchesCategory && matchesTags
    })

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          const dateA = new Date(a.publishedAt || a.date || a.updatedAt || '1970-01-01').getTime()
          const dateB = new Date(b.publishedAt || b.date || b.updatedAt || '1970-01-01').getTime()
          return dateB - dateA
        case 'oldest':
          const oldDateA = new Date(a.publishedAt || a.date || a.updatedAt || '1970-01-01').getTime()
          const oldDateB = new Date(b.publishedAt || b.date || b.updatedAt || '1970-01-01').getTime()
          return oldDateA - oldDateB
        case 'featured':
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return 0
        case 'popular':
          const viewsA = a.analytics?.views || 0
          const viewsB = b.analytics?.views || 0
          return viewsB - viewsA
        default:
          return 0
      }
    })

    return filtered
  }, [posts, searchQuery, selectedCategory, selectedTags, sortBy])

  // Update parent component with filtered posts
  useEffect(() => {
    onFilteredPosts(filteredPosts)
  }, [filteredPosts, onFilteredPosts])

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedTags([])
    setSortBy('newest')
  }

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedTags.length > 0 || sortBy !== 'newest'

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Search Bar */}
      <div className="p-6 border-b border-gray-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search articles, authors, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg border-0 focus:ring-0 focus:outline-none placeholder-gray-400"
          />
        </div>
      </div>

      {/* Filter Toggle & Results Count */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {(selectedCategory !== 'all' ? 1 : 0) + selectedTags.length + (sortBy !== 'newest' ? 1 : 0)}
              </span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        <div className="text-sm text-gray-500">
          {filteredPosts.length} of {posts.length} articles
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-b border-gray-100 overflow-hidden transition-all duration-200 ease-in-out">
            <div className="p-6 space-y-6">
              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Sort by
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { value: 'newest', label: 'Newest', icon: Calendar },
                    { value: 'oldest', label: 'Oldest', icon: Clock },
                    { value: 'featured', label: 'Featured', icon: TrendingUp },
                    { value: 'popular', label: 'Popular', icon: TrendingUp }
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setSortBy(value as SortOption)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        sortBy === value
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                    }`}
                  >
                    All Categories
                  </button>
                  {blogCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {allTags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                        }`}
                      >
                        <Tag className="h-3 w-3" />
                        <span>{tag}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-blue-700">Active filters:</span>
            
            {searchQuery && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                <Search className="h-3 w-3" />
                <span>"{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')}>
                  <X className="h-3 w-3 hover:text-blue-900" />
                </button>
              </span>
            )}
            
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                <span>{blogCategories.find(c => c.id === selectedCategory)?.name}</span>
                <button onClick={() => setSelectedCategory('all')}>
                  <X className="h-3 w-3 hover:text-blue-900" />
                </button>
              </span>
            )}
            
            {selectedTags.map(tag => (
              <span key={tag} className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                <Tag className="h-3 w-3" />
                <span>{tag}</span>
                <button onClick={() => handleTagToggle(tag)}>
                  <X className="h-3 w-3 hover:text-blue-900" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}