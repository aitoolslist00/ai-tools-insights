'use client';

import { useState } from 'react';
import { Wand2, Loader2, CheckCircle, AlertCircle, Download, Eye } from 'lucide-react';

interface GeneratedImage {
  filename: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  webpUrl: string;
  thumbnailUrl: string;
  metadata: {
    keyword: string;
    style: string;
    generatedAt: string;
    optimized: boolean;
  };
}

export default function TestImagesPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [testKeyword, setTestKeyword] = useState('artificial intelligence');

  const testImageGeneration = async () => {
    setIsGenerating(true);
    setError(null);
    setSuccess(null);
    setImages([]);

    try {
      // Create a test post first
      const testPost = {
        id: 'test-image-generation',
        title: `Test: ${testKeyword}`,
        content: `# Test Article: ${testKeyword}

This is a test article to demonstrate AI image generation capabilities.

## Introduction

${testKeyword} is an important topic that deserves visual representation.

## Key Points

Here are some important aspects to consider.

## Conclusion

This concludes our test article.`,
        tags: [testKeyword, 'test', 'AI'],
        categories: ['Technology'],
        slug: 'test-image-generation',
        href: '/blog/test-image-generation',
        publishedAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      // Save test post to blog posts
      const saveResponse = await fetch('/api/blog-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPost),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to create test post');
      }

      // Generate images for the test post
      const response = await fetch('/api/generate-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: 'test-image-generation',
          useRealGeneration: true,
          optimizeContent: true,
          keywords: [testKeyword, 'technology', 'innovation']
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate images');
      }

      setImages(data.images || []);
      setSuccess(`✅ Generated ${data.images?.length || 0} images successfully!`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const previewImage = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI Image Generation Test
            </h1>
            <p className="text-gray-600">
              Test the AI-powered image generation system with custom keywords
            </p>
          </div>

          {/* Test Controls */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Configuration</h2>
            
            <div className="mb-4">
              <label htmlFor="testKeyword" className="block text-sm font-medium text-gray-700 mb-2">
                Test Keyword
              </label>
              <input
                type="text"
                id="testKeyword"
                value={testKeyword}
                onChange={(e) => setTestKeyword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a keyword to generate images for"
              />
            </div>

            <button
              onClick={testImageGeneration}
              disabled={isGenerating || !testKeyword.trim()}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-5 h-5 mr-2" />
              )}
              {isGenerating ? 'Generating Images...' : 'Generate Test Images'}
            </button>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-red-700 font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {/* Generated Images */}
          {images.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Generated Images ({images.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="aspect-video bg-gray-100 relative">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to a placeholder if image fails to load
                          (e.target as HTMLImageElement).src = `data:image/svg+xml,${encodeURIComponent(`
                            <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                              <rect width="100%" height="100%" fill="#f3f4f6"/>
                              <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6b7280">
                                Image Loading...
                              </text>
                            </svg>
                          `)}`;
                        }}
                      />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2 truncate">
                        {image.filename}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {image.alt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{image.width} × {image.height}</span>
                        <span className="capitalize">{image.metadata.style}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => previewImage(image.url)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </button>
                        <button
                          onClick={() => downloadImage(image.url, image.filename)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Information */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">System Information</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Images are generated using Gemini AI</p>
              <p>• Multiple formats created: PNG, WebP, and thumbnails</p>
              <p>• Images are optimized for web performance</p>
              <p>• Alt text is automatically generated for accessibility</p>
              <p>• Images can be automatically integrated into blog content</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}