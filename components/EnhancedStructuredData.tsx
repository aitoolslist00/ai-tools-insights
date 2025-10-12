'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface EnhancedStructuredDataProps {
  pageType: 'homepage' | 'tool-page' | 'blog' | 'category' | 'search'
  toolData?: {
    name: string
    description: string
    category: string
    rating?: number
    pricing?: string
    features?: string[]
    url?: string
  }
  blogData?: {
    title: string
    description: string
    author: string
    publishDate: string
    modifiedDate?: string
    tags?: string[]
  }
}

export default function EnhancedStructuredData({ 
  pageType, 
  toolData, 
  blogData 
}: EnhancedStructuredDataProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Remove existing structured data to avoid duplicates
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"][data-enhanced-structured-data]')
    existingScripts.forEach(script => script.remove())

    const baseUrl = 'https://www.aitoolsinsights.com'
    const currentUrl = `${baseUrl}${pathname}`

    // Generate comprehensive structured data based on page type
    const generateStructuredData = () => {
      const commonData = {
        '@context': 'https://schema.org',
        '@id': currentUrl,
        'url': currentUrl,
        'inLanguage': 'en-US',
        'isAccessibleForFree': true,
        'dateModified': new Date().toISOString(),
        'publisher': {
          '@type': 'Organization',
          'name': 'AI Tools Insights',
          'url': baseUrl,
          'logo': {
            '@type': 'ImageObject',
            'url': `${baseUrl}/logo.png`,
            'width': 180,
            'height': 45
          },
          'sameAs': [
            'https://twitter.com/aitoolsinsights',
            'https://linkedin.com/company/aitoolsinsights',
            'https://github.com/aitoolsinsights'
          ]
        }
      }

      let structuredData: any = { ...commonData }

      switch (pageType) {
        case 'homepage':
          structuredData = {
            ...structuredData,
            '@type': 'WebSite',
            'name': 'AI Tools Insights - Best AI Tools Directory 2025',
            'description': 'Comprehensive directory of 500+ AI tools including image generators, video tools, chatbots, coding assistants, and more. Find the perfect AI solution for your business needs.',
            'potentialAction': {
              '@type': 'SearchAction',
              'target': {
                '@type': 'EntryPoint',
                'urlTemplate': `${baseUrl}/search?q={search_term_string}`
              },
              'query-input': 'required name=search_term_string'
            },
            'mainEntity': {
              '@type': 'ItemList',
              'name': 'AI Tools Directory',
              'description': 'Comprehensive list of AI tools for business and personal use',
              'numberOfItems': 500,
              'itemListElement': [
                {
                  '@type': 'ListItem',
                  'position': 1,
                  'item': {
                    '@type': 'SoftwareApplication',
                    'name': 'ChatGPT',
                    'applicationCategory': 'AI Chatbot',
                    'url': `${baseUrl}/ai-tools/chatgpt`
                  }
                },
                {
                  '@type': 'ListItem',
                  'position': 2,
                  'item': {
                    '@type': 'SoftwareApplication',
                    'name': 'Midjourney',
                    'applicationCategory': 'AI Image Generator',
                    'url': `${baseUrl}/ai-tools/midjourney`
                  }
                },
                {
                  '@type': 'ListItem',
                  'position': 3,
                  'item': {
                    '@type': 'SoftwareApplication',
                    'name': 'GitHub Copilot',
                    'applicationCategory': 'AI Coding Assistant',
                    'url': `${baseUrl}/ai-tools/github-copilot`
                  }
                }
              ]
            },
            'about': [
              {
                '@type': 'Thing',
                'name': 'Artificial Intelligence Tools'
              },
              {
                '@type': 'Thing',
                'name': 'Business Software'
              },
              {
                '@type': 'Thing',
                'name': 'Productivity Tools'
              }
            ]
          }
          break

        case 'tool-page':
          if (toolData) {
            structuredData = {
              ...structuredData,
              '@type': 'SoftwareApplication',
              'name': toolData.name,
              'description': toolData.description,
              'applicationCategory': toolData.category,
              'operatingSystem': 'Web Browser',
              'offers': toolData.pricing ? {
                '@type': 'Offer',
                'price': toolData.pricing,
                'priceCurrency': 'USD',
                'availability': 'https://schema.org/InStock'
              } : undefined,
              'aggregateRating': toolData.rating ? {
                '@type': 'AggregateRating',
                'ratingValue': toolData.rating,
                'bestRating': 5,
                'worstRating': 1,
                'ratingCount': 100
              } : undefined,
              'featureList': toolData.features || [],
              'screenshot': `${baseUrl}/screenshots/${toolData.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
              'downloadUrl': toolData.url,
              'author': {
                '@type': 'Organization',
                'name': 'AI Tools Insights'
              }
            }
          }
          break

        case 'blog':
          if (blogData) {
            structuredData = {
              ...structuredData,
              '@type': 'BlogPosting',
              'headline': blogData.title,
              'description': blogData.description,
              'author': {
                '@type': 'Person',
                'name': blogData.author,
                'url': `${baseUrl}/authors/${blogData.author.toLowerCase().replace(/\s+/g, '-')}`
              },
              'datePublished': blogData.publishDate,
              'dateModified': blogData.modifiedDate || blogData.publishDate,
              'mainEntityOfPage': {
                '@type': 'WebPage',
                '@id': currentUrl
              },
              'image': {
                '@type': 'ImageObject',
                'url': `${baseUrl}/blog-images/${blogData.title.toLowerCase().replace(/\s+/g, '-')}.jpg`,
                'width': 1200,
                'height': 630
              },
              'keywords': blogData.tags?.join(', '),
              'articleSection': 'AI Tools',
              'wordCount': 1500,
              'timeRequired': 'PT5M'
            }
          }
          break

        case 'category':
          structuredData = {
            ...structuredData,
            '@type': 'CollectionPage',
            'name': `${pathname.split('/').pop()?.replace(/-/g, ' ')} AI Tools`,
            'description': `Discover the best ${pathname.split('/').pop()?.replace(/-/g, ' ')} AI tools for your business needs`,
            'mainEntity': {
              '@type': 'ItemList',
              'name': `${pathname.split('/').pop()?.replace(/-/g, ' ')} AI Tools`,
              'numberOfItems': 50
            }
          }
          break

        case 'search':
          structuredData = {
            ...structuredData,
            '@type': 'SearchResultsPage',
            'name': 'AI Tools Search Results',
            'description': 'Search results for AI tools directory'
          }
          break
      }

      return structuredData
    }

    // Generate and inject structured data
    const data = generateStructuredData()
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-enhanced-structured-data', 'true')
    script.textContent = JSON.stringify(data, null, 2)
    document.head.appendChild(script)

    // Generate additional structured data for enhanced SEO
    const generateAdditionalStructuredData = () => {
      // Organization data
      const organizationData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${baseUrl}#organization`,
        'name': 'AI Tools Insights',
        'url': baseUrl,
        'logo': {
          '@type': 'ImageObject',
          'url': `${baseUrl}/logo.png`,
          'width': 180,
          'height': 45
        },
        'description': 'Leading directory of AI tools and artificial intelligence software for businesses and individuals',
        'foundingDate': '2024',
        'sameAs': [
          'https://twitter.com/aitoolsinsights',
          'https://linkedin.com/company/aitoolsinsights',
          'https://github.com/aitoolsinsights'
        ],
        'contactPoint': {
          '@type': 'ContactPoint',
          'contactType': 'customer service',
          'url': `${baseUrl}/contact`,
          'availableLanguage': 'English'
        },
        'areaServed': 'Worldwide',
        'knowsAbout': [
          'Artificial Intelligence',
          'Machine Learning',
          'AI Tools',
          'Business Software',
          'Productivity Tools'
        ]
      }

      // Website data
      const websiteData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${baseUrl}#website`,
        'url': baseUrl,
        'name': 'AI Tools Insights',
        'description': 'Comprehensive directory of AI tools and artificial intelligence software',
        'publisher': {
          '@id': `${baseUrl}#organization`
        },
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': `${baseUrl}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        },
        'inLanguage': 'en-US',
        'copyrightYear': new Date().getFullYear(),
        'copyrightHolder': {
          '@id': `${baseUrl}#organization`
        }
      }

      // Breadcrumb data
      const breadcrumbData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': generateBreadcrumbItems()
      }

      return [organizationData, websiteData, breadcrumbData]
    }

    // Generate breadcrumb items based on current path
    const generateBreadcrumbItems = () => {
      const pathSegments = pathname.split('/').filter(segment => segment)
      const items = [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': baseUrl
        }
      ]

      let currentPath = baseUrl
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`
        items.push({
          '@type': 'ListItem',
          'position': index + 2,
          'name': segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          'item': currentPath
        })
      })

      return items
    }

    // Inject additional structured data
    const additionalData = generateAdditionalStructuredData()
    additionalData.forEach((data, index) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-enhanced-structured-data', 'true')
      script.setAttribute('data-type', `additional-${index}`)
      script.textContent = JSON.stringify(data, null, 2)
      document.head.appendChild(script)
    })

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll('script[data-enhanced-structured-data]')
      scripts.forEach(script => script.remove())
    }
  }, [pageType, pathname, toolData, blogData])

  return null
}

// Helper function to validate structured data
export const validateStructuredData = () => {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]')
  const validationResults: { valid: boolean; errors: string[] }[] = []

  scripts.forEach(script => {
    try {
      const data = JSON.parse(script.textContent || '')
      const errors: string[] = []

      // Basic validation
      if (!data['@context']) errors.push('Missing @context')
      if (!data['@type']) errors.push('Missing @type')
      if (!data.name && !data.headline) errors.push('Missing name or headline')

      validationResults.push({
        valid: errors.length === 0,
        errors
      })
    } catch (error) {
      validationResults.push({
        valid: false,
        errors: ['Invalid JSON']
      })
    }
  })

  return validationResults
}