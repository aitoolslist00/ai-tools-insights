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

  useEffect(() => {
    // Load active ad scripts from API
    const loadAdScripts = async () => {
      try {
        const response = await fetch('/api/active-ad-scripts')
        if (response.ok) {
          const scripts: GroupedAdScripts = await response.json()
          setAdScripts(scripts)
        }
      } catch (error) {
        console.error('Failed to load ad scripts:', error)
      }
    }

    loadAdScripts()
  }, [])

  useEffect(() => {
    if (!adScripts) return

    const injectedElements: HTMLElement[] = []

    // Inject head scripts
    adScripts.head.forEach((script) => {
      const scriptElement = document.createElement('script')
      scriptElement.innerHTML = script.code
      scriptElement.setAttribute('data-ad-script-id', script.id)
      scriptElement.setAttribute('data-cfasync', 'false')
      document.head.appendChild(scriptElement)
      injectedElements.push(scriptElement)
    })

    // Inject body-start scripts
    adScripts['body-start'].forEach((script) => {
      const scriptElement = document.createElement('script')
      scriptElement.innerHTML = script.code
      scriptElement.setAttribute('data-ad-script-id', script.id)
      scriptElement.setAttribute('data-cfasync', 'false')
      document.body.insertBefore(scriptElement, document.body.firstChild)
      injectedElements.push(scriptElement)
    })

    // Inject body-end scripts
    adScripts['body-end'].forEach((script) => {
      const scriptElement = document.createElement('script')
      scriptElement.innerHTML = script.code
      scriptElement.setAttribute('data-ad-script-id', script.id)
      scriptElement.setAttribute('data-cfasync', 'false')
      document.body.appendChild(scriptElement)
      injectedElements.push(scriptElement)
    })

    // Cleanup function
    return () => {
      injectedElements.forEach((element) => {
        if (element.parentNode) {
          element.parentNode.removeChild(element)
        }
      })
    }
  }, [adScripts])

  return null
}