'use client'

import { useState } from 'react';
import { 
  Image as ImageIcon, 
  Wand2, 
  Download, 
  Eye, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface GeneratedImage {
  filename: string;
  path: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  optimized: boolean;
}

interface ImageGeneratorProps {
  postId: string;
  postTitle: string;
  keywords?: string[];
  onImagesGenerated?: (images: GeneratedImage[]) => void;
}

export default function ImageGenerator({ 
  postId, 
  postTitle, 
  keywords = [],
  onImagesGenerated 
}: ImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const generateImages = async (options: {
    regenerate?: boolean;
    useRealGeneration?: boolean;
    optimizeContent?: boolean;
    keywords?: string[];
  } = {}) => {
    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/generate-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          regenerate: options.regenerate ?? false,
          useRealGeneration: options.useRealGeneration ?? true,
          optimizeContent: options.optimizeContent ?? true,
          keywords: options.keywords
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate images');
      }

      setImages(data.images);
      setSuccess(data.message);
      
      if (onImagesGenerated) {
        onImagesGenerated(data.images);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate images');
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchExistingImages = async () => {
    try {
      const response = await fetch(`/api/generate-images?postId=${postId}`);
      const data = await response.json();

      if (response.ok && data.images) {
        setImages(data.images);
      }
    } catch (err) {
      console.error('Error fetching existing images:', err);
    }
  };

  // Fetch existing images on component mount
  useState(() => {
    fetchExistingImages();
  });

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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <ImageIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Image Generator</h3>
            <p className="text-sm text-gray-500">Generate optimized images for your article</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => {
              const useRealGeneration = (document.getElementById('useRealGeneration') as HTMLInputElement)?.checked ?? true;
              const optimizeContent = (document.getElementById('optimizeContent') as HTMLInputElement)?.checked ?? true;
              const customKeywords = (document.getElementById('customKeywords') as HTMLInputElement)?.value;
              const keywords = customKeywords ? customKeywords.split(',').map(k => k.trim()).filter(Boolean) : undefined;
              
              generateImages({ 
                regenerate: false, 
                useRealGeneration, 
                optimizeContent,
                keywords
              });
            }}
            disabled={isGenerating}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 mr-2" />
            )}
            {images.length > 0 ? 'Generate More' : 'Generate AI Images'}
          </button>
          
          {images.length > 0 && (
            <button
              onClick={() => {
                const useRealGeneration = (document.getElementById('useRealGeneration') as HTMLInputElement)?.checked ?? true;
                const optimizeContent = (document.getElementById('optimizeContent') as HTMLInputElement)?.checked ?? true;
                const customKeywords = (document.getElementById('customKeywords') as HTMLInputElement)?.value;
                const keywords = customKeywords ? customKeywords.split(',').map(k => k.trim()).filter(Boolean) : undefined;
                
                generateImages({ 
                  regenerate: true, 
                  useRealGeneration, 
                  optimizeContent,
                  keywords
                });
              }}
              disabled={isGenerating}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </button>
          )}
        </div>
      </div>

      {/* Article Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Article: {postTitle}</h4>
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Keywords:</span>
            {keywords.slice(0, 5).map((keyword, index) => (
              <span
                key={index}
                className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Options */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Generation Options</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="useRealGeneration"
              defaultChecked={true}
              className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="useRealGeneration" className="text-sm text-gray-700">
              Use AI-powered generation (Gemini)
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="optimizeContent"
              defaultChecked={true}
              className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="optimizeContent" className="text-sm text-gray-700">
              Auto-integrate images into content
            </label>
          </div>
        </div>
        <div className="mt-3">
          <label htmlFor="customKeywords" className="block text-sm font-medium text-gray-700 mb-1">
            Custom Keywords (optional)
          </label>
          <input
            type="text"
            id="customKeywords"
            placeholder="Enter keywords separated by commas"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to use article title and tags automatically
          </p>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="mb-6 p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Generating AI-powered images...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      )}

      {/* Generated Images */}
      {images.length > 0 && (
        <div className="space-y-6">
          <h4 className="text-lg font-medium text-gray-900">Generated Images ({images.length})</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="aspect-video relative group">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => previewImage(image.url)}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={() => downloadImage(image.url, image.filename)}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      Image {index + 1}
                    </span>
                    {image.optimized && (
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Optimized
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2">{image.alt}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{image.width} × {image.height}</span>
                    <span className="truncate ml-2">{image.filename}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isGenerating && images.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Images Generated Yet</h4>
          <p className="text-gray-500 mb-6">
            Click "Generate Images" to create AI-powered visuals for your article
          </p>
        </div>
      )}
    </div>
  );
}