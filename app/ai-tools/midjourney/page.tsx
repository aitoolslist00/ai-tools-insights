import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolPage from '@/components/ToolPage'
import { getToolById } from '@/lib/tools-data'

export const metadata: Metadata = {
  title: 'Midjourney Review 2024 - AI Art Generator Features & Pricing | AI Tools List',
  description: 'Complete Midjourney review covering AI art generation features, pricing plans, and creative capabilities. Learn how to create stunning AI artwork.',
  keywords: 'Midjourney review, AI art generator, AI image creation, digital art AI, Midjourney pricing, AI artwork',
  openGraph: {
    title: 'Midjourney Review 2024 - AI Art Generator',
    description: 'Create stunning AI artwork with Midjourney. Complete review and guide.',
    url: 'https://www.aitoolsinsights.com/ai-tools/midjourney',
  },
}

export default function MidjourneyPage() {
  const tool = getToolById('midjourney')
  
  if (!tool) {
    notFound()
  }

  return <ToolPage tool={tool} />
}