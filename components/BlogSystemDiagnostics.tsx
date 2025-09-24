'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, RefreshCw, Settings, Database, Upload, Globe } from 'lucide-react'
import { getAuthToken } from '@/lib/auth-enhanced'

interface DiagnosticInfo {
  timestamp: string
  environment: string
  system: {
    platform: string
    nodeVersion: string
    cwd: string
  }
  files: {
    blogPostsFile: {
      path: string
      exists: boolean
      size: number
      lastModified: string | null
    }
    uploadsDir: {
      path: string
      exists: boolean
      writable: boolean
    }
  }
  posts: {
    total: number
    published: number
    drafts: number
    withImages: number
  }
  apis: {
    manage: string
    unified: string
    upload: string
    revalidate: string
  }
}

export default function BlogSystemDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostics = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const token = getAuthToken()
      if (!token) {
        setError('Authentication required')
        return
      }

      const response = await fetch('/api/blog/debug', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setDiagnostics(result.debug)
      } else {
        setError(result.error || 'Failed to run diagnostics')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const StatusIcon = ({ status }: { status: boolean }) => (
    status ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <AlertCircle className="h-5 w-5 text-red-500" />
    )
  )

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-500 mr-2" />
          <span>Running system diagnostics...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center text-red-600 mb-4">
          <AlertCircle className="h-6 w-6 mr-2" />
          <h3 className="text-lg font-semibold">Diagnostics Error</h3>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={runDiagnostics}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry Diagnostics
        </button>
      </div>
    )
  }

  if (!diagnostics) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Settings className="h-6 w-6 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold">System Diagnostics</h3>
        </div>
        <button
          onClick={runDiagnostics}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          <RefreshCw className="h-4 w-4 inline mr-1" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Info */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Database className="h-4 w-4 mr-2" />
            System Information
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Environment:</span>
              <span className="font-mono">{diagnostics.environment}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform:</span>
              <span className="font-mono">{diagnostics.system.platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Node Version:</span>
              <span className="font-mono">{diagnostics.system.nodeVersion}</span>
            </div>
          </div>
        </div>

        {/* File System */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            File System
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Blog Posts File</span>
              <StatusIcon status={diagnostics.files.blogPostsFile.exists} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Uploads Directory</span>
              <StatusIcon status={diagnostics.files.uploadsDir.exists} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Write Permissions</span>
              <StatusIcon status={diagnostics.files.uploadsDir.writable} />
            </div>
          </div>
        </div>

        {/* Posts Statistics */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            Content Statistics
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{diagnostics.posts.total}</div>
              <div className="text-sm text-blue-600">Total Posts</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{diagnostics.posts.published}</div>
              <div className="text-sm text-green-600">Published</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{diagnostics.posts.drafts}</div>
              <div className="text-sm text-yellow-600">Drafts</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{diagnostics.posts.withImages}</div>
              <div className="text-sm text-purple-600">With Images</div>
            </div>
          </div>
        </div>

        {/* File Details */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">File Details</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Blog Posts File Size:</span>
              <span className="ml-2 font-mono">{diagnostics.files.blogPostsFile.size} bytes</span>
            </div>
            {diagnostics.files.blogPostsFile.lastModified && (
              <div>
                <span className="text-gray-600">Last Modified:</span>
                <span className="ml-2 font-mono">
                  {new Date(diagnostics.files.blogPostsFile.lastModified).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Last Check:</strong> {new Date(diagnostics.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  )
}