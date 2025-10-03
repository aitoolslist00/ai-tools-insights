'use client'

import { useState, useEffect, useCallback } from 'react'
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
  Sparkles
} from 'lucide-react'
import { BlogPost, BlogCategory, blogCategories, generateSlug } from '@/lib/blog-data'
import { getAuthToken } from '@/lib/auth-enhanced'
import SEOOptimizedBlogEditor from './SEOOptimizedBlogEditor'
import AISeoDashboard from './AISeoDashboard'
import { BlogConnectionValidator, BlogConnectionStatus } from '@/lib/blog-connection-validator'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    timestamp: string
    pagination?: {
      page: number
      limit: number
      total: number
      hasMore: boolean
    }
  }
}

export default function BlogDashboardFixed() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showPublishedOnly, setShowPublishedOnly] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showAIEditor, setShowAIEditor] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' }>()
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [postsPerPage] = useState(10)

  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    featured: 0
  })

  // Connection status
  const [connectionStatus, setConnectionStatus] = useState<BlogConnectionStatus | null>(null)
  const [showConnectionDetails, setShowConnectionDetails] = useState(false)

  // Load posts using the basic API that we know works
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/blog')
      
      if (response.ok) {
        const allPosts: BlogPost[] = await response.json()
        
        // Apply filters
        let filteredPosts = allPosts
        
        if (searchTerm) {
          filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
          )
        }
        
        if (selectedCategory !== 'all') {
          filteredPosts = filteredPosts.filter(post => post.category === selectedCategory)
        }
        
        if (showPublishedOnly) {
          filteredPosts = filteredPosts.filter(post => post.published)
        }
        
        // Apply pagination
        const startIndex = (currentPage - 1) * postsPerPage
        const endIndex = startIndex + postsPerPage
        const paginatedPosts = filteredPosts.slice(startIndex, endIndex)
        
        setPosts(paginatedPosts)
        setTotalPosts(filteredPosts.length)
        setHasMore(endIndex < filteredPosts.length)
        
        // Calculate stats from all posts
        setStats({
          total: allPosts.length,
          published: allPosts.filter(p => p.published).length,
          drafts: allPosts.filter(p => !p.published).length,
          featured: allPosts.filter(p => p.featured).length
        })
        
      } else {
        showMessage('Failed to load posts', 'error')
      }
    } catch (error) {
      showMessage('Error loading posts', 'error')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, selectedCategory, showPublishedOnly, currentPage, postsPerPage])

  // Load connection status
  const loadConnectionStatus = useCallback(async () => {
    try {
      const status = await BlogConnectionValidator.validateConnection()
      setConnectionStatus(status)
    } catch (error) {
      console.error('Failed to load connection status:', error)
    }
  }, [])

  // Load posts on component mount and when filters change
  useEffect(() => {
    loadPosts()
    loadConnectionStatus()
  }, [loadPosts, loadConnectionStatus])

  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(undefined), 5000)
  }

  const handleCreatePost = () => {
    setEditingPost(null)
    setIsEditing(false)
    setShowForm(true)
  }

  const handleEditPost = (post: BlogPost) => {
    setEditingPost({ ...post })
    setIsEditing(true)
    setShowForm(true)
  }

  const handleSavePost = async (post: BlogPost) => {
    setSaving(true)
    try {
      console.log('📝 Saving post to API:', post)
      
      const token = getAuthToken()
      console.log('🔑 Auth token:', token ? 'Present' : 'Missing')
      
      if (!token) {
        showMessage('Authentication token missing. Please log in again.', 'error')
        return
      }

      const response = await fetch('/api/blog/enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(post),
      })

      console.log('📡 API Response status:', response.status)
      
      const result: ApiResponse = await response.json()
      console.log('📡 API Response data:', result)

      if (result.success) {
        console.log('✅ Post saved successfully, reloading posts...')
        await loadPosts()
        await loadConnectionStatus()
        setShowForm(false)
        setShowAIEditor(false)
        setEditingPost(null)
        setIsEditing(false)
        showMessage(result.message || 'Post saved successfully!')
        console.log('✅ UI updated after successful save')
      } else {
        console.error('❌ API Error:', result.error)
        showMessage(result.error || 'Failed to save post', 'error')
      }
    } catch (error) {
      console.error('❌ Network Error:', error)
      showMessage('Error saving post: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return

    try {
      const token = getAuthToken()
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const result: ApiResponse = await response.json()

      if (result.success) {
        await loadPosts()
        showMessage(result.message || 'Post deleted successfully!')
      } else {
        showMessage(result.error || 'Failed to delete post', 'error')
      }
    } catch (error) {
      showMessage('Error deleting post', 'error')
    }
  }

  const handleTogglePublished = async (postId: string) => {
    const post = posts.find(p => p.id === postId)
    if (!post) return

    const updatedPost = { ...post, published: !post.published }
    
    try {
      const token = getAuthToken()
      const response = await fetch('/api/blog/enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPost),
      })

      const result: ApiResponse = await response.json()

      if (result.success) {
        await loadPosts()
        await loadConnectionStatus()
        showMessage(`Post ${updatedPost.published ? 'published' : 'unpublished'} successfully!`)
      } else {
        showMessage(result.error || 'Failed to update post', 'error')
      }
    } catch (error) {
      showMessage('Error updating post', 'error')
    }
  }

  const handleToggleFeatured = async (postId: string) => {
    const post = posts.find(p => p.id === postId)
    if (!post) return

    const updatedPost = { ...post, featured: !post.featured }
    
    try {
      const token = getAuthToken()
      const response = await fetch('/api/blog/enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPost),
      })

      const result: ApiResponse = await response.json()

      if (result.success) {
        await loadPosts()
        showMessage(`Post ${updatedPost.featured ? 'added to' : 'removed from'} featured!`)
      } else {
        showMessage(result.error || 'Failed to update post', 'error')
      }
    } catch (error) {
      showMessage('Error updating post', 'error')
    }
  }

  const handleRefreshBlog = async () => {
    try {
      const response = await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: '/blog' }),
      })

      if (response.ok) {
        showMessage('Blog pages refreshed successfully!', 'success')
      } else {
        showMessage('Failed to refresh blog pages', 'error')
      }
    } catch (error) {
      showMessage('Error refreshing blog pages', 'error')
    }
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify(posts, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `blog-posts-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const importedPosts: BlogPost[] = JSON.parse(text)
      
      const token = getAuthToken()
      const response = await fetch('/api/blog', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(importedPosts),
      })

      const result: ApiResponse = await response.json()

      if (result.success) {
        await loadPosts()
        showMessage(`Successfully imported ${importedPosts.length} posts!`)
      } else {
        showMessage(result.error || 'Failed to import posts', 'error')
      }
    } catch (error) {
      showMessage('Error importing posts', 'error')
    }
    
    // Reset file input
    event.target.value = ''
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

      {/* Connection Status */}
      {connectionStatus && (
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
                Blog Connection: {connectionStatus.isConnected ? 'Active' : 'Issues Detected'}
              </span>
            </div>
            <button
              onClick={() => setShowConnectionDetails(!showConnectionDetails)}
              className={`text-sm px-3 py-1 rounded ${
                connectionStatus.isConnected 
                  ? 'text-green-700 hover:bg-green-100' 
                  : 'text-red-700 hover:bg-red-100'
              }`}
            >
              {showConnectionDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
          
          {showConnectionDetails && (
            <div className="mt-4 space-y-2">
              <div className="text-sm">
                <strong>Last Check:</strong> {new Date(connectionStatus.lastSync).toLocaleString()}
              </div>
              
              {connectionStatus.errors.length > 0 && (
                <div>
                  <strong className="text-red-700">Errors:</strong>
                  <ul className="list-disc list-inside text-sm text-red-600 mt-1">
                    {connectionStatus.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {connectionStatus.warnings.length > 0 && (
                <div>
                  <strong className="text-yellow-700">Warnings:</strong>
                  <ul className="list-disc list-inside text-sm text-yellow-600 mt-1">
                    {connectionStatus.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {connectionStatus.errors.length === 0 && connectionStatus.warnings.length === 0 && (
                <div className="text-sm text-green-700">
                  ✅ All systems operational! Your blog is properly connected and all published articles are accessible.
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-3xl font-bold text-gray-900">{stats.featured}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Star className="h-6 w-6 text-purple-600" />
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
                placeholder="Search posts by title, content, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
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

            {/* Published Filter */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPublishedOnly}
                onChange={(e) => setShowPublishedOnly(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Published only</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                console.log('AI SEO Editor button clicked!')
                setShowAIEditor(true)
              }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              🤖 AI SEO Editor
            </button>
            
            <button
              onClick={handleCreatePost}
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Loading posts...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Edit className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found matching your criteria.</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first blog post.</p>
            <button
              onClick={handleCreatePost}
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => {
                    const category = blogCategories.find(c => c.id === post.category)
                    return (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-start space-x-3">
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
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditPost(post)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded"
                              title="Edit post"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleTogglePublished(post.id)}
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
                              onClick={() => handleToggleFeatured(post.id)}
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
            {totalPosts > postsPerPage && (
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
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!hasMore}
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
                        {Math.min(currentPage * postsPerPage, totalPosts)}
                      </span>
                      {' '}of{' '}
                      <span className="font-medium">{totalPosts}</span>
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
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={!hasMore}
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

      {/* SEO Optimized Blog Editor Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full h-full max-w-7xl max-h-[95vh] overflow-hidden">
            <SEOOptimizedBlogEditor
              post={editingPost || undefined}
              onSave={handleSavePost}
              onCancel={() => setShowForm(false)}
              saving={saving}
            />
          </div>
        </div>
      )}

      {/* AI SEO Dashboard Modal */}
      {showAIEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" style={{zIndex: 9999}}>
          <div className="bg-gray-50 rounded-xl shadow-xl w-full h-full max-w-7xl max-h-[95vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
                AI SEO Dashboard
              </h2>
              <button
                onClick={() => setShowAIEditor(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <AISeoDashboard
              onSave={handleSavePost}
              saving={saving}
            />
          </div>
        </div>
      )}
    </div>
  )
}