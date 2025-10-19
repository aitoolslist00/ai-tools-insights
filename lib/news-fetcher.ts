/**
 * Real-Time News Fetcher
 * Fetches current news and information to ensure AI-generated content is up-to-date
 */

export interface NewsArticle {
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  content?: string
}

export interface NewsData {
  articles: NewsArticle[]
  totalResults: number
  fetchedAt: string
}

/**
 * Fetches recent news articles for a given keyword using NewsAPI
 */
export async function fetchRecentNews(keyword: string): Promise<NewsData | null> {
  const apiKey = process.env.NEWS_API_KEY
  
  if (!apiKey) {
    console.warn('⚠️ NEWS_API_KEY not configured - using AI training data only')
    return null
  }

  try {
    // Calculate date range (last 7 days)
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 7)
    
    const fromDate = sevenDaysAgo.toISOString().split('T')[0]
    const toDate = today.toISOString().split('T')[0]

    // Build API URL
    const url = new URL('https://newsapi.org/v2/everything')
    url.searchParams.append('q', keyword)
    url.searchParams.append('from', fromDate)
    url.searchParams.append('to', toDate)
    url.searchParams.append('sortBy', 'publishedAt')
    url.searchParams.append('language', 'en')
    url.searchParams.append('pageSize', '10') // Get top 10 recent articles
    url.searchParams.append('apiKey', apiKey)

    console.log(`📰 Fetching news for: "${keyword}" from ${fromDate} to ${toDate}`)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ NewsAPI error:', response.status, errorText)
      return null
    }

    const data = await response.json()

    if (data.status !== 'ok') {
      console.error('❌ NewsAPI returned error:', data)
      return null
    }

    const articles: NewsArticle[] = (data.articles || []).map((article: any) => ({
      title: article.title || '',
      description: article.description || '',
      url: article.url || '',
      publishedAt: article.publishedAt || '',
      source: article.source?.name || 'Unknown',
      content: article.content || article.description || ''
    }))

    console.log(`✅ Fetched ${articles.length} recent articles`)

    return {
      articles,
      totalResults: data.totalResults || 0,
      fetchedAt: new Date().toISOString()
    }

  } catch (error) {
    console.error('❌ Error fetching news:', error)
    return null
  }
}

/**
 * Formats news data into a prompt-friendly string for AI
 */
export function formatNewsForPrompt(newsData: NewsData): string {
  if (!newsData || newsData.articles.length === 0) {
    return ''
  }

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  let prompt = `\n\n=== CURRENT INFORMATION (Fetched on ${today}) ===\n\n`
  prompt += `Based on ${newsData.articles.length} recent news articles:\n\n`

  newsData.articles.forEach((article, index) => {
    const publishDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    
    prompt += `${index + 1}. [${publishDate}] ${article.title}\n`
    prompt += `   Source: ${article.source}\n`
    if (article.description) {
      prompt += `   ${article.description}\n`
    }
    prompt += `\n`
  })

  prompt += `=== END OF CURRENT INFORMATION ===\n\n`
  prompt += `IMPORTANT: Use the above recent information to write an accurate, up-to-date article. `
  prompt += `Include specific dates, recent developments, and current statistics from these sources. `
  prompt += `This ensures your content is genuinely current as of ${today}.\n\n`

  return prompt
}

/**
 * Gets enriched content with real-time news data
 */
export async function getEnrichedPrompt(basePrompt: string, keyword: string): Promise<string> {
  const newsData = await fetchRecentNews(keyword)
  
  if (!newsData) {
    console.log('⚠️ No news data available - using standard AI generation')
    return basePrompt
  }

  const newsContext = formatNewsForPrompt(newsData)
  
  // Insert news context after the initial instructions but before the content structure
  const enrichedPrompt = basePrompt.replace(
    'Write a comprehensive, SEO-optimized article',
    `${newsContext}Write a comprehensive, SEO-optimized article using the current information provided above`
  )

  console.log('✅ Prompt enriched with real-time news data')
  return enrichedPrompt
}