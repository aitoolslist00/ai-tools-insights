import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolPage from '@/components/ToolPage'
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation'
import FAQSection, { aiToolsFAQs } from '@/components/FAQSection'
import AdvancedAnalytics from '@/components/AdvancedAnalytics'
import { getToolById, aiToolsData } from '@/lib/tools-data'
import { SchemaGenerator } from '@/lib/schema-generator'

// Pure Static Generation - No ISR  
export const dynamic = 'force-static'
export const revalidate = false

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return aiToolsData.map((tool) => ({
    slug: tool.id,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolById(slug)
  
  if (!tool) {
    return {
      title: 'Tool Not Found | AI Tools List',
      description: 'The requested AI tool could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const metaTitle = `${tool.name} Review 2025 - ${tool.description.substring(0, 50)}... | AI Tools List`
  const metaDescription = `Complete ${tool.name} review: Features, pricing, pros & cons. ${tool.longDescription.substring(0, 120)}... Rating: ${tool.rating}/5 ⭐`

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: `${tool.name} review, ${tool.name} pricing, ${tool.name} features, ${tool.category.toLowerCase()}, AI tools 2025, ${tool.name} alternatives, ${tool.name} vs competitors`,
    openGraph: {
      title: `${tool.name} Review 2025 - ${tool.category}`,
      description: tool.description,
      url: `https://www.aitoolslist.com/ai-tools/${tool.id}`,
      siteName: 'AI Tools List',
      images: [
        {
          url: `/screenshots/${tool.id}.jpg`,
          width: 1200,
          height: 630,
          alt: `${tool.name} Screenshot - ${tool.category}`,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [`/screenshots/${tool.id}.jpg`],
      creator: '@aitoolslist',
      site: '@aitoolslist',
    },
    alternates: {
      canonical: `https://www.aitoolslist.com/ai-tools/${tool.id}`,
    },
    other: {
      'article:author': 'AI Tools List',
      'article:published_time': tool.lastUpdated,
      'article:modified_time': tool.lastUpdated,
      'article:section': tool.category,
      'article:tag': [tool.name, tool.category, 'AI Tools', 'Review'].join(','),
    },
  }
}

export default async function DynamicToolPage({ params }: Props) {
  const { slug } = await params
  const tool = getToolById(slug)
  
  if (!tool) {
    notFound()
  }

  // Generate breadcrumbs
  const breadcrumbs = [
    { name: 'AI Tools', href: '/ai-tools' },
    { name: tool.category, href: `/ai-tools?category=${tool.category.toLowerCase().replace(/\s+/g, '-')}` },
    { name: tool.name, href: `/ai-tools/${tool.id}`, current: true }
  ]

  // Generate structured data
  const softwareSchema = SchemaGenerator.generateSoftwareApplicationSchema(tool)
  const breadcrumbSchema = SchemaGenerator.generateBreadcrumbSchema(
    [{ name: 'Home', url: 'https://www.aitoolslist.com' }, ...breadcrumbs.map(b => ({ name: b.name, url: `https://www.aitoolslist.com${b.href}` }))]
  )
  const faqSchema = SchemaGenerator.generateFAQSchema(aiToolsFAQs || [])

  const combinedSchema = SchemaGenerator.generateCombinedSchema([
    softwareSchema,
    breadcrumbSchema,
    faqSchema
  ])

  return (
    <div>
      {/* Advanced Analytics */}
      <AdvancedAnalytics />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: combinedSchema }}
      />

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNavigation items={breadcrumbs} />
      </div>

      {/* Main Tool Page Content */}
      <ToolPage tool={tool} />

      {/* FAQ Section */}
      <div className="bg-gray-50 dark:bg-gray-900">
        <FAQSection 
          faqs={aiToolsFAQs || []} 
          title={`Frequently Asked Questions about ${tool.name}`}
        />
      </div>
    </div>
  )
}