import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const AD_SCRIPTS_FILE = path.join(process.cwd(), 'ad-scripts.json')

interface AdScript {
  id: string
  name: string
  code: string
  active: boolean
  position: 'head' | 'body-start' | 'body-end'
  createdAt: string
  updatedAt: string
}

// Ensure ad scripts file exists
function ensureAdScriptsFile() {
  if (!fs.existsSync(AD_SCRIPTS_FILE)) {
    fs.writeFileSync(AD_SCRIPTS_FILE, JSON.stringify([], null, 2))
  }
}

// Read ad scripts from file
function readAdScripts(): AdScript[] {
  try {
    ensureAdScriptsFile()
    const data = fs.readFileSync(AD_SCRIPTS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading ad scripts:', error)
    return []
  }
}

// Write ad scripts to file
function writeAdScripts(scripts: AdScript[]) {
  try {
    // Create backup
    if (fs.existsSync(AD_SCRIPTS_FILE)) {
      const backupPath = `${AD_SCRIPTS_FILE}.backup-${Date.now()}`
      fs.copyFileSync(AD_SCRIPTS_FILE, backupPath)
    }
    
    fs.writeFileSync(AD_SCRIPTS_FILE, JSON.stringify(scripts, null, 2))
    return true
  } catch (error) {
    console.error('Error writing ad scripts:', error)
    return false
  }
}

// GET - Retrieve all ad scripts
export async function GET() {
  try {
    const scripts = readAdScripts()
    return NextResponse.json(scripts)
  } catch (error) {
    console.error('GET ad scripts error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve ad scripts' },
      { status: 500 }
    )
  }
}

// POST - Create new ad script
export async function POST(request: NextRequest) {
  try {
    const scriptData: AdScript = await request.json()
    
    // Validate required fields
    if (!scriptData.name || !scriptData.code) {
      return NextResponse.json(
        { error: 'Name and code are required' },
        { status: 400 }
      )
    }

    const scripts = readAdScripts()
    
    // Check if script with same name already exists
    if (scripts.some(script => script.name === scriptData.name)) {
      return NextResponse.json(
        { error: 'Script with this name already exists' },
        { status: 400 }
      )
    }

    // Add new script
    const newScript: AdScript = {
      id: scriptData.id || `ad-${Date.now()}`,
      name: scriptData.name,
      code: scriptData.code,
      active: scriptData.active ?? true,
      position: scriptData.position || 'head',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    scripts.push(newScript)
    
    if (writeAdScripts(scripts)) {
      return NextResponse.json(newScript, { status: 201 })
    } else {
      return NextResponse.json(
        { error: 'Failed to save ad script' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('POST ad script error:', error)
    return NextResponse.json(
      { error: 'Failed to create ad script' },
      { status: 500 }
    )
  }
}

// PUT - Update existing ad script
export async function PUT(request: NextRequest) {
  try {
    const scriptData: AdScript = await request.json()
    
    if (!scriptData.id) {
      return NextResponse.json(
        { error: 'Script ID is required' },
        { status: 400 }
      )
    }

    const scripts = readAdScripts()
    const scriptIndex = scripts.findIndex(script => script.id === scriptData.id)
    
    if (scriptIndex === -1) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      )
    }

    // Update script
    scripts[scriptIndex] = {
      ...scripts[scriptIndex],
      ...scriptData,
      updatedAt: new Date().toISOString()
    }
    
    if (writeAdScripts(scripts)) {
      return NextResponse.json(scripts[scriptIndex])
    } else {
      return NextResponse.json(
        { error: 'Failed to update ad script' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('PUT ad script error:', error)
    return NextResponse.json(
      { error: 'Failed to update ad script' },
      { status: 500 }
    )
  }
}

// DELETE - Remove ad script
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Script ID is required' },
        { status: 400 }
      )
    }

    const scripts = readAdScripts()
    const filteredScripts = scripts.filter(script => script.id !== id)
    
    if (filteredScripts.length === scripts.length) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      )
    }
    
    if (writeAdScripts(filteredScripts)) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Failed to delete ad script' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('DELETE ad script error:', error)
    return NextResponse.json(
      { error: 'Failed to delete ad script' },
      { status: 500 }
    )
  }
}