# AI Image Generation System Guide

This guide explains how to use the AI-powered image generation system integrated into your blog application.

## Overview

The image generation system uses Google's Gemini AI to create contextually relevant images for your blog posts. It includes:

- **Real Image Generation**: AI-powered image creation based on keywords and content
- **Content Optimization**: Automatic integration of images into blog content
- **Multiple Formats**: WebP optimization, thumbnails, and responsive variants
- **SEO Optimization**: Proper alt text, structured data, and accessibility features

## Features

### 🎨 AI-Powered Image Creation
- Uses Gemini AI to analyze content and generate relevant images
- Multiple image styles: realistic, artistic, minimalist, corporate, tech
- Various aspect ratios: 16:9, 4:3, 1:1, 9:16
- Customizable dimensions and quality settings

### 📝 Content Integration
- Automatically places images at optimal positions in content
- AI-driven placement recommendations
- Maintains content flow and readability
- Generates proper HTML with responsive image tags

### 🚀 Performance Optimization
- WebP format conversion for better performance
- Thumbnail generation for faster loading
- Lazy loading implementation
- Multiple size variants for responsive design

### 🔍 SEO Features
- AI-generated alt text for accessibility
- Structured data markup
- Social media variants (Facebook, Twitter, LinkedIn, Pinterest)
- SEO-friendly filenames

## Quick Start

### 1. Environment Setup

Add your Gemini API key to `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Using the API Endpoint

Generate images for a blog post:

```javascript
const response = await fetch('/api/generate-images', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    postId: 'your-post-id',
    useRealGeneration: true,
    optimizeContent: true,
    keywords: ['AI', 'technology', 'innovation'] // optional
  }),
});

const data = await response.json();
console.log('Generated images:', data.images);
console.log('Optimized content:', data.optimizedContent);
```

### 3. Using the React Component

Add the ImageGenerator component to your blog editor:

```jsx
import ImageGenerator from '@/components/ImageGenerator';

function BlogEditor({ postId, postTitle, keywords }) {
  const handleImagesGenerated = (images, updatedPost) => {
    console.log('New images:', images);
    // Update your post state
  };

  return (
    <div>
      {/* Your existing editor */}
      
      <ImageGenerator
        postId={postId}
        postTitle={postTitle}
        keywords={keywords}
        onImagesGenerated={handleImagesGenerated}
      />
    </div>
  );
}
```

## API Reference

### POST /api/generate-images

Generate images for a blog post.

**Request Body:**
```json
{
  "postId": "string",
  "regenerate": "boolean (optional, default: false)",
  "useRealGeneration": "boolean (optional, default: true)",
  "optimizeContent": "boolean (optional, default: true)",
  "keywords": "string[] (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Generated 3 images successfully and optimized content",
  "images": [
    {
      "filename": "ai-technology-1234567890.png",
      "path": "/path/to/image.png",
      "url": "/generated-images/ai-technology-1234567890.png",
      "alt": "AI technology illustration",
      "width": 1200,
      "height": 675,
      "webpUrl": "/generated-images/ai-technology-1234567890.webp",
      "thumbnailUrl": "/generated-images/ai-technology-1234567890-thumb.jpg",
      "metadata": {
        "keyword": "AI technology",
        "style": "tech",
        "generatedAt": "2024-01-01T00:00:00.000Z",
        "optimized": true
      }
    }
  ],
  "optimizedContent": "# Your Article\n\n<div class=\"image-container\">...</div>\n\nYour content...",
  "contentOptimized": true
}
```

### GET /api/generate-images?postId=string

Retrieve existing images for a blog post.

**Response:**
```json
{
  "success": true,
  "images": [...],
  "hasImages": true
}
```

## Advanced Usage

### Custom Image Generation

Use the RealImageGenerator class directly:

```javascript
import RealImageGenerator from '@/lib/real-image-generator';

const generator = new RealImageGenerator();

// Generate a single image
const image = await generator.generateImage({
  keyword: 'machine learning',
  style: 'tech',
  aspectRatio: '16:9',
  width: 1200,
  height: 675
});

// Generate multiple images for an article
const images = await generator.generateArticleImages(
  'Article Title',
  ['keyword1', 'keyword2'],
  'Article content...'
);
```

### Content Optimization

Use the ContentImageOptimizer class:

```javascript
import ContentImageOptimizer from '@/lib/content-image-optimizer';

const optimizer = new ContentImageOptimizer();

const optimizedContent = await optimizer.optimizeContentWithImages(
  originalContent,
  generatedImages,
  articleTitle
);
```

## Configuration Options

### Image Styles
- `realistic`: Natural, photographic style
- `artistic`: Creative, artistic interpretation
- `minimalist`: Clean, simple design
- `corporate`: Professional, business-oriented
- `tech`: Technology-focused, modern

### Aspect Ratios
- `16:9`: Widescreen (default for hero images)
- `4:3`: Standard landscape
- `1:1`: Square (good for social media)
- `9:16`: Portrait/mobile

### Quality Settings
- `high`: Maximum quality, larger file size
- `medium`: Balanced quality and size (default)
- `low`: Smaller file size, lower quality

## File Structure

```
lib/
├── real-image-generator.ts      # Core image generation logic
├── content-image-optimizer.ts   # Content integration logic
└── image-generator.ts           # Legacy placeholder generator

components/
└── ImageGenerator.tsx           # React component

app/api/generate-images/
└── route.ts                     # API endpoint

public/generated-images/         # Generated image files
├── *.png                        # Original images
├── *.webp                       # WebP variants
└── *-thumb.jpg                  # Thumbnails
```

## Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY environment variable is required"**
   - Add your Gemini API key to `.env.local`
   - Restart your development server

2. **Images not generating**
   - Check API key permissions
   - Verify network connectivity
   - Check server logs for detailed errors

3. **Images not displaying**
   - Ensure `public/generated-images/` directory exists
   - Check file permissions
   - Verify image URLs are correct

4. **Content optimization failing**
   - Check if content is valid markdown
   - Ensure images were generated successfully
   - Review console logs for optimization errors

### Testing

Run the test script to verify everything works:

```bash
node scripts/test-image-generation.js
```

## Performance Considerations

### Image Optimization
- Images are automatically converted to WebP format
- Thumbnails are generated for faster loading
- Lazy loading is implemented by default

### Caching
- Generated images are stored in the public directory
- Consider implementing CDN integration for production
- Add cache headers for better performance

### Rate Limiting
- Gemini API has rate limits
- Implement request queuing for bulk operations
- Consider caching AI responses

## Future Enhancements

### Planned Features
- Integration with DALL-E, Midjourney, or Stable Diffusion
- Batch image generation for multiple posts
- Advanced image editing and filtering
- Custom image templates and styles
- Integration with external image CDNs

### API Integrations
- **DALL-E 3**: For photorealistic image generation
- **Midjourney**: For artistic and creative images
- **Stable Diffusion**: For open-source image generation
- **Unsplash/Pexels**: For stock photo integration

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the console logs for detailed error messages
3. Test with the provided test script
4. Verify your environment configuration

## License

This image generation system is part of your blog application and follows the same license terms.