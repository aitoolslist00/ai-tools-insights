'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { BlogPost, blogCategories } from '@/lib/blog-data'
import { EnhancedSEOEngine, EnhancedSEOAnalysis } from '@/lib/enhanced-seo-engine'
import { EnhancedSEOAutoOptimizer, EnhancedSEOOptimizationResult } from '@/lib/enhanced-seo-auto-optimizer'
import { getAuthToken } from '@/lib/auth-enhanced'
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
  X,
  Upload,
  Camera,
  ImageIcon,
  Trash2,
  Download,
  Maximize2
} from 'lucide-react'

interface EnhancedAISeoDashboardProps {
  onSave: (post: BlogPost) => void
  saving?: boolean
  editingPost?: BlogPost | null
}

interface ImageUploadResult {
  success: boolean
  imageUrl?: string
  apiUrl?: string
  filename?: string
  size?: number
  type?: string
  error?: string
}

interface SEOImageOptimization {
  altText: string
  title: string
  caption: string
  filename: string
  seoScore: number
}

export default function EnhancedAISeoDashboard({ onSave, saving = false, editingPost = null }: EnhancedAISeoDashboardProps) {
  // Form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [focusKeyword, setFocusKeyword] = useState('')
  const [category, setCategory] = useState('ai-tools')
  const [image, setImage] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [imageUploadMode, setImageUploadMode] = useState<'url' | 'upload'>('url')
  
  // SEO Analysis state
  const [seoAnalysis, setSeoAnalysis] = useState<EnhancedSEOAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [autoOptimizeEnabled, setAutoOptimizeEnabled] = useState(true)
  const [optimizedPost, setOptimizedPost] = useState<Partial<BlogPost> | null>(null)
  const [analysisHistory, setAnalysisHistory] = useState<EnhancedSEOAnalysis[]>([])
  
  // AI Optimization state
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationResult, setOptimizationResult] = useState<EnhancedSEOOptimizationResult | null>(null)
  const [showOptimizationModal, setShowOptimizationModal] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)
  const [optimizationStep, setOptimizationStep] = useState('')

  // Image upload state
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [imageOptimization, setImageOptimization] = useState<SEOImageOptimization | null>(null)
  const [showImagePreview, setShowImagePreview] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize form with editing post data
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title || '')
      setContent(editingPost.content || '')
      setFocusKeyword(editingPost.seo?.focusKeyword || '')
      setCategory(editingPost.category || 'ai-tools')
      setImage(editingPost.image || '')
      setImagePreview(editingPost.image || '')
      if (editingPost.image) {
        setImageUploadMode('url')
      }
    }
  }, [editingPost])

  // Real-time SEO analysis with debouncing
  useEffect(() => {
    if (title && content && focusKeyword && autoOptimizeEnabled) {
      const timeoutId = setTimeout(() => {
        performSEOAnalysis()
      }, 1000)
      
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
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const analysis = EnhancedSEOEngine.analyzeContent(
        title,
        content,
        focusKeyword,
        category,
        image
      )
      
      setSeoAnalysis(analysis)
      setOptimizedPost(analysis.optimizedData)
      
      setAnalysisHistory(prev => [analysis, ...prev.slice(0, 4)])
      
    } catch (error) {
      console.error('SEO analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [title, content, focusKeyword, category])

  // Enhanced AI Auto-Optimization Function with progress tracking
  const handleAIOptimization = async () => {
    if (!title || !content || !focusKeyword) {
      alert('Please fill in Title, Content, and Focus Keyword before optimizing.')
      return
    }

    setIsOptimizing(true)
    setOptimizationResult(null)
    setOptimizationProgress(0)

    try {
      const progressSteps = [
        { step: 'Analyzing current SEO performance...', progress: 10 },
        { step: 'Optimizing title and meta tags...', progress: 20 },
        { step: 'Enhancing content structure...', progress: 35 },
        { step: 'Improving keyword density...', progress: 50 },
        { step: 'Optimizing readability...', progress: 65 },
        { step: 'Expanding content length...', progress: 80 },
        { step: 'Generating SEO metadata...', progress: 90 },
        { step: 'Finalizing optimizations...', progress: 100 }
      ]

      for (const { step, progress } of progressSteps) {
        setOptimizationStep(step)
        setOptimizationProgress(progress)
        await new Promise(resolve => setTimeout(resolve, 1200))
      }

      const result = await EnhancedSEOAutoOptimizer.optimizeToMaximum(
        title,
        content,
        focusKeyword,
        category,
        'professionals and businesses',
        image
      )

      setOptimizationResult(result)
      
      if (result.success) {
        setTitle(result.optimizedContent.title)
        setContent(result.optimizedContent.content)
        setOptimizedPost({
          ...optimizedPost,
          title: result.optimizedContent.title,
          content: result.optimizedContent.content,
          excerpt: result.optimizedContent.excerpt,
          tags: result.optimizedContent.tags,
          seo: {
            ...result.optimizedContent.seo,
            keywords: result.optimizedContent.seo.keywords.join(', ')
          }
        })

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
      setOptimizationProgress(0)
      setOptimizationStep('')
    }
  }

  // Image upload functionality
  const handleImageUpload = async (file: File) => {
    if (!file) return

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload JPG, PNG, GIF, or WEBP images only.')
      return
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 5MB.')
      return
    }

    setIsUploadingImage(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      // Get auth token
      const token = getAuthToken()
      if (!token) {
        alert('Authentication required. Please log in again.')
        setIsUploadingImage(false)
        return
      }

      console.log('Uploading file:', file.name, file.size, file.type)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      console.log('Upload response status:', response.status)
      console.log('Upload response ok:', response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Upload failed with status:', response.status, errorText)
        alert(`Upload failed: ${response.status} - ${errorText}`)
        return
      }

      const result: ImageUploadResult = await response.json()
      console.log('Upload result:', result)

      if (result.success && result.imageUrl) {
        console.log('Setting image URL:', result.imageUrl)
        console.log('API URL fallback:', result.apiUrl)
        
        // Test if the image URL is accessible
        const testImg = document.createElement('img')
        testImg.onload = () => {
          console.log('Image loaded successfully in dashboard:', result.imageUrl)
          if (result.imageUrl) {
            setImage(result.imageUrl)
            setImagePreview(result.imageUrl)
            setImageFile(file)
          }
          
          // Generate SEO optimization for the image
          const seoOptimization = generateImageSEOOptimization(file.name, focusKeyword, title)
          setImageOptimization(seoOptimization)
          
          alert('Image uploaded successfully!')
        }
        testImg.onerror = (error) => {
          console.error('Failed to load static image, trying API URL:', result.imageUrl, error)
          
          // Try API URL as fallback
          if (result.apiUrl) {
            const fallbackImg = document.createElement('img')
            fallbackImg.onload = () => {
              console.log('Image loaded successfully via API:', result.apiUrl)
              if (result.apiUrl) {
                setImage(result.apiUrl)
                setImagePreview(result.apiUrl)
                setImageFile(file)
              }
              
              // Generate SEO optimization for the image
              const seoOptimization = generateImageSEOOptimization(file.name, focusKeyword, title)
              setImageOptimization(seoOptimization)
              
              alert('Image uploaded successfully!')
            }
            fallbackImg.onerror = (fallbackError) => {
              console.error('Failed to load image via API as well:', result.apiUrl, fallbackError)
              alert('Image uploaded but failed to display. Please refresh the page.')
            }
            fallbackImg.src = result.apiUrl
          } else {
            alert('Image uploaded but failed to display. Please refresh the page.')
          }
        }
        testImg.src = result.imageUrl
        
      } else {
        console.error('Upload result error:', result.error)
        alert(result.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsUploadingImage(false)
    }
  }

  // Generate SEO optimization for uploaded images
  const generateImageSEOOptimization = (filename: string, keyword: string, articleTitle: string): SEOImageOptimization => {
    const cleanFilename = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
    const seoFilename = `${keyword.replace(/\s+/g, '-').toLowerCase()}-${cleanFilename}`
    
    return {
      altText: `${keyword} - ${articleTitle.substring(0, 100)}`,
      title: `${keyword}: ${articleTitle}`,
      caption: `Professional illustration showcasing ${keyword} for enhanced user experience`,
      filename: seoFilename,
      seoScore: 95
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      handleImageUpload(file)
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
      id: editingPost?.id || optimizedPost.id || generateId(title),
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
      seo: {
        ...optimizedPost.seo,
        focusKeyword,
        keywords: Array.isArray(optimizedPost.seo?.keywords) 
          ? optimizedPost.seo.keywords.join(', ')
          : optimizedPost.seo?.keywords,
        imageOptimization: imageOptimization || undefined
      },
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

    if (!seoAnalysis || seoAnalysis.score < 80) {
      const confirmed = confirm(
        `Your SEO score is ${seoAnalysis?.score || 0}/100. For optimal performance, we recommend achieving 80+ score. Do you want to continue publishing?`
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
      id: editingPost?.id || optimizedPost.id || generateId(title),
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
      seo: {
        ...optimizedPost.seo,
        focusKeyword,
        keywords: Array.isArray(optimizedPost.seo?.keywords) 
          ? optimizedPost.seo.keywords.join(', ')
          : optimizedPost.seo?.keywords,
        imageOptimization: imageOptimization || undefined
      },
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
    return EnhancedSEOEngine.getSEOScoreColor(score)
  }

  const getSEOScoreBg = (score: number) => {
    return EnhancedSEOEngine.getSEOScoreBg(score)
  }

  const getSEOGrade = (score: number) => {
    return EnhancedSEOEngine.getSEOGrade(score)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Brain className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Enhanced AI SEO Dashboard</h1>
          <Sparkles className="w-8 h-8 text-purple-600 ml-3" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Advanced SEO analysis with image optimization and real-time scoring. Achieve 100% SEO performance with AI-powered content optimization.
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

            {/* Enhanced Image Upload Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ImageIcon className="w-4 h-4 inline mr-1" />
                Featured Image
              </label>
              
              {/* Upload Mode Toggle */}
              <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setImageUploadMode('url')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    imageUploadMode === 'url'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Link className="w-4 h-4 inline mr-2" />
                  Image URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageUploadMode('upload')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    imageUploadMode === 'upload'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload from PC
                </button>
              </div>

              {imageUploadMode === 'url' ? (
                <input
                  type="url"
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value)
                    setImagePreview(e.target.value)
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploadingImage ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-purple-600 mr-2" />
                      <span className="text-gray-600">Uploading and optimizing...</span>
                    </div>
                  ) : (
                    <div>
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG, GIF, WEBP up to 5MB
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4 relative">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowImagePreview(true)}
                      className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImage('')
                        setImagePreview('')
                        setImageFile(null)
                        setImageOptimization(null)
                      }}
                      className="absolute top-2 left-2 p-1 bg-red-500 bg-opacity-80 text-white rounded-full hover:bg-opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* SEO Image Optimization Info */}
                  {imageOptimization && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">
                          Image SEO Optimized ({imageOptimization.seoScore}/100)
                        </span>
                      </div>
                      <div className="text-xs text-green-700 space-y-1">
                        <p><strong>Alt Text:</strong> {imageOptimization.altText}</p>
                        <p><strong>SEO Filename:</strong> {imageOptimization.filename}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                <span>{content.split(' ').filter(word => word.length > 0).length} words</span>
                <span>Recommended: 1500+ words for better SEO</span>
              </div>
            </div>

            {/* Auto-optimize toggle */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auto-optimize"
                  checked={autoOptimizeEnabled}
                  onChange={(e) => setAutoOptimizeEnabled(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="auto-optimize" className="ml-2 text-sm text-gray-700">
                  Real-time SEO analysis
                </label>
              </div>
              {isAnalyzing && <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />}
            </div>

            {/* Enhanced AI Optimized SEO Button */}
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
                      <div className="font-bold text-lg">Optimizing... {optimizationProgress}%</div>
                      <div className="text-sm opacity-90">{optimizationStep}</div>
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
                    {seoAnalysis.score}
                  </div>
                  <div className="text-gray-400">/</div>
                  <div className="text-2xl text-gray-600">100</div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSEOScoreBg(seoAnalysis.score)}`}>
                    {getSEOGrade(seoAnalysis.score)}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      seoAnalysis.score >= 90 ? 'bg-green-500' :
                      seoAnalysis.score >= 70 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${seoAnalysis.score}%` }}
                  ></div>
                </div>

                <p className="text-sm text-gray-600">
                  {seoAnalysis.score >= 90 ? 'Excellent! Your content is highly optimized.' :
                   seoAnalysis.score >= 70 ? 'Good! A few improvements will boost your ranking.' :
                   'Needs improvement. Use AI optimization to reach 100%.'}
                </p>
              </div>
            </div>
          )}

          {/* Detailed Analysis */}
          {seoAnalysis && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Activity className="w-5 h-5 text-blue-600 mr-2" />
                Detailed Analysis
              </h3>
              
              <div className="space-y-4">
                {seoAnalysis.details.map((detail, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    {detail.status === 'good' ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : detail.status === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{detail.category}</p>
                      <p className="text-xs text-gray-600">{detail.message}</p>
                      {detail.suggestion && (
                        <p className="text-xs text-blue-600 mt-1">💡 {detail.suggestion}</p>
                      )}
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      detail.status === 'good' ? 'bg-green-100 text-green-800' :
                      detail.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {detail.score}/10
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Save className="w-5 h-5 text-green-600 mr-2" />
              Publish Options
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save as Draft
              </button>
              
              <button
                onClick={handlePublish}
                disabled={saving}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Publish Now
              </button>
            </div>
            
            {seoAnalysis && seoAnalysis.score < 80 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <Lightbulb className="w-4 h-4 inline mr-1" />
                  Tip: Use "🚀 AI Optimized SEO" to automatically improve your score to 90+
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Optimization Results Modal */}
      {showOptimizationModal && optimizationResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">🎉 Optimization Complete!</h3>
                <button
                  onClick={() => setShowOptimizationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-8 p-4 bg-green-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{optimizationResult.originalScore}</div>
                    <div className="text-sm text-gray-600">Before</div>
                  </div>
                  <ArrowUp className="w-8 h-8 text-green-600" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{optimizationResult.optimizedScore}</div>
                    <div className="text-sm text-gray-600">After</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Improvements Made:</h4>
                  <ul className="space-y-1">
                    {optimizationResult.improvements.map((improvement, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button
                  onClick={() => setShowOptimizationModal(false)}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Continue Editing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && imagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={imagePreview}
              alt="Full size preview"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setShowImagePreview(false)}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}