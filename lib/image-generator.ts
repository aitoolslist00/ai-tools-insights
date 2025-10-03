import { GoogleGenerativeAI } from '@google/generative-ai';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

interface ImageGenerationOptions {
  keywords: string[];
  title: string;
  category?: string;
  style?: 'modern' | 'minimalist' | 'tech' | 'professional' | 'creative';
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2';
  quality?: 'high' | 'medium' | 'low';
}

interface GeneratedImage {
  filename: string;
  path: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  optimized: boolean;
}

export class ImageGenerator {
  private genAI: GoogleGenerativeAI;
  private uploadsDir: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure uploads directory exists
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  /**
   * Generate optimized images for blog articles
   */
  async generateArticleImages(options: ImageGenerationOptions): Promise<GeneratedImage[]> {
    try {
      const images: GeneratedImage[] = [];
      
      // Generate multiple images for the article
      const imagePrompts = this.createImagePrompts(options);
      
      for (let i = 0; i < imagePrompts.length; i++) {
        const prompt = imagePrompts[i];
        const image = await this.generateSingleImage(prompt, options, i + 1);
        if (image) {
          images.push(image);
        }
      }
      
      return images;
    } catch (error) {
      console.error('Error generating article images:', error);
      throw error;
    }
  }

  /**
   * Create image prompts based on article content
   */
  private createImagePrompts(options: ImageGenerationOptions): string[] {
    const { keywords, title, category, style = 'modern' } = options;
    
    const baseStyle = this.getStyleDescription(style);
    const keywordString = keywords.join(', ');
    
    const prompts = [
      // Hero image
      `Create a ${baseStyle} hero image for an article titled "${title}". 
       Focus on ${keywordString}. 
       The image should be professional, engaging, and suitable for a tech blog. 
       Include visual elements that represent ${category || 'technology'} and AI tools.
       Use a clean, modern design with appropriate colors and typography.`,
      
      // Feature illustration
      `Design a ${baseStyle} illustration showing the key concepts of ${keywordString}. 
       The image should be informative and visually appealing, 
       suitable for explaining complex ${category || 'technology'} concepts.
       Use icons, diagrams, or infographic elements.`,
      
      // Concept visualization
      `Create a ${baseStyle} conceptual image that visualizes ${keywordString} in action. 
       Show practical applications and real-world usage scenarios.
       The image should help readers understand the practical benefits and applications.`
    ];
    
    return prompts;
  }

  /**
   * Generate a single optimized image
   */
  private async generateSingleImage(
    prompt: string, 
    options: ImageGenerationOptions, 
    index: number
  ): Promise<GeneratedImage | null> {
    try {
      // For now, we'll create placeholder images since Gemini doesn't directly generate images
      // In a real implementation, you would use an image generation API like DALL-E, Midjourney, or Stable Diffusion
      
      const dimensions = this.getDimensions(options.aspectRatio || '16:9');
      const filename = this.generateFilename(options.title, index);
      const filepath = path.join(this.uploadsDir, filename);
      
      // Create a placeholder image with text overlay
      const placeholderImage = await this.createPlaceholderImage(
        prompt,
        dimensions.width,
        dimensions.height,
        options
      );
      
      // Save the image
      await sharp(placeholderImage)
        .jpeg({ quality: options.quality === 'high' ? 95 : options.quality === 'medium' ? 80 : 65 })
        .toFile(filepath);
      
      // Optimize the image
      await this.optimizeImage(filepath);
      
      const stats = fs.statSync(filepath);
      
      return {
        filename,
        path: filepath,
        url: `/uploads/${filename}`,
        alt: this.generateAltText(options.title, options.keywords, index),
        width: dimensions.width,
        height: dimensions.height,
        optimized: true
      };
      
    } catch (error) {
      console.error(`Error generating image ${index}:`, error);
      return null;
    }
  }

