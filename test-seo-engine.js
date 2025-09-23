// Test the SEO automation engine directly
console.log('Testing SEO Automation Engine...')

try {
  // Try to import the engine
  const { SEOAutomationEngine } = require('./lib/seo-automation-engine.ts')
  console.log('✅ SEOAutomationEngine imported successfully')
  
  // Test the optimization
  const result = SEOAutomationEngine.autoOptimizeArticle(
    'Best AI Writing Tools',
    'This is test content about AI writing tools for content creators.',
    'AI writing tools',
    'ai-tools'
  )
  
  console.log('✅ SEO optimization completed:', result)
  
} catch (error) {
  console.error('❌ Error testing SEO engine:', error.message)
}