import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolPage from '@/components/ToolPage'
import { getToolById } from '@/lib/tools-data'

export const metadata: Metadata = {
  title: 'DALL-E 3 Review 2024 - OpenAI Image Generator Features & Pricing | AI Tools List',
  description: 'Complete DALL-E 3 review covering AI image generation features, integration with ChatGPT, and creative capabilities. Create stunning AI images.',
  keywords: 'DALL-E review, OpenAI image generator, AI art creation, DALL-E 3 features, AI image generation',
  openGraph: {
    title: 'DALL-E 3 Review 2024 - OpenAI Image Generator',
    description: 'Create amazing AI images with DALL-E 3. Complete review and guide.',
    url: 'https://www.aitoolsinsights.com/ai-tools/dalle',
  },
}

export default function DallePage() {
  const tool = getToolById('dalle')
  
  if (!tool) {
    notFound()
  }

  return <ToolPage tool={tool} />
}