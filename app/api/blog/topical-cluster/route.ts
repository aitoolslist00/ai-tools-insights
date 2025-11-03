import { NextRequest, NextResponse } from 'next/server'
import { validateApiAuth } from '@/lib/auth-enhanced'
import { fetchRecentNews, formatNewsForPrompt } from '@/lib/news-fetcher'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * TOPICAL CLUSTER GENERATION
 * Generates 20 authoritative H2 headings and 40 unique H3 headings
 * Uses Gemini 2.5 Flash + NewsAPI for comprehensive topic coverage
 */

interface TopicalClusterRequest {
  keyword: string
  category: string
  apiKey: string
  entitiesKeywords?: any
}

interface TopicalClusterResult {
  success: boolean
  h2Headings: string[]
  h3Headings: string[]
  totalHeadings: number
  topicCoverage: string[]
  newsContext?: string
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await validateApiAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: TopicalClusterRequest = await request.json()
    const { keyword, category, apiKey, entitiesKeywords } = body

    // Validate required fields
    if (!keyword || !apiKey) {
      return NextResponse.json({ 
        error: 'Missing required fields: keyword or apiKey' 
      }, { status: 400 })
    }

    console.log('📋 Starting topical cluster generation for:', keyword)

    // Step 1: Fetch recent news for context
    console.log('📰 Fetching recent news for topical context...')
    let newsData = null
    let newsContext = ''
    try {
      newsData = await fetchRecentNews(keyword, apiKey)
      if (newsData) {
        newsContext = formatNewsForPrompt(newsData)
        console.log(`📰 Found ${newsData.articles.length} recent news articles for context`)
      }
    } catch (newsError) {
      console.warn('News fetching failed, continuing without news context:', newsError)
    }

    // Prepare keywords context from previous step
    let keywordsContext = ''
    if (entitiesKeywords) {
      keywordsContext = `
AVAILABLE KEYWORDS FOR REFERENCE:
LSI Keywords: ${entitiesKeywords.lsiKeywords?.slice(0, 20).join(', ')}...
Entity Keywords: ${entitiesKeywords.entityKeywords?.slice(0, 20).join(', ')}...
Semantic Keywords: ${entitiesKeywords.semanticKeywords?.slice(0, 20).join(', ')}...
`
    }

    // Step 2: Generate H2 Headings
    console.log('📝 Generating H2 headings...')
    const h2Prompt = `
You are an expert content strategist and SEO specialist. Generate EXACTLY 20 authoritative H2 headings for a comprehensive article about "${keyword}" in the ${category} category.

${newsContext}
${keywordsContext}

H2 HEADINGS REQUIREMENTS:
- Must cover ALL aspects and angles of "${keyword}"
- Each heading must be unique and non-duplicated
- Must be authoritative and high-quality
- Should cover different parts, ideas, and perspectives
- Include current trends and developments from the news context
- Each heading must contain a word related to the main keyword "${keyword}"
- Cover: introduction, benefits, features, comparisons, use cases, implementation, best practices, challenges, future trends, conclusion
- Must be relevant to ${category} category
- Should be comprehensive enough to cover the entire topic
- Use power words and engaging language
- Ensure logical flow and structure

IMPORTANT: Return EXACTLY 20 unique H2 headings as a JSON array. No explanations, just the JSON array.

Example format:
["H2 Heading 1", "H2 Heading 2", "H2 Heading 3", ...]

Generate 20 H2 headings for "${keyword}":
`

