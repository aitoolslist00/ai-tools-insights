import { Metadata } from 'next'
import Link from 'next/link'
import { Star, ExternalLink, Users, Zap, Check, X } from 'lucide-react'
import FavoriteButton from '@/components/FavoriteButton'

export const metadata: Metadata = {
  title: 'Pi AI Review 2024 - Personal AI Assistant Features & Pricing | AI Tools List',
  description: 'Complete Pi AI review by Inflection AI. Discover features, pricing, and capabilities of this personal AI assistant.',
  keywords: 'Pi AI review, Inflection AI, personal AI assistant, Pi AI features',
  openGraph: {
    title: 'Pi AI Review 2024 - Complete Guide',
    description: 'Everything you need to know about Pi AI, the personal AI assistant.',
    url: 'https://www.aitoolslist.com/ai-tools/pi-ai',
  },
}

const features = [
  'Personal conversations',
  'Emotional intelligence',
  'Voice interactions',
  'Mobile app support',
  'Contextual memory',
  'Helpful suggestions',
  'Safe conversations',
  'Multi-platform access'
]

const pros = [
  'Very natural conversations',
  'Emotionally intelligent responses',
  'Free to use',
  'Great mobile experience',
  'Personal assistant focus',
  'Safe and respectful'
]

const cons = [
  'Limited technical capabilities',
  'No code generation',
  'Fewer integrations',
  'Limited creative writing',
  'No plugin ecosystem'
]

const alternatives = [
  {
    name: 'ChatGPT',
    description: 'OpenAI\'s versatile conversational AI',
    href: '/ai-tools/chatgpt'
  },
  {
    name: 'Claude AI',
    description: 'Anthropic\'s AI assistant with strong reasoning',
    href: '/ai-tools/claude-ai'
  },
  {
    name: 'Perplexity AI',
    description: 'AI search engine with real-time information',
    href: '/ai-tools/perplexity-ai'
  }
]

export default function PiAIPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full mr-3">
                  AI Chatbot
                </span>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-lg font-semibold text-gray-700">4.2</span>
                  <span className="ml-2 text-gray-500">(8K+ reviews)</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Pi AI
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Your personal AI assistant by Inflection AI, designed to be helpful, 
                harmless, and honest in natural conversations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href="https://pi.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                >
                  Try Pi AI Free
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
                <FavoriteButton 
                  toolName="Pi AI" 
                  toolHref="/ai-tools/pi-ai" 
                />
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  2M+ users
                </div>
                <div className="flex items-center text-gray-600">
                  <Zap className="h-4 w-4 mr-2" />
                  Free
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8 text-center">
              <div className="text-8xl font-bold text-primary-600 opacity-20 mb-4">
                π
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">Pi AI</div>
              <div className="text-gray-600">by Inflection AI</div>
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

      {/* Pros and Cons */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Pros & Cons</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pros */}
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

            {/* Cons */}
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

      {/* Simple Pricing */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Pricing</h2>
          
          <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg border text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Free Forever</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">$0<span className="text-lg text-gray-500">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Unlimited conversations</span>
                </li>
                <li className="flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Voice interactions</span>
                </li>
                <li className="flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Mobile app access</span>
                </li>
              </ul>
              <a
                href="https://pi.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center inline-block"
              >
                Start Chatting Free
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Alternatives */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Similar AI Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {alternatives.map((alt, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{alt.name}</h3>
                <p className="text-gray-600 mb-4">{alt.description}</p>
                <Link
                  href={alt.href}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                >
                  Learn More
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}