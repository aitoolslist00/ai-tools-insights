'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  TrendingUp, 
  Calendar,
  Clock,
  Star,
  Award,
  CheckCircle,
  AlertCircle,
  Zap,
  BarChart3,
  Target,
  Globe,
  Image as ImageIcon,
  FileText,
  Settings
} from 'lucide-react'
import { EnhancedBlogPost } from '@/lib/enhanced-blog-generator'

interface EnhancedBlogDashboardProps {
  posts?: EnhancedBlogPost[]
}

export default function EnhancedBlogDashboard({ posts = [] }: EnhancedBlogDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [filteredPosts, setFilteredPosts] = useState<EnhancedBlogPost[]>(posts)

  // Generation form state
  const [generationForm, setGenerationForm] = useState({
    keyword: '',
    focusKeyword: '',
    secondaryKeywords: '',
    targetAudience: 'professionals and businesses',
    contentType: 'guide' as 'guide' | 'review' | 'comparison' | 'news' | 'tutorial',
    targetWordCount: 4000,
    includeComparison: true,
    includeNewsData: true,
    includeImages: true
  })

  // Filter posts based on search and category
  useEffect(() => {
    let filtered = posts

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    setFilteredPosts(filtered)
  }, [posts, searchTerm, selectedCategory])

  // Handle blog generation
  const handleGenerateBlog = async () => {
    if (!generationForm.keyword || !generationForm.focusKeyword) {
      alert('Please fill in the keyword and focus keyword fields')
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      const response = await fetch('/api/blog/generate-enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...generationForm,
          secondaryKeywords: generationForm.secondaryKeywords.split(',').map(k => k.trim()).filter(k => k)
        })
      })

      clearInterval(progressInterval)
      setGenerationProgress(100)

      if (!response.ok) {
        throw new Error('Failed to generate blog article')
      }

      const result = await response.json()
      
      // Refresh the page or update the posts list
      window.location.reload()

    } catch (error) {
      console.error('Error generating blog:', error)
      alert('Failed to generate blog article. Please try again.')
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
      setShowGenerateModal(false)
    }
  }

  // Calculate dashboard stats
  const stats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter(p => p.published).length,
    averageSeoScore: posts.length > 0 ? Math.round(posts.reduce((sum, p) => sum + p.seoScore, 0) / posts.length) : 0,
    totalWordCount: posts.reduce((sum, p) => sum + p.wordCount, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Enhanced Blog Dashboard</h1>
              <p className="text-gray-600 mt-2">Create professional, SEO-optimized articles with AI</p>
            </div>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Generate Article</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Articles</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPosts}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-3xl font-bold text-green-600">{stats.publishedPosts}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg SEO Score</p>
                <p className="text-3xl font-bold text-purple-600">{stats.averageSeoScore}/100</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Words</p>
                <p className="text-3xl font-bold text-orange-600">{stats.totalWordCount.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="ai-tools">AI Tools</option>
                <option value="reviews">Reviews</option>
                <option value="comparisons">Comparisons</option>
                <option value="tutorials">Tutorials</option>
                <option value="industry-news">Industry News</option>
              </select>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              {/* Article Image */}
              {post.image && (
                <div className="relative h-48 rounded-t-xl overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-xs font-medium text-gray-900">{post.seoScore}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readingTime} min</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{post.wordCount} words</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.comparisonTable && (
                    <span className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      <BarChart3 className="w-3 h-3" />
                      <span>Comparison</span>
                    </span>
                  )}
                  {post.faq.length > 0 && (
                    <span className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      <Target className="w-3 h-3" />
                      <span>FAQ</span>
                    </span>
                  )}
                  {post.images.length > 0 && (
                    <span className="flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      <ImageIcon className="w-3 h-3" />
                      <span>Images</span>
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-1">
                    {post.published ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                    <span className="text-xs text-gray-500">
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6">Get started by generating your first enhanced article</p>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Generate Article</span>
            </button>
          </div>
        )}
      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Generate Enhanced Article</h2>
              <p className="text-gray-600 mt-2">Create a professional, SEO-optimized blog article with AI</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Keyword Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Keyword *
                  </label>
                  <input
                    type="text"
                    value={generationForm.keyword}
                    onChange={(e) => setGenerationForm(prev => ({ ...prev, keyword: e.target.value }))}
                    placeholder="e.g., AI Tools 2025"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Focus Keyword *
                  </label>
                  <input
                    type="text"
                    value={generationForm.focusKeyword}
                    onChange={(e) => setGenerationForm(prev => ({ ...prev, focusKeyword: e.target.value }))}
                    placeholder="e.g., best AI tools 2025"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Secondary Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Keywords
                </label>
                <input
                  type="text"
                  value={generationForm.secondaryKeywords}
                  onChange={(e) => setGenerationForm(prev => ({ ...prev, secondaryKeywords: e.target.value }))}
                  placeholder="artificial intelligence, machine learning, AI software (comma-separated)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Content Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type
                  </label>
                  <select
                    value={generationForm.contentType}
                    onChange={(e) => setGenerationForm(prev => ({ ...prev, contentType: e.target.value as any }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="guide">Guide</option>
                    <option value="review">Review</option>
                    <option value="comparison">Comparison</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="news">News</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Word Count
                  </label>
                  <input
                    type="number"
                    value={generationForm.targetWordCount}
                    onChange={(e) => setGenerationForm(prev => ({ ...prev, targetWordCount: parseInt(e.target.value) }))}
                    min="2000"
                    max="8000"
                    step="500"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={generationForm.targetAudience}
                  onChange={(e) => setGenerationForm(prev => ({ ...prev, targetAudience: e.target.value }))}
                  placeholder="e.g., business professionals, developers, marketers"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={generationForm.includeComparison}
                    onChange={(e) => setGenerationForm(prev => ({ ...prev, includeComparison: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Include comparison table</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={generationForm.includeNewsData}
                    onChange={(e) => setGenerationForm(prev => ({ ...prev, includeNewsData: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Include real-time news data</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={generationForm.includeImages}
                    onChange={(e) => setGenerationForm(prev => ({ ...prev, includeImages: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Generate images</span>
                </label>
              </div>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Generating article...</span>
                    <span className="text-blue-600 font-medium">{generationProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setShowGenerateModal(false)}
                disabled={isGenerating}
                className="px-6 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateBlog}
                disabled={isGenerating || !generationForm.keyword || !generationForm.focusKeyword}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Generate Article</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
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