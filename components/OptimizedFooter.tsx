import Link from 'next/link'
import { Twitter, Linkedin, Mail, Github, Facebook, ArrowUp } from 'lucide-react'
import ScrollToTopButton from '@/components/ScrollToTopButton'

export default function OptimizedFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Tools List
              </span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed text-sm">
              Discover the best AI tools for your business. From image generators to coding assistants, 
              find the perfect AI solution to boost your productivity and streamline your workflow.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com/aitoolsinsights" 
                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label="Follow AI Tools List on Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com/company/aitoolsinsights" 
                className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label="Connect with AI Tools List on LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com/aitoolsinsights" 
                className="w-10 h-10 bg-gray-800 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label="View AI Tools List on GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="mailto:contact@aitoolsinsights.com" 
                className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label="Contact AI Tools Insights via email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/" 
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/ai-tools" 
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    AI Tools Directory
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/blog" 
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    Blog & News
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Popular Categories</h3>
            <nav aria-label="Categories navigation">
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/ai-tools?category=image-generators" 
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    Image Generators
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/ai-tools?category=chatbots" 
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    AI Chatbots
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/ai-tools?category=coding-assistants" 
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    Coding Assistants
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/ai-tools?category=video-tools" 
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    Video Tools
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/ai-tools?category=writing-assistants" 
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    Writing Assistants
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Legal & Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Legal & Resources</h3>
            <nav aria-label="Legal navigation">
              <ul className="space-y-3 mb-6">
                <li>
                  <Link 
                    href="/privacy-policy" 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/terms-of-service" 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/cookie-policy" 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/sitemap.xml" 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Sitemap
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Stay Updated</h4>
              <p className="text-gray-400 mb-4 text-xs">
                Get the latest AI tools and insights delivered to your inbox.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe
                </button>
              </div>
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
                <span className="hidden sm:inline">•</span>
                <span>500+ AI Tools Listed</span>
                <span className="hidden sm:inline">•</span>
                <span>100K+ Monthly Users</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></div>
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
            "name": "AI Tools List",
            "description": "Comprehensive directory of AI tools for business and productivity",
            "url": "https://ai-tools-list.vercel.app",
            "logo": "https://ai-tools-list.vercel.app/logo.png",
            "sameAs": [
              "https://twitter.com/aitoolslist",
              "https://linkedin.com/company/aitoolslist",
              "https://github.com/aitoolslist"
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