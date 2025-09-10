// Advanced Service Worker with comprehensive caching strategies
const CACHE_NAME = 'ai-tools-list-v3.0'
const STATIC_CACHE = 'static-v3.0'
const DYNAMIC_CACHE = 'dynamic-v3.0'
const IMAGE_CACHE = 'images-v3.0'
const API_CACHE = 'api-v3.0'
const FONTS_CACHE = 'fonts-v3.0'

// Cache configuration
const cacheConfig = {
  static: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxEntries: 100
  },
  images: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxEntries: 200
  },
  api: {
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxEntries: 50
  },
  fonts: {
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    maxEntries: 20
  }
}

// Critical resources to cache immediately
const criticalResources = [
  '/',
  '/ai-tools',
  '/blog',
  '/manifest.json',
  '/offline.html',
  '/logo.svg',
  '/hero-bg.webp'
]

// Install event - aggressive caching of critical resources
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker with advanced caching...')
  
  event.waitUntil(
    Promise.all([
      // Cache critical static resources
      caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll(criticalResources)
      }),
      
      // Pre-cache critical images
      caches.open(IMAGE_CACHE).then(cache => {
        return cache.addAll([
          '/logo.svg',
          '/hero-bg.webp',
          '/og-default.jpg',
          '/placeholder.jpg'
        ])
      }),
      
      // Pre-cache fonts
      caches.open(FONTS_CACHE).then(cache => {
        return cache.addAll([
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        ])
      })
    ]).then(() => {
      console.log('[SW] Critical resources cached successfully')
      return self.skipWaiting()
    })
  )
})

// Activate event - clean old caches and claim clients
self.addEventListener('activate', event => {
  console.log('[SW] Activating new service worker...')
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      const deletePromises = cacheNames
        .filter(name => !name.includes('v3.0'))
        .map(name => {
          console.log('[SW] Deleting old cache:', name)
          return caches.delete(name)
        })
      
      return Promise.all(deletePromises)
    }).then(() => {
      console.log('[SW] Service worker activated and claiming clients')
      return self.clients.claim()
    })
  )
})

// Fetch event - advanced request handling with multiple strategies
self.addEventListener('fetch', event => {
  const request = event.request
  const url = new URL(request.url)
  
  // Skip non-GET requests and browser extensions
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return
  }
  
  // Route requests to appropriate handlers
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request))
  } else if (isFontRequest(request)) {
    event.respondWith(handleFontRequest(request))
  } else if (isPageRequest(request)) {
    event.respondWith(handlePageRequest(request))
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request))
  } else {
    event.respondWith(handleGenericRequest(request))
  }
})

// API requests - Network first with intelligent caching
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE)
  
  try {
    // Try network first
    const response = await fetch(request, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
    
    if (response.ok && response.status < 400) {
      // Cache successful responses
      const responseClone = response.clone()
      await cleanupCache(cache, cacheConfig.api.maxEntries)
      cache.put(request, responseClone)
      
      console.log('[SW] API response cached:', request.url)
    }
    
    return response
  } catch (error) {
    console.log('[SW] API request failed, trying cache:', error)
    
    // Fallback to cache
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      // Add stale indicator
      const headers = new Headers(cachedResponse.headers)
      headers.append('X-SW-Cache', 'stale')
      
      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers: headers
      })
    }
    
    // Return offline fallback
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'This request failed and no cached data is available'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Image requests - Cache first with background updates
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    // Serve from cache immediately
    console.log('[SW] Image served from cache:', request.url)
    
    // Background update for fresh content
    fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone())
        console.log('[SW] Image cache updated in background:', request.url)
      }
    }).catch(() => {
      // Ignore background update failures
    })
    
    return cachedResponse
  }
  
  // Not in cache, fetch from network
  try {
    const response = await fetch(request)
    
    if (response.ok) {
      await cleanupCache(cache, cacheConfig.images.maxEntries)
      cache.put(request, response.clone())
      console.log('[SW] New image cached:', request.url)
    }
    
    return response
  } catch (error) {
    console.log('[SW] Image request failed:', error)
    
    // Return placeholder image
    const placeholderResponse = await cache.match('/placeholder.jpg')
    return placeholderResponse || new Response('', { status: 404 })
  }
}

// Font requests - Cache first, network fallback (fonts rarely change)
async function handleFontRequest(request) {
  const cache = await caches.open(FONTS_CACHE)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    return new Response('', { status: 404 })
  }
}

// Page requests - Stale while revalidate with offline fallback
async function handlePageRequest(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cachedResponse = await cache.match(request)
  
  // Start fetch in background
  const fetchPromise = fetch(request).then(response => {
    if (response.ok && response.status < 400) {
      cache.put(request, response.clone())
      console.log('[SW] Page updated in cache:', request.url)
    }
    return response
  }).catch(() => {
    // Return cached version on network failure
    return cachedResponse
  })
  
  // Return cached version immediately if available
  if (cachedResponse) {
    console.log('[SW] Page served from cache:', request.url)
    return cachedResponse
  }
  
  // Wait for network if no cache
  try {
    return await fetchPromise
  } catch (error) {
    // Return offline page
    const offlinePage = await cache.match('/offline.html')
    return offlinePage || new Response('Offline', { status: 503 })
  }
}

// Static assets - Cache first (CSS, JS, etc.)
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    return new Response('', { status: 404 })
  }
}

// Generic request handler
async function handleGenericRequest(request) {
  try {
    return await fetch(request)
  } catch (error) {
    const cache = await caches.open(STATIC_CACHE)
    const cachedResponse = await cache.match(request)
    return cachedResponse || new Response('', { status: 404 })
  }
}

// Helper functions
function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|webp|avif|gif|svg|ico)(\?.*)?$/i.test(request.url)
}

function isFontRequest(request) {
  return request.destination === 'font' ||
         /\.(woff|woff2|ttf|eot)(\?.*)?$/i.test(request.url) ||
         request.url.includes('fonts.googleapis.com') ||
         request.url.includes('fonts.gstatic.com')
}

function isPageRequest(request) {
  return request.mode === 'navigate' || 
         request.destination === 'document' ||
         (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'))
}

function isStaticAsset(request) {
  return /\.(css|js|json|xml|txt)(\?.*)?$/i.test(request.url) ||
         request.url.includes('/_next/static/')
}

// Cache cleanup utility
async function cleanupCache(cache, maxEntries) {
  const keys = await cache.keys()
  if (keys.length >= maxEntries) {
    // Remove oldest entries (FIFO)
    const entriesToDelete = keys.slice(0, keys.length - maxEntries + 1)
    await Promise.all(entriesToDelete.map(key => cache.delete(key)))
    console.log(`[SW] Cleaned up ${entriesToDelete.length} cache entries`)
  }
}

// Background sync for failed requests
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync())
  }
})

async function handleBackgroundSync() {
  console.log('[SW] Performing background sync...')
  // Implement background sync logic here
  // This could include retrying failed API requests, updating cache, etc.
}

// Push notifications (if needed in future)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/logo-192.png',
      badge: '/badge-72.png',
      data: data.url,
      actions: [
        {
          action: 'open',
          title: 'Open',
          icon: '/icon-open.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icon-close.png'
        }
      ]
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close()
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    )
  }
})

console.log('[SW] Advanced service worker loaded and ready')