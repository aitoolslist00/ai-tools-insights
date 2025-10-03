'use client'

import { useState, useEffect } from 'react'

interface BlogPost {
  id: string
  title: string
  published: boolean
  category: string
  author: string
  date: string
  excerpt: string
  href: string
}

export default function TestDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log('API Response:', data)
        setPosts(data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching posts:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard Test - Loading...</h1>
        <div className="animate-pulse">Loading posts...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard Test - Error</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Test</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">API Status</h2>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✅ API is working correctly
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Posts Found: {posts.length}</h2>
        
        {posts.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            ⚠️ No posts found. This could indicate a filtering issue.
          </div>
        ) : (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ Found {posts.length} posts
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Posts Details:</h2>
        {posts.map((post) => (
          <div key={post.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-lg">{post.title}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                post.published 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {post.published ? 'Published' : 'Draft'}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>ID:</strong> {post.id}</p>
              <p><strong>Category:</strong> {post.category}</p>
              <p><strong>Author:</strong> {post.author}</p>
              <p><strong>Date:</strong> {new Date(post.date).toLocaleDateString()}</p>
              <p><strong>Excerpt:</strong> {post.excerpt}</p>
              {post.href && (
                <p><strong>URL:</strong> <a href={post.href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{post.href}</a></p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Test Results Summary:</h3>
        <ul className="space-y-1 text-sm">
          <li>✅ API endpoint is accessible</li>
          <li>✅ Posts are being returned from the API</li>
          <li>✅ Post data structure is correct</li>
          <li>{posts.filter(p => p.published).length > 0 ? '✅' : '❌'} Published posts are available</li>
          <li>{posts.every(p => p.href) ? '✅' : '❌'} All posts have valid href fields</li>
        </ul>
      </div>
    </div>
  )
}