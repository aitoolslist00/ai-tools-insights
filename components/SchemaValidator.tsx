'use client'

import { useEffect, useState } from 'react'

interface SchemaValidatorProps {
  enabled?: boolean
  showResults?: boolean
}

interface SchemaValidationResult {
  type: string
  valid: boolean
  errors: string[]
  warnings: string[]
  richSnippetPotential: string[]
}

export default function SchemaValidator({ 
  enabled = process.env.NODE_ENV === 'development',
  showResults = false 
}: SchemaValidatorProps) {
  const [validationResults, setValidationResults] = useState<SchemaValidationResult[]>([])
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const validateSchemas = async () => {
      setIsValidating(true)
      const results: SchemaValidationResult[] = []

      try {
        // Find all JSON-LD scripts
        const scripts = document.querySelectorAll('script[type="application/ld+json"]')
        
        for (let i = 0; i < scripts.length; i++) {
          const script = scripts[i]
          const result: SchemaValidationResult = {
            type: 'Unknown',
            valid: false,
            errors: [],
            warnings: [],
            richSnippetPotential: []
          }

          try {
            const schemaText = script.textContent || '{}'
            const schema = JSON.parse(schemaText)
            
            // Determine schema type
            if (schema['@graph']) {
              result.type = `Graph with ${schema['@graph'].length} items`
              
              // Validate each item in the graph
              schema['@graph'].forEach((item: any, index: number) => {
                const itemValidation = validateSchemaItem(item)
                result.errors.push(...itemValidation.errors.map(e => `Item ${index + 1}: ${e}`))
                result.warnings.push(...itemValidation.warnings.map(w => `Item ${index + 1}: ${w}`))
                result.richSnippetPotential.push(...itemValidation.richSnippetPotential)
              })
            } else {
              const itemValidation = validateSchemaItem(schema)
              result.type = schema['@type'] || 'Unknown'
              result.errors = itemValidation.errors
              result.warnings = itemValidation.warnings
              result.richSnippetPotential = itemValidation.richSnippetPotential
            }

            result.valid = result.errors.length === 0
            
          } catch (error) {
            result.errors.push(`JSON Parse Error: ${error}`)
            result.valid = false
          }

          results.push(result)
        }

        setValidationResults(results)
        
        // Log results in development
        if (process.env.NODE_ENV === 'development') {
          console.group('🔍 Schema Validation Results')
          results.forEach((result, index) => {
            const status = result.valid ? '✅' : '❌'
            console.log(`${status} Schema ${index + 1}: ${result.type}`)
            
            if (result.errors.length > 0) {
              console.error('Errors:', result.errors)
            }
            
            if (result.warnings.length > 0) {
              console.warn('Warnings:', result.warnings)
            }
            
            if (result.richSnippetPotential.length > 0) {
              console.info('Rich Snippet Potential:', result.richSnippetPotential)
            }
          })
          console.groupEnd()
        }

      } catch (error) {
        console.error('Schema validation failed:', error)
      } finally {
        setIsValidating(false)
      }
    }

    // Run validation after a delay to ensure all schemas are loaded
    const timer = setTimeout(validateSchemas, 2000)
    return () => clearTimeout(timer)
  }, [enabled])

  const validateSchemaItem = (schema: any) => {
    const errors: string[] = []
    const warnings: string[] = []
    const richSnippetPotential: string[] = []

    // Required fields validation
    if (!schema['@context']) {
      errors.push('Missing @context')
    }
    
    if (!schema['@type']) {
      errors.push('Missing @type')
    }

    // Type-specific validations
    switch (schema['@type']) {
      case 'SoftwareApplication':
        validateSoftwareApplication(schema, errors, warnings, richSnippetPotential)
        break
      case 'Product':
        validateProduct(schema, errors, warnings, richSnippetPotential)
        break
      case 'Article':
      case 'NewsArticle':
        validateArticle(schema, errors, warnings, richSnippetPotential)
        break
      case 'FAQPage':
        validateFAQPage(schema, errors, warnings, richSnippetPotential)
        break
      case 'Review':
        validateReview(schema, errors, warnings, richSnippetPotential)
        break
      case 'AggregateRating':
        validateAggregateRating(schema, errors, warnings, richSnippetPotential)
        break
      case 'Organization':
        validateOrganization(schema, errors, warnings, richSnippetPotential)
        break
      case 'Person':
        validatePerson(schema, errors, warnings, richSnippetPotential)
        break
    }

    return { errors, warnings, richSnippetPotential }
  }

  const validateSoftwareApplication = (schema: any, errors: string[], warnings: string[], potential: string[]) => {
    if (!schema.name) errors.push('SoftwareApplication missing name')
    if (!schema.description) warnings.push('SoftwareApplication missing description')
    
    if (schema.aggregateRating) {
      potential.push('⭐ Star ratings in search results')
    }
    
    if (schema.offers) {
      potential.push('💰 Pricing information in SERPs')
    }
    
    if (schema.review) {
      potential.push('📝 Review snippets')
    }
  }

  const validateProduct = (schema: any, errors: string[], warnings: string[], potential: string[]) => {
    if (!schema.name) errors.push('Product missing name')
    if (!schema.description) warnings.push('Product missing description')
    
    if (schema.aggregateRating) {
      potential.push('⭐ Product ratings')
    }
    
    if (schema.offers && schema.offers.price) {
      potential.push('💰 Price display in search')
    }
    
    if (schema.brand) {
      potential.push('🏷️ Brand information')
    }
  }

  const validateArticle = (schema: any, errors: string[], warnings: string[], potential: string[]) => {
    if (!schema.headline) errors.push('Article missing headline')
    if (!schema.author) warnings.push('Article missing author')
    if (!schema.datePublished) warnings.push('Article missing datePublished')
    
    if (schema.author && schema.author.name) {
      potential.push('👤 Author information box')
    }
    
    if (schema.datePublished) {
      potential.push('📅 Publication date display')
    }
    
    if (schema.image) {
      potential.push('🖼️ Article image in results')
    }
  }

  const validateFAQPage = (schema: any, errors: string[], warnings: string[], potential: string[]) => {
    if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
      errors.push('FAQPage missing mainEntity array')
    } else {
      potential.push('❓ FAQ expandable sections in search')
      
      schema.mainEntity.forEach((faq: any, index: number) => {
        if (!faq.name) errors.push(`FAQ ${index + 1} missing question`)
        if (!faq.acceptedAnswer || !faq.acceptedAnswer.text) {
          errors.push(`FAQ ${index + 1} missing answer`)
        }
      })
    }
  }

  const validateReview = (schema: any, errors: string[], warnings: string[], potential: string[]) => {
    if (!schema.reviewRating) errors.push('Review missing reviewRating')
    if (!schema.author) warnings.push('Review missing author')
    
    if (schema.reviewRating && schema.reviewRating.ratingValue) {
      potential.push('⭐ Review ratings display')
    }
    
    if (schema.reviewBody) {
      potential.push('📝 Review text snippets')
    }
  }

  const validateAggregateRating = (schema: any, errors: string[], warnings: string[], potential: string[]) => {
    if (!schema.ratingValue) errors.push('AggregateRating missing ratingValue')
    if (!schema.reviewCount && !schema.ratingCount) {
      warnings.push('AggregateRating missing reviewCount or ratingCount')
    }
    
    potential.push('⭐ Star ratings in search results')
    potential.push('📊 Rating count display')
  }

  const validateOrganization = (schema: any, errors: string[], warnings: string[], potential: string[]) => {
    if (!schema.name) errors.push('Organization missing name')
    if (!schema.url) warnings.push('Organization missing url')
    
    if (schema.logo) {
      potential.push('🏢 Company logo in knowledge panel')
    }
    
    if (schema.sameAs && schema.sameAs.length > 0) {
      potential.push('🔗 Social media links')
    }
  }

  const validatePerson = (schema: any, errors: string[], warnings: string[], potential: string[]) => {
    if (!schema.name) errors.push('Person missing name')
    
    if (schema.jobTitle) {
      potential.push('👤 Author expertise display')
    }
    
    if (schema.sameAs && schema.sameAs.length > 0) {
      potential.push('🔗 Author social profiles')
    }
    
    if (schema.knowsAbout) {
      potential.push('🎓 Author expertise topics')
    }
  }

  if (!enabled || (!showResults && process.env.NODE_ENV !== 'development')) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      {showResults && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Schema Validation
            </h3>
            {isValidating && (
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
          
          {validationResults.map((result, index) => (
            <div key={index} className="mb-3 p-2 border border-gray-100 dark:border-gray-600 rounded">
              <div className="flex items-center gap-2 mb-1">
                <span className={result.valid ? 'text-green-600' : 'text-red-600'}>
                  {result.valid ? '✅' : '❌'}
                </span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {result.type}
                </span>
              </div>
              
              {result.errors.length > 0 && (
                <div className="text-xs text-red-600 mb-1">
                  Errors: {result.errors.length}
                </div>
              )}
              
              {result.warnings.length > 0 && (
                <div className="text-xs text-yellow-600 mb-1">
                  Warnings: {result.warnings.length}
                </div>
              )}
              
              {result.richSnippetPotential.length > 0 && (
                <div className="text-xs text-green-600">
                  Rich Snippets: {result.richSnippetPotential.length}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}