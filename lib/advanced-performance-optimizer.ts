// Advanced Performance Optimization Engine
export class AdvancedPerformanceOptimizer {
  
  // Critical Resource Hints Generator
  static generateCriticalResourceHints() {
    return [
      // DNS prefetching for critical domains
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
      { rel: 'dns-prefetch', href: '//images.unsplash.com' },
      { rel: 'dns-prefetch', href: '//api.aitoolsinsights.com' },
      { rel: 'dns-prefetch', href: '//analytics.google.com' },
      { rel: 'dns-prefetch', href: '//www.googletagmanager.com' },
      
      // Preconnect for critical resources
      { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossOrigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://images.unsplash.com', crossOrigin: 'anonymous' },
      
      // Preload critical assets
      { rel: 'preload', href: '/hero-bg.webp', as: 'image', type: 'image/webp' },
      { rel: 'preload', href: '/logo.svg', as: 'image', type: 'image/svg+xml' },
      { rel: 'preload', href: '/favicon.ico', as: 'image', type: 'image/x-icon' },
      
      // Module preload for critical JavaScript
      { rel: 'modulepreload', href: '/_next/static/chunks/main.js' },
      { rel: 'modulepreload', href: '/_next/static/chunks/pages/_app.js' },
      
      // Prefetch likely navigation targets
      { rel: 'prefetch', href: '/ai-tools' },
      { rel: 'prefetch', href: '/blog' },
      { rel: 'prefetch', href: '/search' }
    ]
  }

  // Advanced Web Vitals Optimization
  static generateWebVitalsOptimization() {
    return `
    // Largest Contentful Paint (LCP) Optimization
    window.__LCP_OPTIMIZATIONS__ = {
      // Preload hero image
      preloadHeroImage() {
        const heroImg = new Image();
        heroImg.src = '/hero-bg.webp';
        if (heroImg.fetchPriority) {
          heroImg.fetchPriority = 'high';
        }
      },
      
      // Optimize font loading
      optimizeFontLoading() {
        document.fonts.ready.then(() => {
          document.documentElement.classList.add('fonts-loaded');
        });
      },
      
      // Reduce main thread blocking
      reduceMainThreadBlocking() {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            // Load non-critical JavaScript
            try {
              import('/js/non-critical.js').catch(() => {});
            } catch (error) {
              console.warn('Could not load non-critical JS');
            }
          });
        }
      }
    };

    // Cumulative Layout Shift (CLS) Prevention
    window.__CLS_OPTIMIZATIONS__ = {
      // Reserve space for images
      reserveImageSpace() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
          if (!img.style.aspectRatio && img.dataset.width && img.dataset.height) {
            img.style.aspectRatio = \`\${img.dataset.width} / \${img.dataset.height}\`;
          }
        });
      },
      
      // Prevent ad layout shifts
      preventAdShifts() {
        const adSlots = document.querySelectorAll('.ad-slot');
        adSlots.forEach(slot => {
          slot.style.minHeight = slot.dataset.minHeight || '250px';
        });
      }
    };

    // First Input Delay (FID) Optimization
    window.__FID_OPTIMIZATIONS__ = {
      // Break up long tasks
      breakUpLongTasks() {
        function yieldToMain() {
          return new Promise(resolve => {
            setTimeout(resolve, 0);
          });
        }
        
        window.yieldToMain = yieldToMain;
      },
      
      // Optimize event handlers
      optimizeEventHandlers() {
        // Use passive listeners where possible
        function handleTouch() { /* optimized handler */ }
        function handleWheel() { /* optimized handler */ }
        
        document.addEventListener('touchstart', handleTouch, { passive: true });
        document.addEventListener('wheel', handleWheel, { passive: true });
      }
    };

    // Initialize optimizations
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initOptimizations);
    } else {
      initOptimizations();
    }

    function initOptimizations() {
      try {
        window.__LCP_OPTIMIZATIONS__.preloadHeroImage();
        window.__LCP_OPTIMIZATIONS__.optimizeFontLoading();
        window.__CLS_OPTIMIZATIONS__.reserveImageSpace();
        window.__FID_OPTIMIZATIONS__.breakUpLongTasks();
      } catch (error) {
        console.warn('Performance optimization initialization failed:', error);
      }
    }
    `;
  }

  // Critical CSS Inlining
  static generateCriticalCSS() {
    return `
    /* Critical Above-the-fold CSS */
    .hero-section {
      min-height: 70vh;
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
      overflow: hidden;
    }

    .hero-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      text-align: center;
      color: white;
      z-index: 2;
    }

    .hero-title {
      font-size: clamp(2rem, 5vw, 4rem);
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 1.5rem;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .hero-description {
      font-size: clamp(1.125rem, 2.5vw, 1.5rem);
      margin-bottom: 2rem;
      opacity: 0.9;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .nav-container {
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .nav-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-link {
      color: #4b5563;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .nav-link:hover {
      color: #2563eb;
    }

    /* Loading states */
    .loading-skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Font display optimization */
    .fonts-loaded .hero-title,
    .fonts-loaded .hero-description {
      font-family: var(--font-inter);
    }
    `;
  }

  // Performance Budget Monitoring
  static generatePerformanceBudgetMonitor() {
    return `
    if ('PerformanceObserver' in window) {
      const budgets = {
        lcp: 2500, // 2.5 seconds
        fid: 100,  // 100ms
        cls: 0.1,  // 0.1
        fcp: 1800, // 1.8 seconds
        ttfb: 600  // 600ms
      };
      
      const metrics = {};

      // Monitor Core Web Vitals
      try {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          metrics.lcp = lastEntry.startTime;
          
          if (metrics.lcp > budgets.lcp) {
            console.warn('LCP Budget Violation:', metrics.lcp + 'ms > ' + budgets.lcp + 'ms');
          }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        new PerformanceObserver((entryList) => {
          const firstInput = entryList.getEntries()[0];
          metrics.fid = firstInput.processingStart - firstInput.startTime;
          
          if (metrics.fid > budgets.fid) {
            console.warn('FID Budget Violation:', metrics.fid + 'ms > ' + budgets.fid + 'ms');
          }
        }).observe({ entryTypes: ['first-input'] });

        let cls = 0;
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              cls += entry.value;
            }
          }
          metrics.cls = cls;
          
          if (metrics.cls > budgets.cls) {
            console.warn('CLS Budget Violation:', metrics.cls + ' > ' + budgets.cls);
          }
        }).observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('Performance monitoring setup failed:', error);
      }
    }
    `;
  }
}