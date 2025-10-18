import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import PreloadResources from '@/components/PreloadResources'
import InstantNavigation from '@/components/InstantNavigation'
import { AdvancedPerformanceOptimizer as PerfOptimizer } from '@/lib/advanced-performance-optimizer'
import SchemaValidator from '@/components/SchemaValidator'
import AdvancedSEOOptimizer from '@/components/AdvancedSEOOptimizer'
import Enhanced2025SEO from '@/components/Enhanced2025SEO'
import CoreWebVitalsMonitor from '@/components/CoreWebVitalsMonitor'
import CoreWebVitalsOptimizer from '@/components/CoreWebVitalsOptimizer'
import AIContentOptimizer from '@/components/AIContentOptimizer'
import SEO2025ComplianceChecker from '@/components/SEO2025ComplianceChecker'
import IntentSatisfactionTracker from '@/components/IntentSatisfactionTracker'
import AdScripts from '@/components/AdScripts'
import { Toaster } from 'sonner'
import './globals.css'

// Optimized font loading with display swap for instant text rendering
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: false,
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: {
    default: 'AI Tools Insights - Discover the Best AI Tools for Your Business 2025',
    template: '%s | AI Tools Insights'
  },
  description: 'Comprehensive directory of 500+ AI tools including image generators, video tools, chatbots, coding assistants, and more. Find the perfect AI solution for your business needs. Updated 2025.',
  keywords: 'AI tools 2025, artificial intelligence directory, best AI tools, AI software comparison, business AI solutions, free AI tools, AI image generators, AI video tools, AI writing tools, AI coding assistants, machine learning tools, enterprise AI, productivity AI tools',
  authors: [{ name: 'AI Tools Insights Team', url: 'https://www.aitoolsinsights.com/about' }],
  creator: 'AI Tools Insights',
  publisher: 'AI Tools Insights',
  category: 'Technology',
  classification: 'AI Tools Directory',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.aitoolsinsights.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
      'en-GB': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.aitoolsinsights.com',
    siteName: 'AI Tools Insights',
    title: 'AI Tools Insights - Best AI Tools Directory 2025',
    description: 'Discover 500+ AI tools for business, creativity, and productivity. Expert reviews, comparisons, and recommendations.',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Tools Insights - Comprehensive AI Tools Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@aitoolsinsights',
    creator: '@aitoolsinsights',
    title: 'AI Tools Insights - Best AI Tools Directory 2025',
    description: 'Discover 500+ AI tools for business, creativity, and productivity. Expert reviews and comparisons.',
    images: ['/og-home.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verified-via-dns',
    yandex: 'pending-setup',
    yahoo: 'pending-setup',
    other: {
      'msvalidate.01': 'pending-setup',
      'facebook-domain-verification': 'pending-setup',
    },
  },
  other: {
    'google-site-verification': 'verified-via-dns',
    'msvalidate.01': 'pending-setup',
    'yandex-verification': 'pending-setup',
    'p:domain_verify': 'pending-setup',
    'norton-safeweb-site-verification': 'pending-setup',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Generate critical resource hints
  const resourceHints = PerfOptimizer.generateCriticalResourceHints()
  
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Advanced SEO and Performance optimization will be handled per page */}
        
        {/* Critical Resource Hints */}
        {resourceHints.map((hint, index) => (
          <link
            key={index}
            rel={hint.rel}
            href={hint.href}
            {...(hint.as && { as: hint.as as any })}
            {...(hint.type && { type: hint.type })}
            {...(hint.crossOrigin && { crossOrigin: hint.crossOrigin as any })}
          />
        ))}
        
        {/* Enhanced Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* PWA and Mobile Optimization */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AI Tools List" />
        <meta name="application-name" content="AI Tools List" />
        
        {/* Enhanced Viewport and Theme */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        
        {/* Monetag Ads */}
        <meta name="monetag" content="f8b80cf7c7b1e52f0a54caeb5b9bd7b0" />
        
        {/* Advanced Performance Optimization */}
        <style dangerouslySetInnerHTML={{ __html: PerfOptimizer.generateCriticalCSS() }} />
        
        {/* Web Vitals and Performance Scripts */}
        <script dangerouslySetInnerHTML={{ __html: PerfOptimizer.generateWebVitalsOptimization() }} />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {/* Ad Scripts - Load after head tag */}
        <AdScripts />
        {/* Advanced Performance Monitoring - Commented out to fix build */}
        {/* <AdvancedPerformanceOptimizer /> */}
        
        {/* Service Worker with Advanced Caching */}
        <ServiceWorkerRegistration />
        <PreloadResources />
        <InstantNavigation />
        
        {/* Advanced SEO Optimization Engine */}
        <AdvancedSEOOptimizer />
        
        {/* Enhanced 2025 SEO Compliance */}
        <Enhanced2025SEO pageType="homepage" />
        
        {/* Core Web Vitals Monitoring */}
        <CoreWebVitalsMonitor />
        
        {/* Enhanced Core Web Vitals Optimization for 2025 */}
        <CoreWebVitalsOptimizer enableReporting={true} enableOptimizations={true} />
        
        {/* AI Content Understanding Optimization for 2025 */}
        <AIContentOptimizer 
          pageType="homepage"
          contentType="directory"
          keywords={['ai tools', 'artificial intelligence', 'directory', 'business solutions']}
          enableStructuredData={true}
          enableSemanticMarkup={true}
        />
        
        {/* Intent Satisfaction Tracking for 2025 Algorithm */}
        <IntentSatisfactionTracker 
          pageType="homepage"
          contentType="navigation"
          keywords={['ai tools', 'artificial intelligence', 'directory']}
        />
        
        <div className="min-h-screen flex flex-col">
          {/* Navigation */}
          <Navbar />
          
          <main className="flex-grow" role="main">
            {children}
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
        
        {/* Advanced Performance Monitoring Script */}
        <script dangerouslySetInnerHTML={{ __html: PerfOptimizer.generatePerformanceBudgetMonitor() }} />
        
        {/* Schema Validation in Development */}
        <SchemaValidator enabled={process.env.NODE_ENV === 'development'} />
        
        {/* SEO 2025 Compliance Checker (Development Only) */}
        <SEO2025ComplianceChecker />
        
        {/* Toast notifications */}
        <Toaster />
      </body>
    </html>
  )
}