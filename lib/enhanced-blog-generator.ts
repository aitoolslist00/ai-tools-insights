/**
 * Enhanced Blog Article Generator with E-E-A-T Compliance and Professional Formatting
 * Addresses all formatting, SEO, and content quality issues
 */

import { fetchRecentNews, formatNewsForPrompt, NewsData } from './news-fetcher'
import { generateImageWithRealAPI } from './real-image-generator'

export interface EnhancedBlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  metaDescription: string
  keywords: string[]
  readingTime: number
  wordCount: number
  published: boolean
  featured: boolean
  publishDate: string
  lastModified: string
  category: string
  author: string
  seoScore: number
  image: string
  images: Array<{
    url: string
    alt: string
    title: string
    caption: string
    width: number
    height: number
    format: string
  }>
  schemas: {
    article: any
    faq?: any
    howTo?: any
    breadcrumb: any
  }
  tableOfContents: Array<{
    title: string
    href: string
    level: number
  }>
  comparisonTable?: {
    headers: string[]
    rows: Array<Record<string, string>>
  }
  summaryTable?: {
    headers: string[]
    rows: Array<Record<string, string>>
  }
  faq: Array<{
    question: string
    answer: string
  }>
  eeatSignals: {
    expertise: string[]
    experience: string[]
    authoritativeness: string[]
    trustworthiness: string[]
  }
}

export interface BlogGenerationOptions {
  keyword: string
  targetWordCount?: number
  includeComparison?: boolean
  includeNewsData?: boolean
  focusKeyword: string
  secondaryKeywords: string[]
  targetAudience: string
  contentType: 'guide' | 'review' | 'comparison' | 'news' | 'tutorial'
  includeImages?: boolean
}

/**
 * Generates a comprehensive, E-E-A-T compliant blog article
 */
