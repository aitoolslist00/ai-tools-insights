import * as fs from 'node:fs';
import * as path from 'path';
import { getSetting } from './db';

export interface ImageGenerationConfig {
  numberOfImages?: number;
  aspectRatio?: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
  personGeneration?: 'dont_allow' | 'allow_adult' | 'allow_all';
}

export interface GeneratedImage {
  path: string;
  url: string;
}

export async function generateArticleImage(
  articleTitle: string,
  config: ImageGenerationConfig = {}
): Promise<GeneratedImage | null> {
  const geminiApiKey = await getSetting('GEMINI_API_KEY') || process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    console.error('Gemini API key not configured');
    return null;
  }

  const prompt = createImagePrompt(articleTitle);
  
  const {
    numberOfImages = 1,
    aspectRatio = '16:9',
    personGeneration = 'allow_adult'
  } = config;

  try {
    console.log('🎨 Starting image generation...');
    console.log('Prompt:', prompt.substring(0, 100) + '...');
    console.log('API Key present:', !!geminiApiKey);
    console.log('API Key length:', geminiApiKey?.length);
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict`;
    console.log('Using API URL:', apiUrl);
    
    const requestBody = {
      instances: [{
        prompt: prompt
      }],
      parameters: {
        sampleCount: numberOfImages,
        aspectRatio: aspectRatio,
        personGeneration: personGeneration
      }
    };
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': geminiApiKey || ''
      },
      body: JSON.stringify(requestBody)
    });

    console.log('API Response status:', response.status);
    console.log('API Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Imagen API error (status ' + response.status + '):', errorData);
      return null;
    }

    const data = await response.json();
    console.log('✅ API Response received');
    console.log('Response structure:', Object.keys(data));
    
    if (!data.predictions || data.predictions.length === 0) {
      console.error('❌ No images in predictions. Full response:', JSON.stringify(data).substring(0, 500));
      return null;
    }

    const prediction = data.predictions[0];
    console.log('Prediction structure:', Object.keys(prediction));
    
    let imageBytes;
    
    if (prediction.bytesBase64Encoded) {
      imageBytes = prediction.bytesBase64Encoded;
      console.log('✅ Found image in bytesBase64Encoded');
    } else if (prediction.image && prediction.image.bytesBase64Encoded) {
      imageBytes = prediction.image.bytesBase64Encoded;
      console.log('✅ Found image in image.bytesBase64Encoded');
    } else {
      console.error('❌ No image data found. Prediction:', JSON.stringify(prediction).substring(0, 500));
      return null;
    }

    if (!imageBytes) {
      console.error('❌ Image bytes are empty');
      return null;
    }

    const buffer = Buffer.from(imageBytes, 'base64');
    const timestamp = Date.now();
    const filename = `article-${timestamp}.png`;
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

function createImagePrompt(articleTitle: string): string {
  const prompts = [
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

  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex];
}
