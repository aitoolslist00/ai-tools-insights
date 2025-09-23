'use client'

import { useState, useEffect } from 'react'
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
  RefreshCw
} from 'lucide-react'
import { BlogPost, BlogCategory, blogCategories, generateSlug } from '@/lib/blog-data'
import { ADMIN_CREDENTIALS } from '@/lib/auth'
import { createAuthHeader } from '@/lib/auth-middleware'
import BlogEditor from './BlogEditor'

export default function BlogDashboardEnhanced() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showPublishedOnly, setShowPublishedOnly] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Load posts from API
  useEffect(() => {
    loadPosts()
  }, [])

  // Filter posts based on search and filters
  useEffect(() => {
    let filtered = posts

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    if (showPublishedOnly) {
      filtered = filtered.filter(post => post.published)
    }

    setFilteredPosts(filtered)
  }, [posts, searchTerm, selectedCategory, showPublishedOnly])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/blog')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      } else {
        showMessage('Failed to load posts', 'error')
      }
    } catch (error) {
      showMessage('Error loading posts', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage(text)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleCreatePost = () => {
    setEditingPost(null) // Let BlogEditor create a new post
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
      const authHeader = createAuthHeader(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password)
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify(post),
      })

      if (response.ok) {
        await loadPosts()
        setShowForm(false)
        setEditingPost(null)
        setIsEditing(false)
        showMessage('Post saved successfully!')
      } else {
        showMessage('Failed to save post', 'error')
      }
    } catch (error) {
      showMessage('Error saving post', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const authHeader = createAuthHeader(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password)
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': authHeader,
        },
      })

      if (response.ok) {
        await loadPosts()
        showMessage('Post deleted successfully!')
      } else {
        showMessage('Failed to delete post', 'error')
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
      const authHeader = createAuthHeader(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password)
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify(updatedPost),
      })

      if (response.ok) {
        await loadPosts()
        showMessage(`Post ${updatedPost.published ? 'published' : 'unpublished'} successfully!`)
      } else {
        showMessage('Failed to update post', 'error')
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
      const authHeader = createAuthHeader(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password)
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify(updatedPost),
      })

      if (response.ok) {
        await loadPosts()
        showMessage(`Post ${updatedPost.featured ? 'added to' : 'removed from'} featured!`)
      } else {
        showMessage('Failed to update post', 'error')
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
        
        const authHeader = createAuthHeader(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password)
        const response = await fetch('/api/blog', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
          },
          body: JSON.stringify(importedPosts),
        })

        if (response.ok) {
          await loadPosts()
          showMessage('Posts imported successfully!')
        } else {
          showMessage('Failed to import posts', 'error')
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
      const authHeader = createAuthHeader(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password)
      const response = await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify({}), // Will revalidate all blog paths by default
      })

      if (response.ok) {
        showMessage('Blog pages refreshed successfully! Changes should now be visible.')
      } else {
        showMessage('Failed to refresh blog pages', 'error')
      }
    } catch (error) {
      showMessage('Error refreshing blog pages', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleForceRefresh = async () => {
    try {
      setSaving(true)
      const authHeader = createAuthHeader(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password)
      const response = await fetch('/api/dev-clear-cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify({}),
      })

      if (response.ok) {
        const result = await response.json()
        showMessage(`Development cache cleared! Revalidated ${result.postsRevalidated} posts.`)
      } else {
        showMessage('Failed to clear development cache', 'error')
      }
    } catch (error) {
      showMessage('Error clearing development cache', 'error')
    } finally {
      setSaving(false)
    }
  }

  const getCategoryColor = (categoryId: string) => {
    const category = blogCategories.find(c => c.id === categoryId)
    return category?.color || 'bg-gray-100 text-gray-700'
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
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
              onClick={loadPosts}
              className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
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
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={handleForceRefresh}
                disabled={saving}
                className="inline-flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
                Force Refresh
              </button>
            )}
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
          <div className={`mb-4 p-3 rounded-lg ${
            message.includes('Error') || message.includes('Failed')
              ? 'bg-red-100 text-red-700 border border-red-200'
              : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
            <div className="text-sm text-gray-600">Total Posts</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-green-600">
              {posts.filter(p => p.published).length}
            </div>
            <div className="text-sm text-gray-600">Published</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-yellow-600">
              {posts.filter(p => !p.published).length}
            </div>
            <div className="text-sm text-gray-600">Drafts</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">
              {posts.filter(p => p.featured).length}
            </div>
            <div className="text-sm text-gray-600">Featured</div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="min-w-[200px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
              <label className="flex items-center">
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
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
              <label className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
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

      {/* Posts List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
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
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">
                            {post.title.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {post.excerpt}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(post.category)}`}>
                      {blogCategories.find(c => c.id === post.category)?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {post.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.publishedAt || post.date || post.updatedAt || new Date()).toLocaleDateString()}
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
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleTogglePublished(post.id)}
                        className={`${post.published ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                        title={post.published ? 'Unpublish' : 'Publish'}
                      >
                        {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleToggleFeatured(post.id)}
                        className={`${post.featured ? 'text-yellow-600 hover:text-yellow-900' : 'text-gray-400 hover:text-yellow-600'}`}
                        title={post.featured ? 'Remove from featured' : 'Add to featured'}
                      >
                        {post.featured ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
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

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No posts found matching your criteria.</div>
          </div>
        )}
      </div>

      {/* Blog Editor */}
      {showForm && (
        <BlogEditor
          post={editingPost || undefined}
          onSave={handleSavePost}
          onCancel={() => setShowForm(false)}
          saving={saving}
        />
      )}
    </div>
  )
}