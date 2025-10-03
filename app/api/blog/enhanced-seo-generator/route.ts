import { NextRequest, NextResponse } from 'next/server'
import { validateApiAuth } from '@/lib/auth-enhanced'

/**
 * ENHANCED AI SEO CONTENT GENERATOR
 * Complete workflow for generating SEO-optimized content with Gemini 2.5 Flash
 */

interface ContentGenerationRequest {
  keyword: string
  category?: string
  apiKey: string
  workflow: 'complete' | 'content-only'
  additionalContext?: string
  targetAudience?: string
  contentLength?: 'short' | 'medium' | 'long'
  tone?: 'professional' | 'casual' | 'technical' | 'friendly'
}

interface GeneratedContent {
  title: string
  content: string
  metaDescription: string
  keywords: string[]
  slug: string
  excerpt: string
  readingTime: number
  wordCount: number
  headings: string[]
  internalLinks: string[]
  externalLinks: string[]
  imagePrompts: string[]
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await validateApiAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: ContentGenerationRequest = await request.json()
    const { keyword, category, apiKey, workflow = 'complete', additionalContext, targetAudience, contentLength = 'long', tone = 'professional' } = body

    if (!keyword?.trim()) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 })
    }

    if (!apiKey?.trim()) {
      return NextResponse.json({ error: 'Gemini API key is required' }, { status: 400 })
    }

    // Generate comprehensive SEO-optimized content
    const generatedContent = await generateEnhancedSEOContent({
      keyword: keyword.trim(),
      category: category || 'ai-tools',
      apiKey: apiKey.trim(),
      additionalContext,
      targetAudience,
      contentLength,
      tone
    })

    // Add publication date and recency metadata
    const publicationDate = new Date()
    const enhancedContent = {
      ...generatedContent,
      publicationDate: publicationDate.toISOString(),
      lastUpdated: publicationDate.toISOString(),
      recencyScore: 100, // Fresh content gets maximum recency score
      contentFreshness: 'latest'
    }

    return NextResponse.json({
      success: true,
      content: enhancedContent,
      timestamp: publicationDate.toISOString(),
      workflow: workflow,
      recencyMetadata: {
        generatedOn: publicationDate.toISOString(),
        contentType: 'fresh',
        recencyEmphasis: true
      }
    })

  } catch (error) {
    console.error('Enhanced SEO generation error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    // Log detailed error information
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      type: typeof error,
      error: error
    })
    
    return NextResponse.json({
      success: false,
      error: errorMessage.includes('API_KEY') ? 'Invalid or expired Gemini API key' : 'Failed to generate content',
      details: process.env.NODE_ENV === 'development' ? {
        message: errorMessage,
        stack: errorStack
      } : undefined
    }, { status: 500 })
  }
}

