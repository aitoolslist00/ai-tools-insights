import { Metadata } from 'next'
import Link from 'next/link'
import { aiToolsData } from '@/lib/tools-data'

export const metadata: Metadata = {
  title: 'AI Tools Categories - AI Tools Insights',
  description: 'Browse AI tools by category. Find image generators, video tools, chatbots, coding assistants, and more.',
  alternates: {
    canonical: '/ai-tools/categories',
  },
  openGraph: {
    title: 'AI Tools Categories - AI Tools Insights',
    description: 'Browse AI tools by category.',
    url: 'https://www.aitoolsinsights.com/ai-tools/categories',
  },
}

// Define all available categories with descriptions
const categories = [
  {
    id: 'image-generation',
    name: 'Image Generation',
    description: 'AI-powered tools for creating stunning images, artwork, and graphics',
    icon: '🎨',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
  },
  {
    id: 'video',
    name: 'Video Tools',
    description: 'Create, edit, and enhance videos with AI technology',
    icon: '🎬',
    color: 'bg-red-100 text-red-700 border-red-300',
  },
  {
    id: 'chatbot',
    name: 'Chatbots & Assistants',
    description: 'Conversational AI tools for various tasks and interactions',
    icon: '💬',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  {
    id: 'coding',
    name: 'Coding Assistants',
    description: 'AI tools to help developers write better code faster',
    icon: '💻',
    color: 'bg-green-100 text-green-700 border-green-300',
  },
  {
    id: 'writing',
    name: 'Writing & Content',
    description: 'AI-powered content creation and writing assistance',
    icon: '✍️',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  },
  {
    id: 'audio',
    name: 'Audio & Music',
    description: 'Create, edit, and enhance audio with AI',
    icon: '🎵',
    color: 'bg-pink-100 text-pink-700 border-pink-300',
  },
  {
    id: 'productivity',
    name: 'Productivity',
    description: 'AI tools to boost your productivity and efficiency',
    icon: '⚡',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
  },
  {
    id: 'research',
    name: 'Research & Analysis',
    description: 'AI-powered research and data analysis tools',
    icon: '🔍',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  },
]

export default function AIToolsCategoriesPage() {
  // Count tools per category
  const categoryCounts = categories.map(cat => {
    const count = aiToolsData.filter(tool => 
      tool.category?.toLowerCase() === cat.id.toLowerCase() ||
      tool.category?.toLowerCase().includes(cat.name.toLowerCase())
    ).length
    return { ...cat, count }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Tools Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive directory of AI tools organized by category
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryCounts.map((category) => (
            <Link
              key={category.id}
              href={`/ai-tools?category=${category.id}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 hover:border-blue-500"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{category.icon}</div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                      {category.count} {category.count === 1 ? 'Tool' : 'Tools'}
                    </span>
                    <svg 
                      className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/ai-tools"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
          >
            View All AI Tools
          </Link>
        </div>
      </div>
    </div>
  )
}