    const h2Response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: h2Prompt }]
        }],
        generationConfig: {
          temperature: 0.5,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      })
    })

    if (!h2Response.ok) {
      throw new Error(`Gemini API error for H2 headings: ${h2Response.status}`)
    }

    const h2Data = await h2Response.json()
    const h2Text = h2Data.candidates?.[0]?.content?.parts?.[0]?.text

    let h2Headings: string[] = []
    try {
      const h2Match = h2Text.match(/\[[\s\S]*?\]/)
      if (h2Match) {
        h2Headings = JSON.parse(h2Match[0])
      }
    } catch (parseError) {
      console.error('Failed to parse H2 headings, using fallback')
      h2Headings = extractHeadingsFromText(h2Text, 20, keyword, 'H2')
    }

    // Step 3: Generate H3 Headings
    console.log('📝 Generating H3 headings...')
    const h3Prompt = `
You are an expert content strategist and SEO specialist. Generate EXACTLY 40 unique H3 headings that support and expand on the H2 headings for a comprehensive article about "${keyword}" in the ${category} category.

EXISTING H2 HEADINGS:
${h2Headings.join('\n')}

${newsContext}
${keywordsContext}

H3 HEADINGS REQUIREMENTS:
- Must be sub-topics that support the H2 headings above
- Each heading must be unique and non-duplicated
- Must be authoritative and high-quality
- Should provide detailed coverage of specific aspects
- Include current trends and developments from the news context
- Each heading must contain a word related to the main keyword "${keyword}"
- Cover: detailed explanations, step-by-step guides, specific examples, case studies, technical details, comparisons, tips, troubleshooting
- Must be relevant to ${category} category
- Should complement the H2 headings without repetition
- Use specific and actionable language
- Ensure comprehensive topic coverage

IMPORTANT: Return EXACTLY 40 unique H3 headings as a JSON array. No explanations, just the JSON array.

Example format:
["H3 Heading 1", "H3 Heading 2", "H3 Heading 3", ...]

Generate 40 H3 headings for "${keyword}":
`

    const h3Response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: h3Prompt }]
        }],
        generationConfig: {
          temperature: 0.5,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      })
    })

    if (!h3Response.ok) {
      throw new Error(`Gemini API error for H3 headings: ${h3Response.status}`)
    }

    const h3Data = await h3Response.json()
    const h3Text = h3Data.candidates?.[0]?.content?.parts?.[0]?.text

    let h3Headings: string[] = []
    try {
      const h3Match = h3Text.match(/\[[\s\S]*?\]/)
      if (h3Match) {
        h3Headings = JSON.parse(h3Match[0])
      }
    } catch (parseError) {
      console.error('Failed to parse H3 headings, using fallback')
      h3Headings = extractHeadingsFromText(h3Text, 40, keyword, 'H3')
    }

    // Ensure we have exactly the right number of headings
    h2Headings = ensureHeadingCount(h2Headings, 20, keyword, 'H2')
    h3Headings = ensureHeadingCount(h3Headings, 40, keyword, 'H3')

    // Ensure all headings are unique
    h2Headings = ensureUniqueHeadings(h2Headings)
    h3Headings = ensureUniqueHeadings(h3Headings)

    // Generate topic coverage analysis
    const topicCoverage = generateTopicCoverage(h2Headings, h3Headings, keyword)

    console.log('✅ Topical cluster generation completed successfully')
    console.log(`📊 H2 Headings: ${h2Headings.length}`)
    console.log(`📊 H3 Headings: ${h3Headings.length}`)
    console.log(`📊 Total Headings: ${h2Headings.length + h3Headings.length}`)

    const result: TopicalClusterResult = {
      success: true,
      h2Headings,
      h3Headings,
      totalHeadings: h2Headings.length + h3Headings.length,
      topicCoverage,
      newsContext: newsContext || undefined
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Topical cluster generation error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      h2Headings: [],
      h3Headings: [],
      totalHeadings: 0,
      topicCoverage: []
    }, { status: 500 })
  }
}

/**
 * Extracts headings from text when JSON parsing fails
 */
