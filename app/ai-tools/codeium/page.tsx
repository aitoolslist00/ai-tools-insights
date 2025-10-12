import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolPage from '@/components/ToolPage'
import { getToolById } from '@/lib/tools-data'

export const metadata: Metadata = {
  title: 'Codeium Review 2024 - Free AI Code Assistant & Chat | AI Tools List',
  description: 'Complete Codeium review covering free AI code completion, chat assistance, and multi-language support. Perfect for individual developers.',
  keywords: 'Codeium review, free AI coding, code completion, AI chat assistant, developer tools',
  openGraph: {
    title: 'Codeium Review 2024 - Free AI Code Assistant',
    description: 'Code faster with Codeium\'s free AI assistant. Complete review and guide.',
    url: 'https://www.aitoolsinsights.com/ai-tools/codeium',
  },
}

export default function CodeiumPage() {
  const tool = getToolById('codeium')
  
  if (!tool) {
    notFound()
  }

  return <ToolPage tool={tool} />
}