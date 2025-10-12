import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Tools List - Discover the Best AI Tools for Your Business',
  description: 'Comprehensive directory of AI tools including image generators, video tools, chatbots, coding assistants, and more. Find the perfect AI solution for your needs.',
  keywords: 'AI tools, artificial intelligence, AI directory, machine learning tools, AI software, business AI, productivity tools',
  authors: [{ name: 'AI Tools List Team' }],
  creator: 'AI Tools List',
  publisher: 'AI Tools List',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.aitoolsinsights.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AI Tools List - Discover the Best AI Tools for Your Business',
    description: 'Comprehensive directory of AI tools including image generators, video tools, chatbots, coding assistants, and more.',
    url: 'https://www.aitoolsinsights.com',
    siteName: 'AI Tools List',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Tools List - Directory of AI Tools',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tools List - Discover the Best AI Tools',
    description: 'Comprehensive directory of AI tools for businesses and individuals.',
    images: ['/og-image.jpg'],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}