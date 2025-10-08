'use client'

import { useEffect } from 'react'

export default function MonetagScript() {
  useEffect(() => {
    // Check if script is already loaded
    if (document.querySelector('script[data-monetag="true"]')) {
      return
    }

    // Create and append the Monetag script
    const script = document.createElement('script')
    script.setAttribute('data-cfasync', 'false')
    script.setAttribute('data-monetag', 'true')
    script.type = 'text/javascript'
    script.src = '//dd133.com/400/10013123'
    script.async = true
    
    // Add error handling
    script.onerror = () => {
      console.warn('Monetag script failed to load')
    }
    
    script.onload = () => {
      console.log('Monetag script loaded successfully')
    }
    
    document.head.appendChild(script)

    // Cleanup function
    return () => {
      const existingScript = document.querySelector('script[data-monetag="true"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  return null
}