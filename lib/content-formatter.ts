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
renderer.heading = function(this: any, token: any) {
  const rawText = token.text || '';
  const inlineHtml = token.tokens && this.parser?.parseInline
    ? this.parser.parseInline(token.tokens)
    : rawText;
  const plainText = rawText.replace(/<[^>]+>/g, '').replace(/[*_`~]/g, '');
  const level = token.depth;
  const id = generateSlug(plainText);

  return `<h${level} id="${id}" class="scroll-mt-24">${inlineHtml}</h${level}>`;
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

export function formatExcerpt(excerpt: string): string {
  if (!excerpt) return '';
  let preprocessed = excerpt;
  preprocessed = preprocessed.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
  preprocessed = preprocessed.replace(/\*\*([^*]+?)\*\*(['s]?)/g, '<strong>$1</strong>$2');
  preprocessed = preprocessed.replace(/(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  preprocessed = preprocessed.replace(/(?<!_)_([^_]+?)_(?!_)/g, '<em>$1</em>');
  preprocessed = preprocessed.replace(/`([^`]+?)`/g, '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">$1</code>');
  return marked.parseInline(preprocessed) as string;
}

function injectImagesIntoContent(html: string, post: BlogPost): string {
  if (!post.images || post.images.length === 0) return html;
  
  // Filter out placeholder images
  const validImages = post.images.filter(img => 
    img.url && !img.url.includes('placeholder')
  );
  
  if (validImages.length === 0) return html;
  
  // CRITICAL FIX: Always inject the featured image at the very beginning
  // This ensures images appear regardless of content structure
  let result = '';
  let imageIndex = 0;
  
  if (validImages.length > 0) {
    const featuredImage = validImages[0];
    const featuredImageHtml = `<div class="my-8 text-center featured-image-container" style="background: #f0f0f0; padding: 20px; border: 2px solid #007bff; margin: 20px 0;">
        <p style="color: #007bff; font-weight: bold; margin-bottom: 10px;">Featured Image:</p>
        <img 
          src="${featuredImage.url}" 
          alt="${featuredImage.alt || post.title}" 
          class="w-full max-w-4xl mx-auto h-auto rounded-xl shadow-lg"
          loading="eager"
          width="${featuredImage.width || 1200}"
          height="${featuredImage.height || 675}"
          style="display: block !important; margin: 0 auto; max-width: 100%; height: auto; border: 3px solid #28a745;"
          onerror="console.error('Image failed to load:', this.src); this.style.border='3px solid red'; this.alt='IMAGE FAILED TO LOAD: ' + this.src;"
        />
        ${featuredImage.alt ? `<p class="text-sm text-gray-600 mt-2 italic">${featuredImage.alt}</p>` : ''}
        <p style="color: #666; font-size: 12px; margin-top: 10px;">Image URL: ${featuredImage.url}</p>
      </div>`;
    result += featuredImageHtml;
    imageIndex++;
  }
  
  // Split content into sections (by h2 headers or paragraphs)
  const sections = html.split(/(<h2[^>]*>.*?<\/h2>|<p[^>]*>.*?<\/p>)/gi);
  
  let sectionCount = 0;
  for (let i = 0; i < sections.length; i++) {
    result += sections[i];
    
    // After every 3rd section (h2 or paragraph), try to insert an image
    if (sections[i].match(/<(h2|p)[^>]*>/i)) {
      sectionCount++;
      if (sectionCount % 3 === 0 && imageIndex < validImages.length) {
        const image = validImages[imageIndex];
        const imageHtml = `
          <div class="my-8 text-center" style="background: #fff3cd; padding: 20px; border: 2px solid #ffc107; margin: 20px 0;">
            <p style="color: #856404; font-weight: bold; margin-bottom: 10px;">Content Image #${imageIndex}:</p>
            <img 
              src="${image.url}" 
              alt="${image.alt}" 
              class="w-full max-w-4xl mx-auto h-auto rounded-xl shadow-lg"
              loading="lazy"
              width="${image.width || 1200}"
              height="${image.height || 675}"
              style="display: block !important; margin: 0 auto; max-width: 100%; height: auto; border: 3px solid #ffc107;"
              onerror="console.error('Image failed to load:', this.src); this.style.border='3px solid red'; this.alt='IMAGE FAILED TO LOAD: ' + this.src;"
            />
            ${image.alt ? `<p class="text-sm text-gray-600 mt-2 italic">${image.alt}</p>` : ''}
            <p style="color: #856404; font-size: 12px; margin-top: 10px;">Image URL: ${image.url}</p>
          </div>
        `;
        result += imageHtml;
        imageIndex++;
      }
    }
  }
  
  // Add remaining images throughout the content
  while (imageIndex < validImages.length) {
    const image = validImages[imageIndex];
    const imageHtml = `<div class="my-8 text-center additional-image-container" style="background: #d1ecf1; padding: 20px; border: 2px solid #17a2b8; margin: 20px 0;">
        <p style="color: #0c5460; font-weight: bold; margin-bottom: 10px;">Additional Image #${imageIndex}:</p>
        <img 
          src="${image.url}" 
          alt="${image.alt || post.title}" 
          class="w-full max-w-4xl mx-auto h-auto rounded-xl shadow-lg"
          loading="lazy"
          width="${image.width || 1200}"
          height="${image.height || 675}"
          style="display: block !important; margin: 0 auto; max-width: 100%; height: auto; border: 3px solid #17a2b8;"
          onerror="console.error('Image failed to load:', this.src); this.style.border='3px solid red'; this.alt='IMAGE FAILED TO LOAD: ' + this.src;"
        />
        ${image.alt ? `<p class="text-sm text-gray-600 mt-2 italic">${image.alt}</p>` : ''}
        <p style="color: #0c5460; font-size: 12px; margin-top: 10px;">Image URL: ${image.url}</p>
      </div>`;
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