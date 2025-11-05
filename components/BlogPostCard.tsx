'use client'

import Link from 'next/link'
import { Calendar, Clock, ArrowRight, User, Tag, Eye, Heart, Share2 } from 'lucide-react'
import { BlogPost, getCategoryById } from '@/lib/blog-data'
import { optimizeImageUrl } from '@/lib/utils'
import { formatExcerpt } from '@/lib/content-formatter'

interface BlogPostCardProps {
  post: BlogPost
  featured?: boolean
  compact?: boolean
}

export default function BlogPostCard({ post, featured = false, compact = false }: BlogPostCardProps) {
  const category = getCategoryById(post.category)
  
  if (featured) {
    return (
      <article className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Featured Image */}
        <div className="relative h-64 overflow-hidden">
          {post.image ? (
            <>
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                style={{ display: 'block' }}
                loading="eager"
                onError={(e) => {
                  console.error('Featured image failed to load:', post.image, 'Error:', e);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.style.display = 'flex';
                    console.log('Showing fallback for featured image');
                  }
                }}
                onLoad={(e) => {
                  console.log('Featured image loaded successfully:', post.image);
                  const target = e.target as HTMLImageElement;
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'none';
                }}
              />
              <div 
                className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center"
                style={{ display: 'none' }}
              >
                <div className="text-8xl font-bold text-white/30 select-none">
                  {category?.name.charAt(0) || post.category.charAt(0)}
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center">
              <div className="text-8xl font-bold text-white/30 select-none">
                {category?.name.charAt(0) || post.category.charAt(0)}
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Featured Badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded-full">
              ⭐ Featured
            </span>
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-4 right-4">
            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${category?.color || 'bg-gray-100 text-gray-700'}`}>
              {category?.name || post.category}
            </span>
          </div>
        </div>

        <div className="p-8">
          {/* Meta Information */}
          <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{(() => {
                  const dateValue = post.publishedAt || post.date;
                  return dateValue ? new Date(dateValue).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'No date';
                })()}</span>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
            <Link href={post.href} className="hover:underline">
              {post.title}
            </Link>
          </h2>

          {/* Excerpt */}
          <p
            className="text-gray-600 mb-6 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatExcerpt(post.excerpt) }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex items-center mb-6">
              <Tag className="h-4 w-4 text-gray-400 mr-2" />
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Analytics */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {post.analytics?.views && (
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{post.analytics.views.toLocaleString()}</span>
                </div>
              )}
              {post.analytics?.likes && (
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  <span>{post.analytics.likes}</span>
                </div>
              )}
              {post.analytics?.shares && (
                <div className="flex items-center">
                  <Share2 className="h-4 w-4 mr-1" />
                  <span>{post.analytics.shares}</span>
                </div>
              )}
            </div>

            {/* Read More */}
            <Link
              href={post.href}
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold text-sm group-hover:translate-x-1 transition-all duration-200"
            >
              Read Full Article
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </article>
    )
  }

  if (compact) {
    return (
      <article className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-primary-200 transition-all duration-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${category?.color || 'bg-gray-100 text-gray-700'}`}>
              {category?.name || post.category}
            </span>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {post.readTime}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            <Link href={post.href} className="hover:underline">
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p
            className="text-gray-600 text-sm mb-4 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: formatExcerpt(post.excerpt) }}
          />

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <span>{post.author}</span>
              <span>•</span>
              <span>{(() => {
                const dateValue = post.publishedAt || post.date;
                return dateValue ? new Date(dateValue).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                }) : 'No date';
              })()}</span>
            </div>
            <Link
              href={post.href}
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center group-hover:translate-x-1 transition-all duration-200"
            >
              Read
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      </article>
    )
  }

  // Regular card
  return (
    <article className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {post.image ? (
          <>
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              style={{ display: 'block' }}
              loading="eager"
              onError={(e) => {
                console.error('Regular image failed to load:', post.image, 'Error:', e);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) {
                  fallback.style.display = 'flex';
                  console.log('Showing fallback for regular image');
                }
              }}
              onLoad={(e) => {
                console.log('Regular image loaded successfully:', post.image);
                const target = e.target as HTMLImageElement;
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'none';
              }}
            />
            <div 
              className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center"
              style={{ display: 'none' }}
            >
              <div className="text-6xl font-bold text-white/30 select-none">
                {category?.name.charAt(0) || post.category.charAt(0)}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center">
            <div className="text-6xl font-bold text-white/30 select-none">
              {category?.name.charAt(0) || post.category.charAt(0)}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${category?.color || 'bg-gray-100 text-gray-700'}`}>
            {category?.name || post.category}
          </span>
        </div>
        
        {/* Featured Badge */}
        {post.featured && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
              ⭐ Featured
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Meta */}
        <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
          <Link href={post.href} className="hover:underline">
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p
          className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatExcerpt(post.excerpt) }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex items-center mb-4">
            <Tag className="h-3 w-3 text-gray-400 mr-2" />
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 2 && (
                <span className="text-xs text-gray-500">+{post.tags.length - 2}</span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{(() => {
              const dateValue = post.publishedAt || post.date;
              return dateValue ? new Date(dateValue).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              }) : 'No date';
            })()}</span>
            {post.analytics?.views && (
              <>
                <span className="mx-2">•</span>
                <Eye className="h-4 w-4 mr-1" />
                <span>{post.analytics.views.toLocaleString()} views</span>
              </>
            )}
          </div>
          <Link
            href={post.href}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center group-hover:translate-x-1 transition-all duration-200"
          >
            Read More
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  )
}