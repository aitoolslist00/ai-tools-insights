$ErrorActionPreference = "Stop"
$src = "f:\my work\programming\vercel\ai-tools-update"
$dst = "F:\temp-repo-clone"
$exclude = @('node_modules', '.git', 'dist', '.astro', '.vscode', '-p', '__pycache__')
$excludeFiles = @('*.py', '*.bat', '*.ps1', 'xcopy-exclude.txt')

Write-Host "Starting copy from $src to $dst..."
$copied = 0

Get-ChildItem -Path $src -Recurse -Force -ErrorAction SilentlyContinue | ForEach-Object {
    $relPath = $_.FullName.Substring($src.Length + 1)
    $skip = $false
    
    foreach ($ex in $exclude) {
        if ($relPath -like "*\$ex\*" -or $relPath -like "$ex\*" -or $relPath -eq $ex) {
            $skip = $true
            break
        }
    }
    
    if (-not $skip -and -not $_.PSIsContainer) {
        foreach ($pattern in $excludeFiles) {
            if ($_.Name -like $pattern) {
                $skip = $true
                break
            }
        }
    }
    
    if (-not $skip) {
        $destPath = Join-Path $dst $relPath
        
        if ($_.PSIsContainer) {
            if (-not (Test-Path $destPath)) {
                New-Item -ItemType Directory -Path $destPath -Force | Out-Null
            }
        } else {
            $parentDir = Split-Path $destPath -Parent
            if (-not (Test-Path $parentDir)) {
                New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
            }
            Copy-Item -Path $_.FullName -Destination $destPath -Force
            $copied++
        }
    }
}

Write-Host "Copied $copied files"
$fileCount = (Get-ChildItem -Path $dst -Recurse -File | Measure-Object).Count
Write-Host "Total files in destination: $fileCount"
