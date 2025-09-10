import { Metadata } from 'next'
import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react'
import { blogCategories, getCategoryById } from '@/lib/blog-data'
import { loadBlogPostsFromFile } from '@/lib/blog-file-manager'

export const metadata: Metadata = {
  title: 'AI Tools Blog - Latest AI News, Reviews & Insights | AI Tools List',
  description: 'Stay updated with the latest AI tools, reviews, comparisons, and industry insights. Expert analysis on artificial intelligence trends and technologies.',
  keywords: 'AI blog, AI tools reviews, artificial intelligence news, AI comparisons, machine learning insights, AI industry trends',
  openGraph: {
    title: 'AI Tools Blog - Latest AI News & Reviews',
    description: 'Expert insights on AI tools, reviews, and industry trends.',
    url: 'https://www.aitoolslist.com/blog',
  },
}

const categories = [
  'All Posts',
  ...blogCategories.map(cat => cat.name)
]

// Pure Static Generation (original backup)
export const dynamic = 'force-static'
export const revalidate = false

// Get blog posts with development-aware caching
const getBlogPosts = async () => {
  try {
    // In development, always load fresh data with cache busting
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Loading fresh blog data at ${new Date().toISOString()}`)
      return await loadBlogPostsFromFile()
    }
    
    // In production, use cached data
    return await getCachedBlogPosts()
  } catch (error) {
    console.error('[BLOG PAGE] Error loading blog posts:', error)
    return []
  }
}

// Cache the blog posts with tags for production only
const getCachedBlogPosts = unstable_cache(
  async () => {
    return await loadBlogPostsFromFile()
  },
  ['blog-posts'],
  {
    tags: ['blog-posts'],
    revalidate: 5
  }
)

export default async function BlogPage() {
  try {
    const allPosts = await getBlogPosts()
    console.log(`[BLOG PAGE] Loaded ${allPosts.length} total posts at ${new Date().toISOString()}`)
    
    const publishedPosts = allPosts.filter(post => post.published)
    console.log(`[BLOG PAGE] Found ${publishedPosts.length} published posts`)
    
    const featuredPosts = publishedPosts.filter(post => post.featured)
    const regularPosts = publishedPosts.filter(post => !post.featured)
    
    // Log recent posts for debugging
    if (publishedPosts.length > 0) {
      console.log('[BLOG PAGE] Recent published posts:', publishedPosts.slice(-3).map(p => ({ id: p.id, title: p.title, published: p.published })))
    }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AI Tools Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Stay updated with the latest AI tools, expert reviews, and industry insights 
              from our team of AI specialists.
            </p>
            
            {/* Search bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search blog posts..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Posts</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {featuredPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
                {/* Post image */}
                <div className="relative h-64 overflow-hidden">
                  {post.image ? (
                    <>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div 
                        className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center"
                        style={{ display: 'none' }}
                      >
                        <div className="text-6xl font-bold text-primary-600 opacity-20">
                          {getCategoryById(post.category)?.name.charAt(0) || post.category.charAt(0)}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <div className="text-6xl font-bold text-primary-600 opacity-20">
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    <Link href={post.href} className="hover:text-primary-600 transition-colors">
                      {post.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>

                  {/* Author and date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(post.publishedAt || post.date || post.updatedAt || new Date()).toLocaleDateString('en-US', { 
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
        </div>
      </section>

      {/* All Posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Posts</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
                {/* Post image */}
                <div className="relative h-48 overflow-hidden">
                  {post.image ? (
                    <>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div 
                        className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center"
                        style={{ display: 'none' }}
                      >
                        <div className="text-4xl font-bold text-primary-600 opacity-20">
                          {getCategoryById(post.category)?.name.charAt(0) || post.category.charAt(0)}
                        </div>
                      </div>
                    </>
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    <Link href={post.href} className="hover:text-primary-600 transition-colors">
                      {post.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 text-sm">
                    {post.excerpt}
                  </p>

                  {/* Author and date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(post.publishedAt || post.date || post.updatedAt || new Date()).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                      <span className="mx-2">•</span>
                      <span>{post.author}</span>
                    </div>
                    <Link
                      href={post.href}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center group"
                    >
                      Read
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load more */}
          <div className="text-center mt-12">
            <button className="inline-flex items-center px-8 py-3 border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-medium rounded-lg transition-colors">
              Load More Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>


    </div>
  )
  } catch (error) {
    console.error('[BLOG PAGE] Error rendering blog page:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Temporarily Unavailable</h1>
          <p className="text-gray-600">We're experiencing technical difficulties. Please try again later.</p>
        </div>
      </div>
    )
  }
}