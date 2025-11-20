export interface QualityScore {
  overall: number;
  wordCount: number;
  headingCount: number;
  paragraphCount: number;
  readabilityScore: number;
  keywordDensity: number;
  hasIntroduction: boolean;
  hasConclusion: boolean;
  hasFAQ: boolean;
  imageCount: number;
  linkCount: number;
  aiDetectionScore: number;
  issues: string[];
  recommendations: string[];
}

export function analyzeContentQuality(markdown: string, html: string, keyword: string): QualityScore {
  const issues: string[] = [];
  const recommendations: string[] = [];

  const wordCount = countWords(markdown);
  const headings = extractHeadings(markdown);
  const paragraphs = markdown.split('\n\n').filter(p => p.trim().length > 50);
  const readabilityScore = calculateReadability(markdown);
  const keywordDensity = calculateKeywordDensity(markdown, keyword);
  const aiDetectionScore = calculateAIDetectionScore(markdown);

  const hasIntroduction = checkIntroduction(markdown);
  const hasConclusion = checkConclusion(markdown);
  const hasFAQ = markdown.toLowerCase().includes('faq') || markdown.toLowerCase().includes('frequently asked');
  
  const imageCount = (html.match(/<img/g) || []).length;
  const linkCount = (html.match(/<a href/g) || []).length;

  if (wordCount < 2000) {
    issues.push(`Content too short: ${wordCount} words (minimum 2000)`);
    recommendations.push('Add more detailed sections, examples, and explanations');
  }

  if (wordCount > 4500) {
    issues.push(`Content too long: ${wordCount} words (maximum 4500 for readability)`);
    recommendations.push('Consider breaking into multiple articles or removing redundant content');
  }

  if (headings.h2.length < 6) {
    issues.push(`Too few H2 headings: ${headings.h2.length} (minimum 6)`);
    recommendations.push('Add more main sections to improve structure');
  }

  if (headings.h3.length < 10) {
    issues.push(`Too few H3 headings: ${headings.h3.length} (minimum 10)`);
    recommendations.push('Add subsections to break down complex topics');
  }

  if (paragraphs.length < 15) {
    issues.push(`Too few paragraphs: ${paragraphs.length} (minimum 15)`);
    recommendations.push('Break down content into more digestible paragraphs');
  }

  if (readabilityScore < 50 || readabilityScore > 80) {
    issues.push(`Readability score out of range: ${readabilityScore} (target 50-80)`);
    if (readabilityScore < 50) {
      recommendations.push('Simplify sentences and use shorter words');
    } else {
      recommendations.push('Add more depth and complexity to the content');
    }
  }

  if (keywordDensity < 0.5 || keywordDensity > 2.5) {
    issues.push(`Keyword density out of range: ${keywordDensity.toFixed(2)}% (target 0.5-2.5%)`);
    if (keywordDensity < 0.5) {
      recommendations.push(`Include keyword "${keyword}" more naturally throughout content`);
    } else {
      recommendations.push(`Reduce keyword "${keyword}" usage to avoid keyword stuffing`);
    }
  }

  if (!hasIntroduction) {
    issues.push('No clear introduction found');
    recommendations.push('Add a 2-3 paragraph introduction explaining the topic');
  }

  if (!hasConclusion) {
    issues.push('No clear conclusion found');
    recommendations.push('Add a conclusion summarizing key points');
  }

  if (!hasFAQ) {
    recommendations.push('Consider adding an FAQ section for better SEO');
  }

  if (imageCount < 3) {
    issues.push(`Too few images: ${imageCount} (minimum 3)`);
    recommendations.push('Add relevant images to improve engagement');
  }

  if (linkCount < 5) {
    issues.push(`Too few links: ${linkCount} (minimum 5)`);
    recommendations.push('Add authoritative external sources and internal links');
  }

  if (aiDetectionScore > 30) {
    issues.push(`High AI-detection score: ${aiDetectionScore}/100 (AI-like patterns detected)`);
    recommendations.push('Content contains AI-telltale phrases - needs human rewriting');
  }

  const overall = calculateOverallScore(
    wordCount,
    headings,
    paragraphs.length,
    readabilityScore,
    keywordDensity,
    hasIntroduction,
    hasConclusion,
    imageCount,
    linkCount,
    aiDetectionScore
  );

  return {
    overall,
    wordCount,
    headingCount: headings.h2.length + headings.h3.length,
    paragraphCount: paragraphs.length,
    readabilityScore,
    keywordDensity,
    hasIntroduction,
    hasConclusion,
    hasFAQ,
    imageCount,
    linkCount,
    aiDetectionScore,
    issues,
    recommendations
  };
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

function extractHeadings(markdown: string): { h1: string[], h2: string[], h3: string[] } {
  const h1 = markdown.match(/^# .+$/gm) || [];
  const h2 = markdown.match(/^## .+$/gm) || [];
  const h3 = markdown.match(/^### .+$/gm) || [];

  return {
    h1: h1.map(h => h.replace(/^# /, '')),
    h2: h2.map(h => h.replace(/^## /, '')),
    h3: h3.map(h => h.replace(/^### /, ''))
  };
}

function calculateReadability(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);

  if (sentences.length === 0 || words.length === 0) {
    return 0;
  }

  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  const score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

  return Math.max(0, Math.min(100, score));
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;

  const vowels = 'aeiouy';
  let syllableCount = 0;
  let previousWasVowel = false;

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !previousWasVowel) {
      syllableCount++;
    }
    previousWasVowel = isVowel;
  }

  if (word.endsWith('e')) {
    syllableCount--;
  }

  return Math.max(1, syllableCount);
}

function calculateKeywordDensity(text: string, keyword: string): number {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const keywordLower = keyword.toLowerCase();
  const keywordCount = words.filter(w => w.includes(keywordLower)).length;

  return (keywordCount / words.length) * 100;
}

function checkIntroduction(markdown: string): boolean {
  const lines = markdown.split('\n').filter(l => l.trim());
  const firstParagraphs = lines.slice(0, 5).join(' ').toLowerCase();
  
  const introPatterns = [
    'in this article',
    'this guide',
    'we will explore',
    'introduction',
    'overview',
    'in this post'
  ];

  return introPatterns.some(pattern => firstParagraphs.includes(pattern));
}

function checkConclusion(markdown: string): boolean {
  const lines = markdown.split('\n').filter(l => l.trim());
  const lastSection = lines.slice(-10).join(' ').toLowerCase();
  
  const conclusionPatterns = [
    'conclusion',
    'final thoughts',
    'in summary',
    'to sum up',
    'in conclusion',
    'wrapping up'
  ];

  return conclusionPatterns.some(pattern => lastSection.includes(pattern));
}

function calculateAIDetectionScore(text: string): number {
  const lowerText = text.toLowerCase();
  let aiScore = 0;

  const aiPhrases = [
    'delve into', 'delving', ' realm', 'landscape of', 'navigating', 'tailored', 'seamlessly',
    'it\'s important to note', 'it\'s worth noting', 'worth mentioning',
    'in the ever-evolving', 'in today\'s fast-paced', 'in today\'s digital age',
    'unlock the', 'harness the', 'leverage', 'game-changer', 'revolutionize',
    'whether you\'re a beginner or', 'whether you\'re new to',
    'dive deep into', 'embark on'
  ];

  aiPhrases.forEach(phrase => {
    const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = text.match(regex);
    if (matches) {
      aiScore += matches.length * 5;
    }
  });

  const transitionWords = ['additionally', 'furthermore', 'moreover', 'consequently'];
  transitionWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches && matches.length > 3) {
      aiScore += (matches.length - 3) * 3;
    }
  });

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const contractionCount = (text.match(/\b(don't|can't|won't|it's|we're|that's|here's|let's|i'm|you're)\b/gi) || []).length;
  const contractionRatio = sentences.length > 0 ? contractionCount / sentences.length : 0;
  
  if (contractionRatio < 0.05) {
    aiScore += 15;
  }

  const firstPersonCount = (text.match(/\b(we tested|in our testing|we found|we noticed|in our experience|we tried)\b/gi) || []).length;
  if (firstPersonCount < 3) {
    aiScore += 10;
  }

  return Math.min(100, aiScore);
}

function calculateOverallScore(
  wordCount: number,
  headings: { h1: string[], h2: string[], h3: string[] },
  paragraphCount: number,
  readabilityScore: number,
  keywordDensity: number,
  hasIntroduction: boolean,
  hasConclusion: boolean,
  imageCount: number,
  linkCount: number,
  aiDetectionScore: number
): number {
  let score = 0;

  if (wordCount >= 2000 && wordCount <= 4500) score += 20;
  else if (wordCount >= 1500) score += 10;

  if (headings.h2.length >= 6) score += 15;
  if (headings.h3.length >= 10) score += 15;

  if (paragraphCount >= 15) score += 10;

  if (readabilityScore >= 50 && readabilityScore <= 80) score += 15;
  else if (readabilityScore >= 40 && readabilityScore <= 90) score += 8;

  if (keywordDensity >= 0.5 && keywordDensity <= 2.5) score += 10;

  if (hasIntroduction) score += 5;
  if (hasConclusion) score += 5;

  if (imageCount >= 3) score += 5;
  if (linkCount >= 5) score += 5;

  if (aiDetectionScore < 20) score += 10;
  else if (aiDetectionScore < 30) score += 5;
  else score -= 10;

  return Math.min(100, Math.max(0, score));
}
