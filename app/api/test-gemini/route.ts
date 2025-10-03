import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { apiKey, keyword } = body

    if (!apiKey || !keyword) {
      return NextResponse.json({ error: 'API key and keyword required' }, { status: 400 })
    }

    // Simple test prompt
    const prompt = `Write a brief 100-word article about "${keyword}". Format as JSON: {"title": "title here", "content": "content here"}`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json({ 
        error: `Gemini API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`,
        details: errorData
      }, { status: 500 })
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      response: data,
      generatedText: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No text generated'
    })

  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}