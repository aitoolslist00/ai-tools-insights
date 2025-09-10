import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolPage from '@/components/ToolPage'
import { getToolById } from '@/lib/tools-data'

export const metadata: Metadata = {
  title: 'Adobe Firefly Review 2024 - AI Image Generator for Creative Professionals | AI Tools List',
  description: 'Complete Adobe Firefly review covering AI image generation features, Creative Cloud integration, and commercial-safe capabilities. Perfect for professional designers.',
  keywords: 'Adobe Firefly review, AI image generator, Creative Cloud AI, commercial safe AI, Adobe AI tools',
  openGraph: {
    title: 'Adobe Firefly Review 2024 - AI Image Generator for Professionals',
    description: 'Create commercial-safe AI images with Adobe Firefly. Complete review and guide.',
    url: 'https://www.aitoolslist.com/ai-tools/adobe-firefly',
  },
}

export default function AdobeFireflyPage() {
  const tool = getToolById('adobe-firefly')
  
  if (!tool) {
    notFound()
  }

  return <ToolPage tool={tool} />
}