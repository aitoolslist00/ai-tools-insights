'use client'

import { useState, useEffect } from 'react'
import BlogDashboardNew from '@/components/BlogDashboardNew'
import BlogSystemDiagnostics from '@/components/BlogSystemDiagnostics'
import LoginForm from '@/components/LoginForm'
import { isAuthenticated, logout } from '@/lib/auth-enhanced'
import { LogOut } from 'lucide-react'

export default function BlogDashboardPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication status on component mount
    setAuthenticated(isAuthenticated())
    setLoading(false)
  }, [])

  const handleLogin = () => {
    setAuthenticated(true)
  }

  const handleLogout = () => {
    logout()
    setAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!authenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logout */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
              <p className="text-gray-600">Secure dashboard for managing your blog content</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* System Diagnostics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BlogSystemDiagnostics />
      </div>

      {/* Dashboard */}
      <BlogDashboardNew />

      {/* Instructions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">How to Use the Blog Dashboard</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>Create Posts:</strong> Click "New Post" to create a new blog post with all necessary fields.</p>
            <p><strong>Edit Posts:</strong> Click the edit icon to modify existing posts, including title, content, SEO settings, and more.</p>
            <p><strong>Publish/Unpublish:</strong> Use the eye icon to toggle post visibility on your site.</p>
            <p><strong>Feature Posts:</strong> Use the star icon to mark posts as featured (they'll appear in the featured section).</p>
            <p><strong>Filter & Search:</strong> Use the search bar and filters to quickly find specific posts.</p>
            <p><strong>Refresh Blog:</strong> Click "Refresh Blog" to immediately update the public blog pages with your changes.</p>
            <p><strong>Force Refresh (Dev):</strong> In development mode, use "Force Refresh" for aggressive cache clearing if changes don't appear.</p>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>🔧 Development Mode:</strong> Caching is disabled for real-time updates. 
                  If changes don't appear immediately, try refreshing the page or restarting the dev server.
                </p>
              </div>
            )}
            <p><strong>Export/Import:</strong> Backup your posts or migrate content using the export/import functionality.</p>
          </div>
        </div>
      </div>

      {/* Development Note */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-yellow-900 mb-4">Development Note</h3>
          <div className="space-y-2 text-sm text-yellow-800">
            <p><strong>Current State:</strong> This dashboard is fully connected to the blog system with automatic page revalidation.</p>
            <p><strong>Features:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>✅ Authentication and authorization</li>
              <li>✅ File-based storage with JSON</li>
              <li>✅ Automatic blog page updates</li>
              <li>✅ Manual refresh capability</li>
              <li>✅ SEO optimization</li>
              <li>✅ Rich content management</li>
            </ul>
            <p><strong>Production Enhancements:</strong> For enterprise use, consider adding database storage, image uploads, and version control.</p>
          </div>
        </div>
      </div>
    </div>
  )
}