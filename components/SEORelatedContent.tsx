/**
 * SEO-Optimized Related Content Component
 * Implements Google's content clustering and topical authority strategies
 * Updated for 2024 SEO algorithms with semantic content matching
 */

'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ClockIcon, TagIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { linkPerformanceTracker } from '@/lib/seo-link-performance-tracker';
import InternalLinkStrategy from '@/lib/internal-link-strategy';

interface ContentItem {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  image?: string;
  type: 'tool' | 'blog' | 'guide';
  priority: number;
  keywords: string[];
}

interface SEORelatedContentProps {
  currentContent: {
    title: string;
    category: string;
    tags: string[];
    keywords: string[];
    type: 'tool' | 'blog' | 'guide';
  };
  currentUrl: string;
  maxItems?: number;
  showImages?: boolean;
  layout?: 'grid' | 'list' | 'compact';
  context?: 'sidebar' | 'footer' | 'inline';
}

export default function SEORelatedContent({
  currentContent,
  currentUrl,
  maxItems = 6,
  showImages = true,
  layout = 'grid',
  context = 'inline'
}: SEORelatedContentProps) {
  // Strategy is handled within the component logic

  // Mock related content - in production, this would come from your CMS/database
  const allContent: ContentItem[] = useMemo(() => [
    // AI Image Generator Tools
    {
      title: 'DALL-E 3: Revolutionary AI Image Generation',
      slug: 'dall-e-3',
      excerpt: 'Create stunning images from text descriptions with OpenAI\'s most advanced image generator.',
      category: 'image-generators',
      tags: ['dall-e', 'openai', 'image-generation', 'ai-art'],
      publishedAt: '2024-01-15',
      readTime: 5,
      image: '/images/tools/dall-e-3.jpg',
      type: 'tool',
      priority: 10,
      keywords: ['dall-e 3', 'ai image generator', 'openai image', 'text to image']
    },
    {
      title: 'Midjourney vs DALL-E: Complete Comparison 2024',
      slug: 'midjourney-vs-dall-e-comparison-2024',
      excerpt: 'Detailed comparison of the two leading AI image generators to help you choose the best tool.',
      category: 'comparisons',
      tags: ['midjourney', 'dall-e', 'comparison', 'ai-art'],
      publishedAt: '2024-01-20',
      readTime: 8,
      image: '/images/blog/midjourney-vs-dalle.jpg',
      type: 'blog',
      priority: 9,
      keywords: ['midjourney vs dall-e', 'ai image comparison', 'best ai art generator']
    },
    {
      title: 'Stable Diffusion: Open Source AI Art Revolution',
      slug: 'stable-diffusion',
      excerpt: 'Free, open-source AI image generation with unlimited creative possibilities.',
      category: 'image-generators',
      tags: ['stable-diffusion', 'open-source', 'free', 'ai-art'],
      publishedAt: '2024-01-10',
      readTime: 6,
      image: '/images/tools/stable-diffusion.jpg',
      type: 'tool',
      priority: 8,
      keywords: ['stable diffusion', 'free ai image generator', 'open source ai art']
    },
    // AI Writing Tools
    {
      title: 'ChatGPT: The Ultimate AI Writing Assistant',
      slug: 'chatgpt',
      excerpt: 'Transform your writing with OpenAI\'s powerful conversational AI assistant.',
      category: 'writing-tools',
      tags: ['chatgpt', 'openai', 'writing', 'ai-assistant'],
      publishedAt: '2024-01-12',
      readTime: 7,
      image: '/images/tools/chatgpt.jpg',
      type: 'tool',
      priority: 10,
      keywords: ['chatgpt', 'ai writing assistant', 'openai chatbot', 'ai content creation']
    },
    {
      title: 'Best AI Writing Tools for Content Creators 2024',
      slug: 'best-ai-writing-tools-2024',
      excerpt: 'Comprehensive guide to the top AI writing tools that will revolutionize your content creation.',
      category: 'writing-tools',
      tags: ['writing-tools', 'content-creation', 'ai-writing', 'productivity'],
      publishedAt: '2024-01-18',
      readTime: 12,
      image: '/images/blog/ai-writing-tools.jpg',
      type: 'blog',
      priority: 9,
      keywords: ['best ai writing tools', 'ai content creation', 'writing assistant comparison']
    },
    // AI Coding Tools
    {
      title: 'GitHub Copilot: AI-Powered Code Completion',
      slug: 'github-copilot',
      excerpt: 'Accelerate your coding with AI-powered suggestions and auto-completion.',
      category: 'coding-tools',
      tags: ['github-copilot', 'coding', 'ai-assistant', 'programming'],
      publishedAt: '2024-01-14',
      readTime: 6,
      image: '/images/tools/github-copilot.jpg',
      type: 'tool',
      priority: 9,
      keywords: ['github copilot', 'ai coding assistant', 'code completion', 'programming ai']
    },
    {
      title: 'How to Use AI for Code Review and Bug Detection',
      slug: 'ai-code-review-bug-detection',
      excerpt: 'Learn how AI tools can improve your code quality and catch bugs before deployment.',
      category: 'coding-tools',
      tags: ['code-review', 'bug-detection', 'ai-coding', 'quality-assurance'],
      publishedAt: '2024-01-22',
      readTime: 10,
      image: '/images/blog/ai-code-review.jpg',
      type: 'guide',
      priority: 7,
      keywords: ['ai code review', 'bug detection ai', 'code quality tools', 'automated testing']
    }
  ], []);

  // Calculate content relevance using semantic matching
  const calculateRelevance = (item: ContentItem): number => {
    let score = 0;

    // Category match (highest weight)
    if (item.category === currentContent.category) score += 40;

    // Tag overlap
    const tagOverlap = item.tags.filter(tag => 
      currentContent.tags.some(currentTag => 
        currentTag.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(currentTag.toLowerCase())
      )
    ).length;
    score += tagOverlap * 15;

    // Keyword semantic matching
    const keywordOverlap = item.keywords.filter(keyword =>
      currentContent.keywords.some(currentKeyword =>
        currentKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(currentKeyword.toLowerCase())
      )
    ).length;
    score += keywordOverlap * 10;

    // Content type preference (tools get higher priority for blog posts)
    if (currentContent.type === 'blog' && item.type === 'tool') score += 20;
    if (currentContent.type === 'tool' && item.type === 'blog') score += 15;

    // Recency bonus
    const publishDate = new Date(item.publishedAt);
    const daysSincePublish = (Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePublish <= 30) score += 10;
    else if (daysSincePublish <= 90) score += 5;

    // Priority score
    score += item.priority;

    return score;
  };

  // Get related content sorted by relevance
  const relatedContent = useMemo(() => {
    return allContent
      .map(item => ({
        ...item,
        relevanceScore: calculateRelevance(item)
      }))
      .filter(item => item.relevanceScore > 20) // Minimum relevance threshold
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxItems);
  }, [currentContent, maxItems, allContent]);

  // Track related content clicks
  const handleRelatedClick = (item: ContentItem) => {
    const targetUrl = item.type === 'tool' ? `/ai-tools/${item.slug}` : `/blog/${item.slug}`;
    
    linkPerformanceTracker.trackLinkClick(
      currentUrl,
      targetUrl,
      item.title,
      'related',
      {
        timeOnSourcePage: performance.now(),
        scrollDepth: window.scrollY / document.body.scrollHeight,
        deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop',
        userAgent: navigator.userAgent
      }
    );
  };

  // Generate structured data for related content
  const generateStructuredData = () => {
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Related Content",
      "numberOfItems": relatedContent.length,
      "itemListElement": relatedContent.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": item.type === 'tool' ? "SoftwareApplication" : "Article",
          "name": item.title,
          "description": item.excerpt,
          "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-tools-list.com'}${
            item.type === 'tool' ? `/ai-tools/${item.slug}` : `/blog/${item.slug}`
          }`,
          "datePublished": item.publishedAt,
          "keywords": item.keywords.join(', '),
          "category": item.category
        }
      }))
    };

    return JSON.stringify(itemList);
  };

  if (relatedContent.length === 0) return null;

  const containerClasses = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    list: 'space-y-4',
    compact: 'space-y-3'
  };

  const itemClasses = {
    grid: 'bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300',
    list: 'bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4',
    compact: 'border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0'
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateStructuredData() }}
      />

      <section className="mt-12" aria-labelledby="related-content-heading">
        <div className="flex items-center justify-between mb-6">
          <h2 
            id="related-content-heading"
            className="text-2xl font-bold text-gray-900 dark:text-gray-100"
          >
            {currentContent.type === 'tool' ? 'Related AI Tools & Guides' : 'You Might Also Like'}
          </h2>
          
          {context !== 'sidebar' && (
            <Link
              href={currentContent.type === 'tool' ? '/ai-tools' : '/blog'}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center group"
            >
              View All
              <ArrowRightIcon className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          )}
        </div>

        <div className={containerClasses[layout]}>
          {relatedContent.map((item, index) => {
            const targetUrl = item.type === 'tool' ? `/ai-tools/${item.slug}` : `/blog/${item.slug}`;
            
            return (
              <article key={item.slug} className={itemClasses[layout]}>
                <Link
                  href={targetUrl}
                  onClick={() => handleRelatedClick(item)}
                  className="block group"
                >
                  {/* Image */}
                  {showImages && item.image && layout !== 'compact' && (
                    <div className="relative h-48 mb-4 overflow-hidden rounded-t-lg">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      
                      {/* Content Type Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.type === 'tool' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : item.type === 'blog'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        }`}>
                          {item.type === 'tool' ? 'Tool' : item.type === 'blog' ? 'Article' : 'Guide'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className={layout === 'grid' ? 'p-4' : ''}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                      {item.excerpt}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {item.readTime} min read
                        </div>
                        
                        <div className="flex items-center">
                          <TagIcon className="h-4 w-4 mr-1" />
                          {item.category.replace('-', ' ')}
                        </div>
                      </div>

                      {/* Priority indicator for high-value content */}
                      {item.priority >= 9 && (
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {layout !== 'compact' && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {/* Call-to-Action for more content */}
        {context === 'inline' && relatedContent.length >= maxItems && (
          <div className="text-center mt-8">
            <Link
              href={currentContent.type === 'tool' ? '/ai-tools' : '/blog'}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Explore More {currentContent.type === 'tool' ? 'AI Tools' : 'Articles'}
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>
        )}
      </section>
    </>
  );
}

/**
 * Specialized related content components for different contexts
 */

// For tool pages - emphasize related tools and guides
export function ToolRelatedContent({ toolData, currentUrl }: {
  toolData: {
    name: string;
    category: string;
    tags: string[];
    description: string;
  };
  currentUrl: string;
}) {
  const currentContent = {
    title: toolData.name,
    category: toolData.category,
    tags: toolData.tags,
    keywords: [toolData.name, toolData.category, ...toolData.tags],
    type: 'tool' as const
  };

  return (
    <SEORelatedContent
      currentContent={currentContent}
      currentUrl={currentUrl}
      maxItems={6}
      showImages={true}
      layout="grid"
      context="inline"
    />
  );
}

// For blog pages - emphasize related articles and tools
export function BlogRelatedContent({ postData, currentUrl }: {
  postData: {
    title: string;
    category: string;
    tags: string[];
    excerpt: string;
  };
  currentUrl: string;
}) {
  const currentContent = {
    title: postData.title,
    category: postData.category,
    tags: postData.tags,
    keywords: [postData.title, postData.category, ...postData.tags],
    type: 'blog' as const
  };

  return (
    <SEORelatedContent
      currentContent={currentContent}
      currentUrl={currentUrl}
      maxItems={4}
      showImages={true}
      layout="grid"
      context="inline"
    />
  );
}

// Compact sidebar version
export function SidebarRelatedContent({ currentContent, currentUrl }: {
  currentContent: SEORelatedContentProps['currentContent'];
  currentUrl: string;
}) {
  return (
    <SEORelatedContent
      currentContent={currentContent}
      currentUrl={currentUrl}
      maxItems={5}
      showImages={false}
      layout="compact"
      context="sidebar"
    />
  );
}