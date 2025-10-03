import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Custom renderer for images
const renderer = new marked.Renderer();
renderer.image = function(token) {
  const { href, title, text } = token;
  return `<img src="${href}" alt="${text}" title="${title || ''}" class="w-full h-auto rounded-lg shadow-lg my-6" loading="lazy" />`;
};

marked.use({ renderer });

function formatContent(content, post) {
  if (!content) return '';
  
  // Convert markdown to HTML
  let html = marked(content);
  
  // If post has images, inject them into the content
  if (post && post.images && post.images.length > 0) {
    html = injectImagesIntoContent(html, post);
  }
  
  return html;
}

function injectImagesIntoContent(html, post) {
  if (!post.images || post.images.length === 0) return html;
  
  console.log(`Injecting ${post.images.length} images into content...`);
  
  // Split content into sections (by h2 headers)
  const sections = html.split(/(<h2[^>]*>.*?<\/h2>)/gi);
  console.log(`Content split into ${sections.length} sections`);
  
  let imageIndex = 0;
  let result = '';
  
  for (let i = 0; i < sections.length; i++) {
    result += sections[i];
    
    // After every h2 section (except the last one), try to insert an image
    if (i > 0 && i % 2 === 1 && imageIndex < post.images.length) {
      const image = post.images[imageIndex];
      console.log(`Injecting image ${imageIndex + 1}: ${image.filename} after section ${i}`);
      
      const imageHtml = `
        <div class="my-8 text-center">
          <img 
            src="${image.url}" 
            alt="${image.alt}" 
            class="w-full max-w-4xl mx-auto h-auto rounded-xl shadow-lg"
            loading="lazy"
            width="${image.width}"
            height="${image.height}"
          />
          ${image.alt ? `<p class="text-sm text-gray-600 mt-2 italic">${image.alt}</p>` : ''}
        </div>
      `;
      result += imageHtml;
      imageIndex++;
    }
  }
  
  // If there are remaining images, add them at the end
  while (imageIndex < post.images.length) {
    const image = post.images[imageIndex];
    console.log(`Adding remaining image ${imageIndex + 1}: ${image.filename} at the end`);
    
    const imageHtml = `
      <div class="my-8 text-center">
        <img 
          src="${image.url}" 
          alt="${image.alt}" 
          class="w-full max-w-4xl mx-auto h-auto rounded-xl shadow-lg"
          loading="lazy"
          width="${image.width}"
          height="${image.height}"
        />
        ${image.alt ? `<p class="text-sm text-gray-600 mt-2 italic">${image.alt}</p>` : ''}
      </div>
    `;
    result += imageHtml;
    imageIndex++;
  }
  
  return result;
}

// Read the blog posts data
const blogPostsPath = path.join(process.cwd(), 'blog-posts.json');
const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));

// Find the multimodal AI assistants post
const multimodalPost = blogPosts.find(post => post.slug === 'multimodal-ai-assistants');

if (multimodalPost) {
  console.log('Testing content formatting for multimodal AI assistants post...\n');
  
  // Format the content
  const formattedContent = formatContent(multimodalPost.content, multimodalPost);
  
  // Count how many images were actually injected
  const imageCount = (formattedContent.match(/<img[^>]*src="\/generated-images\//g) || []).length;
  console.log(`\nTotal images found in formatted content: ${imageCount}`);
  
  // Show first few image injections
  const imageMatches = formattedContent.match(/<div class="my-8 text-center">[\s\S]*?<\/div>/g);
  if (imageMatches) {
    console.log(`\nFound ${imageMatches.length} image containers`);
    console.log('\nFirst image container:');
    console.log(imageMatches[0]);
  }
  
  // Save formatted content to file for inspection
  fs.writeFileSync('formatted-content.html', formattedContent);
  console.log('\nFormatted content saved to formatted-content.html');
} else {
  console.log('Multimodal AI assistants post not found!');
}