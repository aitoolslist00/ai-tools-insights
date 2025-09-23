/**
 * ADVANCED PERFORMANCE OPTIMIZER
 * Expert-level performance optimizations for maximum search engine signals
 */

export class PerformanceOptimizer {
  // Advanced resource hints for maximum loading speed
  static generateResourceHints(url: string): string[] {
    const hints = [
      // DNS prefetch for external resources
      '<link rel="dns-prefetch" href="//fonts.googleapis.com">',
      '<link rel="dns-prefetch" href="//fonts.gstatic.com">',
      '<link rel="dns-prefetch" href="//www.google-analytics.com">',
      '<link rel="dns-prefetch" href="//www.googletagmanager.com">',
      
      // Preconnect for critical resources
      '<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>',
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
      
      // Preload critical resources
      '<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>',
      '<link rel="preload" href="/logo.png" as="image">',
      
      // Module preload for critical JavaScript
      '<link rel="modulepreload" href="/_next/static/chunks/main.js">',
      '<link rel="modulepreload" href="/_next/static/chunks/pages/_app.js">',
      
      // Prefetch for likely next pages
      '<link rel="prefetch" href="/ai-tools">',
      '<link rel="prefetch" href="/blog">',
      '<link rel="prefetch" href="/sitemap.xml">',
    ]
    
    return hints
  }
  
  // Advanced service worker for aggressive caching
  static generateServiceWorkerCode(): string {
    return `
// Advanced Service Worker for Maximum Performance
const CACHE_NAME = 'ai-tools-insights-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/ai-tools',
  '/blog',
  '/manifest.json',
  '/offline.html',
  '/_next/static/css/app.css',
  '/_next/static/chunks/main.js',
  '/fonts/inter-var.woff2'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(CRITICAL_RESOURCES);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - advanced caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle different resource types with optimal strategies
  if (request.destination === 'document') {
    // HTML pages - Network first, cache fallback
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then((response) => {
            return response || caches.match('/offline.html');
          });
        })
    );
  } else if (request.destination === 'image') {
    // Images - Cache first, network fallback
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((fetchResponse) => {
          const responseClone = fetchResponse.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return fetchResponse;
        });
      })
    );
  } else if (request.destination === 'script' || request.destination === 'style') {
    // JS/CSS - Cache first with network update
    event.respondWith(
      caches.match(request).then((response) => {
        const fetchPromise = fetch(request).then((fetchResponse) => {
          const responseClone = fetchResponse.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return fetchResponse;
        });
        return response || fetchPromise;
      })
    );
  } else {
    // Other resources - Network first
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request);
      })
    );
  }
});

// Background sync for analytics
self.addEventListener('sync', (event) => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
});

// Push notifications for engagement
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New AI tools available!',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore Tools',
        icon: '/icon-explore.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('AI Tools Insights', options)
  );
});

// Advanced performance monitoring
function syncAnalytics() {
  return fetch('/api/analytics/sync', {
    method: 'POST',
    body: JSON.stringify({
      timestamp: Date.now(),
      performance: getPerformanceMetrics()
    })
  });
}

function getPerformanceMetrics() {
  return {
    navigation: performance.getEntriesByType('navigation')[0],
    resources: performance.getEntriesByType('resource').slice(0, 10),
    memory: performance.memory ? {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize
    } : null
  };
}
`;
  }
  
