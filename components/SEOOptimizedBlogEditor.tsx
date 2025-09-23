'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  Save, 
  X, 
  Eye, 
  Search, 
  Target, 
  Image as ImageIcon, 
  Link, 
  BarChart3, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  TrendingUp,
  Globe,
  Hash,
  FileText,
  Zap,
  Star,
  Users,
  Clock,
  BookOpen,
  Lightbulb,
  Award
} from 'lucide-react'
import { BlogPost, generateSlug, blogCategories } from '@/lib/blog-data'

interface SEOAnalysis {
  score: number
  issues: SEOIssue[]
  suggestions: string[]
  keywordDensity: { [key: string]: number }
  readabilityScore: number
  wordCount: number
  readingTime: string
}

interface SEOIssue {
  type: 'critical' | 'warning' | 'suggestion'
  category: string
  message: string
  points: number
}

interface SEOOptimizedBlogEditorProps {
  post?: BlogPost
  onSave: (post: BlogPost) => void
  onCancel: () => void
  saving?: boolean
}

export default function SEOOptimizedBlogEditor({ 
  post, 
  onSave, 
  onCancel, 
  saving = false 
}: SEOOptimizedBlogEditorProps) {
  // Form state
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    id: post?.id || '',
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    author: post?.author || 'Admin',
    date: post?.date || new Date().toISOString(),
    readTime: post?.readTime || '5 min read',
    category: post?.category || 'ai-tools',
    featured: post?.featured || false,
    published: post?.published || false,
    image: post?.image || '',
    href: post?.href || '',
    tags: post?.tags || [],
    seo: {
      metaTitle: post?.seo?.metaTitle || '',
      metaDescription: post?.seo?.metaDescription || '',
      keywords: post?.seo?.keywords || '',
      focusKeyword: post?.seo?.focusKeyword || '',
      canonicalUrl: post?.seo?.canonicalUrl || '',
      ogTitle: post?.seo?.ogTitle || '',
      ogDescription: post?.seo?.ogDescription || '',
      ogImage: post?.seo?.ogImage || '',
      twitterTitle: post?.seo?.twitterTitle || '',
      twitterDescription: post?.seo?.twitterDescription || '',
      twitterImage: post?.seo?.twitterImage || '',
    },
    analytics: post?.analytics || { views: 0, shares: 0, likes: 0 },
    status: post?.status || 'draft'
  })

  // SEO state
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'social' | 'advanced'>('content')
  const [focusKeyword, setFocusKeyword] = useState(post?.seo?.focusKeyword || '')
  const [tagInput, setTagInput] = useState('')

  // Calculate SEO analysis
  const seoAnalysis = useMemo((): SEOAnalysis => {
    const issues: SEOIssue[] = []
    let score = 100
    const suggestions: string[] = []

    // Title analysis
    if (!formData.title || formData.title.length < 30) {
      issues.push({
        type: 'critical',
        category: 'Title',
        message: 'Title is too short. Aim for 30-60 characters.',
        points: 15
      })
      score -= 15
    } else if (formData.title.length > 60) {
      issues.push({
        type: 'warning',
        category: 'Title',
        message: 'Title is too long. Keep it under 60 characters.',
        points: 10
      })
      score -= 10
    }

    // Meta title analysis
    if (!formData.seo?.metaTitle) {
      issues.push({
        type: 'critical',
        category: 'Meta Title',
        message: 'Meta title is missing. This is crucial for SEO.',
        points: 20
      })
      score -= 20
    } else if (formData.seo.metaTitle.length > 60) {
      issues.push({
        type: 'warning',
        category: 'Meta Title',
        message: 'Meta title is too long. Keep it under 60 characters.',
        points: 5
      })
      score -= 5
    }

    // Meta description analysis
    if (!formData.seo?.metaDescription) {
      issues.push({
        type: 'critical',
        category: 'Meta Description',
        message: 'Meta description is missing. This affects click-through rates.',
        points: 15
      })
      score -= 15
    } else if (formData.seo.metaDescription.length < 120 || formData.seo.metaDescription.length > 160) {
      issues.push({
        type: 'warning',
        category: 'Meta Description',
        message: 'Meta description should be 120-160 characters.',
        points: 5
      })
      score -= 5
    }

    // Focus keyword analysis
    if (!focusKeyword) {
      issues.push({
        type: 'critical',
        category: 'Focus Keyword',
        message: 'Focus keyword is missing. Set a target keyword for this post.',
        points: 15
      })
      score -= 15
    }

    // Content length analysis
    const wordCount = formData.content ? formData.content.split(/\s+/).length : 0
    if (wordCount < 300) {
      issues.push({
        type: 'critical',
        category: 'Content Length',
        message: 'Content is too short. Aim for at least 300 words.',
        points: 10
      })
      score -= 10
    } else if (wordCount < 1000) {
      issues.push({
        type: 'suggestion',
        category: 'Content Length',
        message: 'Consider adding more content. 1000+ words tend to rank better.',
        points: 5
      })
      score -= 5
    }

    // Keyword density analysis
    const keywordDensity: { [key: string]: number } = {}
    if (focusKeyword && formData.content) {
      const content = formData.content.toLowerCase()
      const keyword = focusKeyword.toLowerCase()
      const keywordCount = (content.match(new RegExp(keyword, 'g')) || []).length
      const density = (keywordCount / wordCount) * 100
      keywordDensity[focusKeyword] = density

      if (density < 0.5) {
        issues.push({
          type: 'warning',
          category: 'Keyword Density',
          message: 'Focus keyword density is too low. Aim for 0.5-2.5%.',
          points: 8
        })
        score -= 8
      } else if (density > 3) {
        issues.push({
          type: 'warning',
          category: 'Keyword Density',
          message: 'Focus keyword density is too high. Avoid keyword stuffing.',
          points: 10
        })
        score -= 10
      }
    }

    // Image optimization
    if (!formData.image) {
      issues.push({
        type: 'warning',
        category: 'Featured Image',
        message: 'Featured image is missing. Images improve engagement.',
        points: 5
      })
      score -= 5
    }

    // Tags analysis
    if (!formData.tags || formData.tags.length === 0) {
      issues.push({
        type: 'suggestion',
        category: 'Tags',
        message: 'Add relevant tags to improve discoverability.',
        points: 3
      })
      score -= 3
    } else if (formData.tags.length > 10) {
      issues.push({
        type: 'warning',
        category: 'Tags',
        message: 'Too many tags. Keep it under 10 for better focus.',
        points: 2
      })
      score -= 2
    }

    // Social media optimization
    if (!formData.seo?.ogTitle || !formData.seo?.ogDescription) {
      issues.push({
        type: 'suggestion',
        category: 'Social Media',
        message: 'Add Open Graph tags for better social media sharing.',
        points: 5
      })
      score -= 5
    }

    // Readability calculation (simplified Flesch-Kincaid)
    const readabilityScore = calculateReadabilityScore(formData.content || '')

    // Reading time calculation
    const readingTime = `${Math.ceil(wordCount / 200)} min read`

    // Generate suggestions
    if (score < 70) {
      suggestions.push('Focus on fixing critical SEO issues first')
      suggestions.push('Optimize your meta title and description')
      suggestions.push('Add more relevant content with your focus keyword')
    }
    if (wordCount < 1000) {
      suggestions.push('Consider expanding your content for better rankings')
    }
    if (!formData.tags || formData.tags.length < 3) {
      suggestions.push('Add 3-5 relevant tags to improve categorization')
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      issues,
      suggestions,
      keywordDensity,
      readabilityScore,
      wordCount,
      readingTime
    }
  }, [formData, focusKeyword])

  // Calculate readability score (simplified)
  function calculateReadabilityScore(content: string): number {
    if (!content) return 0
    
    const sentences = content.split(/[.!?]+/).length - 1
    const words = content.split(/\s+/).length
    const syllables = content.split(/[aeiouAEIOU]/).length - 1
    
    if (sentences === 0 || words === 0) return 0
    
    const avgWordsPerSentence = words / sentences
    const avgSyllablesPerWord = syllables / words
    
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
    return Math.max(0, Math.min(100, score))
  }

  // Update form data
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Update SEO data
  const updateSEOData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value
      }
    }))
  }

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      updateFormData('tags', [...(formData.tags || []), tagInput.trim()])
      setTagInput('')
    }
  }

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    updateFormData('tags', formData.tags?.filter(tag => tag !== tagToRemove) || [])
  }

  // Auto-generate slug
  useEffect(() => {
    if (formData.title && !post?.id) {
      const slug = generateSlug(formData.title)
      updateFormData('id', slug)
      updateFormData('href', `/blog/${slug}`)
    }
  }, [formData.title, post?.id])

  // Auto-generate meta title and description
  useEffect(() => {
    if (formData.title && !formData.seo?.metaTitle) {
      updateSEOData('metaTitle', formData.title)
    }
    if (formData.excerpt && !formData.seo?.metaDescription) {
      updateSEOData('metaDescription', formData.excerpt)
    }
  }, [formData.title, formData.excerpt])

  // Update reading time
  useEffect(() => {
    updateFormData('readTime', seoAnalysis.readingTime)
  }, [seoAnalysis.readingTime])

  // Handle save
  const handleSave = () => {
    const completePost: BlogPost = {
      id: formData.id || generateSlug(formData.title || ''),
      title: formData.title || '',
      excerpt: formData.excerpt || '',
      content: formData.content || '',
      author: formData.author || 'Admin',
      date: formData.date || new Date().toISOString(),
      readTime: seoAnalysis.readingTime,
      category: formData.category || 'ai-tools',
      featured: formData.featured || false,
      published: formData.published || false,
      image: formData.image || '',
      href: formData.href || `/blog/${formData.id}`,
      tags: formData.tags || [],
      seo: {
        metaTitle: formData.seo?.metaTitle || formData.title || '',
        metaDescription: formData.seo?.metaDescription || formData.excerpt || '',
        keywords: formData.seo?.keywords || '',
        focusKeyword: focusKeyword,
        canonicalUrl: formData.seo?.canonicalUrl || '',
        ogTitle: formData.seo?.ogTitle || formData.title || '',
        ogDescription: formData.seo?.ogDescription || formData.excerpt || '',
        ogImage: formData.seo?.ogImage || formData.image || '',
        twitterTitle: formData.seo?.twitterTitle || formData.title || '',
        twitterDescription: formData.seo?.twitterDescription || formData.excerpt || '',
        twitterImage: formData.seo?.twitterImage || formData.image || '',
      },
      analytics: formData.analytics || { views: 0, shares: 0, likes: 0 },
      status: formData.status || 'draft'
    }

    onSave(completePost)
  }

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  // Get score label
  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Good'
    if (score >= 60) return 'Average'
    if (score >= 40) return 'Poor'
    return 'Critical'
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {post ? 'Edit Post' : 'Create New Post'}
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {seoAnalysis.wordCount} words • {seoAnalysis.readingTime}
                </span>
              </div>
            </div>
            
            {/* SEO Score Badge */}
            <div className="flex items-center space-x-4">
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(seoAnalysis.score)}`}>
                <Award className="h-4 w-4 mr-1" />
                SEO: {seoAnalysis.score}/100 ({getScoreLabel(seoAnalysis.score)})
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={onCancel}
                  disabled={saving}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="h-4 w-4 mr-2 inline" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {saving ? (
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {saving ? 'Saving...' : 'Save Post'}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 mt-4">
            {[
              { id: 'content', label: 'Content', icon: FileText },
              { id: 'seo', label: 'SEO & Meta', icon: Search },
              { id: 'social', label: 'Social Media', icon: Globe },
              { id: 'advanced', label: 'Advanced', icon: Zap }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Title *
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="Enter your post title..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
                />
                <div className="mt-1 text-xs text-gray-500">
                  {formData.title?.length || 0}/60 characters
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt *
                </label>
                <textarea
                  value={formData.excerpt || ''}
                  onChange={(e) => updateFormData('excerpt', e.target.value)}
                  placeholder="Brief description of your post..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <div className="mt-1 text-xs text-gray-500">
                  {formData.excerpt?.length || 0}/300 characters
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => updateFormData('content', e.target.value)}
                  placeholder="Write your post content here..."
                  rows={20}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                />
                <div className="mt-1 text-xs text-gray-500">
                  {seoAnalysis.wordCount} words • Readability: {Math.round(seoAnalysis.readabilityScore)}/100
                </div>
              </div>

              {/* Category and Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => updateFormData('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {blogCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author || ''}
                    onChange={(e) => updateFormData('author', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-primary-500 hover:text-primary-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Settings */}
              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured || false}
                    onChange={(e) => updateFormData('featured', e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Featured Post</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.published || false}
                    onChange={(e) => updateFormData('published', e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Published</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              {/* Focus Keyword */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Focus Keyword *
                </label>
                <input
                  type="text"
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  placeholder="e.g., AI application development"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {focusKeyword && seoAnalysis.keywordDensity[focusKeyword] && (
                  <div className="mt-1 text-xs text-gray-500">
                    Keyword density: {seoAnalysis.keywordDensity[focusKeyword].toFixed(1)}% 
                    (Target: 0.5-2.5%)
                  </div>
                )}
              </div>

              {/* Meta Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title *
                </label>
                <input
                  type="text"
                  value={formData.seo?.metaTitle || ''}
                  onChange={(e) => updateSEOData('metaTitle', e.target.value)}
                  placeholder="SEO optimized title for search engines"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <div className="mt-1 text-xs text-gray-500">
                  {formData.seo?.metaTitle?.length || 0}/60 characters
                </div>
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description *
                </label>
                <textarea
                  value={formData.seo?.metaDescription || ''}
                  onChange={(e) => updateSEOData('metaDescription', e.target.value)}
                  placeholder="Compelling description that appears in search results"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <div className="mt-1 text-xs text-gray-500">
                  {formData.seo?.metaDescription?.length || 0}/160 characters
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Keywords
                </label>
                <input
                  type="text"
                  value={formData.seo?.keywords || ''}
                  onChange={(e) => updateSEOData('keywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={formData.image || ''}
                  onChange={(e) => updateFormData('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Canonical URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={formData.seo?.canonicalUrl || ''}
                  onChange={(e) => updateSEOData('canonicalUrl', e.target.value)}
                  placeholder="https://yoursite.com/blog/post-slug"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              {/* Open Graph */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Open Graph (Facebook)</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OG Title
                    </label>
                    <input
                      type="text"
                      value={formData.seo?.ogTitle || ''}
                      onChange={(e) => updateSEOData('ogTitle', e.target.value)}
                      placeholder="Title for social media sharing"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OG Description
                    </label>
                    <textarea
                      value={formData.seo?.ogDescription || ''}
                      onChange={(e) => updateSEOData('ogDescription', e.target.value)}
                      placeholder="Description for social media sharing"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OG Image
                    </label>
                    <input
                      type="url"
                      value={formData.seo?.ogImage || ''}
                      onChange={(e) => updateSEOData('ogImage', e.target.value)}
                      placeholder="https://example.com/social-image.jpg"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Twitter Cards */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Twitter Cards</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter Title
                    </label>
                    <input
                      type="text"
                      value={formData.seo?.twitterTitle || ''}
                      onChange={(e) => updateSEOData('twitterTitle', e.target.value)}
                      placeholder="Title for Twitter sharing"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter Description
                    </label>
                    <textarea
                      value={formData.seo?.twitterDescription || ''}
                      onChange={(e) => updateSEOData('twitterDescription', e.target.value)}
                      placeholder="Description for Twitter sharing"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter Image
                    </label>
                    <input
                      type="url"
                      value={formData.seo?.twitterImage || ''}
                      onChange={(e) => updateSEOData('twitterImage', e.target.value)}
                      placeholder="https://example.com/twitter-image.jpg"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              {/* Publishing Options */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Publishing Options</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status || 'draft'}
                      onChange={(e) => updateFormData('status', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publish Date
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.date ? new Date(formData.date).toISOString().slice(0, 16) : ''}
                      onChange={(e) => updateFormData('date', new Date(e.target.value).toISOString())}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Analytics Preview */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics Preview</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formData.analytics?.views || 0}
                    </div>
                    <div className="text-sm text-gray-500">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formData.analytics?.likes || 0}
                    </div>
                    <div className="text-sm text-gray-500">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formData.analytics?.shares || 0}
                    </div>
                    <div className="text-sm text-gray-500">Shares</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEO Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-6">
          {/* SEO Score */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">SEO Analysis</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(seoAnalysis.score)}`}>
                {seoAnalysis.score}/100
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  seoAnalysis.score >= 80 ? 'bg-green-500' :
                  seoAnalysis.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${seoAnalysis.score}%` }}
              />
            </div>
          </div>

          {/* Issues */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Issues & Suggestions</h4>
            <div className="space-y-2">
              {seoAnalysis.issues.map((issue, index) => (
                <div
                  key={index}
                  className={`flex items-start p-3 rounded-lg text-sm ${
                    issue.type === 'critical' ? 'bg-red-50 text-red-700' :
                    issue.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-blue-50 text-blue-700'
                  }`}
                >
                  <div className="mr-2 mt-0.5">
                    {issue.type === 'critical' ? (
                      <XCircle className="h-4 w-4" />
                    ) : issue.type === 'warning' ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      <Lightbulb className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{issue.category}</div>
                    <div className="text-xs mt-1">{issue.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Stats */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Content Statistics</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Word Count</span>
                <span className="font-medium">{seoAnalysis.wordCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Reading Time</span>
                <span className="font-medium">{seoAnalysis.readingTime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Readability</span>
                <span className="font-medium">{Math.round(seoAnalysis.readabilityScore)}/100</span>
              </div>
            </div>
          </div>

          {/* Keyword Density */}
          {Object.keys(seoAnalysis.keywordDensity).length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Keyword Density</h4>
              <div className="space-y-2">
                {Object.entries(seoAnalysis.keywordDensity).map(([keyword, density]) => (
                  <div key={keyword} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate">{keyword}</span>
                    <span className={`font-medium ${
                      density >= 0.5 && density <= 2.5 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {density.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {seoAnalysis.suggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Recommendations</h4>
              <div className="space-y-2">
                {seoAnalysis.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start p-2 bg-blue-50 rounded-lg text-sm text-blue-700">
                    <TrendingUp className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}