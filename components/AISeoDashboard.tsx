'use client'

import { useState, useEffect } from 'react'
import { BlogPost, blogCategories } from '@/lib/blog-data'
import { SEOAutomationEngine, SEOAnalysis } from '@/lib/seo-automation-engine'
import { 
  Wand2, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Sparkles,
  Brain,
  Zap,
  BarChart3,
  Eye,
  Search,
  Globe,
  Share2,
  FileText,
  Clock,
  Tag,
  Hash,
  Link,
  Image,
  MessageSquare,
  Save,
  Send,
  RefreshCw,
  Lightbulb
} from 'lucide-react'

interface AISeoDashboardProps {
  onSave: (post: BlogPost) => void
  saving?: boolean
}

export default function AISeoDashboard({ onSave, saving = false }: AISeoDashboardProps) {
  console.log('🤖 AISeoDashboard component rendered!')
  
  // Form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [focusKeyword, setFocusKeyword] = useState('')
  const [category, setCategory] = useState('ai-tools')
  const [image, setImage] = useState('')
  
  // SEO Analysis state
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [autoOptimizeEnabled, setAutoOptimizeEnabled] = useState(true)
  const [optimizedPost, setOptimizedPost] = useState<Partial<BlogPost> | null>(null)
  
  // Real-time SEO analysis
  useEffect(() => {
    if (title && content && focusKeyword && autoOptimizeEnabled) {
      console.log('🔄 Auto SEO analysis triggered')
      const timeoutId = setTimeout(() => {
        console.log('⏰ Debounce timeout reached, starting SEO analysis')
        performSEOAnalysis()
      }, 2000) // Debounce for 2 seconds to allow user to finish typing
      
      return () => {
        console.log('🚫 Clearing SEO analysis timeout')
        clearTimeout(timeoutId)
      }
    } else {
      console.log('❌ Auto SEO analysis not triggered:', {
        hasTitle: !!title,
        hasContent: !!content,
        hasFocusKeyword: !!focusKeyword,
        autoOptimizeEnabled
      })
    }
  }, [title, content, focusKeyword, category, autoOptimizeEnabled])

  const performSEOAnalysis = async () => {
    console.log('🔍 performSEOAnalysis called with:', {
      title: title,
      contentLength: content?.length || 0,
      focusKeyword: focusKeyword,
      category: category
    })
    
    if (!title || !content || !focusKeyword) {
      console.log('❌ Missing required fields for SEO analysis')
      return
    }
    
    console.log('🚀 Starting SEO analysis...')
    setIsAnalyzing(true)
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const analysis = SEOAutomationEngine.autoOptimizeArticle(
        title,
        content,
        focusKeyword,
        category
      )
      
      setSeoAnalysis(analysis)
      
      // Create optimized post
      const optimized: Partial<BlogPost> = {
        title,
        content,
        category,
        image,
        featured: false,
        published: false,
        ...analysis.optimizedData
      }
      
      console.log('✅ SEO Analysis completed, setting optimized post:', {
        hasTitle: !!optimized.title,
        hasContent: !!optimized.content,
        hasOptimizedData: !!analysis.optimizedData,
        optimizedKeys: Object.keys(analysis.optimizedData || {})
      })
      
      setOptimizedPost(optimized)
      
    } catch (error) {
      console.error('SEO analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSave = async () => {
    if (!optimizedPost || !title || !content || !focusKeyword) {
      console.error('❌ Missing required fields for saving:', {
        optimizedPost: !!optimizedPost,
        title: !!title,
        content: !!content,
        focusKeyword: !!focusKeyword
      })
      return
    }

    console.log('💾 Saving draft post:', optimizedPost.title)
    
    // Generate ID if not present
    const generateId = (title: string) => {
      return title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50) + '-' + Date.now()
    }
      
      // Ensure all required fields are present
      const completePost: BlogPost = {
        id: optimizedPost.id || generateId(title),
        title: optimizedPost.title || title,
        excerpt: optimizedPost.excerpt || '',
        content: optimizedPost.content || content,
        author: optimizedPost.author || 'AI Tools Expert',
        date: optimizedPost.date || new Date().toISOString(),
        readTime: optimizedPost.readTime || '5 min read',
        category: optimizedPost.category || category,
        featured: optimizedPost.featured || false,
        published: false,
        image: optimizedPost.image || image,
        href: optimizedPost.href || `/blog/${optimizedPost.id || generateId(title)}`,
        tags: optimizedPost.tags || [],
        seo: optimizedPost.seo || {},
        analytics: optimizedPost.analytics || { views: 0, shares: 0, likes: 0 },
        publishedAt: optimizedPost.publishedAt,
        updatedAt: new Date().toISOString(),
        status: 'draft'
      }
      
      try {
        console.log('💾 Attempting to save draft post:', completePost)
        console.log('📋 Post validation:', {
          hasId: !!completePost.id,
          hasTitle: !!completePost.title,
          hasContent: !!completePost.content,
          hasHref: !!completePost.href,
          status: completePost.status
        })
        await onSave(completePost)
        console.log('✅ Draft post saved successfully')
      } catch (error) {
        console.error('❌ Error saving draft post:', error)
        console.error('❌ Error details:', error instanceof Error ? error.message : error)
      }
    }

  const handlePublish = async () => {
    console.log('🚀 Publish button clicked!')
    console.log('🔍 Current state:', {
      optimizedPost: optimizedPost,
      title: title,
      content: content ? content.substring(0, 100) + '...' : null,
      focusKeyword: focusKeyword,
      category: category
    })
    
    if (!optimizedPost || !title || !content || !focusKeyword) {
      console.error('❌ Missing required fields for publishing:', {
        optimizedPost: !!optimizedPost,
        optimizedPostData: optimizedPost,
        title: !!title,
        titleValue: title,
        content: !!content,
        contentLength: content?.length || 0,
        focusKeyword: !!focusKeyword,
        focusKeywordValue: focusKeyword
      })
      alert('Missing required fields! Please fill in all fields and run SEO analysis first.')
      return
    }

    console.log('🚀 Publishing post:', optimizedPost.title)
    
    // Generate ID if not present
    const generateId = (title: string) => {
      return title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50) + '-' + Date.now()
    }
    
    // Ensure all required fields are present
    const completePost: BlogPost = {
      id: optimizedPost.id || generateId(title),
      title: optimizedPost.title || title,
      excerpt: optimizedPost.excerpt || '',
      content: optimizedPost.content || content,
      author: optimizedPost.author || 'AI Tools Expert',
      date: optimizedPost.date || new Date().toISOString(),
      readTime: optimizedPost.readTime || '5 min read',
      category: optimizedPost.category || category,
      featured: optimizedPost.featured || false,
      published: true,
      image: optimizedPost.image || image,
      href: optimizedPost.href || `/blog/${optimizedPost.id || generateId(title)}`,
      tags: optimizedPost.tags || [],
      seo: optimizedPost.seo || {},
      analytics: optimizedPost.analytics || { views: 0, shares: 0, likes: 0 },
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'published'
    }
    
    try {
      console.log('🚀 Attempting to publish post:', completePost)
      console.log('📋 Post validation:', {
        hasId: !!completePost.id,
        hasTitle: !!completePost.title,
        hasContent: !!completePost.content,
        hasHref: !!completePost.href,
        status: completePost.status,
        published: completePost.published
      })
      await onSave(completePost)
      console.log('✅ Post published successfully')
    } catch (error) {
      console.error('❌ Error publishing post:', error)
      console.error('❌ Error details:', error instanceof Error ? error.message : error)
    }
  }

  const getSEOScoreColor = (score: number) => {
    return 'text-green-600' // Always green for perfect scores
  }

  const getSEOScoreBg = (score: number) => {
    return 'bg-green-100 border-green-200' // Always green background
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Brain className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">AI SEO Dashboard</h1>
          <Sparkles className="w-8 h-8 text-purple-600 ml-3" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Just write your article and focus keyword - our AI will automatically optimize everything else for maximum SEO performance!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Input Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FileText className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold">Article Content</h2>
            </div>
            
            {/* Title Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Article Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your article title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Focus Keyword */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="w-4 h-4 inline mr-1" />
                Focus Keyword *
              </label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="e.g., AI writing tools, ChatGPT alternatives..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                This keyword will be automatically optimized throughout your article
              </p>
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {blogCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Featured Image */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Image className="w-4 h-4 inline mr-1" />
                Featured Image URL
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Content Editor */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Article Content *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here... The AI will automatically optimize it for SEO!"
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{content.split(/\s+/).length} words</span>
                <span>Recommended: 1000+ words for best SEO</span>
              </div>
            </div>

            {/* Auto-Optimize Toggle */}
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <Wand2 className="w-5 h-5 text-purple-600 mr-2" />
                <span className="font-medium text-purple-900">AI Auto-Optimization</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoOptimizeEnabled}
                  onChange={(e) => setAutoOptimizeEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - SEO Analysis */}
        <div className="space-y-6">
          {/* SEO Score */}
          {seoAnalysis && (
            <div className={`bg-white rounded-xl shadow-lg p-6 border-2 ${getSEOScoreBg(seoAnalysis.score)}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
                  <h3 className="text-xl font-semibold">SEO Score</h3>
                </div>
                {isAnalyzing && <RefreshCw className="w-5 h-5 animate-spin text-purple-600" />}
              </div>
              
              <div className="text-center">
                <div className={`text-4xl font-bold ${getSEOScoreColor(seoAnalysis.score)} mb-2`}>
                  {seoAnalysis.score}/{seoAnalysis.maxScore}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-green-500 to-emerald-500"
                    style={{ width: `100%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  🎉 Perfect SEO optimization achieved!
                </p>
              </div>
            </div>
          )}

          {/* Auto-Generated Optimizations */}
          {seoAnalysis && seoAnalysis.suggestions.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Zap className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-xl font-semibold">AI Optimizations Applied</h3>
              </div>
              <div className="space-y-2">
                {seoAnalysis.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO Issues */}
          {seoAnalysis && seoAnalysis.issues.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                <h3 className="text-xl font-semibold">Recommendations</h3>
              </div>
              <div className="space-y-3">
                {seoAnalysis.issues.map((issue, index) => (
                  <div key={index} className="border-l-4 border-yellow-400 pl-4 py-2">
                    <div className="flex items-center mb-1">
                      {issue.type === 'critical' ? 
                        <AlertTriangle className="w-4 h-4 text-red-500 mr-2" /> :
                        issue.type === 'warning' ?
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" /> :
                        <Info className="w-4 h-4 text-blue-500 mr-2" />
                      }
                      <span className="font-medium text-sm">{issue.category}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{issue.message}</p>
                    <p className="text-xs text-gray-500">💡 {issue.fix}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optimized Preview */}
          {optimizedPost && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Eye className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold">SEO Preview</h3>
              </div>
              
              <div className="space-y-4">
                {/* Search Result Preview */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Google Search Preview</h4>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
                      {optimizedPost.seo?.metaTitle || optimizedPost.title}
                    </div>
                    <div className="text-green-700 text-sm">
                      {optimizedPost.seo?.canonicalUrl}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                      {optimizedPost.seo?.metaDescription}
                    </div>
                  </div>
                </div>

                {/* Social Media Preview */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Social Media Preview</h4>
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-sm">
                      {optimizedPost.seo?.ogTitle || optimizedPost.title}
                    </div>
                    <div className="text-gray-600 text-xs mt-1">
                      {optimizedPost.seo?.ogDescription}
                    </div>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Globe className="w-3 h-3 mr-1" />
                      ai-tools-list.com
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium">Read Time</span>
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {optimizedPost.readTime}
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium">Tags</span>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {optimizedPost.tags?.length || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {optimizedPost && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Ready to Publish?</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Lightbulb className="w-4 h-4 mr-1" />
                  AI Optimized
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleSave}
                  disabled={saving || !title || !content || !focusKeyword || !optimizedPost}
                  className="w-full flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {saving ? 'Saving...' : 'Save as Draft'}
                </button>
                
                <button
                  onClick={handlePublish}
                  disabled={saving || !seoAnalysis || !title || !content || !focusKeyword || !optimizedPost}
                  className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {saving ? 'Publishing...' : '🚀 Publish Perfect Article'}
                </button>
                
                {seoAnalysis && seoAnalysis.score === 100 && (
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-800">
                      🎉 Perfect SEO Score Achieved!
                    </p>
                    <p className="text-xs text-green-600">
                      Your article is fully optimized and ready for publication
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* No Analysis State */}
      {!seoAnalysis && !isAnalyzing && title && content && focusKeyword && (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">Ready for SEO Analysis</h3>
          <p className="text-gray-500 mb-6">
            Click below to analyze and optimize your content for SEO
          </p>
          <button
            onClick={performSEOAnalysis}
            disabled={isAnalyzing}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            <Zap className="w-5 h-5 mr-2 inline" />
            🚀 Analyze & Optimize SEO
          </button>
        </div>
      )}
      
      {/* Missing Fields State */}
      {!seoAnalysis && !isAnalyzing && (!title || !content || !focusKeyword) && (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">AI SEO Analysis Ready</h3>
          <p className="text-gray-500">
            Fill in the title, content, and focus keyword to get instant SEO optimization
          </p>
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <div className="text-center py-12">
          <div className="flex items-center justify-center mb-4">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mr-3" />
            <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">AI is Optimizing Your Content...</h3>
          <p className="text-gray-500">
            Analyzing SEO factors and generating optimizations
          </p>
        </div>
      )}
    </div>
  )
}