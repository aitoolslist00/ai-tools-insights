robocopy "f:\my work\programming\vercel\ai-tools-update" "F:\temp-repo-clone" /E /XD "node_modules" ".git" "dist" ".astro" ".vscode" "-p" /XF "copy.ps1" "copy_files.py" "temp-copy.bat" "copy-to-repo.ps1" /R:1 /W:1 /NP /NFL /NDL
if ($LASTEXITCODE -le 7) { $LASTEXITCODE = 0 }
Write-Host "Files copied successfully"
