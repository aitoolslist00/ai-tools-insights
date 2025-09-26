import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { loadBlogPostsFromFile } from '@/lib/blog-file-manager'
import { getCategoryById } from '@/lib/blog-data'
import ModernArticlePage from '@/components/ModernArticlePage'
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation'
import AdvancedAnalytics from '@/components/AdvancedAnalytics'
import { SchemaGenerator } from '@/lib/schema-generator'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

// Pure Static Generation - No ISR
export const dynamic = 'force-static'
export const revalidate = false

// Get blog posts with static generation optimization
const getBlogPosts = async () => {
  // Always load from file system for static generation
  return await loadBlogPostsFromFile()
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts
    .filter(post => post.published)
    .map(post => ({
      slug: post.id
    }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const posts = await getBlogPosts()
  const post = posts.find(p => p.id === slug && p.published)

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
      url: `https://www.aitoolsinsights.com/blog/${post.id}`,
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
      canonical: post.seo?.canonicalUrl || `https://www.aitoolslist.com/blog/${post.id}`,
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
  const post = posts.find(p => p.id === slug && p.published)

  if (!post) {
    notFound()
  }

  const category = getCategoryById(post.category)
  const relatedPosts = posts
    .filter(p => p.published && p.id !== post.id && p.category === post.category)
    .slice(0, 3)

  // Find next and previous posts
  const publishedPosts = posts.filter(p => p.published).sort((a, b) => 
    new Date(b.publishedAt || b.updatedAt || '').getTime() - 
    new Date(a.publishedAt || a.updatedAt || '').getTime()
  )
  
  const currentIndex = publishedPosts.findIndex(p => p.id === post.id)
  const nextPost = currentIndex > 0 ? publishedPosts[currentIndex - 1] : undefined
  const prevPost = currentIndex < publishedPosts.length - 1 ? publishedPosts[currentIndex + 1] : undefined

  // Generate breadcrumbs
  const breadcrumbs = [
    { name: 'Blog', href: '/blog' },
    { name: category?.name || 'Article', href: `/blog?category=${post.category}` },
    { name: post.title.replace(/^#+\s*/, '').substring(0, 50) + '...', href: `/blog/${post.id}`, current: true }
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
    [{ name: 'Home', url: 'https://www.aitoolslist.com' }, ...breadcrumbs.map(b => ({ name: b.name, url: `https://www.aitoolslist.com${b.href}` }))]
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
      url: `https://www.aitoolslist.com/blog/${post.id}`,
      image: post.image
    })
    schemas.push(newsSchema)
  }

  const combinedSchema = SchemaGenerator.generateCombinedSchema(schemas)

  return (
    <>
      {/* Advanced Analytics */}
      <AdvancedAnalytics />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: combinedSchema }}
      />
      
      {/* Breadcrumb Navigation - positioned above the main content */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <BreadcrumbNavigation items={breadcrumbs} />
        </div>
      </div>

      {/* Modern Article Page Component */}
      <ModernArticlePage 
        post={{
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          publishedAt: post.publishedAt || post.updatedAt || new Date().toISOString(),
          readTime: post.readTime,
          image: post.image,
          tags: post.tags,
          category: category?.name || post.category,
          href: post.href
        }}
        relatedPosts={relatedPosts.map(p => ({
          id: p.id,
          title: p.title,
          excerpt: p.excerpt,
          content: p.content,
          author: p.author,
          publishedAt: p.publishedAt || p.updatedAt || new Date().toISOString(),
          readTime: p.readTime,
          image: p.image,
          tags: p.tags,
          category: p.category,
          href: p.href
        }))}
        nextPost={nextPost ? {
          id: nextPost.id,
          title: nextPost.title,
          excerpt: nextPost.excerpt,
          content: nextPost.content,
          author: nextPost.author,
          publishedAt: nextPost.publishedAt || nextPost.updatedAt || new Date().toISOString(),
          readTime: nextPost.readTime,
          image: nextPost.image,
          tags: nextPost.tags,
          category: nextPost.category,
          href: nextPost.href
        } : undefined}
        prevPost={prevPost ? {
          id: prevPost.id,
          title: prevPost.title,
          excerpt: prevPost.excerpt,
          content: prevPost.content,
          author: prevPost.author,
          publishedAt: prevPost.publishedAt || prevPost.updatedAt || new Date().toISOString(),
          readTime: prevPost.readTime,
          image: prevPost.image,
          tags: prevPost.tags,
          category: prevPost.category,
          href: prevPost.href
        } : undefined}
      />
    </>
  )
}