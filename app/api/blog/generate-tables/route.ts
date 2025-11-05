import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateApiAuth } from '@/lib/auth-enhanced';

interface TableData {
  tables: Array<{
    id: string;
    title: string;
    description: string;
    html: string;
    insertAfter: string;
  }>;
}

interface AnalysisResult {
  shouldGenerateTables: boolean;
  tableTypes: string[];
  insertionPoints: string[];
  reasoning: string;
}

/**
 * Calculate optimal insertion points for tables throughout the article
 * Distributes tables evenly while avoiding clustering
 */
function calculateOptimalInsertionPoints(paragraphs: string[], tableCount: number): number[] {
  const totalParagraphs = paragraphs.length;
  const insertionPoints: number[] = [];
  
  if (tableCount === 0) return insertionPoints;
  
  // Minimum spacing between tables (at least 3 paragraphs apart)
  const minSpacing = Math.max(3, Math.floor(totalParagraphs / (tableCount + 1)));
  
  // Strategy based on number of tables
  if (tableCount === 1) {
    // Single table: place in the middle third of the article
    const middleStart = Math.floor(totalParagraphs * 0.4);
    const middleEnd = Math.floor(totalParagraphs * 0.6);
    insertionPoints.push(Math.floor((middleStart + middleEnd) / 2));
  } else if (tableCount === 2) {
    // Two tables: place at 1/3 and 2/3 positions
    insertionPoints.push(Math.floor(totalParagraphs * 0.33));
    insertionPoints.push(Math.floor(totalParagraphs * 0.67));
  } else if (tableCount === 3) {
    // Three tables: place at 1/4, 1/2, and 3/4 positions
    insertionPoints.push(Math.floor(totalParagraphs * 0.25));
    insertionPoints.push(Math.floor(totalParagraphs * 0.5));
    insertionPoints.push(Math.floor(totalParagraphs * 0.75));
  } else {
    // Multiple tables: distribute evenly with minimum spacing
    const spacing = Math.max(minSpacing, Math.floor(totalParagraphs / (tableCount + 1)));
    
    for (let i = 0; i < tableCount; i++) {
      const position = spacing * (i + 1);
      insertionPoints.push(Math.min(position, totalParagraphs - 2));
    }
  }
  
  // Ensure no insertion point is too close to the beginning or end
  return insertionPoints.map(point => {
    // Don't insert in first 2 paragraphs or last 2 paragraphs
    return Math.max(2, Math.min(point, totalParagraphs - 2));
  }).sort((a, b) => a - b);
}

/**
 * Find the best insertion point near a target position
 * Looks for natural breaks like headings or longer paragraphs
 */
