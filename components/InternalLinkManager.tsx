'use client'

import React from 'react'
import Link from 'next/link'
import { InternalLinkStrategy, InternalLink } from '@/lib/internal-link-strategy'

interface InternalLinkManagerProps {
  currentPage: string
  content?: string
  context: 'navigation' | 'contextual' | 'related' | 'footer' | 'breadcrumb'
  maxLinks?: number
  className?: string
  category?: string
  blogSlug?: string
}

/**
 * Intelligent Internal Link Manager Component
 * Automatically generates and manages internal links based on context and SEO strategy
 */
export default function InternalLinkManager({
  currentPage,
  content = '',
  context,
  maxLinks = 5,
  className = '',
  category,
  blogSlug
}: InternalLinkManagerProps) {
  const generateLinks = (): InternalLink[] => {
    switch (context) {
      case 'navigation':
        return InternalLinkStrategy.generateNavigationLinks()
      
      case 'contextual':
        return InternalLinkStrategy.generateContextualLinks(currentPage, content, maxLinks)
      
      case 'related':
        if (blogSlug) {
          return InternalLinkStrategy.generateRelatedBlogLinks(blogSlug, category, maxLinks)
        }
        if (category) {
          return InternalLinkStrategy.generateCategoryHubLinks(category)
        }
        return []
      
      case 'footer':
        return InternalLinkStrategy.generateFooterLinks()
      
      case 'breadcrumb':
        return InternalLinkStrategy.generateBreadcrumbLinks(currentPage)
      
      default:
        return []
    }
  }

  const links = generateLinks()

  if (links.length === 0) return null

  const renderLink = (link: InternalLink, index: number) => (
    <Link
      key={index}
      href={link.url}
      title={link.title}
      className={getLinkClassName(link, context)}
    >
      {link.anchorText}
    </Link>
  )

  const getLinkClassName = (link: InternalLink, context: string): string => {
    const baseClasses = 'transition-colors duration-200'
    
    switch (context) {
      case 'navigation':
        return `${baseClasses} text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium`
      
      case 'contextual':
        return `${baseClasses} text-primary-600 hover:text-primary-700 font-medium underline decoration-1 underline-offset-2`
      
      case 'related':
        return `${baseClasses} text-primary-600 hover:text-primary-700 font-medium block py-2 border-b border-gray-100 last:border-0`
      
      case 'footer':
        return `${baseClasses} text-gray-400 hover:text-white text-sm block py-1`
      
      case 'breadcrumb':
        return `${baseClasses} text-gray-500 hover:text-gray-700 text-sm`
      
      default:
        return `${baseClasses} text-primary-600 hover:text-primary-700`
    }
  }

  const renderContextualLinks = () => (
    <div className={`contextual-links ${className}`}>
      {links.map((link, index) => (
        <span key={index} className="inline">
          {renderLink(link, index)}
          {index < links.length - 1 && ', '}
        </span>
      ))}
    </div>
  )

  const renderRelatedLinks = () => (
    <div className={`related-links bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        {blogSlug ? 'Related Articles' : 'Related Tools'}
      </h3>
      <div className="space-y-1">
        {links.map((link, index) => (
          <div key={index}>
            {renderLink(link, index)}
          </div>
        ))}
      </div>
    </div>
  )

  const renderBreadcrumbs = () => (
    <nav className={`breadcrumbs ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {links.map((link, index) => (
          <li key={index} className="flex items-center">
            {renderLink(link, index)}
            {index < links.length - 1 && (
              <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )

  const renderFooterLinks = () => (
    <div className={`footer-links ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {links.map((link, index) => (
          <div key={index}>
            {renderLink(link, index)}
          </div>
        ))}
      </div>
    </div>
  )

  // Render based on context
  switch (context) {
    case 'contextual':
      return renderContextualLinks()
    
    case 'related':
      return renderRelatedLinks()
    
    case 'breadcrumb':
      return renderBreadcrumbs()
    
    case 'footer':
      return renderFooterLinks()
    
    default:
      return (
        <div className={className}>
          {links.map((link, index) => renderLink(link, index))}
        </div>
      )
  }
}

/**
 * Specialized components for different link contexts
 */

// Blog-to-Tool conversion links for high-converting placements
export function BlogToToolLinks({ blogSlug, className = '' }: { blogSlug: string, className?: string }) {
  const links = InternalLinkStrategy.generateBlogToToolLinks(blogSlug)
  
  if (links.length === 0) return null

  return (
    <div className={`blog-to-tool-links bg-gradient-to-r from-primary-50 to-blue-50 p-6 rounded-xl border border-primary-200 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Featured AI Tools
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.url}
            title={link.title}
            className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
          >
            <div className="w-2 h-2 bg-primary-600 rounded-full mr-3 group-hover:bg-primary-700"></div>
            <span className="text-gray-900 font-medium group-hover:text-primary-700">
              {link.anchorText}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Category hub navigation for topical authority
export function CategoryHubLinks({ category, className = '' }: { category: string, className?: string }) {
  const links = InternalLinkStrategy.generateCategoryHubLinks(category)
  
  if (links.length === 0) return null

  return (
    <div className={`category-hub-links ${className}`}>
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Explore {category}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.url}
            className="group p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-200"
          >
            <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 mb-2">
              {link.anchorText}
            </h4>
            <p className="text-sm text-gray-600">
              {link.keywords?.join(' • ')}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Smart contextual link injector for content
export function ContextualLinkInjector({ 
  content, 
  currentPage, 
  maxLinks = 3 
}: { 
  content: string, 
  currentPage: string, 
  maxLinks?: number 
}) {
  const links = InternalLinkStrategy.generateContextualLinks(currentPage, content, maxLinks)
  
  // This would typically be used server-side to inject links into content
  // For client-side, we return the links as a separate component
  return (
    <div className="contextual-suggestions mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="text-sm font-semibold text-blue-900 mb-2">Related Resources:</h4>
      <div className="flex flex-wrap gap-2">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.url}
            title={link.title}
            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            {link.anchorText}
          </Link>
        ))}
      </div>
    </div>
  )
}