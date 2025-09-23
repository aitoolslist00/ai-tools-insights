'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  name: string
  href: string
  current?: boolean
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function BreadcrumbNavigation({ items, className = '' }: BreadcrumbNavigationProps) {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {/* Home breadcrumb */}
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </li>

        {/* Dynamic breadcrumbs */}
        {items.map((item, index) => (
          <li key={item.href} className="inline-flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            {item.current ? (
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Utility function to generate breadcrumbs from pathname
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  paths.forEach((path, index) => {
    const href = '/' + paths.slice(0, index + 1).join('/')
    const isLast = index === paths.length - 1
    
    // Format the name
    let name = path.replace(/-/g, ' ')
    name = name.charAt(0).toUpperCase() + name.slice(1)
    
    // Special cases for better naming
    if (path === 'ai-tools') {
      name = 'AI Tools'
    } else if (path === 'blog') {
      name = 'Blog'
    }

    breadcrumbs.push({
      name,
      href,
      current: isLast
    })
  })

  return breadcrumbs
}