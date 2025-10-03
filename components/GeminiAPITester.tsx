'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

export default function GeminiAPITester() {
  const [apiKey, setApiKey] = useState('')
  const [keyword, setKeyword] = useState('AI tools')
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testAPI = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your API key')
      return
    }

    setTesting(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/test-gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: apiKey.trim(),
          keyword: keyword.trim()
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setResult(data)
      } else {
        setError(data.error || 'Test failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🧪 Gemini API Tester</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gemini API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Keyword
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter a test keyword"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={testAPI}
          disabled={testing || !apiKey.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Testing API...
            </>
          ) : (
            'Test Gemini API'
          )}
        </button>
      </div>

      {/* Results */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold">API Test Failed</span>
          </div>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center gap-2 text-green-800 mb-3">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">API Test Successful!</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900">Generated Text:</h4>
              <p className="text-sm text-gray-700 bg-white p-2 rounded border">
                {result.generatedText}
              </p>
            </div>
            
            <details className="text-sm">
              <summary className="cursor-pointer font-medium text-gray-700">
                View Full Response
              </summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify(result.response, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="font-semibold text-blue-900 mb-2">How to get your API key:</h3>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
          <li>2. Sign in with your Google account</li>
          <li>3. Click "Create API Key"</li>
          <li>4. Copy the generated key and paste it above</li>
        </ol>
      </div>
    </div>
  )
}