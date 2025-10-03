import { GoogleGenerativeAI } from '@google/generative-ai';

interface GeneratedImage {
  filename: string;
  path: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  optimized: boolean;
}

interface ImagePlacement {
  position: number;
  imageIndex: number;
  context: string;
  reason: string;
}

export class ContentImageOptimizer {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Automatically integrate images into blog post content
   */
  async optimizeContentWithImages(
    content: string,
    images: GeneratedImage[],
    title: string
  ): Promise<string> {
    try {
      if (images.length === 0) return content;

      // Analyze content structure
      const contentSections = this.analyzeContentStructure(content);
      
      // Get AI recommendations for image placement
      const placements = await this.getImagePlacements(content, images, title);
      
      // Insert images into content
      const optimizedContent = this.insertImagesIntoContent(content, images, placements);
      
      return optimizedContent;
    } catch (error) {
      console.error('Error optimizing content with images:', error);
      return content; // Return original content if optimization fails
    }
  }

  /**
   * Analyze content structure to identify sections
   */
  private analyzeContentStructure(content: string): Array<{
    type: 'heading' | 'paragraph' | 'list' | 'code';
    level?: number;
    text: string;
    position: number;
  }> {
    const lines = content.split('\n');
    const sections: Array<{
      type: 'heading' | 'paragraph' | 'list' | 'code';
      level?: number;
      text: string;
      position: number;
    }> = [];

    let position = 0;
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('#')) {
        const level = (trimmed.match(/^#+/) || [''])[0].length;
        sections.push({
          type: 'heading',
          level,
          text: trimmed,
          position
        });
      } else if (trimmed.startsWith('*') || trimmed.startsWith('-') || trimmed.startsWith('1.')) {
        sections.push({
          type: 'list',
          text: trimmed,
          position
        });
      } else if (trimmed.startsWith('```')) {
        sections.push({
          type: 'code',
          text: trimmed,
          position
        });
      } else if (trimmed.length > 0) {
        sections.push({
          type: 'paragraph',
          text: trimmed,
          position
        });
      }
      
      position += line.length + 1; // +1 for newline
    }

    return sections;
  }

  /**
   * Get AI recommendations for optimal image placement
   */
  private async getImagePlacements(
    content: string,
    images: GeneratedImage[],
    title: string
  ): Promise<ImagePlacement[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
        Analyze this blog post content and recommend optimal placement for ${images.length} images.
        
        Title: "${title}"
        
        Content:
        ${content.substring(0, 2000)}${content.length > 2000 ? '...' : ''}
        
        Available images:
        ${images.map((img, i) => `${i + 1}. ${img.alt}`).join('\n')}
        
        Please recommend where to place each image for maximum engagement and readability.
        Consider:
        - Breaking up long text sections
        - Placing images near relevant content
        - Maintaining good visual flow
        - SEO best practices
        
        Respond with a JSON array of placements in this format:
        [
          {
            "imageIndex": 0,
            "afterSection": "section heading or first few words",
            "reason": "why this placement works"
          }
        ]
        
        Return only the JSON array, no additional text.
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      try {
        const placements = JSON.parse(text);
        return this.convertToImagePlacements(placements, content);
      } catch (parseError) {
        console.error('Error parsing AI placement response:', parseError);
        return this.getDefaultPlacements(content, images);
      }
      
    } catch (error) {
      console.error('Error getting AI image placements:', error);
      return this.getDefaultPlacements(content, images);
    }
  }

  /**
   * Convert AI recommendations to image placements
   */
  private convertToImagePlacements(
    aiPlacements: any[],
    content: string
  ): ImagePlacement[] {
    const placements: ImagePlacement[] = [];
    const lines = content.split('\n');
    
    for (const placement of aiPlacements) {
      if (typeof placement.imageIndex === 'number' && placement.afterSection) {
        // Find the position after the specified section
        const sectionIndex = lines.findIndex(line => 
          line.toLowerCase().includes(placement.afterSection.toLowerCase())
        );
        
        if (sectionIndex !== -1) {
          // Calculate character position
          const position = lines.slice(0, sectionIndex + 1).join('\n').length + 1;
          
          placements.push({
            position,
            imageIndex: placement.imageIndex,
            context: placement.afterSection,
            reason: placement.reason || 'AI recommended placement'
          });
        }
      }
    }
    
    return placements;
  }

  /**
   * Get default image placements if AI fails
   */
  private getDefaultPlacements(content: string, images: GeneratedImage[]): ImagePlacement[] {
    const placements: ImagePlacement[] = [];
    const sections = this.analyzeContentStructure(content);
    const headings = sections.filter(s => s.type === 'heading' && s.level === 2);
    
    // Place images after major headings
    for (let i = 0; i < Math.min(images.length, headings.length); i++) {
      placements.push({
        position: headings[i].position + headings[i].text.length + 1,
        imageIndex: i,
        context: headings[i].text,
        reason: 'Placed after major section heading'
      });
    }
    
    return placements;
  }

  /**
   * Insert images into content at specified positions
   */
  private insertImagesIntoContent(
    content: string,
    images: GeneratedImage[],
    placements: ImagePlacement[]
  ): string {
    let optimizedContent = content;
    
    // Sort placements by position (descending) to avoid position shifts
    const sortedPlacements = placements.sort((a, b) => b.position - a.position);
    
    for (const placement of sortedPlacements) {
      const image = images[placement.imageIndex];
      if (!image) continue;
      
      const imageMarkdown = this.generateImageMarkdown(image, placement);
      
      // Insert image at the specified position
      optimizedContent = 
        optimizedContent.slice(0, placement.position) +
        '\n\n' + imageMarkdown + '\n\n' +
        optimizedContent.slice(placement.position);
    }
    
    return optimizedContent;
  }

  /**
   * Generate optimized image markdown
   */
  private generateImageMarkdown(image: GeneratedImage, placement: ImagePlacement): string {
    const webpUrl = image.url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    return `<div class="image-container my-8">
  <picture>
    <source srcset="${webpUrl}" type="image/webp">
    <img 
      src="${image.url}" 
      alt="${image.alt}"
      width="${image.width}"
      height="${image.height}"
      loading="lazy"
      class="w-full h-auto rounded-lg shadow-lg"
    />
  </picture>
  <figcaption class="text-sm text-gray-600 text-center mt-2 italic">
    ${image.alt}
  </figcaption>
</div>`;
  }

  /**
   * Generate SEO-optimized image schema
   */
  generateImageSchema(images: GeneratedImage[], articleUrl: string): object {
    return {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      "name": "Article Images",
      "description": "AI-generated images for the article",
      "image": images.map(img => ({
        "@type": "ImageObject",
        "url": `${articleUrl}${img.url}`,
        "description": img.alt,
        "width": img.width,
        "height": img.height,
        "encodingFormat": "image/jpeg"
      }))
    };
  }

  /**
   * Optimize images for different social media platforms
   */
  async generateSocialMediaVariants(
    images: GeneratedImage[],
    title: string
  ): Promise<{
    facebook: string;
    twitter: string;
    linkedin: string;
    pinterest: string;
  }> {
    // For now, return the first image for all platforms
    // In a real implementation, you would create platform-specific variants
    const primaryImage = images[0]?.url || '';
    
    return {
      facebook: primaryImage,
      twitter: primaryImage,
      linkedin: primaryImage,
      pinterest: primaryImage
    };
  }
}

export default ContentImageOptimizer;