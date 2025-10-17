import { Metadata } from 'next'
import Link from 'next/link'
import { blogCategories } from '@/lib/blog-data'

export const metadata: Metadata = {
  title: 'Blog Categories - AI Tools Insights',
  description: 'Browse our comprehensive AI tools blog by category. Find articles about AI tools, reviews, tutorials, and more.',
  alternates: {
    canonical: '/blog/categories',
  },
  openGraph: {
    title: 'Blog Categories - AI Tools Insights',
    description: 'Browse our comprehensive AI tools blog by category.',
    url: 'https://www.aitoolsinsights.com/blog/categories',
  },
}

export default function BlogCategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Blog Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our articles organized by category
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogCategories.map((category) => (
            <Link
              key={category.id}
              href={`/blog?category=${category.id}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-blue-500"
            >
              <div className={`inline-block px-4 py-2 rounded-lg ${category.color} mb-4`}>
                <h2 className="text-xl font-bold">{category.name}</h2>
              </div>
              <p className="text-gray-600">{category.description}</p>
              <div className="mt-4 text-blue-600 group-hover:text-blue-700 font-medium flex items-center">
                View Articles
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

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