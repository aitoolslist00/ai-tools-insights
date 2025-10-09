'use client'

import { useState, useEffect } from 'react'
import { Code, Save, Trash2, Eye, EyeOff, Plus, AlertCircle } from 'lucide-react'

interface AdScript {
  id: string
  name: string
  code: string
  active: boolean
  position: 'head' | 'body-start' | 'body-end'
  createdAt: string
  updatedAt: string
}

export default function AdManagement() {
  const [adScripts, setAdScripts] = useState<AdScript[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingScript, setEditingScript] = useState<AdScript | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    position: 'head' as 'head' | 'body-start' | 'body-end',
    active: true
  })

  // Load ad scripts on component mount
  useEffect(() => {
    loadAdScripts()
  }, [])

  const loadAdScripts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/ad-scripts')
      if (response.ok) {
        const scripts = await response.json()
        setAdScripts(scripts)
      } else {
        throw new Error('Failed to load ad scripts')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ad scripts')
    } finally {
      setLoading(false)
    }
  }

  const saveAdScript = async () => {
    try {
      setLoading(true)
      setError(null)

      const scriptData = {
        ...formData,
        id: editingScript?.id || `ad-${Date.now()}`,
        createdAt: editingScript?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const response = await fetch('/api/ad-scripts', {
        method: editingScript ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scriptData),
      })

      if (response.ok) {
        setSuccess(editingScript ? 'Ad script updated successfully!' : 'Ad script created successfully!')
        resetForm()
        loadAdScripts()
      } else {
        throw new Error('Failed to save ad script')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save ad script')
    } finally {
      setLoading(false)
    }
  }

  const deleteAdScript = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad script?')) return

    try {
      setLoading(true)
      const response = await fetch(`/api/ad-scripts?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSuccess('Ad script deleted successfully!')
        loadAdScripts()
      } else {
        throw new Error('Failed to delete ad script')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete ad script')
    } finally {
      setLoading(false)
    }
  }

  const toggleScriptStatus = async (script: AdScript) => {
    try {
      setLoading(true)
      const updatedScript = { ...script, active: !script.active, updatedAt: new Date().toISOString() }

      const response = await fetch('/api/ad-scripts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedScript),
      })

      if (response.ok) {
        setSuccess(`Ad script ${updatedScript.active ? 'activated' : 'deactivated'} successfully!`)
        loadAdScripts()
      } else {
        throw new Error('Failed to update ad script status')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ad script status')
    } finally {
      setLoading(false)
    }
  }

  const startEditing = (script: AdScript) => {
    setEditingScript(script)
    setFormData({
      name: script.name,
      code: script.code,
      position: script.position,
      active: script.active
    })
    setIsEditing(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      position: 'head',
      active: true
    })
    setEditingScript(null)
    setIsEditing(false)
  }

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null)
        setError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Code className="h-5 w-5 mr-2" />
              Ad Script Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage JavaScript ad codes that will be automatically injected into your site
            </p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Ad Script
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <div className="h-5 w-5 text-green-500 mr-2">✓</div>
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {/* Add/Edit Form */}
      {isEditing && (
        <div className="p-6 border-b bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingScript ? 'Edit Ad Script' : 'Add New Ad Script'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Script Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Google AdSense Header, Monetag Script"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="head">Head Section (after &lt;head&gt; tag)</option>
                <option value="body-start">Body Start (after &lt;body&gt; tag)</option>
                <option value="body-end">Body End (before &lt;/body&gt; tag)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                JavaScript Code
              </label>
              <textarea
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Paste your JavaScript ad code here..."
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Include &lt;script&gt; tags if needed. The code will be injected exactly as provided.
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                Activate script immediately
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={saveAdScript}
                disabled={loading || !formData.name.trim() || !formData.code.trim()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : editingScript ? 'Update Script' : 'Save Script'}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scripts List */}
      <div className="p-6">
        {loading && adScripts.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading ad scripts...</p>
          </div>
        ) : adScripts.length === 0 ? (
          <div className="text-center py-8">
            <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Ad Scripts</h3>
            <p className="text-gray-500 mb-4">
              Add your first JavaScript ad code to start monetizing your site.
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Ad Script
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {adScripts.map((script) => (
              <div
                key={script.id}
                className={`border rounded-lg p-4 ${
                  script.active ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-900">{script.name}</h3>
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        script.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {script.active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {script.position}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleScriptStatus(script)}
                      className={`p-2 rounded-lg transition-colors ${
                        script.active
                          ? 'text-green-600 hover:bg-green-100'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={script.active ? 'Deactivate' : 'Activate'}
                    >
                      {script.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => startEditing(script)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Code className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteAdScript(script.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  Created: {new Date(script.createdAt).toLocaleDateString()}
                  {script.updatedAt !== script.createdAt && (
                    <span className="ml-4">
                      Updated: {new Date(script.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                <div className="bg-gray-100 rounded p-3 font-mono text-xs overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-all">
                    {script.code.length > 200 
                      ? `${script.code.substring(0, 200)}...` 
                      : script.code
                    }
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}