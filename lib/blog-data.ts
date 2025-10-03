export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string // Full article content
  author: string
  date?: string // Optional for backward compatibility
  readTime: string
  category: string
  featured: boolean
  published: boolean
  image?: string
  images?: Array<{
    url: string
    alt: string
    title?: string
    caption?: string
    width?: number
    height?: number
    format?: string
    size?: number
  }>
  href: string
  tags: string[]
  slug?: string // Optional slug for SEO-friendly URLs
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string
    focusKeyword?: string
    canonicalUrl?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    twitterTitle?: string
    twitterDescription?: string
    twitterImage?: string
    schema?: any
    socialMedia?: {
      ogTitle?: string
      ogDescription?: string
      twitterTitle?: string
      twitterDescription?: string
    }
    imageOptimization?: {
      altText: string
      title: string
      caption: string
      filename: string
      seoScore: number
    }
  }
  analytics?: {
    views?: number
    shares?: number
    likes?: number
  }
  publishedAt?: string
  updatedAt?: string
  status?: 'draft' | 'published' | 'scheduled' // Optional for backward compatibility
  scheduledFor?: string
  lastModified?: string
  imageGenerationMetadata?: {
    generatedAt: string
    method: 'real' | 'placeholder'
    contentOptimized: boolean
    keywordsUsed: string[]
  }
}

export interface BlogCategory {
  id: string
  name: string
  description: string
  color: string
}

export const blogCategories: BlogCategory[] = [
  {
    id: 'ai-tools',
    name: 'AI Tools',
    description: 'Reviews and guides for AI tools',
    color: 'bg-blue-100 text-blue-700'
  },
  {
    id: 'reviews',
    name: 'Reviews',
    description: 'In-depth tool reviews and comparisons',
    color: 'bg-green-100 text-green-700'
  },
  {
    id: 'comparisons',
    name: 'Comparisons',
    description: 'Side-by-side tool comparisons',
    color: 'bg-purple-100 text-purple-700'
  },
  {
    id: 'tutorials',
    name: 'Tutorials',
    description: 'Step-by-step guides and tutorials',
    color: 'bg-orange-100 text-orange-700'
  },
  {
    id: 'industry-news',
    name: 'Industry News',
    description: 'Latest AI industry news and trends',
    color: 'bg-red-100 text-red-700'
  },
  {
    id: 'development',
    name: 'Development',
    description: 'AI development and technical content',
    color: 'bg-indigo-100 text-indigo-700'
  }
]

// Import the blog posts data
import blogPostsData from '../blog-posts.json'

// Transform the JSON data to match our BlogPost interface
export const blogPosts: BlogPost[] = blogPostsData.map((post: any) => ({
  id: post.id,
  title: post.title,
  excerpt: post.excerpt,
  content: post.content,
  author: post.author,
  date: post.publishDate,
  readTime: `${post.readingTime} min read`,
  category: post.category,
  featured: post.featured,
  published: post.published,
  image: post.image,
  images: post.images,
  href: `/blog/${post.slug || post.id}`,
  tags: post.keywords || [],
  slug: post.slug,
  seo: {
    metaTitle: post.title,
    metaDescription: post.metaDescription,
    keywords: post.keywords?.join(', '),
    schema: post.schemas
  }
}))



// Helper functions
export function getBlogPostById(id: string): BlogPost | undefined {
  return blogPosts.find(post => post.id === id)
}

export function getBlogPostsByCategory(categoryId: string): BlogPost[] {
  return blogPosts.filter(post => post.category === categoryId && post.published)
}

export function getFeaturedBlogPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured && post.published)
}

export function getPublishedBlogPosts(): BlogPost[] {
  return blogPosts.filter(post => post.published)
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => 
    post.published && post.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  )
}

export function searchBlogPosts(query: string): BlogPost[] {
  const searchTerm = query.toLowerCase()
  return blogPosts.filter(post => 
    post.published && (
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  )
}

export function getCategoryById(id: string): BlogCategory | undefined {
  return blogCategories.find(category => category.id === id)
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}