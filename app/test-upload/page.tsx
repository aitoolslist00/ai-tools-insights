'use client'

import { useState } from 'react'

export default function TestUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<string>('')

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setResult('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      console.log('Uploading file:', file.name)

      const response = await fetch('/api/test-upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult(`Success: ${JSON.stringify(data, null, 2)}`)
        
        // Test if the image URL is accessible
        if (data.imageUrl) {
          const testImg = document.createElement('img')
          testImg.onload = () => console.log('Image loaded successfully:', data.imageUrl)
          testImg.onerror = () => console.error('Failed to load image:', data.imageUrl)
          testImg.src = data.imageUrl
        }
      } else {
        setResult(`Error: ${JSON.stringify(data, null, 2)}`)
      }
    } catch (error) {
      setResult(`Exception: ${error}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Upload</h1>
      
      <div className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block"
        />
        
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        
        {result && (
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {result}
          </pre>
        )}
      </div>
    </div>
  )
}