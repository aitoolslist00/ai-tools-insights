import { generateArticleImage } from './src/lib/image-generation.ts';

async function test() {
  console.log('Testing image generation...');
  
  const result = await generateArticleImage('AI Tools and Technology', {
    aspectRatio: '16:9',
    numberOfImages: 1
  });
  
  if (result) {
    console.log('✅ Success! Image generated at:', result.path);
    console.log('URL:', result.url);
  } else {
    console.log('❌ Failed to generate image');
  }
}

test();
