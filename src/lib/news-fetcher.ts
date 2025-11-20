export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
}

export interface NewsContext {
  articles: NewsArticle[];
  summary: string;
  trends: string[];
}

export async function fetchEnhancedNews(keyword: string, newsApiKey: string): Promise<NewsContext> {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  const fromDate = last30Days.toISOString().split('T')[0];

  const queries = [
    keyword,
    `${keyword} 2025`,
    `${keyword} latest`,
    `${keyword} news`,
    `${keyword} trends`
  ];

  const allArticles: NewsArticle[] = [];
  const errors: string[] = [];

  for (const query of queries) {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=10&from=${fromDate}&apiKey=${newsApiKey}`
      );
      
      if (!response.ok) {
        errors.push(`Query "${query}" failed with status ${response.status}`);
        continue;
      }

      const data = await response.json();
      
      if (data.articles && Array.isArray(data.articles)) {
        data.articles.forEach((article: any) => {
          if (article.title && article.description) {
            allArticles.push({
              title: article.title,
              description: article.description || '',
              url: article.url || '',
              publishedAt: article.publishedAt || '',
              source: article.source?.name || 'Unknown'
            });
          }
        });
      }
    } catch (error) {
      errors.push(`Query "${query}" failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  if (errors.length > 0) {
    console.warn('News API errors:', errors);
  }

  const uniqueArticles = deduplicateArticles(allArticles);
  const topArticles = uniqueArticles.slice(0, 25);

  const summary = generateSummary(topArticles);
  const trends = extractTrends(topArticles);

  return {
    articles: topArticles,
    summary,
    trends
  };
}

function deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  const unique: NewsArticle[] = [];

  articles.forEach(article => {
    const key = article.title.toLowerCase().trim();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(article);
    }
  });

  return unique.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

function generateSummary(articles: NewsArticle[]): string {
  if (articles.length === 0) {
    return '';
  }

  const summaryParts: string[] = [];
  
  articles.slice(0, 5).forEach(article => {
    summaryParts.push(`${article.title} (${article.source}): ${article.description}`);
  });

  return summaryParts.join('\n\n');
}

function extractTrends(articles: NewsArticle[]): string[] {
  const keywords = new Map<string, number>();
  
  articles.forEach(article => {
    const text = `${article.title} ${article.description}`.toLowerCase();
    
    const words = text.match(/\b[a-z]{4,}\b/g) || [];
    
    words.forEach(word => {
      if (!isStopWord(word)) {
        keywords.set(word, (keywords.get(word) || 0) + 1);
      }
    });
  });

  return Array.from(keywords.entries())
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

function isStopWord(word: string): boolean {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 
    'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 
    'those', 'it', 'its', 'they', 'them', 'their', 'what', 'which', 'who',
    'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few',
    'more', 'most', 'other', 'some', 'such', 'than', 'too', 'very'
  ]);
  
  return stopWords.has(word);
}
