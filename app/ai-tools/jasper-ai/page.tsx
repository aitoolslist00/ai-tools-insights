import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolPage from '@/components/ToolPage'
import { getToolById } from '@/lib/tools-data'

export const metadata: Metadata = {
  title: 'Jasper AI Review 2024 - AI Content Creation Platform for Marketing Teams | AI Tools List',
  description: 'Complete Jasper AI review covering AI content creation, brand voice training, and marketing features. Perfect for businesses and marketing teams.',
  keywords: 'Jasper AI review, AI content creation, marketing AI, brand voice, AI copywriting, business content',
  openGraph: {
    title: 'Jasper AI Review 2024 - AI Content Creation Platform',
    description: 'Create high-converting content with Jasper AI. Complete review and guide.',
    url: 'https://www.aitoolsinsights.com/ai-tools/jasper-ai',
  },
}

export default function JasperAIPage() {
  const tool = getToolById('jasper-ai')
  
  if (!tool) {
    notFound()
  }

  return <ToolPage tool={tool} />
}