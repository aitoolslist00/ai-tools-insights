import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sitemap | AI Tools List - Navigate Our AI Directory',
  description: 'Complete sitemap of AI Tools List. Find all AI tools, blog posts, and pages in our comprehensive artificial intelligence directory.',
  robots: {
    index: true,
    follow: true,
  },
}

const sitemapData = {
  'Main Pages': [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: '/blog' },
    { name: 'Search', href: '/search' },
  ],
  'AI Image Generators': [
    { name: 'Midjourney', href: '/ai-tools/midjourney' },
    { name: 'DALL·E 3', href: '/ai-tools/dalle' },
    { name: 'Adobe Firefly', href: '/ai-tools/adobe-firefly' },
    { name: 'Ideogram', href: '/ai-tools/ideogram' },
    { name: 'Leonardo AI', href: '/ai-tools/leonardo-ai' },
    { name: 'Illustroke', href: '/ai-tools/illustroke' },
    { name: 'Stable Diffusion', href: '/ai-tools/stable-diffusion' },
  ],
  'AI Video Tools': [
    { name: 'Runway', href: '/ai-tools/runway' },
    { name: 'Pictory', href: '/ai-tools/pictory' },
    { name: 'InVideo', href: '/ai-tools/invideo' },
    { name: 'Synthesia', href: '/ai-tools/synthesia' },
    { name: 'FlexClip', href: '/ai-tools/flexclip' },
    { name: 'Flicki', href: '/ai-tools/flicki' },
    { name: 'WiseCut', href: '/ai-tools/wisecut' },
  ],
  'Video Editors': [
    { name: 'Descript', href: '/ai-tools/descript' },
    { name: 'Gling', href: '/ai-tools/gling' },
    { name: 'TimeBolt', href: '/ai-tools/timebolt' },
  ],
  'AI Voice & Audio': [
    { name: 'ElevenLabs', href: '/ai-tools/elevenlabs' },
    { name: 'Murf AI', href: '/ai-tools/murf-ai' },
    { name: 'Play.ht', href: '/ai-tools/play-ht' },
    { name: 'Resemble AI', href: '/ai-tools/resemble-ai' },
    { name: 'Adobe Podcast', href: '/ai-tools/adobe-podcast' },
  ],
  'AI Writing & Blog': [
    { name: 'Jasper AI', href: '/ai-tools/jasper-ai' },
    { name: 'Copy.ai', href: '/ai-tools/copy-ai' },
    { name: 'Rytr', href: '/ai-tools/rytr' },
    { name: 'Grammarly AI', href: '/ai-tools/grammarly-ai' },
    { name: 'Writesonic', href: '/ai-tools/writesonic' },
    { name: 'Surfer AI', href: '/ai-tools/surfer-ai' },
  ],
  'AI Chatbots': [
    { name: 'ChatGPT', href: '/ai-tools/chatgpt' },
    { name: 'Claude AI', href: '/ai-tools/claude-ai' },
    { name: 'Perplexity AI', href: '/ai-tools/perplexity-ai' },
    { name: 'Pi AI', href: '/ai-tools/pi-ai' },
  ],
  'AI Coding Assistants': [
    { name: 'GitHub Copilot', href: '/ai-tools/github-copilot' },
    { name: 'Replit Ghostwriter', href: '/ai-tools/replit-ghostwriter' },
    { name: 'Tabnine', href: '/ai-tools/tabnine' },
    { name: 'Codeium', href: '/ai-tools/codeium' },
  ],
  'AI Music Generators': [
    { name: 'Suno AI', href: '/ai-tools/suno-ai' },
    { name: 'Aiva', href: '/ai-tools/aiva' },
    { name: 'Soundraw', href: '/ai-tools/soundraw' },
    { name: 'Mubert', href: '/ai-tools/mubert' },
  ],
  'Blog Posts': [
    { name: 'Ultimate Guide to AI Image Generators 2024', href: '/blog/ultimate-guide-ai-image-generators-2024' },
    { name: 'ChatGPT vs Claude AI Comparison', href: '/blog/chatgpt-vs-claude-ai-comparison' },
    { name: 'AI Coding Assistants Revolutionizing Development', href: '/blog/ai-coding-assistants-revolutionizing-development' },
    { name: 'Best AI Writing Tools for Content Creators 2024', href: '/blog/best-ai-writing-tools-content-creators-2024' },
  ],
  'Legal Pages': [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Sitemap', href: '/sitemap' },
  ],
}

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sitemap</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Navigate through all pages and AI tools in our comprehensive directory. 
            Find exactly what you're looking for with our organized site structure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(sitemapData).map(([category, links]) => (
            <div key={category} className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                {category}
              </h2>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-primary-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-gray-600 mb-6">
            Use our search functionality to find specific AI tools or browse our categories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
            >
              Search AI Tools
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-medium rounded-lg transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* SEO Information */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            This sitemap contains all publicly accessible pages on AI Tools Insights. 
            For XML sitemap used by search engines, visit{' '}
            <a href="/sitemap.xml" className="text-primary-600 hover:text-primary-700 underline">
              /sitemap.xml
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}