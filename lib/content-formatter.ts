import { marked } from 'marked';
import { BlogPost } from './blog-data';

// Helper function to generate slug from text
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Custom renderer for images and headings with IDs
const renderer = new marked.Renderer();

renderer.image = function(token: any) {
  const { href, title, text } = token;
  return `<img src="${href}" alt="${text}" title="${title || ''}" class="w-full h-auto rounded-lg shadow-lg my-6" loading="lazy" />`;
};

// Custom heading renderer to add IDs and scroll-margin
renderer.heading = function(token: any) {
  const text = token.text;
  const level = token.depth;
  const id = generateSlug(text);
  
  return `<h${level} id="${id}" class="scroll-mt-24">${text}</h${level}>`;
};

marked.use({ renderer });

export function formatContent(content: string, post?: BlogPost): string {
  if (!content) return '';
  
  // CRITICAL FIX: Convert markdown bold/italic syntax FIRST, before marked() processes HTML
  // This handles cases where content has HTML tags with markdown syntax inside them
  // Example: <p>This is **bold** text</p> -> <p>This is <strong>bold</strong> text</p>
  let preprocessed = content;
  
  // Convert **text** to <strong>text</strong> (bold)
  // Use a non-greedy match to handle multiple instances on same line
  preprocessed = preprocessed.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
  
  // Fallback for edge cases with punctuation (e.g., **word**'s)
  preprocessed = preprocessed.replace(/\*\*([^*]*?)\*\*(['s]?)/g, '<strong>$1</strong>$2');
  
  // Convert *text* or _text_ to <em>text</em> (italic) 
  // Avoid matching ** which should be bold
  preprocessed = preprocessed.replace(/(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  preprocessed = preprocessed.replace(/(?<!_)_([^_]+?)_(?!_)/g, '<em>$1</em>');
  
  // Convert markdown to HTML
  let html = marked(preprocessed) as string;
  
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
  let result = html;
  
  // SAFETY NET: Convert any remaining markdown bold (**text**) that might have slipped through
  // This is a backup layer after the preprocessing in formatContent()
  // Use global flag to catch ALL instances
  if (result.includes('**')) {
    // Primary conversion: **text** -> <strong>text</strong>
    result = result.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
    // Fallback for edge cases with punctuation/apostrophes
    result = result.replace(/\*\*([^*]+?)\*\*(['s]?)/g, '<strong>$1</strong>$2');
  }
  
  // Convert remaining markdown italic (*text* or _text_) to HTML em tags
  // Use lookbehind/lookahead to avoid matching ** (which is bold)
  if (result.match(/(?<!\*)\*(?!\*)/)) {
    result = result.replace(/(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  }
  if (result.includes('_')) {
    result = result.replace(/(?<!_)_([^_]+?)_(?!_)/g, '<em>$1</em>');
  }
  
  // Add better spacing for paragraphs
  result = result.replace(/<p>/g, '<p class="mb-6 text-gray-800 leading-relaxed">');
  
  // Style headings while preserving id and other attributes
  result = result.replace(/<h1([^>]*)>/g, '<h1$1 class="text-4xl font-bold text-gray-900 mb-8 mt-12">');
  result = result.replace(/<h2([^>]*)>/g, '<h2$1 class="text-3xl font-semibold text-gray-900 mb-6 mt-10">');
  result = result.replace(/<h3([^>]*)>/g, '<h3$1 class="text-2xl font-semibold text-gray-900 mb-4 mt-8">');
  result = result.replace(/<h4([^>]*)>/g, '<h4$1 class="text-xl font-semibold text-gray-900 mb-3 mt-6">');
  
  // CRITICAL: Add inline styling to ALL strong/bold tags for guaranteed rendering
  // This ensures bold text displays properly regardless of CSS load order
  // Replace both <strong> and <strong ...> (with existing attributes)
  result = result.replace(/<strong>/g, '<strong style="font-weight: 700; color: inherit;">');
  result = result.replace(/<strong\s+([^>]*)>/g, '<strong style="font-weight: 700; color: inherit;" $1>');
  result = result.replace(/<b>/g, '<b style="font-weight: 700; color: inherit;">');
  result = result.replace(/<b\s+([^>]*)>/g, '<b style="font-weight: 700; color: inherit;" $1>');
  
  // Style lists
  result = result.replace(/<ul>/g, '<ul class="list-disc list-inside mb-6 space-y-2 text-gray-800">');
  result = result.replace(/<ol>/g, '<ol class="list-decimal list-inside mb-6 space-y-2 text-gray-800">');
  result = result.replace(/<li>/g, '<li class="ml-4">');
  
  // Style blockquotes
  result = result.replace(/<blockquote>/g, '<blockquote class="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 italic text-gray-700">');
  
  // Style code blocks
  result = result.replace(/<pre><code>/g, '<pre class="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto my-6"><code>');
  result = result.replace(/<code>/g, '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">');
  
  // Style links
  result = result.replace(/<a /g, '<a class="text-blue-600 hover:text-blue-800 underline" ');
  
  return result;
}