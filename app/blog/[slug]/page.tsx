import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import { Calendar, Clock, User, Tag, ArrowLeft, Share2, Heart, Eye } from 'lucide-react'
import { loadBlogPostsFromFile } from '@/lib/blog-file-manager'
import { getCategoryById } from '@/lib/blog-data'
import ModernArticlePage from '@/components/ModernArticlePage'
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation'
import AdvancedAnalytics from '@/components/AdvancedAnalytics'
import { SchemaGenerator } from '@/lib/schema-generator'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

// Dynamic rendering for better compatibility in development
export const dynamic = 'force-dynamic'

// Get blog posts with static generation optimization
const getBlogPosts = async () => {
  // Always load from file system for static generation
  return await loadBlogPostsFromFile()
}

// Generate static params for published posts
export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts()
    return posts
      .filter(post => post.published)
      .map(post => ({
        slug: post.slug || post.id
      }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const posts = await getBlogPosts()
  const post = posts.find(p => (p.slug === slug || p.id === slug) && p.published)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }

  const metaTitle = `${(post.seo?.metaTitle || post.title).replace(/^#+\s*/, '')} | AI Tools List Blog 2025`
  const metaDescription = `${(post.seo?.metaDescription || post.excerpt).substring(0, 150)}... Read time: ${post.readTime}. Expert insights on AI tools.`

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: `${post.seo?.keywords || post.tags.join(', ')}, AI tools blog, artificial intelligence news, AI technology insights 2025`,
    authors: [{ name: post.author }],
    openGraph: {
      title: (post.seo?.ogTitle || post.title).replace(/^#+\s*/, ''),
      description: post.seo?.ogDescription || post.excerpt,
      url: `https://www.aitoolsinsights.com/blog/${post.slug || post.id}`,
      siteName: 'AI Tools Insights',
      images: post.seo?.ogImage ? [post.seo.ogImage] : post.image ? [post.image] : [],
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: (post.seo?.twitterTitle || post.title).replace(/^#+\s*/, ''),
      description: post.seo?.twitterDescription || post.excerpt,
      images: post.seo?.twitterImage ? [post.seo.twitterImage] : post.image ? [post.image] : [],
      creator: '@aitoolslist',
      site: '@aitoolslist',
    },
    alternates: {
      canonical: post.seo?.canonicalUrl || `https://www.aitoolsinsights.com/blog/${post.slug || post.id}`,
    },
    other: {
      'article:author': post.author,
      'article:published_time': post.publishedAt || '',
      'article:modified_time': post.updatedAt || '',
      'article:section': post.category,
      'article:tag': post.tags.join(','),
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const posts = await getBlogPosts()
  const post = posts.find(p => (p.slug === slug || p.id === slug) && p.published)

  if (!post) {
    notFound()
  }

  const category = getCategoryById(post.category)
  const relatedPosts = posts
    .filter(p => p.published && p.id !== post.id && p.category === post.category)
    .slice(0, 3)

  // Generate breadcrumbs
  const breadcrumbs = [
    { name: 'Blog', href: '/blog' },
    { name: category?.name || 'Article', href: `/blog?category=${post.category}` },
    { name: post.title.replace(/^#+\s*/, '').substring(0, 50) + '...', href: `/blog/${post.slug || post.id}`, current: true }
  ]

  // Generate comprehensive structured data for blog post
  const articleSchema = SchemaGenerator.generateArticleSchema(post)
  const authorSchema = SchemaGenerator.generatePersonSchema({
    name: post.author,
    jobTitle: 'AI Technology Writer',
    bio: `Expert writer specializing in AI tools and technology trends. Author of multiple articles on artificial intelligence and software solutions.`,
    sameAs: [
      'https://twitter.com/aitoolslist',
      'https://linkedin.com/company/aitoolslist'
    ]
  })
  const breadcrumbSchema = SchemaGenerator.generateBreadcrumbSchema(
    [{ name: 'Home', url: 'https://www.aitoolsinsights.com' }, ...breadcrumbs.map(b => ({ name: b.name, url: `https://www.aitoolsinsights.com${b.href}` }))]
  )

  // Add NewsArticle schema if it's a news-type post
  const schemas = [articleSchema, authorSchema, breadcrumbSchema]
  if (post.category.toLowerCase().includes('news') || post.tags.some(tag => tag.toLowerCase().includes('news'))) {
    const newsSchema = SchemaGenerator.generateNewsArticleSchema({
      headline: post.title.replace(/^#+\s*/, ''),
      description: post.excerpt,
      author: post.author,
      datePublished: post.publishedAt || '',
      dateModified: post.updatedAt || '',
      url: `https://www.aitoolsinsights.com/blog/${post.slug || post.id}`,
      image: post.image
    })
    schemas.push(newsSchema)
  }

  const combinedSchema = SchemaGenerator.generateCombinedSchema(schemas)

  return (
    <div className="min-h-screen bg-white">
      {/* Advanced Analytics */}
      <AdvancedAnalytics />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: combinedSchema }}
      />
      {/* Breadcrumb Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNavigation items={breadcrumbs} />
      </div>



      {/* Modern Article Page Component */}
      <ModernArticlePage 
        post={post}
        relatedPosts={relatedPosts}
      />


    </div>
  )
}