'use client'

import { useEffect, useState } from 'react'
import { BlogPost } from '@/lib/blog-data'

export default function TestPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPosts() {
      try {
        console.log('Loading posts...')
        const response = await fetch('/api/blog')
        console.log('Response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Posts loaded:', data.length)
          console.log('Posts data:', data)
          setPosts(data)
        } else {
          setError(`API returned ${response.status}`)
        }
      } catch (err) {
        console.error('Error loading posts:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  if (loading) return <div className="p-8">Loading posts...</div>
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Posts Page</h1>
      <p className="mb-4">Total posts: {posts.length}</p>
      
      {posts.length === 0 ? (
        <p className="text-gray-600">No posts found</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border p-4 rounded">
              <h2 className="font-bold">{post.title}</h2>
              <p className="text-sm text-gray-600">Published: {post.published ? 'Yes' : 'No'}</p>
              <p className="text-sm text-gray-600">Category: {post.category}</p>
              <p className="text-sm text-gray-600">Author: {post.author}</p>
              <p className="text-sm text-gray-600">Date: {post.date}</p>
              <p className="text-sm text-gray-600">Read Time: {post.readTime}</p>
              <p className="text-sm text-gray-600">Href: {post.href}</p>
              <p className="text-sm">{post.excerpt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}