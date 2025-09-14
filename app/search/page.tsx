import { Metadata } from 'next'
import { Suspense } from 'react'
import SearchResults from '@/components/SearchResults'
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation'
import AdvancedAnalytics from '@/components/AdvancedAnalytics'
import { SchemaGenerator } from '@/lib/schema-generator'
import { getAllCategories } from '@/lib/tools-data'

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string; type?: string }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams
  const query = params.q || ''
  const category = params.category || ''
  const type = params.type || ''

  let title = 'Search AI Tools | AI Tools Insights'
  let description = 'Search through our comprehensive directory of AI tools. Find the perfect AI solution for your needs.'

  if (query) {
    title = `Search Results for "${query}" | AI Tools List`
    description = `Find AI tools related to "${query}". Browse through our curated collection of artificial intelligence tools and solutions.`
  }

  if (category) {
    title = `${category} AI Tools | AI Tools List`
    description = `Discover the best ${category.toLowerCase()} AI tools. Compare features, pricing, and reviews to find the perfect solution.`
  }

  return {
    title,
    description,
    keywords: `${query} AI tools, ${category} artificial intelligence, AI search, find AI tools, ${query} AI solutions`,
    openGraph: {
      title,
      description,
      url: `https://www.aitoolsinsights.com/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
      siteName: 'AI Tools Insights',
      images: ['/og-search.jpg'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-search.jpg'],
      creator: '@aitoolslist',
      site: '@aitoolslist',
    },
    alternates: {
      canonical: `https://www.aitoolslist.com/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
    },
    robots: {
      index: query ? false : true, // Don't index specific search results
      follow: true,
    },
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''
  const category = params.category || ''
  const type = params.type || ''

  // Get all available categories
  const allCategories = getAllCategories()

  // Generate breadcrumbs
  const breadcrumbs = [
    { name: 'Search', href: '/search', current: !query && !category },
    ...(query ? [{ name: `"${query}"`, href: `/search?q=${encodeURIComponent(query)}`, current: true }] : []),
    ...(category ? [{ name: category, href: `/search?category=${encodeURIComponent(category)}`, current: true }] : []),
  ]

  // Generate structured data for search page with SearchResultsPage schema
  const websiteSchema = SchemaGenerator.generateWebsiteSchema()
  const breadcrumbSchema = SchemaGenerator.generateBreadcrumbSchema(
    [{ name: 'Home', url: 'https://www.aitoolslist.com' }, ...breadcrumbs.map(b => ({ name: b.name, url: `https://www.aitoolslist.com${b.href}` }))]
  )
  
  // Add SearchResultsPage schema if there's a query
  const schemas = [websiteSchema, breadcrumbSchema]
  if (query) {
    // This will be populated by the SearchResults component with actual results
    const searchResultsSchema = SchemaGenerator.generateSearchResultsPageSchema(query, [], 0)
    schemas.push(searchResultsSchema)
  }

  const combinedSchema = SchemaGenerator.generateCombinedSchema(schemas)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Advanced Analytics */}
      <AdvancedAnalytics />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: combinedSchema }}
      />

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNavigation items={breadcrumbs} />
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {query ? `Search Results for "${query}"` : 
               category ? `${category} AI Tools` : 
               'Search AI Tools'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {query ? `Find AI tools related to "${query}" in our comprehensive directory.` :
               category ? `Discover the best ${category.toLowerCase()} AI tools with detailed reviews and comparisons.` :
               'Search through our comprehensive directory of AI tools to find the perfect solution for your needs.'}
            </p>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }>
          <SearchResults 
            query={query} 
            category={category} 
            type={type}
          />
        </Suspense>
      </div>

      {/* SEO Content */}
      <div className="bg-white dark:bg-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>How to Find the Perfect AI Tool</h2>
            <p>
              Our AI tools directory contains hundreds of carefully curated artificial intelligence solutions 
              across various categories. Whether you're looking for AI image generators, writing assistants, 
              coding tools, or business automation solutions, our search functionality helps you find exactly 
              what you need.
            </p>
            
            <h3>Search Tips</h3>
            <ul>
              <li>Use specific keywords related to your use case (e.g., "image generation", "content writing")</li>
              <li>Filter by category to narrow down results</li>
              <li>Check our detailed reviews and comparisons</li>
              <li>Consider pricing and feature requirements</li>
            </ul>

            <h3>Popular AI Tool Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 not-prose">
              {allCategories.slice(0, 8).map(cat => (
                <a
                  key={cat}
                  href={`/search?category=${encodeURIComponent(cat)}`}
                  className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="font-medium text-gray-900 dark:text-white">{cat}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}