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
  href: string
  tags: string[]
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

export const blogPosts: BlogPost[] = [
  // Sample posts will be loaded from blog-posts.json file instead
]



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