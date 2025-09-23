interface SEOMetrics {
  pageTitle: string
  metaDescription: string
  h1Count: number
  h2Count: number
  imageCount: number
  imagesWithAlt: number
  internalLinks: number
  externalLinks: number
  wordCount: number
  loadTime: number
  coreWebVitals: {
    lcp?: number
    fid?: number
    cls?: number
  }
}

export class SEOMonitor {
  private static instance: SEOMonitor
  private metrics: Map<string, SEOMetrics> = new Map()

  static getInstance(): SEOMonitor {
    if (!SEOMonitor.instance) {
      SEOMonitor.instance = new SEOMonitor()
    }
    return SEOMonitor.instance
  }

  // Analyze page SEO metrics
  analyzePage(url: string): SEOMetrics {
    if (typeof window === 'undefined') {
      return this.getDefaultMetrics()
    }

    const startTime = performance.now()
    
    const metrics: SEOMetrics = {
      pageTitle: document.title,
      metaDescription: this.getMetaDescription(),
      h1Count: document.querySelectorAll('h1').length,
      h2Count: document.querySelectorAll('h2').length,
      imageCount: document.querySelectorAll('img').length,
      imagesWithAlt: document.querySelectorAll('img[alt]').length,
      internalLinks: this.countInternalLinks(),
      externalLinks: this.countExternalLinks(),
      wordCount: this.getWordCount(),
      loadTime: performance.now() - startTime,
      coreWebVitals: this.getCoreWebVitals()
    }

    this.metrics.set(url, metrics)
    this.reportMetrics(url, metrics)
    
    return metrics
  }

  private getMetaDescription(): string {
    const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement
    return metaDesc?.content || ''
  }

  private countInternalLinks(): number {
    const links = document.querySelectorAll('a[href]')
    let count = 0
    
    links.forEach(link => {
      const href = (link as HTMLAnchorElement).href
      if (href.includes(window.location.hostname) || href.startsWith('/')) {
        count++
      }
    })
    
    return count
  }

  private countExternalLinks(): number {
    const links = document.querySelectorAll('a[href]')
    let count = 0
    
    links.forEach(link => {
      const href = (link as HTMLAnchorElement).href
      if (href.startsWith('http') && !href.includes(window.location.hostname)) {
        count++
      }
    })
    
    return count
  }

  private getWordCount(): number {
    const textContent = document.body.innerText || ''
    return textContent.split(/\s+/).filter(word => word.length > 0).length
  }

  private getCoreWebVitals(): SEOMetrics['coreWebVitals'] {
    const vitals: SEOMetrics['coreWebVitals'] = {}

    if ('PerformanceObserver' in window) {
      // Get LCP
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as any
          vitals.lcp = lastEntry.startTime
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        // LCP not supported
      }

      // Get FID
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            vitals.fid = entry.processingStart - entry.startTime
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
      } catch (e) {
        // FID not supported
      }

