const fs = require('fs');
const path = require('path');

const src = 'f:\\my work\\programming\\vercel\\ai-tools-update';
const dst = 'F:\\temp-repo-clone';

const excludeDirs = new Set(['.git', 'node_modules', 'dist', '.astro', '.vscode', '__pycache__', '-p']);
const excludeFiles = new Set(['copy-files.js', 'copy_files.py', 'temp-copy.bat', 'copy-to-repo.ps1', 'copy.ps1']);

function copyRecursive(srcPath, dstPath) {
    const entries = fs.readdirSync(srcPath, { withFileTypes: true });
    let copied = 0;

    for (const entry of entries) {
        if (excludeDirs.has(entry.name) || excludeFiles.has(entry.name)) {
            continue;
        }

        const srcFile = path.join(srcPath, entry.name);
        const dstFile = path.join(dstPath, entry.name);

        if (entry.isDirectory()) {
            if (!fs.existsSync(dstFile)) {
                fs.mkdirSync(dstFile, { recursive: true });
            }
            copied += copyRecursive(srcFile, dstFile);
        } else {
            fs.copyFileSync(srcFile, dstFile);
            copied++;
            if (copied % 100 === 0) {
                console.log(`Copied ${copied} files...`);
            }
        }
    }

    return copied;
}

console.log(`Copying from ${src} to ${dst}...`);
const totalCopied = copyRecursive(src, dst);
console.log(`\nCopy complete! ${totalCopied} files copied.`);

// List sample files
const files = fs.readdirSync(dst).slice(0, 10);
console.log('\nSample files in destination:');
files.forEach(f => console.log(`  - ${f}`));
