import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join, resolve } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  let uploadsDir = ''
  let filepath = ''
  
  try {
    console.log('Upload API called')
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    console.log('File received:', {
      name: file?.name,
      size: file?.size,
      type: file?.type
    })
    
    if (!file) {
      console.log('No file provided in request')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload JPG, PNG, GIF, or WEBP images.' 
      }, { status: 400 })
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    uploadsDir = resolve(process.cwd(), 'public', 'uploads')
    console.log('Current working directory:', process.cwd())
    console.log('Uploads directory:', uploadsDir)
    console.log('Directory exists:', existsSync(uploadsDir))
    
    if (!existsSync(uploadsDir)) {
      console.log('Creating uploads directory...')
      await mkdir(uploadsDir, { recursive: true })
      console.log('Directory created successfully')
    }
    
    // Test write permissions
    try {
      const testFile = join(uploadsDir, 'test-write.txt')
      await writeFile(testFile, 'test')
      console.log('Write test successful')
      // Clean up test file
      const { unlink } = await import('fs/promises')
      await unlink(testFile)
    } catch (writeError) {
      console.error('Write permission test failed:', writeError)
    }

    // Generate SEO-optimized filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase()
    const seoFilename = `ai-tools-${timestamp}-${originalName}`
    filepath = join(uploadsDir, seoFilename)
    
    console.log('Original filename:', file.name)
    console.log('Cleaned filename:', originalName)
    console.log('SEO filename:', seoFilename)
    console.log('Generated filepath:', filepath)

    // Convert file to buffer and save
    console.log('Converting file to buffer...')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('Buffer size:', buffer.length)
    
    console.log('Writing file to disk...')
    await writeFile(filepath, buffer)
    console.log('File written successfully')

    // Return the public URL with SEO optimization info
    const imageUrl = `/uploads/${seoFilename}`
    const apiUrl = `/api/uploads/${seoFilename}`
    
    console.log('Returning URLs:', { imageUrl, apiUrl })
    
    return NextResponse.json({ 
      success: true, 
      imageUrl,
      apiUrl, // Fallback URL through API
      filename: seoFilename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      seoOptimized: true,
      altTextSuggestion: `AI tools and technology - ${originalName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}`,
      titleSuggestion: `Professional AI Tools Image - ${originalName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}`
    })

  } catch (error) {
    console.error('Upload error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      uploadsDir: uploadsDir || 'not set',
      filepath: filepath || 'not set'
    })
    return NextResponse.json({ 
      error: `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}