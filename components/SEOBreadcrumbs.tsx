/**
 * SEO-Optimized Breadcrumbs Component
 * Implements Google's structured data requirements and internal linking best practices
 * Updated for 2024 SEO standards including JSON-LD schema markup
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { linkPerformanceTracker } from '@/lib/seo-link-performance-tracker';

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage?: boolean;
}

interface SEOBreadcrumbsProps {
  items: BreadcrumbItem[];
  currentUrl: string;
  className?: string;
}

export default function SEOBreadcrumbs({ items, currentUrl, className = '' }: SEOBreadcrumbsProps) {
  // Generate JSON-LD structured data for Google
  const generateStructuredData = () => {
    const breadcrumbList = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        "item": item.href === '/' ? process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-tools-list.com' : 
               `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-tools-list.com'}${item.href}`
      }))
    };

    return JSON.stringify(breadcrumbList);
  };

  // Track breadcrumb clicks for SEO analytics
  const handleBreadcrumbClick = (targetUrl: string, label: string) => {
    linkPerformanceTracker.trackLinkClick(
      currentUrl,
      targetUrl,
      label,
      'breadcrumb',
      {
        timeOnSourcePage: performance.now(),
        scrollDepth: 0, // Breadcrumbs are typically at top
        deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop',
        userAgent: navigator.userAgent
      }
    );
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateStructuredData() }}
      />
      
      {/* Breadcrumb Navigation */}
      <nav 
        aria-label="Breadcrumb navigation"
        className={`flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 ${className}`}
        role="navigation"
      >
        <ol className="flex items-center space-x-2" itemScope itemType="https://schema.org/BreadcrumbList">
          {items.map((item, index) => (
            <li 
              key={item.href}
              className="flex items-center"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {/* Add separator except for first item */}
              {index > 0 && (
                <ChevronRightIcon 
                  className="h-4 w-4 text-gray-400 mx-2 flex-shrink-0" 
                  aria-hidden="true"
                />
              )}
              
              {/* Breadcrumb Item */}
              {item.isCurrentPage ? (
                <span 
                  className="font-medium text-gray-900 dark:text-gray-100"
                  aria-current="page"
                  itemProp="name"
                >
                  {index === 0 && <HomeIcon className="h-4 w-4 inline mr-1" aria-hidden="true" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center"
                  onClick={() => handleBreadcrumbClick(item.href, item.label)}
                  itemProp="item"
                >
                  {index === 0 && <HomeIcon className="h-4 w-4 inline mr-1" aria-hidden="true" />}
                  <span itemProp="name">{item.label}</span>
                </Link>
              )}
              
              {/* Schema.org position */}
              <meta itemProp="position" content={(index + 1).toString()} />
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/**
 * Hook to generate breadcrumbs based on current path
 * Automatically creates SEO-optimized breadcrumb structure
 */
export function useBreadcrumbs(pathname: string, customItems?: BreadcrumbItem[]): BreadcrumbItem[] {
  if (customItems) return customItems;

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' }
  ];

  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Generate human-readable labels
    let label = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Special cases for better SEO labels
    if (segment === 'ai-tools') {
      label = 'AI Tools';
    } else if (segment === 'blog') {
      label = 'Blog';
    } else if (pathname.includes('/ai-tools/') && index === segments.length - 1) {
      // For individual tool pages, use the tool name
      label = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    breadcrumbs.push({
      label,
      href: currentPath,
      isCurrentPage: isLast
    });
  });

  return breadcrumbs;
}

/**
 * Specialized breadcrumbs for different page types
 */

// For AI Tool pages
export function ToolPageBreadcrumbs({ toolSlug, toolName, category, currentUrl }: {
  toolSlug: string;
  toolName: string;
  category: string;
  currentUrl: string;
}) {
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'AI Tools', href: '/ai-tools' },
    { label: `${category} Tools`, href: `/ai-tools?category=${category.toLowerCase().replace(/\s+/g, '-')}` },
    { label: toolName, href: `/ai-tools/${toolSlug}`, isCurrentPage: true }
  ];

  return <SEOBreadcrumbs items={items} currentUrl={currentUrl} />;
}

// For Blog pages
export function BlogPageBreadcrumbs({ postSlug, postTitle, currentUrl }: {
  postSlug: string;
  postTitle: string;
  currentUrl: string;
}) {
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: postTitle, href: `/blog/${postSlug}`, isCurrentPage: true }
  ];

  return <SEOBreadcrumbs items={items} currentUrl={currentUrl} />;
}

// For Category pages
export function CategoryPageBreadcrumbs({ category, currentUrl }: {
  category: string;
  currentUrl: string;
}) {
  const categoryName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'AI Tools', href: '/ai-tools' },
    { label: `${categoryName} Tools`, href: `/ai-tools?category=${category}`, isCurrentPage: true }
  ];

  return <SEOBreadcrumbs items={items} currentUrl={currentUrl} />;
}