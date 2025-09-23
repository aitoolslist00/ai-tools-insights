import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Mail, Github } from 'lucide-react'
import ScrollToTopButton from '@/components/ScrollToTopButton'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" role="contentinfo" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Tools List
              </span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Discover the best AI tools for your business. From image generators to coding assistants, 
              find the perfect AI solution to boost your productivity and streamline your workflow.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/aitoolsinsights" 
                 className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                 aria-label="Follow us on Twitter"
                 target="_blank"
                 rel="noopener noreferrer">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/aitoolsinsights" 
                 className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                 aria-label="Connect with us on LinkedIn"
                 target="_blank"
                 rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://github.com/aitoolsinsights" 
                 className="w-10 h-10 bg-gray-800 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                 aria-label="View our GitHub repository"
                 target="_blank"
                 rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://facebook.com/aitoolsinsights" 
                 className="w-10 h-10 bg-gray-800 hover:bg-blue-800 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                 aria-label="Like us on Facebook"
                 target="_blank"
                 rel="noopener noreferrer">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="mailto:contact@aitoolsinsights.com" 
                 className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                 aria-label="Contact us via email">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/ai-tools" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  AI Tools Directory
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Blog & News
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Search Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Tool Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Popular Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/search?category=AI%20Image%20Generators" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Image Generators
                </Link>
              </li>
              <li>
                <Link href="/search?category=AI%20Chatbots" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  AI Chatbots
                </Link>
              </li>
              <li>
                <Link href="/search?category=AI%20Coding%20Assistants" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Coding Assistants
                </Link>
              </li>
              <li>
                <Link href="/search?category=AI%20Video%20Tools" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Video Tools
                </Link>
              </li>
              <li>
                <Link href="/search?category=AI%20Writing%20Tools" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Writing Assistants
                </Link>
              </li>
            </ul>
          </div>

          {/* Audio Tools Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Audio Tools</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/search?category=AI%20Audio%20Tools" className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  All Audio Tools
                </Link>
              </li>
              <li>
                <Link href="/search?category=AI%20Voice%20Tools" className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Voice Tools
                </Link>
              </li>
              <li>
                <Link href="/search?category=AI%20Music%20Tools" className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Music Tools
                </Link>
              </li>
              <li>
                <Link href="/ai-tools/elevenlabs" className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  ElevenLabs
                </Link>
              </li>
              <li>
                <Link href="/ai-tools/murf-ai" className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Murf AI
                </Link>
              </li>
              <li>
                <Link href="/ai-tools/suno-ai" className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Suno AI
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Resources</h3>
            <ul className="space-y-3 mb-8">
              <li>
                <Link href="/blog/ultimate-guide-ai-image-generators-2024" className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  AI Guide 2024
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Latest News
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Sitemap
                </Link>
              </li>
            </ul>
            
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-policy" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                &copy; {currentYear} AI Tools List. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>Made with ❤️ for the AI community</span>
                <span>•</span>
                <span>500+ AI Tools Listed</span>
                <span>•</span>
                <span>100K+ Monthly Users</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              <ScrollToTopButton />
            </div>
          </div>
        </div>
      </div>

      {/* Schema.org structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "AI Tools Insights",
            "description": "Comprehensive directory of AI tools for business and productivity",
            "url": "https://www.aitoolsinsights.com",
            "logo": "https://www.aitoolsinsights.com/logo.png",
            "sameAs": [
              "https://twitter.com/aitoolsinsights",
              "https://linkedin.com/company/aitoolsinsights",
              "https://github.com/aitoolsinsights",
              "https://facebook.com/aitoolsinsights"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "email": "insightsaitools@gmail.com",
              "contactType": "customer service"
            }
          })
        }}
      />
    </footer>
  )
}