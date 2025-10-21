/**
 * SEO Generation Prompts - 2024-2025 Modern SEO Approach
 * 
 * REPLACES the old keyword-stuffing approach (lines 243-253)
 * 
 * This system generates articles that rank #1 on Google by:
 * 1. Focusing on user intent (not keyword stuffing)
 * 2. Creating deep, comprehensive sections (8-12, not 20+)
 * 3. Including E-A-A-T signals (expertise, experience, authority, trust)
 * 4. Optimizing for featured snippets
 * 5. Using natural keyword integration
 * 
 * Key difference from old approach:
 * OLD: "Include 50+ LSI keywords, 30+ entities, 40+ cluster keywords"
 * NEW: "Answer user questions comprehensively with natural keyword integration"
 */

export interface PromptContext {
  keyword: string
  category: string
  contentLength: 'short' | 'medium' | 'long'
  tone: 'professional' | 'casual' | 'technical' | 'friendly'
  targetAudience?: string
  additionalContext?: string
  newsContext?: string
}

export class SEOGenerationPrompts {
  /**
   * Generate the MODERN SEO-optimized prompt
   * This replaces the keyword-stuffing prompt
   */
  static generateModernSEOPrompt(context: PromptContext): string {
    const {
      keyword,
      category,
      contentLength,
      tone,
      targetAudience = 'professionals and enthusiasts',
      additionalContext = 'Focus on practical applications',
      newsContext = ''
    } = context

    // Determine content specs
    const specs = this.getContentSpecs(contentLength)

    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.toLocaleString('default', { month: 'long' })

    return `You are an expert content strategist with deep knowledge of ${keyword}. Create a comprehensive, authoritative article that answers user questions and provides genuine value.

${newsContext}

CONTENT OBJECTIVE:
Create an article about "${keyword}" that answers the most common user questions and provides practical, actionable insights. The goal is to become the most helpful resource on this topic.

AUDIENCE & TONE:
- Target audience: ${targetAudience}
- Tone: ${tone}
- Context: ${additionalContext}

CONTENT SPECIFICATIONS:
- Length: ${specs.minWords}-${specs.maxWords} words
- Sections: ${specs.sections} main sections (not 20+, aim for DEPTH not BREADTH)
- Focus: User intent satisfaction, not keyword density

MODERN SEO STRUCTURE (2024 APPROACH):
1. **Compelling Title** (50-60 chars): Value-driven, includes main keyword naturally
   - Example: "Complete Guide to [Keyword]: Everything You Need to Know"
   
2. **Introduction** (150-200 words):
   - Hook: Answer the main question immediately
   - Explain why this topic matters
   - Set expectations for what readers will learn
   - Include main keyword naturally (not forced)
   
3. **${specs.sections} Deep Sections** (300-600 words each):
   - Each section answers a specific user question
   - Use clear H2 headings that match user search queries
   - Include practical examples and case studies
   - Use subheadings (H3) for complex topics
   - End each section with actionable takeaways
   
4. **Practical Examples & Case Studies**:
   - Real-world implementation details
   - Measurable results and outcomes
   - Step-by-step guides where applicable
   
5. **Comparison/Alternative Approaches** (if applicable):
   - Pro/con analysis in table format
   - When to use each approach
   
6. **Common Questions** (FAQ Section):
   - Answer 5-8 frequently asked questions
   - Use question headings that match search queries
   - Keep answers concise (2-3 sentences each)
   
7. **Conclusion** (100-150 words):
   - Summarize key takeaways
   - Provide next steps
   - Include call-to-action
   - Forward-looking insights

NATURAL KEYWORD INTEGRATION (NOT STUFFING):
- Primary keyword: Use 3-5 times naturally throughout article
- Variations: Use related terms naturally (not forced synonyms)
- Search queries: Include common user search queries in headings
- Long-tail keywords: Naturally answer specific long-tail queries
- NO keyword stuffing: Never sacrifice readability for keyword density

E-A-A-T REQUIREMENTS (Google HCU Priority):
- **Expertise**: Reference your knowledge and experience
- **Experience**: Include real-world examples and case studies
- **Authority**: Cite reputable sources and data
- **Trust**: Be transparent about methodology and sources

TECHNICAL SEO ELEMENTS:
- Use proper H1/H2/H3 hierarchy
- Include keyword in first paragraph (within first 100 words)
- Add 1-2 bulleted lists with practical tips
- Include 1-2 comparison tables if applicable
- Format important information as callout boxes
- Use short paragraphs (2-3 sentences max) for readability

FEATURED SNIPPET OPTIMIZATION:
- First section should answer the "what is" question (0-60 words)
- Include a numbered list section (6-8 items)
- Include a comparison table (4-5 rows)
- Include step-by-step section (5-7 steps)

CONTENT QUALITY STANDARDS:
- Original research and insights (not rehashing competitors)
- Current information (use latest data and trends)
- Practical value (readers can implement immediately)
- Clear organization (easy to scan and find info)
- Comprehensive coverage (answers all user intents)
- Well-sourced (cite studies, reports, expert quotes)

STRUCTURE OUTPUT AS JSON:
{
  "title": "SEO-optimized title matching user intent",
  "metaDescription": "Compelling description (150-160 chars) highlighting key benefit",
  "slug": "url-friendly-slug",
  "excerpt": "Brief summary of what readers will learn",
  "content": "Full article in markdown with proper H2/H3 structure",
  "keywords": [
    "primary keyword",
    "related search query 1",
    "related search query 2",
    "long-tail variation 1",
    "long-tail variation 2"
  ],
  "headings": ["All H2 headings used in article"],
  "internalLinks": [
    {"url": "/related-page", "anchor": "relevant anchor text"},
    {"url": "/another-page", "anchor": "natural anchor text"}
  ],
  "externalLinks": [
    {"url": "https://authoritative-source.com", "anchor": "source description"}
  ],
  "imagePrompts": [
    "descriptive image prompt with keyword"
  ],
  "readingTime": estimated_minutes,
  "wordCount": actual_count,
  "tableOfContents": ["Section 1", "Section 2", ...],
  "faqQuestions": ["FAQ 1", "FAQ 2", ...]
}

CRITICAL SUCCESS METRICS FOR #1 RANKING:
✓ Answers user questions completely (all intents)
✓ Highly readable and scannable structure
✓ Natural keyword integration (not stuffing)
✓ E-A-A-T signals throughout
✓ Referenced sources and data
✓ Practical, actionable information
✓ Better than current top 3 results
✓ Featured snippet optimization

Your goal is to create content that Google's Helpful Content Update rewards:
- Written by humans, for humans
- Demonstrates real experience and expertise
- Provides genuine value
- Transparent and trustworthy
- Easy to navigate and understand

Generate a comprehensive, helpful article that answers "${keyword}" in the most useful way possible.`
  }