function findBestInsertionPoint(paragraphs: string[], targetIndex: number): number {
  const searchRange = 2; // Look 2 paragraphs before and after target
  const startSearch = Math.max(0, targetIndex - searchRange);
  const endSearch = Math.min(paragraphs.length - 1, targetIndex + searchRange);
  
  let bestIndex = targetIndex;
  let bestScore = 0;
  
  for (let i = startSearch; i <= endSearch; i++) {
    const paragraph = paragraphs[i];
    let score = 0;
    
    // Prefer positions after headings (markdown headers)
    if (paragraph.startsWith('#')) {
      score += 10;
    }
    
    // Prefer positions after longer paragraphs (natural breaks)
    if (paragraph.length > 200) {
      score += 5;
    }
    
    // Prefer positions that aren't in the middle of lists
    if (!paragraph.startsWith('-') && !paragraph.startsWith('*') && !paragraph.match(/^\d+\./)) {
      score += 3;
    }
    
    // Slight preference for positions closer to target
    score -= Math.abs(i - targetIndex);
    
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }
  
  return bestIndex;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await validateApiAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      title, 
      content, 
      keywords, 
      primaryKeyword, 
      category, 
      apiKey 
    } = await request.json();

    if (!title || !content || !apiKey) {
      return NextResponse.json(
        { error: 'Title, content, and API key are required' },
        { status: 400 }
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    console.log('🔍 Analyzing content for table generation opportunities...');

    // Step 1: Analyze content to determine if tables would be beneficial
    const analysisPrompt = `
      Analyze this article content and determine if summary tables or comparison tables would enhance the reader's understanding:

      Title: ${title}
      Primary Keyword: ${primaryKeyword}
      Category: ${category}
      
      Content: ${content.substring(0, 2000)}...

      Determine:
      1. Would a summary table be beneficial? (Yes/No)
      2. Would a comparison table be beneficial? (Yes/No)
      3. What type of data could be tabulated?
      4. Where in the article would tables be most effective?

      Respond in JSON format:
      {
        "shouldGenerateTables": boolean,
        "tableTypes": ["summary", "comparison", "features", "pros-cons"],
        "insertionPoints": ["after-introduction", "middle-section", "before-conclusion"],
        "reasoning": "explanation of why tables would help"
      }
    `;

    const analysisResult = await model.generateContent(analysisPrompt);
    const analysisText = analysisResult.response.text();
    
    let analysis: AnalysisResult;
    try {
      analysis = JSON.parse(analysisText.replace(/```json\n?|\n?```/g, '')) as AnalysisResult;
    } catch (parseError) {
      console.warn('Failed to parse analysis JSON, proceeding without tables');
      return NextResponse.json({
        success: false,
        reason: 'Content analysis failed',
        enhancedContent: content
      });
    }

    if (!analysis.shouldGenerateTables) {
      console.log('📊 Analysis determined tables are not beneficial for this content');
      return NextResponse.json({
        success: false,
        reason: analysis.reasoning || 'Tables not beneficial for this content',
        enhancedContent: content
      });
    }

    console.log('📊 Generating tables based on analysis...');

    // Step 2: Generate appropriate tables
    const tableGenerationPrompt = `
      Based on the analysis, generate ${analysis.tableTypes.join(' and ')} table(s) for this article:

      Title: ${title}
      Primary Keyword: ${primaryKeyword}
      Keywords: ${keywords.join(', ')}
      
      Content: ${content}

      Generate ${Math.min(analysis.tableTypes.length, 3)} tables that:
      1. Enhance understanding of the topic
      2. Provide quick reference information
      3. Compare different aspects or options
      4. Summarize key points
      5. Are distributed throughout the article (not clustered together)

      Table types to create:
      ${analysis.tableTypes.map((type, index) => `${index + 1}. ${type.charAt(0).toUpperCase() + type.slice(1)} table`).join('\n')}

      For each table, provide:
      - Descriptive title that relates to the content section
      - Clean HTML table markup with responsive design
      - Brief description explaining the table's purpose
      - Ensure tables complement different parts of the article

      Respond in JSON format:
      {
        "tables": [
          {
            "id": "table-1",
            "title": "Descriptive Table Title",
            "description": "Brief explanation of what this table shows and why it's useful",
            "html": "<table class='w-full border-collapse border border-gray-300'><thead class='bg-gray-50'><tr><th class='border border-gray-300 px-4 py-2 text-left font-semibold'>Header</th></tr></thead><tbody><tr><td class='border border-gray-300 px-4 py-2'>Data</td></tr></tbody></table>",
            "insertAfter": "relevant content section"
          }
        ]
      }

      Use responsive table styling with:
      - w-full: full width
      - border-collapse border border-gray-300: table borders
      - bg-gray-50: header background
      - px-4 py-2: cell padding
      - text-left font-semibold: header styling
      - Alternating row colors for readability
    `;

    const tableResult = await model.generateContent(tableGenerationPrompt);
    const tableText = tableResult.response.text();
    
    let tableData: TableData;
    try {
      tableData = JSON.parse(tableText.replace(/```json\n?|\n?```/g, '')) as TableData;
    } catch (parseError) {
      console.warn('Failed to parse table JSON');
      return NextResponse.json({
        success: false,
        reason: 'Table generation failed',
        enhancedContent: content
      });
    }

    if (!tableData.tables || tableData.tables.length === 0) {
      return NextResponse.json({
        success: false,
        reason: 'No tables generated',
        enhancedContent: content
      });
    }

    console.log(`📊 Generated ${tableData.tables.length} table(s)`);

    // Step 3: Insert tables into content at strategic positions
    let enhancedContent = content;
    
    // Split content into sections for better distribution
    const paragraphs = content.split('\n\n').filter((p: string) => p.trim().length > 0);
    const totalParagraphs = paragraphs.length;
    
    // Calculate optimal insertion points based on content structure
    const baseInsertionPoints = calculateOptimalInsertionPoints(paragraphs, tableData.tables.length);
    
    // Refine insertion points to find natural breaks
    const refinedInsertionPoints = baseInsertionPoints.map(point => 
      findBestInsertionPoint(paragraphs, point)
    );
    
    console.log(`📍 Table insertion points: ${refinedInsertionPoints.join(', ')}`);
    
    // Insert tables at calculated positions (reverse order to maintain indices)
    for (let i = tableData.tables.length - 1; i >= 0; i--) {
      const table = tableData.tables[i];
      const insertionIndex = refinedInsertionPoints[i];
      
      // Create the table HTML with proper styling and responsive design
      const tableHtml = `
<div class="table-container my-8 overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
  <div class="p-6">
    <h3 class="text-xl font-semibold mb-3 text-gray-800 border-b border-gray-100 pb-2">${table.title}</h3>
    <p class="text-gray-600 mb-4 text-sm leading-relaxed">${table.description}</p>
    <div class="overflow-x-auto">
      ${table.html}
    </div>
  </div>
</div>`;

      // Insert table at the calculated position
      paragraphs.splice(insertionIndex, 0, tableHtml);
    }

    enhancedContent = paragraphs.join('\n\n');

    console.log('✅ Tables successfully inserted into content');

    return NextResponse.json({
      success: true,
      tablesGenerated: tableData.tables.length,
      insertionPoints: analysis.insertionPoints,
      enhancedContent: enhancedContent,
      tables: tableData.tables.map((t) => ({
        title: t.title,
        description: t.description
      }))
    });

  } catch (error) {
    console.error('Error generating tables:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate tables',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}