import { NextRequest, NextResponse } from 'next/server'
import { validateApiAuth } from '@/lib/auth-enhanced'
import { getImageUploadAdapter } from '@/lib/image-upload-adapter'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Upload API called')
    
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

    // Use the appropriate upload adapter
    const uploadAdapter = getImageUploadAdapter()
    const result = await uploadAdapter.uploadImage(file)
    
    if (!result.success) {
      console.error('❌ Upload failed:', result.error)
      return NextResponse.json({ 
        error: result.error || 'Upload failed' 
      }, { status: 500 })
    }

    console.log('✅ Upload successful:', result.imageUrl)
    
    // Generate SEO suggestions
    const originalName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, ' ')
    
    return NextResponse.json({ 
      success: true, 
      imageUrl: result.imageUrl,
      filename: result.filename,
      originalName: file.name,
      size: result.size,
      type: result.type,
      seoOptimized: true,
      altTextSuggestion: `AI tools and technology - ${originalName}`,
      titleSuggestion: `Professional AI Tools Image - ${originalName}`
    })

  } catch (error) {
    console.error('Upload error:', error)
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