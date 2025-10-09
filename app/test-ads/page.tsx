'use client'

export default function TestAdsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Ad Scripts Test Page</h1>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Test Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Open browser developer tools (F12)</li>
            <li>Go to the Console tab</li>
            <li>Look for "TEST AD SCRIPT EXECUTED SUCCESSFULLY!" message</li>
            <li>Check if window.testAdExecuted is true by typing: window.testAdExecuted</li>
            <li>Look for AdScripts debug messages</li>
          </ol>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Expected Console Output:</h2>
          <pre className="text-sm bg-gray-100 p-2 rounded">
{`AdScripts: Loading ad scripts from API...
AdScripts: API response status: 200
AdScripts: Ad scripts loaded successfully: {...}
AdScripts: Starting script injection process: {...}
AdScripts: DOM ready, beginning script injection
AdScripts: Processing head scripts: 1
AdScripts: Successfully injected head script 1: Simple Test Ad (JS format)
TEST AD SCRIPT EXECUTED SUCCESSFULLY!
AdScripts: Injection complete. Total scripts processed: 1`}
          </pre>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Debug Info:</h2>
          <p>Check the bottom-right corner for the AdScripts debug indicator.</p>
          <p>It should show: "AdScripts: Injection complete: 1 scripts processed"</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Manual Test:</h2>
          <button 
            onClick={() => {
              console.log('Manual test - window.testAdExecuted:', (window as any).testAdExecuted);
              alert(`Test Ad Executed: ${(window as any).testAdExecuted ? 'YES' : 'NO'}`);
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Check if Test Ad Executed
          </button>
        </div>
      </div>
    </div>
  )
}