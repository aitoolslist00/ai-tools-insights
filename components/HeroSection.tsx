'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Sparkles, Zap, Target } from 'lucide-react'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term)
    router.push(`/search?q=${encodeURIComponent(term)}`)
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20 lg:py-32 overflow-hidden gpu-accelerated">
      {/* Optimized background decorations with will-change */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow will-change-transform"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow will-change-transform"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main heading - optimized for LCP */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in optimize-legibility">
            AI Tools Directory: Find the Best{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Software</span>{' '}
            for Your Business in 2025
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up optimize-legibility">
            Comprehensive directory of 500+ artificial intelligence tools including AI image generators, 
            video tools, writing assistants, coding tools, and chatbots. Compare features, pricing, and reviews.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12 animate-slide-up">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for AI tools (e.g., image generator, chatbot, video editor...)"
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-lg transition-all duration-200 no-tap-highlight"
                autoComplete="off"
                spellCheck="false"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-r-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 no-tap-highlight transform hover:scale-105 active:scale-95"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Stats - Enhanced semantic structure */}
          <aside className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16" role="complementary" aria-label="Platform statistics">
            <article className="text-center animate-slide-up">
              <header className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 transition-transform duration-200 hover:scale-110">
                <Sparkles className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </header>
              <data value="500" className="text-3xl font-bold text-gray-900 mb-2">500+</data>
              <p className="text-gray-600">AI Tools Listed</p>
            </article>
            <article className="text-center animate-slide-up">
              <header className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 transition-transform duration-200 hover:scale-110">
                <Zap className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </header>
              <data value="50" className="text-3xl font-bold text-gray-900 mb-2">50+</data>
              <p className="text-gray-600">Categories</p>
            </article>
            <article className="text-center animate-slide-up">
              <header className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 transition-transform duration-200 hover:scale-110">
                <Target className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </header>
              <data value="100000" className="text-3xl font-bold text-gray-900 mb-2">100K+</data>
              <p className="text-gray-600">Monthly Users</p>
            </article>
          </aside>

          {/* Popular searches - Enhanced semantic structure */}
          <nav className="animate-slide-up" role="navigation" aria-label="Popular AI tool searches">
            <h3 className="text-gray-500 mb-4 text-center">Popular searches:</h3>
            <ul className="flex flex-wrap justify-center gap-3" role="list">
              {[
                'ChatGPT',
                'Midjourney',
                'DALL-E',
                'Jasper AI',
                'GitHub Copilot',
                'Runway',
                'ElevenLabs',
                'Claude AI'
              ].map((term) => (
                <li key={term} role="listitem">
                  <button
                    onClick={() => handlePopularSearch(term)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 no-tap-highlight"
                    aria-label={`Search for ${term} AI tools`}
                  >
                    {term}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  )
}