#!/usr/bin/env node

/**
 * Fix Domain Consistency Issues
 * Replace all instances of aitoolslist.com with aitoolsinsights.com
 */

const fs = require('fs')
const path = require('path')

class DomainFixer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..')
    this.filesFixed = 0
    this.replacements = 0
  }

  async fixDomains() {
    console.log('🔧 Fixing domain consistency issues...\n')

    const files = this.getReactFiles()
    
    for (const file of files) {
      await this.fixFileContent(file)
    }

    console.log(`\n✅ Fixed ${this.replacements} domain references in ${this.filesFixed} files`)
  }

  async fixFileContent(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const originalContent = content
      
      // Replace all instances of aitoolslist.com with aitoolsinsights.com
      const newContent = content.replace(/aitoolslist\.com/g, 'aitoolsinsights.com')
      
      if (newContent !== originalContent) {
        fs.writeFileSync(filePath, newContent, 'utf8')
        const matches = (originalContent.match(/aitoolslist\.com/g) || []).length
        this.replacements += matches
        this.filesFixed++
        console.log(`✅ Fixed ${matches} instances in ${path.relative(this.projectRoot, filePath)}`)
      }
    } catch (error) {
      console.error(`❌ Error fixing ${filePath}:`, error.message)
    }
  }

  getReactFiles() {
    const files = []
    const searchDirs = ['app', 'components', 'lib']
    
    searchDirs.forEach(dir => {
      const fullDir = path.join(this.projectRoot, dir)
      if (fs.existsSync(fullDir)) {
        const dirFiles = this.getAllFiles(fullDir, ['.tsx', '.ts', '.js', '.jsx'])
        files.push(...dirFiles)
      }
    })
    
    return files
  }

  getAllFiles(dir, extensions) {
    const files = []
    const items = fs.readdirSync(dir)
    
    items.forEach(item => {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        files.push(...this.getAllFiles(fullPath, extensions))
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath)
      }
    })
    
    return files
  }
}

// Run the fixer
const fixer = new DomainFixer()
fixer.fixDomains().catch(console.error)