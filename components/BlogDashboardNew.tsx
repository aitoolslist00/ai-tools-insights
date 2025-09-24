'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  Filter,
  Calendar,
  Clock,
  Tag,
  User,
  Save,
  X,
  Star,
  StarOff,
  Upload,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  Sparkles,
  BarChart3,
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react'
import { BlogPost, BlogCategory, blogCategories } from '@/lib/blog-data'
import { optimizeImageUrl } from '@/lib/utils'
import { getAuthToken } from '@/lib/auth-enhanced'
import ModernArticleEditor from './ModernArticleEditor'
import RealAISeoDashboard from './RealAISeoDashboard'
import EnhancedAISeoDashboard from './EnhancedAISeoDashboard'

interface DashboardStats {
  total: number
  published: number
  drafts: number
  featured: number
  categories: number
  totalViews: number
  averageReadTime: number
}

interface ConnectionStatus {
  isConnected: boolean
  errors: string[]
  warnings: string[]
  lastCheck: string
}

export default function BlogDashboardNew() {
  // Core state
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null)

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'drafts'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'views'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(10)

  // Modal state
  const [showEditor, setShowEditor] = useState(false)
  const [showAIEditor, setShowAIEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)

  // Stats and connection state
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    published: 0,
    drafts: 0,
    featured: 0,
    categories: 0,
    totalViews: 0,
    averageReadTime: 0
  })
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    errors: [],
    warnings: [],
    lastCheck: new Date().toISOString()
  })

  // Load posts from unified API
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/blog/unified')
      const result = await response.json()
      
      if (result.success) {
        setPosts(result.data || [])
        await loadStats()
        await loadConnectionStatus()
      } else {
        setError(result.error || 'Failed to load posts')
      }
    } catch (err) {
      setError('Network error while loading posts')
      console.error('Error loading posts:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load dashboard statistics
  const loadStats = useCallback(async () => {
    try {
      const response = await fetch('/api/blog/unified?action=stats')
      const result = await response.json()
      
      if (result.success) {
        setStats(result.data)
      }
    } catch (err) {
      console.error('Error loading stats:', err)
    }
  }, [])

  // Load connection status
  const loadConnectionStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/blog/unified?action=validate')
      const result = await response.json()
      
      if (result.success) {
        setConnectionStatus(result.data)
      }
    } catch (err) {
      console.error('Error loading connection status:', err)
    }
  }, [])

  // Initial load
  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...posts]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term) ||
        post.tags.some(tag => tag.toLowerCase().includes(term)) ||
        post.author.toLowerCase().includes(term)
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Apply status filter
    if (statusFilter === 'published') {
      filtered = filtered.filter(post => post.published)
    } else if (statusFilter === 'drafts') {
      filtered = filtered.filter(post => !post.published)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'views':
          aValue = a.analytics?.views || 0
          bValue = b.analytics?.views || 0
          break
        case 'date':
        default:
          aValue = new Date(a.publishedAt || a.date || a.updatedAt || new Date()).getTime()
          bValue = new Date(b.publishedAt || b.date || b.updatedAt || new Date()).getTime()
          break
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [posts, searchTerm, selectedCategory, statusFilter, sortBy, sortOrder])

  // Paginated posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage
    return filteredAndSortedPosts.slice(startIndex, startIndex + postsPerPage)
  }, [filteredAndSortedPosts, currentPage, postsPerPage])

  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage)

  // Show message helper
  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 5000)
  }

  // Save post handler
  const handleSavePost = async (post: Partial<BlogPost>) => {
    setSaving(true)
    try {
      console.log('🔍 BlogDashboardNew - handleSavePost called');
      console.log('📸 Post image in save handler:', post.image);
      console.log('📝 Full post data:', {
        id: post.id,
        title: post.title,
        image: post.image,
        published: post.published
      });
      
      const token = getAuthToken()
      if (!token) {
        showMessage('Authentication required. Please log in again.', 'error')
        return
      }

      const response = await fetch('/api/blog/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(post),
      })

      const result = await response.json()
      console.log('💾 Save API response:', result);

      if (result.success) {
        console.log('✅ Post saved successfully, reloading posts...');
        await loadPosts()
        setShowEditor(false)
        setShowAIEditor(false)
        setEditingPost(null)
        showMessage(result.message || 'Post saved successfully!')
        
        // Automatically refresh blog pages after saving
        await handleRefreshBlog()
      } else {
        console.error('❌ Save failed:', result.error);
        showMessage(result.error || 'Failed to save post', 'error')
      }
    } catch (err) {
      console.error('❌ Network error while saving post:', err);
      showMessage('Network error while saving post', 'error')
      console.error('Error saving post:', err)
    } finally {
      setSaving(false)
    }
  }

  // Delete post handler
  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    console.log('🗑️ Starting delete process for post:', postId);

    try {
      const token = getAuthToken()
      console.log('🔑 Auth token available:', !!token);
      
      if (!token) {
        showMessage('Authentication required. Please log in again.', 'error')
        return
      }

      console.log('📡 Sending DELETE request to:', `/api/blog/unified?id=${postId}`);
      
      const response = await fetch(`/api/blog/unified?id=${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ HTTP error response:', errorText);
        showMessage(`HTTP Error ${response.status}: ${errorText}`, 'error')
        return
      }

      const result = await response.json()
      console.log('📋 Delete result:', result);

      if (result.success) {
        console.log('✅ Delete successful, reloading posts...');
        await loadPosts()
        showMessage('Post deleted successfully!')
        
        // Automatically refresh blog pages after deleting
        console.log('🔄 Refreshing blog pages...');
        await handleRefreshBlog()
      } else {
        console.error('❌ Delete failed:', result.error);
        showMessage(result.error || 'Failed to delete post', 'error')
      }
    } catch (err) {
      console.error('❌ Delete error:', err);
      showMessage(`Error deleting post: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error')
    }
  }

  // Toggle published status
  const handleTogglePublished = async (post: BlogPost) => {
    const updatedPost = { ...post, published: !post.published }
    if (updatedPost.published && !updatedPost.publishedAt) {
      updatedPost.publishedAt = new Date().toISOString()
    }
    await handleSavePost(updatedPost)
    // handleSavePost already calls handleRefreshBlog
  }

  // Toggle featured status
  const handleToggleFeatured = async (post: BlogPost) => {
    const updatedPost = { ...post, featured: !post.featured }
    await handleSavePost(updatedPost)
    // handleSavePost already calls handleRefreshBlog
  }

  // Refresh blog pages
  const handleRefreshBlog = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ path: '/blog' }),
      })

      if (response.ok) {
        showMessage('Blog pages refreshed successfully!')
      } else {
        showMessage('Failed to refresh blog pages', 'error')
      }
    } catch (err) {
      showMessage('Error refreshing blog pages', 'error')
    }
  }

  // Export data
  const handleExportData = () => {
    const dataStr = JSON.stringify(posts, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `blog-posts-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Import data
  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const importedPosts: BlogPost[] = JSON.parse(text)
      
      // Validate imported data
      if (!Array.isArray(importedPosts)) {
        showMessage('Invalid file format', 'error')
        return
      }

      // Save each post
      for (const post of importedPosts) {
        await handleSavePost(post)
      }

      showMessage(`Successfully imported ${importedPosts.length} posts!`)
    } catch (err) {
      showMessage('Error importing posts', 'error')
    }
    
    // Reset file input
    event.target.value = ''
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading blog dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> :
           message.type === 'error' ? <AlertCircle className="h-5 w-5 mr-2" /> :
           <AlertCircle className="h-5 w-5 mr-2" />}
          {message.text}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="font-medium">Error: {error}</span>
          </div>
          <button
            onClick={loadPosts}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Connection Status */}
      <div className={`mb-6 p-4 rounded-lg border ${
        connectionStatus.isConnected 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${
              connectionStatus.isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className={`font-medium ${
              connectionStatus.isConnected ? 'text-green-800' : 'text-red-800'
            }`}>
              Blog System: {connectionStatus.isConnected ? 'Connected' : 'Issues Detected'}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            Last check: {new Date(connectionStatus.lastCheck).toLocaleTimeString()}
          </span>
        </div>
        
        {(connectionStatus.errors.length > 0 || connectionStatus.warnings.length > 0) && (
          <div className="mt-3 space-y-1">
            {connectionStatus.errors.map((error, index) => (
              <div key={index} className="text-sm text-red-700">❌ {error}</div>
            ))}
            {connectionStatus.warnings.map((warning, index) => (
              <div key={index} className="text-sm text-yellow-700">⚠️ {warning}</div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Edit className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-3xl font-bold text-gray-900">{stats.published}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.drafts}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <EyeOff className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {blogCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'drafts')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="drafts">Drafts</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-')
                setSortBy(sort as 'date' | 'title' | 'views')
                setSortOrder(order as 'asc' | 'desc')
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="views-desc">Most Views</option>
              <option value="views-asc">Least Views</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAIEditor(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              🤖 AI SEO Editor
            </button>
            
            <button
              onClick={() => {
                setEditingPost(null)
                setShowEditor(true)
              }}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Manual Editor
            </button>

            <button
              onClick={loadPosts}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>

            <button
              onClick={handleRefreshBlog}
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Globe className="h-4 w-4 mr-2" />
              Refresh Blog
            </button>

            <button
              onClick={handleExportData}
              className="inline-flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>

            <label className="inline-flex items-center px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredAndSortedPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Edit className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedCategory !== 'all' || statusFilter !== 'all' 
                ? 'No posts match your filters' 
                : 'No posts found'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'Get started by creating your first blog post'
              }
            </p>
            <button
              onClick={() => {
                setEditingPost(null)
                setShowEditor(true)
              }}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Post
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Post
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedPosts.map((post) => {
                    const category = blogCategories.find(c => c.id === post.category)
                    return (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-start space-x-3">
                            {/* Image Preview */}
                            <div className="flex-shrink-0">
                              {post.image ? (
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                  <img
                                    src={optimizeImageUrl(post.image, 64, 64)}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const fallback = target.nextElementSibling as HTMLElement;
                                      if (fallback) fallback.style.display = 'flex';
                                    }}
                                  />
                                  <div 
                                    className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400"
                                    style={{ display: 'none' }}
                                  >
                                    <AlertCircle className="h-6 w-6" />
                                  </div>
                                </div>
                              ) : (
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                                  <span className="text-primary-600 font-semibold text-lg">
                                    {post.title.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {post.title}
                                </p>
                                {post.featured && (
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                )}
                                {post.published && (
                                  <a
                                    href={post.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                    title="View published post"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 truncate">
                                {post.excerpt}
                              </p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-xs text-gray-400">
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  {post.readTime}
                                </span>
                                {post.tags.length > 0 && (
                                  <div className="flex items-center space-x-1">
                                    <Tag className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs text-gray-400">
                                      {post.tags.slice(0, 2).join(', ')}
                                      {post.tags.length > 2 && ` +${post.tags.length - 2}`}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            category?.color || 'bg-gray-100 text-gray-800'
                          }`}>
                            {category?.name || post.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{post.author}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {new Date(post.publishedAt || post.date || post.updatedAt || new Date()).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Activity className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {post.analytics?.views?.toLocaleString() || '0'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setEditingPost(post)
                                setShowEditor(true)
                              }}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded"
                              title="Edit post"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleTogglePublished(post)}
                              className={`p-1 rounded ${
                                post.published 
                                  ? 'text-yellow-600 hover:text-yellow-900' 
                                  : 'text-green-600 hover:text-green-900'
                              }`}
                              title={post.published ? 'Unpublish' : 'Publish'}
                            >
                              {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => handleToggleFeatured(post)}
                              className={`p-1 rounded ${
                                post.featured 
                                  ? 'text-yellow-600 hover:text-yellow-900' 
                                  : 'text-gray-400 hover:text-yellow-600'
                              }`}
                              title={post.featured ? 'Remove from featured' : 'Add to featured'}
                            >
                              {post.featured ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded"
                              title="Delete post"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">{(currentPage - 1) * postsPerPage + 1}</span>
                      {' '}to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * postsPerPage, filteredAndSortedPosts.length)}
                      </span>
                      {' '}of{' '}
                      <span className="font-medium">{filteredAndSortedPosts.length}</span>
                      {' '}results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      {/* Page numbers */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNum
                                ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modern Article Editor Modal */}
      {showEditor && (
        <ModernArticleEditor
          post={editingPost || undefined}
          onSave={handleSavePost}
          onCancel={() => {
            setShowEditor(false)
            setEditingPost(null)
          }}
          saving={saving}
        />
      )}

      {/* AI SEO Editor Modal */}
      {showAIEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-50 rounded-xl shadow-xl w-full h-full max-w-7xl max-h-[95vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
                Enhanced AI SEO Dashboard
              </h2>
              <button
                onClick={() => setShowAIEditor(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <EnhancedAISeoDashboard
              onSave={handleSavePost}
              saving={saving}
              editingPost={editingPost}
            />
          </div>
        </div>
      )}
    </div>
  )
}