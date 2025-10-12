import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolPage from '@/components/ToolPage'
import { getToolById } from '@/lib/tools-data'

export const metadata: Metadata = {
  title: 'Stable Diffusion Review 2024 - Open Source AI Image Generator | AI Tools List',
  description: 'Complete Stable Diffusion review covering open-source AI image generation, customization options, and unlimited creative possibilities.',
  keywords: 'Stable Diffusion review, open source AI, free AI image generator, AI art creation, custom AI models',
  openGraph: {
    title: 'Stable Diffusion Review 2024 - Open Source AI Image Generator',
    description: 'Create unlimited AI images with Stable Diffusion. Complete review and guide.',
    url: 'https://www.aitoolsinsights.com/ai-tools/stable-diffusion',
  },
}

export default function StableDiffusionPage() {
  const tool = getToolById('stable-diffusion')
  
  if (!tool) {
    notFound()
  }

  return <ToolPage tool={tool} />
}