  /**
   * Get content specifications based on length
   */
  static getContentSpecs(contentLength: 'short' | 'medium' | 'long') {
    const specs = {
      short: { minWords: 800, maxWords: 1200, sections: 4 },
      medium: { minWords: 1200, maxWords: 2000, sections: 6 },
      long: { minWords: 2000, maxWords: 3500, sections: 8 }
    }
    return specs[contentLength]
  }

  /**
   * Generate FAQ-focused prompt
   */
  static generateFAQPrompt(keyword: string, faqQuestions: string[]): string {
    return `You are an expert in "${keyword}". Create comprehensive answers to these frequently asked questions:

${faqQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

For each question:
- Provide a direct, concise answer (1-2 sentences)
- Add 2-3 supporting details or examples
- Use simple, clear language
- Include relevant keyword variations naturally

Format as JSON with structure:
{
  "faqs": [
    {
      "question": "Question text",
      "answer": "Direct answer",
      "details": "Supporting information",
      "keyword": "relevant keyword used"
    }
  ]
}

Create answers that are helpful, accurate, and optimized for featured snippets.`
  }

  /**
   * Generate comparison-focused prompt
   */
  static generateComparisonPrompt(
    keyword1: string,
    keyword2: string
  ): string {
    return `You are an expert in comparing ${keyword1} and ${keyword2}.

Create a comprehensive comparison article that:

1. Explains what each is (2-3 sentences each)
2. Creates a detailed comparison table with 8-10 key features
3. Lists pros and cons for each
4. Explains when to use each option
5. Provides real-world examples of each in use
6. Recommends which is better for different use cases

TABLE FORMAT:
Create a markdown table with columns:
| Feature | ${keyword1} | ${keyword2} |

COMPARISON STRUCTURE:
- Similarities (2-3 points)
- Key Differences (5-7 differences)
- Pricing comparison (if applicable)
- Performance comparison (if applicable)
- Ease of use comparison
- Best use cases for each
- Expert recommendation

Format as JSON with comparison data ready for markdown table conversion.

Focus on helping users understand the key differences and choose the right option.`
  }

