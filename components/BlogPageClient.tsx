'use client'

import { useState } from 'react'
import { BlogPost } from '@/lib/blog-data'
import BlogSearchAndFilter from './BlogSearchAndFilter'
import BlogPostCard from './BlogPostCard'
import { Calendar, TrendingUp } from 'lucide-react'

interface BlogPageClientProps {
  initialPosts: BlogPost[]
}

export default function BlogPageClient({ initialPosts }: BlogPageClientProps) {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts)

  const handleFilteredPosts = (posts: BlogPost[]) => {
    setFilteredPosts(posts)
  }

  if (initialPosts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Calendar className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Blog Posts Yet</h3>
          <p className="text-gray-600">
            We're working on creating amazing content for you. Check back soon for the latest AI tools insights and reviews!
          </p>
        </div>
      </div>
    )
  }

  const featuredPosts = filteredPosts.filter(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  return (
    <div className="space-y-8">
      {/* Search and Filter Component */}
      <BlogSearchAndFilter 
        posts={initialPosts} 
        onFilteredPosts={handleFilteredPosts} 
      />

      {/* Results */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Articles Found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section>
              <div className="flex items-center mb-8">
                <TrendingUp className="w-6 h-6 text-yellow-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
              </div>
              <div className="grid gap-8 lg:grid-cols-2">
                {featuredPosts.slice(0, 2).map((post) => (
                  <BlogPostCard key={post.id} post={post} featured />
                ))}
              </div>
            </section>
          )}

          {/* Regular Posts */}
          {regularPosts.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {featuredPosts.length > 0 ? 'Latest Articles' : 'All Articles'}
                </h2>
                <div className="text-sm text-gray-500">
                  {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
                </div>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {regularPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}