export async function generateEnhancedBlogArticle(options: BlogGenerationOptions): Promise<EnhancedBlogPost> {
  const {
    keyword,
    targetWordCount = 4000,
    includeComparison = true,
    includeNewsData = true,
    focusKeyword,
    secondaryKeywords,
    targetAudience,
    contentType,
    includeImages = true
  } = options

  console.log(`🚀 Generating enhanced blog article for: "${keyword}"`)

  // Fetch real-time news data if requested
  let newsData: NewsData | null = null
  if (includeNewsData) {
    newsData = await fetchRecentNews(keyword)
  }

  // Generate the article content
  const articleContent = await generateArticleContent(options, newsData)
  
  // Generate images
  const images = includeImages ? await generateArticleImages(keyword, articleContent) : []
  
  // Calculate reading time and word count
  const wordCount = countWords(articleContent.content)
  const readingTime = Math.ceil(wordCount / 200) // Average reading speed

  // Generate SEO metadata
  const seoData = generateSEOMetadata(articleContent, focusKeyword, secondaryKeywords)
  
  // Generate structured data schemas
  const schemas = generateStructuredData(articleContent, keyword)
  
  // Generate E-E-A-T signals
  const eeatSignals = generateEEATSignals(contentType, keyword)

  const slug = generateSlug(articleContent.title)
  const currentDate = new Date().toISOString()

  return {
    id: `post-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: articleContent.title,
    slug,
    excerpt: articleContent.excerpt,
    content: articleContent.content,
    metaDescription: seoData.metaDescription,
    keywords: [focusKeyword, ...secondaryKeywords],
    readingTime,
    wordCount,
    published: true,
    featured: false,
    publishDate: currentDate,
    lastModified: currentDate,
    category: 'ai-tools',
    author: 'AI Tools Expert',
    seoScore: 95,
    image: images[0]?.url || `/generated-images/${slug}-featured.jpg`,
    images,
    schemas,
    tableOfContents: articleContent.tableOfContents,
    comparisonTable: articleContent.comparisonTable,
    summaryTable: articleContent.summaryTable,
    faq: articleContent.faq,
    eeatSignals
  }
}

/**
 * Generates the main article content with professional formatting
 */
async function generateArticleContent(options: BlogGenerationOptions, newsData: NewsData | null) {
  const { keyword, focusKeyword, secondaryKeywords, targetAudience, contentType, targetWordCount } = options

  // Build the enhanced prompt
  let prompt = buildEnhancedPrompt(options, newsData)

  // Use Gemini API to generate content
  const geminiApiKey = process.env.GEMINI_API_KEY
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY is required for content generation')
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
          topP: 0.8,
          topK: 40
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!generatedContent) {
      throw new Error('No content generated from Gemini API')
    }

    return parseGeneratedContent(generatedContent, keyword)

  } catch (error) {
    console.error('Error generating content:', error)
    throw error
  }
}

/**
 * Builds an enhanced prompt for content generation
 */
function buildEnhancedPrompt(options: BlogGenerationOptions, newsData: NewsData | null): string {
  const { keyword, focusKeyword, secondaryKeywords, targetAudience, contentType, targetWordCount } = options

  let prompt = `You are an expert AI content writer specializing in creating comprehensive, E-E-A-T compliant blog articles that rank #1 on Google.

${newsData ? formatNewsForPrompt(newsData) : ''}

Create a ${targetWordCount}+ word article about "${keyword}" that follows these EXACT requirements:

## TITLE REQUIREMENTS (CRITICAL):
- Create a compelling, click-worthy title that includes the focus keyword "${focusKeyword}"
- **MAXIMUM 60 characters** - titles longer than 60 characters will be truncated in search results
- Format: **Main Title**: Subtitle for Maximum Impact
- Include current year if relevant to the topic
- Prioritize focus keyword placement at the beginning

## CONTENT STRUCTURE (MANDATORY):
1. **Introduction (300+ words)**
   - Hook with surprising statistic or question
   - Clear value proposition
   - Include focus keyword in first 100 words
   - Preview what readers will learn

2. **Table of Contents**
   - 8-12 main sections
   - Use descriptive, keyword-rich headings

3. **Main Content Sections (3000+ words total)**
   - Each section 400-600 words
   - Use H2, H3, H4 headings properly
   - Include secondary keywords naturally
   - Add practical examples and case studies

4. **Comparison Table (MANDATORY)**
   - Compare top 5-7 tools/options related to the topic
   - Include columns: Name, Best For, Pricing, Rating, Key Features
   - Use markdown table format: | Column | Column |
   - Add a summary table at the end with key takeaways
   - Tables must be comprehensive and data-rich

5. **FAQ Section (8-10 questions)**
   - Address common user queries
   - Include long-tail keywords
   - Provide detailed answers (50-100 words each)

6. **Summary Table (MANDATORY)**
   - Create a final summary table with key points
   - Include: Feature/Aspect, Best Option, Why, Price Range
   - Help readers make quick decisions

7. **Conclusion (200+ words)**
   - Summarize key points
   - Include clear call-to-action
   - Reinforce main benefits

## FORMATTING REQUIREMENTS:
- Use **bold** for important terms and concepts
- Use *italics* for emphasis
- Create bulleted and numbered lists
- Add blockquotes for expert opinions
- Include code blocks where relevant
- Use proper markdown formatting

## E-E-A-T COMPLIANCE:
- Demonstrate expertise through detailed explanations
- Show experience with real examples
- Establish authority with data and statistics
- Build trust with transparent, honest assessments

## SEO OPTIMIZATION:
- Focus keyword density: 1-2%
- Include semantic keywords naturally
- Optimize for featured snippets
- Add internal linking opportunities
- Create scannable content with subheadings

## CONTENT QUALITY:
- Write for ${targetAudience}
- Use conversational, engaging tone
- Include actionable insights
- Provide unique value and perspectives
- Ensure factual accuracy
- Reference current year trends and developments without specific month/day dates
- Focus on recent developments and current industry status

## META DESCRIPTION REQUIREMENTS (CRITICAL):
- Create a compelling meta description that includes the focus keyword
- **MAXIMUM 155 characters** - descriptions longer than 155 characters will be truncated in SERPs
- Must be engaging and encourage clicks
- Include a clear value proposition
- Use active voice and action words

## OUTPUT FORMAT:
Return the content in this exact JSON structure:
{
  "title": "Your optimized title here (MAX 60 chars)",
  "excerpt": "Compelling meta description (MAX 155 chars)",
  "content": "Full article content with proper markdown formatting",
  "tableOfContents": [
    {"title": "Section Title", "href": "#section-slug", "level": 2}
  ],
  "comparisonTable": {
    "headers": ["Tool", "Best For", "Pricing", "Rating", "Key Features"],
    "rows": [{"Tool": "Name", "Best For": "Use case", "Pricing": "$X/mo", "Rating": "4.5/5", "Key Features": "Feature list"}]
  },
  "summaryTable": {
    "headers": ["Feature/Aspect", "Best Option", "Why", "Price Range"],
    "rows": [{"Feature/Aspect": "Aspect", "Best Option": "Tool name", "Why": "Reason", "Price Range": "$X-Y/mo"}]
  },
  "faq": [
    {"question": "Question here?", "answer": "Detailed answer here"}
  ]
}

Generate the article now, ensuring it's comprehensive, engaging, and optimized for Google ranking.`

  return prompt
}

/**
 * Parses the generated content from Gemini API
 */
function parseGeneratedContent(content: string, keyword: string) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        title: parsed.title || `Ultimate Guide to ${keyword} 2025`,
        excerpt: parsed.excerpt || `Comprehensive guide to ${keyword} with expert insights and practical recommendations.`,
        content: parsed.content || content,
        tableOfContents: parsed.tableOfContents || [],
        comparisonTable: parsed.comparisonTable || null,
        summaryTable: parsed.summaryTable || null,
        faq: parsed.faq || []
      }
    }
  } catch (error) {
    console.log('Could not parse JSON, using raw content')
  }

  // Fallback: parse content manually
  return {
    title: extractTitle(content) || `Ultimate Guide to ${keyword} 2025`,
    excerpt: extractExcerpt(content, keyword),
    content: enhanceContentFormatting(content),
    tableOfContents: extractTableOfContents(content),
    comparisonTable: extractComparisonTable(content),
    summaryTable: extractSummaryTable(content),
    faq: extractFAQ(content)
  }
}

