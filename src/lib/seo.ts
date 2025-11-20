export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
}

export function generateSEO(data: {
  title: string;
  content: string;
}): SEOMetadata {
  const title = data.title;
  const description = data.content
    .replace(/<[^>]*>/g, '')
    .slice(0, 155)
    .trim();

  const keywords = extractKeywords(data.content);

  return {
    title: `${title} | AI Tools Insights`,
    description,
    keywords
  };
}

function extractKeywords(content: string): string[] {
  const text = content.toLowerCase().replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/);
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should']);

  const wordFreq = new Map<string, number>();
  words.forEach(word => {
    if (word.length > 3 && !stopWords.has(word)) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }
  });

  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
