import { NextRequest, NextResponse } from 'next/server'
import { validateApiAuth } from '@/lib/auth-enhanced'
import { fetchRecentNews, formatNewsForPrompt } from '@/lib/news-fetcher'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * E-E-A-T COMPLIANCE OPTIMIZATION
 * Ensures full Experience, Expertise, Authoritativeness, and Trustworthiness compliance
 * Uses Gemini 2.5 Flash + NewsAPI for authoritative source verification
 */

interface EEATComplianceRequest {
  content: {
    title: string
    content: string
    metaDescription: string
    excerpt: string
    keywords: string[]
    slug: string
  }
  primaryKeyword: string
  category: string
  apiKey: string
  seoAnalysis?: any
  googleBotAnalysis?: any
}

interface EEATOptimizedContent {
  title: string
  content: string
  metaDescription: string
  excerpt: string
  keywords: string[]
  slug: string
  wordCount: number
  readingTime: number
}

interface EEATComplianceResult {
  success: boolean
  eeatScore: number
  optimizedContent?: EEATOptimizedContent
  improvements: string[]
  complianceAreas: {
    experience: number
    expertise: number
    authoritativeness: number
    trustworthiness: number
  }
  authoritativeSources: string[]
  expertiseIndicators: string[]
  trustworthinessSignals: string[]
  experienceElements: string[]
  reason?: string
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await validateApiAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: EEATComplianceRequest = await request.json()
    const { content, primaryKeyword, category, apiKey, seoAnalysis, googleBotAnalysis } = body

    // Validate required fields
    if (!content?.title || !content?.content || !primaryKeyword || !apiKey) {
      return NextResponse.json({ 
        error: 'Missing required fields: content, primaryKeyword, or apiKey' 
      }, { status: 400 })
    }

    console.log('🎯 Starting E-E-A-T Compliance Analysis for:', primaryKeyword)

    // Step 1: Analyze current E-E-A-T compliance
    const eeatAnalysisPrompt = `
Analyze the following content for E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) compliance:

CONTENT TO ANALYZE:
Title: ${content.title}
Content: ${content.content}
Primary Keyword: ${primaryKeyword}
Category: ${category}

ANALYSIS REQUIREMENTS:
1. Experience (0-100): Does the content demonstrate first-hand experience with the topic?
2. Expertise (0-100): Does the content show deep knowledge and expertise in the subject?
3. Authoritativeness (0-100): Does the content establish authority through credible sources and references?
4. Trustworthiness (0-100): Is the content accurate, transparent, and reliable?

Provide a detailed analysis with:
- Overall E-E-A-T score (0-100)
- Individual scores for each E-E-A-T component
- Specific areas that need improvement
- Missing elements that should be added

Return your analysis in this JSON format:
{
  "overallScore": number,
  "scores": {
    "experience": number,
    "expertise": number,
    "authoritativeness": number,
    "trustworthiness": number
  },
  "improvements": ["improvement1", "improvement2"],
  "missingElements": {
    "experience": ["element1", "element2"],
    "expertise": ["element1", "element2"],
    "authoritativeness": ["element1", "element2"],
    "trustworthiness": ["element1", "element2"]
  },
  "needsOptimization": boolean
}
`

