import { NextResponse } from 'next/server'

// AI tool categories
const categories = [
  {
    id: 1,
    name: 'AI Chatbots',
    slug: 'ai-chatbots',
    description: 'Conversational AI assistants and chatbots',
    count: 25,
    icon: '🤖',
    color: 'blue'
  },
  {
    id: 2,
    name: 'AI Image Generators',
    slug: 'ai-image-generators',
    description: 'AI-powered image creation and editing tools',
    count: 18,
    icon: '🎨',
    color: 'purple'
  },
  {
    id: 3,
    name: 'AI Writing Tools',
    slug: 'ai-writing-tools',
    description: 'AI assistants for content creation and writing',
    count: 22,
    icon: '✍️',
    color: 'green'
  },
  {
    id: 4,
    name: 'AI Coding Assistants',
    slug: 'ai-coding-assistants',
    description: 'AI tools for programming and development',
    count: 15,
    icon: '💻',
    color: 'indigo'
  },
  {
    id: 5,
    name: 'AI Video Tools',
    slug: 'ai-video-tools',
    description: 'AI-powered video creation and editing',
    count: 12,
    icon: '🎬',
    color: 'red'
  },
  {
    id: 6,
    name: 'AI Voice Generators',
    slug: 'ai-voice-generators',
    description: 'Text-to-speech and voice synthesis tools',
    count: 10,
    icon: '🎙️',
    color: 'yellow'
  },
  {
    id: 7,
    name: 'AI Music Tools',
    slug: 'ai-music-tools',
    description: 'AI-powered music creation and editing',
    count: 8,
    icon: '🎵',
    color: 'pink'
  },
  {
    id: 8,
    name: 'AI Productivity',
    slug: 'ai-productivity',
    description: 'AI tools for productivity and automation',
    count: 20,
    icon: '⚡',
    color: 'orange'
  },
  {
    id: 9,
    name: 'AI Analytics',
    slug: 'ai-analytics',
    description: 'AI-powered data analysis and insights',
    count: 14,
    icon: '📊',
    color: 'teal'
  },
  {
    id: 10,
    name: 'AI Design Tools',
    slug: 'ai-design-tools',
    description: 'AI assistants for design and creativity',
    count: 16,
    icon: '🎯',
    color: 'cyan'
  }
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
      totalTools: categories.reduce((sum, cat) => sum + cat.count, 0),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}