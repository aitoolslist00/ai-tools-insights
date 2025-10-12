'use client'

import { ReactNode } from 'react'

interface SemanticStructureProps {
  children: ReactNode
  className?: string
}

// Enhanced semantic HTML components for better AI understanding and SEO
export const MainContent = ({ children, className = '' }: SemanticStructureProps) => (
  <main className={className} role="main" aria-label="Main content">
    {children}
  </main>
)

export const ContentSection = ({ children, className = '', title }: SemanticStructureProps & { title?: string }) => (
  <section className={className} aria-label={title}>
    {children}
  </section>
)

export const ContentArticle = ({ children, className = '' }: SemanticStructureProps) => (
  <article className={className} itemScope itemType="https://schema.org/Article">
    {children}
  </article>
)

export const NavigationAside = ({ children, className = '', label }: SemanticStructureProps & { label: string }) => (
  <aside className={className} role="complementary" aria-label={label}>
    {children}
  </aside>
)

export const StructuredList = ({ children, className = '', label }: SemanticStructureProps & { label?: string }) => (
  <ul className={className} role="list" aria-label={label}>
    {children}
  </ul>
)

export const StructuredListItem = ({ children, className = '' }: SemanticStructureProps) => (
  <li className={className} role="listitem">
    {children}
  </li>
)

export const SemanticHeader = ({ children, className = '', level = 1 }: SemanticStructureProps & { level?: 1 | 2 | 3 | 4 | 5 | 6 }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements
  return (
    <Tag className={className} itemProp="headline">
      {children}
    </Tag>
  )
}

export const StructuredData = ({ children, className = '', type }: SemanticStructureProps & { type: string }) => (
  <div className={className} itemScope itemType={`https://schema.org/${type}`}>
    {children}
  </div>
)

export const ContentDescription = ({ children, className = '' }: SemanticStructureProps) => (
  <p className={className} itemProp="description">
    {children}
  </p>
)

export const MetaData = ({ property, content }: { property: string; content: string }) => (
  <meta itemProp={property} content={content} />
)

// Enhanced navigation component with proper semantic structure
export const SemanticNavigation = ({ children, className = '', label }: SemanticStructureProps & { label: string }) => (
  <nav className={className} role="navigation" aria-label={label}>
    {children}
  </nav>
)

// Enhanced form component with proper semantic structure
export const SemanticForm = ({ children, className = '', onSubmit, label }: SemanticStructureProps & { 
  onSubmit: (e: React.FormEvent) => void
  label: string 
}) => (
  <form className={className} onSubmit={onSubmit} role="search" aria-label={label}>
    {children}
  </form>
)

// Enhanced button component with proper accessibility
export const SemanticButton = ({ 
  children, 
  className = '', 
  onClick, 
  type = 'button',
  ariaLabel 
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  ariaLabel?: string
}) => (
  <button 
    className={className} 
    onClick={onClick} 
    type={type}
    aria-label={ariaLabel}
  >
    {children}
  </button>
)

// Enhanced image component with proper semantic structure
export const SemanticImage = ({ 
  src, 
  alt, 
  className = '',
  width,
  height,
  itemProp
}: {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  itemProp?: string
}) => (
  <img 
    src={src} 
    alt={alt} 
    className={className}
    width={width}
    height={height}
    itemProp={itemProp}
    loading="lazy"
  />
)

// Enhanced link component with proper semantic structure
export const SemanticLink = ({ 
  href, 
  children, 
  className = '',
  ariaLabel,
  itemProp
}: {
  href: string
  children: ReactNode
  className?: string
  ariaLabel?: string
  itemProp?: string
}) => (
  <a 
    href={href} 
    className={className}
    aria-label={ariaLabel}
    itemProp={itemProp}
  >
    {children}
  </a>
)