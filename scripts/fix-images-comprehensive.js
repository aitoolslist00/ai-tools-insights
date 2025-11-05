const fs = require('fs');
const path = require('path');

// Articles that need proper images
const articlesToProcess = [
  'free-ai-tools-list',
  'ai-study-tools', 
  'zerogpt',
  'uncensored-ai-tools',
  'turbo-ai-definitive-guide-2025'
];

// High-quality, working image URLs with proper optimization parameters
const getOptimizedImages = (slug) => {
  const baseImages = [
    {
      id: 'artificial-intelligence-brain',
      url: 'https://images.unsplash.com/photo-1677442136019-1595019b9f73',
      alt: 'Artificial Intelligence Brain Network Visualization',
      keywords: ['AI', 'artificial intelligence', 'neural network', 'technology']
    },
    {
      id: 'digital-technology-interface',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23',
      alt: 'Modern Digital Technology Interface',
      keywords: ['digital', 'technology', 'interface', 'modern']
    },
    {
      id: 'ai-robot-automation',
      url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
      alt: 'AI Robot and Automation Technology',
      keywords: ['robot', 'automation', 'AI', 'technology']
    },
    {
      id: 'data-analytics-visualization',
      url: 'https://images.unsplash.com/photo-1551288049-bec5c4c4b5b3',
      alt: 'Data Analytics and Visualization Dashboard',
      keywords: ['data', 'analytics', 'visualization', 'dashboard']
    },
    {
      id: 'machine-learning-code',
      url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c',
      alt: 'Machine Learning Code and Programming',
      keywords: ['machine learning', 'code', 'programming', 'development']
    },
    {
      id: 'ai-tools-workspace',
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      alt: 'AI Tools Digital Workspace',
      keywords: ['workspace', 'tools', 'digital', 'productivity']
    }
  ];

  // Create optimized URLs with proper parameters for SEO and performance
  return baseImages.map((img, index) => {
    const optimizedUrl = `${img.url}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=85&fm=webp`;
    
    return {
      url: optimizedUrl,
      alt: `${img.alt} - ${slug.replace(/-/g, ' ')} guide`,
      caption: `${img.alt} showcasing ${slug.replace(/-/g, ' ')} concepts and applications`,
      width: 1200,
      height: 800,
      format: 'webp',
      quality: 85,
      loading: index === 0 ? 'eager' : 'lazy', // First image loads immediately, others lazy load
      keywords: [...img.keywords, ...slug.split('-')],
      id: `${slug}-${img.id}-${index + 1}`
    };
  });
};

