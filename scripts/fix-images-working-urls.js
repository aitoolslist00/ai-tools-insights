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

// Working image URLs with proper optimization
const getWorkingImages = (slug) => {
  // Using Picsum for reliable placeholder images + some working Unsplash URLs
  const baseImages = [
    {
      id: 'ai-technology-1',
      url: 'https://picsum.photos/1200/800?random=1',
      fallback: 'https://via.placeholder.com/1200x800/4F46E5/FFFFFF?text=AI+Technology',
      alt: 'Artificial Intelligence and Technology Concept',
      keywords: ['AI', 'artificial intelligence', 'technology', 'innovation']
    },
    {
      id: 'digital-workspace-2',
      url: 'https://picsum.photos/1200/800?random=2',
      fallback: 'https://via.placeholder.com/1200x800/7C3AED/FFFFFF?text=Digital+Workspace',
      alt: 'Modern Digital Workspace and Tools',
      keywords: ['digital', 'workspace', 'tools', 'productivity']
    },
    {
      id: 'data-analytics-3',
      url: 'https://picsum.photos/1200/800?random=3',
      fallback: 'https://via.placeholder.com/1200x800/059669/FFFFFF?text=Data+Analytics',
      alt: 'Data Analytics and Visualization',
      keywords: ['data', 'analytics', 'visualization', 'insights']
    },
    {
      id: 'machine-learning-4',
      url: 'https://picsum.photos/1200/800?random=4',
      fallback: 'https://via.placeholder.com/1200x800/DC2626/FFFFFF?text=Machine+Learning',
      alt: 'Machine Learning and AI Development',
      keywords: ['machine learning', 'development', 'coding', 'AI']
    },
    {
      id: 'automation-tools-5',
      url: 'https://picsum.photos/1200/800?random=5',
      fallback: 'https://via.placeholder.com/1200x800/EA580C/FFFFFF?text=Automation+Tools',
      alt: 'Automation Tools and Processes',
      keywords: ['automation', 'tools', 'processes', 'efficiency']
    },
    {
      id: 'future-tech-6',
      url: 'https://picsum.photos/1200/800?random=6',
      fallback: 'https://via.placeholder.com/1200x800/0891B2/FFFFFF?text=Future+Technology',
      alt: 'Future Technology and Innovation',
      keywords: ['future', 'technology', 'innovation', 'trends']
    }
  ];

  return baseImages.map((img, index) => ({
    url: img.url,
    fallback: img.fallback,
    alt: `${img.alt} - ${slug.replace(/-/g, ' ')} comprehensive guide`,
    caption: `${img.alt} demonstrating key concepts in ${slug.replace(/-/g, ' ')} and modern AI applications`,
    width: 1200,
    height: 800,
    loading: index === 0 ? 'eager' : 'lazy',
    keywords: [...img.keywords, ...slug.split('-')],
    id: `${slug}-${img.id}-${index + 1}`,
    srcset: `${img.url} 1200w, ${img.url.replace('1200/800', '800/533')} 800w, ${img.url.replace('1200/800', '600/400')} 600w`,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px'
  }));
};