  /**
   * Create a placeholder image with AI-generated content description
   */
  private async createPlaceholderImage(
    prompt: string,
    width: number,
    height: number,
    options: ImageGenerationOptions
  ): Promise<Buffer> {
    // Generate a description using Gemini
    const description = await this.generateImageDescription(prompt, options);
    
    // Create a visually appealing placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)"/>
        <rect width="100%" height="100%" fill="url(#grid)"/>
        <foreignObject x="40" y="${height/2 - 60}" width="${width - 80}" height="120">
          <div xmlns="http://www.w3.org/1999/xhtml" style="
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: white;
            text-align: center;
            padding: 20px;
            background: rgba(0,0,0,0.3);
            border-radius: 12px;
            backdrop-filter: blur(10px);
          ">
            <h3 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">
              ${options.title.substring(0, 50)}${options.title.length > 50 ? '...' : ''}
            </h3>
            <p style="margin: 0; font-size: 14px; opacity: 0.9; line-height: 1.4;">
              ${description.substring(0, 120)}${description.length > 120 ? '...' : ''}
            </p>
          </div>
        </foreignObject>
        <circle cx="${width - 60}" cy="60" r="30" fill="rgba(255,255,255,0.2)"/>
        <text x="${width - 60}" y="68" text-anchor="middle" fill="white" font-size="16" font-weight="bold">AI</text>
      </svg>
    `;
    
    return Buffer.from(svg);
  }

  /**
   * Generate image description using Gemini
   */
  private async generateImageDescription(prompt: string, options: ImageGenerationOptions): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const enhancedPrompt = `
        Based on this image concept: "${prompt}"
        
        Generate a concise, engaging description (max 120 characters) that would appear as overlay text on an AI-generated image for a blog article about "${options.title}".
        
        The description should:
        - Be informative and engaging
        - Relate to the keywords: ${options.keywords.join(', ')}
        - Be suitable for a professional tech blog
        - Capture the essence of the image concept
        
        Return only the description text, no additional formatting.
      `;
      
      const result = await model.generateContent(enhancedPrompt);
      const response = await result.response;
      return response.text().trim();
      
    } catch (error) {
      console.error('Error generating image description:', error);
      return `Exploring ${options.keywords.slice(0, 2).join(' and ')} in modern AI applications`;
    }
  }

  /**
   * Optimize image for web performance
   */
  private async optimizeImage(filepath: string): Promise<void> {
    try {
      const image = sharp(filepath);
      const metadata = await image.metadata();
      
      // Create multiple optimized versions
      const optimizations = [
        // Original optimized
        image.jpeg({ quality: 85, progressive: true }),
        
        // WebP version
        image.webp({ quality: 80 }),
        
        // Thumbnail version
        image.resize(400, Math.round((metadata.height || 600) * (400 / (metadata.width || 800))))
              .jpeg({ quality: 75 })
      ];
      
      const baseName = path.basename(filepath, path.extname(filepath));
      const dir = path.dirname(filepath);
      
      await Promise.all([
        optimizations[0].toFile(filepath), // Replace original
        optimizations[1].toFile(path.join(dir, `${baseName}.webp`)),
        optimizations[2].toFile(path.join(dir, `${baseName}-thumb.jpg`))
      ]);
      
    } catch (error) {
      console.error('Error optimizing image:', error);
    }
  }

  /**
   * Generate SEO-friendly filename
   */
  private generateFilename(title: string, index: number): string {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const timestamp = Date.now();
    return `${slug}-${index}-${timestamp}.jpg`;
  }

  /**
   * Generate SEO-optimized alt text
   */
  private generateAltText(title: string, keywords: string[], index: number): string {
    const imageTypes = ['illustration', 'diagram', 'concept visualization', 'infographic'];
    const imageType = imageTypes[index - 1] || 'illustration';
    
    return `${imageType} showing ${keywords.slice(0, 3).join(', ')} related to ${title}`;
  }

  /**
   * Get style description for image generation
   */
  private getStyleDescription(style: string): string {
    const styles = {
      modern: 'clean, modern, minimalist',
      minimalist: 'simple, clean, minimal design',
      tech: 'futuristic, high-tech, digital',
      professional: 'professional, corporate, polished',
      creative: 'creative, artistic, innovative'
    };
    
    return styles[style as keyof typeof styles] || styles.modern;
  }

  /**
   * Get image dimensions based on aspect ratio
   */
  private getDimensions(aspectRatio: string): { width: number; height: number } {
    const ratios = {
      '16:9': { width: 1200, height: 675 },
      '4:3': { width: 1200, height: 900 },
      '1:1': { width: 1200, height: 1200 },
      '3:2': { width: 1200, height: 800 }
    };
    
    return ratios[aspectRatio as keyof typeof ratios] || ratios['16:9'];
  }

  /**
   * Generate images for existing blog post
   */
  async generateImagesForPost(postId: string, postData: any): Promise<GeneratedImage[]> {
    const options: ImageGenerationOptions = {
      keywords: postData.keywords || postData.tags || [],
      title: postData.title,
      category: postData.category,
      style: 'modern',
      aspectRatio: '16:9',
      quality: 'high'
    };
    
    return await this.generateArticleImages(options);
  }
}

export default ImageGenerator;