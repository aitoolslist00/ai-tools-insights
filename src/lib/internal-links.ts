import { db } from './db';

interface LinkOpportunity {
  sourceId: number;
  sourceType: 'article' | 'tool';
  targetId: number;
  targetType: 'article' | 'tool';
  anchorText: string;
  relevanceScore: number;
}

export function generateInternalLinks(contentId: number, contentType: 'article' | 'tool', content: string): LinkOpportunity[] {
  const opportunities: LinkOpportunity[] = [];
  
  const articles = db.prepare('SELECT * FROM articles WHERE status = ? AND id != ?').all('published', contentId) as any[];
  const tools = db.prepare('SELECT * FROM ai_tools WHERE status = ? AND id != ?').all('published', contentId) as any[];
  
  const contentLower = content.toLowerCase();
  
  articles.forEach(article => {
    const titleLower = article.title.toLowerCase();
    const slug = article.slug.toLowerCase();
    
    if (contentLower.includes(titleLower) || contentLower.includes(slug)) {
      opportunities.push({
        sourceId: contentId,
        sourceType: contentType,
        targetId: article.id,
        targetType: 'article',
        anchorText: article.title,
        relevanceScore: calculateRelevance(content, article.content)
      });
    }
  });
  
  tools.forEach(tool => {
    const nameLower = tool.name.toLowerCase();
    const slug = tool.slug.toLowerCase();
    
    if (contentLower.includes(nameLower) || contentLower.includes(slug)) {
      opportunities.push({
        sourceId: contentId,
        sourceType: contentType,
        targetId: tool.id,
        targetType: 'tool',
        anchorText: tool.name,
        relevanceScore: calculateRelevance(content, tool.description)
      });
    }
  });
  
  return opportunities.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 5);
}

function calculateRelevance(content1: string, content2: string): number {
  const words1 = new Set(content1.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  const words2 = new Set(content2.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

export function saveInternalLink(sourceId: number, sourceType: string, targetId: number, targetType: string, anchorText: string) {
  const stmt = db.prepare('INSERT INTO internal_links (source_id, source_type, target_id, target_type, anchor_text) VALUES (?, ?, ?, ?, ?)');
  stmt.run(sourceId, sourceType, targetId, targetType, anchorText);
}

export function getInternalLinksForContent(contentId: number, contentType: string): any[] {
  const stmt = db.prepare('SELECT * FROM internal_links WHERE source_id = ? AND source_type = ?');
  return stmt.all(contentId, contentType) as any[];
}

export function enrichContentWithLinks(content: string, links: any[]): string {
  let enrichedContent = content;
  
  links.forEach(link => {
    const targetUrl = link.target_type === 'article' 
      ? `/blog/${link.target_slug}` 
      : `/ai-tools/${link.target_slug}`;
    
    const regex = new RegExp(`\\b${link.anchor_text}\\b`, 'gi');
    const replacement = `<a href="${targetUrl}" class="text-blue-600 hover:underline">${link.anchor_text}</a>`;
    
    enrichedContent = enrichedContent.replace(regex, replacement);
  });
  
  return enrichedContent;
}
