'use client'

import { useState, useEffect, useCallback } from 'react'
import { BlogPost, blogCategories } from '@/lib/blog-data'
import { RealSEOEngine, RealSEOAnalysis } from '@/lib/seo-engine-real'
import { SEOAutoOptimizer, SEOOptimizationResult } from '@/lib/seo-auto-optimizer'
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
  Lightbulb,
  Award,
  TrendingDown,
  Activity,
  Gauge,
  Rocket,
  Star,
  ArrowUp,
  CheckCircle2,
  Loader2,
  X
} from 'lucide-react'

interface RealAISeoDashboardProps {
  onSave: (post: BlogPost) => void
  saving?: boolean
}

export default function RealAISeoDashboard({ onSave, saving = false }: RealAISeoDashboardProps) {
  // Form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [focusKeyword, setFocusKeyword] = useState('')
  const [category, setCategory] = useState('ai-tools')
  const [image, setImage] = useState('')
  
  // SEO Analysis state
  const [seoAnalysis, setSeoAnalysis] = useState<RealSEOAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [autoOptimizeEnabled, setAutoOptimizeEnabled] = useState(true)
  const [optimizedPost, setOptimizedPost] = useState<Partial<BlogPost> | null>(null)
  const [analysisHistory, setAnalysisHistory] = useState<RealSEOAnalysis[]>([])
  
  // AI Optimization state
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationResult, setOptimizationResult] = useState<SEOOptimizationResult | null>(null)
  const [showOptimizationModal, setShowOptimizationModal] = useState(false)

  // Real-time SEO analysis with debouncing
  useEffect(() => {
    if (title && content && focusKeyword && autoOptimizeEnabled) {
      const timeoutId = setTimeout(() => {
        performSEOAnalysis()
      }, 1000) // Reduced debounce for better UX
      
      return () => clearTimeout(timeoutId)
    } else {
      setSeoAnalysis(null)
      setOptimizedPost(null)
    }
  }, [title, content, focusKeyword, category, autoOptimizeEnabled])

  const performSEOAnalysis = useCallback(async () => {
    if (!title || !content || !focusKeyword) {
      return
    }
    
    setIsAnalyzing(true)
    
    try {
      // Simulate realistic processing time
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const analysis = RealSEOEngine.analyzeContent(
        title,
        content,
        focusKeyword,
        category
      )
      
      setSeoAnalysis(analysis)
      setOptimizedPost(analysis.optimizedData)
      
      // Add to history (keep last 5 analyses)
      setAnalysisHistory(prev => [analysis, ...prev.slice(0, 4)])
      
    } catch (error) {
      console.error('SEO analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [title, content, focusKeyword, category])

  // AI Auto-Optimization Function
  const handleAIOptimization = async () => {
    if (!title || !content || !focusKeyword) {
      alert('Please fill in Title, Content, and Focus Keyword before optimizing.')
      return
    }

    setIsOptimizing(true)
    setOptimizationResult(null)

    try {
      // Show progress to user
      const progressMessages = [
        'Analyzing current SEO performance...',
        'Optimizing title and meta tags...',
        'Enhancing content structure...',
        'Improving keyword density...',
        'Optimizing readability...',
        'Expanding content length...',
        'Generating SEO metadata...',
        'Finalizing optimizations...'
      ]

      for (let i = 0; i < progressMessages.length; i++) {
        // Update UI with progress (you could add a progress state here)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Perform the actual optimization
      const result = await SEOAutoOptimizer.optimizeToMaximum(
        title,
        content,
        focusKeyword,
        category,
        'professionals and businesses'
      )

      setOptimizationResult(result)
      
      // Apply optimizations to form
      if (result.success) {
        setTitle(result.optimizedContent.title)
        setContent(result.optimizedContent.content)
        setOptimizedPost({
          ...optimizedPost,
          title: result.optimizedContent.title,
          content: result.optimizedContent.content,
          excerpt: result.optimizedContent.excerpt,
          tags: result.optimizedContent.tags,
          seo: result.optimizedContent.seo
        })

        // Re-run analysis with optimized content
        setTimeout(() => {
          performSEOAnalysis()
        }, 500)

        setShowOptimizationModal(true)
      }

    } catch (error) {
      console.error('AI Optimization failed:', error)
      alert('Optimization failed. Please try again.')
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleSave = async () => {
    if (!optimizedPost || !title || !content || !focusKeyword) {
      alert('Please fill in all required fields and run SEO analysis first.')
      return
    }

    const generateId = (title: string) => {
      return title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50) + '-' + Date.now()
    }
      
    const completePost: BlogPost = {
      id: optimizedPost.id || generateId(title),
      title: optimizedPost.title || title,
      excerpt: optimizedPost.excerpt || '',
      content: optimizedPost.content || content,
      author: optimizedPost.author || 'AI Tools Expert',
      date: optimizedPost.date || new Date().toISOString().split('T')[0],
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
      await onSave(completePost)
    } catch (error) {
      console.error('Error saving draft post:', error)
    }
  }

  const handlePublish = async () => {
    if (!optimizedPost || !title || !content || !focusKeyword) {
      alert('Missing required fields! Please fill in all fields and run SEO analysis first.')
      return
    }

    if (!seoAnalysis || seoAnalysis.score < 60) {
      const confirmed = confirm(
        `Your SEO score is ${seoAnalysis?.score || 0}/100. Publishing with a low SEO score may affect your search rankings. Do you want to continue?`
      )
      if (!confirmed) return
    }

    const generateId = (title: string) => {
      return title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50) + '-' + Date.now()
    }
    
    const completePost: BlogPost = {
      id: optimizedPost.id || generateId(title),
      title: optimizedPost.title || title,
      excerpt: optimizedPost.excerpt || '',
      content: optimizedPost.content || content,
      author: optimizedPost.author || 'AI Tools Expert',
      date: optimizedPost.date || new Date().toISOString().split('T')[0],
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
      await onSave(completePost)
    } catch (error) {
      console.error('Error publishing post:', error)
    }
  }

  const getSEOScoreColor = (score: number) => {
    return RealSEOEngine.getSEOScoreColor(score)
  }

  const getSEOScoreBg = (score: number) => {
    return RealSEOEngine.getSEOScoreBg(score)
  }

  const getSEOGrade = (score: number) => {
    return RealSEOEngine.getSEOGrade(score)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Brain className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Real AI SEO Dashboard</h1>
          <Sparkles className="w-8 h-8 text-purple-600 ml-3" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Advanced SEO analysis with real scoring and actionable insights. Get genuine feedback to improve your content's search performance.
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
              <p className="text-xs text-gray-500 mt-1">
                {title.length}/100 characters (optimal: 30-60)
              </p>
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
                Choose a specific keyword you want to rank for
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
                placeholder="Write your article content here... The AI will analyze it for SEO optimization!"
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{content.split(/\s+/).filter(w => w.length > 0).length} words</span>
                <span>Recommended: 1000+ words for best SEO</span>
              </div>
            </div>

            {/* Auto-Optimize Toggle */}
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <Wand2 className="w-5 h-5 text-purple-600 mr-2" />
                <span className="font-medium text-purple-900">Real-time SEO Analysis</span>
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

            {/* AI Optimized SEO Button */}
            <div className="mt-6">
              <button
                onClick={handleAIOptimization}
                disabled={isOptimizing || !title || !content || !focusKeyword}
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    <div className="text-left">
                      <div className="font-bold text-lg">Optimizing...</div>
                      <div className="text-sm opacity-90">AI is fixing all SEO issues</div>
                    </div>
                  </>
                ) : (
                  <>
                    <Rocket className="w-6 h-6 mr-3" />
                    <div className="text-left">
                      <div className="font-bold text-lg">🚀 AI Optimized SEO</div>
                      <div className="text-sm opacity-90">Auto-fix all issues to reach 100% SEO</div>
                    </div>
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                This will automatically optimize your content to achieve maximum SEO performance
              </p>
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
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className={`text-4xl font-bold ${getSEOScoreColor(seoAnalysis.score)}`}>
                    {seoAnalysis.score}/{seoAnalysis.maxScore}
                  </div>
                  <div className={`text-2xl font-bold px-3 py-1 rounded-lg ${getSEOScoreBg(seoAnalysis.score)}`}>
                    {getSEOGrade(seoAnalysis.score)}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      seoAnalysis.score >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      seoAnalysis.score >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      seoAnalysis.score >= 40 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                      'bg-gradient-to-r from-red-500 to-red-600'
                    }`}
                    style={{ width: `${seoAnalysis.score}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {seoAnalysis.score >= 80 ? '🎉 Excellent SEO optimization!' :
                   seoAnalysis.score >= 60 ? '👍 Good SEO, room for improvement' :
                   seoAnalysis.score >= 40 ? '⚠️ Needs SEO improvements' :
                   '❌ Poor SEO, requires significant work'}
                </p>
              </div>
            </div>
          )}

          {/* SEO Breakdown */}
          {seoAnalysis && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Activity className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold">SEO Breakdown</h3>
              </div>
              <div className="space-y-3">
                {Object.entries(seoAnalysis.breakdown).map(([category, data]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      {data.issues.length > 0 && (
                        <AlertTriangle className="w-4 h-4 text-yellow-500 ml-2" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            data.score / data.max >= 0.8 ? 'bg-green-500' :
                            data.score / data.max >= 0.6 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${(data.score / data.max) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {data.score}/{data.max}
                      </span>
                    </div>
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
                <h3 className="text-xl font-semibold">SEO Issues & Recommendations</h3>
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
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        issue.type === 'critical' ? 'bg-red-100 text-red-800' :
                        issue.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        -{issue.points} points
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{issue.message}</p>
                    <p className="text-xs text-gray-500">💡 {issue.fix}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Applied Optimizations */}
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
                  {saving ? 'Publishing...' : '🚀 Publish Article'}
                </button>
                
                {seoAnalysis && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-800">
                      SEO Score: {seoAnalysis.score}/100 ({getSEOGrade(seoAnalysis.score)})
                    </p>
                    <p className="text-xs text-gray-600">
                      {seoAnalysis.score >= 80 ? 'Excellent optimization!' :
                       seoAnalysis.score >= 60 ? 'Good optimization, consider improvements' :
                       'Consider improving SEO before publishing'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analysis History */}
          {analysisHistory.length > 1 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="text-xl font-semibold">Analysis History</h3>
              </div>
              <div className="space-y-2">
                {analysisHistory.slice(0, 3).map((analysis, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">
                      Analysis #{analysisHistory.length - index}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getSEOScoreColor(analysis.score)}`}>
                        {analysis.score}/100
                      </span>
                      {index === 0 && analysis.score > (analysisHistory[1]?.score || 0) && (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      )}
                      {index === 0 && analysis.score < (analysisHistory[1]?.score || 0) && (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Optimization Results Modal */}
      {showOptimizationModal && optimizationResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle2 className="w-8 h-8 mr-3" />
                  <div>
                    <h2 className="text-2xl font-bold">🎉 AI Optimization Complete!</h2>
                    <p className="text-green-100">Your content has been optimized for maximum SEO performance</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowOptimizationModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Score Improvement */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">SEO Score Improvement</h3>
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="w-5 h-5 mr-1" />
                    <span className="font-bold">
                      +{optimizationResult.optimizedScore - optimizationResult.originalScore} points
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {optimizationResult.originalScore}/100
                    </div>
                    <div className="text-sm text-gray-600">Before Optimization</div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                      <div 
                        className="bg-red-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${optimizationResult.originalScore}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {optimizationResult.optimizedScore}/100
                    </div>
                    <div className="text-sm text-gray-600">After Optimization</div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                      <div 
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${optimizationResult.optimizedScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Applied Improvements */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                  Applied Improvements ({optimizationResult.improvements.length})
                </h3>
                <div className="space-y-3">
                  {optimizationResult.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{improvement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Changes */}
              {optimizationResult.changes.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Activity className="w-5 h-5 text-blue-500 mr-2" />
                    Detailed Changes
                  </h3>
                  <div className="space-y-4">
                    {optimizationResult.changes.map((change, index) => (
                      <div key={index} className="border-l-4 border-blue-400 pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">{change.category}</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            +{change.impact} points
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="mb-1">
                            <span className="font-medium">Before:</span> {change.before}
                          </div>
                          <div>
                            <span className="font-medium">After:</span> {change.after}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 text-purple-500 mr-2" />
                  What Happens Next?
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start">
                    <Star className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Your content has been automatically updated with all optimizations</span>
                  </div>
                  <div className="flex items-start">
                    <Globe className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>SEO metadata has been generated for better search engine visibility</span>
                  </div>
                  <div className="flex items-start">
                    <TrendingUp className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Your content is now optimized for Google's latest ranking factors</span>
                  </div>
                  <div className="flex items-start">
                    <Rocket className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Ready to publish and start ranking higher in search results!</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowOptimizationModal(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Continue Editing
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowOptimizationModal(false)
                      handleSave()
                    }}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Save as Draft
                  </button>
                  <button
                    onClick={() => {
                      setShowOptimizationModal(false)
                      handlePublish()
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                  >
                    🚀 Publish Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}