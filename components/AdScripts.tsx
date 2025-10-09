'use client'

import { useEffect, useState } from 'react'

interface AdScript {
  id: string
  name: string
  code: string
  active: boolean
  position: 'head' | 'body-start' | 'body-end'
  createdAt: string
  updatedAt: string
}

interface GroupedAdScripts {
  head: AdScript[]
  'body-start': AdScript[]
  'body-end': AdScript[]
}

export default function AdScripts() {
  const [adScripts, setAdScripts] = useState<GroupedAdScripts | null>(null)
  const [injectionStatus, setInjectionStatus] = useState<string>('Loading...')

  useEffect(() => {
    // Load active ad scripts from API
    const loadAdScripts = async () => {
      try {
        console.log('AdScripts: Loading ad scripts from API...')
        setInjectionStatus('Loading from API...')
        const response = await fetch('/api/active-ad-scripts')
        console.log('AdScripts: API response status:', response.status)
        
        if (response.ok) {
          const scripts: GroupedAdScripts = await response.json()
          console.log('AdScripts: Ad scripts loaded successfully:', scripts)
          setAdScripts(scripts)
          setInjectionStatus('Scripts loaded, preparing injection...')
        } else {
          const errorText = await response.text()
          console.error('AdScripts: Failed to load ad scripts - Response not OK:', response.status, errorText)
          setInjectionStatus(`API Error: ${response.status}`)
        }
      } catch (error) {
        console.error('AdScripts: Failed to load ad scripts:', error)
        setInjectionStatus(`Load Error: ${error}`)
      }
    }

    loadAdScripts()
  }, [])

  useEffect(() => {
    if (!adScripts) return

    console.log('AdScripts: Starting script injection process:', adScripts)
    setInjectionStatus('Injecting scripts...')
    const injectedElements: HTMLElement[] = []

    // Add a small delay to ensure DOM is ready
    const injectScripts = () => {
      console.log('AdScripts: DOM ready, beginning script injection')

    // Inject head scripts
    console.log('AdScripts: Processing head scripts:', adScripts.head.length)
    adScripts.head.forEach((script, index) => {
      try {
        // Create a temporary container to parse HTML
        const tempContainer = document.createElement('div')
        tempContainer.innerHTML = script.code
        
        // Check if it contains script tags
        const scriptTags = tempContainer.querySelectorAll('script')
        
        if (scriptTags.length > 0) {
          // Handle HTML with script tags
          scriptTags.forEach((originalScript) => {
            const newScript = document.createElement('script')
            
            // Copy attributes
            Array.from(originalScript.attributes).forEach(attr => {
              newScript.setAttribute(attr.name, attr.value)
            })
            
            // Set content
            if (originalScript.src) {
              newScript.src = originalScript.src
            } else {
              newScript.textContent = originalScript.textContent || originalScript.innerHTML
            }
            
            // Add our tracking attributes
            newScript.setAttribute('data-ad-script-id', script.id)
            newScript.setAttribute('data-ad-script-name', script.name)
            
            document.head.appendChild(newScript)
            injectedElements.push(newScript)
            console.log(`AdScripts: Successfully injected head script ${index + 1}: ${script.name} (HTML format)`)
          })
        } else {
          // Handle plain JavaScript
          const scriptElement = document.createElement('script')
          scriptElement.textContent = script.code
          scriptElement.setAttribute('data-ad-script-id', script.id)
          scriptElement.setAttribute('data-ad-script-name', script.name)
          scriptElement.setAttribute('data-cfasync', 'false')
          document.head.appendChild(scriptElement)
          injectedElements.push(scriptElement)
          console.log(`AdScripts: Successfully injected head script ${index + 1}: ${script.name} (JS format)`)
        }
      } catch (error) {
        console.error(`AdScripts: Failed to inject head script ${index + 1} (${script.id}):`, error)
      }
    })

    // Inject body-start scripts
    adScripts['body-start'].forEach((script) => {
      try {
        // Create a temporary container to parse HTML
        const tempContainer = document.createElement('div')
        tempContainer.innerHTML = script.code
        
        // Check if it contains script tags
        const scriptTags = tempContainer.querySelectorAll('script')
        
        if (scriptTags.length > 0) {
          // Handle HTML with script tags
          scriptTags.forEach((originalScript) => {
            const newScript = document.createElement('script')
            
            // Copy attributes
            Array.from(originalScript.attributes).forEach(attr => {
              newScript.setAttribute(attr.name, attr.value)
            })
            
            // Set content
            if (originalScript.src) {
              newScript.src = originalScript.src
            } else {
              newScript.textContent = originalScript.textContent || originalScript.innerHTML
            }
            
            // Add our tracking attributes
            newScript.setAttribute('data-ad-script-id', script.id)
            newScript.setAttribute('data-ad-script-name', script.name)
            
            document.body.insertBefore(newScript, document.body.firstChild)
            injectedElements.push(newScript)
            console.log(`Successfully injected body-start script: ${script.name} (HTML format)`)
          })
        } else {
          // Handle plain JavaScript
          const scriptElement = document.createElement('script')
          scriptElement.textContent = script.code
          scriptElement.setAttribute('data-ad-script-id', script.id)
          scriptElement.setAttribute('data-ad-script-name', script.name)
          scriptElement.setAttribute('data-cfasync', 'false')
          document.body.insertBefore(scriptElement, document.body.firstChild)
          injectedElements.push(scriptElement)
          console.log(`Successfully injected body-start script: ${script.name} (JS format)`)
        }
      } catch (error) {
        console.error(`Failed to inject body-start script ${script.id}:`, error)
      }
    })

    // Inject body-end scripts
    adScripts['body-end'].forEach((script) => {
      try {
        // Create a temporary container to parse HTML
        const tempContainer = document.createElement('div')
        tempContainer.innerHTML = script.code
        
        // Check if it contains script tags
        const scriptTags = tempContainer.querySelectorAll('script')
        
        if (scriptTags.length > 0) {
          // Handle HTML with script tags
          scriptTags.forEach((originalScript) => {
            const newScript = document.createElement('script')
            
            // Copy attributes
            Array.from(originalScript.attributes).forEach(attr => {
              newScript.setAttribute(attr.name, attr.value)
            })
            
            // Set content
            if (originalScript.src) {
              newScript.src = originalScript.src
            } else {
              newScript.textContent = originalScript.textContent || originalScript.innerHTML
            }
            
            // Add our tracking attributes
            newScript.setAttribute('data-ad-script-id', script.id)
            newScript.setAttribute('data-ad-script-name', script.name)
            
            document.body.appendChild(newScript)
            injectedElements.push(newScript)
            console.log(`Successfully injected body-end script: ${script.name} (HTML format)`)
          })
        } else {
          // Handle plain JavaScript
          const scriptElement = document.createElement('script')
          scriptElement.textContent = script.code
          scriptElement.setAttribute('data-ad-script-id', script.id)
          scriptElement.setAttribute('data-ad-script-name', script.name)
          scriptElement.setAttribute('data-cfasync', 'false')
          document.body.appendChild(scriptElement)
          injectedElements.push(scriptElement)
          console.log(`Successfully injected body-end script: ${script.name} (JS format)`)
        }
      } catch (error) {
        console.error(`Failed to inject body-end script ${script.id}:`, error)
      }
    })

      // Update status after injection
      const totalScripts = adScripts.head.length + adScripts['body-start'].length + adScripts['body-end'].length
      console.log(`AdScripts: Injection complete. Total scripts processed: ${totalScripts}`)
      setInjectionStatus(`Injection complete: ${totalScripts} scripts processed`)
    }

    // Execute script injection with a small delay
    const timeoutId = setTimeout(injectScripts, 100)

    // Cleanup function
    return () => {
      clearTimeout(timeoutId)
      injectedElements.forEach((element) => {
        if (element.parentNode) {
          element.parentNode.removeChild(element)
        }
      })
    }
  }, [adScripts])

  // For debugging - remove in production
  if (process.env.NODE_ENV === 'development') {
    return (
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px'
      }}>
        AdScripts: {injectionStatus}
      </div>
    )
  }

  return null
}