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
  title: 'AI Tools Directory 2025: 500+ Best AI Software Tools Compared & Reviewed',
  description: 'Discover the best AI tools for your business from our comprehensive directory of 500+ AI software solutions. Compare features, pricing & reviews. Free & paid options. Updated 2025.',
  keywords: 'AI tools directory, best AI tools 2025, AI software comparison, artificial intelligence tools, AI tools for business, free AI tools, AI image generators, AI video tools, AI writing tools, AI coding assistants, AI chatbots, machine learning tools, business AI solutions, enterprise AI tools, AI productivity tools',
  openGraph: {
    title: 'AI Tools Directory 2025: 500+ Best AI Software Tools Compared & Reviewed',
    description: 'Discover the best AI tools for your business from our comprehensive directory of 500+ AI software solutions. Compare features, pricing & reviews. Free & paid options.',
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
    title: 'AI Tools Directory 2025: 500+ Best AI Software Tools Compared & Reviewed',
    description: 'Discover the best AI tools for your business from our comprehensive directory of 500+ AI software solutions. Compare features, pricing & reviews.',
    images: ['/og-home.jpg'],
    creator: '@aitoolslist',
    site: '@aitoolslist',
  },
  alternates: {
<<<<<<< HEAD
    canonical: 'https://www.aitoolsinsights.com',
  },
  other: {
    'google-site-verification': 'verified-via-dns',
    'msvalidate.01': 'pending-setup',
    'yandex-verification': 'pending-setup',
=======
    canonical: 'https://www.aitoolslist.com',
  },
  other: {
    'google-site-verification': 'your-verification-code',
    'msvalidate.01': 'your-bing-verification-code',
    'yandex-verification': 'your-yandex-verification-code',
>>>>>>> 6e3c964e7c99441b87c1b6d576569e02cf5db032
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
<<<<<<< HEAD
    url: 'https://www.aitoolsinsights.com',
=======
    url: 'https://www.aitoolslist.com',
>>>>>>> 6e3c964e7c99441b87c1b6d576569e02cf5db032
    keywords: ['AI tools', 'artificial intelligence', 'business AI', 'AI directory', 'machine learning tools']
  }
  
  const breadcrumbs = [
<<<<<<< HEAD
    { name: 'Home', url: 'https://www.aitoolsinsights.com' }
=======
    { name: 'Home', url: 'https://www.aitoolslist.com' }
>>>>>>> 6e3c964e7c99441b87c1b6d576569e02cf5db032
  ]

  // Generate comprehensive homepage schema with all critical types
  const homepageSchema = SchemaGenerator.generateHomepageSchema()
  const breadcrumbSchema = SchemaGenerator.generateBreadcrumbSchema(breadcrumbs)
  
  // Combine all schemas for maximum SEO impact (FAQ schema is handled by FAQSection component)
  const combinedSchema = SchemaGenerator.generateCombinedSchema([
    JSON.parse(homepageSchema),
    breadcrumbSchema
  ])

  return (
    <div>
      {/* Advanced Analytics */}
      <AdvancedAnalytics />
      
      {/* Comprehensive Structured Data with Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: combinedSchema }}
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