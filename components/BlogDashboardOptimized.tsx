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
import { getAuthToken } from '@/lib/auth-enhanced'
import OptimizedBlogEditor from './OptimizedBlogEditor'
import RealAISeoDashboard from './RealAISeoDashboard'

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

export default function BlogDashboardOptimized() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showPublishedOnly, setShowPublishedOnly] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [showForm, setShowForm] = useState(false)
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

  // Load stats separately
  const loadStats = useCallback(async () => {
    try {
      console.log('Loading stats...')
      const response = await fetch('/api/blog/enhanced?limit=1000&published=false')
      console.log('Stats response status:', response.status)
      
      if (response.ok) {
        const result: ApiResponse<BlogPost[]> = await response.json()
        console.log('Stats result:', result.success, result.data?.length)
        
        if (result.success && result.data) {
          const allPosts = result.data
          const newStats = {
            total: allPosts.length,
            published: allPosts.filter(p => p.published).length,
            drafts: allPosts.filter(p => !p.published).length,
            featured: allPosts.filter(p => p.featured).length
          }
          console.log('Setting stats:', newStats)
          setStats(newStats)
        }
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }, [])

  // Load posts with pagination and filters
  const loadPosts = useCallback(async (page: number = 1, resetPosts: boolean = true) => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: postsPerPage.toString(),
        published: 'false' // Load all posts for dashboard
      })

      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }

      console.log('Loading posts with params:', params.toString())
      const response = await fetch(`/api/blog/enhanced?${params}`)
      console.log('Posts response status:', response.status)
      
      if (response.ok) {
        const result: ApiResponse<BlogPost[]> = await response.json()
        console.log('Posts result:', result.success, result.data?.length)
        
        if (result.success && result.data) {
          if (resetPosts || page === 1) {
            setPosts(result.data)
          } else {
            setPosts(prev => [...prev, ...result.data!])
          }
          
          if (result.meta?.pagination) {
            setTotalPosts(result.meta.pagination.total)
            setHasMore(result.meta.pagination.hasMore)
            setCurrentPage(result.meta.pagination.page)
          }
        }
      } else {
        const errorResult: ApiResponse = await response.json()
        console.error('Posts API error:', errorResult)
        showMessage(errorResult.error || 'Failed to load posts', 'error')
      }
    } catch (error) {
      console.error('Posts loading error:', error)
      showMessage('Error loading posts', 'error')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, selectedCategory, postsPerPage])

  // Load posts and stats on component mount and when filters change
  useEffect(() => {
    loadPosts(1, true)
    loadStats()
  }, [loadPosts, loadStats])

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
    try {
      setSaving(true)
      const token = getAuthToken()
      
      const response = await fetch('/api/blog/enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(post),
      })

      const result: ApiResponse = await response.json()

      if (result.success) {
        await loadPosts(1, true)
        await loadStats()
        setShowForm(false)
        setEditingPost(null)
        setIsEditing(false)
        showMessage(result.message || 'Post saved successfully!')
      } else {
        showMessage(result.error || 'Failed to save post', 'error')
      }
    } catch (error) {
      showMessage('Error saving post', 'error')
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
        await loadPosts(1, true)
        await loadStats()
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
        await loadPosts(1, true)
        await loadStats()
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
        await loadPosts(1, true)
        await loadStats()
        showMessage(`Post ${updatedPost.featured ? 'added to' : 'removed from'} featured!`)
      } else {
        showMessage(result.error || 'Failed to update post', 'error')
      }
    } catch (error) {
      showMessage('Error updating post', 'error')
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

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const importedPosts = JSON.parse(e.target?.result as string)
        
        const token = getAuthToken()
        const response = await fetch('/api/blog/enhanced', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(importedPosts),
        })

        const result: ApiResponse = await response.json()

        if (result.success) {
          await loadPosts(1, true)
          showMessage(result.message || 'Posts imported successfully!')
        } else {
          showMessage(result.error || 'Failed to import posts', 'error')
        }
      } catch (error) {
        showMessage('Error importing posts. Please check the file format.', 'error')
      }
    }
    reader.readAsText(file)
  }

  const handleRevalidateBlog = async () => {
    try {
      setSaving(true)
      const token = getAuthToken()
      const response = await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      })

      const result: ApiResponse = await response.json()

      if (result.success) {
        showMessage('Blog pages refreshed successfully! Changes should now be visible.')
      } else {
        showMessage(result.error || 'Failed to refresh blog pages', 'error')
      }
    } catch (error) {
      showMessage('Error refreshing blog pages', 'error')
    } finally {
      setSaving(false)
    }
  }

  const getCategoryColor = (categoryId: string) => {
    const category = blogCategories.find(c => c.id === categoryId)
    return category?.color || 'bg-gray-100 text-gray-700'
  }

  const loadMorePosts = () => {
    if (hasMore && !loading) {
      loadPosts(currentPage + 1, false)
    }
  }

  if (loading && posts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-3 text-gray-600">Loading blog posts...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your blog posts and content</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => loadPosts(1, true)}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleRevalidateBlog}
              disabled={saving}
              className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
              Refresh Blog
            </button>
            <button
              onClick={handleCreatePost}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-4 rounded-lg border flex items-center ${
            message.type === 'error'
              ? 'bg-red-50 text-red-700 border-red-200'
              : message.type === 'info'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-green-50 text-green-700 border-green-200'
          }`}>
            {message.type === 'error' ? (
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            ) : (
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            )}
            <span>{message.text}</span>
            <button
              onClick={() => setMessage(undefined)}
              className="ml-auto text-current hover:opacity-70"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Posts</div>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <Edit className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.published}</div>
                <div className="text-sm text-gray-600">Published</div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.drafts}</div>
                <div className="text-sm text-gray-600">Drafts</div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <EyeOff className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.featured}</div>
                <div className="text-sm text-gray-600">Featured</div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts by title, content, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="min-w-[200px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="all">All Categories</option>
                {blogCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Published Filter */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPublishedOnly}
                  onChange={(e) => setShowPublishedOnly(e.target.checked)}
                  className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Published only</span>
              </label>
            </div>

            {/* Import/Export */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportData}
                className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                title="Export all posts"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
              <label className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                     title="Import posts from JSON file">
                <Upload className="h-4 w-4 mr-1" />
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
      </div>

      {/* Enhanced Posts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">
                            {post.title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {post.excerpt}
                        </div>
                        <div className="flex items-center mt-1 space-x-2">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{post.readTime}</span>
                          {post.tags.length > 0 && (
                            <>
                              <Tag className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {post.tags.slice(0, 2).join(', ')}
                                {post.tags.length > 2 && ` +${post.tags.length - 2}`}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(post.category)}`}>
                      {blogCategories.find(c => c.id === post.category)?.name}
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
                      <span className="text-sm text-gray-500">
                        {post.date ? new Date(post.date).toLocaleDateString() : 'No date'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        post.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                      {post.featured && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        title="Edit post"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleTogglePublished(post.id)}
                        className={`transition-colors ${post.published ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                        title={post.published ? 'Unpublish' : 'Publish'}
                      >
                        {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleToggleFeatured(post.id)}
                        className={`transition-colors ${post.featured ? 'text-yellow-600 hover:text-yellow-900' : 'text-gray-400 hover:text-yellow-600'}`}
                        title={post.featured ? 'Remove from featured' : 'Add to featured'}
                      >
                        {post.featured ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Load More / Pagination */}
        {hasMore && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={loadMorePosts}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-600 bg-white border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
              Load More Posts ({totalPosts - posts.length} remaining)
            </button>
          </div>
        )}

        {posts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No posts found matching your criteria.</div>
            <button
              onClick={handleCreatePost}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Post
            </button>
          </div>
        )}
      </div>

      {/* SEO Optimized Blog Editor Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full h-full max-w-7xl max-h-[95vh] overflow-hidden">
            <OptimizedBlogEditor
              post={editingPost || undefined}
              onSave={handleSavePost}
              onCancel={() => setShowForm(false)}
              saving={saving}
            />
          </div>
        </div>
      )}
    </div>
  )
}