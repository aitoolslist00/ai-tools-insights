import { NextResponse } from 'next/server'
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

// Read active ad scripts
function getActiveAdScripts(): AdScript[] {
  try {
    if (!fs.existsSync(AD_SCRIPTS_FILE)) {
      return []
    }
    
    const data = fs.readFileSync(AD_SCRIPTS_FILE, 'utf8')
    const allScripts: AdScript[] = JSON.parse(data)
    
    // Return only active scripts
    return allScripts.filter(script => script.active)
  } catch (error) {
    console.error('Error reading active ad scripts:', error)
    return []
  }
}

// GET - Retrieve active ad scripts grouped by position
export async function GET() {
  try {
    const activeScripts = getActiveAdScripts()
    
    // Group scripts by position
    const groupedScripts = {
      head: activeScripts.filter(script => script.position === 'head'),
      'body-start': activeScripts.filter(script => script.position === 'body-start'),
      'body-end': activeScripts.filter(script => script.position === 'body-end')
    }
    
    return NextResponse.json(groupedScripts)
  } catch (error) {
    console.error('GET active ad scripts error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve active ad scripts' },
      { status: 500 }
    )
  }
}