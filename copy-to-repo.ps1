$src = "f:\my work\programming\vercel\ai-tools-update"
$dst = "F:\temp-repo-clone"
$exclude = @('node_modules', '.git', 'dist', '.astro', '.vscode', 'copy_files.py', 'temp-copy.bat', 'copy-to-repo.ps1', '-p')

Write-Host "Copying from $src to $dst..."
$copied = 0

Get-ChildItem -Path $src -Recurse -Force | ForEach-Object {
    $relativePath = $_.FullName.Substring($src.Length)
    $shouldExclude = $false
    
    foreach ($ex in $exclude) {
        if ($relativePath -like "*\$ex\*" -or $relativePath -like "*\$ex" -or $relativePath -eq "\$ex") {
            $shouldExclude = $true
            break
        }
    }
    
    if (-not $shouldExclude) {
        $destPath = Join-Path $dst $relativePath
        
        if ($_.PSIsContainer) {
            if (!(Test-Path $destPath)) {
                New-Item -ItemType Directory -Path $destPath -Force | Out-Null
            }
        }
        else {
            $destDir = Split-Path $destPath -Parent
            if (!(Test-Path $destDir)) {
                New-Item -ItemType Directory -Path $destDir -Force | Out-Null
            }
            Copy-Item $_.FullName -Destination $destPath -Force
            $copied++
            if ($copied % 100 -eq 0) {
                Write-Host "Copied $copied files..."
            }
        }
    }
}

Write-Host "Copy complete! $copied files copied."
Write-Host "`nSample files in destination:"
Get-ChildItem $dst -File | Select-Object -First 10 Name | ForEach-Object { Write-Host "  - $($_.Name)" }
