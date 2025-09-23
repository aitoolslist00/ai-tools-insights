import Link from 'next/link'
import { Menu } from 'lucide-react'

export default function ServerNavbar() {
  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200 supports-[backdrop-filter]:bg-white/60" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg" aria-label="AI Tools Insights - Home">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Tools Insights
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Home
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-full group-hover:left-0 transition-all duration-200"></span>
            </Link>
            <Link href="/ai-tools" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              AI Tools
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-full group-hover:left-0 transition-all duration-200"></span>
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Blog
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-full group-hover:left-0 transition-all duration-200"></span>
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              About
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-full group-hover:left-0 transition-all duration-200"></span>
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Contact
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-full group-hover:left-0 transition-all duration-200"></span>
            </Link>
            <Link href="/search" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ml-4 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Search Tools
            </Link>
          </div>

          {/* Mobile menu button - Static version */}
          <div className="md:hidden flex items-center">
            <div className="text-gray-700 p-2 rounded-lg">
              <Menu className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Always visible on mobile for now */}
        <div className="md:hidden border-t border-gray-200 py-4">
          <div className="flex flex-col space-y-2">
            <Link href="/" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
              Home
            </Link>
            <Link href="/ai-tools" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
              AI Tools
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
              Blog
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
              Contact
            </Link>
            <Link href="/search" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg">
              Search Tools
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}