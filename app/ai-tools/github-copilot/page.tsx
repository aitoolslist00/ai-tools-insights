import { Metadata } from 'next'
import Link from 'next/link'
import { Star, ExternalLink, Users, Zap, Check, X, Code } from 'lucide-react'
import FavoriteButton from '@/components/FavoriteButton'

export const metadata: Metadata = {
  title: 'GitHub Copilot Review 2024 - AI Coding Assistant Features & Pricing | AI Tools List',
  description: 'Complete GitHub Copilot review covering AI code completion, features, pricing, and productivity benefits for developers.',
  keywords: 'GitHub Copilot review, AI coding assistant, code completion, developer tools, AI programming, GitHub Copilot pricing',
  openGraph: {
    title: 'GitHub Copilot Review 2024 - AI Coding Assistant',
    description: 'Boost your coding productivity with GitHub Copilot AI assistant.',
    url: 'https://www.aitoolsinsights.com/ai-tools/github-copilot',
  },
}

const features = [
  'AI-powered code completion',
  'Multi-language support',
  'Context-aware suggestions',
  'IDE integration',
  'Code explanation',
  'Test generation',
  'Documentation writing',
  'Refactoring assistance'
]

const supportedLanguages = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Rust'
]

const pros = [
  'Significantly boosts coding productivity',
  'Supports multiple programming languages',
  'Integrates with popular IDEs',
  'Learns from your coding patterns',
  'Helps with boilerplate code',
  'Great for learning new languages'
]

const cons = [
  'Requires internet connection',
  'May suggest suboptimal code',
  'Subscription-based pricing',
  'Privacy concerns with code sharing',
  'Can create dependency on AI assistance'
]

export default function GitHubCopilotPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mr-3">
                  AI Coding Assistant
                </span>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-lg font-semibold text-gray-700">4.6</span>
                  <span className="ml-2 text-gray-500">(15K+ reviews)</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                GitHub Copilot
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Your AI pair programmer that helps you write code faster with intelligent 
                code completions, suggestions, and explanations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href="https://github.com/features/copilot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Start Free Trial
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
                <FavoriteButton 
                  toolName="GitHub Copilot" 
                  toolHref="/ai-tools/github-copilot" 
                />
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  5M+ developers
                </div>
                <div className="flex items-center text-gray-600">
                  <Zap className="h-4 w-4 mr-2" />
                  $10/mo
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 text-center">
              <Code className="h-20 w-20 text-blue-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 mb-2">GitHub Copilot</div>
              <div className="text-gray-600">by GitHub</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                <Check className="h-6 w-6 text-green-500 mb-3" />
                <p className="text-gray-700 font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Languages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Supported Programming Languages</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {supportedLanguages.map((language, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">💻</div>
                <p className="text-gray-700 font-medium">{language}</p>
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
                Pros
              </h3>
              <ul className="space-y-3">
                {pros.map((pro, index) => (
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
                Cons
              </h3>
              <ul className="space-y-3">
                {cons.map((con, index) => (
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

      {/* Pricing */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Pricing Plans</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg border">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Individual</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">$10<span className="text-lg text-gray-500">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Code completions</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Chat in IDE and mobile</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>CLI assistance</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Security vulnerability filter</span>
                </li>
              </ul>
              <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Start Free Trial
              </button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-200 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  For Teams
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Business</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">$19<span className="text-lg text-gray-500">/user/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Everything in Individual</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Admin console</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Organization-wide policy management</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Industry-leading privacy</span>
                </li>
              </ul>
              <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}