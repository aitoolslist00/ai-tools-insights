import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolPage from '@/components/ToolPage'
import { getToolById } from '@/lib/tools-data'

export const metadata: Metadata = {
  title: 'Tabnine Review 2024 - AI Code Assistant with Privacy Focus | AI Tools List',
  description: 'Complete Tabnine review covering AI code completion, privacy features, and enterprise capabilities. Perfect for privacy-conscious developers.',
  keywords: 'Tabnine review, AI code completion, privacy-focused AI, code assistant, enterprise AI coding',
  openGraph: {
    title: 'Tabnine Review 2024 - Privacy-Focused AI Code Assistant',
    description: 'Code faster with Tabnine\'s privacy-focused AI assistant. Complete review and guide.',
    url: 'https://www.aitoolslist.com/ai-tools/tabnine',
  },
}

export default function TabninePage() {
  const tool = getToolById('tabnine')
  
  if (!tool) {
    notFound()
  }

  return <ToolPage tool={tool} />
}