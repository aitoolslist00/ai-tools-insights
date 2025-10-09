'use client'

import { useState, useEffect } from 'react'
import BlogDashboardNew from '@/components/BlogDashboardNew'
import BlogSystemDiagnostics from '@/components/BlogSystemDiagnostics'
import EnhancedAISEOEditor from '@/components/EnhancedAISEOEditor'
import AdManagement from '@/components/AdManagement'
import LoginForm from '@/components/LoginForm'
import { isAuthenticated, logout } from '@/lib/auth-enhanced'
import { LogOut } from 'lucide-react'

export default function BlogDashboardPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Check authentication status on component mount
      setAuthenticated(isAuthenticated())
      setLoading(false)
    } catch (err) {
      console.error('Dashboard initialization error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      setLoading(false)
    }
  }, [])

  const handleLogin = () => {
    setAuthenticated(true)
  }

  const handleLogout = () => {
    try {
      logout()
      setAuthenticated(false)
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  try {
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

        {/* Enhanced AI SEO Editor */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <EnhancedAISEOEditor />
        </div>

        {/* Ad Management */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <AdManagement />
        </div>

        {/* Dashboard */}
        <BlogDashboardNew />

      {/* Instructions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">How to Use the Blog Dashboard</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>🤖 AI SEO Editor Pro:</strong> Use the Enhanced AI SEO Editor above for complete automated workflow. Enter your target keyword and Gemini API key, then click "Start Complete AI SEO Workflow" to generate content, analyze SEO, create schemas, generate professional images, and publish SEO-optimized articles automatically.</p>
            <p><strong>💰 Ad Script Management:</strong> Use the Ad Management section to add JavaScript ad codes (Google AdSense, Monetag, etc.). Simply paste your ad code, choose the position (head, body-start, or body-end), and publish. The ads will automatically appear on your site.</p>
            <p><strong>Create Posts:</strong> Click "New Post" to create a new blog post with all necessary fields.</p>
            <p><strong>Edit Posts:</strong> Click the edit icon to modify existing posts, including title, content, SEO settings, and more.</p>
            <p><strong>Publish/Unpublish:</strong> Use the eye icon to toggle post visibility on your site.</p>
            <p><strong>Feature Posts:</strong> Use the star icon to mark posts as featured (they'll appear in the featured section).</p>
            <p><strong>Filter & Search:</strong> Use the search bar and filters to quickly find specific posts.</p>
            <p><strong>Instant Updates:</strong> Changes made in the dashboard appear immediately on the live site thanks to direct file storage and automatic cache revalidation.</p>
            <p><strong>Automatic Backups:</strong> A backup is automatically created in the /backups directory before any changes are made.</p>
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>📂 File Storage:</strong> Your blog content is stored directly in blog-posts.json in your project directory. 
                This ensures full control, easy backups, and immediate updates without external dependencies.
              </p>
            </div>
            <p><strong>Export/Import:</strong> Backup your posts or migrate content using the export/import functionality.</p>
          </div>
        </div>
      </div>

      {/* Development Note */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-yellow-900 mb-4">Development Note</h3>
          <div className="space-y-2 text-sm text-yellow-800">
            <p><strong>Current State:</strong> This dashboard is fully connected to the blog system with automatic page revalidation and direct file storage.</p>
            <p><strong>Features:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>✅ Authentication and authorization</li>
              <li>✅ Enhanced AI SEO Editor with complete workflow</li>
              <li>✅ Gemini 2.5 Flash content generation</li>
              <li>✅ Automatic AI image generation with Gemini</li>
              <li>✅ Real-time SEO analysis and optimization</li>
              <li>✅ Comprehensive schema markup generation</li>
              <li>✅ Smart publishing with automation</li>
              <li>✅ Ad Script Management with dynamic injection</li>
              <li>✅ Support for multiple ad networks (AdSense, Monetag, etc.)</li>
              <li>✅ Position-based ad placement (head, body-start, body-end)</li>
              <li>✅ Direct file-based storage (blog-posts.json)</li>
              <li>✅ Immediate content updates on site</li>
              <li>✅ Automatic blog page revalidation</li>
              <li>✅ Search engine submission</li>
              <li>✅ Automatic backups before changes</li>
            </ul>
            <p><strong>Storage System:</strong> Uses direct file-based storage in the project directory (blog-posts.json), ensuring immediate updates and full control over your content. All changes made in the dashboard appear instantly on the live site.</p>
          </div>
        </div>
      </div>
      </div>
    )
  } catch (renderError) {
    console.error('Dashboard render error:', renderError)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">💥</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Component Error</h2>
            <p className="text-gray-600 mb-4">
              {renderError instanceof Error ? renderError.message : 'Unknown render error'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    )
  }
}