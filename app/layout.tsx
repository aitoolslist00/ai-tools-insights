import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import PreloadResources from '@/components/PreloadResources'
import InstantNavigation from '@/components/InstantNavigation'
import { AdvancedPerformanceOptimizer as PerfOptimizer } from '@/lib/advanced-performance-optimizer'
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
  title: 'AI Tools Insights - Discover the Best AI Tools for Your Business',
  description: 'Comprehensive directory of AI tools including image generators, video tools, chatbots, coding assistants, and more. Find the perfect AI solution for your needs.',
  keywords: 'AI tools, artificial intelligence, AI directory, machine learning tools, AI software, business AI, productivity tools',
  authors: [{ name: 'AI Tools Insights' }],
  creator: 'AI Tools Insights',
  publisher: 'AI Tools Insights',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.aitoolsinsights.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  other: {
    'google-site-verification': 'your-google-verification-code',
    'msvalidate.01': 'your-bing-verification-code',
    'yandex-verification': 'your-yandex-verification-code',
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AI Tools List" />
        <meta name="application-name" content="AI Tools List" />
        
        {/* Enhanced Viewport and Theme */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        
        {/* Advanced Performance Optimization */}
        <style dangerouslySetInnerHTML={{ __html: PerfOptimizer.generateCriticalCSS() }} />
        
        {/* Web Vitals and Performance Scripts */}
        <script dangerouslySetInnerHTML={{ __html: PerfOptimizer.generateWebVitalsOptimization() }} />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {/* Advanced Performance Monitoring - Commented out to fix build */}
        {/* <AdvancedPerformanceOptimizer /> */}
        
        {/* Service Worker with Advanced Caching */}
        <ServiceWorkerRegistration />
        <PreloadResources />
        <InstantNavigation />
        
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
      </body>
    </html>
  )
}