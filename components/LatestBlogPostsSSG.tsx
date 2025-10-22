import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { getCategoryById, BlogPost } from '@/lib/blog-data'
import { loadBlogPostsFromFile } from '@/lib/blog-file-manager'
import { formatExcerpt } from '@/lib/content-formatter'

// Server component for SSG
export default async function LatestBlogPostsSSG() {
  let latestPosts: BlogPost[] = []
  
  try {
    const allPosts = await loadBlogPostsFromFile()
    const publishedPosts = allPosts.filter((post) => post.published)
    
    // Sort by date and get the 4 most recent posts
    latestPosts = publishedPosts
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.updatedAt || a.date || Date.now())
        const dateB = new Date(b.publishedAt || b.updatedAt || b.date || Date.now())
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, 4)
  } catch (error) {
    console.error('Error loading blog posts:', error)
  }

  if (latestPosts.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest from Our Blog
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest AI trends, tool reviews, and expert insights
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest from Our Blog
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest AI trends, tool reviews, and expert insights
          </p>
        </div>

        {/* Blog posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {latestPosts.map((post, index) => (
            <article key={post.id} className={`bg-white rounded-xl shadow-lg overflow-hidden card-hover ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
              {/* Post image */}
              <div className="relative h-48 overflow-hidden">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <div className="text-4xl font-bold text-primary-600 opacity-20">
                      {getCategoryById(post.category)?.name.charAt(0) || post.category.charAt(0)}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Category and meta */}
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                    {getCategoryById(post.category)?.name || post.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  <Link href={post.href} className="hover:text-primary-600 transition-colors">
                    {post.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                <p
                  className="text-gray-600 mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: formatExcerpt(post.excerpt) }}
                />

                {/* Author and date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(post.publishedAt || post.updatedAt || post.date || Date.now()).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                    <span className="mx-2">•</span>
                    <span>{post.author}</span>
                  </div>
                  <Link
                    href={post.href}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center group"
                  >
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View all posts CTA */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            View All Blog Posts
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}