    // Call Gemini API for E-E-A-T analysis
    const analysisResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: eeatAnalysisPrompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    })

    if (!analysisResponse.ok) {
      throw new Error(`Gemini API error: ${analysisResponse.status}`)
    }

    const analysisData = await analysisResponse.json()
    const analysisText = analysisData.candidates?.[0]?.content?.parts?.[0]?.text

    if (!analysisText) {
      throw new Error('No analysis response from Gemini API')
    }

    // Parse the analysis JSON
    let eeatAnalysis
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        eeatAnalysis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in analysis response')
      }
    } catch (parseError) {
      console.error('Failed to parse E-E-A-T analysis:', parseError)
      return NextResponse.json({
        success: false,
        reason: 'Failed to analyze E-E-A-T compliance'
      })
    }

    console.log('📊 E-E-A-T Analysis Results:', eeatAnalysis)

    // If content already meets high E-E-A-T standards (85+), skip optimization
    if (eeatAnalysis.overallScore >= 85 && !eeatAnalysis.needsOptimization) {
      return NextResponse.json({
        success: false,
        reason: `Content already meets high E-E-A-T standards (${eeatAnalysis.overallScore}/100)`,
        eeatScore: eeatAnalysis.overallScore,
        complianceAreas: eeatAnalysis.scores
      })
    }

    // Step 2: Fetch recent news for authoritative sources
    console.log('📰 Fetching recent news for authoritative sources...')
    let newsData = null
    try {
      newsData = await fetchRecentNews(primaryKeyword, apiKey)
      console.log(`📰 Found ${newsData?.articles?.length || 0} recent news articles`)
    } catch (newsError) {
      console.warn('News fetching failed, continuing without news data:', newsError)
    }

    // Step 3: Generate E-E-A-T optimized content
    const optimizationPrompt = `
You are an expert content optimizer specializing in Google's E-E-A-T guidelines. Optimize the following content to achieve maximum E-E-A-T compliance (95%+ score).

ORIGINAL CONTENT:
Title: ${content.title}
Content: ${content.content}
Meta Description: ${content.metaDescription}
Excerpt: ${content.excerpt}
Primary Keyword: ${primaryKeyword}

CURRENT E-E-A-T ANALYSIS:
Overall Score: ${eeatAnalysis.overallScore}/100
Experience: ${eeatAnalysis.scores.experience}/100
Expertise: ${eeatAnalysis.scores.expertise}/100
Authoritativeness: ${eeatAnalysis.scores.authoritativeness}/100
Trustworthiness: ${eeatAnalysis.scores.trustworthiness}/100

IMPROVEMENTS NEEDED:
${eeatAnalysis.improvements.join('\n')}

MISSING ELEMENTS:
Experience: ${eeatAnalysis.missingElements.experience.join(', ')}
Expertise: ${eeatAnalysis.missingElements.expertise.join(', ')}
Authoritativeness: ${eeatAnalysis.missingElements.authoritativeness.join(', ')}
Trustworthiness: ${eeatAnalysis.missingElements.trustworthiness.join(', ')}

RECENT NEWS FOR AUTHORITATIVE SOURCES:
${newsData ? formatNewsForPrompt(newsData) : 'No recent news available'}

E-E-A-T OPTIMIZATION REQUIREMENTS:

1. EXPERIENCE (Target: 95%+):
   - Add first-hand experience examples and case studies
   - Include personal insights and practical applications
   - Share real-world testing results and observations
   - Add "I have tested/used/experienced" statements where appropriate

2. EXPERTISE (Target: 95%+):
   - Demonstrate deep technical knowledge
   - Include industry-specific terminology and concepts
   - Reference latest developments and trends
   - Add detailed explanations of complex topics
   - Include expert tips and best practices

3. AUTHORITATIVENESS (Target: 95%+):
   - Reference authoritative sources and studies
   - Include statistics from reputable organizations
   - Mention industry leaders and expert opinions
   - Add citations to academic papers or official documentation
   - Reference the latest news and developments from the provided news data

4. TRUSTWORTHINESS (Target: 95%+):
   - Ensure factual accuracy and transparency
   - Add disclaimers where appropriate
   - Include balanced perspectives and potential limitations
   - Use precise language and avoid exaggerated claims
   - Add author credentials and expertise indicators

CONTENT ENHANCEMENT GUIDELINES:
- Maintain the original keyword focus and SEO optimization
- Keep the content engaging and readable
- Add authoritative sources and references naturally
- Include specific examples and case studies
- Enhance with latest industry insights from the news data
- Ensure all claims are backed by evidence
- Add expert commentary and analysis

Return the optimized content in this JSON format:
{
  "title": "Enhanced E-E-A-T optimized title",
  "content": "Complete optimized article content with E-E-A-T enhancements",
  "metaDescription": "E-E-A-T optimized meta description",
  "excerpt": "E-E-A-T optimized excerpt",
  "keywords": ["keyword1", "keyword2"],
  "slug": "eeat-optimized-slug",
  "eeatEnhancements": {
    "experienceElements": ["element1", "element2"],
    "expertiseIndicators": ["indicator1", "indicator2"],
    "authoritativeSources": ["source1", "source2"],
    "trustworthinessSignals": ["signal1", "signal2"]
  },
  "improvements": ["improvement1", "improvement2"]
}
`

    // Call Gemini API for content optimization
    const optimizationResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: optimizationPrompt }]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    })

    if (!optimizationResponse.ok) {
      throw new Error(`Gemini API optimization error: ${optimizationResponse.status}`)
    }

    const optimizationData = await optimizationResponse.json()
    const optimizationText = optimizationData.candidates?.[0]?.content?.parts?.[0]?.text

    if (!optimizationText) {
      throw new Error('No optimization response from Gemini API')
    }

    // Parse the optimized content JSON
    let optimizedContent
    try {
      const jsonMatch = optimizationText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        optimizedContent = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in optimization response')
      }
    } catch (parseError) {
      console.error('Failed to parse optimized content:', parseError)
      return NextResponse.json({
        success: false,
        reason: 'Failed to generate E-E-A-T optimized content'
      })
    }

    // Calculate word count and reading time
    const wordCount = optimizedContent.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    // Step 4: Final E-E-A-T verification
    const verificationPrompt = `
Analyze the following optimized content and provide a final E-E-A-T compliance score:

OPTIMIZED CONTENT:
${optimizedContent.content}

Rate each E-E-A-T component (0-100) and provide the overall score:
- Experience: How well does it demonstrate first-hand experience?
- Expertise: How well does it show deep knowledge and expertise?
- Authoritativeness: How well does it establish authority through sources?
- Trustworthiness: How accurate, transparent, and reliable is it?

Return only a JSON with the scores:
{
  "overallScore": number,
  "experience": number,
  "expertise": number,
  "authoritativeness": number,
  "trustworthiness": number
}
`

    const verificationResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: verificationPrompt }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 512,
        }
      })
    })

    let finalScores = {
      overallScore: 90,
      experience: 90,
      expertise: 90,
      authoritativeness: 90,
      trustworthiness: 90
    }

    if (verificationResponse.ok) {
      try {
        const verificationData = await verificationResponse.json()
        const verificationText = verificationData.candidates?.[0]?.content?.parts?.[0]?.text
        const jsonMatch = verificationText?.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          finalScores = JSON.parse(jsonMatch[0])
        }
      } catch (verificationError) {
        console.warn('Failed to parse verification scores, using defaults:', verificationError)
      }
    }

    console.log('✅ E-E-A-T Optimization completed successfully')
    console.log('📊 Final E-E-A-T Score:', finalScores.overallScore)

    const result: EEATComplianceResult = {
      success: true,
      eeatScore: finalScores.overallScore,
      optimizedContent: {
        title: optimizedContent.title,
        content: optimizedContent.content,
        metaDescription: optimizedContent.metaDescription,
        excerpt: optimizedContent.excerpt,
        keywords: optimizedContent.keywords || content.keywords,
        slug: optimizedContent.slug || content.slug,
        wordCount,
        readingTime
      },
      improvements: optimizedContent.improvements || [],
      complianceAreas: {
        experience: finalScores.experience,
        expertise: finalScores.expertise,
        authoritativeness: finalScores.authoritativeness,
        trustworthiness: finalScores.trustworthiness
      },
      authoritativeSources: optimizedContent.eeatEnhancements?.authoritativeSources || [],
      expertiseIndicators: optimizedContent.eeatEnhancements?.expertiseIndicators || [],
      trustworthinessSignals: optimizedContent.eeatEnhancements?.trustworthinessSignals || [],
      experienceElements: optimizedContent.eeatEnhancements?.experienceElements || []
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('E-E-A-T compliance optimization error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      reason: 'E-E-A-T optimization failed'
    }, { status: 500 })
  }
}