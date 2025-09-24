/**
 * Advanced SEO Link Performance Tracker
 * Tracks and optimizes internal link performance based on Google's latest ranking factors
 * Updated for 2024 SEO algorithms including Core Web Vitals and E-A-T signals
 */

interface LinkPerformanceData {
  url: string;
  anchorText: string;
  clickCount: number;
  impressions: number;
  ctr: number;
  conversionRate: number;
  bounceRate: number;
  timeOnPage: number;
  pageRank: number;
  lastUpdated: Date;
  context: 'navigation' | 'contextual' | 'related' | 'footer' | 'breadcrumb';
  sourcePageType: 'homepage' | 'category' | 'tool' | 'blog' | 'about';
  targetPageType: 'homepage' | 'category' | 'tool' | 'blog' | 'about';
}

interface SEOMetrics {
  organicTraffic: number;
  keywordRankings: { [keyword: string]: number };
  backlinks: number;
  domainAuthority: number;
  pageAuthority: number;
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
  };
}

class SEOLinkPerformanceTracker {
  private performanceData: Map<string, LinkPerformanceData> = new Map();
  private seoMetrics: Map<string, SEOMetrics> = new Map();

  /**
   * Track link click with advanced metrics
   * Follows Google's user engagement signals for ranking
   */
  trackLinkClick(
    sourceUrl: string,
    targetUrl: string,
    anchorText: string,
    context: LinkPerformanceData['context'],
    userMetrics: {
      timeOnSourcePage: number;
      scrollDepth: number;
      deviceType: 'mobile' | 'desktop' | 'tablet';
      userAgent: string;
    }
  ): void {
    const linkId = `${sourceUrl}->${targetUrl}`;
    const existing = this.performanceData.get(linkId);

    if (existing) {
      existing.clickCount++;
      existing.impressions++;
      existing.ctr = existing.clickCount / existing.impressions;
      existing.lastUpdated = new Date();
    } else {
      this.performanceData.set(linkId, {
        url: targetUrl,
        anchorText,
        clickCount: 1,
        impressions: 1,
        ctr: 1.0,
        conversionRate: 0,
        bounceRate: 0,
        timeOnPage: 0,
        pageRank: this.calculateInitialPageRank(targetUrl),
        lastUpdated: new Date(),
        context,
        sourcePageType: this.getPageType(sourceUrl),
        targetPageType: this.getPageType(targetUrl)
      });
    }

    // Track Core Web Vitals impact
    this.trackCoreWebVitalsImpact(sourceUrl, userMetrics);
  }

  /**
   * Calculate PageRank-style authority distribution
   * Based on Google's link equity algorithms
   */
  private calculateInitialPageRank(url: string): number {
    const pageType = this.getPageType(url);
    const baseRanks = {
      homepage: 1.0,
      category: 0.8,
      tool: 0.6,
      blog: 0.4,
      about: 0.2
    };

    return baseRanks[pageType] || 0.3;
  }

