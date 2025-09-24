/**
 * SEO-Optimized Navigation Component
 * Implements Google's latest navigation best practices for 2024
 * Includes strategic internal linking and performance tracking
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { linkPerformanceTracker } from '@/lib/seo-link-performance-tracker';
import InternalLinkStrategy from '@/lib/internal-link-strategy';

interface NavigationItem {
  label: string;
  href: string;
  description?: string;
  children?: NavigationItem[];
  priority: 'high' | 'medium' | 'low';
  keywords: string[];
}

export default function SEOOptimizedNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  // Strategy is now handled within the component

  // Strategic navigation structure based on SEO priorities
  const navigationItems: NavigationItem[] = [
    {
      label: 'AI Tools',
      href: '/ai-tools',
      description: 'Discover the best AI tools for every need',
      priority: 'high',
      keywords: ['ai tools', 'artificial intelligence', 'ai software'],
      children: [
        {
          label: 'Image Generators',
          href: '/ai-tools?category=image-generators',
          description: 'AI-powered image creation tools',
          priority: 'high',
          keywords: ['ai image generator', 'ai art', 'image creation']
        },
        {
          label: 'Writing Tools',
          href: '/ai-tools?category=writing-tools',
          description: 'AI writing assistants and content creators',
          priority: 'high',
          keywords: ['ai writing', 'content creation', 'writing assistant']
        },
        {
          label: 'Coding Tools',
          href: '/ai-tools?category=coding-tools',
          description: 'AI-powered development and coding assistance',
          priority: 'high',
          keywords: ['ai coding', 'code assistant', 'programming ai']
        },
        {
          label: 'Video Tools',
          href: '/ai-tools?category=video-tools',
          description: 'AI video editing and creation platforms',
          priority: 'medium',
          keywords: ['ai video', 'video editing', 'video creation']
        },
        {
          label: 'Research Tools',
          href: '/ai-tools?category=research-tools',
          description: 'AI-powered research and analysis tools',
          priority: 'medium',
          keywords: ['ai research', 'data analysis', 'research assistant']
        }
      ]
    },
    {
      label: 'Blog',
      href: '/blog',
      description: 'Latest AI news, tutorials, and insights',
      priority: 'high',
      keywords: ['ai blog', 'ai news', 'ai tutorials'],
      children: [
        {
          label: 'AI Tutorials',
          href: '/blog?category=tutorials',
          description: 'Step-by-step AI tool guides',
          priority: 'high',
          keywords: ['ai tutorials', 'how to use ai', 'ai guides']
        },
        {
          label: 'AI News',
          href: '/blog?category=news',
          description: 'Latest AI industry updates',
          priority: 'medium',
          keywords: ['ai news', 'artificial intelligence news', 'ai updates']
        },
        {
          label: 'Tool Reviews',
          href: '/blog?category=reviews',
          description: 'In-depth AI tool reviews and comparisons',
          priority: 'high',
          keywords: ['ai tool reviews', 'ai comparisons', 'tool analysis']
        }
      ]
    },
    {
      label: 'Categories',
      href: '/categories',
      description: 'Browse AI tools by category',
      priority: 'medium',
      keywords: ['ai categories', 'tool categories', 'ai types']
    },
    {
      label: 'About',
      href: '/about',
      description: 'Learn about our AI tools directory',
      priority: 'low',
      keywords: ['about us', 'ai tools directory', 'our mission']
    }
  ];

  // Track navigation clicks for SEO analytics
  const handleNavClick = (item: NavigationItem, isDropdown = false) => {
    linkPerformanceTracker.trackLinkClick(
      pathname,
      item.href,
      item.label,
      'navigation',
      {
        timeOnSourcePage: performance.now(),
        scrollDepth: window.scrollY / document.body.scrollHeight,
        deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop',
        userAgent: navigator.userAgent
      }
    );

    // Close mobile menu and dropdowns
    setIsOpen(false);
    setActiveDropdown(null);
  };

  // Handle dropdown toggle
  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Generate structured data for navigation
  const generateNavigationStructuredData = () => {
    const siteNavigationElement = {
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      "name": "Main Navigation",
      "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-tools-list.com',
      "hasPart": navigationItems.map(item => ({
        "@type": "WebPage",
        "name": item.label,
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-tools-list.com'}${item.href}`,
        "description": item.description,
        "keywords": item.keywords.join(', ')
      }))
    };

    return JSON.stringify(siteNavigationElement);
  };

  return (
    <>
      {/* JSON-LD Structured Data for Navigation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateNavigationStructuredData() }}
      />

      <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="flex-shrink-0 flex items-center"
                onClick={() => handleNavClick({ label: 'Home', href: '/', priority: 'high', keywords: ['home', 'ai tools directory'] })}
              >
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  AI Tools List
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <div key={item.label} className="relative">
                  {item.children ? (
                    // Dropdown Menu
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(item.label);
                        }}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                          pathname.startsWith(item.href)
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        aria-expanded={activeDropdown === item.label}
                        aria-haspopup="true"
                      >
                        {item.label}
                        <ChevronDownIcon 
                          className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                            activeDropdown === item.label ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Dropdown Content */}
                      {activeDropdown === item.label && (
                        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                          <Link
                            href={item.href}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                            onClick={() => handleNavClick(item, true)}
                          >
                            <div className="font-medium">All {item.label}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {item.description}
                            </div>
                          </Link>
                          <hr className="my-2 border-gray-200 dark:border-gray-700" />
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                              onClick={() => handleNavClick(child, true)}
                            >
                              <div className="font-medium">{child.label}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {child.description}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Regular Link
                    <Link
                      href={item.href}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        pathname === item.href
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => handleNavClick(item)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded={isOpen}
                aria-label="Toggle navigation menu"
              >
                {isOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                      pathname === item.href
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => handleNavClick(item)}
                  >
                    {item.label}
                  </Link>
                  
                  {/* Mobile Submenu */}
                  {item.children && (
                    <div className="ml-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                          onClick={() => handleNavClick(child)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}