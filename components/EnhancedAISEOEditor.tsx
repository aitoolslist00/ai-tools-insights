'use client'

import { useState, useEffect } from 'react'
import { 
  Sparkles, 
  Search, 
  FileText, 
  Globe, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Eye,
  EyeOff,
  Copy,
  Download,
  Upload,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  Settings,
  RefreshCw,
  Wand2,
  Brain,
  Rocket,
  Clock
} from 'lucide-react'
import { getAuthToken } from '@/lib/auth-enhanced'

interface SEOAnalysis {
  score: number
  issues: string[]
  opportunities: string[]
  keywords: {
    primary: string[]
    secondary: string[]
    lsi: string[]
  }
  readability: {
    score: number
    level: string
    suggestions: string[]
  }
  technical: {
    metaTags: boolean
    structuredData: boolean
    performance: number
    mobile: boolean
  }
}

interface SchemaData {
  article: object
  faq: object
  breadcrumb: object
  organization: object
  howTo: object
}

interface GeneratedContent {
  title: string
  content: string
  metaDescription: string
  keywords: string[]
  slug: string
  excerpt: string
  readingTime: number
  wordCount: number
}

interface WorkflowStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  result?: any
}

// Blog categories
const BLOG_CATEGORIES = [
  { value: 'ai-tools', label: 'AI Tools' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'comparisons', label: 'Comparisons' },
  { value: 'tutorials', label: 'Tutorials' },
  { value: 'industry-news', label: 'Industry News' },
  { value: 'development', label: 'Development' }
]

