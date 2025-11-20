import * as fs from 'node:fs';
import * as path from 'path';

export interface FluxImageConfig {
  width?: number;
  height?: number;
  seed?: number;
  nologo?: boolean;
  enhance?: boolean;
}

export interface GeneratedImage {
  path: string;
  url: string;
}

export async function generateFluxImage(
  prompt: string,
  config: FluxImageConfig = {}
): Promise<GeneratedImage | null> {
  const {
    width = 1024,
    height = 768,
    seed,
    nologo = true,
    enhance = true
  } = config;

  try {
    console.log('🎨 Starting Pollinations.AI image generation...');
    console.log('Prompt:', prompt.substring(0, 100) + '...');
    
    const encodedPrompt = encodeURIComponent(prompt);
    const params = new URLSearchParams({
      width: width.toString(),
      height: height.toString(),
      nologo: nologo.toString(),
      enhance: enhance.toString(),
      ...(seed !== undefined && { seed: seed.toString() })
    });

    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`;
    
    console.log('📡 Fetching image from Pollinations.AI...');
    
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      console.error('❌ Failed to fetch image:', response.statusText);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const filename = `pollinations-${timestamp}-${randomSuffix}.png`;
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'articles');
    
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    const imagePath = path.join(imagesDir, filename);
    fs.writeFileSync(imagePath, buffer);

    console.log('✅ Image saved successfully:', imagePath);

    return {
      path: imagePath,
      url: `/images/articles/${filename}`
    };
  } catch (error) {
    console.error('❌ Image generation error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return null;
  }
}

export function createImagePrompt(articleTitle: string, position: 'hero' | 'middle'): string {
  if (position === 'hero') {
    const heroPrompts = [
      `Create a professional, high-quality featured image for an article titled "${articleTitle}". 
Style: modern, clean, tech-focused design with vibrant colors.
Include: abstract geometric shapes, gradient backgrounds, technology-themed elements.
Requirements: professional, eye-catching, suitable for a tech blog header, 4K quality, HDR.`,
      
      `Design a stunning featured image for a blog post about "${articleTitle}".
Style: sleek, contemporary, minimalist with bold typography and dynamic composition.
Elements: futuristic tech imagery, digital patterns, AI-themed visuals.
Quality: high resolution, professional photography style, dramatic lighting.`,
      
      `Generate a captivating hero image for an article on "${articleTitle}".
Style: professional tech publication aesthetic, vibrant and modern.
Include: innovative design elements, abstract tech visuals, clean composition.
Requirements: magazine-quality, 4K resolution, suitable for professional blog.`
    ];

    const randomIndex = Math.floor(Math.random() * heroPrompts.length);
    return heroPrompts[randomIndex];
  } else {
    const middlePrompts = [
      `Create a supporting illustration for an article about "${articleTitle}".
Style: informative, visually engaging, complementary to content.
Include: relevant icons, diagrams, or concept visualization.
Requirements: clear, professional, contextual to the topic.`,
      
      `Design an inline content image for "${articleTitle}".
Style: clean, modern, informative visualization.
Elements: schematic representations, workflow diagrams, or conceptual imagery.
Quality: professional, blog-friendly, informative.`,
      
      `Generate a mid-article illustration for "${articleTitle}".
Style: supporting visual content, professional design.
Include: concept visualization, process illustration, or thematic imagery.
Requirements: complementary to article content, visually appealing.`
    ];

    const randomIndex = Math.floor(Math.random() * middlePrompts.length);
    return middlePrompts[randomIndex];
  }
}
