import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { join, resolve } from 'path'
import { existsSync } from 'fs'
import { validateApiAuth } from '@/lib/auth-enhanced'

export async function POST(request: NextRequest) {
  let uploadsDir = ''
  let filepath = ''
  
  try {
    console.log('🚀 Local Upload API called')
    
    // Check authentication first
    const isAuthenticated = await validateApiAuth(request)
    if (!isAuthenticated) {
      console.log('❌ Upload request not authenticated')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    console.log('📁 File received:', {
      name: file?.name,
      size: file?.size,
      type: file?.type
    })
    
    if (!file) {
      console.log('❌ No file provided in request')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
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
    
    console.log('Returning URL:', imageUrl)
    
    return NextResponse.json({ 
      success: true, 
      imageUrl,
      filename: seoFilename,
      originalName: file.name,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('Local upload error:', error)
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename required' }, { status: 400 })
    }

    const uploadsDir = resolve(process.cwd(), 'public', 'uploads')
    const filepath = join(uploadsDir, filename)
    
    if (existsSync(filepath)) {
      await unlink(filepath)
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete file' 
    }, { status: 500 })
  }
}