'use client'

import { useEffect } from 'react'
import { SchemaGenerator } from '@/lib/schema-generator'

interface RichSnippetsOptimizerProps {
  pageType: 'homepage' | 'tool' | 'blog' | 'search' | 'category'
  data?: any
  className?: string
}

export default function RichSnippetsOptimizer({ 
  pageType, 
  data,
  className = "" 
}: RichSnippetsOptimizerProps) {
  
  useEffect(() => {
    // Add rich snippets optimization for better Google display
    const addRichSnippetsOptimization = () => {
      // Add structured data testing hints for development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔍 Rich Snippets Active: ${pageType}`, data)
      }

      // Add microdata attributes to existing elements for enhanced SEO
      const addMicrodataAttributes = () => {
        // Add rating microdata to star displays
        const ratingElements = document.querySelectorAll('[data-rating]')
        ratingElements.forEach(element => {
          if (!element.getAttribute('itemscope')) {
            element.setAttribute('itemscope', '')
            element.setAttribute('itemtype', 'https://schema.org/Rating')
            
            const ratingValue = element.getAttribute('data-rating')
            if (ratingValue) {
              element.setAttribute('itemprop', 'ratingValue')
              element.setAttribute('content', ratingValue)
            }
          }
        })

        // Add price microdata to pricing displays
        const priceElements = document.querySelectorAll('[data-price]')
        priceElements.forEach(element => {
          if (!element.getAttribute('itemscope')) {
            element.setAttribute('itemscope', '')
            element.setAttribute('itemtype', 'https://schema.org/Offer')
            
            const price = element.getAttribute('data-price')
            if (price) {
              element.setAttribute('itemprop', 'price')
              element.setAttribute('content', price)
            }
          }
        })

        // Add review microdata to review sections
        const reviewElements = document.querySelectorAll('[data-review]')
        reviewElements.forEach(element => {
          if (!element.getAttribute('itemscope')) {
            element.setAttribute('itemscope', '')
            element.setAttribute('itemtype', 'https://schema.org/Review')
          }
        })
      }

      // Run microdata enhancement
      setTimeout(addMicrodataAttributes, 1000)
    }

    addRichSnippetsOptimization()
  }, [pageType, data])

  // Generate page-specific schema enhancements
  const generatePageSpecificSchema = () => {
    switch (pageType) {
      case 'tool':
        if (data?.tool) {
          return SchemaGenerator.generateToolPageSchema(data.tool)
        }
        break
      case 'homepage':
        return SchemaGenerator.generateHomepageSchema()
      case 'blog':
        if (data?.post) {
          const articleSchema = SchemaGenerator.generateArticleSchema(data.post)
          const authorSchema = SchemaGenerator.generatePersonSchema({
            name: data.post.author,
            jobTitle: 'AI Technology Expert'
          })
          return SchemaGenerator.generateCombinedSchema([articleSchema, authorSchema])
        }
        break
      case 'search':
        if (data?.query && data?.results) {
          return JSON.stringify(SchemaGenerator.generateSearchResultsPageSchema(
            data.query, 
            data.results, 
            data.totalResults || data.results.length
          ))
        }
        break
      case 'category':
        if (data?.category && data?.tools) {
          return JSON.stringify(SchemaGenerator.generateCollectionPageSchema(
            data.category,
            data.tools
          ))
        }
        break
    }
    return null
  }

  const pageSchema = generatePageSpecificSchema()

  return (
    <div className={`rich-snippets-optimizer ${className}`}>
      {/* Enhanced Schema for Rich Snippets */}
      {pageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: pageSchema }}
        />
      )}
      
      {/* SEO Enhancement Hints */}
      <div className="sr-only" aria-hidden="true">
        {/* Hidden content for search engines */}
        {pageType === 'tool' && data?.tool && (
          <div itemScope itemType="https://schema.org/SoftwareApplication">
            <span itemProp="name">{data.tool.name}</span>
            <span itemProp="description">{data.tool.description}</span>
            <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
              <span itemProp="ratingValue">{data.tool.rating}</span>
              <span itemProp="bestRating">5</span>
              <span itemProp="ratingCount">{parseInt(data.tool.users.replace(/[^\d]/g, '')) || 100}</span>
            </div>
            <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <span itemProp="price">0</span>
              <span itemProp="priceCurrency">USD</span>
            </div>
          </div>
        )}
        
        {pageType === 'blog' && data?.post && (
          <article itemScope itemType="https://schema.org/Article">
            <h1 itemProp="headline">{data.post.title}</h1>
            <div itemProp="author" itemScope itemType="https://schema.org/Person">
              <span itemProp="name">{data.post.author}</span>
            </div>
            <time itemProp="datePublished" dateTime={data.post.publishedAt}>
              {data.post.publishedAt}
            </time>
            <div itemProp="publisher" itemScope itemType="https://schema.org/Organization">
              <span itemProp="name">AI Tools List</span>
            </div>
          </article>
        )}
      </div>
    </div>
  )
}

// Helper function to add rich snippets data attributes to components
export const addRichSnippetsData = (element: HTMLElement, type: string, data: Record<string, any>) => {
  element.setAttribute('data-rich-snippet', type)
  Object.entries(data).forEach(([key, value]) => {
    element.setAttribute(`data-${key}`, String(value))
  })
}

// Hook for rich snippets optimization
export const useRichSnippets = (pageType: string, data?: any) => {
  useEffect(() => {
    // Add structured data testing validation in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎯 Rich Snippets Optimization Active: ${pageType}`)
      
      // Validate schema structure
      const validateSchema = () => {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]')
        scripts.forEach((script, index) => {
          try {
            const schema = JSON.parse(script.textContent || '{}')
            console.log(`✅ Schema ${index + 1} Valid:`, schema['@type'] || 'Unknown')
          } catch (error) {
            console.error(`❌ Schema ${index + 1} Invalid:`, error)
          }
        })
      }
      
      setTimeout(validateSchema, 2000)
    }
  }, [pageType, data])
}