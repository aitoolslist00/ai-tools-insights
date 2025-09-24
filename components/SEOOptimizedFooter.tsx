import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Mail, Github } from 'lucide-react'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import InternalLinkManager from '@/components/InternalLinkManager'

/**
 * SEO-Optimized Footer with Strategic Internal Linking
 * Implements advanced internal link strategy for maximum SEO impact
 */
export default function SEOOptimizedFooter() {
  const currentYear = new Date().getFullYear()

  // High-converting tool pages for strategic footer placement
  const topTools = [
    { name: 'ChatGPT', slug: 'chatgpt', category: 'AI Chatbots' },
    { name: 'Midjourney', slug: 'midjourney', category: 'AI Image Generators' },
    { name: 'GitHub Copilot', slug: 'github-copilot', category: 'AI Coding Tools' },
    { name: 'DALL-E 3', slug: 'dalle', category: 'AI Image Generators' },
    { name: 'Claude AI', slug: 'claude-ai', category: 'AI Chatbots' },
    { name: 'Stable Diffusion', slug: 'stable-diffusion', category: 'AI Image Generators' }
  ]

  // Strategic blog posts for content marketing
  const featuredContent = [
    {
      title: 'Ultimate AI Image Generators Guide 2024',
      slug: 'ultimate-guide-ai-image-generators-2024',
      keywords: 'AI image generators, Midjourney vs DALL-E'
    },
    {
      title: 'Best AI Coding Assistants for Developers',
      slug: 'best-ai-coding-assistants-developers-2024',
      keywords: 'AI coding tools, GitHub Copilot alternatives'
    },
    {
      title: 'ChatGPT vs Claude AI: Complete Comparison',
      slug: 'chatgpt-vs-claude-ai-comparison-2024',
      keywords: 'AI chatbot comparison, best AI assistant'
    }
  ]

  // Category-based navigation for topical authority
  const categoryLinks = [
    {
      name: 'AI Image Generators',
      href: '/search?category=AI%20Image%20Generators',
      tools: ['Midjourney', 'DALL-E 3', 'Stable Diffusion', 'Adobe Firefly']
    },
    {
      name: 'AI Writing Tools',
      href: '/search?category=AI%20Writing%20Tools',
      tools: ['ChatGPT', 'Claude AI', 'Jasper AI', 'Copy.ai']
    },
    {
      name: 'AI Coding Tools',
      href: '/search?category=AI%20Coding%20Tools',
      tools: ['GitHub Copilot', 'Tabnine', 'Codeium', 'Replit Ghostwriter']
    },
    {
      name: 'AI Video Tools',
      href: '/search?category=AI%20Video%20Tools',
      tools: ['Runway', 'Pictory', 'InVideo', 'Synthesia']
    }
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" role="contentinfo" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strategic Internal Links Section - Above the fold for maximum SEO impact */}
        <div className="py-12 border-b border-gray-800">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Explore Top AI Tools by Category
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Discover the best AI tools for your specific needs. From image generation to coding assistance, 
              find the perfect AI solution to boost your productivity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryLinks.map((category, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-800/70 transition-all duration-200">
                <Link 
                  href={category.href}
                  className="block group"
                >
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </h3>
                  <ul className="space-y-2">
                    {category.tools.map((tool, toolIndex) => (
                      <li key={toolIndex} className="text-sm text-gray-300 group-hover:text-gray-200">
                        • {tool}
                      </li>
                    ))}
                  </ul>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer Content with Strategic Links */}
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
              Your comprehensive directory for discovering the best AI tools in 2024. 
              Compare features, pricing, and reviews to find the perfect AI solution for your business needs.
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

          {/* Strategic Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Navigation</h3>
            <InternalLinkManager
              currentPage=""
              context="footer"
              className="space-y-3"
            />
          </div>

          {/* Top AI Tools - High Converting Pages */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Top AI Tools</h3>
            <ul className="space-y-3">
              {topTools.map((tool, index) => (
                <li key={index}>
                  <Link 
                    href={`/ai-tools/${tool.slug}`} 
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                    title={`${tool.name} - ${tool.category} Review & Features`}
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured Content - Blog Posts */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Featured Guides</h3>
            <ul className="space-y-3">
              {featuredContent.map((post, index) => (
                <li key={index}>
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group"
                    title={post.title}
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    <span className="text-sm leading-tight">{post.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Resources</h3>
            <ul className="space-y-3 mb-8">
              <li>
                <Link href="/search" className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  AI Tool Search
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  AI Insights Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Contact & Support
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

        {/* SEO-Rich Bottom Section */}
        <div className="border-t border-gray-800 py-8">
          <div className="text-center mb-6">
            <p className="text-gray-300 text-sm max-w-4xl mx-auto leading-relaxed">
              <strong>AI Tools List</strong> is your trusted source for discovering and comparing the best artificial intelligence tools in 2024. 
              From <Link href="/ai-tools/chatgpt" className="text-blue-400 hover:text-blue-300">ChatGPT</Link> and 
              <Link href="/ai-tools/midjourney" className="text-blue-400 hover:text-blue-300 ml-1">Midjourney</Link> to 
              <Link href="/ai-tools/github-copilot" className="text-blue-400 hover:text-blue-300 ml-1">GitHub Copilot</Link>, 
              we provide comprehensive reviews, pricing comparisons, and expert insights to help you choose the right AI solution for your business needs.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © {currentYear} AI Tools List. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>Made with ❤️ for the AI community</span>
                <span>•</span>
                <span>Updated daily</span>
                <span>•</span>
                <span>500+ AI tools reviewed</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/sitemap.xml" 
                className="text-gray-400 hover:text-white text-sm transition-colors"
                title="XML Sitemap for search engines"
              >
                Sitemap
              </Link>
              <span className="text-gray-600">•</span>
              <Link 
                href="/robots.txt" 
                className="text-gray-400 hover:text-white text-sm transition-colors"
                title="Robots.txt file"
              >
                Robots
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <ScrollToTopButton />
    </footer>
  )
}