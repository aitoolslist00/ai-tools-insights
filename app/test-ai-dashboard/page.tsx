'use client'

import { useState } from 'react'
import AISeoDashboard from '@/components/AISeoDashboard'
import { BlogPost } from '@/lib/blog-data'

export default function TestAIDashboard() {
  const [saving, setSaving] = useState(false)

  const handleSave = (post: BlogPost) => {
    console.log('Test save:', post)
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      alert('Post saved successfully!')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🤖 AI SEO Dashboard Test
          </h1>
          <p className="text-gray-600">
            This is a test page to verify the AI SEO Dashboard is working correctly.
          </p>
        </div>
        
        <AISeoDashboard 
          onSave={handleSave}
          saving={saving}
        />
      </div>
    </div>
  )
}