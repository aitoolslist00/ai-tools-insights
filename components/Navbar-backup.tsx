'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'

const aiToolsCategories = [
  {
    name: 'AI Image Generators',
    href: '/search?category=AI%20Image%20Generators',
    icon: '🎨',
    description: 'Create stunning images from text',
    count: 7
  },
  {
    name: 'AI Video Tools',
    href: '/search?category=AI%20Video%20Tools',
    icon: '🎬',
    description: 'Generate and edit videos with AI',
    count: 9
  },
  {
    name: 'AI Voice Tools',
    href: '/search?category=AI%20Voice%20Tools',
    icon: '🎙️',
    description: 'Voice synthesis and audio tools',
    count: 5
  },
  {
    name: 'AI Writing Tools',
    href: '/search?category=AI%20Writing%20Tools',
    icon: '✍️',
    description: 'Content creation and writing assistance',
    count: 7
  },
  {
    name: 'AI Chatbots',
    href: '/search?category=AI%20Chatbots',
    icon: '💬',
    description: 'Conversational AI assistants',
    count: 4
  },
  {
    name: 'AI Coding Assistants',
    href: '/search?category=AI%20Coding%20Assistants',
    icon: '💻',
    description: 'Code completion and generation',
    count: 4
  },
  {
    name: 'AI Music Tools',
    href: '/search?category=AI%20Music%20Tools',
    icon: '🎵',
    description: 'Create original music with AI',
    count: 4
  }
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold gradient-text">AI Tools List</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
              Home
            </Link>
            
            {/* AI Tools Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium flex items-center transition-colors"
              >
                AI Tools
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {isDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-xl ring-1 ring-gray-200 z-50 overflow-hidden"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div className="bg-gradient-to-r from-primary-50 to-blue-50 px-4 py-3 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Browse AI Tools by Category</h3>
                    <p className="text-xs text-gray-600 mt-1">Discover the perfect AI solution for your needs</p>
                  </div>
                  <div className="py-2 max-h-96 overflow-y-auto">
                    {aiToolsCategories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="flex items-center px-4 py-3 hover:bg-gradient-to-r hover:from-primary-50 hover:to-blue-50 transition-all duration-200 group"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-lg group-hover:shadow-md transition-shadow">
                          {category.icon}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-700">
                              {category.name}
                            </h4>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full group-hover:bg-primary-100 group-hover:text-primary-700">
                              {category.count} tools
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600">
                            {category.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                    <Link
                      href="/ai-tools"
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center"
                    >
                      View All AI Tools →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/blog" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link href="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md">
              Home
            </Link>
            <div className="space-y-2">
              <div className="px-3 py-2 text-base font-medium text-gray-900 border-b border-gray-200">
                AI Tools Categories
              </div>
              <div className="space-y-1">
                {aiToolsCategories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md mx-2"
                  >
                    <span className="text-base mr-3">{category.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-gray-500">{category.count} tools</div>
                    </div>
                  </Link>
                ))}
                <Link
                  href="/ai-tools"
                  className="block px-3 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium mx-2 text-center border-t border-gray-200 mt-2 pt-3"
                >
                  View All AI Tools →
                </Link>
              </div>
            </div>
            <Link href="/blog" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md">
              Blog
            </Link>
            <Link href="/about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md">
              About Us
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md">
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}