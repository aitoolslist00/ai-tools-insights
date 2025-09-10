import { Metadata } from 'next'
import Link from 'next/link'
import { Star, ExternalLink, Users, Zap, Check, X, Calendar, Building, Target } from 'lucide-react'
import { AITool, getToolAlternatives } from '@/lib/tools-data'

interface ToolPageProps {
  tool: AITool
}

export default function ToolPage({ tool }: ToolPageProps) {
  const alternatives = getToolAlternatives(tool.id)
  
  // Color scheme based on category with full Tailwind classes
  const getColorScheme = (category: string) => {
    const schemes: Record<string, { 
      primary: string, 
      secondary: string, 
      accent: string,
      primaryHover: string,
      primaryText: string,
      accentText: string,
      gradientFrom: string,
      gradientTo: string,
      borderColor: string
    }> = {
      'AI Image Generators': { 
        primary: 'bg-purple-600', 
        secondary: 'bg-purple-50', 
        accent: 'bg-purple-100',
        primaryHover: 'hover:bg-purple-700',
        primaryText: 'text-purple-600',
        accentText: 'text-purple-700',
        gradientFrom: 'from-purple-50',
        gradientTo: 'to-white',
        borderColor: 'border-purple-200'
      },
      'AI Chatbots': { 
        primary: 'bg-blue-600', 
        secondary: 'bg-blue-50', 
        accent: 'bg-blue-100',
        primaryHover: 'hover:bg-blue-700',
        primaryText: 'text-blue-600',
        accentText: 'text-blue-700',
        gradientFrom: 'from-blue-50',
        gradientTo: 'to-white',
        borderColor: 'border-blue-200'
      },
      'AI Coding Assistants': { 
        primary: 'bg-green-600', 
        secondary: 'bg-green-50', 
        accent: 'bg-green-100',
        primaryHover: 'hover:bg-green-700',
        primaryText: 'text-green-600',
        accentText: 'text-green-700',
        gradientFrom: 'from-green-50',
        gradientTo: 'to-white',
        borderColor: 'border-green-200'
      },
      'AI Writing Tools': { 
        primary: 'bg-orange-600', 
        secondary: 'bg-orange-50', 
        accent: 'bg-orange-100',
        primaryHover: 'hover:bg-orange-700',
        primaryText: 'text-orange-600',
        accentText: 'text-orange-700',
        gradientFrom: 'from-orange-50',
        gradientTo: 'to-white',
        borderColor: 'border-orange-200'
      },
      'AI Video Tools': { 
        primary: 'bg-red-600', 
        secondary: 'bg-red-50', 
        accent: 'bg-red-100',
        primaryHover: 'hover:bg-red-700',
        primaryText: 'text-red-600',
        accentText: 'text-red-700',
        gradientFrom: 'from-red-50',
        gradientTo: 'to-white',
        borderColor: 'border-red-200'
      },
      'AI Voice & Audio': { 
        primary: 'bg-indigo-600', 
        secondary: 'bg-indigo-50', 
        accent: 'bg-indigo-100',
        primaryHover: 'hover:bg-indigo-700',
        primaryText: 'text-indigo-600',
        accentText: 'text-indigo-700',
        gradientFrom: 'from-indigo-50',
        gradientTo: 'to-white',
        borderColor: 'border-indigo-200'
      },
      'AI Music Generators': { 
        primary: 'bg-pink-600', 
        secondary: 'bg-pink-50', 
        accent: 'bg-pink-100',
        primaryHover: 'hover:bg-pink-700',
        primaryText: 'text-pink-600',
        accentText: 'text-pink-700',
        gradientFrom: 'from-pink-50',
        gradientTo: 'to-white',
        borderColor: 'border-pink-200'
      }
    }
    return schemes[category] || { 
      primary: 'bg-gray-600', 
      secondary: 'bg-gray-50', 
      accent: 'bg-gray-100',
      primaryHover: 'hover:bg-gray-700',
      primaryText: 'text-gray-600',
      accentText: 'text-gray-700',
      gradientFrom: 'from-gray-50',
      gradientTo: 'to-white',
      borderColor: 'border-gray-200'
    }
  }

  const colors = getColorScheme(tool.category)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className={`bg-gradient-to-br ${colors.gradientFrom} ${colors.gradientTo} py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <span className={`inline-block px-3 py-1 ${colors.accent} ${colors.accentText} text-sm font-medium rounded-full mr-3`}>
                  {tool.category}
                </span>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-lg font-semibold text-gray-700">{tool.rating}</span>
                  <span className="ml-2 text-gray-500">({tool.users} users)</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {tool.name}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                {tool.longDescription}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href={tool.affiliateUrl || tool.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center px-8 py-3 ${colors.primary} ${colors.primaryHover} text-white font-medium rounded-lg transition-colors`}
                >
                  Try {tool.name}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
                <div className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg">
                  Save to Favorites
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 text-sm">
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {tool.users} users
                </div>
                <div className="flex items-center text-gray-600">
                  <Building className="h-4 w-4 mr-2" />
                  {tool.company}
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Founded {tool.founded}
                </div>
              </div>
            </div>

            <div className={`bg-gradient-to-br ${colors.accent} ${colors.secondary} rounded-2xl p-8 text-center`}>
              <div className={`text-8xl font-bold ${colors.primaryText} opacity-20 mb-4`}>
                {tool.name.charAt(0)}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{tool.name}</div>
              <div className="text-gray-600">by {tool.company}</div>
              <div className="mt-4 text-sm text-gray-500">
                Last updated: {new Date(tool.lastUpdated).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tool.features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <Check className="h-6 w-6 text-green-500 mb-3" />
                <p className="text-gray-700 font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Perfect For</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tool.useCases.map((useCase, index) => (
              <div key={index} className={`${colors.secondary} p-6 rounded-xl border-l-4 ${colors.borderColor}`}>
                <Target className={`h-6 w-6 ${colors.primaryText} mb-3`} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{useCase}</h3>
                <p className="text-gray-600">Ideal for professionals and teams working on {useCase.toLowerCase()}.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pros and Cons */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Pros & Cons</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-green-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-green-900 mb-6 flex items-center">
                <Check className="h-6 w-6 mr-2" />
                Advantages
              </h3>
              <ul className="space-y-3">
                {tool.pros.map((pro, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-green-800">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-red-900 mb-6 flex items-center">
                <X className="h-6 w-6 mr-2" />
                Limitations
              </h3>
              <ul className="space-y-3">
                {tool.cons.map((con, index) => (
                  <li key={index} className="flex items-start">
                    <X className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-red-800">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Pricing & Plans</h2>
          <p className="text-xl text-gray-600 mb-8">
            Get the most current pricing information for {tool.name}
          </p>
          <div className={`${colors.secondary} p-8 rounded-2xl border ${colors.borderColor} max-w-2xl mx-auto`}>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">View Current Pricing</h3>
              <p className="text-gray-600">
                Check the latest pricing plans, features, and special offers directly from {tool.name}'s official pricing page.
              </p>
            </div>
            <a
              href={tool.pricingUrl || tool.affiliateUrl || tool.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center px-8 py-4 ${colors.primary} ${colors.primaryHover} text-white font-semibold rounded-lg transition-colors text-lg`}
            >
              <ExternalLink className="mr-3 h-5 w-5" />
              View Official Pricing
            </a>
            <p className="text-sm text-gray-500 mt-4">
              Get the latest pricing information and special offers
            </p>
          </div>
        </div>
      </section>

      {/* Alternatives Section */}
      {alternatives.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Similar AI Tools</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {alternatives.slice(0, 3).map((alt, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{alt.name}</h3>
                    <div className="ml-auto flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium text-gray-700">{alt.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{alt.description}</p>
                  <div className="flex items-center mb-4 text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{alt.users} users</span>
                  </div>
                  <Link
                    href={`/ai-tools/${alt.id}`}
                    className={`${colors.primaryText} hover:opacity-80 font-medium flex items-center`}
                  >
                    Learn More
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className={`py-16 ${colors.primary}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started with {tool.name}?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Join millions of users who trust {tool.name} for their {tool.category.toLowerCase()} needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={tool.affiliateUrl || tool.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Try {tool.name} Now
            </a>
            <Link
              href="/ai-tools"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
            >
              Explore More Tools
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}