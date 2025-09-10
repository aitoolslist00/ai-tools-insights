'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'

interface AdvancedImageOptimizerProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  fill?: boolean
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: () => void
}

export default function AdvancedImageOptimizer({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  quality = 90,
  placeholder = 'blur',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  style,
  onLoad,
  onError
}: AdvancedImageOptimizerProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '100px 0px',
        threshold: 0.1
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority, isInView])

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setHasError(true)
    onError?.()
  }, [onError])

  // Generate optimized blur data URL if not provided
  const generateBlurDataURL = useCallback((originalSrc: string) => {
    if (blurDataURL) return blurDataURL
    
    // Create a simple blur data URL
    const canvas = document.createElement('canvas')
    canvas.width = 10
    canvas.height = 10
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(0, 0, 10, 10)
      return canvas.toDataURL()
    }
    
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7Dh5vtAgAIbv8Al1Vt1qKvU3++hKsHjlq5/rNp2v5kpN3gowWEzXTJp7pn+l6mGgBG/tQBhkD89/t7yfvZiDJ3kFBWqzqnFEa6QcnSKgCg3x4l1EAArCtdYtJwABqRGhX3xPE5+zrwGfVU5v4TM7uJKjy0UzKBdNuPWtpzqCFM/8A'
  }, [blurDataURL])

  // Optimized image loading with WebP/AVIF support
  const getOptimizedSrc = useCallback((originalSrc: string) => {
    if (originalSrc.startsWith('data:') || originalSrc.startsWith('blob:')) {
      return originalSrc
    }

    // Check for WebP/AVIF support
    const supportsWebP = typeof window !== 'undefined' && 
      window.HTMLCanvasElement?.prototype?.toDataURL?.call(
        document.createElement('canvas'), 'image/webp'
      )?.indexOf('webp') !== -1

    const supportsAVIF = typeof window !== 'undefined' &&
      window.HTMLCanvasElement?.prototype?.toDataURL?.call(
        document.createElement('canvas'), 'image/avif'
      )?.indexOf('avif') !== -1

    // Return appropriate format
    if (supportsAVIF && !originalSrc.includes('.svg')) {
      return originalSrc + '?format=avif'
    } else if (supportsWebP && !originalSrc.includes('.svg')) {
      return originalSrc + '?format=webp'
    }

    return originalSrc
  }, [])

  if (hasError) {
    return (
      <div 
        ref={imgRef}
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{
          width: width || '100%',
          height: height || 'auto',
          ...style
        }}
      >
        <svg 
          className="w-12 h-12 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </div>
    )
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {(isInView || priority) && (
        <>
          {/* Loading skeleton */}
          {!isLoaded && (
            <div 
              className="absolute inset-0 bg-gray-200 animate-pulse"
              style={{
                aspectRatio: width && height ? `${width} / ${height}` : undefined
              }}
            />
          )}
          
          {/* Optimized Image */}
          <Image
            src={getOptimizedSrc(src)}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            priority={priority}
            quality={quality}
            sizes={sizes}
            placeholder={placeholder}
            blurDataURL={generateBlurDataURL(src)}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </>
      )}
      
      {/* Preload hint for browsers */}
      {priority && (
        <link
          rel="preload"
          as="image"
          href={getOptimizedSrc(src)}
          imageSrcSet={`${getOptimizedSrc(src)} 1x, ${getOptimizedSrc(src)}?dpr=2 2x`}
        />
      )}
    </div>
  )
}