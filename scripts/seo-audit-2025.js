#!/usr/bin/env node

/**
 * Comprehensive SEO Audit Script for 2025 Google Algorithm Compliance
 * Checks for all critical SEO factors and provides actionable recommendations
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

class SEOAudit2025 {
  constructor() {
    this.issues = []
    this.warnings = []
    this.successes = []
    this.baseUrl = 'https://www.aitoolsinsights.com'
    this.projectRoot = path.resolve(__dirname, '..')
  }

  async runAudit() {
    console.log('🔍 Starting Comprehensive SEO Audit 2025...\n')

    // Core SEO Checks
    await this.checkDomainConsistency()
    await this.checkMetadata()
    await this.checkStructuredData()
    await this.checkSitemaps()
    await this.checkRobotsTxt()
    await this.checkPerformance()
    await this.checkAccessibility()
    await this.checkMobileOptimization()
    await this.checkSecurityHeaders()
    await this.checkInternalLinking()
    await this.checkContentQuality()
    await this.checkEATSignals()
    
    // 2025 Algorithm Specific Checks
    await this.checkIntentSatisfactionTracking()
    await this.checkAIOptimization()
    await this.check2025Compliance()

    // Generate Report
    this.generateReport()
  }

  async checkDomainConsistency() {
    console.log('📍 Checking Domain Consistency...')
    
    const files = this.getReactFiles()
    let inconsistencies = 0

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8')
      
      // Check for mixed domain usage
      const aitoolslistMatches = content.match(/aitoolslist\.com/g) || []
      const aitoolsinsightsMatches = content.match(/aitoolsinsights\.com/g) || []
      
      if (aitoolslistMatches.length > 0) {
        inconsistencies += aitoolslistMatches.length
        this.issues.push(`Domain inconsistency in ${file}: Found ${aitoolslistMatches.length} instances of aitoolslist.com`)
      }
    }

    if (inconsistencies === 0) {
      this.successes.push('✅ Domain consistency: All URLs use aitoolsinsights.com')
    } else {
      this.issues.push(`❌ Found ${inconsistencies} domain inconsistencies that need fixing`)
    }
  }

  async checkMetadata() {
    console.log('📝 Checking Metadata Optimization...')
    
    const layoutFile = path.join(this.projectRoot, 'app/layout.tsx')
    const pageFile = path.join(this.projectRoot, 'app/page.tsx')
    
    if (fs.existsSync(layoutFile)) {
      const content = fs.readFileSync(layoutFile, 'utf8')
      
      // Check for 2025 metadata requirements
      const checks = [
        { pattern: /title:.*template/, name: 'Title template' },
        { pattern: /openGraph/, name: 'OpenGraph metadata' },
        { pattern: /twitter/, name: 'Twitter metadata' },
        { pattern: /robots/, name: 'Robots configuration' },
        { pattern: /verification/, name: 'Search engine verification' },
        { pattern: /category/, name: 'Content category' },
        { pattern: /classification/, name: 'Content classification' }
      ]

      checks.forEach(check => {
        if (check.pattern.test(content)) {
          this.successes.push(`✅ ${check.name} properly configured`)
        } else {
          this.warnings.push(`⚠️ ${check.name} missing or incomplete`)
        }
      })
    }
  }

  async checkStructuredData() {
    console.log('🏗️ Checking Structured Data...')
    
    const schemaFiles = [
      'lib/schema-generator.ts',
      'components/Enhanced2025SEO.tsx'
    ]

    let schemaImplemented = false
    
    for (const file of schemaFiles) {
      const fullPath = path.join(this.projectRoot, file)
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8')
        
        const schemaTypes = [
          'Organization',
          'WebSite',
          'Article',
          'Product',
          'BreadcrumbList',
          'FAQPage',
          'Review',
          'AggregateRating'
        ]

        schemaTypes.forEach(type => {
          if (content.includes(`"@type": "${type}"`)) {
            this.successes.push(`✅ ${type} schema implemented`)
            schemaImplemented = true
          }
        })
      }
    }

    if (!schemaImplemented) {
      this.issues.push('❌ Structured data implementation incomplete')
    }
  }

  async checkSitemaps() {
    console.log('🗺️ Checking Sitemap Structure...')
    
    const sitemapFiles = [
      'app/sitemap.ts',
      'app/sitemap-index.xml/route.ts',
      'app/sitemap-tools.xml/route.ts',
      'app/sitemap-blog.xml/route.ts',
      'app/sitemap-images.xml/route.ts',
      'app/sitemap-news.xml/route.ts'
    ]

    let sitemapsFound = 0
    
    sitemapFiles.forEach(file => {
      const fullPath = path.join(this.projectRoot, file)
      if (fs.existsSync(fullPath)) {
        sitemapsFound++
        this.successes.push(`✅ ${file} exists`)
      } else {
        this.warnings.push(`⚠️ ${file} missing`)
      }
    })

    if (sitemapsFound >= 4) {
      this.successes.push('✅ Comprehensive sitemap structure implemented')
    } else {
      this.issues.push('❌ Incomplete sitemap structure')
    }
  }

  async checkRobotsTxt() {
    console.log('🤖 Checking Robots.txt...')
    
    const robotsFile = path.join(this.projectRoot, 'app/robots.ts')
    
    if (fs.existsSync(robotsFile)) {
      const content = fs.readFileSync(robotsFile, 'utf8')
      
      const checks = [
        { pattern: /Googlebot/, name: 'Googlebot configuration' },
        { pattern: /Googlebot-Image/, name: 'Google Image Bot configuration' },
        { pattern: /sitemap/, name: 'Sitemap references' },
        { pattern: /GPTBot.*disallow/, name: 'AI crawler blocking' },
        { pattern: /crawlDelay/, name: 'Crawl delay settings' }
      ]

      checks.forEach(check => {
        if (check.pattern.test(content)) {
          this.successes.push(`✅ ${check.name} properly configured`)
        } else {
          this.warnings.push(`⚠️ ${check.name} missing`)
        }
      })
    } else {
      this.issues.push('❌ robots.ts file missing')
    }
  }

  async checkPerformance() {
    console.log('⚡ Checking Performance Optimization...')
    
    const nextConfigFile = path.join(this.projectRoot, 'next.config.js')
    
    if (fs.existsSync(nextConfigFile)) {
      const content = fs.readFileSync(nextConfigFile, 'utf8')
      
      const performanceChecks = [
        { pattern: /compress: true/, name: 'Compression enabled' },
        { pattern: /generateEtags/, name: 'ETags configuration' },
        { pattern: /Cache-Control/, name: 'Cache headers' },
        { pattern: /optimizePackageImports/, name: 'Package optimization' },
        { pattern: /webVitalsAttribution/, name: 'Web Vitals tracking' }
      ]

      performanceChecks.forEach(check => {
        if (check.pattern.test(content)) {
          this.successes.push(`✅ ${check.name} configured`)
        } else {
          this.warnings.push(`⚠️ ${check.name} missing`)
        }
      })
    }

    // Check for Core Web Vitals monitoring
    const webVitalsFile = path.join(this.projectRoot, 'components/CoreWebVitalsMonitor.tsx')
    if (fs.existsSync(webVitalsFile)) {
      this.successes.push('✅ Core Web Vitals monitoring implemented')
    } else {
      this.warnings.push('⚠️ Core Web Vitals monitoring missing')
    }
  }

  async checkAccessibility() {
    console.log('♿ Checking Accessibility...')
    
    const files = this.getReactFiles()
    let accessibilityIssues = 0

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8')
      
      // Check for common accessibility patterns
      if (content.includes('<img') && !content.includes('alt=')) {
        accessibilityIssues++
      }
      
      if (content.includes('<button') && !content.includes('aria-')) {
        // This is a simplified check
      }
    }

    if (accessibilityIssues === 0) {
      this.successes.push('✅ Basic accessibility checks passed')
    } else {
      this.warnings.push(`⚠️ Found ${accessibilityIssues} potential accessibility issues`)
    }
  }

  async checkMobileOptimization() {
    console.log('📱 Checking Mobile Optimization...')
    
    const layoutFile = path.join(this.projectRoot, 'app/layout.tsx')
    
    if (fs.existsSync(layoutFile)) {
      const content = fs.readFileSync(layoutFile, 'utf8')
      
      const mobileChecks = [
        { pattern: /viewport.*width=device-width/, name: 'Responsive viewport' },
        { pattern: /mobile-web-app-capable/, name: 'Mobile app capability' },
        { pattern: /apple-mobile-web-app/, name: 'iOS optimization' },
        { pattern: /manifest\.json/, name: 'Web app manifest' }
      ]

      mobileChecks.forEach(check => {
        if (check.pattern.test(content)) {
          this.successes.push(`✅ ${check.name} configured`)
        } else {
          this.warnings.push(`⚠️ ${check.name} missing`)
        }
      })
    }
  }

  async checkSecurityHeaders() {
    console.log('🔒 Checking Security Headers...')
    
    const nextConfigFile = path.join(this.projectRoot, 'next.config.js')
    
    if (fs.existsSync(nextConfigFile)) {
      const content = fs.readFileSync(nextConfigFile, 'utf8')
      
      const securityHeaders = [
        'Strict-Transport-Security',
        'X-Content-Type-Options',
        'X-Frame-Options',
        'X-XSS-Protection',
        'Referrer-Policy',
        'Permissions-Policy'
      ]

      securityHeaders.forEach(header => {
        if (content.includes(header)) {
          this.successes.push(`✅ ${header} header configured`)
        } else {
          this.warnings.push(`⚠️ ${header} header missing`)
        }
      })
    }
  }

  async checkInternalLinking() {
    console.log('🔗 Checking Internal Linking...')
    
    const linkingFile = path.join(this.projectRoot, 'components/InternalLinkingEngine.tsx')
    
    if (fs.existsSync(linkingFile)) {
      this.successes.push('✅ Internal linking engine implemented')
    } else {
      this.warnings.push('⚠️ Automated internal linking missing')
    }
  }

  async checkContentQuality() {
    console.log('📄 Checking Content Quality...')
    
    // Check for FAQ sections
    const faqFiles = this.findFiles('FAQ')
    if (faqFiles.length > 0) {
      this.successes.push('✅ FAQ sections implemented')
    } else {
      this.warnings.push('⚠️ FAQ sections missing')
    }

    // Check for blog content
    const blogFiles = this.findFiles('blog')
    if (blogFiles.length > 0) {
      this.successes.push('✅ Blog content structure exists')
    } else {
      this.warnings.push('⚠️ Blog content structure missing')
    }
  }

  async checkEATSignals() {
    console.log('🎯 Checking E-A-T Signals...')
    
    const files = this.getReactFiles()
    let eatSignals = 0

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8')
      
      if (content.includes('author')) eatSignals++
      if (content.includes('expert')) eatSignals++
      if (content.includes('review')) eatSignals++
      if (content.includes('updated')) eatSignals++
    }

    if (eatSignals > 5) {
      this.successes.push('✅ Strong E-A-T signals present')
    } else {
      this.warnings.push('⚠️ E-A-T signals could be strengthened')
    }
  }

  async checkIntentSatisfactionTracking() {
    console.log('🎯 Checking Intent Satisfaction Tracking (September 2025 Algorithm)...')
    
    const intentTrackerFile = path.join(this.projectRoot, 'components/IntentSatisfactionTracker.tsx')
    const apiEndpointFile = path.join(this.projectRoot, 'app/api/intent-metrics/route.ts')
    
    if (fs.existsSync(intentTrackerFile)) {
      const content = fs.readFileSync(intentTrackerFile, 'utf8')
      
      const intentFeatures = [
        { pattern: /timeOnPage/, name: 'Time on page tracking' },
        { pattern: /scrollDepth/, name: 'Scroll depth tracking' },
        { pattern: /engagementScore/, name: 'Engagement scoring' },
        { pattern: /taskCompletion/, name: 'Task completion detection' },
        { pattern: /userSatisfaction/, name: 'User satisfaction metrics' },
        { pattern: /UserInteraction/, name: 'UserInteraction schema' }
      ]

      let implementedFeatures = 0
      intentFeatures.forEach(feature => {
        if (feature.pattern.test(content)) {
          this.successes.push(`✅ ${feature.name} implemented`)
          implementedFeatures++
        } else {
          this.warnings.push(`⚠️ ${feature.name} missing`)
        }
      })

      if (implementedFeatures >= 5) {
        this.successes.push('✅ Comprehensive Intent Satisfaction Tracking implemented')
      } else if (implementedFeatures >= 3) {
        this.warnings.push('⚠️ Partial Intent Satisfaction Tracking - needs enhancement')
      } else {
        this.issues.push('❌ Intent Satisfaction Tracking incomplete - critical for 2025 algorithm')
      }
    } else {
      this.issues.push('❌ Intent Satisfaction Tracker component missing - CRITICAL for September 2025 algorithm')
    }

    if (fs.existsSync(apiEndpointFile)) {
      this.successes.push('✅ Intent metrics API endpoint exists')
    } else {
      this.warnings.push('⚠️ Intent metrics API endpoint missing')
    }

    // Check implementation in key pages
    const keyPages = [
      'app/layout.tsx',
      'app/page.tsx',
      'app/ai-tools/[slug]/page.tsx'
    ]

    let pagesWithTracking = 0
    keyPages.forEach(page => {
      const pagePath = path.join(this.projectRoot, page)
      if (fs.existsSync(pagePath)) {
        const content = fs.readFileSync(pagePath, 'utf8')
        if (content.includes('IntentSatisfactionTracker')) {
          pagesWithTracking++
        }
      }
    })

    if (pagesWithTracking === keyPages.length) {
      this.successes.push('✅ Intent tracking implemented on all key pages')
    } else if (pagesWithTracking > 0) {
      this.warnings.push(`⚠️ Intent tracking only on ${pagesWithTracking}/${keyPages.length} key pages`)
    } else {
      this.issues.push('❌ Intent tracking not implemented on any key pages')
    }
  }

  async checkAIOptimization() {
    console.log('🤖 Checking AI Optimization (2025)...')
    
    // Check for AI crawler blocking
    const robotsFile = path.join(this.projectRoot, 'app/robots.ts')
    if (fs.existsSync(robotsFile)) {
      const content = fs.readFileSync(robotsFile, 'utf8')
      if (content.includes('GPTBot') || content.includes('ChatGPT-User') || content.includes('anthropic-ai') || content.includes('CCBot')) {
        this.successes.push('✅ AI crawler blocking implemented')
      } else {
        this.warnings.push('⚠️ AI crawler blocking not found (optional but recommended)')
      }
    } else {
      this.warnings.push('⚠️ robots.ts file missing')
    }

    // Check for enhanced AI optimization components
    const aiOptimizerFile = path.join(this.projectRoot, 'components/AIContentOptimizer.tsx')
    const semanticStructureFile = path.join(this.projectRoot, 'components/SemanticStructure.tsx')
    const enhancedStructuredDataFile = path.join(this.projectRoot, 'components/EnhancedStructuredData.tsx')
    
    if (fs.existsSync(aiOptimizerFile)) {
      this.successes.push('✅ AI Content Optimizer implemented')
    }
    
    if (fs.existsSync(semanticStructureFile)) {
      this.successes.push('✅ Enhanced semantic structure components implemented')
    }
    
    if (fs.existsSync(enhancedStructuredDataFile)) {
      this.successes.push('✅ Enhanced structured data implementation found')
    }

    // Check for semantic HTML structure in components
    const componentFiles = this.getReactFiles().filter(file => file.includes('components/'))
    let semanticElementsFound = 0
    let ariaAttributesFound = 0
    let itemPropFound = 0
    const semanticElements = ['article', 'section', 'header', 'footer', 'nav', 'aside', 'main']

    componentFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8')
        semanticElements.forEach(element => {
          if (content.includes(`<${element}`) || content.includes(`<${element} `)) {
            semanticElementsFound++
          }
        })
        
        // Check for ARIA attributes
        if (content.includes('aria-label') || content.includes('role=')) {
          ariaAttributesFound++
        }
        
        // Check for structured data attributes
        if (content.includes('itemProp') || content.includes('itemScope')) {
          itemPropFound++
        }
      }
    })

    if (semanticElementsFound >= 15 && ariaAttributesFound >= 5 && itemPropFound >= 3) {
      this.successes.push('✅ Excellent semantic HTML structure for AI understanding')
    } else if (semanticElementsFound >= 10) {
      this.successes.push('✅ Good semantic HTML structure implemented')
    } else {
      this.issues.push('❌ Limited semantic HTML structure - poor for AI understanding')
    }

    // Check for Core Web Vitals optimization
    const coreWebVitalsFile = path.join(this.projectRoot, 'components/CoreWebVitalsOptimizer.tsx')
    const webVitalsApiFile = path.join(this.projectRoot, 'app/api/web-vitals/route.ts')
    
    if (fs.existsSync(coreWebVitalsFile) && fs.existsSync(webVitalsApiFile)) {
      this.successes.push('✅ Enhanced Core Web Vitals optimization implemented')
    } else if (fs.existsSync(coreWebVitalsFile)) {
      this.successes.push('✅ Core Web Vitals optimizer found')
    }

    // Check for structured data implementation
    const schemaFiles = this.getReactFiles().filter(file => 
      file.includes('schema') || file.includes('structured-data') || file.includes('Schema')
    )

    if (schemaFiles.length >= 2) {
      this.successes.push('✅ Comprehensive structured data implementation found')
    } else if (schemaFiles.length > 0) {
      this.successes.push('✅ Structured data implementation found')
    } else {
      this.issues.push('❌ Structured data implementation incomplete')
    }
  }

  async check2025Compliance() {
    console.log('🚀 Checking 2025 Algorithm Compliance...')
    
    // Check for 2025 compliance components
    const complianceComponents = [
      'components/Enhanced2025SEO.tsx',
      'components/CoreWebVitalsOptimizer.tsx',
      'components/AIContentOptimizer.tsx',
      'components/IntentSatisfactionTracker.tsx',
      'components/SEO2025ComplianceChecker.tsx'
    ]
    
    let complianceScore = 0
    const totalChecks = 5
    
    // 1. Intent Satisfaction (September 2025 Algorithm)
    if (fs.existsSync(path.join(this.projectRoot, 'components/IntentSatisfactionTracker.tsx'))) {
      this.successes.push('✅ September 2025 "Perspective" Update (Intent Satisfaction): COMPLIANT')
      complianceScore++
    } else {
      this.issues.push('❌ September 2025 "Perspective" Update (Intent Satisfaction): NOT COMPLIANT')
    }
    
    // 2. Enhanced E-A-T Requirements
    const layoutFile = path.join(this.projectRoot, 'app/layout.tsx')
    if (fs.existsSync(layoutFile)) {
      const content = fs.readFileSync(layoutFile, 'utf8')
      if (content.includes('author') && content.includes('publisher') && content.includes('creator')) {
        this.successes.push('✅ Enhanced E-A-T Requirements: COMPLIANT')
        complianceScore++
      } else {
        this.issues.push('❌ Enhanced E-A-T Requirements: NOT COMPLIANT')
      }
    }
    
    // 3. AI Content Understanding
    if (fs.existsSync(path.join(this.projectRoot, 'components/AIContentOptimizer.tsx')) &&
        fs.existsSync(path.join(this.projectRoot, 'components/SemanticStructure.tsx'))) {
      this.successes.push('✅ AI Content Understanding: COMPLIANT')
      complianceScore++
    } else {
      this.issues.push('❌ AI Content Understanding: NOT COMPLIANT')
    }
    
    // 4. Structured Data Implementation
    if (fs.existsSync(path.join(this.projectRoot, 'components/EnhancedStructuredData.tsx')) &&
        fs.existsSync(path.join(this.projectRoot, 'lib/schema-generator.ts'))) {
      this.successes.push('✅ Structured Data Implementation: COMPLIANT')
      complianceScore++
    } else {
      this.issues.push('❌ Structured Data Implementation: NOT COMPLIANT')
    }
    
    // 5. Core Web Vitals & Performance
    if (fs.existsSync(path.join(this.projectRoot, 'components/CoreWebVitalsOptimizer.tsx')) &&
        fs.existsSync(path.join(this.projectRoot, 'app/api/web-vitals/route.ts'))) {
      this.successes.push('✅ Core Web Vitals & Performance: COMPLIANT')
      complianceScore++
    } else {
      this.issues.push('❌ Core Web Vitals & Performance: NOT COMPLIANT')
    }
    
    const compliancePercentage = Math.round((complianceScore / totalChecks) * 100)
    console.log(`\n📊 2025 Algorithm Compliance: ${compliancePercentage}% (${complianceScore}/${totalChecks} requirements met)`)
    
    // Additional 2025 features check
    const enhanced2025File = path.join(this.projectRoot, 'components/Enhanced2025SEO.tsx')
    if (fs.existsSync(enhanced2025File)) {
      const content = fs.readFileSync(enhanced2025File, 'utf8')
      
      const compliance2025 = [
        { pattern: /web.vitals|webVitals/, name: 'Web Vitals tracking' },
        { pattern: /engagement|interaction/, name: 'User engagement tracking' },
        { pattern: /semantic|schema|structured/i, name: 'Semantic search optimization' },
        { pattern: /expertise|author|expert/i, name: 'Expertise signals' },
        { pattern: /trust|authority|credibility/i, name: 'Trustworthiness signals' }
      ]

      compliance2025.forEach(check => {
        if (check.pattern.test(content)) {
          this.successes.push(`✅ 2025 ${check.name} implemented`)
        }
      })
    }
  }

  getReactFiles() {
    const files = []
    const searchDirs = ['app', 'components', 'lib']
    
    searchDirs.forEach(dir => {
      const fullDir = path.join(this.projectRoot, dir)
      if (fs.existsSync(fullDir)) {
        const dirFiles = this.getAllFiles(fullDir, ['.tsx', '.ts', '.js', '.jsx'])
        files.push(...dirFiles)
      }
    })
    
    return files
  }

  getAllFiles(dir, extensions) {
    const files = []
    const items = fs.readdirSync(dir)
    
    items.forEach(item => {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        files.push(...this.getAllFiles(fullPath, extensions))
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath)
      }
    })
    
    return files
  }

  findFiles(pattern) {
    const files = this.getReactFiles()
    return files.filter(file => 
      file.toLowerCase().includes(pattern.toLowerCase()) ||
      fs.readFileSync(file, 'utf8').toLowerCase().includes(pattern.toLowerCase())
    )
  }

  generateReport() {
    console.log('\n' + '='.repeat(80))
    console.log('📊 SEO AUDIT REPORT 2025 - COMPREHENSIVE ANALYSIS')
    console.log('='.repeat(80))

    console.log('\n🎉 SUCCESSES:')
    this.successes.forEach(success => console.log(`  ${success}`))

    console.log('\n⚠️  WARNINGS:')
    this.warnings.forEach(warning => console.log(`  ${warning}`))

    console.log('\n❌ CRITICAL ISSUES:')
    this.issues.forEach(issue => console.log(`  ${issue}`))

    console.log('\n📈 SUMMARY:')
    console.log(`  ✅ Successes: ${this.successes.length}`)
    console.log(`  ⚠️  Warnings: ${this.warnings.length}`)
    console.log(`  ❌ Issues: ${this.issues.length}`)

    const score = Math.round(
      (this.successes.length / (this.successes.length + this.warnings.length + this.issues.length)) * 100
    )
    
    console.log(`\n🏆 OVERALL SEO SCORE: ${score}%`)
    
    if (score >= 90) {
      console.log('🌟 EXCELLENT! Your site is fully optimized for 2025 algorithms.')
    } else if (score >= 75) {
      console.log('👍 GOOD! Address warnings to improve further.')
    } else if (score >= 60) {
      console.log('⚠️  FAIR. Address critical issues and warnings.')
    } else {
      console.log('🚨 POOR. Immediate action required for SEO compliance.')
    }

    // 2025 Algorithm Compliance Analysis
    console.log('\n🚀 2025 ALGORITHM COMPLIANCE ANALYSIS:')
    console.log('-'.repeat(60))

    const intentSatisfactionCompliant = this.successes.some(s => s.includes('Intent Satisfaction Tracking implemented'))
    const aiOptimizationCompliant = this.successes.some(s => s.includes('semantic HTML structure'))
    const eatCompliant = this.successes.some(s => s.includes('E-A-T signals'))
    const structuredDataCompliant = this.successes.some(s => s.includes('Structured data'))
    const performanceCompliant = this.successes.some(s => s.includes('Performance'))

    const algorithmCompliance = {
      'September 2025 "Perspective" Update (Intent Satisfaction)': intentSatisfactionCompliant,
      'Enhanced E-A-T Requirements': eatCompliant,
      'AI Content Understanding': aiOptimizationCompliant,
      'Structured Data Implementation': structuredDataCompliant,
      'Core Web Vitals & Performance': performanceCompliant
    }

    Object.entries(algorithmCompliance).forEach(([update, compliant]) => {
      console.log(`${compliant ? '✅' : '❌'} ${update}: ${compliant ? 'COMPLIANT' : 'NEEDS WORK'}`)
    })

    const complianceScore = Object.values(algorithmCompliance).filter(Boolean).length
    const totalChecks = Object.keys(algorithmCompliance).length
    const compliancePercentage = Math.round((complianceScore / totalChecks) * 100)

    console.log(`\n📊 2025 Algorithm Compliance: ${compliancePercentage}% (${complianceScore}/${totalChecks} requirements met)`)

    // Priority Recommendations
    console.log('\n📋 PRIORITY RECOMMENDATIONS FOR 2025:')
    console.log('-'.repeat(60))

    if (!intentSatisfactionCompliant) {
      console.log('🎯 CRITICAL: Implement Intent Satisfaction Tracking for September 2025 "Perspective" algorithm')
    }
    if (!aiOptimizationCompliant) {
      console.log('🤖 HIGH: Improve AI optimization with semantic HTML and structured content')
    }
    if (!eatCompliant) {
      console.log('👤 HIGH: Strengthen E-A-T signals with author information and expertise indicators')
    }
    if (!structuredDataCompliant) {
      console.log('📊 MEDIUM: Enhance structured data implementation for better search understanding')
    }
    if (!performanceCompliant) {
      console.log('⚡ MEDIUM: Optimize Core Web Vitals for better user experience and rankings')
    }

    if (this.issues.length > 0) {
      console.log('\n🚨 IMMEDIATE ACTION REQUIRED:')
      console.log('-'.repeat(60))
      this.issues.slice(0, 5).forEach(issue => console.log(`  • ${issue.replace('❌ ', '')}`))
    }

    console.log('\n💡 NEXT STEPS:')
    console.log('-'.repeat(60))
    console.log('1. Address critical issues first (highest impact on rankings)')
    console.log('2. Implement Intent Satisfaction Tracking if missing')
    console.log('3. Monitor Core Web Vitals and user engagement metrics')
    console.log('4. Regularly audit for 2025 algorithm compliance')
    console.log('5. Keep structured data updated and comprehensive')

    console.log('\n' + '='.repeat(80))
  }
}

// Run the audit
const audit = new SEOAudit2025()
audit.runAudit().catch(console.error)