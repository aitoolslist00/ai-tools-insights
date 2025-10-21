import { NextRequest, NextResponse } from 'next/server'
import { validateApiAuth } from '@/lib/auth-enhanced'
import { fetchRecentNews, formatNewsForPrompt } from '@/lib/news-fetcher'
import { GoogleBotAnalyzer } from '@/lib/google-bot-analyzer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * AI CONTENT REGENERATION BASED ON GOOGLE BOT FINDINGS
 * Regenerates article to achieve 95%+ Google Bot readability for main keyword
 * Uses Gemini API + News API with focus on keyword clarity
 */

interface ContentRegenerationRequest {
  originalContent: {
    title: string
    content: string
    metaDescription: string
    excerpt: string
    slug: string
    keywords: string[]
  }
  primaryKeyword: string
  googleBotAnalysis?: any
  category: string
  apiKey: string
  targetReadabilityScore?: number
}

interface RegeneratedContent {
  title: string
  content: string
  metaDescription: string
  excerpt: string
  slug: string
  keywords: string[]
  wordCount: number
  readingTime: number
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await validateApiAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: ContentRegenerationRequest = await request.json()
    const {
      originalContent,
      primaryKeyword,
      googleBotAnalysis,
      category,
      apiKey,
      targetReadabilityScore = 95
    } = body

    // Validate required fields
    if (!primaryKeyword?.trim()) {
      return NextResponse.json({ error: 'Primary keyword is required' }, { status: 400 })
    }

    if (!originalContent?.content) {
      return NextResponse.json({ error: 'Original content is required' }, { status: 400 })
    }

    if (!apiKey?.trim()) {
      return NextResponse.json({ error: 'Gemini API key is required' }, { status: 400 })
    }

    console.log(`🔄 Starting content regeneration for keyword: "${primaryKeyword}"`)
    console.log(`🎯 Target readability score: ${targetReadabilityScore}%`)

    // Get real-time news data
    console.log(`📰 Fetching fresh news data for keyword...`)
    const newsData = await fetchRecentNews(primaryKeyword)
    const newsContext = newsData ? formatNewsForPrompt(newsData) : ''

    // Analyze what Google Bot struggled with
    const analysisInsights = googleBotAnalysis || {}
    const struggledAreas = generateOptimizationFocus(analysisInsights, primaryKeyword)

    // Regenerate content with focus on Google Bot clarity
    const regeneratedContent = await regenerateContentForGoogleBot({
      originalContent,
      primaryKeyword,
      category,
      apiKey,
      newsContext,
      struggledAreas,
      targetReadabilityScore
    })

    // Analyze the regenerated content
    const newAnalysis = GoogleBotAnalyzer.analyzeKeywordUnderstanding(
      regeneratedContent.content,
      regeneratedContent.title,
      primaryKeyword,
      regeneratedContent.metaDescription,
      regeneratedContent.slug
    )

    // Determine improvements
    const improvements = determineImprovements(analysisInsights, newAnalysis)

    return NextResponse.json({
      success: true,
      regeneratedContent,
      improvements,
      readabilityScore: newAnalysis.understandingScore,
      analysis: {
        before: analysisInsights,
        after: newAnalysis
      },
      message: `Content successfully regenerated. Google Bot readability: ${newAnalysis.understandingScore}%`
    })

  } catch (error) {
    console.error('Content regeneration error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    return NextResponse.json({
      success: false,
      error: errorMessage,
      reason: 'Failed to regenerate content'
    }, { status: 500 })
  }
}

/**
 * Analyzes Google Bot findings to determine focus areas for regeneration
 */
function generateOptimizationFocus(analysis: any, keyword: string): string[] {
  const focus: string[] = []

  if (!analysis) {
    return [`Strengthen main keyword "${keyword}" clarity`, 'Improve keyword contextual usage']
  }

  // Analyze based on Google Bot findings
  if (analysis.score && analysis.score < 90) {
    focus.push(`Significantly strengthen main keyword "${keyword}" prominence`)
  }

  if (analysis.improvements) {
    focus.push(...analysis.improvements)
  } else {
    focus.push(`Enhance Google Bot understanding of "${keyword}"`)
    focus.push(`Increase semantic relevance for "${keyword}"`)
    focus.push(`Improve keyword placement and context`)
  }

  return focus.slice(0, 5) // Top 5 focus areas
}

/**
 * Regenerates content with focus on Google Bot keyword understanding
 */
