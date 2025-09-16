import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    console.log('=== TEST UPLOAD API CALLED ===')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    console.log('File details:', {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      exists: !!file
    })
    
    if (!file) {
      console.log('ERROR: No file provided')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Simple filename
    const filename = `test-${Date.now()}-${file.name}`
    const filepath = join(process.cwd(), 'public', 'uploads', filename)
    
    console.log('Saving to:', filepath)
    
    // Convert and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    console.log('Buffer created, size:', buffer.length)
    
    await writeFile(filepath, buffer)
    
    console.log('File saved successfully!')
    
    return NextResponse.json({ 
      success: true, 
      message: 'File uploaded successfully',
      filename,
      size: file.size
    })

  } catch (error) {
    console.error('TEST UPLOAD ERROR:', error)
    return NextResponse.json({ 
      error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
}