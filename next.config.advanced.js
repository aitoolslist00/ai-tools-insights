/** @type {import('next').NextConfig} */
const nextConfig = {
  // Advanced SSG optimizations for maximum performance
  output: 'standalone',
  trailingSlash: false,
  generateEtags: true,
  
  // Advanced image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.aitoolslist.com',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    loader: 'default',
    path: '/_next/image/',
    domains: [],
    loaderFile: '',
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
  
  // Advanced compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
    styledComponents: false,
    emotion: false,
  },
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Advanced experimental features
  experimental: {
    // Performance optimizations
    optimizePackageImports: [
      'lucide-react', 
      '@headlessui/react', 
      'framer-motion',
      'clsx',
      'tailwind-merge'
    ],
    webVitalsAttribution: ['CLS', 'LCP', 'FID', 'FCP', 'TTFB'],
    optimisticClientCache: true,
    scrollRestoration: true,
    
    // Advanced caching
    incrementalCacheHandlerPath: require.resolve('./lib/cache-handler.js'),
    
    // Bundle optimization
    bundlePagesRouterDependencies: true,
    
    // Memory optimization
    memoryBasedWorkersCount: true,
    
    // Advanced build features
    cpus: Math.max(1, require('os').cpus().length - 1),
    
    // ISR optimization
    isrMemoryCacheSize: 0, // Use disk cache for better memory management
    
    // Advanced middleware
    middlewarePrefetch: 'strict',
    
    // Font optimization
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'] } },
    ],
  },
  
  // Advanced webpack configuration
  webpack: (config, { dev, isServer, webpack }) => {
    // Optimize bundle size and performance
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              enforce: true,
              priority: 20,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
              priority: 10,
            },
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              enforce: true,
              priority: 30,
            },
            ui: {
              test: /[\\/]node_modules[\\/](@headlessui|lucide-react|framer-motion)[\\/]/,
              name: 'ui',
              chunks: 'all',
              enforce: true,
              priority: 25,
            }
          },
        },
        usedExports: true,
        sideEffects: false,
      }

      // Add Bundle Analyzer
      if (process.env.ANALYZE === 'true') {
        const BundleAnalyzerPlugin = require('@next/bundle-analyzer')()
        config.plugins.push(BundleAnalyzerPlugin)
      }
    }
    
    // Add custom optimizations
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
        'process.env.BUILD_VERSION': JSON.stringify(require('./package.json').version),
      })
    )
    
    // Optimize imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    }
    
    // Add performance hints
    config.performance = {
      hints: 'warning',
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    }
    
    return config
  },
  
  // Advanced headers for performance and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          // Performance headers
          {
            key: 'Accept-CH',
            value: 'DPR, Width, Viewport-Width, Save-Data'
          },
          {
            key: 'Critical-CH',
            value: 'Save-Data'
          }
        ]
      },
      // Static assets with aggressive caching
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      },
      // Next.js static assets
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // Images with optimized caching
      {
        source: '/(.*)\\.(jpg|jpeg|png|webp|avif|gif|svg|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          {
            key: 'Vary',
            value: 'Accept'
          }
        ]
      },
      // API routes with shorter cache
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=86400'
          },
          {
            key: 'Content-Type',
            value: 'application/json'
          }
        ]
      },
      // SEO files
      {
        source: '/(sitemap|robots)\\.(.*)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600'
          }
        ]
      },
      // Fonts
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          }
        ]
      }
    ]
  },

  // Advanced redirects for SEO
  async redirects() {
    return [
      // Legacy redirects
      {
        source: '/tools/:path*',
        destination: '/ai-tools/:path*',
        permanent: true,
      },
      {
        source: '/articles/:path*',
        destination: '/blog/:path*',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      // Category redirects
      {
        source: '/category/:slug*',
        destination: '/ai-tools?category=:slug*',
        permanent: true,
      },
      // Search redirects
      {
        source: '/find/:query*',
        destination: '/search?q=:query*',
        permanent: true,
      }
    ]
  },

  // Rewrites for better URLs
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: '/api/:path*',
      }
    ]
  },
}

module.exports = nextConfig