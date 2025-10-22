import { NextRequest, NextResponse } from 'next/server'
import { validateApiAuth } from '@/lib/auth-enhanced'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const isAuth = await validateApiAuth(request)
    if (!isAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { keyword, apiKey } = await request.json()

    if (!keyword || !apiKey) {
      return NextResponse.json(
        { error: 'Keyword and API key are required' },
        { status: 400 }
      )
    }

    // Get today's date
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Create the prompt with the exact text provided by the user
    const prompt = `You are an advanced SEO strategist, professional content writer, and competitor analyst.  
Your mission is to write a **real-time, long-form, authority-building article** for the target keyword: ${keyword}.  

🎯 Objectives:  
- Make the article rank in the **Top 3 results of Google** within days.  
- Ensure the content is **up-to-date as of ${today}**, reflecting the latest data, stats, and trends.  
- Outperform **all current top-ranking articles** for ${keyword} in quality, depth, and freshness.  
- Build **Topical Authority** by suggesting supporting cluster articles.  

📌 Instructions:  

1. **Competitor Analysis Simulation**  
   - Review what the top 5 Google results for ${keyword} usually include.  
   - Identify gaps, weaknesses, and opportunities.  
   - Ensure your article fills these gaps and offers more value.  

2. **Content Structure**  
   - Start with a **direct summary (2–3 sentences)** answering the search intent → optimized for Featured Snippets & AI Overviews.  
   - Use a clear **SEO-friendly heading hierarchy** (H1, H2, H3, H4).  
   - Cover:  
     - Definition + context of ${keyword}  
     - Latest real-time developments and news (as of ${today})  
     - Benefits, challenges, and opportunities  
     - Comparisons, examples, and case studies  
     - Actionable steps, frameworks, or how-to guides  

3. **Semantic SEO**  
   - Integrate **entities, synonyms, and NLP-friendly terms** around ${keyword}.  
   - Use related queries from "People Also Ask" and semantic clusters.  
   - Add **internal linking suggestions** to cluster articles.  

4. **Engagement & UX**  
   - Write in a **natural, human-like, and engaging style** (storytelling, examples, practical tips).  
   - Use **short paragraphs, bullet points, tables, and comparison lists**.  
   - Aim for at least **2000–2500 words**.  

5. **FAQ Section**  
   - Provide **at least 7 FAQs** with concise, helpful answers.  
   - Optimize for Google's "People Also Ask" feature.  

6. **Final Touches**  
   - End with a **clear conclusion & key takeaways**.  
   - Ensure originality, zero fluff, and maximum helpfulness.  
   - Format output strictly in **Markdown**.  
   - DO NOT include "Topical Authority Expansion" or "Cluster Article Ideas" sections.  
   - DO NOT include "JSON-LD FAQ Schema" or any schema markup sections.  
   - The article should be ready to publish immediately without any meta-content or suggestions.  

🔥 Critical:  
- Article must look like **expert human journalism**, not AI.  
- Must **outperform existing competitors** in clarity, depth, and freshness.  
- Content should balance **SEO optimization** with **reader enjoyment**.  
- The final output should be a complete, publishable article with NO additional sections about cluster topics, schema markup, or meta-suggestions.  
- End the article with the conclusion and key takeaways only.`

    let modelName = 'gemini-2.5-flash'
    const tryModels = [
      'gemini-2.5-flash',
      'gemini-2.5-pro',
      'gemini-2.0-flash',
      'gemini-2.0-flash-exp',
      'gemini-flash-latest',
      'gemini-pro-latest'
    ]
    
    let responseData: any = null
    let lastError: { status?: number; error: string; model: string; withSearch?: boolean } | null = null
    
    for (const model of tryModels) {
      const attempts = [true, false]
      for (const withSearch of attempts) {
        try {
          const body: Record<string, any> = {
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
            }
          }

          if (withSearch) {
            body.tools = [{ googleSearch: {} }]
          }

          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
          })

          if (!response.ok) {
            const errorText = await response.text()
            lastError = { status: response.status, error: errorText, model, withSearch }
            console.log(`❌ Model ${model} ${withSearch ? 'with' : 'without'} search failed:`, response.status, errorText)
            if (withSearch) {
              console.log('⚠️ Google Search not available, trying standard generation')
            }
            continue
          }

          const data = await response.json()

          if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            lastError = { error: 'No content generated', model, withSearch }
            console.log(`❌ Model ${model} ${withSearch ? 'with' : 'without'} search returned empty content`)
            continue
          }

          responseData = data
          modelName = model
          console.log(`✅ Successfully using model: ${model} ${withSearch ? 'with search' : 'without search'}`)
          break
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          lastError = { error: errorMessage, model, withSearch }
          console.log(`❌ Model ${model} ${withSearch ? 'with' : 'without'} search network error:`, errorMessage)
          if (withSearch) {
            console.log('⚠️ Google Search not available, trying standard generation')
          }
        }
      }

      if (responseData) {
        break
      }
    }

    if (!responseData) {
      console.error('All Gemini API models failed:', lastError)
      
      let errorMessage = 'Failed to generate content. Please check your API key and try again.'
      
      if (lastError?.status === 400) {
        errorMessage = 'Invalid request. Please check your API key and try again.'
      } else if (lastError?.status === 403) {
        errorMessage = 'API key is invalid or doesn\'t have permission to access Gemini API.'
      } else if (lastError?.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again in a few minutes.'
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }

    const generatedContent = responseData.candidates[0].content.parts[0].text

    return NextResponse.json({
      success: true,
      content: generatedContent,
      keyword: keyword,
      model: modelName,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Content generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}