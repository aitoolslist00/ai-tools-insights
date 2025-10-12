'use client'

import { useEffect } from 'react'

interface AIContentOptimizerProps {
  pageType: 'homepage' | 'tool-page' | 'blog' | 'category'
  contentType: string
  keywords: string[]
  enableStructuredData?: boolean
  enableSemanticMarkup?: boolean
}

export default function AIContentOptimizer({
  pageType,
  contentType,
  keywords,
  enableStructuredData = true,
  enableSemanticMarkup = true
}: AIContentOptimizerProps) {

  useEffect(() => {
    if (!enableSemanticMarkup) return

    // Enhanced semantic markup for AI understanding
    const enhanceSemanticMarkup = () => {
      // 1. Add semantic roles to existing elements
      const addSemanticRoles = () => {
        // Main content areas
        const mainContent = document.querySelector('main')
        if (mainContent && !mainContent.getAttribute('role')) {
          mainContent.setAttribute('role', 'main')
          mainContent.setAttribute('aria-label', 'Main content')
        }

        // Navigation areas
        const navElements = document.querySelectorAll('nav')
        navElements.forEach((nav, index) => {
          if (!nav.getAttribute('role')) {
            nav.setAttribute('role', 'navigation')
            nav.setAttribute('aria-label', `Navigation ${index + 1}`)
          }
        })

        // Article elements
        const articles = document.querySelectorAll('article')
        articles.forEach(article => {
          if (!article.getAttribute('itemScope')) {
            article.setAttribute('itemScope', '')
            article.setAttribute('itemType', 'https://schema.org/Article')
          }
        })

        // Heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
        headings.forEach(heading => {
          if (!heading.getAttribute('itemProp')) {
            heading.setAttribute('itemProp', 'headline')
          }
        })
      }

      // 2. Add contextual information for AI
      const addContextualInformation = () => {
        // Add page context
        const body = document.body
        body.setAttribute('data-page-type', pageType)
        body.setAttribute('data-content-type', contentType)
        body.setAttribute('data-keywords', keywords.join(','))

        // Add content sections with semantic meaning
        const sections = document.querySelectorAll('section')
        sections.forEach((section, index) => {
          if (!section.getAttribute('aria-label')) {
            const heading = section.querySelector('h1, h2, h3, h4, h5, h6')
            if (heading) {
              section.setAttribute('aria-label', heading.textContent || `Section ${index + 1}`)
            }
          }
        })

        // Add list semantics
        const lists = document.querySelectorAll('ul, ol')
        lists.forEach(list => {
          if (!list.getAttribute('role')) {
            list.setAttribute('role', 'list')
          }
          const items = list.querySelectorAll('li')
          items.forEach(item => {
            if (!item.getAttribute('role')) {
              item.setAttribute('role', 'listitem')
            }
          })
        })
      }

      // 3. Add content relationship indicators
      const addContentRelationships = () => {
        // Related content
        const relatedSections = document.querySelectorAll('[data-related], .related-content')
        relatedSections.forEach(section => {
          section.setAttribute('role', 'complementary')
          section.setAttribute('aria-label', 'Related content')
        })

        // Content hierarchy
        const contentHierarchy = document.querySelectorAll('.content-hierarchy')
        contentHierarchy.forEach(element => {
          element.setAttribute('role', 'tree')
        })
      }

      // 4. Add AI-specific metadata
      const addAIMetadata = () => {
        // Content freshness
        const lastModified = document.querySelector('meta[name="last-modified"]')
        if (!lastModified) {
          const meta = document.createElement('meta')
          meta.name = 'last-modified'
          meta.content = new Date().toISOString()
          document.head.appendChild(meta)
        }

        // Content quality indicators
        const qualityMeta = document.createElement('meta')
        qualityMeta.name = 'content-quality'
        qualityMeta.content = 'high'
        document.head.appendChild(qualityMeta)

        // AI readability score
        const readabilityMeta = document.createElement('meta')
        readabilityMeta.name = 'ai-readability'
        readabilityMeta.content = 'optimized'
        document.head.appendChild(readabilityMeta)
      }

      addSemanticRoles()
      addContextualInformation()
      addContentRelationships()
      addAIMetadata()
    }

    // Run after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', enhanceSemanticMarkup)
    } else {
      enhanceSemanticMarkup()
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', enhanceSemanticMarkup)
    }
  }, [pageType, contentType, keywords, enableSemanticMarkup])

  useEffect(() => {
    if (!enableStructuredData) return

    // Enhanced structured data for AI understanding
    const addStructuredData = () => {
      // 1. Page-level structured data
      const addPageStructuredData = () => {
        const existingScript = document.querySelector('script[type="application/ld+json"][data-ai-optimizer]')
        if (existingScript) return

        const structuredData: any = {
          '@context': 'https://schema.org',
          '@type': getSchemaType(pageType),
          '@id': window.location.href,
          'url': window.location.href,
          'name': document.title,
          'description': document.querySelector('meta[name="description"]')?.getAttribute('content'),
          'keywords': keywords.join(', '),
          'inLanguage': 'en-US',
          'isAccessibleForFree': true,
          'dateModified': new Date().toISOString(),
          'contentType': contentType,
          'audience': {
            '@type': 'Audience',
            'audienceType': 'Business professionals, developers, content creators'
          },
          'about': keywords.map(keyword => ({
            '@type': 'Thing',
            'name': keyword
          })),
          'mainEntity': {
            '@type': 'WebPageElement',
            'cssSelector': 'main'
          }
        }

        // Add page-specific data
        if (pageType === 'tool-page') {
          structuredData['@type'] = 'SoftwareApplication'
          structuredData['applicationCategory'] = 'AI Tool'
          structuredData['operatingSystem'] = 'Web Browser'
        }

        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.setAttribute('data-ai-optimizer', 'true')
        script.textContent = JSON.stringify(structuredData, null, 2)
        document.head.appendChild(script)
      }

      // 2. Content-specific structured data
      const addContentStructuredData = () => {
        // FAQ sections
        const faqSections = document.querySelectorAll('.faq-section, [data-faq]')
        faqSections.forEach(section => {
          const questions = section.querySelectorAll('.faq-question, [data-question]')
          if (questions.length > 0) {
            const faqData = {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              'mainEntity': Array.from(questions).map(question => {
                const answer = question.nextElementSibling || question.querySelector('.faq-answer, [data-answer]')
                return {
                  '@type': 'Question',
                  'name': question.textContent?.trim(),
                  'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': answer?.textContent?.trim()
                  }
                }
              })
            }

            const script = document.createElement('script')
            script.type = 'application/ld+json'
            script.textContent = JSON.stringify(faqData, null, 2)
            section.appendChild(script)
          }
        })

        // How-to sections
        const howToSections = document.querySelectorAll('.how-to-section, [data-howto]')
        howToSections.forEach(section => {
          const steps = section.querySelectorAll('.step, [data-step]')
          if (steps.length > 0) {
            const howToData = {
              '@context': 'https://schema.org',
              '@type': 'HowTo',
              'name': section.querySelector('h1, h2, h3')?.textContent,
              'step': Array.from(steps).map((step, index) => ({
                '@type': 'HowToStep',
                'position': index + 1,
                'name': step.querySelector('h1, h2, h3, h4')?.textContent,
                'text': step.textContent?.trim()
              }))
            }

            const script = document.createElement('script')
            script.type = 'application/ld+json'
            script.textContent = JSON.stringify(howToData, null, 2)
            section.appendChild(script)
          }
        })
      }

      // 3. AI-specific microdata
      const addAIMicrodata = () => {
        // Add AI-readable content markers
        const contentSections = document.querySelectorAll('section, article, .content-block')
        contentSections.forEach((section, index) => {
          section.setAttribute('data-ai-content-id', `content-${index}`)
          section.setAttribute('data-ai-importance', calculateContentImportance(section))
          section.setAttribute('data-ai-topic', extractTopicFromContent(section, keywords))
        })

        // Add content relationship markers
        const links = document.querySelectorAll('a[href^="/"]')
        links.forEach(link => {
          link.setAttribute('data-ai-relation', 'internal-link')
          if (keywords.some(keyword => link.textContent?.toLowerCase().includes(keyword.toLowerCase()))) {
            link.setAttribute('data-ai-relevance', 'high')
          }
        })
      }

      addPageStructuredData()
      addContentStructuredData()
      addAIMicrodata()
    }

    // Run after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addStructuredData)
    } else {
      addStructuredData()
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', addStructuredData)
    }
  }, [pageType, contentType, keywords, enableStructuredData])

  return null
}

// Helper functions
function getSchemaType(pageType: string): string {
  switch (pageType) {
    case 'homepage':
      return 'WebSite'
    case 'tool-page':
      return 'SoftwareApplication'
    case 'blog':
      return 'BlogPosting'
    case 'category':
      return 'CollectionPage'
    default:
      return 'WebPage'
  }
}

function calculateContentImportance(element: Element): string {
  const text = element.textContent || ''
  const hasHeading = element.querySelector('h1, h2, h3, h4, h5, h6')
  const hasLinks = element.querySelectorAll('a').length
  const wordCount = text.split(' ').length

  if (hasHeading && wordCount > 100) return 'high'
  if (wordCount > 50 || hasLinks > 2) return 'medium'
  return 'low'
}

function extractTopicFromContent(element: Element, keywords: string[]): string {
  const text = (element.textContent || '').toLowerCase()
  const matchedKeywords = keywords.filter(keyword => 
    text.includes(keyword.toLowerCase())
  )
  return matchedKeywords.length > 0 ? matchedKeywords[0] : 'general'
}