'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerSW = async () => {
        try {
          // Unregister old service worker first
          const registrations = await navigator.serviceWorker.getRegistrations()
          await Promise.all(registrations.map(reg => reg.unregister()))
          
          // Register new advanced service worker
          const registration = await navigator.serviceWorker.register('/sw-advanced.js', {
            scope: '/',
            updateViaCache: 'none'
          })
          
          console.log('Advanced SW registered successfully:', registration.scope)
          
          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'activated') {
                  console.log('New service worker activated')
                  // Optionally show update notification to user
                  if (confirm('A new version is available. Reload to update?')) {
                    window.location.reload()
                  }
                }
              })
            }
          })
          
          // Handle controlled state
          if (registration.active && !navigator.serviceWorker.controller) {
            console.log('Service worker is active but not controlling the page')
          }
          
        } catch (error) {
          console.error('Service Worker registration failed:', error)
        }
      }
      
      // Only register in production to avoid development issues
      if (process.env.NODE_ENV === 'production') {
        registerSW()
      } else {
        console.log('Service Worker registration skipped in development')
      }
      
      // Listen for service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Message from SW:', event.data)
        
        if (event.data.type === 'CACHE_UPDATED') {
          console.log('Cache updated for:', event.data.url)
        }
      })
    }
  }, [])

  return null
}