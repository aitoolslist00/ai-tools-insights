import { GoogleGenerativeAI } from '@google/generative-ai';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

interface ImageGenerationOptions {
  keyword: string;
  style?: 'realistic' | 'artistic' | 'minimalist' | 'corporate' | 'tech';
  aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16';
  quality?: 'high' | 'medium' | 'low';
  width?: number;
  height?: number;
}

interface GeneratedImageResult {
  filename: string;
  path: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  webpPath: string;
  webpUrl: string;
  thumbnailPath: string;
  thumbnailUrl: string;
  metadata: {
    keyword: string;
    style: string;
    generatedAt: string;
    optimized: boolean;
    source: 'unsplash';
    unsplashId?: string;
    photographer?: string;
    photographerUrl?: string;
  };
}

interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
  description: string | null;
  alt_description: string | null;
  width: number;
  height: number;
}

export class RealImageGenerator {
  private genAI: GoogleGenerativeAI;
  private outputDir: string;
  private unsplashAccessKey: string;

  constructor() {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    
    if (!unsplashKey) {
      throw new Error('UNSPLASH_ACCESS_KEY environment variable is required');
    }
    
    this.genAI = new GoogleGenerativeAI(geminiApiKey);
    this.unsplashAccessKey = unsplashKey;
    this.outputDir = path.join(process.cwd(), 'public', 'generated-images');
  }

  /**
   * Generate an image based on keyword using Unsplash API
   */
  async generateImage(options: ImageGenerationOptions): Promise<GeneratedImageResult> {
    try {
      // Ensure output directory exists
      await this.ensureDirectoryExists();

      // Generate enhanced search terms using Gemini AI
      const searchTerms = await this.generateSearchTerms(options);
      
      // Search for images on Unsplash
      const unsplashImage = await this.searchUnsplashImage(searchTerms, options);
      
      // Download and process the image
      const processedImage = await this.downloadAndProcessImage(unsplashImage, options);
      
      return processedImage;
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate multiple images for an article
   */
  async generateArticleImages(
    title: string,
    keywords: string[],
    content: string
  ): Promise<GeneratedImageResult[]> {
    const images: GeneratedImageResult[] = [];
    
    try {
      // Generate hero image
      const heroImage = await this.generateImage({
        keyword: keywords[0] || title,
        style: 'corporate',
        aspectRatio: '16:9',
        width: 1200,
        height: 675
      });
      images.push(heroImage);

      // Generate feature images for each keyword (max 3 additional)
      for (let i = 1; i < Math.min(keywords.length, 4); i++) {
        try {
          const featureImage = await this.generateImage({
            keyword: keywords[i],
            style: 'tech',
            aspectRatio: '4:3',
            width: 800,
            height: 600
          });
          images.push(featureImage);
        } catch (error) {
          console.warn(`Failed to generate image for keyword "${keywords[i]}":`, error);
          // Continue with other images
        }
      }

      // Generate a concept image based on content analysis
      try {
        const conceptKeyword = await this.extractConceptFromContent(content);
        if (conceptKeyword) {
          const conceptImage = await this.generateImage({
            keyword: conceptKeyword,
            style: 'minimalist',
            aspectRatio: '1:1',
            width: 600,
            height: 600
          });
          images.push(conceptImage);
        }
      } catch (error) {
        console.warn('Failed to generate concept image:', error);
        // Continue without concept image
      }

      return images;
    } catch (error) {
      console.error('Error generating article images:', error);
      return images; // Return whatever images were successfully generated
    }
  }

  /**
   * Generate enhanced search terms using Gemini AI
   */
  private async generateSearchTerms(options: ImageGenerationOptions): Promise<string[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const prompt = `
        Generate 3-5 search terms for finding high-quality stock photos related to "${options.keyword}".
        Style preference: ${options.style || 'realistic'}
        
        Consider these guidelines:
        - Use specific, descriptive terms that photographers would tag their images with
        - Include both broad and specific terms
        - Consider professional, business, and technology contexts
        - Avoid overly abstract concepts
        
        Return only the search terms, separated by commas, no explanations.
        Example: "artificial intelligence, technology, computer, digital innovation, modern office"
      `;
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Gemini API timeout')), 30000)
      );
      
      const result = await Promise.race([
        model.generateContent(prompt),
        timeoutPromise
      ]);
      
      const response = await result.response;
      const text = response.text().trim();
      
      // Parse the response and clean up the terms
      const terms = text.split(',').map(term => term.trim().toLowerCase()).filter(term => term.length > 0);
      
      // Fallback to original keyword if no terms generated
      return terms.length > 0 ? terms : [options.keyword.toLowerCase()];
      
    } catch (error) {
      console.warn('Failed to generate search terms with AI, using fallback:', error);
      // Fallback search terms based on keyword and style
      return this.generateFallbackSearchTerms(options);
    }
  }

