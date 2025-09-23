import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolPage from '@/components/ToolPage'
import { getToolById } from '@/lib/tools-data'

export const metadata: Metadata = {
  title: 'Ideogram Review 2024 - AI Image Generator with Perfect Text Rendering | AI Tools List',
  description: 'Complete Ideogram review covering AI image generation with superior text rendering, logo creation, and typography integration.',
  keywords: 'Ideogram review, AI text rendering, logo generator AI, typography AI, AI image with text',
  openGraph: {
    title: 'Ideogram Review 2024 - AI Image Generator with Perfect Text',
    description: 'Create images with perfect text rendering using Ideogram AI. Complete review and guide.',
    url: 'https://www.aitoolslist.com/ai-tools/ideogram',
  },
}

export default function IdeogramPage() {
  const tool = getToolById('ideogram')
  
  if (!tool) {
    notFound()
  }

  return <ToolPage tool={tool} />
}