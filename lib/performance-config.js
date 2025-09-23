// Performance monitoring configuration
export const performanceConfig = {
  // Core Web Vitals thresholds
  thresholds: {
    LCP: 2500, // Largest Contentful Paint
    FID: 100,  // First Input Delay
    CLS: 0.1,  // Cumulative Layout Shift
    TTFB: 800, // Time to First Byte
  },
  
  // Enable monitoring in production
  enabled: process.env.NODE_ENV === 'production',
  
  // Analytics endpoint (replace with your service)
  endpoint: '/api/analytics',
}

export default performanceConfig