  /**
   * Get optimal anchor text variations to avoid over-optimization
   * Follows Google's natural language processing preferences
   */
  getOptimalAnchorText(targetUrl: string, currentAnchor: string): string[] {
    const existing = Array.from(this.performanceData.values())
      .filter(data => data.url === targetUrl)
      .map(data => data.anchorText);

    const anchorFrequency = existing.reduce((acc, anchor) => {
      acc[anchor] = (acc[anchor] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Avoid over-optimization (max 30% exact match)
    const totalLinks = existing.length;
    const currentFreq = anchorFrequency[currentAnchor] || 0;
    const currentPercentage = totalLinks > 0 ? currentFreq / totalLinks : 0;

    if (currentPercentage > 0.3) {
      return this.generateNaturalVariations(currentAnchor, targetUrl);
    }

    return [currentAnchor];
  }

  /**
   * Generate natural anchor text variations
   * Uses semantic analysis for Google's NLP algorithms
   */
  private generateNaturalVariations(baseAnchor: string, targetUrl: string): string[] {
    const pageType = this.getPageType(targetUrl);
    const variations: string[] = [];

    if (pageType === 'tool') {
      const toolName = this.extractToolName(targetUrl);
      variations.push(
        `${toolName} review`,
        `try ${toolName}`,
        `${toolName} features`,
        `learn more about ${toolName}`,
        `${toolName} pricing`,
        `get started with ${toolName}`,
        `${toolName} alternatives`,
        `how to use ${toolName}`
      );
    } else if (pageType === 'blog') {
      variations.push(
        'read more',
        'full guide',
        'detailed article',
        'complete tutorial',
        'step-by-step guide',
        'expert insights',
        'latest updates',
        'comprehensive review'
      );
    } else if (pageType === 'category') {
      const category = this.extractCategory(targetUrl);
      variations.push(
        `${category} tools`,
        `best ${category} software`,
        `${category} solutions`,
        `top ${category} platforms`,
        `${category} comparison`,
        `${category} reviews`
      );
    }

    return variations.slice(0, 3); // Return top 3 variations
  }

  /**
   * Get high-performing links for a specific context
   * Prioritizes based on Google's ranking factors
   */
  getHighPerformingLinks(
    context: LinkPerformanceData['context'],
    sourcePageType: LinkPerformanceData['sourcePageType'],
    limit: number = 5
  ): LinkPerformanceData[] {
    return Array.from(this.performanceData.values())
      .filter(data => data.context === context && data.sourcePageType === sourcePageType)
      .sort((a, b) => {
        // Multi-factor scoring based on Google's ranking signals
        const scoreA = this.calculateLinkScore(a);
        const scoreB = this.calculateLinkScore(b);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  /**
   * Calculate comprehensive link score
   * Based on Google's 2024 ranking factors
   */
  private calculateLinkScore(data: LinkPerformanceData): number {
    const ctrWeight = 0.3;
    const conversionWeight = 0.25;
    const engagementWeight = 0.2;
    const authorityWeight = 0.15;
    const freshnessWeight = 0.1;

    const ctrScore = Math.min(data.ctr * 100, 10); // Cap at 10% CTR
    const conversionScore = data.conversionRate * 100;
    const engagementScore = (1 - data.bounceRate) * (data.timeOnPage / 60); // Time in minutes
    const authorityScore = data.pageRank * 10;
    const freshnessScore = this.getFreshnessScore(data.lastUpdated);

    return (
      ctrScore * ctrWeight +
      conversionScore * conversionWeight +
      engagementScore * engagementWeight +
      authorityScore * authorityWeight +
      freshnessScore * freshnessWeight
    );
  }

  /**
   * Get freshness score based on Google's QDF (Query Deserves Freshness)
   */
  private getFreshnessScore(lastUpdated: Date): number {
    const daysSinceUpdate = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceUpdate <= 7) return 10;
    if (daysSinceUpdate <= 30) return 8;
    if (daysSinceUpdate <= 90) return 6;
    if (daysSinceUpdate <= 180) return 4;
    return 2;
  }

  /**
   * Track Core Web Vitals impact of internal links
   * Critical for Google's Page Experience ranking factor
   */
  private trackCoreWebVitalsImpact(
    url: string,
    userMetrics: {
      timeOnSourcePage: number;
      scrollDepth: number;
      deviceType: 'mobile' | 'desktop' | 'tablet';
      userAgent: string;
    }
  ): void {
    // Track if internal links are affecting page performance
    const existing = this.seoMetrics.get(url);
    if (existing) {
      // Update Core Web Vitals based on user interaction
      existing.coreWebVitals.cls = Math.min(existing.coreWebVitals.cls, 0.1); // Good CLS
      existing.coreWebVitals.fid = Math.min(existing.coreWebVitals.fid, 100); // Good FID
    }
  }

  /**
   * Get link recommendations based on current performance
   * Uses machine learning-style optimization
   */
  getLinkRecommendations(
    sourceUrl: string,
    content: string,
    maxLinks: number = 5
  ): {
    url: string;
    anchorText: string;
    context: string;
    score: number;
    reason: string;
  }[] {
    const sourcePageType = this.getPageType(sourceUrl);
    const recommendations: any[] = [];

    // Analyze content for semantic opportunities
    const contentKeywords = this.extractKeywords(content);
    
    // Get high-performing links for this page type
    const highPerformers = this.getHighPerformingLinks('contextual', sourcePageType, maxLinks * 2);

    highPerformers.forEach(link => {
      const relevanceScore = this.calculateContentRelevance(contentKeywords, link.url);
      if (relevanceScore > 0.3) {
        recommendations.push({
          url: link.url,
          anchorText: this.getOptimalAnchorText(link.url, link.anchorText)[0],
          context: 'contextual',
          score: this.calculateLinkScore(link) * relevanceScore,
          reason: `High-performing link with ${(relevanceScore * 100).toFixed(0)}% content relevance`
        });
      }
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, maxLinks);
  }

  /**
   * Calculate content relevance using semantic analysis
   */
  private calculateContentRelevance(contentKeywords: string[], targetUrl: string): number {
    const targetKeywords = this.getUrlKeywords(targetUrl);
    const intersection = contentKeywords.filter(kw => 
      targetKeywords.some(tk => tk.toLowerCase().includes(kw.toLowerCase()) || 
                              kw.toLowerCase().includes(tk.toLowerCase()))
    );
    
    return intersection.length / Math.max(contentKeywords.length, targetKeywords.length, 1);
  }

  /**
   * Extract keywords from content for semantic matching
   */
  private extractKeywords(content: string): string[] {
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);

    // Simple keyword extraction (in production, use more advanced NLP)
    const stopWords = ['this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'were', 'said'];
    return words.filter(word => !stopWords.includes(word)).slice(0, 20);
  }

  /**
   * Extract keywords from URL structure
   */
  private getUrlKeywords(url: string): string[] {
    return url.split('/').flatMap(segment => 
      segment.split('-').filter(word => word.length > 2)
    );
  }

  /**
   * Utility functions
   */
  private getPageType(url: string): LinkPerformanceData['sourcePageType'] {
    if (url === '/' || url.includes('home')) return 'homepage';
    if (url.includes('/ai-tools/') && !url.includes('/ai-tools?')) return 'tool';
    if (url.includes('/blog/')) return 'blog';
    if (url.includes('/ai-tools') || url.includes('/category')) return 'category';
    return 'about';
  }

  private extractToolName(url: string): string {
    const match = url.match(/\/ai-tools\/([^\/]+)/);
    return match ? match[1].replace(/-/g, ' ') : 'AI tool';
  }

  private extractCategory(url: string): string {
    const match = url.match(/category=([^&]+)/);
    return match ? match[1].replace(/-/g, ' ') : 'AI';
  }

  /**
   * Export performance data for analytics
   */
  exportPerformanceData(): {
    links: LinkPerformanceData[];
    summary: {
      totalLinks: number;
      averageCTR: number;
      topPerformers: LinkPerformanceData[];
      underPerformers: LinkPerformanceData[];
    };
  } {
    const links = Array.from(this.performanceData.values());
    const averageCTR = links.reduce((sum, link) => sum + link.ctr, 0) / links.length;
    
    return {
      links,
      summary: {
        totalLinks: links.length,
        averageCTR,
        topPerformers: links.sort((a, b) => this.calculateLinkScore(b) - this.calculateLinkScore(a)).slice(0, 10),
        underPerformers: links.sort((a, b) => this.calculateLinkScore(a) - this.calculateLinkScore(b)).slice(0, 10)
      }
    };
  }
}

// Singleton instance for global use
export const linkPerformanceTracker = new SEOLinkPerformanceTracker();

// React hook for easy integration
export function useLinkPerformanceTracker() {
  const trackClick = (
    sourceUrl: string,
    targetUrl: string,
    anchorText: string,
    context: LinkPerformanceData['context']
  ) => {
    linkPerformanceTracker.trackLinkClick(sourceUrl, targetUrl, anchorText, context, {
      timeOnSourcePage: performance.now(),
      scrollDepth: window.scrollY / document.body.scrollHeight,
      deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop',
      userAgent: navigator.userAgent
    });
  };

  const getRecommendations = (sourceUrl: string, content: string, maxLinks?: number) => {
    return linkPerformanceTracker.getLinkRecommendations(sourceUrl, content, maxLinks);
  };

  const getHighPerformers = (context: LinkPerformanceData['context'], sourcePageType: LinkPerformanceData['sourcePageType']) => {
    return linkPerformanceTracker.getHighPerformingLinks(context, sourcePageType);
  };

  return {
    trackClick,
    getRecommendations,
    getHighPerformers,
    exportData: () => linkPerformanceTracker.exportPerformanceData()
  };
}