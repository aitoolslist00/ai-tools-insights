import { NextRequest, NextResponse } from 'next/server'
import { validateApiAuth } from '@/lib/auth-enhanced'
import { fetchRecentNews, formatNewsForPrompt } from '@/lib/news-fetcher'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * ENTITIES, LSI KEYWORDS, SEMANTIC KEYWORDS EXTRACTION
 * Extracts top 100 LSI keywords, 100 entity keywords, and 100 semantic keywords
 * Uses Gemini 2.5 Flash + NewsAPI for comprehensive keyword research
 */

interface EntitiesKeywordsRequest {
  keyword: string
  category: string
  apiKey: string
}

interface EntitiesKeywordsResult {
  success: boolean
  lsiKeywords: string[]
  entityKeywords: string[]
  semanticKeywords: string[]
  totalKeywords: number
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

    const body: EntitiesKeywordsRequest = await request.json()
    const { keyword, category, apiKey } = body

    // Validate required fields
    if (!keyword || !apiKey) {
      return NextResponse.json({ 
        error: 'Missing required fields: keyword or apiKey' 
      }, { status: 400 })
    }

    console.log('🔍 Starting entities and keywords extraction for:', keyword)

    // Step 1: Fetch recent news for context
    console.log('📰 Fetching recent news for keyword context...')
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

    // Step 2: Extract LSI Keywords
    console.log('🔍 Extracting LSI keywords...')
    const lsiPrompt = `
You are an expert SEO keyword researcher. Extract the top 100 LSI (Latent Semantic Indexing) keywords related to "${keyword}" in the ${category} category.

${newsContext}

LSI KEYWORDS REQUIREMENTS:
- Must be semantically related to the main keyword "${keyword}"
- Should include variations, synonyms, and related terms
- Focus on terms that search engines associate with the main keyword
- Include both short-tail and long-tail variations
- Consider user search intent and behavior
- Include industry-specific terminology
- Must be relevant to ${category} category
- Use current trends and terminology from the news context above

IMPORTANT: Return EXACTLY 100 unique LSI keywords as a JSON array. No explanations, just the JSON array.

Example format:
["keyword1", "keyword2", "keyword3", ...]

Generate 100 LSI keywords for "${keyword}":
`

    const lsiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: lsiPrompt }]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      })
    })

    if (!lsiResponse.ok) {
      throw new Error(`Gemini API error for LSI keywords: ${lsiResponse.status}`)
    }

    const lsiData = await lsiResponse.json()
    const lsiText = lsiData.candidates?.[0]?.content?.parts?.[0]?.text

    let lsiKeywords: string[] = []
    try {
      const lsiMatch = lsiText.match(/\[[\s\S]*?\]/)
      if (lsiMatch) {
        lsiKeywords = JSON.parse(lsiMatch[0])
      }
    } catch (parseError) {
      console.error('Failed to parse LSI keywords, using fallback')
      lsiKeywords = extractKeywordsFromText(lsiText, 100)
    }

    // Step 3: Extract Entity Keywords
    console.log('🏢 Extracting entity keywords...')
    const entityPrompt = `
You are an expert in named entity recognition and SEO. Extract the top 100 entity keywords related to "${keyword}" in the ${category} category.

${newsContext}

ENTITY KEYWORDS REQUIREMENTS:
- Named entities (people, organizations, brands, products, services)
- Geographic locations relevant to the topic
- Company names and brand names
- Product names and service names
- Technology names and platform names
- Industry leaders and influencers
- Regulatory bodies and standards
- Events and conferences
- Tools and software names
- Must be relevant to ${category} category
- Include entities mentioned in the current news context above

IMPORTANT: Return EXACTLY 100 unique entity keywords as a JSON array. No explanations, just the JSON array.

Example format:
["Entity1", "Entity2", "Entity3", ...]

Generate 100 entity keywords for "${keyword}":
`

    const entityResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: entityPrompt }]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      })
    })

    if (!entityResponse.ok) {
      throw new Error(`Gemini API error for entity keywords: ${entityResponse.status}`)
    }

    const entityData = await entityResponse.json()
    const entityText = entityData.candidates?.[0]?.content?.parts?.[0]?.text

    let entityKeywords: string[] = []
    try {
      const entityMatch = entityText.match(/\[[\s\S]*?\]/)
      if (entityMatch) {
        entityKeywords = JSON.parse(entityMatch[0])
      }
    } catch (parseError) {
      console.error('Failed to parse entity keywords, using fallback')
      entityKeywords = extractKeywordsFromText(entityText, 100)
    }

    // Step 4: Extract Semantic Keywords
    console.log('🧠 Extracting semantic keywords...')
    const semanticPrompt = `
You are an expert in semantic SEO and natural language processing. Extract the top 100 semantic keywords related to "${keyword}" in the ${category} category.

${newsContext}

SEMANTIC KEYWORDS REQUIREMENTS:
- Conceptually related terms and topics
- User intent-based keywords
- Problem-solution related terms
- Feature and benefit keywords
- Comparison and alternative terms
- Process and methodology terms
- Technical specifications and requirements
- Use case and application keywords
- Industry trends and future concepts
- Question-based keywords (what, how, why, when, where)
- Must be relevant to ${category} category
- Include semantic concepts from the current news context above

IMPORTANT: Return EXACTLY 100 unique semantic keywords as a JSON array. No explanations, just the JSON array.

Example format:
["semantic1", "semantic2", "semantic3", ...]

Generate 100 semantic keywords for "${keyword}":
`

    const semanticResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: semanticPrompt }]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      })
    })

    if (!semanticResponse.ok) {
      throw new Error(`Gemini API error for semantic keywords: ${semanticResponse.status}`)
    }

    const semanticData = await semanticResponse.json()
    const semanticText = semanticData.candidates?.[0]?.content?.parts?.[0]?.text

    let semanticKeywords: string[] = []
    try {
      const semanticMatch = semanticText.match(/\[[\s\S]*?\]/)
      if (semanticMatch) {
        semanticKeywords = JSON.parse(semanticMatch[0])
      }
    } catch (parseError) {
      console.error('Failed to parse semantic keywords, using fallback')
      semanticKeywords = extractKeywordsFromText(semanticText, 100)
    }

    // Ensure we have exactly 100 keywords of each type
    lsiKeywords = ensureKeywordCount(lsiKeywords, 100, keyword, 'LSI')
    entityKeywords = ensureKeywordCount(entityKeywords, 100, keyword, 'entity')
    semanticKeywords = ensureKeywordCount(semanticKeywords, 100, keyword, 'semantic')

    console.log('✅ Keywords extraction completed successfully')
    console.log(`📊 LSI Keywords: ${lsiKeywords.length}`)
    console.log(`📊 Entity Keywords: ${entityKeywords.length}`)
    console.log(`📊 Semantic Keywords: ${semanticKeywords.length}`)

    const result: EntitiesKeywordsResult = {
      success: true,
      lsiKeywords,
      entityKeywords,
      semanticKeywords,
      totalKeywords: lsiKeywords.length + entityKeywords.length + semanticKeywords.length,
      newsContext: newsContext || undefined
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Entities and keywords extraction error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      lsiKeywords: [],
      entityKeywords: [],
      semanticKeywords: [],
      totalKeywords: 0
    }, { status: 500 })
  }
}

