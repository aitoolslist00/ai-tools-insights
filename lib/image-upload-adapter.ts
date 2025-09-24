// Image upload adapter for different environments

export interface ImageUploadResult {
  success: boolean
  imageUrl?: string
  error?: string
  filename?: string
  size?: number
  type?: string
}

export interface ImageUploadAdapter {
  uploadImage(file: File): Promise<ImageUploadResult>
  deleteImage(filename: string): Promise<boolean>
}

// Local file system adapter (development)
class LocalFileSystemAdapter implements ImageUploadAdapter {
  async uploadImage(file: File): Promise<ImageUploadResult> {
    try {
      // Import fs modules dynamically for server-side use
      const { writeFile, mkdir } = await import('fs/promises')
      const { join, resolve } = await import('path')
      const { existsSync } = await import('fs')

      // Create uploads directory if it doesn't exist
      const uploadsDir = resolve(process.cwd(), 'public', 'uploads')
      
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }

      // Generate SEO-optimized filename
      const timestamp = Date.now()
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase()
      const seoFilename = `ai-tools-${timestamp}-${originalName}`
      const filepath = join(uploadsDir, seoFilename)

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      await writeFile(filepath, buffer)

      // Return the public URL
      const imageUrl = `/uploads/${seoFilename}`
      
      return {
        success: true,
        imageUrl,
        filename: seoFilename,
        size: file.size,
        type: file.type
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  }

  async deleteImage(filename: string): Promise<boolean> {
    try {
      const { unlink } = await import('fs/promises')
      const { join, resolve } = await import('path')
      const { existsSync } = await import('fs')

      const uploadsDir = resolve(process.cwd(), 'public', 'uploads')
      const filepath = join(uploadsDir, filename)
      
      if (existsSync(filepath)) {
        await unlink(filepath)
        return true
      }
      return false
    } catch {
      return false
    }
  }
}

// Vercel Blob adapter (production)
class VercelBlobAdapter implements ImageUploadAdapter {
  private async checkBlobAvailability(): Promise<boolean> {
    try {
      await import('@vercel/blob')
      return true
    } catch (error) {
      console.warn('⚠️ @vercel/blob package not available:', error instanceof Error ? error.message : String(error))
      return false
    }
  }

  async uploadImage(file: File): Promise<ImageUploadResult> {
    try {
      // Check if package is available
      const isAvailable = await this.checkBlobAvailability()
      if (!isAvailable) {
        throw new Error('Vercel Blob package not installed. Run: npm install @vercel/blob')
      }

      // Check if Vercel Blob is configured
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        throw new Error('Vercel Blob not configured. Please set BLOB_READ_WRITE_TOKEN in environment variables.')
      }

      const { put } = await import('@vercel/blob')
      
      // Generate SEO-optimized filename
      const timestamp = Date.now()
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase()
      const seoFilename = `ai-tools-${timestamp}-${originalName}`

      // Upload to Vercel Blob
      const blob = await put(seoFilename, file, {
        access: 'public',
        addRandomSuffix: false
      })

      return {
        success: true,
        imageUrl: blob.url,
        filename: seoFilename,
        size: file.size,
        type: file.type
      }
    } catch (error) {
      console.error('Vercel Blob upload error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Blob upload failed'
      }
    }
  }

  async deleteImage(filename: string): Promise<boolean> {
    try {
      const isAvailable = await this.checkBlobAvailability()
      if (!isAvailable) {
        console.error('Vercel Blob package not available for delete operation')
        return false
      }

      const { del } = await import('@vercel/blob')
      await del(filename)
      return true
    } catch (error) {
      console.error('Vercel Blob delete error:', error)
      return false
    }
  }
}

// Cloudinary adapter (alternative)
class CloudinaryAdapter implements ImageUploadAdapter {
  async uploadImage(file: File): Promise<ImageUploadResult> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET || 'ai-tools')
      formData.append('folder', 'ai-tools-blog')

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      )

      if (!response.ok) {
        throw new Error(`Cloudinary upload failed: ${response.status}`)
      }

      const result = await response.json()
      
      return {
        success: true,
        imageUrl: result.secure_url,
        filename: result.public_id,
        size: result.bytes,
        type: file.type
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Cloudinary upload failed'
      }
    }
  }

  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/cloudinary-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId })
      })
      return response.ok
    } catch {
      return false
    }
  }
}

// Factory function to get the appropriate upload adapter
export function getImageUploadAdapter(): ImageUploadAdapter {
  const provider = process.env.UPLOAD_PROVIDER || 'local'
  
  console.log('📸 Image upload provider:', provider)
  
  switch (provider) {
    case 'vercel-blob':
      return new VercelBlobAdapter()
    case 'cloudinary':
      return new CloudinaryAdapter()
    case 'local':
    default:
      return new LocalFileSystemAdapter()
  }
}

// Helper function for client-side uploads
export async function uploadImageFile(file: File): Promise<ImageUploadResult> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('blog-auth-token')}`
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `Upload failed: ${response.status} ${errorText}`
      }
    }

    const result = await response.json()
    return {
      success: true,
      imageUrl: result.imageUrl,
      filename: result.filename,
      size: result.size,
      type: result.type
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error during upload'
    }
  }
}