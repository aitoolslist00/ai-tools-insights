import axios from 'axios';
import * as cheerio from 'cheerio';

export interface SERPResult {
  title: string;
  url: string;
  snippet: string;
}

export interface SERPAnalysis {
  topResults: SERPResult[];
  peopleAlsoAsk: string[];
  relatedSearches: string[];
  averageWordCount: number;
  commonHeadings: string[];
  competitorTopics: string[];
}

export async function analyzeSERP(keyword: string): Promise<SERPAnalysis> {
  try {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&num=10&hl=en`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Referer': 'https://www.google.com/',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1'
      },
      timeout: 10000,
      maxRedirects: 5
    });

    const $ = cheerio.load(response.data);
    
    const topResults: SERPResult[] = [];
    $('div.g').slice(0, 10).each((i, element) => {
      const title = $(element).find('h3').text();
      const url = $(element).find('a').attr('href') || '';
      const snippet = $(element).find('div.VwiC3b').text() || $(element).find('span.aCOpRe').text();
      
      if (title && url) {
        topResults.push({ title, url, snippet });
      }
    });

    const peopleAlsoAsk: string[] = [];
    $('div.related-question-pair').each((i, element) => {
      const question = $(element).find('span').first().text();
      if (question) {
        peopleAlsoAsk.push(question);
      }
    });

    const relatedSearches: string[] = [];
    $('div.s75CSd').each((i, element) => {
      const text = $(element).text();
      if (text) {
        relatedSearches.push(text);
      }
    });

    const competitorTopics = extractTopicsFromResults(topResults);
    const commonHeadings = extractCommonHeadings(topResults);

    return {
      topResults,
      peopleAlsoAsk,
      relatedSearches,
      averageWordCount: 2500,
      commonHeadings,
      competitorTopics
    };
  } catch (error) {
    console.warn('SERP analysis failed, using fallback data:', error);
    
    return getFallbackSERPData(keyword);
  }
}

function getFallbackSERPData(keyword: string): SERPAnalysis {
  const normalizedKeyword = keyword.toLowerCase();
  
  const commonPAA = [
    `What is ${keyword}?`,
    `How does ${keyword} work?`,
    `What are the benefits of ${keyword}?`,
    `Is ${keyword} worth it?`,
    `How to use ${keyword} effectively?`,
    `What are the best practices for ${keyword}?`,
    `What are the common mistakes with ${keyword}?`,
    `How much does ${keyword} cost?`,
    `What are alternatives to ${keyword}?`,
    `Who should use ${keyword}?`
  ];

  const relatedTerms = [
    `${keyword} tutorial`,
    `${keyword} guide`,
    `${keyword} review`,
    `${keyword} comparison`,
    `best ${keyword}`,
    `${keyword} tips`,
    `${keyword} features`,
    `${keyword} pricing`,
    `${keyword} alternatives`,
    `${keyword} vs`,
    `how to ${keyword}`,
    `${keyword} benefits`
  ];

  return {
    topResults: [],
    peopleAlsoAsk: commonPAA,
    relatedSearches: relatedTerms,
    averageWordCount: 3000,
    commonHeadings: ['introduction', 'overview', 'benefits', 'features', 'how to', 'comparison', 'pricing', 'faq', 'conclusion'],
    competitorTopics: []
  };
}

function extractTopicsFromResults(results: SERPResult[]): string[] {
  const topics = new Set<string>();
  
  results.forEach(result => {
    const text = `${result.title} ${result.snippet}`.toLowerCase();
    
    const patterns = [
      /(?:how to|ways to|tips for|guide to|benefits of|best)\s+([^,.]{10,50})/gi,
      /(?:what is|understanding|learn about)\s+([^,.]{10,50})/gi,
      /([^,.]{10,50})\s+(?:explained|overview|comparison)/gi
    ];
    
    patterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          topics.add(match[1].trim());
        }
      }
    });
  });
  
  return Array.from(topics).slice(0, 15);
}

function extractCommonHeadings(results: SERPResult[]): string[] {
  const headings = new Set<string>();
  
  results.forEach(result => {
    const title = result.title.toLowerCase();
    
    const commonPatterns = [
      'introduction',
      'overview',
      'what is',
      'how to',
      'benefits',
      'features',
      'advantages',
      'disadvantages',
      'pros and cons',
      'comparison',
      'alternatives',
      'pricing',
      'conclusion',
      'faq',
      'getting started',
      'best practices',
      'tips',
      'guide'
    ];
    
    commonPatterns.forEach(pattern => {
      if (title.includes(pattern)) {
        headings.add(pattern);
      }
    });
  });
  
  return Array.from(headings);
}

export async function fetchCompetitorContent(url: string): Promise<{ headings: string[], wordCount: number }> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    
    $('script, style, nav, header, footer').remove();
    
    const headings: string[] = [];
    $('h1, h2, h3').each((i, element) => {
      const text = $(element).text().trim();
      if (text) {
        headings.push(text);
      }
    });

    const bodyText = $('body').text();
    const wordCount = bodyText.split(/\s+/).filter(word => word.length > 0).length;

    return { headings, wordCount };
  } catch (error) {
    console.warn('Failed to fetch competitor content:', error);
    return { headings: [], wordCount: 0 };
  }
}
