const fs = require('fs');
const path = require('path');

// Articles that need images injected into content
const articlesToProcess = [
  'free-ai-tools-list',
  'ai-study-tools', 
  'zerogpt',
  'uncensored-ai-tools',
  'turbo-ai-definitive-guide-2025'
];

function injectImagesToContent() {
  console.log('🖼️ Injecting images into article content...\n');
  
  // Read the blog posts JSON file
  const blogPostsPath = 'f:\\my work\\programming\\vercel\\ai-tools-list\\blog-posts.json';
  const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));
  
  let updatedCount = 0;
  
  blogPosts.forEach((post, index) => {
    if (articlesToProcess.includes(post.slug) && post.images && post.images.length > 0) {
      console.log(`📝 Processing: ${post.slug}`);
      
      // Split content into sections (by headings)
      const content = post.content;
      const sections = content.split(/(?=<h[2-6][^>]*>)/);
      
      // If we have multiple sections, inject images between them
      if (sections.length > 1 && post.images.length > 0) {
        let newContent = sections[0]; // Keep the intro section as is
        
        // Inject images between sections
        for (let i = 1; i < sections.length && i - 1 < post.images.length; i++) {
          const image = post.images[i - 1];
          const imageHtml = `
<div class="my-8">
  <img src="${image.url}" alt="${image.alt}" class="w-full rounded-lg shadow-lg" />
  <p class="text-sm text-gray-600 mt-2 text-center italic">${image.caption}</p>
</div>

`;
          newContent += imageHtml + sections[i];
        }
        
        // If we have more images than sections, add remaining images at the end
        if (post.images.length > sections.length - 1) {
          for (let i = sections.length - 1; i < post.images.length; i++) {
            const image = post.images[i];
            const imageHtml = `
<div class="my-8">
  <img src="${image.url}" alt="${image.alt}" class="w-full rounded-lg shadow-lg" />
  <p class="text-sm text-gray-600 mt-2 text-center italic">${image.caption}</p>
</div>
`;
            newContent += imageHtml;
          }
        }
        
        post.content = newContent;
        console.log(`   ✅ Injected ${Math.min(post.images.length, sections.length - 1)} images into content`);
        updatedCount++;
      } else {
        // If no clear sections, just add images at strategic points
        const paragraphs = content.split('</p>');
        if (paragraphs.length > 3 && post.images.length > 0) {
          let newContent = '';
          const imageInterval = Math.floor(paragraphs.length / post.images.length);
          
          for (let i = 0; i < paragraphs.length; i++) {
            newContent += paragraphs[i];
            if (i < paragraphs.length - 1) newContent += '</p>';
            
            // Insert image after every few paragraphs
            const imageIndex = Math.floor(i / imageInterval);
            if (i > 0 && i % imageInterval === 0 && imageIndex < post.images.length) {
              const image = post.images[imageIndex];
              const imageHtml = `

<div class="my-8">
  <img src="${image.url}" alt="${image.alt}" class="w-full rounded-lg shadow-lg" />
  <p class="text-sm text-gray-600 mt-2 text-center italic">${image.caption}</p>
</div>

`;
              newContent += imageHtml;
            }
          }
          
          post.content = newContent;
          console.log(`   ✅ Injected ${post.images.length} images into content`);
          updatedCount++;
        }
      }
    }
  });
  
  // Write the updated blog posts back to the file
  fs.writeFileSync(blogPostsPath, JSON.stringify(blogPosts, null, 2));
  
  console.log(`\n🎉 Successfully injected images into ${updatedCount} articles!`);
  console.log('📝 Updated blog-posts.json file');
  console.log('\n🌐 Test the articles at:');
  articlesToProcess.forEach(slug => {
    console.log(`   http://localhost:3001/blog/${slug}`);
  });
}

// Run the script
if (require.main === module) {
  injectImagesToContent();
}

module.exports = { injectImagesToContent };