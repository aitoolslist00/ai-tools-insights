'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { SchemaGenerator } from '@/lib/schema-generator'

interface FAQ {
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs: FAQ[]
  title?: string
  className?: string
}

export default function FAQSection({ 
  faqs, 
  title = "Frequently Asked Questions",
  className = ""
}: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  // Generate enhanced FAQ schema for rich snippets
  const faqSchema = SchemaGenerator.generateFAQSchema(faqs)
  
  // Validate that we have a proper mainEntity array
  if (!faqSchema.mainEntity || !Array.isArray(faqSchema.mainEntity)) {
    console.warn('FAQ Schema validation failed: mainEntity is missing or not an array', faqSchema)
  } else if (process.env.NODE_ENV === 'development') {
    console.log('FAQ Schema generated successfully:', {
      type: faqSchema['@type'],
      context: faqSchema['@context'],
      mainEntityCount: faqSchema.mainEntity.length,
      firstQuestion: faqSchema.mainEntity[0]?.name
    })
  }

  return (
    <section 
      className={`py-12 ${className}`}
      itemScope 
      itemType="https://schema.org/FAQPage"
    >
      {/* Enhanced FAQ Schema for Rich Snippets */}
      {faqSchema.mainEntity && Array.isArray(faqSchema.mainEntity) && faqSchema.mainEntity.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find answers to the most common questions about our AI tools directory.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
              itemScope
              itemType="https://schema.org/Question"
              itemProp="mainEntity"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => toggleItem(index)}
                aria-expanded={openItems.has(index)}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 
                  className="text-lg font-semibold text-gray-900 dark:text-white pr-4"
                  itemProp="name"
                >
                  {faq.question}
                </h3>
                {openItems.has(index) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openItems.has(index) && (
                <div
                  id={`faq-answer-${index}`}
                  className="px-6 pb-4"
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <div 
                    className="text-gray-700 dark:text-gray-300 leading-relaxed"
                    itemProp="text"
                  >
                    {faq.answer.split('\n').map((paragraph, pIndex) => (
                      <p key={pIndex} className={pIndex > 0 ? 'mt-4' : ''}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Still have questions? We're here to help!
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  )
}

// Predefined FAQ data for different sections
export const homepageFAQs: FAQ[] = [
  {
    question: "What is AI Tools List?",
    answer: "AI Tools List is a comprehensive directory of artificial intelligence tools designed to help businesses and individuals find the perfect AI solutions for their needs. We feature detailed reviews, comparisons, and insights on the latest AI tools across various categories including image generation, video creation, writing assistance, and coding tools."
  },
  {
    question: "How do you evaluate and rank AI tools?",
    answer: "We evaluate AI tools based on multiple criteria including functionality, ease of use, pricing, customer support, user reviews, and overall value proposition. Our team of experts tests each tool extensively and provides unbiased reviews to help you make informed decisions."
  },
  {
    question: "Are the AI tools listed here free?",
    answer: "We feature both free and paid AI tools. Each tool listing clearly indicates the pricing structure, including free tiers, trial periods, and subscription costs. Many tools offer free versions with limited features, while premium versions unlock advanced capabilities."
  },
  {
    question: "How often is the directory updated?",
    answer: "Our directory is updated regularly with new tools, updated reviews, and the latest pricing information. We continuously monitor the AI landscape to ensure our users have access to the most current and comprehensive information available."
  },
  {
    question: "Can I suggest a tool to be added to the directory?",
    answer: "Absolutely! We welcome suggestions for new AI tools to review and add to our directory. You can contact us through our contact form with details about the tool you'd like us to consider. We review all submissions and add tools that meet our quality standards."
  }
]

export const aiToolsFAQs: FAQ[] = [
  {
    question: "What types of AI tools do you feature?",
    answer: "We feature AI tools across multiple categories including AI image generators (like DALL-E, Midjourney), video creation tools (like Runway, Synthesia), writing assistants (like ChatGPT, Jasper), coding assistants (like GitHub Copilot, Codeium), and many more specialized AI applications."
  },
  {
    question: "How do I choose the right AI tool for my needs?",
    answer: "Consider your specific use case, budget, technical requirements, and desired features. Our detailed reviews include pros and cons, use cases, and comparisons to help you make the best choice. You can also use our search and filter features to narrow down options based on your criteria."
  },
  {
    question: "Do these AI tools require technical expertise?",
    answer: "Most modern AI tools are designed to be user-friendly and don't require extensive technical knowledge. However, some advanced tools may have a learning curve. Our reviews always mention the skill level required and provide guidance on getting started."
  },
  {
    question: "Are there any risks in using AI tools?",
    answer: "While AI tools are generally safe to use, it's important to consider data privacy, accuracy of outputs, and compliance with your industry regulations. We highlight any important considerations in our reviews and recommend reading the terms of service for each tool."
  }
]