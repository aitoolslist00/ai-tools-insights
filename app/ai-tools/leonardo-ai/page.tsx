import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolPage from '@/components/ToolPage'
import { getToolById } from '@/lib/tools-data'

export const metadata: Metadata = {
  title: 'Leonardo AI Review 2024 - AI Image Generator for Game Assets | AI Tools List',
  description: 'Complete Leonardo AI review covering AI image generation for game development, concept art, and creative content creation.',
  keywords: 'Leonardo AI review, game asset AI, concept art generator, AI image creation, game development AI',
  openGraph: {
    title: 'Leonardo AI Review 2024 - AI Image Generator for Game Assets',
    description: 'Create game assets and concept art with Leonardo AI. Complete review and guide.',
    url: 'https://www.aitoolsinsights.com/ai-tools/leonardo-ai',
  },
}

export default function LeonardoAIPage() {
  const tool = getToolById('leonardo-ai')
  
  if (!tool) {
    notFound()
  }

  return <ToolPage tool={tool} />
}