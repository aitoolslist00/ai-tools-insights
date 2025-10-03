#!/usr/bin/env node

/**
 * Enhanced AI SEO Editor System Demo
 * 
 * This script demonstrates the complete workflow of the Enhanced AI SEO Editor:
 * 1. Generate AI-powered content with SEO optimization
 * 2. Generate comprehensive schema markup
 * 3. Perform SEO analysis and optimization
 * 4. Smart publishing with automated features
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Demo configuration
const DEMO_CONFIG = {
  baseUrl: 'http://localhost:3001',
  testKeyword: 'AI content generation tools',
  testTitle: 'Best AI Content Generation Tools for 2024',
  testCategory: 'AI Tools',
  testAuthor: 'AI SEO Expert'
};

// Utility functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const makeRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${DEMO_CONFIG.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`❌ Request failed for ${endpoint}:`, error.message);
    return null;
  }
};

const printSection = (title, emoji = '🔥') => {
  console.log(`\n${emoji} ${'='.repeat(60)}`);
  console.log(`${emoji} ${title.toUpperCase()}`);
  console.log(`${emoji} ${'='.repeat(60)}\n`);
};

const printStep = (step, description) => {
  console.log(`📋 Step ${step}: ${description}`);
  console.log('⏳ Processing...\n');
};

// Demo functions
const demoContentGeneration = async () => {
  printStep(1, 'AI Content Generation with SEO Optimization');
  
  const payload = {
    keyword: DEMO_CONFIG.testKeyword,
    title: DEMO_CONFIG.testTitle,
    category: DEMO_CONFIG.testCategory,
    author: DEMO_CONFIG.testAuthor,
    contentType: 'comprehensive-guide',
    seoLevel: 'advanced',
    includeSchema: true,
    generateFAQ: true,
    includeImages: true
  };
  
  console.log('🎯 Generating content with parameters:');
  console.log(`   • Keyword: "${payload.keyword}"`);
  console.log(`   • Title: "${payload.title}"`);
  console.log(`   • Content Type: ${payload.contentType}`);
  console.log(`   • SEO Level: ${payload.seoLevel}`);
  console.log('');
  
  const result = await makeRequest('/api/blog/enhanced-seo-generator', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  
  if (result && result.success) {
    console.log('✅ Content generation completed successfully!');
    console.log(`📝 Generated ${result.data.content.length} characters of content`);
    console.log(`🎯 SEO Score: ${result.data.seoAnalysis.score}/100`);
    console.log(`🔍 Keywords optimized: ${result.data.seoAnalysis.keywordDensity}%`);
    console.log(`📊 Readability: ${result.data.seoAnalysis.readabilityScore}`);
    
    if (result.data.faq && result.data.faq.length > 0) {
      console.log(`❓ FAQ sections: ${result.data.faq.length}`);
    }
    
    return result.data;
  } else {
    console.log('❌ Content generation failed');
    return null;
  }
};

const demoSchemaGeneration = async (contentData) => {
  printStep(2, 'Comprehensive Schema Markup Generation');
  
  const payload = {
    title: contentData.title,
    content: contentData.content,
    author: contentData.author,
    category: contentData.category,
    faq: contentData.faq || [],
    publishDate: new Date().toISOString(),
    modifiedDate: new Date().toISOString(),
    includeAll: true
  };
  
  console.log('🏗️ Generating schema markup:');
  console.log('   • Article Schema');
  console.log('   • FAQ Schema');
  console.log('   • Breadcrumb Schema');
  console.log('   • Organization Schema');
  console.log('   • WebPage Schema');
  console.log('');
  
  const result = await makeRequest('/api/schema-generator', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  
  if (result && result.success) {
    console.log('✅ Schema generation completed successfully!');
    console.log(`🏗️ Generated ${Object.keys(result.schemas).length} schema types`);
    
    Object.keys(result.schemas).forEach(schemaType => {
      console.log(`   • ${schemaType}: ✅`);
    });
    
    console.log(`📏 Total schema size: ${JSON.stringify(result.schemas).length} characters`);
    
    return result.schemas;
  } else {
    console.log('❌ Schema generation failed');
    return null;
  }
};

const demoSEOAnalysis = async (contentData) => {
  printStep(3, 'Advanced SEO Analysis & Optimization');
  
  const payload = {
    title: contentData.title,
    content: contentData.content,
    keyword: DEMO_CONFIG.testKeyword,
    meta_description: contentData.metaDescription || '',
    category: contentData.category
  };
  
  console.log('🎯 Performing SEO analysis:');
  console.log('   • Keyword optimization');
  console.log('   • Content structure analysis');
  console.log('   • Readability assessment');
  console.log('   • Technical SEO checks');
  console.log('');
  
  const result = await makeRequest('/api/seo-optimizer', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  
  if (result && result.success) {
    console.log('✅ SEO analysis completed successfully!');
    console.log(`📊 Overall SEO Score: ${result.analysis.score}/100`);
    console.log(`🔍 Issues found: ${result.analysis.issues.length}`);
    console.log(`💡 Opportunities: ${result.analysis.opportunities.length}`);
    console.log(`⚡ Performance score: ${result.analysis.performance}/100`);
    
    if (result.analysis.issues.length > 0) {
      console.log('\n🚨 Key Issues:');
      result.analysis.issues.slice(0, 3).forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue.type}: ${issue.message}`);
      });
    }
    
    if (result.analysis.opportunities.length > 0) {
      console.log('\n💡 Top Opportunities:');
      result.analysis.opportunities.slice(0, 3).forEach((opp, index) => {
        console.log(`   ${index + 1}. ${opp.type}: ${opp.message}`);
      });
    }
    
    return result.analysis;
  } else {
    console.log('❌ SEO analysis failed');
    return null;
  }
};

const demoSmartPublishing = async (contentData, schemas, seoAnalysis) => {
  printStep(4, 'Smart Publishing with Automation');
  
  const payload = {
    title: contentData.title,
    content: contentData.content,
    author: contentData.author,
    category: contentData.category,
    tags: contentData.tags || ['AI', 'Content Generation', 'SEO'],
    metaDescription: contentData.metaDescription,
    schemas: schemas,
    seoAnalysis: seoAnalysis,
    publishOptions: {
      createBackup: true,
      revalidatePage: true,
      submitToSearchEngines: true,
      generateSitemap: true,
      optimizeImages: true
    }
  };
  
  console.log('📤 Smart publishing features:');
  console.log('   • Automatic backup creation');
  console.log('   • Page revalidation');
  console.log('   • Search engine submission');
  console.log('   • Sitemap generation');
  console.log('   • Image optimization');
  console.log('');
  
  const result = await makeRequest('/api/blog/smart-publish', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  
  if (result && result.success) {
    console.log('✅ Smart publishing completed successfully!');
    console.log(`📄 Post ID: ${result.data.postId}`);
    console.log(`🔗 URL: ${result.data.url}`);
    console.log(`💾 Backup created: ${result.data.backupPath}`);
    console.log(`🔄 Page revalidated: ${result.data.revalidated ? 'Yes' : 'No'}`);
    console.log(`🌐 Search engines notified: ${result.data.searchEnginesNotified ? 'Yes' : 'No'}`);
    
    return result.data;
  } else {
    console.log('❌ Smart publishing failed');
    return null;
  }
};

// Main demo function
const runDemo = async () => {
  printSection('Enhanced AI SEO Editor System Demo', '🚀');
  
  console.log('Welcome to the Enhanced AI SEO Editor System Demo!');
  console.log('This demo will showcase the complete automated workflow:\n');
  console.log('1. 🤖 AI Content Generation with SEO Optimization');
  console.log('2. 🏗️ Comprehensive Schema Markup Generation');
  console.log('3. 🎯 Advanced SEO Analysis & Optimization');
  console.log('4. 📤 Smart Publishing with Automation\n');
  
  console.log('⚠️  Make sure your development server is running on http://localhost:3001\n');
  
  // Wait for user confirmation
  await new Promise(resolve => {
    rl.question('Press Enter to start the demo...', () => resolve());
  });
  
  try {
    // Step 1: Content Generation
    const contentData = await demoContentGeneration();
    if (!contentData) {
      console.log('❌ Demo failed at content generation step');
      return;
    }
    
    await delay(2000);
    
    // Step 2: Schema Generation
    const schemas = await demoSchemaGeneration(contentData);
    if (!schemas) {
      console.log('❌ Demo failed at schema generation step');
      return;
    }
    
    await delay(2000);
    
    // Step 3: SEO Analysis
    const seoAnalysis = await demoSEOAnalysis(contentData);
    if (!seoAnalysis) {
      console.log('❌ Demo failed at SEO analysis step');
      return;
    }
    
    await delay(2000);
    
    // Step 4: Smart Publishing
    const publishResult = await demoSmartPublishing(contentData, schemas, seoAnalysis);
    if (!publishResult) {
      console.log('❌ Demo failed at smart publishing step');
      return;
    }
    
    // Demo completion
    printSection('Demo Completed Successfully!', '🎉');
    
    console.log('🎊 Congratulations! The Enhanced AI SEO Editor System demo completed successfully!');
    console.log('\n📊 Demo Summary:');
    console.log(`   • Content generated: ✅ (${contentData.content.length} chars)`);
    console.log(`   • Schema markup: ✅ (${Object.keys(schemas).length} types)`);
    console.log(`   • SEO analysis: ✅ (${seoAnalysis.score}/100 score)`);
    console.log(`   • Smart publishing: ✅ (${publishResult.postId})`);
    
    console.log('\n🌟 Key Features Demonstrated:');
    console.log('   • Multi-model AI content generation with fallback');
    console.log('   • Comprehensive schema markup (Article, FAQ, Breadcrumb, etc.)');
    console.log('   • Advanced SEO analysis with actionable insights');
    console.log('   • Automated publishing with backup and search engine submission');
    console.log('   • Real-time progress tracking and error handling');
    
    console.log('\n🚀 Next Steps:');
    console.log('   • Visit http://localhost:3001/blog/dashboard to use the UI');
    console.log('   • Try different keywords and content types');
    console.log('   • Explore the generated blog posts and schemas');
    console.log('   • Check the backup files and system logs');
    
  } catch (error) {
    console.error('\n❌ Demo failed with error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   • Make sure the development server is running');
    console.log('   • Check your .env.local file for API keys');
    console.log('   • Verify all dependencies are installed');
    console.log('   • Check the console for detailed error messages');
  }
  
  rl.close();
};

// Interactive menu
const showMenu = async () => {
  console.log('\n🎯 Enhanced AI SEO Editor System');
  console.log('================================');
  console.log('1. Run Full Demo');
  console.log('2. Test Individual Components');
  console.log('3. View System Status');
  console.log('4. Exit');
  console.log('');
  
  rl.question('Select an option (1-4): ', async (choice) => {
    switch (choice) {
      case '1':
        await runDemo();
        break;
      case '2':
        console.log('🔧 Individual component testing not implemented yet');
        showMenu();
        break;
      case '3':
        console.log('📊 System status checking not implemented yet');
        showMenu();
        break;
      case '4':
        console.log('👋 Goodbye!');
        rl.close();
        break;
      default:
        console.log('❌ Invalid option. Please try again.');
        showMenu();
    }
  });
};

// Start the demo
if (require.main === module) {
  console.log('🚀 Enhanced AI SEO Editor System Demo');
  console.log('=====================================\n');
  
  // Check if we should run the full demo directly
  if (process.argv.includes('--full-demo')) {
    runDemo();
  } else {
    showMenu();
  }
}

module.exports = {
  runDemo,
  demoContentGeneration,
  demoSchemaGeneration,
  demoSEOAnalysis,
  demoSmartPublishing
};