import { NextResponse } from 'next/server'

// Featured tools data - this matches the data from FeaturedTools component
const featuredTools = [
  {
    id: 1,
    name: 'ChatGPT',
    category: 'AI Chatbot',
    description: 'Advanced conversational AI that can help with writing, coding, analysis, and creative tasks.',
    rating: 4.8,
    users: '100M+',
    pricing: 'Free / $20/mo',
    image: '/screenshots/chatgpt.jpg',
    href: '/ai-tools/chatgpt',
    features: ['Natural conversations', 'Code generation', 'Creative writing', 'Data analysis'],
    featured: true
  },
  {
    id: 2,
    name: 'Midjourney',
    category: 'AI Image Generator',
    description: 'Create stunning, artistic images from text descriptions with this powerful AI art generator.',
    rating: 4.7,
    users: '15M+',
    pricing: '$10-60/mo',
    image: '/screenshots/midjourney.jpg',
    href: '/ai-tools/midjourney',
    features: ['Artistic styles', 'High resolution', 'Commercial use', 'Style variations'],
    featured: true
  },
  {
    id: 3,
    name: 'GitHub Copilot',
    category: 'AI Coding Assistant',
    description: 'AI-powered code completion and generation tool that helps developers write code faster.',
    rating: 4.6,
    users: '5M+',
    pricing: '$10/mo',
    image: '/screenshots/github-copilot.jpg',
    href: '/ai-tools/github-copilot',
    features: ['Code completion', 'Multiple languages', 'Context aware', 'IDE integration'],
    featured: true
  },
  {
    id: 4,
    name: 'Jasper AI',
    category: 'AI Writing Tool',
    description: 'Professional AI writing assistant for marketing copy, blog posts, and business content.',
    rating: 4.5,
    users: '1M+',
    pricing: '$39-125/mo',
    image: '/screenshots/jasper-ai.jpg',
    href: '/ai-tools/jasper-ai',
    features: ['Marketing copy', 'SEO optimization', 'Brand voice', 'Templates'],
    featured: true
  },
  {
    id: 5,
    name: 'Runway',
    category: 'AI Video Tool',
    description: 'Create and edit videos with AI-powered tools for content creators and filmmakers.',
    rating: 4.4,
    users: '2M+',
    pricing: 'Free / $12-76/mo',
    image: '/screenshots/runway.jpg',
    href: '/ai-tools/runway',
    features: ['Video generation', 'Green screen', 'Motion tracking', 'AI effects'],
    featured: true
  },
  {
    id: 6,
    name: 'ElevenLabs',
    category: 'AI Voice Generator',
    description: 'Generate realistic AI voices and speech synthesis for various applications.',
    rating: 4.6,
    users: '500K+',
    pricing: 'Free / $5-330/mo',
    image: '/screenshots/elevenlabs.jpg',
    href: '/ai-tools/elevenlabs',
    features: ['Voice cloning', 'Multiple languages', 'Emotional speech', 'API access'],
    featured: true
  }
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: featuredTools,
      count: featuredTools.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error fetching featured tools:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured tools' },
      { status: 500 }
    )
  }
}