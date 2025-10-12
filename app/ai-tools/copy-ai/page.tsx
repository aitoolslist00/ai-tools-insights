import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolPage from '@/components/ToolPage'
import { getToolById } from '@/lib/tools-data'

export const metadata: Metadata = {
  title: 'Copy.ai Review 2024 - AI Copywriting Tool with 90+ Templates | AI Tools List',
  description: 'Complete Copy.ai review covering AI copywriting, templates, and workflow automation. Perfect for marketers and content creators.',
  keywords: 'Copy.ai review, AI copywriting, marketing copy, content templates, sales copy, AI writing',
  openGraph: {
    title: 'Copy.ai Review 2024 - AI Copywriting Tool',
    description: 'Create compelling copy with Copy.ai\'s AI templates. Complete review and guide.',
    url: 'https://www.aitoolsinsights.com/ai-tools/copy-ai',
  },
}

export default function CopyAIPage() {
  const tool = getToolById('copy-ai')
  
  if (!tool) {
    notFound()
  }

  return <ToolPage tool={tool} />
}