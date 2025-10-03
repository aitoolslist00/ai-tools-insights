// Debug script to test content formatting
import { marked } from 'marked';

// Sample post data (similar to the actual post)
const samplePost = {
  content: `# AI Tools 2025 Trends

## Introduction
This is the introduction section about AI tools.

## Machine Learning Revolution
Machine learning is transforming industries.

## Future Predictions
Here are some predictions for the future.

## Conclusion
This concludes our analysis.`,
  images: [
    {
      url: '/generated-images/ai-tools-2025-trends-1759413525494.jpg',
      alt: 'AI Tools 2025 Trends Featured Image',
      width: 1024,
      height: 576
    },
    {
      url: '/generated-images/artificial-intelligence-1759413537446.jpg',
      alt: 'Artificial Intelligence Concept',
      width: 1024,
      height: 576
    },
    {
      url: '/generated-images/nocode-ai-1759413549537.jpg',
      alt: 'No-Code AI Solutions',
      width: 1024,
      height: 576
    }
  ]
};

// Simulate the formatContent function
function formatContent(content, post) {
  if (!content || !post.images || post.images.length === 0) {
    return marked(content || '');
  }

  // Convert markdown to HTML
  let html = marked(content);
  
  // Find H2 headers and inject images after them
  const h2Regex = /<h2[^>]*>.*?<\/h2>/g;
  const h2Matches = html.match(h2Regex);
  
  if (!h2Matches || h2Matches.length === 0) {
    return html;
  }

  let result = html;
  let imageIndex = 0;
  
  // Process each H2 header
  h2Matches.forEach((h2Match) => {
    if (imageIndex >= post.images.length) return;
    
    const image = post.images[imageIndex];
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
    
    result = result.replace(h2Match, h2Match + imageHtml);
    imageIndex++;
  });
  
  return result;
}

// Test the function
console.log('=== TESTING CONTENT FORMATTING ===');
console.log('Original content:');
console.log(samplePost.content);
console.log('\n=== FORMATTED RESULT ===');
const formatted = formatContent(samplePost.content, samplePost);
console.log(formatted);
console.log('\n=== CHECKING FOR IMAGES ===');
console.log('Contains image tags:', formatted.includes('<img'));
console.log('Number of img tags:', (formatted.match(/<img/g) || []).length);