  /**
   * Generate fallback search terms without AI
   */
  private generateFallbackSearchTerms(options: ImageGenerationOptions): string[] {
    const baseTerms = [options.keyword.toLowerCase()];
    
    // Add style-specific terms
    switch (options.style) {
      case 'tech':
        baseTerms.push('technology', 'digital', 'computer', 'innovation');
        break;
      case 'corporate':
        baseTerms.push('business', 'professional', 'office', 'corporate');
        break;
      case 'minimalist':
        baseTerms.push('clean', 'simple', 'minimal', 'modern');
        break;
      case 'artistic':
        baseTerms.push('creative', 'design', 'art', 'abstract');
        break;
      default:
        baseTerms.push('professional', 'modern');
    }
    
    return baseTerms;
  }

  /**
   * Search for images on Unsplash
   */
  private async searchUnsplashImage(searchTerms: string[], options: ImageGenerationOptions): Promise<UnsplashImage> {
    const query = searchTerms.join(' ');
    const orientation = this.getOrientationFromAspectRatio(options.aspectRatio);
    
    const searchUrl = new URL('https://api.unsplash.com/search/photos');
    searchUrl.searchParams.set('query', query);
    searchUrl.searchParams.set('per_page', '10');
    searchUrl.searchParams.set('orientation', orientation);
    searchUrl.searchParams.set('order_by', 'relevant');
    
    const response = await fetch(searchUrl.toString(), {
      headers: {
        'Authorization': `Client-ID ${this.unsplashAccessKey}`,
        'Accept-Version': 'v1'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      // Try with just the main keyword if no results
      const fallbackQuery = searchTerms[0] || options.keyword;
      return this.searchUnsplashImageFallback(fallbackQuery, orientation);
    }
    
    // Return the first (most relevant) result
    return data.results[0];
  }

  /**
   * Fallback search with simpler terms
   */
  private async searchUnsplashImageFallback(query: string, orientation: string): Promise<UnsplashImage> {
    const searchUrl = new URL('https://api.unsplash.com/search/photos');
    searchUrl.searchParams.set('query', query);
    searchUrl.searchParams.set('per_page', '10');
    searchUrl.searchParams.set('orientation', orientation);
    
    const response = await fetch(searchUrl.toString(), {
      headers: {
        'Authorization': `Client-ID ${this.unsplashAccessKey}`,
        'Accept-Version': 'v1'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Unsplash API fallback error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error(`No images found for query: ${query}`);
    }
    
    return data.results[0];
  }

  /**
   * Download and process image from Unsplash
   */
  private async downloadAndProcessImage(
    unsplashImage: UnsplashImage, 
    options: ImageGenerationOptions
  ): Promise<GeneratedImageResult> {
    const filename = this.generateFilename(options.keyword);
    const imagePath = path.join(this.outputDir, `${filename}.jpg`);
    
    // Determine the best URL to download based on desired size
    const targetWidth = options.width || 1200;
    const downloadUrl = this.getBestImageUrl(unsplashImage, targetWidth);
    
    // Download the image
    const imageResponse = await fetch(downloadUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`);
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // Process and resize the image
    const processedBuffer = await sharp(Buffer.from(imageBuffer))
      .resize(options.width || 1200, options.height || 675, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 90 })
      .toBuffer();
    
    // Save the processed image
    await fs.writeFile(imagePath, processedBuffer);
    
    // Generate optimized variants
    const variants = await this.generateOptimizedVariants(imagePath, filename);
    
    // Generate alt text
    const altText = this.generateAltText(unsplashImage, options.keyword);
    
    return {
      filename: `${filename}.jpg`,
      path: imagePath,
      url: `/generated-images/${filename}.jpg`,
      alt: altText,
      width: options.width || 1200,
      height: options.height || 675,
      webpPath: variants.webpPath,
      webpUrl: variants.webpUrl,
      thumbnailPath: variants.thumbnailPath,
      thumbnailUrl: variants.thumbnailUrl,
      metadata: {
        keyword: options.keyword,
        style: options.style || 'realistic',
        generatedAt: new Date().toISOString(),
        optimized: true,
        source: 'unsplash',
        unsplashId: unsplashImage.id,
        photographer: unsplashImage.user.name,
        photographerUrl: unsplashImage.user.links.html
      }
    };
  }

  /**
   * Get the best image URL based on target width
   */
  private getBestImageUrl(unsplashImage: UnsplashImage, targetWidth: number): string {
    // Use Unsplash's dynamic resizing
    const baseUrl = unsplashImage.urls.raw;
    return `${baseUrl}&w=${targetWidth}&q=80&fm=jpg&fit=crop`;
  }

  /**
   * Generate alt text for the image
   */
  private generateAltText(unsplashImage: UnsplashImage, keyword: string): string {
    if (unsplashImage.alt_description) {
      return unsplashImage.alt_description;
    }
    
    if (unsplashImage.description) {
      return unsplashImage.description;
    }
    
    return `Professional image related to ${keyword}`;
  }

  /**
   * Get orientation from aspect ratio
   */
  private getOrientationFromAspectRatio(aspectRatio?: string): string {
    switch (aspectRatio) {
      case '16:9':
      case '4:3':
        return 'landscape';
      case '9:16':
        return 'portrait';
      case '1:1':
        return 'squarish';
      default:
        return 'landscape';
    }
  }

  /**
   * Generate optimized variants (WebP, thumbnail)
   */
  private async generateOptimizedVariants(imagePath: string, filename: string): Promise<{
    webpPath: string;
    webpUrl: string;
    thumbnailPath: string;
    thumbnailUrl: string;
  }> {
    const webpPath = path.join(this.outputDir, `${filename}.webp`);
    const thumbnailPath = path.join(this.outputDir, `${filename}-thumb.jpg`);

    // Generate WebP version
    await sharp(imagePath)
      .webp({ quality: 85 })
      .toFile(webpPath);

    // Generate thumbnail
    await sharp(imagePath)
      .resize(300, 200, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);

    return {
      webpPath,
      webpUrl: `/generated-images/${filename}.webp`,
      thumbnailPath,
      thumbnailUrl: `/generated-images/${filename}-thumb.jpg`
    };
  }

  /**
   * Extract concept from content using AI
   */
  private async extractConceptFromContent(content: string): Promise<string | null> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const prompt = `
        Analyze this content and extract the main concept that would make a good visual representation:
        
        ${content.substring(0, 1000)}
        
        Return only a single keyword or short phrase (2-3 words max) that represents the core concept.
        No explanation, just the keyword/phrase.
      `;
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Gemini API timeout')), 30000)
      );
      
      const result = await Promise.race([
        model.generateContent(prompt),
        timeoutPromise
      ]);
      
      const response = await result.response;
      const text = response.text().trim();
      
      return text.length > 0 ? text : null;
    } catch (error) {
      console.warn('Failed to extract concept from content:', error);
      return null;
    }
  }

  /**
   * Generate filename from keyword
   */
  private generateFilename(keyword: string): string {
    const timestamp = Date.now();
    const cleanKeyword = keyword
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30);
    
    return `${cleanKeyword}-${timestamp}`;
  }

  /**
   * Ensure output directory exists
   */
  private async ensureDirectoryExists(): Promise<void> {
    try {
      await fs.access(this.outputDir);
    } catch {
      await fs.mkdir(this.outputDir, { recursive: true });
    }
  }
}

// Export convenience function for backward compatibility
export async function generateImageWithRealAPI(keyword: string, content?: string): Promise<any> {
  const generator = new RealImageGenerator()
  
  try {
    const result = await generator.generateImage({
      keyword,
      style: 'corporate',
      aspectRatio: '16:9',
      width: 1200,
      height: 675
    })
    
    return {
      url: result.url,
      alt: result.alt,
      title: keyword,
      caption: `Professional image for ${keyword}`,
      width: result.width,
      height: result.height,
      format: 'jpg'
    }
  } catch (error) {
    console.warn(`Failed to generate image for "${keyword}":`, error)
    // Return placeholder data
    return {
      url: `/generated-images/${keyword.toLowerCase().replace(/\s+/g, '-')}-placeholder.jpg`,
      alt: keyword,
      title: keyword,
      caption: `Image for ${keyword}`,
      width: 1200,
      height: 675,
      format: 'jpg'
    }
  }
}