  /**
   * Generate how-to/guide prompt
   */
  static generateHowToPrompt(
    topic: string,
    steps: string[]
  ): string {
    const stepsText = steps.map((s, i) => `${i + 1}. ${s}`).join('\n')

    return `You are an expert in creating clear, step-by-step guides. Create a comprehensive how-to guide for: "${topic}"

MAIN STEPS:
${stepsText}

For each step, provide:
1. Clear, simple instruction
2. Why this step matters
3. Common mistakes to avoid
4. Pro tips for that step
5. What to do if something goes wrong

GUIDE STRUCTURE:
1. Introduction: Why this matters and what to expect
2. Prerequisites: What you need before starting
3. Step-by-step instructions (with substeps where needed)
4. Troubleshooting common issues
5. Advanced tips and variations
6. Frequently asked questions
7. Next steps after completion

Use simple language that beginners can follow.
Include real-world examples.
Provide alternative methods when applicable.
Create for fast scanning (use lists, bold text, subheadings).

Format as JSON with structured content for markdown formatting.`
  }

  /**
   * Generate listicle/roundup prompt
   */
  static generateListiclePrompt(
    keyword: string,
    items: string[],
    count: number = 10
  ): string {
    const itemsText = items.slice(0, count).map((item, i) => `${i + 1}. ${item}`).join('\n')

    return `You are an expert curating the top ${count} "${keyword}".

Create a comprehensive listicle article about:

TOP ${count} ITEMS:
${itemsText}

For each item, provide:
1. Name and brief description (1-2 sentences)
2. Key features and benefits (3-4 bullet points)
3. Best for (who should use this)
4. Pricing information (if applicable)
5. Pros and cons (2-3 each)
6. Rating/overall assessment

ARTICLE STRUCTURE:
1. Introduction explaining why these ${count} are best
2. Quick comparison table (Item | Best For | Price)
3. Detailed reviews of each item
4. Comparison of top 3 in depth
5. Buying guide and tips
6. FAQ section
7. Conclusion with recommendation

QUALITY REQUIREMENTS:
- Original comparisons and insights
- Real data and verified information
- Honest assessment (include cons)
- Updated with latest information
- Practical buying guidance

Format as JSON with structured data for each item and markdown content for article.`
  }

  /**
   * Generate trend analysis prompt
   */
  static generateTrendPrompt(
    topic: string,
    trendName: string,
    newsContext?: string
  ): string {
    const newsSection = newsContext ? `\n\nRECENT DEVELOPMENTS:\n${newsContext}` : ''

    return `You are a trend analyst. Analyze the current trend: "${trendName}" in "${topic}"

${newsSection}

Create an analysis article that covers:

1. What is this trend? (Definition and context)
2. Why is it important? (Impact and significance)
3. Key developments (Latest news and updates)
4. Who is affected? (Industries, personas, markets)
5. Current state (Where we are now)
6. Future outlook (Where it's heading)
7. How to prepare (Actionable steps)
8. Expert opinions (Cited perspectives)
9. Challenges and risks (What could go wrong)
10. Opportunities (How to benefit)

REQUIREMENTS:
- Use current, latest data available
- Include recent news and announcements
- Cite expert sources and analysts
- Provide forward-looking insights
- Explain implications practically
- Help readers understand and prepare

Format as JSON with analysis content optimized for markdown.`
  }

