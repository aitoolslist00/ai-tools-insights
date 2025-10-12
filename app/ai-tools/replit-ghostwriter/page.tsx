import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolPage from '@/components/ToolPage'
import { getToolById } from '@/lib/tools-data'

export const metadata: Metadata = {
  title: 'Replit Ghostwriter Review 2024 - Cloud-Based AI Coding Assistant | AI Tools List',
  description: 'Complete Replit Ghostwriter review covering cloud-based AI coding, collaborative development, and educational features. Perfect for learning and prototyping.',
  keywords: 'Replit Ghostwriter review, cloud coding AI, collaborative development, AI coding education, online IDE',
  openGraph: {
    title: 'Replit Ghostwriter Review 2024 - Cloud-Based AI Coding',
    description: 'Code collaboratively with Replit Ghostwriter\'s AI assistant. Complete review and guide.',
    url: 'https://www.aitoolsinsights.com/ai-tools/replit-ghostwriter',
  },
}

export default function ReplitGhostwriterPage() {
  const tool = getToolById('replit-ghostwriter')
  
  if (!tool) {
    notFound()
  }

  return <ToolPage tool={tool} />
}