function extractHeadingsFromText(text: string, targetCount: number, keyword: string, type: string): string[] {
  const headings: string[] = []
  const lines = text.split('\n')
  
  for (const line of lines) {
    // Look for quoted strings or list items
    const matches = line.match(/"([^"]+)"/g) || line.match(/['']([^'']+)['']/g) || []
    for (const match of matches) {
      const heading = match.replace(/['"'']/g, '').trim()
      if (heading && heading.length > 5 && !headings.includes(heading)) {
        headings.push(heading)
        if (headings.length >= targetCount) break
      }
    }
    
    // Also look for dash-prefixed items
    if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
      const heading = line.replace(/^[-•]\s*/, '').trim().replace(/['"'']/g, '')
      if (heading && heading.length > 5 && !headings.includes(heading)) {
        headings.push(heading)
        if (headings.length >= targetCount) break
      }
    }
    
    // Look for numbered items
    const numberedMatch = line.match(/^\d+\.\s*(.+)/)
    if (numberedMatch) {
      const heading = numberedMatch[1].trim().replace(/['"'']/g, '')
      if (heading && heading.length > 5 && !headings.includes(heading)) {
        headings.push(heading)
        if (headings.length >= targetCount) break
      }
    }
    
    if (headings.length >= targetCount) break
  }
  
  return headings.slice(0, targetCount)
}

/**
 * Ensures we have exactly the target count of headings
 */
function ensureHeadingCount(headings: string[], targetCount: number, keyword: string, type: string): string[] {
  // Remove duplicates and empty strings
  const uniqueHeadings = Array.from(new Set(headings.filter(h => h && h.trim().length > 5)))
  
  // If we have enough, return the first targetCount
  if (uniqueHeadings.length >= targetCount) {
    return uniqueHeadings.slice(0, targetCount)
  }
  
  // If we need more, generate additional headings
  const needed = targetCount - uniqueHeadings.length
  const additionalHeadings: string[] = []
  
  const h2Templates = [
    `What is ${keyword}?`,
    `How ${keyword} Works`,
    `Benefits of ${keyword}`,
    `${keyword} Features and Capabilities`,
    `${keyword} vs Alternatives`,
    `Best Practices for ${keyword}`,
    `${keyword} Implementation Guide`,
    `Common ${keyword} Challenges`,
    `${keyword} Use Cases`,
    `Future of ${keyword}`,
    `${keyword} Pricing and Plans`,
    `${keyword} Security Considerations`,
    `${keyword} Integration Options`,
    `${keyword} Performance Metrics`,
    `${keyword} Success Stories`,
    `${keyword} Troubleshooting`,
    `${keyword} Updates and Roadmap`,
    `${keyword} Community and Support`,
    `${keyword} Training and Resources`,
    `Getting Started with ${keyword}`
  ]
  
  const h3Templates = [
    `${keyword} Key Features`,
    `${keyword} Setup Process`,
    `${keyword} Configuration Options`,
    `${keyword} Advanced Settings`,
    `${keyword} API Documentation`,
    `${keyword} Mobile Support`,
    `${keyword} Desktop Application`,
    `${keyword} Browser Extension`,
    `${keyword} Third-party Integrations`,
    `${keyword} Data Export Options`,
    `${keyword} Backup and Recovery`,
    `${keyword} User Management`,
    `${keyword} Permission Settings`,
    `${keyword} Customization Options`,
    `${keyword} Reporting Features`,
    `${keyword} Analytics Dashboard`,
    `${keyword} Notification System`,
    `${keyword} Collaboration Tools`,
    `${keyword} Workflow Automation`,
    `${keyword} Performance Optimization`,
    `${keyword} Error Handling`,
    `${keyword} Debugging Tools`,
    `${keyword} Testing Procedures`,
    `${keyword} Deployment Strategies`,
    `${keyword} Monitoring Solutions`,
    `${keyword} Scaling Considerations`,
    `${keyword} Cost Optimization`,
    `${keyword} ROI Calculation`,
    `${keyword} Compliance Requirements`,
    `${keyword} Data Privacy`,
    `${keyword} Industry Standards`,
    `${keyword} Certification Process`,
    `${keyword} Training Programs`,
    `${keyword} Documentation`,
    `${keyword} Video Tutorials`,
    `${keyword} Community Forums`,
    `${keyword} Expert Consultation`,
    `${keyword} Technical Support`,
    `${keyword} Migration Guide`,
    `${keyword} Legacy System Integration`
  ]
  
  const templates = type === 'H2' ? h2Templates : h3Templates
  
  for (let i = 0; i < needed && i < templates.length; i++) {
    const newHeading = templates[i]
    if (!uniqueHeadings.includes(newHeading) && !additionalHeadings.includes(newHeading)) {
      additionalHeadings.push(newHeading)
    }
  }
  
  return [...uniqueHeadings, ...additionalHeadings].slice(0, targetCount)
}

/**
 * Ensures all headings are unique
 */
function ensureUniqueHeadings(headings: string[]): string[] {
  const unique = new Set<string>()
  const result: string[] = []
  
  for (const heading of headings) {
    const normalized = heading.toLowerCase().trim()
    if (!unique.has(normalized)) {
      unique.add(normalized)
      result.push(heading)
    }
  }
  
  return result
}

/**
 * Generates topic coverage analysis
 */
function generateTopicCoverage(h2Headings: string[], h3Headings: string[], keyword: string): string[] {
  const coverage = [
    'Introduction and Overview',
    'Features and Capabilities',
    'Benefits and Advantages',
    'Implementation and Setup',
    'Best Practices and Guidelines',
    'Use Cases and Applications',
    'Comparisons and Alternatives',
    'Technical Specifications',
    'Troubleshooting and Support',
    'Future Trends and Developments'
  ]
  
  return coverage
}