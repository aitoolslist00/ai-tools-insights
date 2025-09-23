import { Metadata } from 'next'
import Link from 'next/link'
import { Star, ExternalLink, Users, Zap, Check, X } from 'lucide-react'
import FavoriteButton from '@/components/FavoriteButton'

export const metadata: Metadata = {
  title: 'Perplexity AI Review 2024 - AI Search Engine Features & Pricing | AI Tools List',
  description: 'Complete Perplexity AI review covering features, pricing, and real-time search capabilities. The AI-powered search engine with citations.',
  keywords: 'Perplexity AI review, AI search engine, Perplexity pricing, AI search tool',
  openGraph: {
    title: 'Perplexity AI Review 2024 - Complete Guide',
    description: 'Everything you need to know about Perplexity AI, the AI-powered search engine.',
    url: 'https://www.aitoolslist.com/ai-tools/perplexity-ai',
  },
}

const features = [
  'Real-time web search',
  'Source citations',
  'Conversational interface',
  'Academic search mode',
  'Multi-language support',
  'Follow-up questions',
  'Image search integration',
  'Mobile app available'
]

const pros = [
  'Real-time information access',
  'Accurate source citations',
  'Clean, ad-free interface',
  'Academic research focused',
  'Fast response times',
  'Great for fact-checking'
]

const cons = [
  'Limited conversation memory',
  'No creative writing features',
  'Fewer integrations',
  'Limited customization options',
  'Usage limits on free tier'
]

const alternatives = [
  {
    name: 'ChatGPT',
    description: 'OpenAI\'s conversational AI with broad capabilities',
    href: '/ai-tools/chatgpt'
  },
  {
    name: 'Claude AI',
    description: 'Anthropic\'s AI assistant with strong reasoning',
    href: '/ai-tools/claude-ai'
  },
  {
    name: 'Pi AI',
    description: 'Personal AI assistant for helpful conversations',
    href: '/ai-tools/pi-ai'
  }
]

export default function PerplexityAIPage() {
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
                  <span className="ml-1 text-lg font-semibold text-gray-700">4.4</span>
                  <span className="ml-2 text-gray-500">(15K+ reviews)</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Perplexity AI
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                The AI-powered search engine that provides accurate, real-time answers 
                with source citations for all your questions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href="https://perplexity.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                >
                  Try Perplexity Free
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
                <FavoriteButton 
                  toolName="Perplexity AI" 
                  toolHref="/ai-tools/perplexity-ai" 
                />
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  5M+ users
                </div>
                <div className="flex items-center text-gray-600">
                  <Zap className="h-4 w-4 mr-2" />
                  Free / $20/mo
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8 text-center">
              <div className="text-8xl font-bold text-primary-600 opacity-20 mb-4">
                P
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">Perplexity AI</div>
              <div className="text-gray-600">AI Search Engine</div>
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

      {/* Pricing */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Pricing Plans</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg border">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">$0<span className="text-lg text-gray-500">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>5 searches every 4 hours</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Standard search quality</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Basic features</span>
                </li>
              </ul>
              <a
                href="https://perplexity.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center inline-block"
              >
                Get Started Free
              </a>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-primary-200 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Perplexity Pro</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">$20<span className="text-lg text-gray-500">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>300 searches per day</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Advanced AI models</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Priority support</span>
                </li>
              </ul>
              <a
                href="https://perplexity.ai/pro"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center inline-block"
              >
                Upgrade to Pro
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