async function regenerateContentForGoogleBot(params: {
  originalContent: any
  primaryKeyword: string
  category: string
  apiKey: string
  newsContext: string
  struggledAreas: string[]
  targetReadabilityScore: number
}): Promise<RegeneratedContent> {
  const {
    originalContent,
    primaryKeyword,
    category,
    apiKey,
    newsContext,
    struggledAreas,
    targetReadabilityScore
  } = params

  // Build optimization focus prompt
  const focusPrompt = struggledAreas.map((area, i) => `${i + 1}. ${area}`).join('\n')

  const prompt = `You are an expert SEO copywriter specializing in Google Bot optimization and keyword clarity. 
Your task is to REGENERATE an existing article to achieve MAXIMUM Google Bot understanding of the main keyword.

CRITICAL OBJECTIVE:
Regenerate this article so that the main keyword "${primaryKeyword}" is crystal clear and highly understandable by Google Bots (target: ${targetReadabilityScore}% clarity score).

${newsContext}

ORIGINAL CONTENT ANALYSIS:
Title: ${originalContent.title}
Keywords: ${originalContent.keywords?.join(', ')}

KEY AREAS TO FOCUS ON FOR GOOGLE BOT OPTIMIZATION:
${focusPrompt}

REGENERATION REQUIREMENTS:

1. **PRIMARY KEYWORD OPTIMIZATION**:
   - Use "${primaryKeyword}" prominently in:
     * Title (within first 7 words)
     * First paragraph (within first 50 words)
     * At least one H2 heading
     * Multiple sections throughout
   - Vary the keyword naturally with synonyms and long-tail variations
   - Ensure semantic consistency around the main keyword

2. **SEMANTIC CLARITY**:
   - Define "${primaryKeyword}" explicitly in the opening
   - Use related terms consistently: ${generateSemanticTerms(primaryKeyword)}
   - Build topical authority around the main keyword
   - Include entity relationships and contextual signals

3. **STRUCTURE & HIERARCHY**:
   - Clear, keyword-focused H1 title
   - Multiple H2 headings that incorporate the keyword naturally
   - At least 8-10 H3 subheadings
   - Logical flow that supports keyword understanding

4. **CONTENT REQUIREMENTS**:
   - Minimum 3,200 words (comprehensive long-form)
   - Category: ${category}
   - Tone: Professional and authoritative
   - Current information based on recent news

5. **GOOGLE BOT SIGNALS**:
   - Include definition and explanation of "${primaryKeyword}"
   - Use structured explanations with keywords in context
   - Add examples demonstrating the keyword concept
   - Include related queries naturally
   - Bold the main keyword in at least 5 key sections

6. **KEYWORD DENSITY & DISTRIBUTION**:
   - Primary keyword: 1.8-2.2% natural density
   - Include 40+ semantic/LSI keywords naturally
   - Add 8-12 long-tail variations
   - Ensure keyword appears in meta descriptions

7. **CONTENT FRESHNESS**:
   - Include recent statistics or developments
   - Reference current tools, versions, or updates
   - Use phrases like "as of 2024", "latest trends", etc.

REGENERATED ARTICLE FORMAT:
Return ONLY valid JSON (no markdown, no extra text) with this exact structure:
{
  "title": "Your SEO-optimized title with keyword",
  "content": "Full regenerated article content with HTML h2/h3 tags for headings",
  "metaDescription": "120-160 character description with keyword",
  "excerpt": "150-200 word engaging excerpt",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "wordCount": number,
  "readingTime": number,
  "keywordClarity": {
    "primaryKeywordCount": number,
    "semanticTermsCount": number,
    "focusAreasAddressed": ["area1", "area2", "area3"]
  }
}

IMPORTANT:
- Return ONLY the JSON object, nothing else
- Ensure content is 3200+ words
- Make "${primaryKeyword}" unmistakably clear to Google Bots
- Use natural language - avoid keyword stuffing
- Include comprehensive, authoritative information`

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    console.log('📝 Calling Gemini 2.5 Flash for content regeneration...')

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    console.log('✅ Gemini response received, parsing content...')

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse Gemini response as JSON')
    }

    const parsedContent = JSON.parse(jsonMatch[0])

    // Calculate reading time
    const wordCount = (parsedContent.content?.match(/\b\w+\b/g) || []).length
    const readingTime = Math.ceil(wordCount / 200)

    return {
      title: parsedContent.title || originalContent.title,
      content: parsedContent.content || originalContent.content,
      metaDescription: parsedContent.metaDescription || originalContent.metaDescription,
      excerpt: parsedContent.excerpt || originalContent.excerpt,
      slug: originalContent.slug,
      keywords: parsedContent.keywords || originalContent.keywords,
      wordCount,
      readingTime
    }

  } catch (error) {
    console.error('Gemini regeneration error:', error)
    throw error
  }
}

/**
 * Generates semantic terms related to the primary keyword
 */
function generateSemanticTerms(keyword: string): string {
  const semanticMap: { [key: string]: string } = {
    // AI related
    'ai': 'artificial intelligence, machine learning, deep learning, neural networks',
    'machine learning': 'ML, supervised learning, unsupervised learning, algorithms',
    'chatbot': 'conversational AI, dialogue system, chatting bot, AI assistant',
    'image generator': 'text-to-image, image synthesis, image creation, visual generation',
    'automation': 'automatic, automate, process automation, workflow automation',

    // General fallback
    'default': 'related concepts, associated terms, connected ideas, relevant aspects'
  }

  const lowerKeyword = keyword.toLowerCase()
  for (const [key, value] of Object.entries(semanticMap)) {
    if (lowerKeyword.includes(key)) {
      return value
    }
  }

  return 'related terms, associated concepts, relevant keywords, contextual phrases'
}

/**
 * Determines improvements made from regeneration
 */
function determineImprovements(beforeAnalysis: any, afterAnalysis: any): string[] {
  const improvements: string[] = []

  // Check keyword clarity improvement
  if (beforeAnalysis?.score && afterAnalysis?.understandingScore) {
    const improvement = afterAnalysis.understandingScore - beforeAnalysis.score
    if (improvement > 0) {
      improvements.push(`Keyword clarity improved by ${improvement.toFixed(1)}%`)
    }
  }

  // Check specific improvements
  if (beforeAnalysis?.improvements) {
    improvements.push(...beforeAnalysis.improvements.slice(0, 3))
  }

  if (improvements.length === 0) {
    improvements.push(
      'Keyword placement optimized',
      'Semantic structure enhanced',
      'Content clarity improved for Google Bot interpretation'
    )
  }

  return improvements
}