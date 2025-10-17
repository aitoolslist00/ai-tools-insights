import { marked } from 'marked';
import { BlogPost } from './blog-data';

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Custom renderer for images
const renderer = new marked.Renderer();
renderer.image = function(token: any) {
  const { href, title, text } = token;
  return `<img src="${href}" alt="${text}" title="${title || ''}" class="w-full h-auto rounded-lg shadow-lg my-6" loading="lazy" />`;
};

marked.use({ renderer });

export function formatContent(content: string, post?: BlogPost): string {
  if (!content) return '';
  
  // Convert markdown to HTML
  let html = marked(content) as string;
  
  // If post has images, inject them into the content
  if (post && post.images && post.images.length > 0) {
    html = injectImagesIntoContent(html, post);
  }
  
  return html;
}

// Separate function for TOC extraction that doesn't need images
export function formatContentForTOC(content: string): string {
  if (!content) return '';
  return marked(content) as string;
}

function injectImagesIntoContent(html: string, post: BlogPost): string {
  if (!post.images || post.images.length === 0) return html;
  
  // Filter out placeholder images
  const validImages = post.images.filter(img => 
    img.url && !img.url.includes('placeholder')
  );
  
  if (validImages.length === 0) return html;
  
  // Split content into sections (by h2 headers)
  const sections = html.split(/(<h2[^>]*>.*?<\/h2>)/gi);
  
  let imageIndex = 0;
  let result = '';
  
  for (let i = 0; i < sections.length; i++) {
    result += sections[i];
    
    // After every h2 section (except the last one), try to insert an image
    if (i > 0 && i % 2 === 1 && imageIndex < validImages.length) {
      const image = validImages[imageIndex];
      const imageHtml = `
        <div class="my-8 text-center">
          <img 
            src="${image.url}" 
            alt="${image.alt}" 
            class="w-full max-w-4xl mx-auto h-auto rounded-xl shadow-lg"
            loading="lazy"
            width="${image.width}"
            height="${image.height}"
            onerror="this.parentElement.style.display='none'"
          />
          ${image.alt ? `<p class="text-sm text-gray-600 mt-2 italic">${image.alt}</p>` : ''}
        </div>
      `;
      result += imageHtml;
      imageIndex++;
    }
  }
  
  // If there are remaining images, add them at the end
  while (imageIndex < validImages.length) {
    const image = validImages[imageIndex];
    const imageHtml = `
      <div class="my-8 text-center">
        <img 
          src="${image.url}" 
          alt="${image.alt}" 
          class="w-full max-w-4xl mx-auto h-auto rounded-xl shadow-lg"
          loading="lazy"
          width="${image.width}"
          height="${image.height}"
          onerror="this.parentElement.style.display='none'"
        />
        ${image.alt ? `<p class="text-sm text-gray-600 mt-2 italic">${image.alt}</p>` : ''}
      </div>
    `;
    result += imageHtml;
    imageIndex++;
  }
  
  return result;
}

// Enhanced content formatting with better typography
export function enhanceContentFormatting(html: string): string {
  return html
    // Add better spacing for paragraphs
    .replace(/<p>/g, '<p class="mb-6 text-gray-800 leading-relaxed">')
    // Style headings
    .replace(/<h1>/g, '<h1 class="text-4xl font-bold text-gray-900 mb-8 mt-12">')
    .replace(/<h2>/g, '<h2 class="text-3xl font-semibold text-gray-900 mb-6 mt-10">')
    .replace(/<h3>/g, '<h3 class="text-2xl font-semibold text-gray-900 mb-4 mt-8">')
    .replace(/<h4>/g, '<h4 class="text-xl font-semibold text-gray-900 mb-3 mt-6">')
    // Style lists
    .replace(/<ul>/g, '<ul class="list-disc list-inside mb-6 space-y-2 text-gray-800">')
    .replace(/<ol>/g, '<ol class="list-decimal list-inside mb-6 space-y-2 text-gray-800">')
    .replace(/<li>/g, '<li class="ml-4">')
    // Style blockquotes
    .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 italic text-gray-700">')
    // Style code blocks
    .replace(/<pre><code>/g, '<pre class="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto my-6"><code>')
    .replace(/<code>/g, '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">')
    // Style links
    .replace(/<a /g, '<a class="text-blue-600 hover:text-blue-800 underline" ');
}