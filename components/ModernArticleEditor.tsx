'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Save, 
  Eye, 
  EyeOff, 
  X, 
  Upload, 
  Image as ImageIcon,
  Link,
  Bold,
  Italic,
  Code,
  List,
  Quote,
  Heading,
  Type,
  Palette,
  Sparkles,
  Wand2,
  FileText,
  Settings,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Zap,
  TrendingUp,
  Target,
  Search
} from 'lucide-react'
import { BlogPost, BlogCategory, blogCategories } from '@/lib/blog-data'
import { getImageUrlError, optimizeImageUrl } from '@/lib/utils'
import EnhancedArticleContent from './EnhancedArticleContent'

interface ModernArticleEditorProps {
  post?: BlogPost | null
  onSave: (post: Partial<BlogPost>) => Promise<void>
  onCancel: () => void
  saving?: boolean
}

interface SEOAnalysis {
  score: number
  issues: string[]
  suggestions: string[]
  keywords: string[]
  readability: number
}

export default function ModernArticleEditor({ 
  post, 
  onSave, 
  onCancel, 
  saving = false 
}: ModernArticleEditorProps) {
  // Form state
  const [title, setTitle] = useState(post?.title || '')
  const [content, setContent] = useState(post?.content || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [author, setAuthor] = useState(post?.author || 'AI Tools Expert')
  const [category, setCategory] = useState(post?.category || 'ai-tools')
  const [tags, setTags] = useState<string[]>(post?.tags || [])
  const [image, setImage] = useState(post?.image || '')
  const [featured, setFeatured] = useState(post?.featured || false)
  const [published, setPublished] = useState(post?.published || false)

  // SEO state
  const [seoTitle, setSeoTitle] = useState(post?.seo?.metaTitle || '')
  const [seoDescription, setSeoDescription] = useState(post?.seo?.metaDescription || '')
  const [seoKeywords, setSeoKeywords] = useState(post?.seo?.keywords || '')
  const [focusKeyword, setFocusKeyword] = useState(post?.seo?.focusKeyword || '')

  // UI state
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'preview'>('content')
  const [showPreview, setShowPreview] = useState(false)
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysis | null>(null)
  const [wordCount, setWordCount] = useState(0)
  const [readTime, setReadTime] = useState('1 min read')
  const [newTag, setNewTag] = useState('')
  const [showMarkdownHelp, setShowMarkdownHelp] = useState(false)
  
  // Image upload state
  const [imageInputType, setImageInputType] = useState<'url' | 'upload'>('url')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [previewBlob, setPreviewBlob] = useState<string | null>(null)

  const contentRef = useRef<HTMLTextAreaElement>(null)

  // Calculate word count and reading time
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0).length
    setWordCount(words)
    const minutes = Math.max(1, Math.ceil(words / 200))
    setReadTime(`${minutes} min read`)
  }, [content])

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (previewBlob) {
        URL.revokeObjectURL(previewBlob)
      }
    }
  }, [previewBlob])

  // Auto-generate excerpt from content
  useEffect(() => {
    if (!excerpt && content) {
      const plainText = content
        .replace(/#{1,6}\s+/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .trim()
      
      const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0)
      const excerptText = sentences.slice(0, 2).join('. ').trim()
      if (excerptText && excerptText.length > 50) {
        setExcerpt(excerptText.substring(0, 160) + (excerptText.length > 160 ? '...' : ''))
      }
    }
  }, [content, excerpt])

  // Auto-generate SEO fields
  useEffect(() => {
    if (!seoTitle && title) {
      setSeoTitle(title)
    }
    if (!seoDescription && excerpt) {
      setSeoDescription(excerpt)
    }
  }, [title, excerpt, seoTitle, seoDescription])

  // SEO Analysis
  useEffect(() => {
    if (title && content) {
      analyzeSEO()
    }
  }, [title, content, focusKeyword])

  const analyzeSEO = () => {
    const issues: string[] = []
    const suggestions: string[] = []
    let score = 100

    // Title analysis
    if (title.length < 30) {
      issues.push('Title is too short (recommended: 30-60 characters)')
      score -= 10
    } else if (title.length > 60) {
      issues.push('Title is too long (recommended: 30-60 characters)')
      score -= 5
    }

    // Content analysis
    if (content.length < 300) {
      issues.push('Content is too short (recommended: 300+ words)')
      score -= 15
    }

    // Focus keyword analysis
    if (focusKeyword) {
      const titleHasKeyword = title.toLowerCase().includes(focusKeyword.toLowerCase())
      const contentHasKeyword = content.toLowerCase().includes(focusKeyword.toLowerCase())
      
      if (!titleHasKeyword) {
        issues.push('Focus keyword not found in title')
        score -= 10
      }
      if (!contentHasKeyword) {
        issues.push('Focus keyword not found in content')
        score -= 10
      }
    } else {
      suggestions.push('Add a focus keyword for better SEO')
      score -= 5
    }

    // Meta description analysis
    if (!seoDescription) {
      issues.push('Meta description is missing')
      score -= 10
    } else if (seoDescription.length < 120) {
      suggestions.push('Meta description could be longer (120-160 characters)')
      score -= 5
    } else if (seoDescription.length > 160) {
      issues.push('Meta description is too long (recommended: 120-160 characters)')
      score -= 5
    }

    // Headers analysis
    const hasH2 = content.includes('## ')
    if (!hasH2) {
      suggestions.push('Add H2 headers to improve content structure')
      score -= 5
    }

    // Extract keywords from content
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
    
    const wordFreq: { [key: string]: number } = {}
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    })
    
    const keywords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word)

    // Readability score (simplified)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const avgWordsPerSentence = words.length / sentences.length
    const readability = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence - 15) * 2))

    setSeoAnalysis({
      score: Math.max(0, score),
      issues,
      suggestions,
      keywords,
      readability
    })
  }

  const uploadFile = async (file: File) => {
    // Reset states
    setUploadError('')
    setUploadProgress(0)

    // Validate file
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setUploadError('File size must be less than 5MB')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please select a valid image file (JPG, PNG, GIF, WEBP)')
      return
    }

    // Create blob URL for immediate preview
    const blobUrl = URL.createObjectURL(file)
    setPreviewBlob(blobUrl)

    try {
      // Create FormData
      const formData = new FormData()
      formData.append('file', file)

      // Start upload with progress tracking
      setUploadProgress(10)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      setUploadProgress(90)
      
      const result = await response.json()
      console.log('Upload result:', result)
      
      if (result.success) {
        // Complete upload
        setUploadProgress(100)
        
        // Set the image URL - use relative path for local development
        // The API returns something like "/uploads/filename.jpg"
        console.log('Setting image URL to:', result.imageUrl)
        setImage(result.imageUrl)
        
        // Reset progress after a short delay
        setTimeout(() => {
          setUploadProgress(0)
        }, 1000)
      } else {
        throw new Error(result.error || 'Upload failed')
      }

    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image. Please try again.')
      setUploadProgress(0)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    await uploadFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      // Call upload function directly with the file
      uploadFile(file)
    }
  }

  const handleSave = async () => {
    const postData: Partial<BlogPost> = {
      id: post?.id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title,
      content,
      excerpt,
      author,
      category,
      tags,
      image,
      featured,
      published,
      readTime,
      seo: {
        metaTitle: seoTitle || title,
        metaDescription: seoDescription || excerpt,
        keywords: seoKeywords,
        focusKeyword,
        canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post?.id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        ogTitle: seoTitle || title,
        ogDescription: seoDescription || excerpt,
        ogImage: image,
        twitterTitle: seoTitle || title,
        twitterDescription: seoDescription || excerpt,
        twitterImage: image
      }
    }

    await onSave(postData)
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const insertMarkdown = (syntax: string, placeholder: string = '') => {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const replacement = selectedText || placeholder

    let newText = ''
    switch (syntax) {
      case 'bold':
        newText = `**${replacement}**`
        break
      case 'italic':
        newText = `*${replacement}*`
        break
      case 'code':
        newText = `\`${replacement}\``
        break
      case 'link':
        newText = `[${replacement || 'Link text'}](https://example.com)`
        break
      case 'image':
        newText = `![${replacement || 'Alt text'}](https://example.com/image.jpg)`
        break
      case 'quote':
        newText = `> ${replacement || 'Quote text'}`
        break
      case 'list':
        newText = `- ${replacement || 'List item'}`
        break
      case 'h2':
        newText = `## ${replacement || 'Heading'}`
        break
      case 'h3':
        newText = `### ${replacement || 'Subheading'}`
        break
      default:
        return
    }

    const newContent = content.substring(0, start) + newText + content.substring(end)
    setContent(newContent)

    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + newText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const markdownTemplates = [
    {
      name: 'Article Structure',
      template: `# ${title || 'Your Article Title'}

## Introduction

Write your engaging introduction here. This should hook the reader and explain what they'll learn.

## Main Section 1

### Subsection 1.1

Your content here with **bold text** and *italic text*.

- Bullet point 1
- Bullet point 2
- Bullet point 3

### Subsection 1.2

> This is a quote or important note

\`\`\`javascript
// Code example
console.log('Hello World');
\`\`\`

## Main Section 2

More content with [links](https://example.com) and images:

![Alt text](https://example.com/image.jpg)

## Conclusion

Wrap up your article with key takeaways and next steps.`
    },
    {
      name: 'Tool Review Template',
      template: `# ${title || 'Tool Name'}: Complete Review and Guide

## What is ${title || 'Tool Name'}?

Brief introduction to the tool and its primary purpose.

## Key Features

### Feature 1
Description of the feature and its benefits.

### Feature 2
Description of the feature and its benefits.

### Feature 3
Description of the feature and its benefits.

## Pricing

| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | Basic features |
| Pro | $29/month | Advanced features |
| Enterprise | Custom | All features |

## Pros and Cons

### Advantages
- Pro 1
- Pro 2
- Pro 3

### Disadvantages
- Con 1
- Con 2

## Who Should Use This Tool?

Target audience and use cases.

## Final Verdict

Overall assessment and recommendation.`
    }
  ]

  const applyTemplate = (template: string) => {
    setContent(template)
    setShowMarkdownHelp(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {post ? 'Edit Article' : 'Create New Article'}
            </h2>
            <p className="text-gray-600 mt-1">
              Create stunning, SEO-optimized articles with modern presentation
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              {wordCount} words • {readTime}
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {[
            { id: 'content', label: 'Content', icon: FileText },
            { id: 'seo', label: 'SEO', icon: TrendingUp },
            { id: 'preview', label: 'Preview', icon: Eye }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'content' && (
            <div className="h-full flex">
              {/* Editor */}
              <div className="flex-1 flex flex-col">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => insertMarkdown('bold', 'Bold text')}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Bold"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => insertMarkdown('italic', 'Italic text')}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Italic"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => insertMarkdown('code', 'code')}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Inline Code"
                      >
                        <Code className="w-4 h-4" />
                      </button>
                      <div className="w-px h-6 bg-gray-300" />
                      <button
                        onClick={() => insertMarkdown('h2', 'Heading')}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Heading 2"
                      >
                        <Heading className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => insertMarkdown('list', 'List item')}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="List"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => insertMarkdown('quote', 'Quote text')}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Quote"
                      >
                        <Quote className="w-4 h-4" />
                      </button>
                      <div className="w-px h-6 bg-gray-300" />
                      <button
                        onClick={() => insertMarkdown('link', 'Link text')}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Link"
                      >
                        <Link className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => insertMarkdown('image', 'Alt text')}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Image"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => setShowMarkdownHelp(!showMarkdownHelp)}
                      className="flex items-center px-3 py-2 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Templates
                    </button>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter article title..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        {blogCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Content Editor */}
                <div className="flex-1 p-4">
                  <textarea
                    ref={contentRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-full resize-none border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm leading-relaxed"
                    placeholder="Start writing your article in Markdown...

# Your Article Title

## Introduction
Write your engaging introduction here...

## Main Content
Add your main content with **bold text**, *italic text*, and [links](https://example.com).

- Use bullet points
- For better readability
- And structure

> Add quotes for important information

```javascript
// Add code examples
console.log('Hello World');
```

## Conclusion
Wrap up with key takeaways..."
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto">
                <div className="p-4 space-y-6">
                  {/* Publishing Options */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Publishing</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={published}
                          onChange={(e) => setPublished(e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Published</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={featured}
                          onChange={(e) => setFeatured(e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Featured</span>
                      </label>
                    </div>
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Featured Image
                    </label>
                    
                    {/* Image Input Options */}
                    <div className="space-y-4">
                      {/* Tab Selection */}
                      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => {
                            setImageInputType('url')
                            if (previewBlob) {
                              URL.revokeObjectURL(previewBlob)
                              setPreviewBlob(null)
                            }
                          }}
                          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            imageInputType === 'url'
                              ? 'bg-white text-primary-600 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Link className="h-4 w-4 inline mr-2" />
                          URL
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setImageInputType('upload')
                            if (previewBlob) {
                              URL.revokeObjectURL(previewBlob)
                              setPreviewBlob(null)
                            }
                          }}
                          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            imageInputType === 'upload'
                              ? 'bg-white text-primary-600 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Upload className="h-4 w-4 inline mr-2" />
                          Upload
                        </button>
                      </div>

                      {/* URL Input */}
                      {imageInputType === 'url' && (
                        <div>
                          <input
                            type="url"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="https://example.com/image.jpg"
                          />
                          {image && getImageUrlError(image) && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {getImageUrlError(image)}
                            </p>
                          )}
                        </div>
                      )}

                      {/* File Upload */}
                      {imageInputType === 'upload' && (
                        <div>
                          <div className="flex items-center justify-center w-full">
                            <label 
                              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                isDragOver 
                                  ? 'border-primary-500 bg-primary-50' 
                                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                              }`}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className={`w-8 h-8 mb-2 ${isDragOver ? 'text-primary-500' : 'text-gray-400'}`} />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP (MAX. 5MB)</p>
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                              />
                            </label>
                          </div>
                          {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="mt-2">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          {uploadError && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {uploadError}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Image Preview */}
                    {image && (
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm text-gray-600">Preview:</p>
                          <button
                            type="button"
                            onClick={() => {
                              setImage('')
                              if (previewBlob) {
                                URL.revokeObjectURL(previewBlob)
                                setPreviewBlob(null)
                              }
                            }}
                            className="text-sm text-red-600 hover:text-red-800 flex items-center"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </button>
                        </div>
                        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={previewBlob || image}
                            alt="Featured image preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              const currentSrc = previewBlob || image;
                              console.error('Failed to load image:', currentSrc);
                              console.error('Image type:', previewBlob ? 'blob' : 'url');
                              target.style.display = 'none';
                              const errorDiv = target.nextElementSibling as HTMLElement;
                              if (errorDiv) errorDiv.style.display = 'flex';
                            }}
                            onLoad={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'block';
                              const errorDiv = target.nextElementSibling as HTMLElement;
                              if (errorDiv) errorDiv.style.display = 'none';
                            }}
                          />
                          <div 
                            className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-600 text-sm"
                            style={{ display: 'none' }}
                          >
                            <div className="text-center">
                              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                              <p>Failed to load image</p>
                              <p className="text-xs">
                                {previewBlob ? 'Blob preview failed' : `URL: ${image}`}
                              </p>
                              <p className="text-xs mt-1">
                                {previewBlob ? 'Try uploading again' : 'Check URL or try uploading instead'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-primary-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Add tag..."
                      />
                      <button
                        onClick={addTag}
                        className="px-3 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Brief description of the article..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* SEO Score */}
                {seoAnalysis && (
                  <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">SEO Analysis</h3>
                      <div className="flex items-center">
                        <div className={`text-2xl font-bold ${
                          seoAnalysis.score >= 80 ? 'text-green-600' : 
                          seoAnalysis.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {seoAnalysis.score}/100
                        </div>
                      </div>
                    </div>
                    
                    {seoAnalysis.issues.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-red-800 mb-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Issues to Fix
                        </h4>
                        <ul className="space-y-1">
                          {seoAnalysis.issues.map((issue, index) => (
                            <li key={index} className="text-sm text-red-700 flex items-start">
                              <span className="w-1 h-1 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {seoAnalysis.suggestions.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Suggestions
                        </h4>
                        <ul className="space-y-1">
                          {seoAnalysis.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-sm text-yellow-700 flex items-start">
                              <span className="w-1 h-1 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <div className="text-sm text-gray-600">Readability Score</div>
                        <div className={`text-lg font-semibold ${
                          seoAnalysis.readability >= 70 ? 'text-green-600' : 
                          seoAnalysis.readability >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {Math.round(seoAnalysis.readability)}/100
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Top Keywords</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {seoAnalysis.keywords.slice(0, 3).map((keyword, index) => (
                            <span key={index} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SEO Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Focus Keyword
                    </label>
                    <input
                      type="text"
                      value={focusKeyword}
                      onChange={(e) => setFocusKeyword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Main keyword to optimize for..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Keywords
                    </label>
                    <input
                      type="text"
                      value={seoKeywords}
                      onChange={(e) => setSeoKeywords(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="keyword1, keyword2, keyword3..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title ({seoTitle.length}/60)
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="SEO optimized title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description ({seoDescription.length}/160)
                  </label>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Compelling meta description for search results..."
                  />
                </div>

                {/* Search Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Preview</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                      {seoTitle || title || 'Your Article Title'}
                    </div>
                    <div className="text-green-700 text-sm mt-1">
                      {process.env.NEXT_PUBLIC_SITE_URL}/blog/{title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                    </div>
                    <div className="text-gray-600 text-sm mt-2">
                      {seoDescription || excerpt || 'Your article description will appear here...'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="h-full overflow-y-auto bg-gray-50">
              <div className="max-w-4xl mx-auto py-8">
                <EnhancedArticleContent
                  content={content}
                  title={title}
                  readTime={readTime}
                  author={author}
                  tags={tags}
                  category={category}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Auto-saved</span>
            <span>•</span>
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{readTime}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !title.trim() || !content.trim()}
              className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Article
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Markdown Help Modal */}
      {showMarkdownHelp && (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Article Templates</h3>
              <button
                onClick={() => setShowMarkdownHelp(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {markdownTemplates.map((template, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
                    <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded overflow-x-auto mb-4 max-h-40">
                      {template.template.substring(0, 300)}...
                    </pre>
                    <button
                      onClick={() => applyTemplate(template.template)}
                      className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Use Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}