/**
 * Extracts keywords from text when JSON parsing fails
 */
function extractKeywordsFromText(text: string, targetCount: number): string[] {
  const keywords: string[] = []
  const lines = text.split('\n')
  
  for (const line of lines) {
    // Look for quoted strings or list items
    const matches = line.match(/"([^"]+)"/g) || line.match(/['']([^'']+)['']/g) || []
    for (const match of matches) {
      const keyword = match.replace(/['"'']/g, '').trim()
      if (keyword && keyword.length > 1 && !keywords.includes(keyword)) {
        keywords.push(keyword)
        if (keywords.length >= targetCount) break
      }
    }
    
    // Also look for dash-prefixed items
    if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
      const keyword = line.replace(/^[-•]\s*/, '').trim().replace(/['"'']/g, '')
      if (keyword && keyword.length > 1 && !keywords.includes(keyword)) {
        keywords.push(keyword)
        if (keywords.length >= targetCount) break
      }
    }
    
    if (keywords.length >= targetCount) break
  }
  
  return keywords.slice(0, targetCount)
}

/**
 * Ensures we have exactly the target count of keywords
 */
function ensureKeywordCount(keywords: string[], targetCount: number, baseKeyword: string, type: string): string[] {
  // Remove duplicates and empty strings
  const uniqueKeywords = Array.from(new Set(keywords.filter(k => k && k.trim().length > 0)))
  
  // If we have enough, return the first targetCount
  if (uniqueKeywords.length >= targetCount) {
    return uniqueKeywords.slice(0, targetCount)
  }
  
  // If we need more, generate additional keywords
  const needed = targetCount - uniqueKeywords.length
  const additionalKeywords: string[] = []
  
  for (let i = 0; i < needed; i++) {
    let newKeyword = ''
    switch (type) {
      case 'LSI':
        newKeyword = `${baseKeyword} ${['solution', 'tool', 'platform', 'service', 'software', 'system', 'technology', 'application', 'method', 'approach'][i % 10]}`
        break
      case 'entity':
        newKeyword = `${baseKeyword} ${['Inc', 'Corp', 'LLC', 'Ltd', 'Company', 'Enterprise', 'Solutions', 'Technologies', 'Systems', 'Platform'][i % 10]}`
        break
      case 'semantic':
        newKeyword = `${['how to use', 'what is', 'best', 'top', 'compare', 'vs', 'alternative to', 'benefits of', 'features of', 'guide to'][i % 10]} ${baseKeyword}`
        break
    }
    
    if (newKeyword && !uniqueKeywords.includes(newKeyword) && !additionalKeywords.includes(newKeyword)) {
      additionalKeywords.push(newKeyword)
    }
  }
  
  return [...uniqueKeywords, ...additionalKeywords].slice(0, targetCount)
}