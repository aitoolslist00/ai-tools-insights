import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolPage from '@/components/ToolPage'
import { getToolById } from '@/lib/tools-data'

export const metadata: Metadata = {
  title: 'ElevenLabs Review 2024 - Advanced AI Voice Synthesis & Cloning | AI Tools List',
  description: 'Complete ElevenLabs review covering AI voice synthesis, voice cloning, and multilingual support. Perfect for content creators and developers.',
  keywords: 'ElevenLabs review, AI voice synthesis, voice cloning, text to speech, AI audio, voice generation',
  openGraph: {
    title: 'ElevenLabs Review 2024 - Advanced AI Voice Synthesis',
    description: 'Create realistic voices with ElevenLabs AI. Complete review and guide.',
    url: 'https://www.aitoolsinsights.com/ai-tools/elevenlabs',
  },
}

export default function ElevenLabsPage() {
  const tool = getToolById('elevenlabs')
  
  if (!tool) {
    notFound()
  }

  return <ToolPage tool={tool} />
}