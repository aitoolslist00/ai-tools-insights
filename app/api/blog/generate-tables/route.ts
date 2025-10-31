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

      Generate tables that:
      1. Enhance understanding of the topic
      2. Provide quick reference information
      3. Compare different aspects or options
      4. Summarize key points

      For each table, provide:
      - Table title
      - HTML table markup with proper styling classes
      - Brief description of what the table shows

      Respond in JSON format:
      {
        "tables": [
          {
            "id": "table-1",
            "title": "Table Title",
            "description": "What this table shows",
            "html": "<div class='table-container'><table class='comparison-table'>...</table></div>",
            "insertAfter": "paragraph or heading to insert after"
          }
        ]
      }

      Use these CSS classes for styling:
      - table-container: wrapper div
      - comparison-table: main table
      - table-header: header row
      - table-row: data rows
      - highlight-cell: important cells
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

    // Step 3: Insert tables into content at appropriate positions
    let enhancedContent = content;
    let insertionCount = 0;

    // Find the middle of the article for insertion
    const paragraphs = content.split('\n\n');
    const middleIndex = Math.floor(paragraphs.length / 2);

    for (const table of tableData.tables) {
      // Create the table HTML with proper styling
      const tableHtml = `
<div class="table-container my-8 overflow-x-auto">
  <h3 class="text-xl font-semibold mb-4 text-gray-800">${table.title}</h3>
  <p class="text-gray-600 mb-4">${table.description}</p>
  ${table.html}
</div>`;

      // Insert table in the middle of the content
      if (insertionCount === 0) {
        // Insert the first table in the middle
        paragraphs.splice(middleIndex, 0, tableHtml);
        insertionCount++;
      } else {
        // Insert additional tables towards the end
        const insertIndex = Math.min(middleIndex + insertionCount + 2, paragraphs.length - 2);
        paragraphs.splice(insertIndex, 0, tableHtml);
        insertionCount++;
      }
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