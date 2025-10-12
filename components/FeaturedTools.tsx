import Link from 'next/link'
import { Star, ExternalLink, Users, Zap } from 'lucide-react'

const featuredTools = [
  {
    id: 1,
    name: 'ChatGPT',
    category: 'AI Chatbot',
    description: 'Advanced conversational AI that can help with writing, coding, analysis, and creative tasks.',
    rating: 4.8,
    users: '100M+',
    pricing: 'Free / $20/mo',
    image: '/images/chatgpt.jpg',
    href: '/ai-tools/chatgpt',
    features: ['Natural conversations', 'Code generation', 'Creative writing', 'Data analysis']
  },
  {
    id: 2,
    name: 'Midjourney',
    category: 'AI Image Generator',
    description: 'Create stunning, artistic images from text descriptions with this powerful AI art generator.',
    rating: 4.7,
    users: '15M+',
    pricing: '$10-60/mo',
    image: '/images/midjourney.jpg',
    href: '/ai-tools/midjourney',
    features: ['Artistic styles', 'High resolution', 'Commercial use', 'Style variations']
  },
  {
    id: 3,
    name: 'GitHub Copilot',
    category: 'AI Coding Assistant',
    description: 'AI-powered code completion and generation tool that helps developers write code faster.',
    rating: 4.6,
    users: '5M+',
    pricing: '$10/mo',
    image: '/images/github-copilot.jpg',
    href: '/ai-tools/github-copilot',
    features: ['Code completion', 'Multiple languages', 'Context aware', 'IDE integration']
  },
  {
    id: 4,
    name: 'Jasper AI',
    category: 'AI Writing Tool',
    description: 'Professional AI writing assistant for marketing copy, blog posts, and business content.',
    rating: 4.5,
    users: '1M+',
    pricing: '$39-125/mo',
    image: '/images/jasper.jpg',
    href: '/ai-tools/jasper-ai',
    features: ['Marketing copy', 'SEO optimization', 'Brand voice', 'Templates']
  },
  {
    id: 5,
    name: 'Runway',
    category: 'AI Video Tool',
    description: 'Create and edit videos with AI-powered tools for content creators and filmmakers.',
    rating: 4.4,
    users: '2M+',
    pricing: 'Free / $12-76/mo',
    image: '/images/runway.jpg',
    href: '/ai-tools/runway',
    features: ['Video generation', 'Green screen', 'Motion tracking', 'AI effects']
  },
  {
    id: 6,
    name: 'ElevenLabs',
    category: 'AI Voice Generator',
    description: 'Generate realistic AI voices and speech synthesis for various applications.',
    rating: 4.6,
    users: '500K+',
    pricing: 'Free / $5-330/mo',
    image: '/images/elevenlabs.jpg',
    href: '/ai-tools/elevenlabs',
    features: ['Voice cloning', 'Multiple languages', 'Emotional speech', 'API access']
  }
]

export default function FeaturedTools() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured AI Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the most popular and powerful AI tools trusted by millions of users worldwide
          </p>
        </div>

        {/* Tools grid - Enhanced semantic structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list" aria-label="Featured AI tools">
          {featuredTools.map((tool) => (
            <article key={tool.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden card-hover" role="listitem" itemScope itemType="https://schema.org/SoftwareApplication">
              {/* Tool image */}
              <header className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <div className="text-6xl font-bold text-primary-600 opacity-20" aria-hidden="true">
                  {tool.name.charAt(0)}
                </div>
              </header>

              <div className="p-6">
                {/* Tool header */}
                <header className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1" itemProp="name">
                      {tool.name}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full" itemProp="applicationCategory">
                      {tool.category}
                    </span>
                  </div>
                  <div className="flex items-center" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" aria-hidden="true" />
                    <span className="ml-1 text-sm font-medium text-gray-700" itemProp="ratingValue">
                      {tool.rating}
                    </span>
                    <meta itemProp="bestRating" content="5" />
                    <meta itemProp="worstRating" content="1" />
                  </div>
                </header>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-3" itemProp="description">
                  {tool.description}
                </p>

                {/* Features */}
                <section className="mb-4" aria-label="Key features">
                  <ul className="flex flex-wrap gap-2" role="list">
                    {tool.features.slice(0, 3).map((feature, index) => (
                      <li
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        role="listitem"
                        itemProp="featureList"
                      >
                        {feature}
                      </li>
                    ))}
                    {tool.features.length > 3 && (
                      <li className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md" role="listitem">
                        +{tool.features.length - 3} more
                      </li>
                    )}
                  </ul>
                </section>

                {/* Stats */}
                <aside className="flex items-center mb-4 text-sm text-gray-500" aria-label="Usage statistics">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" aria-hidden="true" />
                    <span itemProp="interactionCount">{tool.users} users</span>
                  </div>
                </aside>

                {/* CTA */}
                <Link
                  href={tool.href}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center group"
                  aria-label={`Learn more about ${tool.name}`}
                  itemProp="url"
                >
                  Learn More
                  <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View all tools CTA */}
        <div className="text-center mt-12">
          <Link
            href="/ai-tools"
            className="inline-flex items-center px-8 py-3 border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-medium rounded-lg transition-colors"
          >
            View All AI Tools
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}