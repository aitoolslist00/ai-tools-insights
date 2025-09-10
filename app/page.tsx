import { Suspense, lazy } from 'react'
import HeroSection from '@/components/HeroSection'
import SSGPerformanceMonitor from '@/components/SSGPerformanceMonitor'
import LazySection from '@/components/LazySection'
import FAQSection, { homepageFAQs } from '@/components/FAQSection'
import AdvancedAnalytics from '@/components/AdvancedAnalytics'
import { Metadata } from 'next'
import { SchemaGenerator } from '@/lib/schema-generator'
import { AdvancedSEOOptimizer } from '@/lib/advanced-seo-optimizer'

// Lazy load non-critical components for better performance
const FeaturedTools = lazy(() => import('@/components/FeaturedTools'))
const LatestBlogPostsSSG = lazy(() => import('@/components/LatestBlogPostsSSG'))
const NewsletterSignup = lazy(() => import('@/components/NewsletterSignup'))

// Pure Static Generation - Build time only
export const dynamic = 'force-static'
export const revalidate = false

export const metadata: Metadata = {
  title: 'AI Tools Insights - Discover the Best AI Tools for Your Business | 2025',
  description: 'Find the perfect AI tools for your business. Comprehensive directory featuring 2,500+ AI image generators, video tools, chatbots, writing assistants, and coding tools. Updated daily with expert reviews.',
  keywords: 'AI tools, artificial intelligence directory, best AI tools 2025, AI software, machine learning tools, business AI solutions, AI image generators, AI video tools, AI writing assistants, AI coding tools',
  openGraph: {
    title: 'AI Tools Insights - Discover the Best AI Tools for Your Business | 2025',
    description: 'Find the perfect AI tools for your business. Comprehensive directory featuring 2,500+ AI tools with expert reviews, pricing comparisons, and detailed features analysis.',
    url: 'https://www.aitoolsinsights.com',
    siteName: 'AI Tools Insights',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Tools Insights - Comprehensive Directory of AI Tools',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tools List - Discover the Best AI Tools for Your Business | 2025',
    description: 'Find the perfect AI tools for your business. 100+ AI tools with expert reviews and comparisons.',
    images: ['/og-home.jpg'],
    creator: '@aitoolslist',
    site: '@aitoolslist',
  },
  alternates: {
    canonical: 'https://www.aitoolslist.com',
  },
  other: {
    'google-site-verification': 'your-verification-code',
    'msvalidate.01': 'your-bing-verification-code',
    'yandex-verification': 'your-yandex-verification-code',
  },
}

// Loading fallback component
const SectionLoader = () => (
  <div className="flex items-center justify-center py-16">
    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
)

export default function Home() {
  // Generate advanced structured data for homepage
  const homePageData = {
    type: 'homepage',
    title: 'AI Tools List - Discover the Best AI Tools for Your Business | 2025',
    description: 'Find the perfect AI tools for your business. Comprehensive directory featuring 100+ AI tools with expert reviews, pricing comparisons, and detailed features analysis.',
    image: '/og-home.jpg',
    url: 'https://www.aitoolslist.com',
    keywords: ['AI tools', 'artificial intelligence', 'business AI', 'AI directory', 'machine learning tools']
  }
  
  const breadcrumbs = [
    { name: 'Home', url: 'https://www.aitoolslist.com' }
  ]

  const advancedStructuredData = AdvancedSEOOptimizer.generateAdvancedStructuredData('homepage', homePageData)

  return (
    <div>
      {/* Advanced SEO Head - Commented out to fix build */}
      {/* <AdvancedSEOHead 
        pageType="homepage"
        data={homePageData}
        title={homePageData.title}
        description={homePageData.description}
        image={homePageData.image}
        url={homePageData.url}
        breadcrumbs={breadcrumbs}
        faqs={homepageFAQs}
      /> */}
      
      {/* Advanced Analytics */}
      <AdvancedAnalytics />
      
      {/* Enhanced Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(advancedStructuredData) }}
      />
      
      <SSGPerformanceMonitor />
      
      {/* Critical above-the-fold content - loads immediately */}
      <HeroSection />
      
      {/* Non-critical content - lazy loaded for better performance */}
      <LazySection 
        className="py-16" 
        threshold={0.1} 
        rootMargin="100px"
        fallback={<SectionLoader />}
      >
        <Suspense fallback={<SectionLoader />}>
          <FeaturedTools />
        </Suspense>
      </LazySection>
      
      <LazySection 
        className="py-16" 
        threshold={0.1} 
        rootMargin="100px"
        fallback={<SectionLoader />}
      >
        <Suspense fallback={<SectionLoader />}>
          <LatestBlogPostsSSG />
        </Suspense>
      </LazySection>
      
      {/* FAQ Section for better SEO with enhanced schema */}
      <LazySection 
        className="py-16 bg-gray-50 dark:bg-gray-900" 
        threshold={0.1} 
        rootMargin="100px"
        fallback={<SectionLoader />}
      >
        <FAQSection faqs={homepageFAQs} />
      </LazySection>
      
      <LazySection 
        className="py-16" 
        threshold={0.1} 
        rootMargin="100px"
        fallback={<SectionLoader />}
      >
        <Suspense fallback={<SectionLoader />}>
          <NewsletterSignup />
        </Suspense>
      </LazySection>
    </div>
  )
}