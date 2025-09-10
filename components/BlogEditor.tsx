'use client'

import { useState, useEffect } from 'react'
import { 
  Save, 
  Eye, 
  EyeOff, 
  Calendar, 
  Clock, 
  Tag, 
  User, 
  Image as ImageIcon,
  Link as LinkIcon,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Search,
  Target,
  Globe,
  BarChart3,
  X
} from 'lucide-react'
import { BlogPost, blogCategories, generateSlug } from '@/lib/blog-data'

interface BlogEditorProps {
  post?: BlogPost
  onSave: (post: BlogPost) => void
  onCancel: () => void
  saving?: boolean
}

export default function BlogEditor({ post, onSave, onCancel, saving = false }: BlogEditorProps) {
  const [editingPost, setEditingPost] = useState<BlogPost>(() => {
    if (post) return { ...post }
    
    return {
      id: generateSlug(`new-post-${Date.now()}`),
      title: '',
      excerpt: '',
      content: '',
      author: 'Admin',
      date: new Date().toISOString().split('T')[0],
      readTime: '5 min read',
      category: 'ai-tools',
      featured: false,
      published: false,
      href: '',
      tags: [],
      status: 'draft' as const,
      publishedAt: undefined,
      updatedAt: new Date().toISOString(),
      seo: {
        metaTitle: '',
        metaDescription: '',
        keywords: '',
        focusKeyword: '',
        canonicalUrl: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        twitterTitle: '',
        twitterDescription: '',
        twitterImage: ''
      },
      analytics: {
        views: 0,
        shares: 0,
        likes: 0
      }
    }
  })

  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content')
  const [previewMode, setPreviewMode] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [seoScore, setSeoScore] = useState(0)

  // Update word count and SEO score when content changes
  useEffect(() => {
    const words = editingPost.content.trim().split(/\s+/).filter(word => word.length > 0).length
    setWordCount(words)
    
    // Calculate estimated read time (average 200 words per minute)
    const readTime = Math.max(1, Math.ceil(words / 200))
    setEditingPost(prev => ({ ...prev, readTime: `${readTime} min read` }))
    
    // Calculate basic SEO score
    calculateSeoScore()
  }, [editingPost.content, editingPost.title, editingPost.seo])

  // Update href when title changes
  useEffect(() => {
    if (editingPost.title) {
      const slug = generateSlug(editingPost.title)
      setEditingPost(prev => ({ 
        ...prev, 
        href: `/blog/${slug}`,
        id: post?.id || slug
      }))
    }
  }, [editingPost.title, post?.id])

  const calculateSeoScore = () => {
    let score = 0
    const maxScore = 100

    // Title checks (20 points)
    if (editingPost.title.length >= 30 && editingPost.title.length <= 60) score += 10
    if (editingPost.seo?.focusKeyword && editingPost.title.toLowerCase().includes(editingPost.seo.focusKeyword.toLowerCase())) score += 10

    // Meta description checks (20 points)
    if (editingPost.seo?.metaDescription && editingPost.seo.metaDescription.length >= 120 && editingPost.seo.metaDescription.length <= 160) score += 10
    if (editingPost.seo?.focusKeyword && editingPost.seo.metaDescription?.toLowerCase().includes(editingPost.seo.focusKeyword.toLowerCase())) score += 10

    // Content checks (30 points)
    if (editingPost.content.length >= 300) score += 10
    if (editingPost.seo?.focusKeyword && editingPost.content.toLowerCase().includes(editingPost.seo.focusKeyword.toLowerCase())) score += 10
    if (editingPost.content.includes('#') || editingPost.content.includes('##')) score += 10 // Has headings

    // Image and media (10 points)
    if (editingPost.image) score += 5
    if (editingPost.seo?.ogImage) score += 5

    // Tags and categories (10 points)
    if (editingPost.tags.length >= 3) score += 5
    if (editingPost.category) score += 5

    // Social media optimization (10 points)
    if (editingPost.seo?.ogTitle && editingPost.seo?.ogDescription) score += 5
    if (editingPost.seo?.twitterTitle && editingPost.seo?.twitterDescription) score += 5

    setSeoScore(Math.min(score, maxScore))
  }

  const handleSave = () => {
    const updatedPost = {
      ...editingPost,
      updatedAt: new Date().toISOString(),
      publishedAt: editingPost.published && !post?.published ? new Date().toISOString() : editingPost.publishedAt,
      status: editingPost.published ? 'published' as const : 'draft' as const
    }
    onSave(updatedPost)
  }

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = editingPost.content.substring(start, end)
    const newText = editingPost.content.substring(0, start) + before + selectedText + after + editingPost.content.substring(end)
    
    setEditingPost(prev => ({ ...prev, content: newText }))
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getSeoScoreText = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Needs Improvement'
    return 'Poor'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {post ? 'Edit Post' : 'Create New Post'}
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{editingPost.readTime}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSeoScoreColor(seoScore)}`}>
              SEO: {seoScore}/100 ({getSeoScoreText(seoScore)})
            </div>
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {previewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-white">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'content'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'seo'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            SEO & Social
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'content' && (
            <div className="flex-1 flex">
              {/* Editor */}
              <div className="flex-1 flex flex-col">
                {/* Toolbar */}
                <div className="flex items-center space-x-2 p-4 border-b bg-gray-50 overflow-x-auto">
                  <button
                    onClick={() => insertMarkdown('# ', '')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                    title="Heading 1"
                  >
                    <Heading1 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => insertMarkdown('## ', '')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                    title="Heading 2"
                  >
                    <Heading2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => insertMarkdown('### ', '')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                    title="Heading 3"
                  >
                    <Heading3 className="h-4 w-4" />
                  </button>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <button
                    onClick={() => insertMarkdown('**', '**')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                    title="Bold"
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => insertMarkdown('*', '*')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                    title="Italic"
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => insertMarkdown('`', '`')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                    title="Code"
                  >
                    <Code className="h-4 w-4" />
                  </button>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <button
                    onClick={() => insertMarkdown('- ', '')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                    title="Bullet List"
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => insertMarkdown('1. ', '')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                    title="Numbered List"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => insertMarkdown('> ', '')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                    title="Quote"
                  >
                    <Quote className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => insertMarkdown('[Link Text](', ')')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                    title="Link"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => insertMarkdown('![Alt Text](', ')')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                    title="Image"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Title */}
                <div className="p-4 border-b">
                  <input
                    type="text"
                    placeholder="Enter your post title..."
                    value={editingPost.title}
                    onChange={(e) => setEditingPost(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full text-3xl font-bold border-none outline-none placeholder-gray-400"
                  />
                </div>

                {/* Content Editor */}
                <div className="flex-1 p-4">
                  {previewMode ? (
                    <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ 
                        __html: editingPost.content
                          .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                          .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                          .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                          .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                          .replace(/\*(.*)\*/gim, '<em>$1</em>')
                          .replace(/`(.*)`/gim, '<code>$1</code>')
                          .replace(/^\- (.*$)/gim, '<li>$1</li>')
                          .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
                          .replace(/\n/gim, '<br>')
                      }} />
                    </div>
                  ) : (
                    <textarea
                      id="content-editor"
                      placeholder="Start writing your article content here... 

Use Markdown formatting:
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
`Code`

- Bullet point
1. Numbered list
> Quote

[Link text](URL)
![Image alt](Image URL)"
                      value={editingPost.content}
                      onChange={(e) => setEditingPost(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full h-full resize-none border-none outline-none text-gray-900 leading-relaxed"
                    />
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="w-80 border-l bg-gray-50 p-4 overflow-y-auto">
                <div className="space-y-6">
                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      value={editingPost.excerpt}
                      onChange={(e) => setEditingPost(prev => ({ ...prev, excerpt: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Brief description of your post..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {editingPost.excerpt.length}/160 characters
                    </p>
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Featured Image URL
                    </label>
                    <input
                      type="url"
                      value={editingPost.image || ''}
                      onChange={(e) => setEditingPost(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={editingPost.category}
                      onChange={(e) => setEditingPost(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {blogCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={editingPost.tags.join(', ')}
                      onChange={(e) => setEditingPost(prev => ({ 
                        ...prev, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="AI, Machine Learning, Technology"
                    />
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={editingPost.author}
                      onChange={(e) => setEditingPost(prev => ({ ...prev, author: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  {/* Publish Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      value={editingPost.date}
                      onChange={(e) => setEditingPost(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingPost.published}
                        onChange={(e) => setEditingPost(prev => ({ ...prev, published: e.target.checked }))}
                        className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Published</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingPost.featured}
                        onChange={(e) => setEditingPost(prev => ({ ...prev, featured: e.target.checked }))}
                        className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Featured</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* SEO Score */}
                <div className="bg-white border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">SEO Analysis</h3>
                    <div className={`px-4 py-2 rounded-full text-sm font-medium ${getSeoScoreColor(seoScore)}`}>
                      {seoScore}/100 - {getSeoScoreText(seoScore)}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        seoScore >= 80 ? 'bg-green-500' : seoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${seoScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Focus Keyword */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Focus Keyword</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Focus Keyword
                      </label>
                      <input
                        type="text"
                        value={editingPost.seo?.focusKeyword || ''}
                        onChange={(e) => setEditingPost(prev => ({
                          ...prev,
                          seo: { ...prev.seo, focusKeyword: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="e.g., AI image generators"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        The main keyword you want this post to rank for
                      </p>
                    </div>
                  </div>
                </div>

                {/* Meta Tags */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Meta Tags</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        value={editingPost.seo?.metaTitle || ''}
                        onChange={(e) => setEditingPost(prev => ({
                          ...prev,
                          seo: { ...prev.seo, metaTitle: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="SEO-optimized title for search engines"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {editingPost.seo?.metaTitle?.length || 0}/60 characters (recommended: 50-60)
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description
                      </label>
                      <textarea
                        value={editingPost.seo?.metaDescription || ''}
                        onChange={(e) => setEditingPost(prev => ({
                          ...prev,
                          seo: { ...prev.seo, metaDescription: e.target.value }
                        }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Compelling description that appears in search results"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {editingPost.seo?.metaDescription?.length || 0}/160 characters (recommended: 120-160)
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Keywords
                      </label>
                      <input
                        type="text"
                        value={editingPost.seo?.keywords || ''}
                        onChange={(e) => setEditingPost(prev => ({
                          ...prev,
                          seo: { ...prev.seo, keywords: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Canonical URL
                      </label>
                      <input
                        type="url"
                        value={editingPost.seo?.canonicalUrl || ''}
                        onChange={(e) => setEditingPost(prev => ({
                          ...prev,
                          seo: { ...prev.seo, canonicalUrl: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="https://yoursite.com/blog/post-url"
                      />
                    </div>
                  </div>
                </div>

                {/* Open Graph */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Open Graph (Facebook)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OG Title
                      </label>
                      <input
                        type="text"
                        value={editingPost.seo?.ogTitle || ''}
                        onChange={(e) => setEditingPost(prev => ({
                          ...prev,
                          seo: { ...prev.seo, ogTitle: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Title for Facebook shares"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OG Description
                      </label>
                      <textarea
                        value={editingPost.seo?.ogDescription || ''}
                        onChange={(e) => setEditingPost(prev => ({
                          ...prev,
                          seo: { ...prev.seo, ogDescription: e.target.value }
                        }))}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Description for Facebook shares"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OG Image URL
                      </label>
                      <input
                        type="url"
                        value={editingPost.seo?.ogImage || ''}
                        onChange={(e) => setEditingPost(prev => ({
                          ...prev,
                          seo: { ...prev.seo, ogImage: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="https://example.com/og-image.jpg"
                      />
                    </div>
                  </div>
                </div>

                {/* Twitter Cards */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Twitter Cards</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter Title
                      </label>
                      <input
                        type="text"
                        value={editingPost.seo?.twitterTitle || ''}
                        onChange={(e) => setEditingPost(prev => ({
                          ...prev,
                          seo: { ...prev.seo, twitterTitle: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Title for Twitter shares"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter Description
                      </label>
                      <textarea
                        value={editingPost.seo?.twitterDescription || ''}
                        onChange={(e) => setEditingPost(prev => ({
                          ...prev,
                          seo: { ...prev.seo, twitterDescription: e.target.value }
                        }))}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Description for Twitter shares"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter Image URL
                      </label>
                      <input
                        type="url"
                        value={editingPost.seo?.twitterImage || ''}
                        onChange={(e) => setEditingPost(prev => ({
                          ...prev,
                          seo: { ...prev.seo, twitterImage: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="https://example.com/twitter-image.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Publishing Settings */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Publication Status</label>
                        <p className="text-xs text-gray-500">Control when this post goes live</p>
                      </div>
                      <select
                        value={editingPost.status}
                        onChange={(e) => setEditingPost(prev => ({ 
                          ...prev, 
                          status: e.target.value as 'draft' | 'published' | 'scheduled',
                          published: e.target.value === 'published'
                        }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="scheduled">Scheduled</option>
                      </select>
                    </div>

                    {editingPost.status === 'scheduled' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Schedule For
                        </label>
                        <input
                          type="datetime-local"
                          value={editingPost.scheduledFor || ''}
                          onChange={(e) => setEditingPost(prev => ({ ...prev, scheduledFor: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    )}

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingPost.featured}
                        onChange={(e) => setEditingPost(prev => ({ ...prev, featured: e.target.checked }))}
                        className="mr-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <label className="text-sm font-medium text-gray-700">Featured Post</label>
                        <p className="text-xs text-gray-500">Show this post in the featured section</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* URL Settings */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">URL Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Post URL
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                          /blog/
                        </span>
                        <input
                          type="text"
                          value={editingPost.href.replace('/blog/', '')}
                          onChange={(e) => setEditingPost(prev => ({ 
                            ...prev, 
                            href: `/blog/${e.target.value}`,
                            id: e.target.value
                          }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        URL-friendly version of your post title
                      </p>
                    </div>
                  </div>
                </div>

                {/* Analytics */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{editingPost.analytics?.views || 0}</div>
                      <div className="text-sm text-gray-600">Views</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{editingPost.analytics?.shares || 0}</div>
                      <div className="text-sm text-gray-600">Shares</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{editingPost.analytics?.likes || 0}</div>
                      <div className="text-sm text-gray-600">Likes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {editingPost.updatedAt && (
              <span>Last updated: {new Date(editingPost.updatedAt).toLocaleString()}</span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !editingPost.title.trim()}
              className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingPost.published ? 'Publish' : 'Save Draft'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}