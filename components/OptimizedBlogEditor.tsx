'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Save, 
  X, 
  Eye, 
  FileText, 
  Image, 
  Tag, 
  Calendar, 
  User, 
  Clock,
  Star,
  StarOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  Globe,
  Hash,
  Type,
  AlignLeft,
  Bold,
  Italic,
  List,
  Link,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react'
import { BlogPost, blogCategories } from '@/lib/blog-data'

interface OptimizedBlogEditorProps {
  post?: BlogPost
  onSave: (post: BlogPost) => void
  onCancel: () => void
  saving?: boolean
}

export default function OptimizedBlogEditor({ post, onSave, onCancel, saving = false }: OptimizedBlogEditorProps) {
  // Form state
  const [title, setTitle] = useState(post?.title || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [content, setContent] = useState(post?.content || '')
  const [author, setAuthor] = useState(post?.author || 'AI Tools Expert')
  const [category, setCategory] = useState(post?.category || 'ai-tools')
  const [image, setImage] = useState(post?.image || '')
  const [tags, setTags] = useState<string[]>(post?.tags || [])
  const [featured, setFeatured] = useState(post?.featured || false)
  const [published, setPublished] = useState(post?.published || false)
  const [readTime, setReadTime] = useState(post?.readTime || '5 min read')

  // UI state
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [wordCount, setWordCount] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)

  // Calculate word and character counts
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0).length
    setWordCount(words)
    setCharacterCount(content.length)
    
    // Auto-calculate read time (average 200 words per minute)
    const minutes = Math.max(1, Math.round(words / 200))
    setReadTime(`${minutes} min read`)
  }, [content])

  // Auto-generate excerpt from content
  useEffect(() => {
    if (!excerpt && content) {
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
      if (sentences.length > 0) {
        let autoExcerpt = sentences.slice(0, 2).join('. ').trim()
        if (autoExcerpt.length > 200) {
          autoExcerpt = autoExcerpt.substring(0, 197) + '...'
        }
        setExcerpt(autoExcerpt)
      }
    }
  }, [content, excerpt])

  // Validation
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required'
    } else if (title.length < 10) {
      newErrors.title = 'Title should be at least 10 characters'
    } else if (title.length > 100) {
      newErrors.title = 'Title should be less than 100 characters'
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required'
    } else if (content.length < 100) {
      newErrors.content = 'Content should be at least 100 characters'
    }

    if (!excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required'
    } else if (excerpt.length < 50) {
      newErrors.excerpt = 'Excerpt should be at least 50 characters'
    } else if (excerpt.length > 300) {
      newErrors.excerpt = 'Excerpt should be less than 300 characters'
    }

    if (tags.length === 0) {
      newErrors.tags = 'At least one tag is required'
    } else if (tags.length > 10) {
      newErrors.tags = 'Maximum 10 tags allowed'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [title, content, excerpt, tags])

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50)
  }

  // Handle tag input
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    const slug = generateSlug(title)
    const now = new Date().toISOString()

    const blogPost: BlogPost = {
      id: post?.id || slug,
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      author: author.trim(),
      date: post?.date || now.split('T')[0],
      readTime,
      category,
      featured,
      published,
      image: image.trim() || `/images/blog/${slug}.jpg`,
      href: `/blog/${slug}`,
      tags,
      seo: {
        metaTitle: title.length <= 60 ? title : title.substring(0, 57) + '...',
        metaDescription: excerpt.length <= 160 ? excerpt : excerpt.substring(0, 157) + '...',
        keywords: tags.join(', '),
        focusKeyword: tags[0] || '',
        canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-tools-list.com'}/blog/${slug}`,
        ogTitle: title,
        ogDescription: excerpt,
        ogImage: image || `/images/blog/${slug}-og.jpg`,
        twitterTitle: title,
        twitterDescription: excerpt,
        twitterImage: image || `/images/blog/${slug}-twitter.jpg`
      },
      analytics: post?.analytics || { views: 0, shares: 0, likes: 0 },
      publishedAt: published && !post?.publishedAt ? now : post?.publishedAt,
      updatedAt: now,
      status: published ? 'published' : 'draft'
    }

    onSave(blogPost)
  }

  // Text formatting helpers
  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)
    
    setContent(newText)
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const formatBold = () => insertText('**', '**')
  const formatItalic = () => insertText('*', '*')
  const formatHeading1 = () => insertText('# ')
  const formatHeading2 = () => insertText('## ')
  const formatHeading3 = () => insertText('### ')
  const formatList = () => insertText('- ')
  const formatQuote = () => insertText('> ')
  const formatCode = () => insertText('`', '`')
  const formatLink = () => insertText('[', '](url)')

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <FileText className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            {post ? 'Edit Post' : 'Create New Post'}
          </h2>
          {post && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {post.published ? 'Published' : 'Draft'}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Form */}
        <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-200">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.title}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {title.length}/100 characters
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief description of the post..."
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.excerpt ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.excerpt}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {excerpt.length}/300 characters
              </p>
            </div>

            {/* Category and Author */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {blogCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
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
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image URL
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags *
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
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
                  onKeyPress={handleTagKeyPress}
                  placeholder="Add tags (press Enter or comma)"
                  className={`flex-1 px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.tags ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              {errors.tags && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.tags}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {tags.length}/10 tags
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-700 flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  Featured Post
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-2 text-sm text-gray-700 flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  Publish immediately
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Content Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Editor Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('write')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'write'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Write
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'preview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Preview
            </button>
          </div>

          {activeTab === 'write' ? (
            <div className="flex-1 flex flex-col">
              {/* Formatting Toolbar */}
              <div className="flex items-center space-x-2 p-3 border-b border-gray-200 bg-gray-50">
                <button onClick={formatBold} className="p-2 hover:bg-gray-200 rounded" title="Bold">
                  <Bold className="h-4 w-4" />
                </button>
                <button onClick={formatItalic} className="p-2 hover:bg-gray-200 rounded" title="Italic">
                  <Italic className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-gray-300" />
                <button onClick={formatHeading1} className="p-2 hover:bg-gray-200 rounded" title="Heading 1">
                  <Heading1 className="h-4 w-4" />
                </button>
                <button onClick={formatHeading2} className="p-2 hover:bg-gray-200 rounded" title="Heading 2">
                  <Heading2 className="h-4 w-4" />
                </button>
                <button onClick={formatHeading3} className="p-2 hover:bg-gray-200 rounded" title="Heading 3">
                  <Heading3 className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-gray-300" />
                <button onClick={formatList} className="p-2 hover:bg-gray-200 rounded" title="List">
                  <List className="h-4 w-4" />
                </button>
                <button onClick={formatQuote} className="p-2 hover:bg-gray-200 rounded" title="Quote">
                  <Quote className="h-4 w-4" />
                </button>
                <button onClick={formatCode} className="p-2 hover:bg-gray-200 rounded" title="Code">
                  <Code className="h-4 w-4" />
                </button>
                <button onClick={formatLink} className="p-2 hover:bg-gray-200 rounded" title="Link">
                  <Link className="h-4 w-4" />
                </button>
              </div>

              {/* Content Textarea */}
              <div className="flex-1 p-4">
                <textarea
                  id="content-textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content here... Use Markdown for formatting."
                  className={`w-full h-full resize-none border-0 focus:ring-0 focus:outline-none font-mono text-sm ${
                    errors.content ? 'text-red-600' : 'text-gray-900'
                  }`}
                />
              </div>

              {/* Content Stats */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Type className="h-4 w-4 mr-1" />
                      {wordCount} words
                    </span>
                    <span className="flex items-center">
                      <Hash className="h-4 w-4 mr-1" />
                      {characterCount} characters
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {readTime}
                    </span>
                  </div>
                  {errors.content && (
                    <span className="text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.content}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="prose max-w-none">
                <h1>{title || 'Post Title'}</h1>
                <p className="text-gray-600 italic">{excerpt || 'Post excerpt will appear here...'}</p>
                <div className="whitespace-pre-wrap">{content || 'Post content will appear here...'}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {Object.keys(errors).length > 0 && (
              <span className="text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Please fix {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''} before saving
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || Object.keys(errors).length > 0}
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {published ? 'Publish' : 'Save Draft'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}