function fixImagesComprehensive() {
  console.log('🔧 Comprehensive Image Fix - Optimized for SEO & Performance\n');
  console.log('=' .repeat(60));
  
  // Read the blog posts JSON file
  const blogPostsPath = 'f:\\my work\\programming\\vercel\\ai-tools-list\\blog-posts.json';
  const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));
  
  let updatedCount = 0;
  
  blogPosts.forEach((post, index) => {
    if (articlesToProcess.includes(post.slug)) {
      console.log(`\n📝 Processing: ${post.slug}`);
      console.log(`   Title: ${post.title}`);
      
      // Generate optimized images for this article
      const optimizedImages = getOptimizedImages(post.slug);
      
      // Update the images property with optimized data
      post.images = optimizedImages;
      
      // Remove existing images from content first
      let content = post.content;
      content = content.replace(/<div class="my-8">\s*<img[^>]*>\s*<p class="text-sm[^>]*>.*?<\/p>\s*<\/div>/gs, '');
      
      // Split content into logical sections for image placement
      const sections = content.split(/(?=<h[2-6][^>]*>)/);
      let newContent = sections[0] || ''; // Keep intro
      
      // Calculate optimal image placement
      const totalSections = sections.length;
      const imagesToPlace = Math.min(optimizedImages.length, totalSections - 1);
      const sectionInterval = Math.max(1, Math.floor((totalSections - 1) / imagesToPlace));
      
      let imageIndex = 0;
      
      for (let i = 1; i < sections.length; i++) {
        // Add section content
        newContent += sections[i];
        
        // Insert image at strategic intervals
        if (imageIndex < optimizedImages.length && 
            (i % sectionInterval === 0 || i === Math.floor(totalSections / 2))) {
          
          const image = optimizedImages[imageIndex];
          
          // Create SEO-optimized image HTML with structured data
          const imageHtml = `

<figure class="my-8 text-center" itemscope itemtype="https://schema.org/ImageObject">
  <img 
    src="${image.url}" 
    alt="${image.alt}" 
    title="${image.alt}"
    class="w-full max-w-4xl mx-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300" 
    width="${image.width}"
    height="${image.height}"
    loading="${image.loading}"
    decoding="async"
    itemprop="contentUrl"
    data-keywords="${image.keywords.join(', ')}"
  />
  <figcaption class="text-sm text-gray-600 mt-3 px-4 italic leading-relaxed" itemprop="caption">
    ${image.caption}
  </figcaption>
  <meta itemprop="width" content="${image.width}">
  <meta itemprop="height" content="${image.height}">
  <meta itemprop="encodingFormat" content="image/${image.format}">
</figure>

`;
          newContent += imageHtml;
          imageIndex++;
        }
      }
      
      // Add any remaining images at the end if needed
      while (imageIndex < optimizedImages.length) {
        const image = optimizedImages[imageIndex];
        const imageHtml = `

<figure class="my-8 text-center" itemscope itemtype="https://schema.org/ImageObject">
  <img 
    src="${image.url}" 
    alt="${image.alt}" 
    title="${image.alt}"
    class="w-full max-w-4xl mx-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300" 
    width="${image.width}"
    height="${image.height}"
    loading="lazy"
    decoding="async"
    itemprop="contentUrl"
    data-keywords="${image.keywords.join(', ')}"
  />
  <figcaption class="text-sm text-gray-600 mt-3 px-4 italic leading-relaxed" itemprop="caption">
    ${image.caption}
  </figcaption>
  <meta itemprop="width" content="${image.width}">
  <meta itemprop="height" content="${image.height}">
  <meta itemprop="encodingFormat" content="image/${image.format}">
</figure>

`;
        newContent += imageHtml;
        imageIndex++;
      }
      
      post.content = newContent;
      
      // Update schema.org structured data for images
      if (post.schemas && post.schemas.article) {
        post.schemas.article.image = optimizedImages.map(img => ({
          "@type": "ImageObject",
          "url": img.url,
          "width": img.width,
          "height": img.height,
          "caption": img.caption,
          "contentUrl": img.url
        }));
      }
      
      console.log(`   ✅ Added ${optimizedImages.length} SEO-optimized images`);
      console.log(`   📊 Image specs: ${optimizedImages[0].width}x${optimizedImages[0].height}, WebP, Q85`);
      console.log(`   🚀 Performance: Lazy loading, proper alt tags, structured data`);
      
      updatedCount++;
    }
  });
  
  // Write the updated blog posts back to the file
  fs.writeFileSync(blogPostsPath, JSON.stringify(blogPosts, null, 2));
  
  console.log('\n' + '=' .repeat(60));
  console.log(`🎉 Successfully optimized images for ${updatedCount} articles!`);
  console.log('\n📋 SEO & Performance Optimizations Applied:');
  console.log('   ✅ WebP format for better compression');
  console.log('   ✅ Optimized dimensions (1200x800)');
  console.log('   ✅ Quality 85 for best size/quality balance');
  console.log('   ✅ Lazy loading for performance');
  console.log('   ✅ Proper alt tags and titles');
  console.log('   ✅ Schema.org structured data');
  console.log('   ✅ Responsive design classes');
  console.log('   ✅ SEO-friendly captions');
  console.log('   ✅ Keyword metadata');
  
  console.log('\n🌐 Test the optimized articles at:');
  articlesToProcess.forEach(slug => {
    console.log(`   📄 ${slug}: http://localhost:3001/blog/${slug}`);
  });
  
  console.log('\n💡 Next Steps:');
  console.log('   1. Test image loading in browser');
  console.log('   2. Verify SEO structured data');
  console.log('   3. Check mobile responsiveness');
  console.log('   4. Monitor Core Web Vitals');
}

// Run the script
if (require.main === module) {
  fixImagesComprehensive();
}

module.exports = { fixImagesComprehensive };