  /**
   * Build complete prompt with all enhancements
   */
  static buildEnhancedPrompt(
    basePrompt: string,
    enhancements: {
      eeatSignals?: string
      snippetOptimization?: string
      internalLinks?: string
    }
  ): string {
    let finalPrompt = basePrompt

    if (enhancements.eeatSignals) {
      finalPrompt += `\n\nE-A-A-T ENHANCEMENTS:\n${enhancements.eeatSignals}`
    }

    if (enhancements.snippetOptimization) {
      finalPrompt += `\n\nFEATURED SNIPPET OPTIMIZATION:\n${enhancements.snippetOptimization}`
    }

    if (enhancements.internalLinks) {
      finalPrompt += `\n\nINTERNAL LINKING OPPORTUNITIES:\n${enhancements.internalLinks}`
    }

    return finalPrompt
  }

  /**
   * Validate content against SEO requirements
   */
  static validateSEOContent(content: string, keywords: string[]): {
    score: number
    passed: boolean
    issues: string[]
    recommendations: string[]
  } {
    let score = 100
    const issues: string[] = []
    const recommendations: string[] = []

    // Check structure
    const h2Count = (content.match(/## /g) || []).length
    if (h2Count < 3) {
      score -= 20
      issues.push('Too few H2 headings (min 3 recommended)')
      recommendations.push('Add more H2 sections covering different aspects')
    } else if (h2Count > 15) {
      score -= 10
      issues.push('Too many H2 headings (aim for 6-12 for depth)')
      recommendations.push('Consolidate related sections for better depth')
    } else {
      recommendations.push('Good section structure')
    }

    // Check word count
    const wordCount = content.split(/\s+/).length
    if (wordCount < 500) {
      score -= 15
      issues.push('Content too short (min 500 words)')
      recommendations.push('Expand content to at least 1000 words')
    } else if (wordCount > 5000) {
      score -= 10
      issues.push('Content very long (may need splitting)')
      recommendations.push('Consider breaking into multiple articles')
    } else {
      recommendations.push('Good content length')
    }

    // Check keyword usage
    const keywordMatches = keywords.filter(kw => 
      content.toLowerCase().includes(kw.toLowerCase())
    ).length

    if (keywordMatches < keywords.length * 0.5) {
      score -= 15
      issues.push('Keywords not well covered')
      recommendations.push('Include more keyword variations throughout')
    } else if (keywordMatches === keywords.length) {
      recommendations.push('All keywords naturally integrated')
    }

    // Check for lists
    if (!content.includes('\n-') && !content.includes('\n1.')) {
      score -= 5
      issues.push('Missing formatted lists')
      recommendations.push('Add 1-2 bulleted or numbered lists')
    } else {
      recommendations.push('Good use of formatting')
    }

    // Check for E-A-A-T signals
    const eeatKeywords = ['expert', 'experience', 'data', 'research', 'study', 'verified', 'certified']
    const eeatCount = eeatKeywords.filter(kw => 
      content.toLowerCase().includes(kw)
    ).length

    if (eeatCount < 3) {
      score -= 10
      issues.push('Missing E-A-A-T signals')
      recommendations.push('Add expertise markers, citations, and trust indicators')
    } else {
      recommendations.push('Strong E-A-A-T signals present')
    }

    return {
      score: Math.max(40, score),
      passed: score >= 70,
      issues,
      recommendations
    }
  }
}

export default SEOGenerationPrompts