      // Get CLS
      let clsValue = 0
      try {
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          vitals.cls = clsValue
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        // CLS not supported
      }
    }

    return vitals
  }

  private getDefaultMetrics(): SEOMetrics {
    return {
      pageTitle: '',
      metaDescription: '',
      h1Count: 0,
      h2Count: 0,
      imageCount: 0,
      imagesWithAlt: 0,
      internalLinks: 0,
      externalLinks: 0,
      wordCount: 0,
      loadTime: 0,
      coreWebVitals: {}
    }
  }

  // Report metrics to analytics
  private reportMetrics(url: string, metrics: SEOMetrics): void {
    if (typeof window !== 'undefined' && window.gtag) {
      // Report SEO metrics to Google Analytics
      window.gtag('event', 'seo_analysis', {
        page_url: url,
        page_title_length: metrics.pageTitle.length,
        meta_description_length: metrics.metaDescription.length,
        h1_count: metrics.h1Count,
        h2_count: metrics.h2Count,
        image_count: metrics.imageCount,
        images_with_alt: metrics.imagesWithAlt,
        internal_links: metrics.internalLinks,
        external_links: metrics.externalLinks,
        word_count: metrics.wordCount,
        load_time: Math.round(metrics.loadTime)
      })

      // Report Core Web Vitals
      if (metrics.coreWebVitals.lcp) {
        window.gtag('event', 'web_vitals', {
          name: 'LCP',
          value: Math.round(metrics.coreWebVitals.lcp),
          event_category: 'Web Vitals'
        })
      }

      if (metrics.coreWebVitals.fid) {
        window.gtag('event', 'web_vitals', {
          name: 'FID',
          value: Math.round(metrics.coreWebVitals.fid),
          event_category: 'Web Vitals'
        })
      }

      if (metrics.coreWebVitals.cls) {
        window.gtag('event', 'web_vitals', {
          name: 'CLS',
          value: Math.round(metrics.coreWebVitals.cls * 1000),
          event_category: 'Web Vitals'
        })
      }
    }
  }

  // Get SEO recommendations
  getRecommendations(metrics: SEOMetrics): string[] {
    const recommendations: string[] = []

    if (metrics.pageTitle.length < 30) {
      recommendations.push('Page title is too short. Aim for 50-60 characters.')
    } else if (metrics.pageTitle.length > 60) {
      recommendations.push('Page title is too long. Keep it under 60 characters.')
    }

    if (metrics.metaDescription.length < 120) {
      recommendations.push('Meta description is too short. Aim for 150-160 characters.')
    } else if (metrics.metaDescription.length > 160) {
      recommendations.push('Meta description is too long. Keep it under 160 characters.')
    }

    if (metrics.h1Count === 0) {
      recommendations.push('Missing H1 tag. Add a main heading to your page.')
    } else if (metrics.h1Count > 1) {
      recommendations.push('Multiple H1 tags found. Use only one H1 per page.')
    }

    if (metrics.h2Count < 2) {
      recommendations.push('Consider adding more H2 headings to improve content structure.')
    }

    if (metrics.imageCount > 0 && metrics.imagesWithAlt < metrics.imageCount) {
      recommendations.push(`${metrics.imageCount - metrics.imagesWithAlt} images missing alt text.`)
    }

    if (metrics.wordCount < 300) {
      recommendations.push('Content is too short. Aim for at least 300 words.')
    }

    if (metrics.internalLinks < 3) {
      recommendations.push('Add more internal links to improve site navigation and SEO.')
    }

    if (metrics.coreWebVitals.lcp && metrics.coreWebVitals.lcp > 2500) {
      recommendations.push('Largest Contentful Paint is slow. Optimize images and server response time.')
    }

    if (metrics.coreWebVitals.fid && metrics.coreWebVitals.fid > 100) {
      recommendations.push('First Input Delay is high. Optimize JavaScript execution.')
    }

    if (metrics.coreWebVitals.cls && metrics.coreWebVitals.cls > 0.1) {
      recommendations.push('Cumulative Layout Shift is high. Ensure stable page layout.')
    }

    return recommendations
  }

  // Export metrics for analysis
  exportMetrics(): Record<string, SEOMetrics> {
    return Object.fromEntries(this.metrics)
  }

  // Clear stored metrics
  clearMetrics(): void {
    this.metrics.clear()
  }
}

// Hook for React components
export function useSEOMonitor(url: string) {
  const monitor = SEOMonitor.getInstance()
  
  if (typeof window !== 'undefined') {
    const metrics = monitor.analyzePage(url)
    const recommendations = monitor.getRecommendations(metrics)
    
    return { metrics, recommendations }
  }
  
  return { 
    metrics: {
      pageTitle: '',
      metaDescription: '',
      h1Count: 0,
      h2Count: 0,
      imageCount: 0,
      imagesWithAlt: 0,
      internalLinks: 0,
      externalLinks: 0,
      wordCount: 0,
      loadTime: 0,
      coreWebVitals: {}
    }, 
    recommendations: [] 
  }
}