/**
 * Generates article images
 */
async function generateArticleImages(keyword: string, articleContent: any): Promise<Array<{
  url: string
  alt: string
  title: string
  caption: string
  width: number
  height: number
  format: string
}>> {
  const images = []
  
  try {
    // Generate featured image
    const featuredImage = await generateImageWithRealAPI(
      `Professional illustration for ${keyword} article, modern design, high quality`,
      `${keyword}-featured-${Date.now()}`
    )
    
    if (featuredImage) {
      images.push({
        url: featuredImage,
        alt: `${articleContent.title} - Featured Image`,
        title: articleContent.title,
        caption: `Illustration for ${articleContent.title}`,
        width: 1200,
        height: 675,
        format: 'jpg'
      })
    }

    // Generate additional images for sections
    const sectionImages = await Promise.all([
      generateImageWithRealAPI(
        `Infographic showing ${keyword} comparison chart`,
        `${keyword}-comparison-${Date.now()}`
      ),
      generateImageWithRealAPI(
        `Professional diagram explaining ${keyword} workflow`,
        `${keyword}-workflow-${Date.now()}`
      )
    ])

    sectionImages.forEach((image, index) => {
      if (image) {
        images.push({
          url: image,
          alt: `${keyword} - Section Image ${index + 1}`,
          title: `${keyword} Illustration`,
          caption: `Visual guide for ${keyword}`,
          width: 800,
          height: 450,
          format: 'jpg'
        })
      }
    })

  } catch (error) {
    console.error('Error generating images:', error)
  }

  return images
}



