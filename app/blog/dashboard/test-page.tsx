'use client'

import { useState, useEffect } from 'react'
import { LogOut } from 'lucide-react'
import LoginForm from '@/components/LoginForm'
import { isAuthenticated, logout } from '@/lib/auth-enhanced'

export default function TestDashboardPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      // Check authentication status on component mount
      setAuthenticated(isAuthenticated())
      setLoading(false)
    } catch (error) {
      console.error('Auth check error:', error)
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
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
              <h1 className="text-2xl font-bold text-gray-900">Blog Management - Test</h1>
              <p className="text-gray-600">Testing dashboard functionality</p>
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

      {/* Simple content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Dashboard Test</h2>
          <p className="text-gray-600">
            This is a simplified version of the dashboard to test basic functionality.
          </p>
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">✅ Authentication is working</p>
            <p className="text-green-800">✅ Basic components are loading</p>
          </div>
        </div>
      </div>
    </div>
  )
}