import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolPage from '@/components/ToolPage'
import { getToolById } from '@/lib/tools-data'

export const metadata: Metadata = {
  title: 'ChatGPT Review 2024 - Features, Pricing & Alternatives | AI Tools List',
  description: 'Complete ChatGPT review covering features, pricing, pros and cons. Learn how ChatGPT can boost your productivity with AI-powered conversations.',
  keywords: 'ChatGPT review, OpenAI ChatGPT, AI chatbot, conversational AI, ChatGPT pricing, ChatGPT features',
  openGraph: {
    title: 'ChatGPT Review 2024 - Complete Guide',
    description: 'Everything you need to know about ChatGPT, the leading AI chatbot.',
    url: 'https://www.aitoolsinsights.com/ai-tools/chatgpt',
  },
}

export default function ChatGPTPage() {
  const tool = getToolById('chatgpt')
  
  if (!tool) {
    notFound()
  }

  return <ToolPage tool={tool} />
}