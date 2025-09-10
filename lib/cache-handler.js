// Advanced cache handler for Next.js ISR optimization
const { IncrementalCache } = require('@next/cache')

class AdvancedCacheHandler extends IncrementalCache {
  constructor(options) {
    super(options)
    this.name = 'advanced-cache-handler'
    console.log('Advanced cache handler initialized')
  }

  async get(key, kind) {
    console.log(`Cache GET: ${key} (${kind})`)
    
    try {
      const result = await super.get(key, kind)
      
      if (result) {
        console.log(`Cache HIT: ${key}`)
        // Add cache hit metrics
        this.trackCacheHit(key, kind)
      } else {
        console.log(`Cache MISS: ${key}`)
        this.trackCacheMiss(key, kind)
      }
      
      return result
    } catch (error) {
      console.error(`Cache GET error for ${key}:`, error)
      return null
    }
  }

  async set(key, data, ctx) {
    console.log(`Cache SET: ${key}`)
    
    try {
      // Enhanced cache settings based on content type
      const enhancedCtx = this.enhanceCacheContext(ctx, key)
      
      const result = await super.set(key, data, enhancedCtx)
      
      console.log(`Cache SET success: ${key}`)
      this.trackCacheSet(key, data)
      
      return result
    } catch (error) {
      console.error(`Cache SET error for ${key}:`, error)
      throw error
    }
  }

  enhanceCacheContext(ctx, key) {
    // Customize cache behavior based on content type
    const enhanced = { ...ctx }
    
    // Longer cache for static pages
    if (key.includes('/ai-tools/') && !key.includes('api')) {
      enhanced.revalidate = 86400 // 24 hours for tool pages
    }
    
    // Shorter cache for dynamic content
    if (key.includes('/blog/') || key.includes('/search')) {
      enhanced.revalidate = 3600 // 1 hour for blog and search
    }
    
    // Very long cache for static assets
    if (key.includes('/_next/static/')) {
      enhanced.revalidate = 31536000 // 1 year for static assets
    }
    
    return enhanced
  }

  trackCacheHit(key, kind) {
    // Track cache performance metrics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cache_hit', {
        cache_key: key,
        cache_kind: kind,
        timestamp: Date.now()
      })
    }
  }

  trackCacheMiss(key, kind) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cache_miss', {
        cache_key: key,
        cache_kind: kind,
        timestamp: Date.now()
      })
    }
  }

  trackCacheSet(key, data) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cache_set', {
        cache_key: key,
        data_size: JSON.stringify(data).length,
        timestamp: Date.now()
      })
    }
  }
}

module.exports = AdvancedCacheHandler