  // Advanced critical CSS extraction
  static extractCriticalCSS(html: string): string {
    // This would normally use a tool like Puppeteer to extract critical CSS
    // For now, return optimized critical styles
    return `
/* Critical CSS for Above-the-Fold Content */
*,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}
::before,::after{--tw-content:''}
html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal}
body{margin:0;line-height:inherit}
h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}
a{color:inherit;text-decoration:inherit}
button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}
button,select{text-transform:none}
button,[type='button'],[type='reset'],[type='submit']{-webkit-appearance:button;background-color:transparent;background-image:none}
img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}
img,video{max-width:100%;height:auto}
.container{width:100%}
@media (min-width:640px){.container{max-width:640px}}
@media (min-width:768px){.container{max-width:768px}}
@media (min-width:1024px){.container{max-width:1024px}}
@media (min-width:1280px){.container{max-width:1280px}}
@media (min-width:1536px){.container{max-width:1536px}}
.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}
.text-gray-900{--tw-text-opacity:1;color:rgb(17 24 39 / var(--tw-text-opacity))}
.font-bold{font-weight:700}
.text-4xl{font-size:2.25rem;line-height:2.5rem}
.mb-4{margin-bottom:1rem}
.px-4{padding-left:1rem;padding-right:1rem}
.py-8{padding-top:2rem;padding-bottom:2rem}
.flex{display:flex}
.items-center{align-items:center}
.justify-center{justify-content:center}
.min-h-screen{min-height:100vh}
`;
  }
  
  // Advanced image optimization
  static generateOptimizedImageHTML(src: string, alt: string, width: number, height: number): string {
    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/, '.webp');
    const avifSrc = src.replace(/\.(jpg|jpeg|png)$/, '.avif');
    
    return `
<picture>
  <source srcset="${avifSrc}" type="image/avif">
  <source srcset="${webpSrc}" type="image/webp">
  <img 
    src="${src}" 
    alt="${alt}"
    width="${width}"
    height="${height}"
    loading="lazy"
    decoding="async"
    fetchpriority="low"
    style="aspect-ratio: ${width}/${height}; object-fit: cover;"
    onload="this.style.opacity=1"
    style="opacity:0;transition:opacity 0.3s"
  >
</picture>`;
  }
  
  // Advanced font loading optimization
  static generateFontLoadingCSS(): string {
    return `
/* Advanced Font Loading Strategy */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('/fonts/inter-var.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Font loading optimization */
.font-loading {
  font-family: system-ui, -apple-system, sans-serif;
}

.font-loaded {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Prevent layout shift during font load */
body {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
`;
  }
  
  // Advanced JavaScript optimization
  static generateOptimizedJS(): string {
    return `
// Advanced Performance Monitoring and Optimization
(function() {
  'use strict';
  
  // Performance observer for Core Web Vitals
  function observeWebVitals() {
    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          sendMetric('LCP', entry.startTime);
        }
      }
    }).observe({entryTypes: ['largest-contentful-paint']});
    
    // First Input Delay
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.entryType === 'first-input') {
          sendMetric('FID', entry.processingStart - entry.startTime);
        }
      }
    }).observe({entryTypes: ['first-input']});
    
    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          sendMetric('CLS', clsValue);
        }
      }
    }).observe({entryTypes: ['layout-shift']});
  }
  
  // Send metrics to analytics
  function sendMetric(name, value) {
    if ('gtag' in window) {
      gtag('event', 'web_vitals', {
        name: name,
        value: Math.round(value),
        custom_parameter_1: navigator.connection ? navigator.connection.effectiveType : 'unknown'
      });
    }
  }
  
  // Advanced resource loading optimization
  function optimizeResourceLoading() {
    // Preload critical resources
    const criticalResources = [
      '/api/tools/featured',
      '/api/categories'
    ];
    
    criticalResources.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
    
    // Lazy load non-critical images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
  
  // Advanced font loading
  function optimizeFontLoading() {
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        document.body.classList.add('font-loaded');
      });
    }
  }
  
  // Advanced service worker registration
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      }).then(registration => {
        console.log('SW registered:', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, refresh page
              window.location.reload();
            }
          });
        });
      }).catch(error => {
        console.log('SW registration failed:', error);
      });
    }
  }
  
  // Initialize all optimizations
  function init() {
    observeWebVitals();
    optimizeResourceLoading();
    optimizeFontLoading();
    registerServiceWorker();
    
    // Report page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        sendMetric('PageLoad', perfData.loadEventEnd - perfData.fetchStart);
      }, 0);
    });
  }
  
  // Start optimization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`;
  }
}

export default PerformanceOptimizer;