function fixImagesWithWorkingUrls() {
  console.log('🔧 Fixing Images with Working URLs - SEO Optimized\n');
  console.log('=' .repeat(60));
  
  // Read the blog posts JSON file
  const blogPostsPath = 'f:\\my work\\programming\\vercel\\ai-tools-list\\blog-posts.json';
  const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));
  
  let updatedCount = 0;
  
  blogPosts.forEach((post, index) => {
    if (articlesToProcess.includes(post.slug)) {
      console.log(`\n📝 Processing: ${post.slug}`);
      console.log(`   Title: ${post.title}`);
      
      // Generate working images for this article
      const workingImages = getWorkingImages(post.slug);
      
      // Update the images property
      post.images = workingImages;
      
      // Remove existing images from content first
      let content = post.content;
      content = content.replace(/<figure[^>]*>[\s\S]*?<\/figure>/gs, '');
      content = content.replace(/<div class="my-8">\s*<img[^>]*>[\s\S]*?<\/div>/gs, '');
      
      // Split content into logical sections for image placement
      const sections = content.split(/(?=<h[2-6][^>]*>)/);
      let newContent = sections[0] || ''; // Keep intro
      
      // Calculate optimal image placement
      const totalSections = sections.length;
      const imagesToPlace = Math.min(workingImages.length, totalSections - 1);
      const sectionInterval = Math.max(1, Math.floor((totalSections - 1) / imagesToPlace));
      
      let imageIndex = 0;
      
      for (let i = 1; i < sections.length; i++) {
        // Add section content
        newContent += sections[i];
        
        // Insert image at strategic intervals
        if (imageIndex < workingImages.length && 
            (i % sectionInterval === 0 || i === Math.floor(totalSections / 2))) {
          
          const image = workingImages[imageIndex];
          
          // Create SEO-optimized image HTML with fallback and structured data
          const imageHtml = `

<figure class="my-8 text-center" itemscope itemtype="https://schema.org/ImageObject">
  <picture>
    <source srcset="${image.srcset}" sizes="${image.sizes}" type="image/jpeg">
    <img 
      src="${image.url}" 
      alt="${image.alt}" 
      title="${image.alt}"
      class="w-full max-w-4xl mx-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-100" 
      width="${image.width}"
      height="${image.height}"
      loading="${image.loading}"
      decoding="async"
      itemprop="contentUrl"
      data-keywords="${image.keywords.join(', ')}"
      onerror="this.onerror=null; this.src='${image.fallback}'; this.classList.add('fallback-image');"
    />
  </picture>
  <figcaption class="text-sm text-gray-600 mt-3 px-4 italic leading-relaxed max-w-3xl mx-auto" itemprop="caption">
    ${image.caption}
  </figcaption>
  <meta itemprop="width" content="${image.width}">
  <meta itemprop="height" content="${image.height}">
  <meta itemprop="encodingFormat" content="image/jpeg">
</figure>

`;
          newContent += imageHtml;
          imageIndex++;
        }
      }
      
      // Add any remaining images at the end if needed
      while (imageIndex < workingImages.length) {
        const image = workingImages[imageIndex];
        const imageHtml = `

<figure class="my-8 text-center" itemscope itemtype="https://schema.org/ImageObject">
  <picture>
    <source srcset="${image.srcset}" sizes="${image.sizes}" type="image/jpeg">
    <img 
      src="${image.url}" 
      alt="${image.alt}" 
      title="${image.alt}"
      class="w-full max-w-4xl mx-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-100" 
      width="${image.width}"
      height="${image.height}"
      loading="lazy"
      decoding="async"
      itemprop="contentUrl"
      data-keywords="${image.keywords.join(', ')}"
      onerror="this.onerror=null; this.src='${image.fallback}'; this.classList.add('fallback-image');"
    />
  </picture>
  <figcaption class="text-sm text-gray-600 mt-3 px-4 italic leading-relaxed max-w-3xl mx-auto" itemprop="caption">
    ${image.caption}
  </figcaption>
  <meta itemprop="width" content="${image.width}">
  <meta itemprop="height" content="${image.height}">
  <meta itemprop="encodingFormat" content="image/jpeg">
</figure>

`;
        newContent += imageHtml;
        imageIndex++;
      }
      
      post.content = newContent;
      
      // Update schema.org structured data for images
      if (post.schemas && post.schemas.article) {
        post.schemas.article.image = workingImages.map(img => ({
          "@type": "ImageObject",
          "url": img.url,
          "width": img.width,
          "height": img.height,
          "caption": img.caption,
          "contentUrl": img.url
        }));
      }
      
      console.log(`   ✅ Added ${workingImages.length} working, SEO-optimized images`);
      console.log(`   📊 Image specs: ${workingImages[0].width}x${workingImages[0].height} with responsive srcset`);
      console.log(`   🛡️ Fallback: Placeholder images for reliability`);
      console.log(`   🚀 Performance: Lazy loading, picture element, error handling`);
      
      updatedCount++;
    }
  });
  
  // Write the updated blog posts back to the file
  fs.writeFileSync(blogPostsPath, JSON.stringify(blogPosts, null, 2));
  
  console.log('\n' + '=' .repeat(60));
  console.log(`🎉 Successfully fixed images for ${updatedCount} articles!`);
  console.log('\n📋 SEO & Performance Optimizations Applied:');
  console.log('   ✅ Working image URLs (Picsum + fallbacks)');
  console.log('   ✅ Responsive images with srcset');
  console.log('   ✅ Optimized dimensions (1200x800)');
  console.log('   ✅ Lazy loading for performance');
  console.log('   ✅ Error handling with fallback images');
  console.log('   ✅ Proper alt tags and titles');
  console.log('   ✅ Schema.org structured data');
  console.log('   ✅ Picture element for better support');
  console.log('   ✅ SEO-friendly captions');
  console.log('   ✅ Keyword metadata');
  
  console.log('\n🌐 Test the articles with working images:');
  articlesToProcess.forEach(slug => {
    console.log(`   📄 ${slug}: http://localhost:3001/blog/${slug}`);
  });
  
  console.log('\n💡 Image Sources:');
  console.log('   🖼️  Primary: Picsum Photos (reliable placeholder service)');
  console.log('   🛡️  Fallback: Placeholder.com (guaranteed availability)');
  console.log('   📱 Responsive: Multiple sizes for different devices');
}

// Run the script
if (require.main === module) {
  fixImagesWithWorkingUrls();
}

module.exports = { fixImagesWithWorkingUrls };