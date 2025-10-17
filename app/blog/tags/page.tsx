import { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedBlogPosts } from '@/lib/blog-data'

export const metadata: Metadata = {
  title: 'Blog Tags - AI Tools Insights',
  description: 'Browse our AI tools blog by tags. Find articles about specific AI technologies, use cases, and topics.',
  alternates: {
    canonical: '/blog/tags',
  },
  openGraph: {
    title: 'Blog Tags - AI Tools Insights',
    description: 'Browse our AI tools blog by tags.',
    url: 'https://www.aitoolsinsights.com/blog/tags',
  },
}

export default function BlogTagsPage() {
  const posts = getPublishedBlogPosts()
  
  // Extract all unique tags
  const allTags = new Map<string, number>()
  posts.forEach(post => {
    post.tags?.forEach(tag => {
      allTags.set(tag, (allTags.get(tag) || 0) + 1)
    })
  })
  
  // Sort tags by count (descending)
  const sortedTags = Array.from(allTags.entries())
    .sort((a, b) => b[1] - a[1])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Blog Tags
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore articles by topic and technology
          </p>
        </div>

        {sortedTags.length > 0 ? (
          <div className="flex flex-wrap gap-3 justify-center max-w-5xl mx-auto">
            {sortedTags.map(([tag, count]) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="group inline-flex items-center gap-2 bg-white hover:bg-blue-50 border border-gray-300 hover:border-blue-500 rounded-full px-5 py-2.5 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <span className="font-medium text-gray-800 group-hover:text-blue-700">
                  {tag}
                </span>
                <span className="bg-gray-100 group-hover:bg-blue-100 text-gray-600 group-hover:text-blue-700 text-sm px-2 py-0.5 rounded-full">
                  {count}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <p>No tags available yet. Check back soon!</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </div>
  )
}