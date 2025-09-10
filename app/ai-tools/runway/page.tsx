import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolPage from '@/components/ToolPage'
import { getToolById } from '@/lib/tools-data'

export const metadata: Metadata = {
  title: 'Runway Review 2024 - AI Video Editing & Generation Platform | AI Tools List',
  description: 'Complete Runway review covering AI video editing, text-to-video generation, and creative tools. Perfect for content creators and filmmakers.',
  keywords: 'Runway review, AI video editing, text to video, video generation, AI filmmaking, creative AI',
  openGraph: {
    title: 'Runway Review 2024 - AI Video Editing Platform',
    description: 'Create stunning videos with Runway\'s AI tools. Complete review and guide.',
    url: 'https://www.aitoolslist.com/ai-tools/runway',
  },
}

export default function RunwayPage() {
  const tool = getToolById('runway')
  
  if (!tool) {
    notFound()
  }

  return <ToolPage tool={tool} />
}