export default function EnhancedAISEOEditor() {
  // Core state
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('ai-tools')
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  
  // Generated content state
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysis | null>(null)
  const [schemaData, setSchemaData] = useState<SchemaData | null>(null)
  const [publishResult, setPublishResult] = useState<any>(null)
  
  // UI state
  const [activeTab, setActiveTab] = useState('generate')
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState('')
  
  // Workflow steps
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    {
      id: 'generate',
      title: 'AI Content Generation with Current Events',
      description: 'Creating ultra-current, SEO-optimized content using Gemini 2.5 Flash with real-time news integration',
      status: 'pending',
      progress: 0
    },
    {
      id: 'analyze',
      title: 'Advanced SEO Analysis & Optimization',
      description: 'Comprehensive SEO analysis using latest Google algorithm factors and Core Web Vitals',
      status: 'pending',
      progress: 0
    },
    {
      id: 'google-bot',
      title: 'Google Bot Readability Optimization (95%+)',
      description: 'Optimizing content specifically for Google\'s natural language processing algorithms',
      status: 'pending',
      progress: 0
    },
    {
      id: 'regenerate',
      title: 'AI Content Regeneration with News Integration',
      description: 'Regenerating content using Google Bot insights and latest news for maximum relevance',
      status: 'pending',
      progress: 0
    },
    {
      id: 'table-generation',
      title: 'AI Summary & Comparison Table Generation',
      description: 'Creating intelligent summary and comparison tables using Gemini AI and inserting them into article content',
      status: 'pending',
      progress: 0
    },
    {
      id: 'schema',
      title: 'Comprehensive Schema Generation',
      description: 'Generating advanced JSON-LD structured data for maximum search visibility',
      status: 'pending',
      progress: 0
    },
    {
      id: 'images',
      title: 'AI Image Generation with SEO Optimization',
      description: 'Generating professional, SEO-optimized images with proper alt text and metadata',
      status: 'pending',
      progress: 0
    },
    {
      id: 'publish',
      title: 'Smart Publishing with Immediate Indexing',
      description: 'Publishing optimized content with immediate search engine submission and social signals',
      status: 'pending',
      progress: 0
    }
  ])

  // Auto-save API key to localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
  }, [])

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('gemini-api-key', apiKey)
    }
  }, [apiKey])

  // Enhanced validation functions
  const validateKeyword = (keyword: string): { isValid: boolean; message?: string } => {
    if (!keyword.trim()) return { isValid: false, message: 'Keyword cannot be empty' }
    if (keyword.trim().length < 2) return { isValid: false, message: 'Keyword must be at least 2 characters' }
    if (keyword.trim().split(' ').length > 10) return { isValid: false, message: 'Keyword should not exceed 10 words' }
    return { isValid: true }
  }

  const validateApiKey = (apiKey: string): { isValid: boolean; message?: string } => {
    if (!apiKey.trim()) return { isValid: false, message: 'API key is required' }
    if (!apiKey.startsWith('AIza')) return { isValid: false, message: 'Invalid Gemini API key format' }
    if (apiKey.length < 30) return { isValid: false, message: 'API key appears to be incomplete' }
    return { isValid: true }
  }

  const updateStepStatus = (stepId: string, status: WorkflowStep['status'], progress: number = 0, result?: any) => {
    setWorkflowSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, progress, result }
        : step
    ))
  }

  const logStepProgress = (stepId: string, message: string, data?: any) => {
    console.log(`🔄 Step ${stepId}: ${message}`, data ? data : '')
  }

  const runCompleteWorkflow = async () => {
    // Enhanced validation
    const keywordValidation = validateKeyword(keyword)
    if (!keywordValidation.isValid) {
      setError(keywordValidation.message || 'Invalid keyword')
      return
    }

    const apiKeyValidation = validateApiKey(apiKey)
    if (!apiKeyValidation.isValid) {
      setError(apiKeyValidation.message || 'Invalid API key')
      return
    }

    setIsProcessing(true)
    setError('')
    setCurrentStep(0)
    
    // Reset all steps
    setWorkflowSteps(prev => prev.map(step => ({ ...step, status: 'pending', progress: 0 })))

    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('Authentication required. Please refresh and log in again.')
      }

      // Step 1: Generate Content
      setCurrentStep(1)
      logStepProgress('generate', 'Starting AI content generation with current events integration')
      updateStepStatus('generate', 'processing', 10)
      
      const contentResponse = await fetch('/api/blog/enhanced-seo-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          keyword: keyword.trim(),
          category: category,
          apiKey: apiKey.trim(),
          workflow: 'complete'
        })
      })

      if (!contentResponse.ok) {
        const errorData = await contentResponse.json()
        throw new Error(errorData.error || 'Failed to generate content')
      }

      updateStepStatus('generate', 'processing', 75)
      const contentData = await contentResponse.json()
      setGeneratedContent(contentData.content)
      logStepProgress('generate', 'Content generation completed successfully', { wordCount: contentData.content.wordCount })
      updateStepStatus('generate', 'completed', 100, contentData.content)

      // Step 2: SEO Analysis
      setCurrentStep(2)
      logStepProgress('analyze', 'Starting advanced SEO analysis and optimization')
      updateStepStatus('analyze', 'processing', 15)
      
      const seoResponse = await fetch('/api/seo-optimizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: contentData.content.title,
          description: contentData.content.metaDescription,
          content: contentData.content.content,
          keywords: contentData.content.keywords,
          url: `https://www.aitoolsinsights.com/blog/${contentData.content.slug}`
        })
      })

      updateStepStatus('analyze', 'processing', 75)
      const seoData = await seoResponse.json()
      setSeoAnalysis(seoData.analysis)
      logStepProgress('analyze', 'SEO analysis completed', { score: seoData.analysis.score })
      updateStepStatus('analyze', 'completed', 100, seoData.analysis)

      // Step 3: Google Bot Optimization (NEW - 95%+ Target)
      setCurrentStep(3)
      logStepProgress('google-bot', 'Starting Google Bot readability optimization (95%+ target)')
      updateStepStatus('google-bot', 'processing', 10)
      
      console.log('🤖 Starting Google Bot Readability Analysis & Optimization...')
      
      const googleBotResponse = await fetch('/api/google-bot-optimizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'analyze-and-optimize',
          title: contentData.content.title,
          content: contentData.content.content,
          primaryKeyword: keyword.trim(),
          metaDescription: contentData.content.metaDescription,
          slug: contentData.content.slug,
          targetScore: 95
        })
      })

      if (!googleBotResponse.ok) {
        console.error('Google Bot optimization failed, continuing with original content')
        updateStepStatus('google-bot', 'completed', 100, { 
          warning: 'Optimization skipped',
          score: 0 
        })
      } else {
        const googleBotData = await googleBotResponse.json()
        
        if (googleBotData.alreadyOptimized) {
          console.log(`✅ Content already optimized: ${googleBotData.analysis.understandingScore}%`)
          updateStepStatus('google-bot', 'completed', 100, {
            score: googleBotData.analysis.understandingScore,
            alreadyOptimized: true
          })
        } else if (googleBotData.result) {
          console.log(`✅ Optimization complete: ${googleBotData.result.originalScore}% → ${googleBotData.result.optimizedScore}%`)
          
          // Update content with optimized version
          contentData.content.title = googleBotData.result.optimizedContent.title
          contentData.content.content = googleBotData.result.optimizedContent.content
          contentData.content.metaDescription = googleBotData.result.optimizedContent.metaDescription
          contentData.content.slug = googleBotData.result.optimizedContent.slug
          contentData.content.excerpt = googleBotData.result.optimizedContent.excerpt
          
          setGeneratedContent(contentData.content)
          
          updateStepStatus('google-bot', 'completed', 100, {
            originalScore: googleBotData.result.originalScore,
            optimizedScore: googleBotData.result.optimizedScore,
            improvements: googleBotData.result.improvements,
            analysis: googleBotData.result.analysisComparison.after
          })
        }
      }

      // Step 4: AI Content Regeneration Based on Google Bot Findings (NEW STEP)
      setCurrentStep(4)
      updateStepStatus('regenerate', 'processing', 25)
      
      console.log('🔄 Starting AI Content Regeneration based on Google Bot findings...')
      
      // Get the Google Bot analysis data
      const googleBotAnalysis = workflowSteps.find(step => step.id === 'google-bot')?.result
      
      try {
        const regenerateResponse = await fetch('/api/blog/content-regeneration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            originalContent: {
              title: contentData.content.title,
              content: contentData.content.content,
              metaDescription: contentData.content.metaDescription,
              excerpt: contentData.content.excerpt,
              slug: contentData.content.slug,
              keywords: contentData.content.keywords
            },
            primaryKeyword: keyword.trim(),
            googleBotAnalysis: googleBotAnalysis,
            category: category,
            apiKey: apiKey.trim(),
            targetReadabilityScore: 95
          })
        })

        if (regenerateResponse.ok) {
          const regenerateData = await regenerateResponse.json()
          
          if (regenerateData.success && regenerateData.regeneratedContent) {
            console.log(`✅ Content regenerated successfully for Google Bot clarity`)
            
            // Update content with regenerated version
            contentData.content = {
              ...contentData.content,
              ...regenerateData.regeneratedContent
            }
            
            setGeneratedContent(contentData.content)
            
            updateStepStatus('regenerate', 'completed', 100, {
              success: true,
              improvements: regenerateData.improvements,
              readabilityScore: regenerateData.readabilityScore,
              regeneratedContent: regenerateData.regeneratedContent
            })
          } else {
            console.log('⚠️ Content regeneration completed with warnings, continuing with original content')
            updateStepStatus('regenerate', 'completed', 100, {
              warning: 'Regeneration skipped',
              reason: regenerateData.reason
            })
          }
        } else {
          console.error('Content regeneration failed, continuing with original content')
          updateStepStatus('regenerate', 'completed', 100, {
            warning: 'Regeneration failed',
            error: 'API error'
          })
        }
      } catch (regenerateError) {
        console.error('Content regeneration error:', regenerateError)
        updateStepStatus('regenerate', 'completed', 100, {
          warning: 'Regeneration failed',
          error: regenerateError instanceof Error ? regenerateError.message : 'Unknown error'
        })
      }

      // Step 5: AI Summary & Comparison Table Generation
      setCurrentStep(5)
      updateStepStatus('table-generation', 'processing', 10)
      
      console.log('📊 Starting AI Summary & Comparison Table Generation...')
      
      try {
        const tableResponse = await fetch('/api/blog/generate-tables', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: contentData.content.title,
            content: contentData.content.content,
            keywords: contentData.content.keywords,
            primaryKeyword: keyword.trim(),
            category: category,
            apiKey: apiKey.trim()
          })
        })

        if (tableResponse.ok) {
          const tableData = await tableResponse.json()
          
          if (tableData.success && tableData.enhancedContent) {
            console.log('✅ Tables generated and inserted successfully')
            
            // Update content with enhanced version that includes tables
            contentData.content.content = tableData.enhancedContent
            setGeneratedContent(contentData.content)
            
            updateStepStatus('table-generation', 'completed', 100, {
              success: true,
              tablesGenerated: tableData.tablesGenerated,
              insertionPoints: tableData.insertionPoints,
              enhancedContent: tableData.enhancedContent
            })
          } else {
            console.log('⚠️ Table generation completed with warnings')
            updateStepStatus('table-generation', 'completed', 100, {
              warning: 'Table generation skipped',
              reason: tableData.reason || 'No suitable content for tables'
            })
          }
        } else {
          console.error('Table generation failed, continuing without tables')
          updateStepStatus('table-generation', 'completed', 100, {
            warning: 'Table generation failed',
            error: 'API error'
          })
        }
      } catch (tableError) {
        console.error('Table generation error:', tableError)
        updateStepStatus('table-generation', 'completed', 100, {
          warning: 'Table generation failed',
          error: tableError instanceof Error ? tableError.message : 'Unknown error'
        })
      }

      // Step 6: Schema Generation
      setCurrentStep(6)
      updateStepStatus('schema', 'processing', 25)
      
      const schemaResponse = await fetch('/api/schema-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: contentData.content,
          seoAnalysis: seoData.analysis,
          url: `https://www.aitoolsinsights.com/blog/${contentData.content.slug}`
        })
      })

      const schemaDataResult = await schemaResponse.json()
      setSchemaData(schemaDataResult.schemas)
      updateStepStatus('schema', 'completed', 100, schemaDataResult.schemas)

      // Step 7: AI Image Generation
      setCurrentStep(7)
      updateStepStatus('images', 'processing', 25)
      
      // Generate image prompts from content
      const imagePrompts = [
        `Professional tech illustration for "${contentData.content.title}" featuring ${contentData.content.keywords.slice(0, 3).join(', ')}, modern digital design, clean and minimalist style`,
        `Conceptual illustration showing ${contentData.content.keywords[0]} technology, abstract tech elements, blue and purple gradient background`,
        `Visual representation of ${contentData.content.excerpt.slice(0, 100)}, modern tech aesthetic, professional design`
      ]

      const imageResponse = await fetch('/api/generate-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompts: imagePrompts,
          articleTitle: contentData.content.title,
          keywords: contentData.content.keywords,
          style: 'tech'
        })
      })

      let generatedImages = []
      console.log('Image generation response status:', imageResponse.status)
      if (imageResponse.ok) {
        const imageData = await imageResponse.json()
        console.log('Image generation response data:', imageData)
        generatedImages = imageData.images || []
        updateStepStatus('images', 'completed', 100, { images: generatedImages, count: generatedImages.length })
      } else {
        const errorText = await imageResponse.text()
        console.error('Image generation failed:', imageResponse.status, errorText)
        updateStepStatus('images', 'completed', 100, { images: [], count: 0, warning: 'Image generation failed' })
      }

      // Step 8: Smart Publishing
      setCurrentStep(8)
      updateStepStatus('publish', 'processing', 25)
      
      // Extract Google Bot optimization data from workflow steps
      const googleBotStep = workflowSteps.find(step => step.id === 'google-bot')
      const googleBotData = googleBotStep?.result || null
      
      const publishResponse = await fetch('/api/blog/smart-publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: contentData.content,
          seoData: seoData.analysis,
          schemas: schemaDataResult.schemas,
          images: generatedImages,
          googleBotOptimization: googleBotData,
          category: category,
          autoPublish: true
        })
      })

      const publishData = await publishResponse.json()
      setPublishResult(publishData)
      updateStepStatus('publish', 'completed', 100, publishData)

      setActiveTab('results')

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      
      // Mark current step as error
      const stepIds = ['generate', 'analyze', 'google-bot', 'regenerate', 'table-generation', 'schema', 'images', 'publish']
      if (currentStep > 0 && currentStep <= stepIds.length) {
        updateStepStatus(stepIds[currentStep - 1], 'error', 0)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(type)
      setTimeout(() => setCopySuccess(''), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadFile = (content: string, filename: string, type: string = 'text/plain') => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStepIcon = (step: WorkflowStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'processing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <Brain className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI SEO Editor Pro</h1>
            <p className="text-purple-100">Complete automated SEO content workflow</p>
          </div>
        </div>

        {/* Workflow Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {workflowSteps.map((step, index) => (
            <div key={step.id} className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                {getStepIcon(step)}
                <span className="text-sm font-medium">{step.title}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${step.progress}%` }}
                />
              </div>
              <p className="text-xs text-purple-100 mt-1">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'generate', label: 'Generate', icon: Wand2 },
            { id: 'results', label: 'Results', icon: BarChart3 },
            { id: 'schema', label: 'Schema', icon: Settings },
            { id: 'publish', label: 'Publish', icon: Rocket }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div className="space-y-6">
            {/* Input Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Target className="h-4 w-4 inline mr-1" />
                  Target Keyword
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., best AI tools for content creation 2024"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BarChart3 className="h-4 w-4 inline mr-1" />
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  {BLOG_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Zap className="h-4 w-4 inline mr-1" />
                  Gemini 2.5 Flash API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showApiKey ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Get your API key from{' '}
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Advanced SEO Features Notice */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-green-800 mb-3">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">Advanced SEO Features (2024/2025)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="text-green-700">
                  <strong>🚀 Current Content:</strong> Real-time news integration, latest trends, up-to-date statistics
                </div>
                <div className="text-blue-700">
                  <strong>🤖 Google Bot Optimization:</strong> 95%+ keyword understanding, NLP algorithm compliance
                </div>
                <div className="text-purple-700">
                  <strong>⚡ Instant Indexing:</strong> Search Console submission, sitemap pings, RSS updates
                </div>
                <div className="text-orange-700">
                  <strong>🎯 E-A-T Signals:</strong> Expertise markers, authority building, trustworthiness indicators
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center">
              <button
                onClick={runCompleteWorkflow}
                disabled={isProcessing || !keyword.trim() || !category.trim() || !apiKey.trim()}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing Step {currentStep} of 5...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate Current Content with AI
                  </>
                )}
              </button>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {[
                {
                  icon: Brain,
                  title: 'Latest AI Content Generation',
                  description: 'Gemini 2.5 Flash creates current, up-to-date articles'
                },
                {
                  icon: TrendingUp,
                  title: 'SEO Optimization',
                  description: 'Real-time Google algorithm compliance'
                },
                {
                  icon: Settings,
                  title: 'Schema Generation',
                  description: 'Comprehensive JSON-LD structured data'
                },
                {
                  icon: Rocket,
                  title: 'Smart Publishing',
                  description: 'Automated publishing with optimization'
                }
              ].map((feature, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <feature.icon className="h-8 w-8 text-purple-600 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && generatedContent && (
          <div className="space-y-6">
            {/* Content Overview */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Word Count</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{generatedContent.wordCount}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">SEO Score</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{seoAnalysis?.score || 0}/100</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-900">Reading Time</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">{generatedContent.readingTime} min</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-orange-900">Keywords</span>
                </div>
                <p className="text-2xl font-bold text-orange-600">{generatedContent.keywords.length}</p>
              </div>
            </div>

            {/* Generated Content */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Generated Article</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(generatedContent.content, 'content')}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      copySuccess === 'content'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Copy className="h-4 w-4" />
                    {copySuccess === 'content' ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={() => downloadFile(generatedContent.content, `${generatedContent.slug}.md`, 'text/markdown')}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  <h1 className="text-xl font-bold mb-4">{generatedContent.title}</h1>
                  <div className="whitespace-pre-wrap text-sm text-gray-800">
                    {generatedContent.content}
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Analysis */}
            {seoAnalysis && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Opportunities</h4>
                    <ul className="space-y-1">
                      {seoAnalysis.opportunities.map((opportunity, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          {opportunity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Issues to Fix</h4>
                    <ul className="space-y-1">
                      {seoAnalysis.issues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-red-700">
                          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Schema Tab */}
        {activeTab === 'schema' && schemaData && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Generated Schema Markup</h3>
              <p className="text-gray-600">Comprehensive JSON-LD structured data for maximum SEO impact</p>
            </div>

            {Object.entries(schemaData).map(([type, schema]) => (
              <div key={type} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-semibold text-gray-900 capitalize">{type} Schema</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(schema, null, 2), type)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        copySuccess === type
                          ? 'bg-green-100 text-green-700'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Copy className="h-4 w-4" />
                      {copySuccess === type ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={() => downloadFile(JSON.stringify(schema, null, 2), `${type}-schema.json`, 'application/json')}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 max-h-64 overflow-y-auto">
                  <pre className="text-xs text-gray-800 font-mono">
                    {JSON.stringify(schema, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Publish Tab */}
        {activeTab === 'publish' && publishResult && (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Successfully Published!</h3>
              <p className="text-gray-600">Your SEO-optimized article has been published to your blog</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 mb-4">Publication Details</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Article URL:</strong> <a href={publishResult.url} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:text-green-800">{publishResult.url}</a></p>
                <p><strong>Published:</strong> {new Date(publishResult.publishedAt).toLocaleString()}</p>
                <p><strong>Status:</strong> <span className="text-green-700 font-medium">Live</span></p>
                <p><strong>SEO Score:</strong> <span className="text-green-700 font-medium">{publishResult.seoScore}/100</span></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-900 mb-2">Next Steps</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Monitor search rankings for target keywords</li>
                  <li>• Share on social media platforms</li>
                  <li>• Build internal links from related articles</li>
                  <li>• Track performance in Google Analytics</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h5 className="font-medium text-purple-900 mb-2">SEO Features Applied</h5>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Comprehensive schema markup</li>
                  <li>• Optimized meta tags and descriptions</li>
                  <li>• Semantic keyword optimization</li>
                  <li>• Mobile-friendly responsive design</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}