async function generateEnhancedSEOContent(params: {
  keyword: string
  category: string
  apiKey: string
  additionalContext?: string
  targetAudience?: string
  contentLength: 'short' | 'medium' | 'long'
  tone: string
}): Promise<GeneratedContent> {
  const { keyword, category, apiKey, additionalContext, targetAudience, contentLength, tone } = params

  // Determine content specifications based on length
  const contentSpecs = {
    short: { minWords: 800, maxWords: 1200, sections: 4 },
    medium: { minWords: 1200, maxWords: 2000, sections: 6 },
    long: { minWords: 2000, maxWords: 3500, sections: 8 }
  }

  const specs = contentSpecs[contentLength]

  // Get current date for recency emphasis
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' })
  const formattedDate = `${currentMonth} ${currentYear}`

  // Enhanced prompt for comprehensive SEO content with emphasis on recency
  const prompt = `You are an expert SEO content writer. Create a comprehensive, SEO-optimized article about "${keyword}" with the most current and up-to-date information available.

CRITICAL RECENCY REQUIREMENTS:
- ALL information must be current and reflect the latest state of the topic
- Include the newest developments, updates, and trends in the field
- Reference recent changes, new features, or industry developments
- Avoid outdated information or deprecated practices
- Focus on what's LATEST and MOST CURRENT
- Include recent statistics, data, and market insights
- Mention latest versions, updates, or releases where applicable
- Write as if this is the most current source available

CONTENT REQUIREMENTS:
- Target keyword: "${keyword}"
- Category: "${category}"
- Content length: ${specs.minWords}-${specs.maxWords} words
- Tone: ${tone}
- Target audience: ${targetAudience || 'professionals and enthusiasts interested in AI tools'}
- Additional context: ${additionalContext || 'Focus on practical applications and current trends'}

CONTENT STRUCTURE:
1. Compelling, SEO-optimized title (50-60 characters) - focus on value, not dates
2. Engaging introduction with hook, keyword placement, and emphasis on current relevance
3. ${specs.sections} main sections with H2 headings focusing on latest information
4. Subsections with H3 headings covering recent developments
5. Conclusion with call-to-action and future outlook
6. FAQ section (5 questions) addressing current concerns and recent changes

IMPORTANT: Do not force dates into titles or content unless they are naturally relevant to the topic. Focus on providing the most current information without making the content sound date-heavy or unprofessional.

SEO OPTIMIZATION REQUIREMENTS:
- Primary keyword density: 1-2%
- Include semantic keywords and LSI terms
- Use keyword in title, first paragraph, headings, and conclusion
- Write compelling meta description (150-160 characters) highlighting recency
- Include internal linking opportunities
- Add external link suggestions to authoritative and recently updated sources
- Suggest relevant images with alt text descriptions

CONTENT QUALITY STANDARDS FOR RECENCY:
- Original, engaging, and informative content with latest insights
- Clear, scannable structure with bullet points and lists
- Actionable insights based on current best practices
- Most recent information and trends available
- Expert-level depth covering latest developments
- Strong E-A-T signals with current expertise and authority
- Include recent case studies, examples, or success stories
- Address current challenges and solutions in the field
- Provide forward-looking insights and predictions for the near future

RESEARCH DEPTH REQUIREMENTS:
- Conduct thorough analysis of current market conditions
- Include latest industry reports and findings
- Reference recent expert opinions and thought leadership
- Cover emerging trends and technologies
- Analyze recent competitive landscape changes
- Provide current pricing, features, and availability information

FORMAT YOUR RESPONSE AS JSON:
{
  "title": "SEO-optimized title",
  "metaDescription": "Compelling meta description",
  "slug": "url-friendly-slug",
  "excerpt": "Brief article summary",
  "content": "Full article content in markdown format",
  "keywords": ["primary keyword", "secondary keywords", "LSI keywords"],
  "headings": ["H2 and H3 headings used"],
  "internalLinks": ["suggested internal link opportunities"],
  "externalLinks": ["authoritative external sources to link"],
  "imagePrompts": ["descriptions for relevant images"],
  "readingTime": estimated_reading_time_in_minutes,
  "wordCount": actual_word_count
}

Create content that will rank #1 on Google for "${keyword}" while providing genuine, current value to readers. The article must be so up-to-date and comprehensive that readers will consider it the most authoritative and current source on the topic. Ensure every piece of information is current, relevant, and valuable. Focus on substance and value rather than explicit date references.`

  // Call Gemini API with multiple model fallbacks
  const models = [
    'gemini-2.5-flash-002',
    'gemini-2.5-flash',
    'gemini-2.0-flash-exp',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
  ]

  let lastError: { error: string; model: string } | null = null

  for (const model of models) {
    try {
      console.log(`Trying model: ${model}`)
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
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
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH", 
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`HTTP ${response.status}: ${errorData.error?.message || 'API request failed'}`)
      }

      const data = await response.json()
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('No content generated by AI model')
      }

      const generatedText = data.candidates[0].content.parts[0].text
      
      console.log('Generated text from AI:', generatedText.substring(0, 500) + '...')
      
      // Parse JSON response
      let contentData: GeneratedContent
      try {
        // Extract JSON from response (handle potential markdown formatting)
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
          console.error('No JSON found in AI response:', generatedText)
          throw new Error('No valid JSON found in response')
        }
        
        console.log('Extracted JSON:', jsonMatch[0].substring(0, 200) + '...')
        contentData = JSON.parse(jsonMatch[0])
        
        // Validate required fields
        if (!contentData.title || !contentData.content || !contentData.metaDescription) {
          throw new Error('Generated content missing required fields')
        }

        // Generate slug if not provided
        if (!contentData.slug) {
          contentData.slug = contentData.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
        }

        // Calculate reading time and word count if not provided
        const wordCount = contentData.content.split(/\s+/).length
        contentData.wordCount = wordCount
        contentData.readingTime = Math.ceil(wordCount / 200)

        // Ensure arrays exist
        contentData.keywords = contentData.keywords || [keyword]
        contentData.headings = contentData.headings || []
        contentData.internalLinks = contentData.internalLinks || []
        contentData.externalLinks = contentData.externalLinks || []
        contentData.imagePrompts = contentData.imagePrompts || []

        return contentData

      } catch (parseError) {
        throw new Error(`Failed to parse AI response: ${parseError instanceof Error ? parseError.message : 'Invalid JSON'}`)
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      lastError = { error: errorMessage, model }
      
      console.error(`Model ${model} failed:`, {
        error: errorMessage,
        model,
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error
      })
      continue
    }
  }

  // If all models failed, throw the last error
  throw new Error(`All AI models failed. Last error with ${lastError?.model}: ${lastError?.error}`)
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Enhanced SEO Content Generator API',
    version: '2.0',
    features: [
      'Gemini 2.5 Flash integration',
      'Multi-model fallback system',
      'Comprehensive SEO optimization',
      'Advanced content structure',
      'Schema-ready output',
      'Internal/external link suggestions',
      'Image prompt generation'
    ],
    models: [
      'gemini-2.5-flash-002',
      'gemini-2.5-flash',
      'gemini-2.0-flash-exp',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-pro'
    ]
  })
}