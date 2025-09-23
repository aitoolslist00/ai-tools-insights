import { Metadata } from 'next'
import Link from 'next/link'
import { Search, Star, Users, Zap, Filter } from 'lucide-react'
import { aiToolsData, getAllCategories, getToolsByCategory } from '@/lib/tools-data'

export const metadata: Metadata = {
  title: 'AI Tools Directory - Complete List of AI Tools by Category | AI Tools List',
  description: 'Browse our comprehensive directory of AI tools organized by category. Find AI image generators, chatbots, coding assistants, writing tools, and more.',
  keywords: 'AI tools directory, artificial intelligence tools, AI software list, machine learning tools, AI applications',
  openGraph: {
    title: 'AI Tools Directory - Complete List of AI Tools',
    description: 'Browse our comprehensive directory of AI tools organized by category.',
    url: 'https://www.aitoolslist.com/ai-tools',
  },
}

// Generate tool categories from the data
const toolCategories = getAllCategories().map(categoryName => {
  const tools = getToolsByCategory(categoryName)
  const categoryDescriptions: Record<string, string> = {
    'AI Image Generators': 'Create stunning images from text descriptions with cutting-edge AI technology',
    'AI Chatbots': 'Conversational AI assistants for productivity, research, and creative tasks',
    'AI Coding Assistants': 'AI-powered code completion, generation, and debugging tools',
    'AI Writing Tools': 'AI assistants for content creation, copywriting, and editing',
    'AI Video Tools': 'Create and edit videos with AI assistance and automation',
    'AI Voice & Audio': 'Generate and edit audio content with AI technology',
    'AI Music Generators': 'Create original music compositions with AI'
  }
  
  return {
    name: categoryName,
    description: categoryDescriptions[categoryName] || `Advanced ${categoryName.toLowerCase()} for modern workflows`,
    count: tools.length,
    tools: tools.map(tool => ({
      name: tool.name,
      rating: tool.rating,
      users: tool.users,
      href: `/ai-tools/${tool.id}`
    }))
  }
})

export default function AIToolsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AI Tools Directory
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover the best AI tools organized by category. From image generators to coding assistants, 
              find the perfect AI solution for your needs.
            </p>
            
            {/* Quick search */}
            <div className="max-w-md mx-auto mb-8">
              <Link href="/search" className="block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-500 cursor-pointer hover:border-blue-300 transition-colors">
                    Search all AI tools...
                  </div>
                </div>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">AI Tools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">100K+</div>
                <div className="text-gray-600">Monthly Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {toolCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                {/* Category Header */}
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {category.name}
                  </h2>
                  <p className="text-xl text-gray-600 mb-2">
                    {category.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {category.count} tools available
                  </p>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.tools.map((tool, toolIndex) => (
                    <div key={toolIndex} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow card-hover">
                      <div className="p-6">
                        {/* Tool header */}
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              <Link href={tool.href} className="hover:text-blue-600 transition-colors">
                                {tool.name}
                              </Link>
                            </h3>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-medium text-gray-700">
                              {tool.rating}
                            </span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center mb-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {tool.users} users
                          </div>
                        </div>

                        {/* CTA */}
                        <Link
                          href={tool.href}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View All Link */}
                <div className="text-center mt-8">
                  <Link
                    href={`/search?category=${encodeURIComponent(category.name)}`}
                    className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium rounded-lg transition-colors"
                  >
                    View All {category.name}
                    <Filter className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Use our advanced search to find the perfect AI tool for your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Search className="mr-2 h-4 w-4" />
              Advanced Search
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
            >
              Suggest a Tool
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}