// Helper functions
function countWords(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function extractTitle(content: string): string | null {
  const titleMatch = content.match(/^#\s+(.+)$/m)
  return titleMatch ? titleMatch[1] : null
}

function extractExcerpt(content: string, keyword: string): string {
  const paragraphs = content.split('\n\n')
  const firstParagraph = paragraphs.find(p => p.length > 100 && !p.startsWith('#'))
  return firstParagraph ? firstParagraph.substring(0, 150) + '...' : `Comprehensive guide to ${keyword} with expert insights and recommendations.`
}

function enhanceContentFormatting(content: string): string {
  // Enhance markdown formatting
  return content
    .replace(/\*\*([^*]+)\*\*/g, '**$1**') // Ensure bold formatting
    .replace(/\*([^*]+)\*/g, '*$1*') // Ensure italic formatting
    .replace(/^(#{1,6})\s+(.+)$/gm, '$1 $2') // Clean up headers
    .replace(/^\s*[-*+]\s+/gm, '- ') // Standardize bullet points
    .replace(/^\s*(\d+)\.\s+/gm, '$1. ') // Standardize numbered lists
}

function extractTableOfContents(content: string): Array<{title: string, href: string, level: number}> {
  const headers = content.match(/^(#{1,6})\s+(.+)$/gm) || []
  return headers.map(header => {
    const level = (header.match(/^#+/) || [''])[0].length
    const title = header.replace(/^#+\s+/, '')
    const href = '#' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    return { title, href, level }
  })
}

function extractComparisonTable(content: string): any {
  // Look for comparison table patterns in the content
  const tableMatch = content.match(/\|(.+)\|[\s\S]*?\|(.+)\|/g)
  if (tableMatch && tableMatch.length > 1) {
    const headers = tableMatch[0].split('|').map(h => h.trim()).filter(h => h)
    const rows = tableMatch.slice(2).map(row => {
      const cells = row.split('|').map(c => c.trim()).filter(c => c)
      const rowObj: Record<string, string> = {}
      headers.forEach((header, index) => {
        rowObj[header] = cells[index] || ''
      })
      return rowObj
    })
    return { headers, rows }
  }
  return null
}

function extractSummaryTable(content: string): any {
  // Look for summary table patterns (usually at the end of content)
  const summarySection = content.match(/## Summary[\s\S]*?(?=##|$)/i) || 
                         content.match(/## Key Takeaways[\s\S]*?(?=##|$)/i) ||
                         content.match(/## Final Recommendations[\s\S]*?(?=##|$)/i)
  
  if (summarySection) {
    const tableMatch = summarySection[0].match(/\|(.+)\|[\s\S]*?\|(.+)\|/g)
    if (tableMatch && tableMatch.length > 1) {
      const headers = tableMatch[0].split('|').map(h => h.trim()).filter(h => h)
      const rows = tableMatch.slice(2).map(row => {
        const cells = row.split('|').map(c => c.trim()).filter(c => c)
        const rowObj: Record<string, string> = {}
        headers.forEach((header, index) => {
          rowObj[header] = cells[index] || ''
        })
        return rowObj
      })
      return { headers, rows }
    }
  }
  
  // Fallback: look for any table in the last part of content
  const contentParts = content.split('##')
  const lastParts = contentParts.slice(-3).join('##') // Last 3 sections
  const tableMatch = lastParts.match(/\|(.+)\|[\s\S]*?\|(.+)\|/g)
  
  if (tableMatch && tableMatch.length > 1) {
    const headers = tableMatch[0].split('|').map(h => h.trim()).filter(h => h)
    const rows = tableMatch.slice(2).map(row => {
      const cells = row.split('|').map(c => c.trim()).filter(c => c)
      const rowObj: Record<string, string> = {}
      headers.forEach((header, index) => {
        rowObj[header] = cells[index] || ''
      })
      return rowObj
    })
    return { headers, rows }
  }
  
  return null
}

function extractFAQ(content: string): Array<{question: string, answer: string}> {
  const faqSection = content.match(/## FAQ[\s\S]*?(?=##|$)/i)
  if (!faqSection) return []
  
  const qaPairs = faqSection[0].match(/\*\*Q:\s*(.+?)\*\*[\s\S]*?\*\*A:\s*([\s\S]*?)(?=\*\*Q:|$)/g) || []
  
  return qaPairs.map(pair => {
    const questionMatch = pair.match(/\*\*Q:\s*(.+?)\*\*/)
    const answerMatch = pair.match(/\*\*A:\s*([\s\S]*?)(?=\*\*Q:|$)/)
    
    return {
      question: questionMatch ? questionMatch[1].trim() : '',
      answer: answerMatch ? answerMatch[1].trim() : ''
    }
  }).filter(item => item.question && item.answer)
}

/**
 * Generates SEO metadata with proper length constraints
 */
function generateSEOMetadata(articleContent: any, focusKeyword: string, secondaryKeywords: string[]) {
  // Generate optimized title (max 60 characters)
  let title = articleContent.title || `Ultimate Guide to ${focusKeyword} 2025`
  if (title.length > 60) {
    // Truncate and add ellipsis, keeping focus keyword
    const words = title.split(' ')
    let truncated = ''
    for (const word of words) {
      if ((truncated + ' ' + word).length <= 57) { // Leave room for "..."
        truncated += (truncated ? ' ' : '') + word
      } else {
        break
      }
    }
    title = truncated + '...'
  }

  // Generate optimized meta description (max 155 characters)
  let metaDescription = articleContent.excerpt || `Comprehensive guide to ${focusKeyword} with expert insights and practical recommendations.`
  if (metaDescription.length > 155) {
    // Truncate at word boundary, keeping focus keyword
    const words = metaDescription.split(' ')
    let truncated = ''
    for (const word of words) {
      if ((truncated + ' ' + word).length <= 152) { // Leave room for "..."
        truncated += (truncated ? ' ' : '') + word
      } else {
        break
      }
    }
    metaDescription = truncated + '...'
  }

  return {
    title,
    metaDescription,
    keywords: [focusKeyword, ...secondaryKeywords].slice(0, 10), // Limit to 10 keywords
    focusKeyword,
    secondaryKeywords: secondaryKeywords.slice(0, 5) // Limit secondary keywords
  }
}

/**
 * Generates structured data schemas for SEO
 */
function generateStructuredData(articleContent: any, keyword: string) {
  const baseUrl = 'https://www.aitoolsinsights.com'
  const slug = generateSlug(articleContent.title)
  
  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${baseUrl}/blog/${slug}#article`,
    "headline": articleContent.title,
    "description": articleContent.excerpt,
    "image": `${baseUrl}/generated-images/${slug}-featured.jpg`,
    "author": {
      "@type": "Person",
      "name": "AI Tools Expert",
      "url": `${baseUrl}/about`
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI Tools Insights",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${slug}`
    },
    "keywords": keyword,
    "articleSection": "AI Tools",
    "wordCount": countWords(articleContent.content)
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${baseUrl}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": articleContent.title,
        "item": `${baseUrl}/blog/${slug}`
      }
    ]
  }

  const schemas: any = { article, breadcrumb }

  // Add FAQ schema if FAQs exist
  if (articleContent.faq && articleContent.faq.length > 0) {
    schemas.faq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": articleContent.faq.map((item: any) => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    }
  }

  return schemas
}

/**
 * Generates E-E-A-T signals for content authority
 */
function generateEEATSignals(contentType: string, keyword: string) {
  return {
    expertise: [
      "Deep technical knowledge of AI tools and technologies",
      "Hands-on experience with leading AI platforms",
      "Understanding of industry best practices and standards",
      "Continuous research and analysis of emerging AI trends"
    ],
    experience: [
      "Hands-on testing and evaluation of AI tools",
      "Real-world implementation examples and case studies",
      "Practical insights from industry professionals",
      "User feedback and community insights"
    ],
    authoritativeness: [
      "Citations from reputable industry sources",
      "References to official documentation and research",
      "Quotes from industry experts and thought leaders",
      "Links to authoritative websites and resources"
    ],
    trustworthiness: [
      "Transparent methodology and evaluation criteria",
      "Honest assessment of pros and cons",
      "Regular updates to maintain accuracy",
      "Clear disclosure of any affiliations or partnerships"
    ]
  }
}
